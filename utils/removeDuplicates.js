function _compareDates(current, past) {
  const dateA = new Date(current);
  const dateB = new Date(past);

  // also returns true if dates are equal, since the 'current' param is always the most recent index in the collection
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
    const hasDuplicateId = !!recordsById[_id];
    const hasDuplicateEmail = !!recordsByEmail[email];

    if (!hasDuplicateId && !hasDuplicateEmail) {
      output[index] = { ...record };
    } else if (hasDuplicateId && hasDuplicateEmail) {
      const idIsLater = _compareDates(entryDate, recordsById[_id].data.entryDate);
      const emailIsLater = _compareDates(entryDate, recordsByEmail[email].data.entryDate);

      if (idIsLater && emailIsLater) {
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

        output[index] = { ...record };
      } else if (idIsLater && !emailIsLater) {
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

        delete output[recordsById[_id].index];
      } else if (emailIsLater) {
        log.changes.push(_writeChange({
          oldRecord: recordsByEmail[email].data,
          newRecord: record,
          dupeProp: 'email',
          newIndex: index,
          oldIndex: recordsByEmail[email].index,
        }));
        log.changes.push(_writeChange({
          oldRecord: record,
          newRecord: recordsById[_id].data,
          dupeProp: '_id',
          newIndex: index,
          oldIndex: recordsById[_id].index,
        }));

        delete output[recordsByEmail[email].index];
      }
    } else if (hasDuplicateId) {
      const idIsLater = _compareDates(entryDate, recordsById[_id].data.entryDate);
      if (idIsLater) {
        const oldEmail = recordsById[_id].data.email;
        delete recordsByEmail[oldEmail];
        delete output[recordsById[_id].index];

        log.changes.push(_writeChange({
          oldRecord: recordsById[_id].data,
          newRecord: record,
          dupeProp: '_id',
          newIndex: index,
          oldIndex: recordsById[_id].index,
        }));

        output[index] = { ...record };
      }
    } else if (hasDuplicateEmail) {
      const emailIsLater = _compareDates(entryDate, recordsByEmail[email].data.entryDate);
      if (emailIsLater) {
        const oldId = recordsByEmail[email].data._id;
        delete recordsById[oldId];
        delete output[recordsByEmail[email].index];

        log.changes.push(_writeChange({
          oldRecord: recordsByEmail[email].data,
          newRecord: record,
          dupeProp: 'email',
          newIndex: index,
          oldIndex: recordsByEmail[email].index,
        }));

        output[index] = { ...record };
      }
    }
    // Update both dictionaries if data was set to current output index
    if (output[index]) {
      recordsByEmail[email] = { data: { ...output[index] }, index };
      recordsById[_id] = { data: { ...output[index] }, index };
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
