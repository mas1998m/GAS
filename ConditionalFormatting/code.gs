function checkForErrors(sheet){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
  var range = sheet.getDataRange();
  
  // Define the rules
  var rules = [
    {
      range: sheet.getRange("H2:H"), // Column H
      criteria: [
        { type: "text", values: ["", "SELECT A SERVICE TYPE BELOW"] }
      ],
      backgroundColor: "yellow"
    },
    {
      range: sheet.getRange("K2:K"), // Column K
      criteria: [
        { type: "text", values: ["", "No"] }
      ],
      backgroundColor: "yellow"
    },
    {
      range: sheet.getRange("J2:J"), // Column J
      criteria: [
        { type: "number", values: [7], operator: SpreadsheetApp.BooleanCriteria.NUMBER_LESS_THAN_OR_EQUAL_TO }
      ],
      backgroundColor: "yellow"
    },
    {
      range: sheet.getRange("O2:O"), // Column O
      criteria: [
        { type: "text", values: ["", ""], regex: "^(?!.*[A-Z]\\s\\d{2}\\.\\d{2})" }
      ],
      backgroundColor: "yellow"
    },
    {
      range: sheet.getRange("AG2:AG"), // Column AG
      criteria: [
        { type: "text", values: ["", "Not Yet Assigned"] }
      ],
      backgroundColor: "yellow"
    }
  ];

  // Apply the rules

  var lastRow = sheet.getLastRow();
  
  // Define the column letters for the columns you want to include
  var columnLetters = ['H', 'K', 'O', 'AG'];
  
  var ranges = [];
  
  // Loop through the column letters and create the ranges
  for (var i = 0; i < columnLetters.length; i++) {
    var column = columnLetters[i];
    var range = sheet.getRange(column + '2:' + column + lastRow);
    ranges.push(range);
  }

  var rules = []

  var ruleBuilder = SpreadsheetApp.newConditionalFormatRule()
    .withCriteria(BooleanCriteria.CELL_EMPTY)
    .setBackground("yellow")
    .setRanges(ranges);
  rules.push(ruleBuilder.build());

  

  var ruleBuilder = SpreadsheetApp.newConditionalFormatRule()
  .withCriteria(BooleanCriteria.TEXT_EQUAL_TO,{'text': "SELECT A SERVICE TYPE BELOW"})
  .setBackground("yellow")
  .setRanges([ranges[0]]);
  rules.push(ruleBuilder.build());



  var ruleBuilder = SpreadsheetApp.newConditionalFormatRule()
  .withCriteria(BooleanCriteria.TEXT_EQUAL_TO,{'text': "No"})
  .setBackground("yellow")
  .setRanges([ranges[1]]);
  rules.push(ruleBuilder.build());


  var ruleBuilder = SpreadsheetApp.newConditionalFormatRule()
  .withCriteria(BooleanCriteria.CUSTOM_FORMULA,{'text': "=REGEXMATCH()"})
  .setBackground("yellow")
  .setRanges([ranges[3]]);
  rules.push(ruleBuilder.build());


  sheet.setConditionalFormatRules(rules);

    
}

