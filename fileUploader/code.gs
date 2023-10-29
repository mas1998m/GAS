function saveFile(e) {
    var blob = Utilities.newBlob(e.bytes, e.mimeType, e.filename);
    DriveApp.createFile(blob);
    return "Done.";
  }
  function uploadRemittance() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('upload')
        .setWidth(400)
        .setHeight(300);
  
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Upload Remittance');
  }
  
  
  // function openUploadDialog() {
  //   var htmlOutput = HtmlService.createHtmlOutputFromFile('UploadFileForm')
  //     .setWidth(400)
  //     .setHeight(300);
  //   SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Upload File');
  // }
  
  function onEdit(e){
    uploadRemittance();
  }
  
  function doGet() {
    return HtmlService.createHtmlOutputFromFile('test');
  }
  
  function doSomething() {
    Logger.log('I was called!');
  }
  
  
  function saveFileToDrive(fileBlob, fileName) {
    var blob = Utilities.newBlob(fileBlob.bytes, fileBlob.mimeType, fileBlob.filename);
  
    Logger.log("Done");
    var folder = DriveApp.getFolderById('1MdYgz2ygfXCYWFTgtsvo0FD5764kAaSP'); // Replace with your Google Drive folder ID
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();
    // return fileUrl;
  }