var OVERWRITE = false;
// Function to translate text using the API
function translateText(rawText, targetLanguage) {
  var url = 'https://api.deepl.com/v2/translate';
  //targetLanguage = "FR";
  var payload = {
    text: [rawText],
    target_lang: targetLanguage
  };

  var response = UrlFetchApp.fetch(url, {
    'method': 'post',
    'contentType': 'application/json',
    'headers' : {"Authorization": "DeepL-Auth-Key 335c4b5f-c33b-cccc-e065-ab9b7e3a3175"},
    'payload': JSON.stringify(payload)
  });

  var data = JSON.parse(response.getContentText());
  var ret = data.translations[0].text
  return ret;
}

// Function to trigger translation on cell change
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var targetLanguage = "FR";

  // Check if the edited cell is in column A
  if (range.getColumn() == 1) {
    var textToTranslate = range.getValue();
    if (textToTranslate) {
      var translatedText = translateText(textToTranslate, targetLanguage);
      sheet.getRange(range.getRow(),2).setValue(translatedText); // Populate the translation in column B
    }
  }
}

function translateExisting(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var targetLanguage = 'FR';
  var lastRow = sheet.getLastRow();
  for(var i =1;i<lastRow;i++){
    var textToTranslate = sheet.getRange(i+1,1).getValues()[0][0];
    var nextCell = sheet.getRange(i+1,2).getValues()[0][0];
    if (textToTranslate && (OVERWRITE || nextCell == '')){
      var translatedText = translateText(textToTranslate, targetLanguage);
      sheet.getRange(i + 1, 2).setValue(translatedText); // Populate the translation in column B
    }
  }
}