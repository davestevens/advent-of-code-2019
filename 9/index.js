const IntCode = require("./IntCode");

const data = require("../load")("./9/input.txt", ",").map(datum =>
  Number(datum)
);

const part1 = new IntCode(data, [1]);
part1.run();
console.log(`part 1: ${part1.consumeOutput()}`);

const part2 = new IntCode(data, [2]);
part2.run();
console.log(`part 2: ${part2.consumeOutput()}`);
