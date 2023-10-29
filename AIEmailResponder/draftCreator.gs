function createDraftEmailToApplicant(applicantEmail, applicantName, resumeReplyBody) {
    try {
      var subject = APPLICATION_EMAIL_SUBJECT;
      var greeting = "Hi " + applicantName + ",";
      var htmlBody = greeting + "<br><br>" + resumeReplyBody;
  
      // Create the draft email
      var draft = GmailApp.createDraft(applicantEmail, subject, "", {
        htmlBody: htmlBody
      });
  
      Logger.log("Draft email created for " + applicantEmail);
    } catch (e) {
      Logger.log("An error occurred: " + e.toString());
    }
  }
  
  
  function createDraftEmailToCustomer(customerEmail, answerBody) {
    try {
      var subject = INQUIRY_EMAIL_SUBJECT;
      var htmlBody = answerBody;
  
      // Create the draft email
      var draft = GmailApp.createDraft(customerEmail, subject, "", {
        htmlBody: htmlBody
      });
  
      Logger.log("Draft email created for " + customerEmail);
    } catch (e) {
      Logger.log("An error occurred: " + e.toString());
    }
  }
  
  