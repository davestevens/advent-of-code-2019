// IntCode Ops
const ADD = "01";
const MULT = "02";
const INPUT = "03";
const OUTPUT = "04";
const JMPT = "05";
const JMPF = "06";
const CMPLT = "07";
const CMPEQ = "08";
const HALT = "99";

// IntCode states
const RUNNING = "RUNNING";
const HALTED = "HALTED";
const WAITING = "WAITING";

class IntCode {
  constructor(program, inputs) {
    this._memory = program.slice(0);
    this._pointer = 0;
    this._inputs = inputs;
    this._state = WAITING;
    this._outputs = [];
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
    const instruction = this._next()
      .toString()
      .padStart(5, "0");
    let op = instruction.slice(-2);
    switch (op) {
      case ADD: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        const c = this._next();
        this._memory[c] = a + b;
        break;
      }
      case MULT: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        const c = this._next();
        this._memory[c] = a * b;
        break;
      }
      case INPUT: {
        if (this._inputs.length) {
          const a = this._next();
          this._memory[a] = this._inputs.shift();
        } else {
          this._state = WAITING;
          this._pointer = currentPointer;
        }
        break;
      }
      case OUTPUT: {
        const a = this._getValue(instruction[2]);
        this._outputs.push(a);
        break;
      }
      case JMPT: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        if (a != 0) {
          this._pointer = b;
        }
        break;
      }
      case JMPF: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        if (a == 0) {
          this._pointer = b;
        }
        break;
      }
      case CMPLT: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        const c = this._next();
        this._memory[c] = a < b ? 1 : 0;
        break;
      }
      case CMPEQ: {
        const a = this._getValue(instruction[2]);
        const b = this._getValue(instruction[1]);
        const c = this._next();
        this._memory[c] = a == b ? 1 : 0;
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

  _next() {
    return this._memory[this._pointer++];
  }

  _getValue(setting) {
    return setting === "1" ? this._next() : this._memory[this._next()];
  }
}

module.exports = IntCode;
