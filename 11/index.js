const IntCode = require("../9/IntCode");

const data = require("../load")("./11/input.txt", ",").map(datum =>
  Number(datum)
);

const BLACK = 0;
const WHITE = 1;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const ROTATE_LEFT = 0;
const ROTATE_RIGHT = 1;

class Grid {
  constructor() {
    this.reset();
  }

  getColor({ x, y }) {
    const key = `${x}-${y}`;
    return this._items[key] || BLACK;
  }

  paint({ x, y }, color) {
    const key = `${x}-${y}`;
    this._items[key] = color;
  }

  countPainted() {
    return Object.keys(this._items).length;
  }

  reset() {
    this._items = {};
  }
}

class Robot {
  constructor() {
    this.reset();
  }

  get position() {
    return this._position;
  }

  rotate(direction) {
    switch (direction) {
      case ROTATE_LEFT:
        this._direction = (this._direction - 1 + 4) % 4;
        break;
      case ROTATE_RIGHT:
        this._direction = (this._direction + 1) % 4;
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }
    this.move();
  }

  move() {
    switch (this._direction) {
      case UP:
        this._position.y++;
        break;
      case RIGHT:
        this._position.x++;
        break;
      case DOWN:
        this._position.y--;
        break;
      case LEFT:
        this._position.x--;
        break;
      default:
        throw new Error(`Unknown direction: ${this._direction}`);
    }
  }

  reset() {
    this._position = { x: 0, y: 0 };
    this._direction = UP;
  }
}

const runCode = () => {
  const intCode = new IntCode(data, []);
  do {
    intCode.addInput(grid.getColor(robot.position));
    intCode.run();
    const color = intCode.consumeOutput();
    grid.paint(robot.position, color);
    const direction = intCode.consumeOutput();
    robot.rotate(direction);
  } while (!intCode.isHalted);
};

const grid = new Grid();
const robot = new Robot();

runCode();
console.log(`part 1: ${grid.countPainted()}`);

grid.reset();
grid.paint({ x: 0, y: 0 }, WHITE);
robot.reset();
runCode();

const rows = [];
for (let y = 0; y >= -5; --y) {
  const pixels = [];
  for (let x = 0; x < 41; ++x) {
    const value = grid.getColor({ x, y });
    pixels.push(value === WHITE ? "█" : " ");
  }
  rows.push(pixels.join(""));
}
const draw = rows.join("\n");
console.log(`part 2:\n${draw}`);
