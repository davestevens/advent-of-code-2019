const data = require("../load")("./4/input.txt", "-").map(datum =>
  Number(datum)
);

const isValid = (input, adjacents) => {
  const values = input
    .toString()
    .split("")
    .map(c => Number(c));
  const counts = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  for (let i = 1; i < values.length; ++i) {
    if (values[i - 1] > values[i]) {
      return false;
    }
  }
  const intersection = Object.values(counts).filter(x => adjacents.includes(x));
  return intersection.length > 0;
};

let part1 = 0;
let part2 = 0;
const part1Adjacents = [2, 3, 4, 5, 6];
const part2Adjacents = [2];
for (let i = data[0]; i < data[1]; ++i) {
  if (isValid(i, part1Adjacents)) {
    part1++;
  }
  if (isValid(i, part2Adjacents)) {
    part2++;
  }
}
console.log(`part 1: ${part1}`);
console.log(`part 2: ${part2}`);
