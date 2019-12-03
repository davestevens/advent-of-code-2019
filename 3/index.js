const data = require("../load")("./3/input.txt", "\n").map(datum =>
  datum.split(",")
);

const instructionRegEx = /(\w)(-?\d+)/;

const run = input => {
  const maps = [{}, {}];
  let intersections = [];
  const visit = (x, y, line, distance) => {
    const key = `${x}:${y}`;
    maps[line][key] = maps[line][key] || distance;
    if (line === 1) {
      maps[line][key] = maps[line][key] || distance;
      if (maps[0][key]) {
        intersections.push(key);
      }
    }
  };

  input.forEach((instructions, line) => {
    let x = 0;
    let y = 0;
    let distance = 0;
    instructions.forEach(instruction => {
      const match = instruction.match(instructionRegEx);
      if (!match) {
        throw new Error(`Unknown instruction: ${instruction}`);
      }
      let steps = Number(match[2]);
      const run = callback => {
        while (steps--) {
          callback();
          visit(x, y, line, ++distance);
        }
      };
      switch (match[1]) {
        case "U":
          run(() => y++);
          break;
        case "D":
          run(() => y--);
          break;
        case "R":
          run(() => x++);
          break;
        case "L":
          run(() => x--);
          break;
        default:
          throw new Error(`Unknown op: ${match[1]}`);
      }
    });
  });

  const results = intersections.map(key => {
    const position = key.split(":").map(c => Number(c));
    return {
      key,
      distance: Math.abs(position[0]) + Math.abs(position[1]),
      score: maps[0][key] + maps[1][key]
    };
  });

  return {
    distance: Math.min(...results.map(result => result.distance)),
    score: Math.min(...results.map(result => result.score))
  };
};

const output = run(data);
console.log(`part 1: ${output.distance}`);
console.log(`part 2: ${output.score}`);
