const IntCode = require("./IntCode");

module.exports = (data, sequences) => {
  const results = sequences.map(sequence => {
    return sequence.reduce((acc, input) => {
      const amplifier = new IntCode(data, [input, acc]);
      amplifier.run();
      return amplifier.consumeOutput();
    }, 0);
  });
  return results.sort((a, b) => a - b).pop();
};
