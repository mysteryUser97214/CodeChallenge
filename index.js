import sampleData from './data/leads.json';
import removeDuplicates from './util/removeDuplicates';

const input = sampleData.leads;

const output = removeDuplicates(input);

console.log(output);
