const data = require("../load")("./2/input.txt", ",").map(datum =>
  Number(datum)
);

const run = (noun, verb) => {
  const memory = data.slice(0);
  memory[1] = noun;
  memory[2] = verb;

  let pointer = 0;
  while (memory[pointer] !== 99) {
    switch (memory[pointer]) {
      case 1: {
        const a = memory[pointer + 1];
        const b = memory[pointer + 2];
        const out = memory[pointer + 3];
        memory[out] = memory[a] + memory[b];
        break;
      }
      case 2: {
        const a = memory[pointer + 1];
        const b = memory[pointer + 2];
        const out = memory[pointer + 3];
        memory[out] = memory[a] * memory[b];
        break;
      }
      default:
        console.warn("Unknown op", pointer, memory[pointer]);
    }
    pointer += 4;
  }

  return memory[0];
};

const find = value => {
  for (let noun = 0; noun < 100; ++noun) {
    for (let verb = 0; verb < 100; ++verb) {
      const output = run(noun, verb);
      if (output === value) {
        return [noun, verb];
      }
    }
  }
};

console.log(`part 1: ${run(12, 2)}`);
const [noun, verb] = find(19690720);
console.log(`part 2: ${100 * noun + verb}`);
