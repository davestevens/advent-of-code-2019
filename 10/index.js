const data = require("../load")("./10/input.txt", "\n").map(datum =>
  datum.split("")
);

const EMPTY = ".";
const ASTERIOD = "#";

const findOthers = (x1, y1) => {
  const all = [];
  for (let y = 0; y < data.length; ++y) {
    for (let x = 0; x < data[y].length; ++x) {
      if (data[y][x] !== ASTERIOD) {
        continue;
      }
      const distance = Math.abs(x1 - x) + Math.abs(y1 - y);
      const angle =
        ((Math.atan2(y1 - y, x1 - x) * 180) / Math.PI - 90 + 360) % 360;
      all.push({
        x,
        y,
        distance,
        angle
      });
    }
  }

  return all.reduce((acc, asteriod) => {
    if (asteriod.distance === 0) {
      return acc;
    }
    const current = acc[asteriod.angle];
    if (current) {
      if (current.distance > asteriod.distance) {
        acc[asteriod.angle] = asteriod;
      }
    } else {
      acc[asteriod.angle] = asteriod;
    }
    return acc;
  }, {});
};

const map = {};
for (let y = 0; y < data.length; ++y) {
  for (let x = 0; x < data[y].length; ++x) {
    if (data[y][x] === ASTERIOD) {
      map[`${x}-${y}`] = findOthers(x, y);
    }
  }
}

const sorted = Object.keys(map).sort((keyA, keyB) => {
  const asteroidA = map[keyA];
  const asteroidB = map[keyB];
  return Object.keys(asteroidB).length - Object.keys(asteroidA).length;
});

const location = sorted[0];

console.log(`part 1: ${Object.keys(map[location]).length}`);

const vaporizedLimit = 200;
const vaporized = [];
const [x, y] = location.split("-").map(Number);

while (vaporized.length <= vaporizedLimit) {
  const closest = findOthers(x, y);
  Object.keys(closest)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(angle => {
      const current = map[location][angle];
      data[current.y][current.x] = EMPTY;
      vaporized.push(current.x * 100 + current.y);
    });
}

console.log(`part 2: ${vaporized[vaporizedLimit - 1]}`);
