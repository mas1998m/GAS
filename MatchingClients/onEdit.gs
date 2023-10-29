function onEdit(e) {

    // Get the active sheet
    var sheet = e.source.getActiveSheet();
  
    // Check if the edited cell is in the first column and the value is "start"
    if (e.range.getColumn() == 1 && e.value == TRIGGER_VALUE) {
  
      var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_DATA_NAME);
      var filteredData = getRawData();
      filteredData = dataFilter(filteredData);
  
      var mainRowRange = sheet.getRange(e.range.getRow(), 1, 1, sheet.getLastColumn());
      var mainRowData = mainRowRange.getValues()[0];
  
      var matchingAgeDataIndicees = [];
      var matchingAgeData = [];
  
      var matchingPrefDataIndicees = [];
      var matchingPrefData = [];
  
      var ageRange = mainRowData[MAIN_SCREEN_1_AGE_COL_NR-1];
      var genderLanguage = mainRowData[MAIN_SCREEN_3_GENDER_COL_NR-1];
  
      for(let i=0;i<filteredData.length;i++){
        var age = extractFirstNumber(filteredData[i][DATA_SCREEN_1_AGE_COL_NR-1]);
        if(isAgeInRange(ageRange, age)){
          matchingAgeDataIndicees.push(i);
          matchingAgeData.push(filteredData[i]);
        }
  
        var pref = filteredData[i][DATA_SCREEN_3_COL_NR-1];
        pref = getPreference(pref);
        if(isPrefMatching(pref,genderLanguage)){
          matchingPrefDataIndicees.push(i);
          matchingPrefData.push(filteredData[i]);
        }
      }
  
      var intersection = matchingPrefDataIndicees.filter(value => matchingAgeDataIndicees.includes(value));
      var mainLocations = mainRowData[MAIN_SCREEN_2_LOCATION_COL_NR-1].split(",");
      mainLocations = mainLocations.map((element) => getClosestMatch(element, LIST_OF_LOCATIONS));
      var intersectionData = newArrayFromIndices(filteredData,intersection);
  
      //get the distance between each Data Row after Age and prefrences filters
      for(var i=0;i<intersectionData.length;i++){
        intersectionData[i][DATA_SCREEN_2_LOCATION_COL_NR-1] =  getClosestMatch(intersectionData[i][DATA_SCREEN_2_LOCATION_COL_NR-1], LIST_OF_LOCATIONS);
        var shortest = -1;
        var selectedMainLocationIndex = -1;
  
        //check for all locations the main have and check which one is closest to the client and make future calculations based on it.
        for(var j = 0 ; j<mainLocations.length;j++){
          var distance = getDistanceMatrix(intersectionData[i][DATA_SCREEN_2_LOCATION_COL_NR-1],mainLocations[j])[0].elements[0];
          if(shortest == -1){
            shortest = distance;
            selectedMainLocationIndex = j;
          }else{
            if(distance.value < shortest.value){
              shortest = distance;
              selectedMainLocationIndex = j;
            }
          }
        }
  
        //filter data by distance
        if(shortest.value == Infinity || extractDistanceFromString(shortest.text) > MAX_DISTANCE_MILES){
          intersectionData.splice(i,1);
        }else{
          intersectionData[i].push(mainLocations[selectedMainLocationIndex] + " - " + intersectionData[i][DATA_SCREEN_2_LOCATION_COL_NR-1]);
          intersectionData[i].push(shortest.text);
        }
      }
  
  
      intersectionData = dataSort(intersectionData);
      intersectionData = intersectionData.slice(0,5);
  
      var firstCell = mainRowRange.offset(0, 0, 1, 1);
      firstCell.setValue(CELL_VALUE_AFTER_ALGO);
  
  
      //insert 5 rows below the main row and group them
      sheet.insertRowsAfter(e.range.getRow(), intersectionData.length);
      var insertedRange = sheet.getRange(e.range.getRow() + 1, 1, intersectionData.length, sheet.getMaxColumns());
      insertedRange.shiftRowGroupDepth(1);
  
      //get the original data rows from Data Sheet, modify first Cell value, copy them under the Main Row
      for(var i=0;i<intersectionData.length;i++){
  
        var originalDataRowRange = dataSheet.getRange(intersectionData[i][32], 1, 1, dataSheet.getMaxColumns());
        var targetRow = insertedRange.offset(i, 0, 1, originalDataRowRange.getNumColumns());
        var originalDataValues = originalDataRowRange.getValues();
        originalDataValues[0][0] = "~" + intersectionData[i][34].replace("mi","miles. ").replace("ft","feets. ") +  intersectionData[i][33];
  
        // Copy the values from the source range to the target row
        targetRow.setValues(originalDataValues);
    
        var firstCell = originalDataRowRange.offset(0, 0, 1, 1);
        firstCell.setValue( mainRowData[MAIN_PERSON_NAME_COL_NR-1] + "- In Progress");
  
        
      }
    }
  }
  
  //for testing
  function simulateOnEdit() {
    var testEvent = {
      source: SpreadsheetApp.getActiveSpreadsheet(),
      range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_MAIN_NAME).getRange("A16"), // Edit the cell you want to simulate
      value: TRIGGER_VALUE
    };
    onEdit(testEvent);
  }
  
  
  function main(){
    simulateOnEdit();
  }
  