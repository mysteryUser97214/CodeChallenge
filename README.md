


# Code Challenge

**Objective:** Take a variable number of identically structured json records and de-duplicate the set.

## Installation



1. Make sure you have Node 8 or later installed

2. `git clone https://github.com/mysteryUser97214/CodeChallenge.git`

3. `cd CodeChallenge`

4. `npm i`



## How to Use

1. Add any number of `.json` files to the /input/ folder. Make sure all files in the folder are properly formatted (see "Assumptions" section below). Input folder contains `leads.json` by default.

2. `npm start`

3. Converted `json` file and a corresponding `<filename>.json.log` file will be written to the /output/ folder.

- To run tests: `npm test`




**Records are considered duplicates if:**

- `_id` properties are the same

- `emailAddress` properties are the same



**If two records are duplicates:** Give preference to the record with the most recent `date`.



**If dates are equal:** Give preference to the latest record in the list.




## Assumptions

**1. Valid input is assumed.**

Function expects input data to be formatted as such:


```
{"Collection Title": [

<Record 1>,

<Record 2>,

]}
```


All records in a collection will be identical and contain at least the following properties:



"_id": <String>,

"email": <String>,

"entryDate": <Date>



**2. A collection should be returned in the same order as it was given**



## Approach & Retrospective

This was a fun problem! There was an obvious brute-force solution available, but it was more engaging to think of it in terms of big O. I gave myself the challenge of keeping my solution at `O(n)`, which (to the best of my knowledge) I think I achieved!



(See `removeDuplicates()` in `/utils/removeDuplicates`)



I thought of ways to remove `_id` and `email` duplicates on a single pass, and chose to use a dictionary for both keys: `recordsById` and `recordsByEmail`. Both objects track the data and corresponding index of a record so that duplicate keys can be checked without requiring additional iterations through a collection.



As a collection is iterated through, `id`'s and `emails` are tracked through their respective dictionaries. If no duplicate keys are found, the record is set to the corresponding index of the `output` array. When a duplicate key is found, the algorithm determines which record to remove, then deletes it from the `output` array- while keeping both `recordsById` and `recordsByEmail` dictionaries updated with the record with the highest `entryDate`. This approach worked fine for the sample data in `leads.json`.


Once I confirmed my code was working as intended, I wrote tests for edge cases that could potentially break it. For example, a scenario like this:

```
record_1: {
"_id": "A",
"email": "banana@banana.com",
"entryDate": "2015-05-07T17:33:20+00:00"
},
record_2: {
"_id": "B",
"email": "orange@orange.com",
"entryDate": "2021-05-07T17:33:20+00:00"
},
record_3: {
"_id": "A",
"email": "orange@orange.com",
"entryDate": "2019-05-07T17:33:20+00:00"
}
```

As the code runs, the first two entries are added to the output array just fine- while all `_id`'s and `email`'s added to their respective maps. No overlap so far. But what happens when the third record is processed? It contains duplicate for both properties- but only one has a later `entryDate`.



Here's the conclusion I reached:

When `record_3` is processed, we initially see that `record_1` should be removed from the collection, since it has an earlier `entryDate`


```
record_1: <removed>,
record_2: {
"_id": "B",
"email": "orange@orange.com",
"entryDate": "2021-05-07T17:33:20+00:00"
},
record_3: {
"_id": "A",
"email": "orange@orange.com",
"entryDate": "2019-05-07T17:33:20+00:00"
}
```

Now we compare `record_2` and `record_3` and see that `record_2` has a later `entryDate` , so `record_3` is removed.


```
record_1: <removed>
record_2: {
"_id": "B",
"email": "orange@orange.com",
"entryDate": "2021-05-07T17:33:20+00:00"
},
record_3: <removed>
```

This seems odd, because in the initial collection we can see that `record_1` and `record_2` have no conflicts. But since `record_3` contains common properties between the two, we get this "chain-reaction" effect.



To get my algorithm to handle this edge case property, I had to a sacrifice lot of the simplicity in my initial "happy path" solution. I tried keeping it as idiomatic as possible, but it kind of feel like I went overboard with the if-operators.  I'm happy everything works at `O(n)` complexity, though I suspect there's a better approach that I haven't found yet.



### Things I'd change


- The logic for generating logs feels kind of bulky. Generally, I don't like to directly couple this logic with the function that it represents. It would probably be more scaleable if implemented as middleware.

- Adding and removing elements from the `output` array seems a little weird. Mutating data goes against my React/Redux principles. If I didn't give myself the  "preserve order of the input collection" objective, I wouldn't need the array.

- I'm not in love with putting the entirety of a record into the `recordsById` and `recordsByEmail` dictionaries. I like the idea of a single source of truth. Originally, I thought having dictionaries contain the index of a record instead of the whole thing. This would require an extra step when looking up the `entryDate` of a record, something like `records[indicesById[_id]].entryDate`,  but would also make the `records` array the single source of truth.

- Lots of redundancy in the removeDuplicates() function. I went back and forth on keeping the code dry. There seemed to be a tradeoff between dryness and readability. I suspect there's potential to consolidate if-operators and generalize redundant functionality.
