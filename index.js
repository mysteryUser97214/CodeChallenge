const removeDuplicates = require('./util/removeDuplicates');
const sampleData = require('./data/leads.json');

const input = sampleData.leads;

const output = removeDuplicates(input);

console.log(output);
