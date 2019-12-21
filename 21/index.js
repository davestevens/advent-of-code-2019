const IntCode = require("../9/IntCode");

const data = require("../load")("./21/input.txt", ",").map(datum =>
  Number(datum)
);

const part1 = `OR D J
OR A T
AND B T
AND C T
NOT T T
AND T J
WALK`;

const part2 = `OR D J
OR A T
AND B T
AND C T
NOT T T
AND T J
AND E T
OR H T
AND T J
RUN`;

const run = script => {
  const intCode = new IntCode(data, []);
  do {
    intCode.run();
    script.split("\n").forEach(line => {
      line
        .split("")
        .map(c => c.charCodeAt(0))
        .concat(10)
        .forEach(i => intCode.addInput(i));
    });
  } while (!intCode.isHalted);
  return intCode._outputs.pop();
};

console.log(`part 1: ${run(part1)}`);
console.log(`part 2: ${run(part2)}`);
