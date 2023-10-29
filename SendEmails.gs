function sendEmails(){

  //getting date to create doc with this name
  const monthNames = ["January", "February", "March","April","May","June","July", "August","September" , "October", "November","December"];
  var month = new Date().getMonth();
  var year =  new Date().getYear() + 1900;
  var docName = monthNames[month] + " " + year;


  // creating new google doc
  var doc = DocumentApp.create(docName);
  var body = doc.getBody();
  body.appendParagraph("Logs of script executed on "+ Date().toString());
  body.appendParagraph("");

  //getting the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var data = sheet.getDataRange().getValues();
  // get the months row and headers row
  var monthsHeader = data[0];
  var headers = data[1];
  
  // Find the column index of email and name
  var emailColumn = headers.indexOf("Owner_");
  var balanceColumn = monthsHeader.length-2;
  
  for (var i = 2; i < data.length; i++) {
    var row = data[i];
    var emailAddress = row[emailColumn];
    if(emailAddress != ""){
      emailAddress += "@gmail.com"
    }
    var balance = row[balanceColumn]
    var subject = "Hello";
    var message = "your expense for this month is " + Math.ceil(balance);

    if(emailAddress== ""){
      Logger.log('The row number '+ (i+1) + " is empty and doesn't have email");
      body.appendParagraph('The row number '+ (i+1) + " is empty and doesn't have an email");
    }
    else if(balance >=1000){
      //Logger.log("An email is sent to " + emailAddress);
      //body.appendParagraph("An email is sent to "+ emailAddress);
      MailApp.sendEmail(emailAddress, subject, message);
    }

    
    // Pause for a moment to avoid overloading the email server (optional)
    Utilities.sleep(50);
  }
  doc.saveAndClose();
  Logger.log('New Google Doc created: ' + doc.getUrl());

}