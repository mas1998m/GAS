const EMAIL_SUBJECT_FILTER = "New ONLINE Reservation from";
const SHEET_LINK = "https://docs.google.com/spreadsheets/d/1FmTmS2eMvtwGJCgdWrTSAKzbPTUHNvb_OtgL88rIv08/edit?usp=sharing";

const CHECKING_WINDOW_IN_MINS =  100 * 60;


function containsLabel(thread){
  var labels = thread.getLabels();
  for(var i =0;i<labels.length;i++){
    if(labels[i].getName() == "proccessed"){
      return true;
    }
  }
  return false;
}

function checkMails() {
  var proccessedThreadsCount = 0;
  var proccessedEmailsCount = 0;
  var labelObject = GmailApp.getUserLabelByName("proccessed");
  if(labelObject == null){
    labelObject = GmailApp.createLabel("proccessed");
  }

  var threads = GmailApp.getInboxThreads();
  var checkingWindow = new Date();
  checkingWindow.setMinutes(checkingWindow.getMinutes() - CHECKING_WINDOW_IN_MINS);


  for (var i = 0; i < threads.length; i++) {
    proccessedThreadsCount++;
    var messages = threads[i].getMessages();
    var lastReceivedDate = threads[i].getLastMessageDate();
    if (lastReceivedDate < checkingWindow)
        break; //abort for this thread

    for (var j = 0; j < messages.length; j++) {
      proccessedEmailsCount++;
      var message = messages[j];
      var receivedDate = message.getDate();

      // Check if the email was received within the checkingWindow
      if (receivedDate < checkingWindow)
        break; //abort for this thread -- all the other emails in thread is older than current one (thread is sorted in chronological order with most recent first)

      
      if (message.getSubject().indexOf(EMAIL_SUBJECT_FILTER) != -1 && !containsLabel(threads[i])) {
        threads[i].addLabel(labelObject);
        downloadAndReply(message);
        count++;
      }

    }
  }
  // Logger.log("Number of Proccessed Threads:" + proccessedThreadsCount);
  // Logger.log("Number of Proccessed Emails:" + proccessedEmailsCount);

}


function downloadAndReply(message){
  var body = message.getPlainBody();
  var subject = message.getSubject();
  var data = extractKeyValuePairs(body);

  var spreadSheet = SpreadsheetApp.openByUrl(SHEET_LINK);
  var sheet = spreadSheet.getActiveSheet();

  var dataArray = [];
  dataArray.push(data["Created"]);
  dataArray.push(data["Date"]);
  dataArray.push(data["Start"]);
  dataArray.push(data["Worker"]);
  dataArray.push(data["Service"]);
  dataArray.push(data["Name"]);
  dataArray.push(data["Phone"]);
  dataArray.push(data["Email"]);
  dataArray.push(data["Date of Birth"]);
  dataArray.push(data["Insurance"]);
  dataArray.push(data["Vision Plan"]);

  var lastRow = sheet.getLastRow();
  if (lastRow > 0) {
    var values = sheet.getRange(lastRow, 1, 1, dataArray.length).getValues()[0];
    var isEmpty = values.every(function (value) {
      return value === "";
    });
    if (!isEmpty) {
      lastRow += 1;
    }
  } else {
    lastRow = 1;
  }

  // Insert the array into the last empty row.
  sheet.getRange(lastRow, 1, 1, dataArray.length).setValues([dataArray]);

}



