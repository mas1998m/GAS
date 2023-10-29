const keys = ["Id", "Status", "Location", "Service", "Worker", "Date", "Start", "End", "Created", "Price",
              "IP", "Email", "Name", "Date of Birth","Phone", "Insurance", "Vision Plan","Description","- Confirm appointment"];


// var formSubmissionString = `Id 87 Status pending Location Bronx - Webster Avenue Service Medical Exam Worker Dr. Joanna Liu Date October 13, 2023 Start 10:00 am End 11:00 am Created 2023-10-08 23:32:13 Price 100.00 IP 172.58.228.213 Email ashleyvallejo1024@gmail.com Name darren vallejo Date of Birth 10/23/2000 Phone +1 (315) 664-6341 Insurance 1199 Vision Plan 1199 Description Has been diagnosed with Retinoschisis in past & now is seeing shadow in vision when looking up down or far left or right wants to look for second option - Confirm appointment <https://comptoneye.com?_ea-action=confirm&_ea-app=87&ea-t=ab2656db9ffcea9a1e32a7ecaf89d670>- Cancel appointment <https://comptoneye.com?_ea-action=cancel&_ea-app=87&_ea-t=92018776b0b604c533ef1824ee41d1fc>`;


function extractKeyValuePairs(inputString) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const startIndex = inputString.indexOf(key);
    if (startIndex !== -1) {
      const endIndex = i < keys.length - 1
        ? inputString.indexOf(keys[i + 1])
        : inputString.length;
      if (endIndex !== -1) {
        const value = inputString.slice(startIndex + key.length, endIndex).trim();
        result[key] = value;
      }
    }
  }
  return result;
}