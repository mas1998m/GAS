function extractFormData(emailBody) {
    var textRegex = /<span style="font-size:9pt;font-family:Arial,sans-serif;color:black">(.*?)<\/span><span style="color:black">/g;
    var linksRegex =  /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  
    var match = emailBody.match(textRegex);
    var result = [];
  
    if (match && match.length >= 2) {
      // The captured value is in match[1]
      for(var i = 0;i<match.length;i++){
        var extracted = match[i].replace(/<[^>]+>/g, '');
        result.push(extracted);
      }
    }
  
    var matches = emailBody.matchAll(linksRegex);
    var count = 0;
    for (const match of matches) {
      const hrefLink = match[1];
      const nameInsideATag = match[2];
      if(count == CV_A_TAG_INDEX)
        result.push([hrefLink,nameInsideATag]);
      count++;
    }
    return result;
  }
  