const part1 = require("./part1");
const part2 = require("./part2");

const data = require("../load")("./7/input.txt", ",").map(datum =>
  Number(datum)
);

const allPermutations = start => {
  const permutations = [];
  const length = start.length - 1;

  const permute = (input, start) => {
    if (start == length) {
      permutations.push(input.slice(0));
    }
    for (let i = start; i <= length; ++i) {
      const a = input[i];
      const b = input[start];
      input[i] = b;
      input[start] = a;
      permute(input, start + 1);
      input[i] = a;
      input[start] = b;
    }
  };

  permute(start, 0);

  return permutations;
};

console.log(`part 1: ${part1(data, allPermutations([0, 1, 2, 3, 4]))}`);
console.log(`part 2: ${part2(data, allPermutations([5, 6, 7, 8, 9]))}`);
