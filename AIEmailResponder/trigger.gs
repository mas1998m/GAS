const EMAIL_ALIAS = "masseyam1998@gmail.com";
const CV_FILTER_TEXT = "RESUME/CV";
const RESUME_FOLDER = "Resume Folder";
const WEBSITE_FORM_1 = "testing";
const WEBSITE_FORM_2 = "testing";

const APPLICATION_EMAIL_SUBJECT = "Your Application Status";
const INQUIRY_EMAIL_SUBJECT = "Thanks for your intrest in our products"

const RESUME_REPLY_BODY = "Thank you for applying...";
const CALL_SUGGEST_EMAIL_BODY = "Thank you for your intrest in our products, for more info please don't hesistate to contact us on 19934";

const CHECKING_WINDOW_IN_MINS =  100 * 60;

const CV_A_TAG_INDEX = 1;

const FIRST_NAME_RESULT_INDEX = 0;
const EMAIL_RESULT_INDEX = 2;
const PORTFOLIO_RESULT_INDEX = 4;
const CV_RESULT_INDEX = 5;







function isNewEmailThread(thread){
  if(thread.getMessages().length == 1 && thread.getMessages()[0].isInInbox())
    return true;
  return false;
}


function checkMails() {
  var proccessedThreadsCount = 0;
  var proccessedEmailsCount = 0;

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
      var body = message.getBody();
      var receivedDate = message.getDate();

      // Check if the email was received within the checkingWindow
      if (receivedDate < checkingWindow)
        break; //abort for this thread -- all the other emails in thread is older than current one (thread is sorted in chronological order with most recent first)

      
      if (message.getTo().indexOf(EMAIL_ALIAS) !== -1 && body.indexOf(CV_FILTER_TEXT) != -1) {
        downloadAndReply(message);
      }
      else if(message.getTo().indexOf(EMAIL_ALIAS) !== -1 && (body.indexOf(WEBSITE_FORM_1) != -1 || body.indexOf(WEBSITE_FORM_2) != -1)){
        respondInquiry(message);
      }
      else if(isNewEmailThread(threads[i])){
        var message = threads[i].getMessages()[0];
        respondInquiry(message);
      }

    }
  }
  Logger.log("Number of Proccessed Threads:" + proccessedThreadsCount);
  Logger.log("Number of Proccessed Emails:" + proccessedEmailsCount);

}


function downloadAndReply(message){
  var body = message.getBody();
  var data = extractFormData(body);
  downloadFileAndSaveToDrive(data[CV_RESULT_INDEX][0],RESUME_FOLDER,data[CV_RESULT_INDEX][1]);
  createDraftEmailToApplicant(message.getFrom(),data[FIRST_NAME_RESULT_INDEX],RESUME_REPLY_BODY);
}


function respondInquiry(message){

  var analysis = chatGPTAsisstant(message.getPlainBody());
  //var analysis = chatGPTAsisstant("test");

  if(analysis.salesInquiry){
    if(analysis.strategy == "buy directly"){
      var response = productsInfo[analysis.service];
      createDraftEmailToCustomer(message.getFrom(),response);
      //createDraftEmailToCustomer("mas_seyam@yahoo.com",response);
    }else{
      createDraftEmailToCustomer(message.getFrom(),CALL_SUGGEST_EMAIL_BODY);
    }
  }
}


