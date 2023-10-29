function extractFirstNumber(value) {
    if (Number.isInteger(value)) {
      return value;
    }
    const regex = /(\d{1,2})/;
    const match = String(value).match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
  
  
  function extractDistanceFromString(str){
    const match = str.match(/[\d.]+/);
    const numericValue = parseFloat(match[0]);
    return numericValue;
  }
  
  function isAgeInRange(ageRange, age) {
    const ranges = ageRange.split(", ");
    
    for (const range of ranges) {
      const [startStr, endStr] = range.split("-");
  
      const start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
  
      if (isNaN(end)) {
        // Handle open-ended range (e.g., "31+")
        end = Infinity;
      }
  
      if (!isNaN(start) && age >= start && age <= end) {
        return true;
      }
    }
    return false;
  }
  
  function testIsAgeInRange(){
    const testArray = [
      ["0-3, 4-11, 12-17, 18-30, 31+","5"],
      ["5-10","12"],
      ["15+","20"],
      ["13-30+","53"],
      ["2-5,   3-53,  1-10","40"]
    ];
  
    testArray.forEach((item, index) => {
      const result = isAgeInRange(item[0],item[1]);
      console.log(`Test ${index + 1}: ${item[0]} ==> ${item[1]}`);
      console.log(`Result: ${JSON.stringify(result)}`);
    });
  }
  
  
  
  function isPrefMatching(needed,available){
    var genderMatch = false;
    var langMatch = false;
    if(needed.gender == "MF"){
      genderMatch = true;
    }else if(needed.gender == "M" && available.includes("Male")){
      genderMatch = true;
    }else if(needed.gender == "F"&& available.includes("Female")){
      genderMatch = true;
    }
  
    if(needed.language == "SP" && available.includes("SP")){
      langMatch = true;
    }else if(needed.language != "SP"  && !available.includes("SP")){
          langMatch = true;
    }
    return genderMatch && langMatch;
  }
  
  
  function newArrayFromIndices(dataArray, indicesArray) {
    const resultArray = [];
  
    for (const index of indicesArray) {
      if (index >= 0 && index < dataArray.length) {
        resultArray.push(dataArray[index]);
      }
    }
  
    return resultArray;
  }
  
  
  // function testIsAgeInRange(){
  //   const testArray = [
  //     ["SP","5"],
  //     ["5-10","12"],
  //     ["15+","20"],
  //     ["13-30+","53"],
  //     ["2-5,   3-53,  1-10","40"]
  //   ];
  
  //   testArray.forEach((item, index) => {
  //     const result = isAgeInRange(item[0],item[1]);
  //     console.log(`Test ${index + 1}: ${item[0]} ==> ${item[1]}`);
  //     console.log(`Result: ${JSON.stringify(result)}`);
  //   });
  // }
  
  
  
  
  
  
  
  /**
   * Finds the closest match to the target string from a list of location strings.
   *
   * @param {string} target - The string to find a match for.
   * @param {Array<string>} LIST_OF_LOCATIONS - The array of strings to search through.
   * @return {string} - The closest match from the list.
   */
  function getClosestMatch(target, LIST_OF_LOCATIONS) {
    let closestMatch = "";
    let closestScore = -Infinity;
    let lowerTarget = target.toLowerCase().trim();
    let targetTokens = lowerTarget.split(" ");
  
    for (let i = 0; i < LIST_OF_LOCATIONS.length; i++) {
      let currentLocation = LIST_OF_LOCATIONS[i].toLowerCase();
      let currentTokens = currentLocation.split(" ");
      let distance = levenshteinDistance(lowerTarget, currentLocation);
      let score = -distance; // Lower distance is better, negate it for score
  
      // Add weight to token-based matches
      for (let token of targetTokens) {
        if (currentTokens.includes(token)) {
          score += 10; // Increment the score for each token matched
        }
      }
  
      if (score > closestScore) {
        closestScore = score;
        closestMatch = LIST_OF_LOCATIONS[i];  // Return the original string, not the lowercased version
      }
    }
    return closestMatch;
  }
  
  /**
   * Calculates the Levenshtein distance between two strings.
   * 
   * @param {string} a - The first string to compare.
   * @param {string} b - The second string to compare.
   * @return {number} - The Levenshtein distance between the two strings.
   */
  function levenshteinDistance(a, b) {
    let matrix = [];
  
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 1; j <= b.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        let cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    return matrix[a.length][b.length];
  }
  
  /**
   * Test function for getClosestMatch.
   */
  function testGetClosestMatch() {
    const testCases = [
      { input: "Um suqem", expected: "Umm Suqeim" },
      { input: "j br", expected: "JBR" },
      { input: "Dubai Marna", expected: "Dubai Marina" },
      { input: "Downtown", expected: "Downtown Dubai" },
      {  input: "Al Satwa", expected: "Al Satwa" },
  
    ];
  
    testCases.forEach((testCase, index) => {
      const output = getClosestMatch(testCase.input, LIST_OF_LOCATIONS);
      if (output === testCase.expected) {
        console.log(`Test case ${index + 1} passed.`);
      } else {
        console.error(`Test case ${index + 1} failed. Expected ${testCase.expected}, got ${output}`);
      }
    });
  }
  
  
  /**
   * Parses a preference string to extract gender and language preferences.
   * 
   * @param {string} preferenceString - The input string containing free-form data entries.
   * 
   * @returns {Object} - An object containing parsed gender and language preferences.
   * 
   * @returns {string} Object.gender - A string that can contain 'M', 'F', or 'MF' based on the gender preference.
   * 'M' signifies Male, 'F' signifies Female, and 'MF' signifies either Male or Female.
   * 
   * @returns {string} Object.language - A string that can contain 'SP' for Spanish or an empty string if Spanish and/or English or just English is mentioned.
   * 
   * @example
   * // Returns { gender: 'M', language: 'SP' }
   * getPreference("Male, Spanish Speaker");
   * 
   * // Returns { gender: 'F', language: '' }
   * getPreference("Female, can also do Fridays same is possible");
   * 
   * // Returns { gender: 'MF', language: '' }
   * getPreference("Female or male");
   */
  function getPreference(preferenceString) {
    let output = {
      gender: "",
      language: ""
    };
  
    let onlyGender = "";
    let onlyLanguage = "";
  
    let sections = preferenceString.split(/[,\.]/);
  
    sections.forEach(section => {
      let normalizedSection = section.toLowerCase().trim();
  
      if (/only/.test(normalizedSection)) {
        if (/male/.test(normalizedSection)) {
          onlyGender = 'M';
        } else if (/female/.test(normalizedSection)) {
          onlyGender = 'F';
        }
        if (/spanish/.test(normalizedSection)) {
          onlyLanguage = 'SP';
        }
        return;
      }
  
      if (/\bmale\b/.test(normalizedSection)) {
        output.gender += 'M';
      }
      if (/\bfemale\b/.test(normalizedSection)) {
        output.gender += 'F';
      }
      if (/or/.test(normalizedSection)) {
        output.gender += 'MF';
      }
  
      if (/spanish/.test(normalizedSection) && (/and/.test(normalizedSection) && /english/.test(normalizedSection))) {
        output.language = 'SP';
      }
      else if (/spanish/.test(normalizedSection)) {
        output.language = 'SP';
      }
      else if (/english/.test(normalizedSection)) {
        output.language = '';
      }
    });
  
    if (onlyGender) {
      output.gender = onlyGender;
    } else {
      output.gender = Array.from(new Set(output.gender.split(''))).join('');
    }
  
    if (onlyLanguage) {
      output.language = onlyLanguage;
    }
  
    return output;
  }
  
  
  function testGetPreference() {
    const testArray = [
      "Female",
      "Male, Spanish speaker",
      "Female, can also do Fridays same is possible",
      "Female or Male",
      "Male,Spanish Speaker",
      "Male only. End time may be 5pm for some sessions.",
      "Male, Spanish Speaker preferred but not needed",
      "Female, Spanish Speaker preferred",
      "Female, Spanish and English Speaker",
      "Female Only. Requires lifting client.",
      "Female only",
      "Male preferred but Female is okay"
    ];
  
    testArray.forEach((item, index) => {
      const result = getPreference(item);
      console.log(`Test ${index + 1}: ${item}`);
      console.log(`Result: ${JSON.stringify(result)}`);
    });
  }