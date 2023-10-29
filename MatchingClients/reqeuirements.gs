// Trigger: When column A in the Main tab is set to TRIGGER_VALUE
// Description: When the action is triggered, match the person(row) in the tab Main with the 5 best matches from the tab Data, based on these steps:
// * Only include the data from the section which starts with SECTION_START_COL_A_TEXT
// * Exclude data rows where the column A is not blank
// * Start by sorting the data in the Data tab on DATA_TIMESTAMP_COL_NR with the oldest entry first.
// * Screen 1: age in the Data tab (column I) needs to be within the age ranges in the Main tab (column M)
// Location area distances - create a script which returns a matrix of distances in miles between location areas in the LIST_OF_LOCATIONS. All locations are in the Dubai area. Use an API like Google Maps. Add the data for matrix to a new tab "Distances".
// * Screen 2: Location - for the MAIN_SCREEN_2_LOCATION_COL_NR value, figure out which of the LIST_OF_LOCATIONS that the text input matches most closely. It can sometimes be a comma separate list, in that case, all the locations should be used. For each individual location text comparison, you can use getClosestMatch() in utils.gs. Use this selected location of the person to rank the data by closest locations. The same getClosestMatch() logic needs to be done for the location data in the Data tab too (column B)
// Add an extra key/value pair "distance": "~X miles. Location name 1 - Location name 2" to each data object
// Filter out all distances that are over MAX_DISTANCE_MILES

// * Screen 3: Male/female and Spanish/English preference. Use the utils.gs function getPreference. It parses if the entries in data want Male/Female or Spanish/English. The language output "" is the default and English. The info is in column J in the Data tab. Compare the output of the function with the Main person column S (4 fixed variations Male, Female, Male SP, Female SP) 

// Take up to five best matches ranked by oldest timestamp and copy them to new rows under the person in the Main tab. Create a "group" for the data under the person. Add the "distance" information in column A for each row. Change the cell value of the triggered cell to CELL_VALUE_AFTER_ALGO.
// Example = Main tab columns 20-23 and Data tab columns 20-22

// For the matches that are copied, write MAIN_PERSON_NAME + "- In Progress" in column A in the Data tab.

const TRIGGER_VALUE = "Ready to be matched"
const TAB_MAIN_NAME = "Main"
const TAB_DATA_NAME = "Data"
const SECTION_START_COL_A_TEXT = "REQUESTS"
const DATA_TIMESTAMP_COL_NR = 17
const MAIN_SCREEN_1_AGE_COL_NR = 13
const DATA_SCREEN_1_AGE_COL_NR = 9
const MAIN_SCREEN_2_LOCATION_COL_NR = 4
const DATA_SCREEN_2_LOCATION_COL_NR = 2

const MAX_DISTANCE_MILES = 40
const MAIN_PERSON_NAME_COL_NR = 2
const DATA_SCREEN_3_COL_NR = 10
const MAIN_SCREEN_3_GENDER_COL_NR = 19
const MAIN_SCREEN_3_LANGUAGE_COL_NR = 20
const CELL_VALUE_AFTER_ALGO = "Matched- Needs review"

const INTERSECTION_DATA_DISTANCE_VALUE_INDEX = 33




//const MAPS_API_KEY=
