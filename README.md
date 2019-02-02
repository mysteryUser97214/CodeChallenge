
## Code Challenge

Take a variable number of identically structured json records and de-duplicate the set.

**Records are considered duplicates if:**
 - `_id` properties are the same
 - `emailAddress` properties are the same

**If two records are duplicates:** Give preference to the record with the most recent `date`.

 **If dates are equal** Give preference to the latest record in the list.


**Valid input is assumed. All records in a collection will have an identical schema and contain at least the following properties**
    
    "_id": <String>,
    
    "email": <String>,
    
    "entryDate": <Date>
    
