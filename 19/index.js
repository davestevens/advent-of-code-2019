const IntCode = require("../9/IntCode");

const data = require("../load")("./19/input.txt", ",").map(datum =>
  Number(datum)
);

const getAt = (x, y) => {
  const intCode = new IntCode(data.slice(0), [x, y]);
  intCode.run();
  return intCode.consumeOutput();
};

const part1 = () => {
  let affected = 0;
  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      affected += getAt(x, y);
    }
  }
  return affected;
};

const firstAffectedColumn = y => {
  for (let x = 0; x < 2000; x++) {
    if (getAt(x, y) === 1) {
      return x;
    }
  }
  return -1;
};

const lastAffectedColumn = y => {
  for (let x = 2000; x >= 0; --x) {
    if (getAt(x, y) === 1) {
      return x;
    }
  }
  return -1;
};

const search = (diff, min, max) => {
  const y = Math.floor((max - min) / 2) + min;
  const topRight = { x: lastAffectedColumn(y), y };
  const bottomLeft = {
    x: firstAffectedColumn(y + diff),
    y: y + diff
  };

  if (topRight.x === -1) {
    return -1;
  }

  if (bottomLeft.x > topRight.x || bottomLeft.x > topRight.x - diff) {
    return search(diff, y, max);
  }

  if (bottomLeft.x < topRight.x - diff) {
    return search(diff, min, y);
  }

  return { topRight, bottomLeft };
};

const part2 = size => {
  const diff = size - 1;
  const { topRight } = search(diff, 0, 900);
  return (topRight.x - diff) * 10000 + topRight.y;
};

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2(100)}`);
