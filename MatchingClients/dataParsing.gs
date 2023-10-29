function getRawData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_DATA_NAME);
    var data = sheet.getDataRange().getValues();
    
    var requestRow = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === SECTION_START_COL_A_TEXT) {
        requestRow = i + 2; // Add 2 to get the row below "Request"
        break;
      }
    }
  
    if (requestRow !== -1) {
      var numRows = data.length - requestRow + 1;
      var numCols = data[0].length;
      var range = sheet.getRange(requestRow, 1, numRows, numCols);
      var finalData = range.getValues();
      for (var i = 0; i < finalData.length; i++) {
        finalData[i].push(i +requestRow); // Add row number to the end of each row
      }
      return finalData;
    } else {
      Logger.log("No 'Request' found.");
      return "No 'Request' found.";
    }
  }
  
  function compareDates(a, b) {
    // Extract date strings at index 16
    var dateA = new Date(a[DATA_TIMESTAMP_COL_NR-1]);
    var dateB = new Date(b[DATA_TIMESTAMP_COL_NR-1]);
  
    // Compare the dates
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  }
  
  function compareDistances(a,b){
    var distanceA = a[INTERSECTION_DATA_DISTANCE_VALUE_INDEX];
    var distanceB = b[INTERSECTION_DATA_DISTANCE_VALUE_INDEX];
  
    // Compare the dates
    if (distanceA < distanceB) {
      return -1;
    } else if (distanceA > distanceB) {
      return 1;
    } else {
      return 0;
    }
  }
  
  function dataFilter(data){
    var filteredArray = data.filter(function(subarray) {
      return subarray[0] === "" && subarray[DATA_SCREEN_1_AGE_COL_NR-1] != "" && subarray[DATA_SCREEN_2_LOCATION_COL_NR-1] != "" && subarray[DATA_SCREEN_3_COL_NR-1] != "" ;
    });
    return filteredArray;
  }
  
  
  function dataSort(data){
    data.sort(compareDates);
    return data;
  }
  
  
  
  