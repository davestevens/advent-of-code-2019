const inputRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
const inputParser = input => {
  const match = input.match(inputRegex);
  if (!match) {
    throw new Error(`Can't parse input: ${input}`);
  }
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    z: Number(match[3])
  };
};
const data = require("../load")("./12/input.txt", "\n").map(inputParser);

class Vector {
  constructor(x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
  }
  get energy() {
    return Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z);
  }

  update(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  reset() {
    this.update(0, 0, 0);
  }

  anyZero() {
    return this._x === 0 || this._y === 0 || this._z === 0;
  }
}

const clamp = (input, min, max) => Math.min(Math.max(input, min), max);

class Moon {
  constructor({ x, y, z }) {
    this._position = new Vector(x, y, z);
    this._velocity = new Vector(0, 0, 0);
    this._gravity = new Vector(0, 0, 0);
    this._change;
  }

  get x() {
    return this._position.x;
  }
  get y() {
    return this._position.y;
  }
  get z() {
    return this._position.z;
  }
  get position() {
    return this._position;
  }
  get velocity() {
    return this._velocity;
  }
  get gravity() {
    return this._gravity;
  }
  get energy() {
    return this._position.energy * this._velocity.energy;
  }

  updateGravity(otherMoon) {
    this._gravity.update(
      this._gravity.x + clamp(otherMoon.x - this.x, -1, 1),
      this._gravity.y + clamp(otherMoon.y - this.y, -1, 1),
      this._gravity.z + clamp(otherMoon.z - this.z, -1, 1)
    );
  }

  update() {
    this._applyGravity();
    this._applyVelocity();
  }

  _applyGravity() {
    this._velocity.update(
      this._velocity.x + this._gravity.x,
      this._velocity.y + this._gravity.y,
      this._velocity.z + this._gravity.z
    );
    this._gravity.reset();
  }

  _applyVelocity() {
    this._position.update(
      this._position.x + this._velocity.x,
      this._position.y + this._velocity.y,
      this._position.z + this._velocity.z
    );
  }

  _calculateEnergy(vector) {
    return vector.x + vector.y + vector.z;
  }
}

const step = moons => {
  for (let i = 0; i < moons.length; ++i) {
    for (let j = i + 1; j < moons.length; ++j) {
      moons[i].updateGravity(moons[j]);
      moons[j].updateGravity(moons[i]);
    }
  }
  moons.forEach(moon => moon.update());
};

const part1 = () => {
  const moons = data.map(datum => new Moon(datum));
  for (let i = 0; i < 1000; ++i) {
    step(moons);
  }
  return moons.reduce((acc, moon) => acc + moon.energy, 0);
};
console.log(`part 1: ${part1()}`);

const equalForAxis = (axis, current, originals) => {
  return current.reduce((acc, moon, index) => {
    return (
      acc &&
      moon.position[axis] === originals[index].position[axis] &&
      moon.velocity[axis] === originals[index].velocity[axis]
    );
  }, true);
};

const leastCommonMultiple = numbers => {
  const greatestCommonDivisor = (a, b) => {
    if (b == 0) return a;
    return greatestCommonDivisor(b, a % b);
  };
  return numbers.reduce(
    (acc, number) => (acc * number) / greatestCommonDivisor(acc, number),
    numbers[0]
  );
};

const part2 = () => {
  const moons = data.map(datum => new Moon(datum));
  const originals = data.map(datum => new Moon(datum));
  const axisLoops = new Vector(0, 0, 0);

  let stepCount = 0;
  while (axisLoops.anyZero()) {
    step(moons);
    stepCount++;

    if (axisLoops.x === 0 && equalForAxis("x", moons, originals)) {
      axisLoops.x = stepCount;
    }
    if (axisLoops.y === 0 && equalForAxis("y", moons, originals)) {
      axisLoops.y = stepCount;
    }
    if (axisLoops.z === 0 && equalForAxis("z", moons, originals)) {
      axisLoops.z = stepCount;
    }
  }

  return leastCommonMultiple([axisLoops.x, axisLoops.y, axisLoops.z]);
};
console.log(`part 2: ${part2()}`);
