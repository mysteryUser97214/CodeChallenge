function _compareDates(prev, next) {
  const dateA = new Date(prev);
  const dateB = new Date(next);

  return dateA >= dateB;
}

function removeDuplicates(records) {
  const recordsById = {};
  const recordsByEmail = {};
  const output = [];

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
        delete output[recordsById[_id].index];
        recordsById[_id] = { data: { ...record }, index };
        output[index] = { ...record };
      }

      if (recordsByEmail[email] && _compareDates(entryDate, recordsByEmail[email].data.entryDate)) {
        // If email already exists and new record has a newer or equal date
        delete output[recordsByEmail[email].index];
        recordsByEmail[email] = { data: { ...record }, index };
        output[index] = { ...record };
      }
    }
  });

  // Remove empty indices
  return output.filter(e => !!e);
}

export default removeDuplicates;
