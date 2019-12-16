const data = require("../load")("./16/input.txt");

const basePattern = [0, 1, 0, -1];

const fft = signal => {
    return signal.map((_, index) => {
      let value = 0;
      if (index > signal.length / 2) {
        for (let j = index; j < signal.length; ++j) {
          value += signal[j];
        }
      } else {
        for (let j = index; j < signal.length; ++j) {
          const patternIndex =
            Math.floor((j + 1) / (index + 1)) % basePattern.length;
          value += +(signal[j] * basePattern[patternIndex]);
        }
      }
      return Number(
        value
          .toString()
          .split("")
          .pop()
      );
    });
  };

const run = (input, phases) => {
  let signal = input.split("").map(Number);
  for (let p = 0; p < phases; ++p) {
    signal = fft(signal);
  }
  return signal.join("");
};

const part1 = () => {
  const output = run(data, 100);
  return output.toString().slice(0, 8);
};

const part2Slow = () => {
  const offset = +data.slice(0, 7);
  const output = run(data.repeat(10000), 100);
  return output.toString().slice(offset, offset + 8);
};

const part2 = () => {
    const offset = +data.slice(0, 7);
    const input = data.repeat(10000).slice(offset).split("").map(Number);
    for (let i = 0; i < 100; ++i) {
        for (let j = input.length - 1 ; j >= 0; --j) {
            input[j] = Number(((input[j + 1] || 0) + input[j]).toString().split("").pop());
        }
    }
    return input.slice(0, 8).join("");
  };

console.log(`part 1: ${part1()}`);
// console.log(`part 2: ${part2Slow()}`);
console.log(`part 2: ${part2()}`);
