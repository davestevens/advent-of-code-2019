const IntCode = require("../9/IntCode");

const data = require("../load")("./17/input.txt", ",").map(datum =>
  Number(datum)
);

const SCAFFOLD = "#";

const ROBOT_UP = "^";
const ROBOT_DOWN = "v";
const ROBOT_LEFT = "<";
const ROBOT_RIGHT = ">";
const MOVEMENT_LEFT = "L";
const MOVEMENT_RIGHT = "R";

const printOutput = intCode => {
  let line = "";
  while ((output = intCode.consumeOutput())) {
    line += String.fromCharCode(output);
  }
  return line;
};

const buildMap = intCode => {
  const map = printOutput(intCode)
    .split("\n")
    .map(line => line.split(""));
  return { data: map, height: map.length, width: map[0].length };
};

const isScaffold = (x, y, map) => {
  if (x < 0 || x > map.width || y < 0 || y > map.height) {
    return false;
  }
  return map.data[y][x] === SCAFFOLD;
};

const part1 = () => {
  const intCode = new IntCode(data, []);

  do {
    intCode.run();
  } while (!intCode.isHalted);

  const map = buildMap(intCode);

  const intersections = [];
  for (let y = 0; y < map.height; ++y) {
    for (let x = 0; x < map.width; ++x) {
      if (isScaffold(x, y, map)) {
        if (
          isScaffold(x, y - 1, map) &&
          isScaffold(x, y + 1, map) &&
          isScaffold(x - 1, y, map) &&
          isScaffold(x + 1, y, map)
        ) {
          intersections.push({ x, y });
        }
      }
    }
  }

  return intersections.reduce(
    (acc, intersection) => acc + intersection.x * intersection.y,
    0
  );
};

const updateRobotDirection = (robot, map) => {
  switch (robot.direction) {
    case ROBOT_UP: {
      if (isScaffold(robot.x - 1, robot.y, map)) {
        robot.direction = ROBOT_LEFT;
        return MOVEMENT_LEFT;
      }
      if (isScaffold(robot.x + 1, robot.y, map)) {
        robot.direction = ROBOT_RIGHT;
        return MOVEMENT_RIGHT;
      }
      break;
    }
    case ROBOT_DOWN: {
      if (isScaffold(robot.x - 1, robot.y, map)) {
        robot.direction = ROBOT_LEFT;
        return MOVEMENT_RIGHT;
      }
      if (isScaffold(robot.x + 1, robot.y, map)) {
        robot.direction = ROBOT_RIGHT;
        return MOVEMENT_LEFT;
      }
      break;
    }
    case ROBOT_LEFT: {
      if (isScaffold(robot.x, robot.y - 1, map)) {
        robot.direction = ROBOT_UP;
        return MOVEMENT_RIGHT;
      }
      if (isScaffold(robot.x, robot.y + 1, map)) {
        robot.direction = ROBOT_DOWN;
        return MOVEMENT_LEFT;
      }
      break;
    }
    case ROBOT_RIGHT: {
      if (isScaffold(robot.x, robot.y - 1, map)) {
        robot.direction = ROBOT_UP;
        return MOVEMENT_LEFT;
      }
      if (isScaffold(robot.x, robot.y + 1, map)) {
        robot.direction = ROBOT_DOWN;
        return MOVEMENT_RIGHT;
      }
      break;
    }
  }
};

const updateRobotPosition = (robot, map) => {
  let count = 0;
  const move = () => {
    switch (robot.direction) {
      case ROBOT_UP: {
        if (isScaffold(robot.x, robot.y - 1, map)) {
          robot.y -= 1;
          return true;
        }
        return false;
      }
      case ROBOT_DOWN: {
        if (isScaffold(robot.x, robot.y + 1, map)) {
          robot.y += 1;
          return true;
        }
        return false;
      }
      case ROBOT_LEFT: {
        if (isScaffold(robot.x - 1, robot.y, map)) {
          robot.x -= 1;
          return true;
        }
        return false;
      }
      case ROBOT_RIGHT: {
        if (isScaffold(robot.x + 1, robot.y, map)) {
          robot.x += 1;
          return true;
        }
        return false;
      }
    }
  };

  while (move()) {
    count++;
  }
  return count;
};

const findFunctions = instructions => {
  for (let aStart = 0; aStart < instructions.length - 1; ++aStart) {
    for (let aEnd = aStart + 1; aEnd < aStart + 6 - 1; ++aEnd) {
      for (let bStart = 0; bStart < instructions.length - 1; ++bStart) {
        for (let bEnd = bStart + 1; bEnd < bStart + 6; ++bEnd) {
          for (let cStart = 0; cStart < instructions.length - 1; ++cStart) {
            for (let cEnd = cStart + 1; cEnd < cStart + 6; ++cEnd) {
              const A = instructions.slice(aStart, aEnd).join("");
              const B = instructions.slice(bStart, bEnd).join("");
              const C = instructions.slice(cStart, cEnd).join("");

              let all = instructions.join("");
              all = all.replace(new RegExp(A, "g"), "");
              all = all.replace(new RegExp(B, "g"), "");
              all = all.replace(new RegExp(C, "g"), "");

              if (all.length === 0) {
                let all = instructions.join("");
                all = all.replace(new RegExp(A, "g"), "A");
                all = all.replace(new RegExp(B, "g"), "B");
                all = all.replace(new RegExp(C, "g"), "C");

                return {
                  MAIN: all.split(""),
                  A: instructions.slice(aStart, aEnd),
                  B: instructions.slice(bStart, bEnd),
                  C: instructions.slice(cStart, cEnd)
                };
              }
            }
          }
        }
      }
    }
  }

  throw new Error("Couldn't find a solution");
};

const buildFunctions = () => {
  const intCode = new IntCode(data, []);
  do {
    intCode.run();
  } while (!intCode.isHalted);

  const map = buildMap(intCode);
  const robot = { x: 4, y: 0, direction: ROBOT_UP };

  let finished = false;
  const instructions = [];
  while (!finished) {
    const direction = updateRobotDirection(robot, map);
    const forward = updateRobotPosition(robot, map);
    if (forward > 0) {
      instructions.push(`${direction},${forward}`);
    } else {
      finished = true;
    }
  }

  return findFunctions(instructions);
};

const part2 = () => {
  const functions = buildFunctions();
  data[0] = 2;
  const intCode = new IntCode(data, []);

  const inputs = [
    functions.MAIN.join(",")
      .split("")
      .map(c => c.charCodeAt(0))
      .concat(10),
    functions.A.join(",")
      .split("")
      .map(c => c.charCodeAt(0))
      .concat(10),
    functions.B.join(",")
      .split("")
      .map(c => c.charCodeAt(0))
      .concat(10),
    functions.C.join(",")
      .split("")
      .map(c => c.charCodeAt(0))
      .concat(10),
    ["n"].map(c => c.charCodeAt(0)).concat(10)
  ];

  do {
    intCode.run();
    const input = inputs.shift();
    if (input) {
      input.forEach(i => intCode.addInput(i));
    }
  } while (!intCode.isHalted);

  return intCode._outputs.pop();
};

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
