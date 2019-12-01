const data = require("../load")("./1/input.txt", "\n");

const calculateFuel = mass => Math.max(Math.floor(mass / 3) - 2, 0);

// Part 1
const part1 = data.reduce((memo, datum) => memo + calculateFuel(datum), 0);
console.log(`part 1: ${part1}`);

// Part 2
const total = input => {
  const value = calculateFuel(input);
  return value ? value + total(value) : value;
};
const part2 = data.reduce((memo, datum) => memo + total(datum), 0);
console.log(`part 2: ${part2}`);
