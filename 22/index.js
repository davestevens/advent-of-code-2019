const INCREMENT = /deal with increment (-?\d+)/;
const NEW_STACK = /deal into new stack/;
const CUT = /cut (-?\d+)/;

const increment = value => {
  return array => {
    const output = [];
    let current = 0;
    array.forEach(element => {
      output[current] = element;
      current = (current + value) % array.length;
    });
    return output;
  };
};

const newStack = () => {
  return array => array.reverse();
};

const cut = value => {
  return array => {
    if (value > 0) {
      return array.slice(value).concat(array.slice(0, value));
    } else {
      return array.slice(value).concat(array.slice(0, array.length + value));
    }
  };
};

const instructions = require("../load")("./22/input.txt", "\n").map(
  instruction => {
    let match;
    match = instruction.match(NEW_STACK);
    if (match) {
      return newStack();
    }
    match = instruction.match(INCREMENT);
    if (match) {
      return increment(Number(match[1]));
    }
    match = instruction.match(CUT);
    if (match) {
      return cut(Number(match[1]));
    }
    throw new Error(`Unknown instruction: ${instruction}`);
  }
);

const createDeck = size => {
  const deck = [];
  for (let i = 0; i < size; ++i) {
    deck.push(i);
  }
  return deck;
};

const part1 = () => {
  const shuffled = instructions.reduce(
    (acc, instruction) => instruction(acc),
    createDeck(10007)
  );
  return shuffled.indexOf(2019);
};

console.log(`part 1: ${part1()}`);
