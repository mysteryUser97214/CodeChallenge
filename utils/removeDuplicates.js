function _compareDates(prev, next) {
  const dateA = new Date(prev);
  const dateB = new Date(next);

  return dateA >= dateB;
}

function _writeChange(data) {
  const {
    oldRecord,
    newRecord,
    dupeProp,
    oldIndex,
    newIndex,
  } = data;

  const oldKeys = Object.keys(oldRecord);
  const changeText = `Duplicate ${dupeProp} property "${oldRecord[dupeProp]}" detected!\n\nRemoving record at index ${oldIndex}:\n${JSON.stringify(oldRecord, null, 1)}\n\nAdding new Record at index ${newIndex}:\n${JSON.stringify(newRecord, null, 1)}\n\nChanges:\n`;

  const diff = oldKeys.reduce((log, key) => {
    if (oldRecord[key] !== newRecord[key]) {
      return log.concat(`"${key}": "${oldRecord[key]}" -> "${newRecord[key]}"\n`);
    }
    return log;
  }, changeText);

  return diff.concat('\n\n');
}

function removeDuplicates(data) {
  const title = Object.keys(data)[0];
  const records = data[title];

  const recordsById = {};
  const recordsByEmail = {};
  const output = [];
  const log = {
    sourceRecord: data,
    changes: [],
  };

  records.forEach((record, index) => {
    const { _id, email, entryDate } = record;

    if (!recordsById[_id] && !recordsByEmail[email]) {
      // If both id and email are new
      recordsById[_id] = { data: { ...record }, index };
      recordsByEmail[email] = { data: { ...record }, index };
      output[index] = { ...record };
    } else {
      const hasDuplicateId = recordsById[_id] && _compareDates(entryDate, recordsById[_id].data.entryDate);
      const hasDuplicateEmail = recordsByEmail[email] && _compareDates(entryDate, recordsByEmail[email].data.entryDate);

      if (hasDuplicateId && hasDuplicateEmail) {
        // If both id and email are duplicates
        delete output[recordsById[_id].index];
        delete output[recordsByEmail[email].index];

        log.changes.push(_writeChange({
          oldRecord: recordsById[_id].data,
          newRecord: record,
          dupeProp: '_id',
          newIndex: index,
          oldIndex: recordsById[_id].index,
        }));

        log.changes.push(_writeChange({
          oldRecord: recordsByEmail[email].data,
          newRecord: record,
          dupeProp: 'email',
          newIndex: index,
          oldIndex: recordsByEmail[email].index,
        }));

        recordsById[_id] = { data: { ...record }, index };
        recordsByEmail[email] = { data: { ...record }, index };

        output[index] = { ...record };
      } else if (hasDuplicateId) {
        // If id already exists and new record has newer or equal date

        const changeLogPayload = {
          oldRecord: recordsById[_id].data,
          newRecord: record,
          dupeProp: '_id',
          newIndex: index,
          oldIndex: recordsById[_id].index,
        };
        log.changes.push(_writeChange(changeLogPayload));

        const oldEmail = recordsById[_id].data.email;
        delete recordsByEmail[oldEmail];
        delete output[recordsById[_id].index];

        recordsById[_id] = { data: { ...record }, index };
        recordsByEmail[email] = { data: { ...record }, index };
        output[index] = { ...record };
      } else if (hasDuplicateEmail) {
        // If email already exists and new record has a newer or equal date
        const changeLogPayload = {
          oldRecord: recordsByEmail[email].data,
          newRecord: record,
          dupeProp: 'email',
          newIndex: index,
          oldIndex: recordsByEmail[email].index,
        };
        log.changes.push(_writeChange(changeLogPayload));

        const oldId = recordsByEmail[email].data._id;
        delete recordsById[oldId];
        delete output[recordsByEmail[email].index];

        recordsByEmail[email] = { data: { ...record }, index };
        recordsById[_id] = { data: { ...record }, index };
        output[index] = { ...record };
      }
    }
  });

  // Filter output to remove empty indices
  const newData = { [title]: output.filter(e => !!e) };
  log.outputRecord = newData;

  return {
    data: newData,
    log,
  };
}

export default removeDuplicates;
