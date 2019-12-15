const IntCode = require("../9/IntCode");

const data = require("../load")("./15/input.txt", ",").map(datum =>
  Number(datum)
);

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;
const DIRECTIONS = [NORTH, EAST, SOUTH, WEST];

const NO_CHANGE = 0;
const COMPELTE = 1;
const OXYGEN = 2;

const START = "%";
const WALL = "#";
const EXPLORED = ".";
const TARGET = "@";

const map = {};
let position = { x: 0, y: 0 };
let directionIndex = 0;

const updatedPosition = (position, directionIndex) => {
  switch (DIRECTIONS[directionIndex]) {
    case NORTH:
      return { x: position.x, y: position.y + 1 };
    case SOUTH:
      return { x: position.x, y: position.y - 1 };
    case WEST:
      return { x: position.x - 1, y: position.y };
    case EAST:
      return { x: position.x + 1, y: position.y };
    default:
      throw new Error(`Unknown direction: ${direction}`);
  }
};

const turnLeft = () => {
  directionIndex = (directionIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length;
};

const turnRight = () => {
  directionIndex = (directionIndex + 1 + DIRECTIONS.length) % DIRECTIONS.length;
};

let foundOxygen = false;

const intCode = new IntCode(data, []);
const key = `${position.x}:${position.y}`;
map[key] = START;

let move = 0;
const next = () => {
  if (++move % 2) {
    turnRight();
  } else {
    turnLeft();
  }
  intCode.addInput(DIRECTIONS[directionIndex]);
  intCode.run();

  const output = intCode.consumeOutput();
  switch (output) {
    case NO_CHANGE: {
      const pos = updatedPosition(position, directionIndex);
      const key = `${pos.x}:${pos.y}`;
      if (!map[key]) {
        map[key] = WALL;
      }
      if (!(move % 2)) {
        turnLeft();
      }
      break;
    }
    case COMPELTE: {
      position = updatedPosition(position, directionIndex);
      const key = `${position.x}:${position.y}`;
      if (!map[key]) {
        map[key] = EXPLORED;
      }
      if (move % 2) {
        turnRight();
      }
      break;
    }
    case OXYGEN: {
      position = updatedPosition(position, directionIndex);
      const key = `${position.x}:${position.y}`;
      if (!map[key]) {
        map[key] = TARGET;
      }
      foundOxygen = true;
      break;
    }
    default:
      throw new Error(`Unknows output: ${output}`);
  }
};

const exploreMap = () => {
  do {
    next();
  } while (!intCode.isHalted && !foundOxygen);
};

const checkSurroundings = (map, x, y) => {
  const toExplore = [];
  const key = `${x}:${y}`;
  const current = map[key];
  const distance = current.distance + 1;

  const positions = [
    `${x}:${y + 1}`,
    `${x}:${y - 1}`,
    `${x + 1}:${y}`,
    `${x - 1}:${y}`
  ];
  positions.forEach(position => {
    if (map[position] && map[position].value !== WALL) {
      if (map[position].distance === -1 || map[position].distance > distance) {
        map[position].distance = distance;
        toExplore.push(position.split(":").map(Number));
      }
    }
  });
  return toExplore;
};

const calculateDistances = () => {
  let distance = 0;
  const mapWithDistances = Object.keys(map).reduce(
    (acc, key) => ({
      ...acc,
      [key]: { value: map[key], distance: -1 }
    }),
    {}
  );
  let [x, y] = Object.keys(mapWithDistances)
    .find(key => mapWithDistances[key].value === TARGET)
    .split(":")
    .map(Number);
  mapWithDistances[`${x}:${y}`].distance = distance;

  const toExplore = checkSurroundings(mapWithDistances, x, y);
  while (toExplore.length) {
    const current = toExplore.shift();
    toExplore.push(...checkSurroundings(mapWithDistances, ...current));
  }

  return mapWithDistances;
};

const part1 = () => {
  const mapWithDistances = calculateDistances();
  return mapWithDistances["0:0"].distance;
};

const part2 = () => {
  const mapWithDistances = calculateDistances();

  const sortedKeys = Object.keys(mapWithDistances).sort(
    (a, b) => mapWithDistances[b].distance - mapWithDistances[a].distance
  );
  return mapWithDistances[sortedKeys[0]].distance;
};

exploreMap();
console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
