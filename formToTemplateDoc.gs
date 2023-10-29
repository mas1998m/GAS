const TEMPLATE_DOC_ID = "1ks4OLkUyyyHUCE3pkGNkMqn1RhnA1opKF4jJIn10J_E";
const DESTINATION_FOLDER_ID = "1FTneMC-ljS6SKdLdINMawz0Hiw19pw36";

function onSubmit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var values = e.values;

  const googleDocTemplate = DriveApp.getFileById(TEMPLATE_DOC_ID);
  const destinationFolder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
  const copy = googleDocTemplate.makeCopy(
    "Row_" + e.range.getRow(),
    destinationFolder
  );

  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  body.replaceText("{{Property Address}}", values[1]);
  body.replaceText("{{EMD}}", "To Be Determined");
  body.replaceText("{{Seller Name}}", values[2]);
  body.replaceText("{{Buyer Name}}", values[3]);
  body.replaceText("{{Creative Purchase Price}}", values[4]);
  body.replaceText("{{Down Payment}}", values[5]);
  body.replaceText("{{Interest Rate}}", values[6]);
  body.replaceText("{{Monthly Payment}}", values[7]);
  body.replaceText("{{Term}}", values[8]);

  doc.saveAndClose();

  var theBlob = copy.getBlob().getAs("application/pdf");
  var newPDFFile = destinationFolder.createFile(theBlob);

  var fileName = copy.getName().replace(".", "");
  newPDFFile.setName(fileName + ".pdf");
}

function testOnSubmit() {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var values = e.values;

  const googleDocTemplate = DriveApp.getFileById(TEMPLATE_DOC_ID);
  const destinationFolder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
  const copy = googleDocTemplate.makeCopy(
    "Employee Details",
    destinationFolder
  );

  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  body.replaceText("{{Property Address}}", "changed");
  body.replaceText("{{EMD}}", "changed");
  body.replaceText("{{Seller Name}}", "changed");
  body.replaceText("{{Buyer Name}}", "changed");
  body.replaceText("{{Creative Purchase Price}}", "changed");
  body.replaceText("{{Down Payment}}", "changed");
  body.replaceText("{{Interest Rate}}", "changed");
  body.replaceText("{{Monthly Payment}}", "changed");
  body.replaceText("{{Term}}", "changed");

  doc.saveAndClose();
}
