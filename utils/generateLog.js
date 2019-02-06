function generateLog(log) {
  const { changes, sourceRecord, outputRecord } = log;
  const logEntries = [
    `Source Collection:\n${JSON.stringify(sourceRecord, null, 1)}\n`,
    ...changes,
    `\nOutput Collection:\n${JSON.stringify(outputRecord, null, 1)}`,
  ];

  return logEntries.join('\n');
}

export default generateLog;
