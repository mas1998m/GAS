  //var  LIST_OF_LOCATIONS_TEST = ["Cairo","Madrid","Barcelona","Sevilla"];
  function constructUrlWithQueryParameters(baseUrl, queryParams) {
    var url = baseUrl;
    var isFirstParam = true;
  
    for (var key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        if (isFirstParam) {
          url += "?";
          isFirstParam = false;
        } else {
          url += "&";
        }
  
        url += encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key]);
      }
    }
    url = url.replace(/2C/g, "7C");
    return url;
  }
  
  
  
  function getDistanceMatrix(origin,destination) {
    destArray = [destination];
    originArray = [origin];
    var baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";
  
    var queryParams = {
      destinations: destArray,
      origins: originArray,
      key: MAPS_API_KEY,
      units: "imperial"
    };
  
    // Construct the full URL with query parameters
    var url = constructUrlWithQueryParameters(baseUrl, queryParams)
  
    var options = {
      method: "POST",
      contentType: "application/json",
    };
  
    // Make the HTTP POST request
    var response = UrlFetchApp.fetch(url, options);
  
    // Parse the JSON response
    var json = response.getContentText();
    var data = JSON.parse(json);
    var matrix = parseDistanceMatrix(data);
    return matrix;
  }
  
  function extractDistances(data) {
    return data.map((row) => ({
      elements: row.elements.map((element) =>{
        
        if(element.status == "OK"){
          return ({
            text: element.distance.text,
            value: element.distance.value
          });
        }else{
          return ({
            text: "Not Ok",
            value: Infinity
          });
        }

      
        }
      ),
    }));
  }
  
  
  function parseDistanceMatrix(response){
    var curr = extractDistances(response["rows"]);
    return curr;
  
  }
