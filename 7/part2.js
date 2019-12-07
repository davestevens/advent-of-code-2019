const IntCode = require("./IntCode");

module.exports = (data, sequences) => {
  const initalInput = 0;
  const results = sequences.map(sequence => {
    const amplifiers = [
      new IntCode(data, [sequence[0]]),
      new IntCode(data, [sequence[1]]),
      new IntCode(data, [sequence[2]]),
      new IntCode(data, [sequence[3]]),
      new IntCode(data, [sequence[4]])
    ];

    do {
      amplifiers.forEach((amplifier, index) => {
        const prev = (index - 1 + amplifiers.length) % amplifiers.length;
        const input = amplifiers[prev].consumeOutput() || initalInput;
        amplifier.addInput(input);
        amplifier.run();
      });
    } while (
      !amplifiers.reduce((acc, amplifier) => acc || amplifier.isHalted, false)
    );

    return amplifiers[4].consumeOutput();
  });

  return results.sort((a, b) => a - b).pop();
};
