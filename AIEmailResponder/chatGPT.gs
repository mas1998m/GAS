function chatGPTAsisstant(emailBody) {

    var apiUrl = "https://api.openai.com/v1/chat/completions";
  
    //emailBody = "loved what you did with this project, it is awesome , we are intersted in letting you develop our website, shoot me a message when you get a chance";
  
    var token = "";
  
    var payload = {
      "model": "gpt-3.5-turbo-16k",
      "messages": [
        {
          "role": "system",
          "content": "You are a business development representative that replies to inbound emails in an optimal way. Your goals are to analyze emails and output a JSON with the keys salesInquiry and service, strategy. The firm's services are:Buy with check-out link: A. Logo Design B. Landing Pages and Websites C. Investor Readiness Assessment Need sales call: D. UI/UX Design E. Tech Strategy Consulting F. App Development G. AI Strategy and Integration H. Other services You should: 1. Figure out if the email is about the firm's services or not - i.e. if this is an email for you to answer. Add this as a salesInquiry: true/false key/value pair in a JSON. If false, return the JSON with null for the other values. 2. Check which of the services is most suitable. Add the service letter to the output JSON, so e.g. service:B if it's about landing pages or websites. 3. Figure out if a check-out link should be added to the email, so that the service can be purchased directly online (only applicable for services A-C, so never suggest this strategy for the other services) or if a sales call is needed. Return 'buy directly' or 'sales call' for the 'strategy' JSON key. You will receive an email text as input and should only reply with the output JSON."
        },
        {
          "role": "user",
          "content": emailBody
        }
      ],
      "temperature": 0.5
    };
  
    var payloadString = JSON.stringify(payload);
  
    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": {
        "Authorization": "Bearer " + token
      },
      "payload": payloadString
    };
  
    var response = UrlFetchApp.fetch(apiUrl, options);
  
    var responseData = JSON.parse(response.getContentText());
    responseData = responseData.choices[0].message.content;
  
  
    const cleanedResponse = responseData.replace(/\\/g, '');
    var analysis = JSON.parse(cleanedResponse);
    return analysis;
  }
   
  