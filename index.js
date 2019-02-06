import fs from 'fs';
import util from 'util';
import removeDuplicates from './util/removeDuplicates';
import generateLog from './util/generateLog';

const readDirectory = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

(async function deDupe() {
  const allFiles = await readDirectory('./input/');

  allFiles.forEach(async (file) => {
    const input = await readFile(`./input/${file}`);
    const output = removeDuplicates(JSON.parse(input));
    const log = generateLog(output.changeLog);

    writeFile(`./output/${file}.log`, log);
    writeFile(`./output/${file}`, JSON.stringify(output.data, null, 1));
  });
}());
