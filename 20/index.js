const data = require("../load")("./20/input.txt", "\n").map(line =>
  line.split("")
);

const WALL = "#";
const TILE = ".";
const PORTAL = "@";

const portals = {};
const map = {};

const getSurroundingTile = (x, y) => {
  const surround = [
    {
      x,
      y: y - 1,
      name: [
        { x, y },
        { x, y: y + 1 }
      ]
    },
    {
      x,
      y: y + 1,
      name: [
        { x, y: y - 1 },
        { x, y }
      ]
    },
    {
      x: x - 1,
      y,
      name: [
        { x, y },
        { x: x + 1, y }
      ]
    },
    {
      x: x + 1,
      y,
      name: [
        { x: x - 1, y },
        { x, y }
      ]
    }
  ];
  return surround.find(coord => {
    return data[coord.y] && data[coord.y][coord.x] === TILE;
  });
};

const PORTAL_REGEX = /[A-Z]/;

let start;
let end;

for (let y = 0; y < data.length; ++y) {
  for (let x = 0; x < data[y].length; ++x) {
    const key = `${x}:${y}`;
    const current = data[y][x];
    if (current === WALL) {
      map[key] = WALL;
    } else if (current === TILE) {
      map[key] = TILE;
    } else if (PORTAL_REGEX.test(current)) {
      const tile = getSurroundingTile(x, y);
      if (tile) {
        const portalName = tile.name.map(({ x, y }) => data[y][x]).join("");
        if (portalName === "AA") {
          map[key] = WALL;
          start = [tile.x, tile.y];
        } else if (portalName === "ZZ") {
          map[key] = WALL;
          end = [tile.x, tile.y];
        } else {
          map[key] = PORTAL;
          portals[key] = portalName;
        }
      }
    }
  }
}

const takePortal = (name, x, y) => {
  const inputKey = `${x}:${y}`;
  const output = Object.keys(portals).find(
    key => portals[key] === name && key !== inputKey
  );
  if (output) {
    return output.split(":").map(Number);
  }
  throw new Error(`Could not find portal for: ${name} - ${x},${y}`);
};

const getPortalName = (x, y) => {
  const key = `${x}:${y}`;
  return portals[key];
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
    if (!map[position]) {
      return;
    }
    const [x, y] = position.split(":").map(Number);
    if (map[position].value === TILE) {
      if (map[position].distance === -1 || map[position].distance > distance) {
        map[position].distance = distance;
        toExplore.push([x, y]);
      }
    }
    if (map[position].value === PORTAL) {
      const otherSide = takePortal(getPortalName(x, y), x, y);
      position = `${otherSide[0]}:${otherSide[1]}`;
      if (map[position].distance === -1 || map[position].distance > distance) {
        map[position].distance = distance - 1;
        toExplore.push([otherSide[0], otherSide[1]]);
      }
    }
  });
  return toExplore;
};

const calculateDistances = (x, y) => {
  let distance = 0;
  const mapWithDistances = Object.keys(map).reduce(
    (acc, key) => ({
      ...acc,
      [key]: { value: map[key], distance: -1 }
    }),
    {}
  );

  mapWithDistances[`${x}:${y}`].distance = distance;
  const toExplore = checkSurroundings(mapWithDistances, x, y);
  while (toExplore.length) {
    const current = toExplore.shift();
    toExplore.push(...checkSurroundings(mapWithDistances, ...current));
  }

  return mapWithDistances;
};

const part1 = () => {
  const distances = calculateDistances(...start);
  return distances[`${end[0]}:${end[1]}`].distance;
};

console.log(`part 1: ${part1()}`);
