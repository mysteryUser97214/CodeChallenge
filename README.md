
# Code Challenge

**Objective:** Take a variable number of identically structured json records and de-duplicate the set.

**Records are considered duplicates if:**
 - `_id` properties are the same
 - `emailAddress` properties are the same

**If two records are duplicates:** Give preference to the record with the most recent `date`.

 **If dates are equal** Give preference to the latest record in the list.


## Assumptions
**1. Valid input is assumed. All records in a collection will be identical and contain at least the following properties**

    "_id": <String>,

    "email": <String>,

    "entryDate": <Date>

**2. A collection should be returned in the same order as it was given**