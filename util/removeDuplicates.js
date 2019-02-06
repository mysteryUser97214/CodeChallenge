function _compareDates(prev, next) {
  const dateA = new Date(prev);
  const dateB = new Date(next);

  return dateA >= dateB;
}

function _writeChange(oldRecord, newRecord, dupeProp) {
  const oldKeys = Object.keys(oldRecord);
  const changeText = `Duplicate ${dupeProp} property detected!\nOld Record:\n${JSON.stringify(oldRecord, null, 1)}\n\nNew Record:\n${JSON.stringify(newRecord, null, 1)}\n\nChanges:\n`;

  const diff = oldKeys.reduce((log, key) => {
    if (oldRecord[key] !== newRecord[key]) {
      return log.concat(`"${key}": "${oldRecord[key]}" -> "${newRecord[key]}"\n`);
    }
    return log;
  }, changeText);

  return diff.concat('\n\n\n');
}

function removeDuplicates(data) {
  const title = Object.keys(data)[0];
  const records = data[title];

  // TODO: values should only be record indices, not the whole record
  const recordsById = {};
  const recordsByEmail = {};
  const output = [];
  const changeLog = [];

  changeLog.push(`Original Collection:\n${JSON.stringify(data, null, 1)}\n\n`);

  records.forEach((record, index) => {
    const { _id, email, entryDate } = record;

    if (!recordsById[_id] && !recordsByEmail[email]) {
      // If both id and email are new
      recordsById[_id] = { data: { ...record }, index };
      recordsByEmail[email] = { data: { ...record }, index };
      output[index] = { ...record };
    } else {
      if (recordsById[_id] && _compareDates(entryDate, recordsById[_id].data.entryDate)) {
        // If id already exists and new record has newer or equal date

        changeLog.push(_writeChange(recordsById[_id].data, record, 'id'));

        delete output[recordsById[_id].index];
        recordsById[_id] = { data: { ...record }, index };
        output[index] = { ...record };
      }

      if (recordsByEmail[email] && _compareDates(entryDate, recordsByEmail[email].data.entryDate)) {
        // If email already exists and new record has a newer or equal date

        changeLog.push(_writeChange(recordsByEmail[email].data, record, 'email'));

        delete output[recordsByEmail[email].index];
        recordsByEmail[email] = { data: { ...record }, index };
        output[index] = { ...record };
      }
    }
  });

  const newData = { [title]: output.filter(e => !!e) };
  changeLog.push(`\n\nNew Collection:\n${JSON.stringify(newData, null, 1)}`);

  return {
    // Remove empty indices
    data: newData,
    changeLog,
  };
}

export default removeDuplicates;
