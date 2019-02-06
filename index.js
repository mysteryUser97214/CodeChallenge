import fs from 'fs';
import util from 'util';
import removeDuplicates from './util/removeDuplicates';
import generateLog from './util/generateLog';

const readDirectory = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function deDupe() {
  const allFiles = await readDirectory('./input/');

  const allPromises = allFiles.map(async (file) => {
    try {
      const input = await readFile(`./input/${file}`);
      const output = removeDuplicates(JSON.parse(input));
      const log = generateLog(output.changeLog);
      await writeFile(`./output/${file}.log`, log);
      await writeFile(`./output/${file}`, JSON.stringify(output.data, null, 1));
      console.log(`File ${file} completed! ${output.changeLog.length} Change(s) made. See file ${file}.log in the output folder for a full list of changes.`);
    } catch (err) {
      throw Error(`Could not convert file "${file}"\n${err}`);
    }
  });

  return Promise.all(allPromises);
}

deDupe().then(() => console.log('Done!')).catch(err => console.log(err));
