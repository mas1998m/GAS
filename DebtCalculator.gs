// Source: https://github.com/choraria/google-apps-script/blob/master/Sheets/Webhooks/GET.gs

const documentProperties = PropertiesService.getDocumentProperties();
let ok200Status = "%200OKSTATUS%"; // replace '%200OKSTATUS%' from the add-on to either `true` or `false` (boolean)
let logTimeStamp = "%LOGTIMESTAMP%"; // replace '%LOGTIMESTAMP%' from the add-on to either `true` or `false` (boolean)
let CONVERSION_FILE_URL =
  "https://docs.google.com/spreadsheets/d/1SEEdAXQd9CL2LyMoEJI0wj9JL_h5NSiWnpOi16lKtlI/edit?usp=sharing";

function doGet(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(28000);
  } catch (e) {
    response = {
      status: "error",
      message: "Request throttled",
    };
    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  }

  let params = e.parameters;
  let rate = SpreadsheetApp.openByUrl(CONVERSION_FILE_URL)
    .getSheets()[0]
    .getRange("A1")
    .getValue();

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = activeSpreadsheet.getSheets()[0];

  let keys = Object.keys(params);
  let response = {};

  if (keys.length > 0) {
    let cartesianData = cartesian(params);
    if (cartesianData[0]["curr"] == "eu") {
      cartesianData[0]["Net Balance in usd"] =
        cartesianData[0]["Net Balance in usd"] * rate;
    }
    cartesianData[0]["Net Balance in usd"] = parseFloat(
      cartesianData[0]["Net Balance in usd"]
    ).toFixed(3);

    let headers = activeSheet.getDataRange().offset(0, 0, 1).getValues()[0];
    let data = activeSheet.getDataRange().getValues();

    let rowData = [];
    cartesianData.forEach((rowLevelData) =>
      [rowLevelData].map((row) =>
        rowData.push(headers.map((key) => row[String(key)] || ""))
      )
    );
    cartesianData = cartesianData[0];

    let newBalance;
    let found = false;
    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      if (row[2].toString() == rowData[0][2]) {
        // Update the row with new data from the JSON

        if (
          cartesianData["Net Balance in usd"] == 0 &&
          cartesianData["curr"] != "undo"
        ) {
          newBalance = row[1];
          found = true;
          break;
        }

        if (cartesianData["curr"] == "undo") {
          let fileId = row[3];
          var spreadsheet = SpreadsheetApp.openById(fileId);
          var sheet = spreadsheet.getSheets()[0]; // Get the first sheet
          var lastRow = sheet.getLastRow();
          if (lastRow > 1) {
            var lastOperation = sheet
              .getRange(lastRow, 1, 1, sheet.getLastColumn())
              .getValues()[0][0];
            newBalance = parseFloat(row[1]) - parseFloat(lastOperation);
            //newBalance = 5555555;
            row[1] = newBalance;
            activeSheet.getRange(i + 1, 1, 1, row.length).setValues([row]); // i + 1 to adjust for header row
            sheet.deleteRow(lastRow);
          }
          found = true;
          break;
        }

        row[1] = parseFloat(row[1]) + parseFloat(rowData[0][1]);
        newBalance = row[1];
        activeSheet.getRange(i + 1, 1, 1, row.length).setValues([row]); // i + 1 to adjust for header row

        let fileId = row[3];
        var spreadsheet = SpreadsheetApp.openById(fileId);
        var sheet = spreadsheet.getSheets()[0]; // Get the first sheet

        sheet.appendRow([
          parseFloat(cartesianData["Net Balance in usd"]),
          parseFloat(newBalance),
          Date().toString(),
        ]);
        found = true;
        break;
      }
    }
    if (!found) {
      var spreadsheet = SpreadsheetApp.create(rowData[0][0]); // Replace 'New Spreadsheet' with your desired name
      var fileId = spreadsheet.getId();
      var file = DriveApp.getFileById(fileId);
      var folder = DriveApp.getFoldersByName("Customers");
      if (!folder.hasNext()) {
        folder = DriveApp.createFolder("Customers");
      } else {
        folder = folder.next();
      }
      file.moveTo(folder);
      var sheet = spreadsheet.getSheets()[0]; // Get the first sheet

      var newHeaders = ["Transaction Value", "Net Balance", "Date"];
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
      sheet
        .getRange(2, 1, 1, 3)
        .setValues([
          [
            parseFloat(cartesianData["Net Balance in usd"]),
            parseFloat(cartesianData["Net Balance in usd"]),
            Date().toString(),
          ],
        ]);

      rowData[0][2] = rowData[0][2].toString();
      rowData[0][3] = fileId;
      activeSheet
        .getRange(
          activeSheet.getLastRow() + 1,
          1,
          rowData.length,
          rowData[0].length
        )
        .setValues(rowData);
      newBalance = parseFloat(cartesianData["Net Balance in usd"]);
    }
    response = {
      status: "success",
      added: !found,
      message: newBalance,
    };
    lock.releaseLock();
    return ok200Status === true
      ? HtmlService.createHtmlOutput(
          "Data logged successfully"
        ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      : ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
          ContentService.MimeType.JSON
        );
  } else {
    response = {
      status: "success",
      message: "No parameters detected",
    };
    lock.releaseLock();
    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function cartesian(parameters) {
  let keys = Object.keys(parameters);
  let depth = Object.values(parameters).reduce(
    (product, { length }) => product * length,
    1
  );
  let result = [];
  for (let i = 0; i < depth; i++) {
    let j = i;
    let dict = {};
    for (let key of keys) {
      let size = parameters[key].length;
      dict[key] = parameters[key][j % size];
      j = Math.floor(j / size);
    }
    result.push(dict);
  }
  return result;
}