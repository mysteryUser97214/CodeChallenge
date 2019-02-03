
# Code Challenge

**Objective:** Take a collection of identically structured json records and remove duplicates.

**Records are considered duplicates if:**
 - `_id` properties are the same
 - `email` properties are the same

**If two records are duplicates:** Give preference to the record with the most recent `entryDate`.

 **If dates are equal** Give preference to the latest record in the list.


## Assumptions
**1. Valid input (an array of objects) is assumed. All records in a collection will be identical and contain at least the following properties**

    "_id": <String>,

    "email": <String>,

    "entryDate": <Date>

**2. Records in a collection should be returned in their original order**