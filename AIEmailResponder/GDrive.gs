function getOrCreateFolder(folderName) {
    // Get the root folder of your Google Drive
    var rootFolder = DriveApp.getRootFolder();
    
    // Search for the folder with the given name
    var folders = rootFolder.getFoldersByName(folderName);
    
    // If the folder exists, return it; otherwise, create a new folder
    if (folders.hasNext()) {
      return folders.next();
    } else {
      return rootFolder.createFolder(folderName);
    }
  }
  
  
  function downloadFileAndSaveToDrive(fileUrl, folderName,fileName) {
    try {
      // Create or get the destination folder in Google Drive
      var folder = getOrCreateFolder(folderName);
      //fileUrl = "https://www.autosar.org/fileadmin/standards/R21-11/CP/AUTOSAR_SWS_CANTransportLayer.pdf";
  
  
      // Fetch the file content from the URL
      var response = UrlFetchApp.fetch(fileUrl);
  
      // Check if the response is successful
      if (response.getResponseCode() == 200) {
        // Convert the response to a Blob
        var fileBlob = response.getBlob();
  
        // Create a file in the destination folder with the extracted file name
        var file = folder.createFile(fileBlob);
        file.setName(fileName);
  
        Logger.log("File '" + fileName + "' downloaded and saved to folder '" + folderName + "'.");
      } else {
        Logger.log("Failed to download the file from the URL.");
      }
    } catch (e) {
      Logger.log("An error occurred: " + e.toString());
    }
  }
  
  