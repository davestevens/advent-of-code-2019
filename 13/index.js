const IntCode = require("../9/IntCode");

const data = require("../load")("./13/input.txt", ",").map(datum =>
  Number(datum)
);

const EMPTY = 0;
const WALL = 1;
const BLOCK = 2;
const PADDLE = 3;
const BALL = 4;

const JOYSTICK_NEUTRAL = 0;

const part1 = () => {
  const intCode = new IntCode(data, []);
  do {
    intCode.run();
  } while (!intCode.isHalted);
  const outputs = intCode._outputs;

  const screen = {};
  for (let i = 0; i < outputs.length; i += 3) {
    const x = outputs[i];
    const y = outputs[i + 1];
    const z = outputs[i + 2];
    screen[`${x}-${y}`] = z;
  }
  return Object.keys(screen).filter(key => screen[key] === BLOCK).length;
};

const getScore = outputs => {
  for (let i = 0; i < outputs.length; i += 3) {
    const x = outputs[i];
    const y = outputs[i + 1];
    const z = outputs[i + 2];
    if (x === -1 && y === 0) {
      return z;
    }
  }
};

const part2 = () => {
  let score = 0;
  const hackedData = data.slice(0);
  hackedData[0] = 2;
  for (let i = 1601; i < 1638; ++i) {
    hackedData[i] = PADDLE;
  }
  const intCode = new IntCode(hackedData, []);

  do {
    intCode.run();
    score = getScore(intCode._outputs);
    intCode._outputs = [];
    intCode.addInput(JOYSTICK_NEUTRAL);
  } while (!intCode.isHalted);
  return score;
};

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
