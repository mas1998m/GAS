const USER_MSG_NO_ATTACHMENTS = "No Attachments in this file";
const FOLDER_NAME = "Folder Name";

const BTN_CHECK_FOLDER = "Search";
const BTN_CREATE_FOLDER = "Create Folder";
const BTN_SUBMIT_DOCS = "Export Attachments";

const MSG_FOLDER_EXISTS = "Folder Found";
const MSG_FOLDER_DOESNT_EXIST = "Folder Not Found";

const MSG_EXPORT_SUCCESS = "Export Done Successfully";
const MSG_EXPORT_FAILURE = "Export Failed";

const DOCS_DESCRIPTION_HEADER = "Instructions:";
const DOCS_DESCRIPTION_TEXT = [
  "After you have screened the documents:",
  "1. Write the folder name to save the documents to",
  "2. Check if the folder exists.",
  "3. If the folder doesn’t exist, a new folder can be created",
  "4. Select the types for the documents you want to upload",
  "5. Click Export Attachments",
];

const PEOPLE_FOLDER_MAIN = "First";
const PEOPLE_FOLDER_SUB = "Second";
const PEOPLE_FOLDER_SUB_ID = "1aD2LZtwByr68pAFljaXmi1BfAEChn3mP";

const MSG_FOLDER_CREATED_OK = "Folder Created Successfully";
const MSG_FOLDER_CREATED_NOT_OK = "Failed To create the folder";

const DOC_SHEET_ID = "";

const SUBMITTED_DOCS_TAB_NAME_1 = "first";
const SUBMITTED_DOCS_TAB_NAME_2 = "second";

const SUBMITTED_DOCS_EMAIL_COL_NR_1 = 0;
const SUBMITTED_DOCS_EMAIL_COL_NR_2 = 0;

const TAB_MAPPING_1 = [
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32, 35, 36,
];
const TAB_MAPPING_2 = [
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 36, 39, 40, 43, 44,
];

const SUBMITTED_DOC_VALUE = "Updated";
const TEMP_STRING = "Matched";

const MSG_DOC_UPLOAD_NOT_OK = "Failed to export the attachments";
const MSG_DOC_UPLOAD_BUT_NOT_STATUS =
  "Attachments exported successfully, but status not updated";
const MSG_DOC_UPLOAD_OK = "Attachments exported successfully";

const MSG_SEND_EMAIL = "MSG Send Email";
const MSG_REPLY_SENT = "MSG Reply Sent";
const BTN_OK = "Ok";

const CATEGORIES_NUMBER = 15;
const DOC_LIST = [
  "Work",
  "Sport",
  "Economy",
  "News",
  "Politics",
  "Cinema",
  "Tech",
  "Science",
  "Social",
  "Health",
  "Placeholder 1",
  "Placeholder 2",
  "Placeholder 3",
  "Placeholder 4",
  "Placeholder 5",
];

function homeCardBuilder(
  e,
  fields,
  isFound,
  button,
  createSuccess,
  exportSuccess
) {
  if (typeof e === "undefined") {
    let noAttachmentCard = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle(USER_MSG_NO_ATTACHMENTS))
      .build();
    return noAttachmentCard;
  }

  let searchAction =
    CardService.newAction().setFunctionName("searchDriveFolder");
  let createAction = CardService.newAction().setFunctionName("createFolder");
  let exportAction =
    CardService.newAction().setFunctionName("ExportAttachments");

  let instructionSection = CardService.newCardSection();
  let searchSection = CardService.newCardSection();
  let selectionSection = CardService.newCardSection();

  let checkboxGroups = [];

  let email = GmailApp.getMessageById(e.gmail.messageId);
  let attachments = email.getAttachments();

  instructionSection.setHeader(DOCS_DESCRIPTION_HEADER);
  instructionText = DOCS_DESCRIPTION_TEXT.join("\n");
  instructionSection.addWidget(
    CardService.newDecoratedText().setText(instructionText).setWrapText(true)
  );

  searchSection.addWidget(
    CardService.newTextInput()
      .setFieldName("folder_name")
      .setTitle(FOLDER_NAME)
      .setValue(typeof fields === "undefined" ? "" : fields)
  );

  searchSection.addWidget(
    CardService.newTextButton()
      .setOnClickAction(searchAction)
      .setText(BTN_CHECK_FOLDER)
  );

  searchSection.addWidget(
    CardService.newTextButton()
      .setOnClickAction(createAction)
      .setText(BTN_CREATE_FOLDER)
  );

  if (typeof createSuccess !== "undefined") {
    searchSection.addWidget(
      CardService.newDecoratedText()
        .setText(
          createSuccess ? MSG_FOLDER_CREATED_OK : MSG_FOLDER_CREATED_NOT_OK
        )
        .setTopLabel("Creation Result:")
        .setWrapText(true)
    );
  }

  if (typeof isFound !== "undefined") {
    searchSection.addWidget(
      CardService.newDecoratedText()
        .setText(isFound ? MSG_FOLDER_EXISTS : MSG_FOLDER_DOESNT_EXIST)
        .setTopLabel("Search Result:")
        .setWrapText(true)
    );
  }
  searchSection.setHeader("Search folder on drive");

  for (let i = 0; i < CATEGORIES_NUMBER; i++) {
    let checkboxGroup = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle(DOC_LIST[i])
      .setFieldName("Category" + i);

    for (let j = 0; j < attachments.length; j++) {
      checkboxGroup.addItem(attachments[j].getName(), Math.floor(j), false);
    }
    checkboxGroups.push(checkboxGroup);
  }

  let downloadButton = CardService.newTextButton()
    .setOnClickAction(exportAction)
    .setText(BTN_SUBMIT_DOCS)
    .setDisabled(!button);

  for (let i = 0; i < CATEGORIES_NUMBER; i++) {
    selectionSection.addWidget(checkboxGroups[i]);
  }

  selectionSection.addWidget(downloadButton);

  if (typeof exportSuccess !== "undefined") {
    selectionSection.addWidget(
      CardService.newDecoratedText()
        .setText(exportSuccess ? MSG_EXPORT_SUCCESS : MSG_EXPORT_FAILURE)
        .setTopLabel("Export Result:")
        .setWrapText(true)
    );
  }
  selectionSection.setHeader("Select Attachments");

  let homeCard = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader())
    .addSection(instructionSection)
    .addSection(searchSection)
    .addSection(selectionSection)
    .build();
  return homeCard;
}

function onGmailMessageOpen(e) {
  let accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  let email = GmailApp.getMessageById(e.gmail.messageId);
  let attachments = email.getAttachments();

  let foundAttachment = attachments.length;
  if (foundAttachment) {
    return [
      homeCardBuilder(e, undefined, undefined, false, undefined, undefined),
    ];
  } else {
    return [
      homeCardBuilder(
        undefined,
        undefined,
        undefined,
        false,
        undefined,
        undefined
      ),
    ];
  }
}

function searchDriveFolder(e) {
  let folder_name = e.formInput.folder_name;
  let folders = DriveApp.getFoldersByName(folder_name);
  let folder = null;

  if (folders.hasNext()) {
    folder = folders.next();
  }
  if (folder) {
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().updateCard(
          homeCardBuilder(
            e,
            folder_name,
            true,
            true,
            undefined,
            undefined,
            undefined
          )
        )
      )
      .build();
  } else {
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().updateCard(
          homeCardBuilder(
            e,
            folder_name,
            false,
            false,
            undefined,
            undefined,
            undefined
          )
        )
      )
      .build();
  }
}

function createFolder(e) {
  let folder_name = e.formInput.folder_name;

  let folders = DriveApp.getFoldersByName(PEOPLE_FOLDER_SUB);
  let folder = null;

  if (folders.hasNext()) {
    folder = folders.next();
  }
  if (folder) {
    folder.createFolder(folder_name);
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().updateCard(
          homeCardBuilder(e, folder_name, undefined, true, true, undefined)
        )
      )
      .build();
  } else {
    return CardService.newActionResponseBuilder()
      .setNavigation(
        CardService.newNavigation().updateCard(
          homeCardBuilder(e, folder_name, undefined, false, false, undefined)
        )
      )
      .build();
  }
}

function ExportAttachments(e) {
  let email = GmailApp.getMessageById(e.gmail.messageId);
  let attachments = email.getAttachments();
  let sender = email.getFrom().split("<")[1].split(">")[0];

  let folder_name = e.formInput.folder_name;
  let selectedAttachments = [];
  let attachmentsLabels = [];

  let okAction = CardService.newAction().setFunctionName("okButton");
  let yesAction = CardService.newAction().setFunctionName("yesButton");
  let noAction = CardService.newAction().setFunctionName("noButton");

  let okBtn = CardService.newTextButton()
    .setOnClickAction(okAction)
    .setText(BTN_OK);

  let yesBtn = CardService.newTextButton()
    .setOnClickAction(yesAction)
    .setText("Yes");

  let noBtn = CardService.newTextButton()
    .setOnClickAction(noAction)
    .setText("No");

  for (let key in e.formInputs) {
    if (key.startsWith("Category")) {
      let attach = attachments[Math.floor(e.formInputs[key][0])];
      let name = DOC_LIST[parseInt(key.slice(-1))] + "-" + folder_name;
      attach.setName(name);
      attachmentsLabels.push(name);
      selectedAttachments.push(attach.copyBlob());
    }
  }
  let folders = DriveApp.getFoldersByName(folder_name);
  let folder = null;

  if (folders.hasNext()) {
    folder = folders.next();
  }

  if (folder) {
    for (let i = 0; i < selectedAttachments.length; i++) {
      folder.createFile(selectedAttachments[i]);
    }

    let status = updateDocStatus(attachmentsLabels, sender);
    if (status) {
      let resultSection = CardService.newCardSection();
      resultSection.addWidget(
        CardService.newDecoratedText()
          .setText(MSG_SEND_EMAIL)
          .setTopLabel("Export Result:")
          .setWrapText(true)
      );
      resultSection.addWidget(yesBtn);
      resultSection.addWidget(noBtn);

      let resultCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader())
        .addSection(resultSection)
        .build();
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard))
        .build();
    } else {
      let resultSection = CardService.newCardSection();
      resultSection.addWidget(
        CardService.newDecoratedText()
          .setText(MSG_DOC_UPLOAD_BUT_NOT_STATUS)
          .setTopLabel("Export Result:")
          .setWrapText(true)
      );

      resultSection.addWidget(okBtn);

      let resultCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader())
        .addSection(resultSection)
        .build();
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(resultCard))
        .build();
    }
  } else {
    let resultSection = CardService.newCardSection();
    resultSection.addWidget(
      CardService.newDecoratedText()
        .setText(MSG_DOC_UPLOAD_NOT_OK)
        .setTopLabel("Export Result:")
        .setWrapText(true)
    );
    resultSection.addWidget(okBtn);

    let resultCard = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader())
      .addSection(resultSection)
      .build();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(resultCard))
      .build();
  }
}

function okButton(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}

function yesButton(e) {
  console.log("send email");

  let okAction = CardService.newAction().setFunctionName("okButton");

  let okBtn = CardService.newTextButton()
    .setOnClickAction(okAction)
    .setText(BTN_OK);

  let resultSection = CardService.newCardSection();
  resultSection.addWidget(
    CardService.newDecoratedText()
      .setText(MSG_REPLY_SENT)
      .setTopLabel("Message Action Result:")
      .setWrapText(true)
  );
  resultSection.addWidget(okBtn);

  let resultCard = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader())
    .addSection(resultSection)
    .build();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(resultCard))
    .build();
}

function noButton(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}

function findRowByEmail(data, email, emailColumn) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][emailColumn] == email) {
      return i; // Return the row number (adding 1 because arrays are zero-based)
    }
  }
  return -1; // Return -1 if no match is found
}

function updateDocStatus(labels, senderEmail) {
  let sheet = SpreadsheetApp.openById(DOC_SHEET_ID);

  var fieldsToUpdate = labels;
  var columnIndicesToUpdate = [];

  // Get the sheets by their names
  let sheet1 = sheet.getSheetByName(SUBMITTED_DOCS_TAB_NAME_1);
  let sheet2 = sheet.getSheetByName(SUBMITTED_DOCS_TAB_NAME_2);

  // Find a match for the email address in the specified columns
  let data1 = sheet1.getDataRange().getValues();
  let data2 = sheet2.getDataRange().getValues();

  let headerRow1 = sheet1
    .getRange(1, 1, 1, sheet1.getLastColumn())
    .getValues()[0];
  let headerRow2 = sheet2
    .getRange(1, 1, 1, sheet2.getLastColumn())
    .getValues()[0];

  let rowNumber1 = findRowByEmail(
    data1,
    senderEmail,
    SUBMITTED_DOCS_EMAIL_COL_NR_1
  );
  let rowNumber2 = findRowByEmail(
    data2,
    senderEmail,
    SUBMITTED_DOCS_EMAIL_COL_NR_2
  );

  if (rowNumber1 != -1) {
    // Find the column indices of the fields to update
    for (let i = 0; i < fieldsToUpdate.length; i++) {
      let columnIndex = headerRow1.indexOf(fieldsToUpdate[i]); // Add 1 for 1-based index
      if (columnIndex > 0) {
        columnIndicesToUpdate.push(columnIndex);
      }
    }
    for (var i = 0; i < columnIndicesToUpdate.length; i++) {
      var columnIndex = columnIndicesToUpdate[i];
      sheet1
        .getRange(rowNumber1, columnIndex + 1)
        .setValue(SUBMITTED_DOC_VALUE);
    }
    return TEMP_STRING;
  } else if (rowNumber2 != -1) {
    for (let i = 0; i < fieldsToUpdate.length; i++) {
      let columnIndex = headerRow2.indexOf(fieldsToUpdate[i]); // Add 1 for 1-based index
      if (columnIndex > 0) {
        columnIndicesToUpdate.push(columnIndex);
      }
    }
    for (var i = 0; i < columnIndicesToUpdate.length; i++) {
      var columnIndex = columnIndicesToUpdate[i];
      sheet2
        .getRange(rowNumber2, columnIndex + 1)
        .setValue(SUBMITTED_DOC_VALUE);
    }
    return TEMP_STRING;
  }
  return false;
}
