const data = require("../load")("./5/input.txt", ",").map(datum =>
  Number(datum)
);

const ADD = "01";
const MULT = "02";
const INPUT = "03";
const OUTPUT = "04";
const JMPT = "05";
const JMPF = "06";
const CMPLT = "07";
const CMPEQ = "08";
const HALT = "99";

const run = inputReturnValue => {
  const memory = data.slice(0);
  const outputs = [];
  let pointer = 0;

  const next = () => memory[pointer++];
  const getValue = setting => (setting === "1" ? next() : memory[next()]);

  const tick = () => {
    const instruction = next()
      .toString()
      .padStart(5, "0");
    let op = instruction.slice(-2);
    switch (op) {
      case ADD: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        const c = next();
        memory[c] = a + b;
        break;
      }
      case MULT: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        const c = next();
        memory[c] = a * b;
        break;
      }
      case INPUT: {
        const a = next();
        memory[a] = inputReturnValue;
        break;
      }
      case OUTPUT: {
        const a = getValue(instruction[2]);
        outputs.push(a);
        break;
      }
      case JMPT: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        if (a != 0) {
          pointer = b;
        }
        break;
      }
      case JMPF: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        if (a == 0) {
          pointer = b;
        }
        break;
      }
      case CMPLT: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        const c = next();
        memory[c] = a < b ? 1 : 0;
        break;
      }
      case CMPEQ: {
        const a = getValue(instruction[2]);
        const b = getValue(instruction[1]);
        const c = next();
        memory[c] = a == b ? 1 : 0;
        break;
      }
      case HALT: {
        break;
      }
      default:
        console.warn("Unknown op", pointer, memory[pointer]);
        op = HALT;
    }

    return op;
  };

  while (tick() !== HALT) {}

  return outputs;
};

const part1 = run(1);
console.log(`part 1: ${part1.pop()}`);
const part2 = run(5);
console.log(`part 2: ${part2.pop()}`);
