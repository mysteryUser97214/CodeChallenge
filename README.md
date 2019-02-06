
# Code Challenge
**Objective:** Take a variable number of identically structured json records and de-duplicate the set.
## Installation

 1. Make sure you have Node 8 or later installed
 2. `git clone https://github.com/mysteryUser97214/CodeChallenge.git`
 3. `cd CodeChallenge`
 4. `npm i`

## How to Use
1. Add any number of properly formatted `json` files to the /input/ folder. Make sure they are properly formatted (see "Assumptions" section below). Input folder contains `leads.json` by default.
2. `npm start`
3. Converted `json` file and a corresponding `<filename>.json.log` file will be written to the /output/ folder.


**Records are considered duplicates if:**
 - `_id` properties are the same
 - `emailAddress` properties are the same

**If two records are duplicates:** Give preference to the record with the most recent `date`.

 **If dates are equal** Give preference to the latest record in the list.


## Assumptions
**1. Valid input is assumed.**
Function expects input data to be formatted as such:

    {"Collection Title": [
	    <Record  1>,
	    <Record  2>,
    ]}

All records in a collection will be identical and contain at least the following properties:

    "_id": <String>,

    "email": <String>,

    "entryDate": <Date>

**2.  A collection should be returned in the same order as it was given**