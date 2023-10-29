const USDT_TOKEN_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDC_TOKEN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DIMITRIS_ADDRESS = "0xEd9B717b0878e7BAE31b6c98398CBCd1c9ed645B";
const DETI_ADDRESS = "0x7a35F82118512155cB3F77F76F7d91Fc2830623D";
const DIMITRIES_TRC = "TNwiUT5uKJgdux4yH9XiZ7MSbJr2sMDaHo";
const DETI_TRC = "TQFznYuQME3PWeDTi1ba3XTBScU8HtihY5";
//const API_KEY = "";
const options = {
    method: "POST",
    contentType: "application/json",
  };



function updateBalances() {

  var dimitris = {};
  var deti = {};


  let url = `https://api.etherscan.io/api?module=account&action=tokenbalance&address=${DIMITRIS_ADDRESS}&tag=latest&apikey=${API_KEY}&contractaddress=${USDT_TOKEN_ADDRESS}`;

  // Make the HTTP POST request
  var response = UrlFetchApp.fetch(url, options);


  // Parse the JSON response
  var json = JSON.parse(response.getContentText());
  var amount = parseInt(json.result);
  amount = amount / 1000000;
  dimitris.usdt = amount;



  url = `https://api.etherscan.io/api?module=account&action=tokenbalance&address=${DIMITRIS_ADDRESS}&tag=latest&apikey=${API_KEY}&contractaddress=${USDC_TOKEN_ADDRESS}`;

  // Make the HTTP POST request
  response = UrlFetchApp.fetch(url, options);


  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  amount = parseInt(json.result);
  amount = amount / 1000000;
  dimitris.usdc = amount;



  url = `https://api.etherscan.io/api?module=account&action=tokenbalance&address=${DETI_ADDRESS}&tag=latest&apikey=${API_KEY}&contractaddress=${USDT_TOKEN_ADDRESS}`;

  // Make the HTTP POST request
  response = UrlFetchApp.fetch(url, options);


  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  amount = parseInt(json.result);
  amount = amount / 1000000;
  deti.usdt = amount;

  url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=58MIFP3TXVTTPPXPDZFJGMHC3SYWH6S8W9`;

  // Make the HTTP POST request
  response = UrlFetchApp.fetch(url, options);


  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  var price = parseFloat(json.result.ethusd);

  


  url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${DIMITRIS_ADDRESS},${DETI_ADDRESS}&tag=latest&apikey=${API_KEY}`;

  response = UrlFetchApp.fetch(url, options);

  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  amount = json.result[0].balance;



  // Add leading zeros using String.prototype.padStart
  //dimitris.ether = parseEther(json.result[0].balance);
  dimitris.ether = parseInt(json.result[0].balance);
  dimitris.ether = price * parseFloat(dimitris.ether) * Math.pow(10,-18);

  //deti.ether = parseEther(json.result[1].balance);
  deti.ether = parseInt(json.result[1].balance);
  deti.ether = price * parseFloat(deti.ether) * Math.pow(10,-18);




  url = `https://apilist.tronscanapi.com/api/account/tokens?address=${DIMITRIES_TRC}&hidden=1&show=2&sortBy=3`;
  response = UrlFetchApp.fetch(url);
  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  dimitris.usdt_trc = json.data[0].quantity;


  url = `https://apilist.tronscanapi.com/api/account/tokens?address=${DETI_TRC}&hidden=1&show=2&sortBy=3`;
  response = UrlFetchApp.fetch(url);
  // Parse the JSON response
  json = JSON.parse(response.getContentText());
  deti.usdt_trc = json.data[0].quantity;


  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the active sheet
  var sheet = spreadsheet.getSheetByName("crypto addresses");
  
  // Define the values to fill in the range
  var valuesToFill = [
    [dimitris.usdt_trc],
    [dimitris.usdt],
    [dimitris.usdc],
    [dimitris.ether],
    [deti.usdt_trc],
    [deti.usdt],
    [deti.ether]
  ];
  
  // Get the range from C2 to C8
  var range = sheet.getRange("C2:C8");
  
  // Set the values in the range
  range.setValues(valuesToFill);

  return json;

}

function parseEther(data){
  var amount = data.padStart(19, '0');
  // Find the position to insert the period
  const insertPosition = amount.length - 18;

  // Insert the period at the calculated position
  amount = amount.slice(0, insertPosition) + '.' + amount.slice(insertPosition);
  return amount;

}
