// IntCode Ops
const ADD = "01";
const MULT = "02";
const INPUT = "03";
const OUTPUT = "04";
const JMPT = "05";
const JMPF = "06";
const CMPLT = "07";
const CMPEQ = "08";
const ADJREL = "09";
const HALT = "99";

// IntCode states
const RUNNING = "RUNNING";
const HALTED = "HALTED";
const WAITING = "WAITING";

const IMMEDIATE = "IMMEDIATE";
const POSITION = "POSITION";
const RELATIVEPOSITION = "RELATIVEPOSITION";
const PARAMETER_MODES = [POSITION, IMMEDIATE, RELATIVEPOSITION];

class IntCode {
  constructor(program, inputs) {
    this._memory = program.slice(0);
    this._pointer = 0;
    this._inputs = inputs;
    this._state = WAITING;
    this._outputs = [];
    this._relativeBase = 0;
  }

  run() {
    this._state = RUNNING;
    while (this.state === RUNNING) {
      this._cycle();
    }
  }

  addInput(input) {
    this._inputs.push(input);
  }

  consumeOutput() {
    return this._outputs.shift();
  }

  get state() {
    return this._state;
  }

  get isHalted() {
    return this._state === HALTED;
  }

  _cycle() {
    const currentPointer = this._pointer;
    const instruction = this._getValue(IMMEDIATE)
      .toString()
      .padStart(5, "0");
    const op = instruction.slice(-2);
    const parameterModes = instruction
      .slice(0, 3)
      .split("")
      .reverse()
      .map(mode => PARAMETER_MODES[Number(mode)]);
    switch (op) {
      case ADD: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        const c = this._getAddress(parameterModes[2]);
        this._memory[c] = a + b;
        break;
      }
      case MULT: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        const c = this._getAddress(parameterModes[2]);
        this._memory[c] = a * b;
        break;
      }
      case INPUT: {
        if (this._inputs.length) {
          const a = this._getAddress(parameterModes[0]);
          this._memory[a] = this._inputs.shift();
        } else {
          this._state = WAITING;
          this._pointer = currentPointer;
        }
        break;
      }
      case OUTPUT: {
        const a = this._getValue(parameterModes[0]);
        this._outputs.push(a);
        break;
      }
      case JMPT: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        if (a != 0) {
          this._pointer = b;
        }
        break;
      }
      case JMPF: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        if (a == 0) {
          this._pointer = b;
        }
        break;
      }
      case CMPLT: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        const c = this._getAddress(parameterModes[2]);
        this._memory[c] = a < b ? 1 : 0;
        break;
      }
      case CMPEQ: {
        const a = this._getValue(parameterModes[0]);
        const b = this._getValue(parameterModes[1]);
        const c = this._getAddress(parameterModes[2]);
        this._memory[c] = a == b ? 1 : 0;
        break;
      }
      case ADJREL: {
        const a = this._getValue(parameterModes[0]);
        this._relativeBase += a;
        break;
      }
      case HALT: {
        this._state = HALTED;
        break;
      }
      default:
        console.warn("Unknown op", this._pointer, this._memory[this._pointer]);
        this._state = HALTED;
    }
  }

  _getValue(mode) {
    const value = this._next();
    switch (mode) {
      case IMMEDIATE:
        return value;
      case POSITION:
        return this._memory[value];
      case RELATIVEPOSITION:
        return this._memory[value + this._relativeBase];
      default:
        throw new Error(`Trying to get value with unknown mode: ${mode}`);
    }
  }

  _getAddress(mode) {
    const value = this._next();
    switch (mode) {
      case POSITION:
        return value;
      case RELATIVEPOSITION:
        return value + this._relativeBase;
      default:
        throw new Error(`Trying to get address with unknown mode: ${mode}`);
    }
  }

  _next() {
    return this._memory[this._pointer++];
  }
}

module.exports = IntCode;
