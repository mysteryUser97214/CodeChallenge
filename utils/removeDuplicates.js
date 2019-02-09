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
    const hasDuplicateId = !!recordsById[_id];
    const hasDuplicateEmail = !!recordsByEmail[email];

    if (!hasDuplicateId && !hasDuplicateEmail) {
      // If both id and email are new, add record to dictionaries and output

      recordsById[_id] = { data: { ...record }, index };
      recordsByEmail[email] = { data: { ...record }, index };
      output[index] = { ...record };
    } else {
      if (hasDuplicateId && hasDuplicateEmail) {
        // If record contains both a duplicate id and email

        const idIsGreater = _compareDates(entryDate, recordsById[_id].data.entryDate);
        const emailIsGreater = _compareDates(entryDate, recordsByEmail[email].data.entryDate);

        if (idIsGreater) {
          // If record has a later or equal entryDate than the one in recordsById
          delete output[recordsById[_id].index];
          // recordsById[_id] = { data: { ...record }, index };
          // If record is greater than its corresponding recordsByEmail entry, set it to output
          if (emailIsGreater) output[index] = { ...record };
        } else {
          // If not, remove it from the output array & add the record from recordsByID
          delete output[index];
          output[recordsById[_id].index] = { ...recordsById[_id].data };
        }

        if (emailIsGreater) {
          // If record has a later or equal entryDate than the one in recordsById
          delete output[recordsByEmail[email].index];
          // recordsByEmail[email] = { data: { ...record }, index };
          // If record is greater than its corresponding recordsById entry, set it to output
          if (idIsGreater) output[index] = { ...record };
        } else {
          delete output[index];
          output[recordsByEmail[email].index] = { ...recordsByEmail[email].data };
        }
      } else if (hasDuplicateId) {
        if (_compareDates(entryDate, recordsById[_id].data.entryDate)) {
          // const oldEmail = recordsById[_id].data.email;

          const changeLogPayload = {
            oldRecord: recordsById[_id].data,
            newRecord: record,
            dupeProp: '_id',
            newIndex: index,
            oldIndex: recordsById[_id].index,
          };
          log.changes.push(_writeChange(changeLogPayload));

          // delete recordsByEmail[oldEmail];
          delete output[recordsById[_id].index];
          output[index] = { ...record };
        } else {
          delete output[index];
        }
      } else if (hasDuplicateEmail) {
        if (_compareDates(entryDate, recordsByEmail[email].data.entryDate)) {
          // const oldId = recordsByEmail[email].data._id;

          const changeLogPayload = {
            oldRecord: recordsByEmail[email].data,
            newRecord: record,
            dupeProp: 'email',
            newIndex: index,
            oldIndex: recordsByEmail[email].index,
          };
          log.changes.push(_writeChange(changeLogPayload));

          // delete recordsById[oldId];
          delete output[recordsByEmail[email].index];
          output[index] = { ...record };
        } else {
          delete output[index];
        }
      }

      // Update both dictionaries if data was set to current output index
      if (output[index]) {
        recordsByEmail[email] = { data: { ...output[index] }, index };
        recordsById[_id] = { data: { ...output[index] }, index };
      }

      // TODO: integrate logging functionality. use dead code below

      // if (hasDuplicateId && hasDuplicateEmail) {
      //   // If both id and email are duplicates
      //   delete output[recordsById[_id].index];
      //   delete output[recordsByEmail[email].index];

      //   log.changes.push(_writeChange({
      //     oldRecord: recordsById[_id].data,
      //     newRecord: record,
      //     dupeProp: '_id',
      //     newIndex: index,
      //     oldIndex: recordsById[_id].index,
      //   }));

      //   log.changes.push(_writeChange({
      //     oldRecord: recordsByEmail[email].data,
      //     newRecord: record,
      //     dupeProp: 'email',
      //     newIndex: index,
      //     oldIndex: recordsByEmail[email].index,
      //   }));

      //   recordsById[_id] = { data: { ...record }, index };
      //   recordsByEmail[email] = { data: { ...record }, index };

      //   output[index] = { ...record };
      // } else if (hasDuplicateId) {
      //   // If id already exists and new record has newer or equal date

      //   const changeLogPayload = {
      //     oldRecord: recordsById[_id].data,
      //     newRecord: record,
      //     dupeProp: '_id',
      //     newIndex: index,
      //     oldIndex: recordsById[_id].index,
      //   };
      //   log.changes.push(_writeChange(changeLogPayload));

      //   const oldEmail = recordsById[_id].data.email;
      //   delete recordsByEmail[oldEmail];
      //   delete output[recordsById[_id].index];

      //   recordsById[_id] = { data: { ...record }, index };
      //   recordsByEmail[email] = { data: { ...record }, index };
      //   output[index] = { ...record };
      // } else if (hasDuplicateEmail) {
      //   // If email already exists and new record has a newer or equal date
      //   const changeLogPayload = {
      //     oldRecord: recordsByEmail[email].data,
      //     newRecord: record,
      //     dupeProp: 'email',
      //     newIndex: index,
      //     oldIndex: recordsByEmail[email].index,
      //   };
      //   log.changes.push(_writeChange(changeLogPayload));

      //   const oldId = recordsByEmail[email].data._id;
      //   delete recordsById[oldId];
      //   delete output[recordsByEmail[email].index];

      //   recordsByEmail[email] = { data: { ...record }, index };
      //   recordsById[_id] = { data: { ...record }, index };
      //   output[index] = { ...record };
      // }
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
