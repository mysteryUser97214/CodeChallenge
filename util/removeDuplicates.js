function _compareDates(prev, next) {
  const dateA = new Date(prev);
  const dateB = new Date(next);

  if (dateA > dateB) return 'later';
  if (dateB > dateA) return 'earlier';
  return 'equal';
}

function removeDuplicates(records) {
  const recordsById = {};
  const recordsByEmail = {};
  // TODO: patch equal dates edge case
  const output = [];

  records.forEach((record, index) => {
    const { _id, email, entryDate } = record;

    if (!recordsById[_id] && !recordsByEmail[email]) {
      // if both id and email are new
      recordsById[_id] = { data: { ...record }, index };
      recordsByEmail[email] = { data: { ...record }, index };
      output[index] = { ...record };
    } else {
      if (recordsById[_id]) {
        switch (_compareDates(entryDate, recordsById[_id].data.entryDate)) {
          case 'later': {
            // if id already exists and new record has newer date
            delete output[recordsById[_id].index];
            output[index] = { ...record };
            break;
          }
          case 'equal': {
            delete output[recordsById[_id].index];
            output[index] = { ...record };
            break;
          }
          default: break;
        }
      }

      if (recordsByEmail[email]) {
        switch (_compareDates(entryDate, recordsByEmail[email].data.entryDate)) {
          case 'later': {
            // if email already exists and new record has a newer date
            delete output[recordsByEmail[email].index];
            output[index] = { ...record };
            break;
          }
          case 'equal': {
            delete output[recordsByEmail[email].index];
            output[index] = { ...record };
            break;
          }
          default: break;
        }
      }
    }
  });

  return output.filter(e => !!e);
}

export default removeDuplicates;
