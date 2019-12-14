const data = require("../load")("./14/input.txt", "\n");

let chemicalStore = {};

class Chemical {
  constructor(inputs, outputAmount) {
    this._inputs = inputs;
    this._outputAmount = outputAmount;
    this._reserve = 0;
    this._created = 0;
  }

  get created() {
    return this._created;
  }

  create(requestedAmount) {
    if (this._reserve >= requestedAmount) {
      this._reserve -= requestedAmount;
      return;
    }
    this._make(
      Math.ceil((requestedAmount - this._reserve) / this._outputAmount)
    );
    this._reserve -= requestedAmount;
  }

  _make(count) {
    this._inputs.forEach(input => {
      chemicalStore[input.chemical].create(input.count * count);
    });
    this._created += count * this._outputAmount;
    this._reserve += count * this._outputAmount;
  }
}

const inputToObject = input => {
  const [count, chemical] = input.trim().split(/\s+/);
  return { count: Number(count), chemical };
};
chemicalStore = data.reduce((acc, datum) => {
  const [lhs, rhs] = datum.split(/\s*=>\s*/);

  const inputs = lhs.split(/\s*,\s*/).map(inputToObject);
  const output = inputToObject(rhs);
  return {
    ...acc,
    [output.chemical]: new Chemical(inputs, output.count)
  };
}, {});
chemicalStore["ORE"] = new Chemical([], 1);

chemicalStore["FUEL"].create(1);
console.log(`part 1: ${chemicalStore["ORE"].created}`);

const targetOre = 1000000000000;
const estimateFuel = (targetOre / chemicalStore["ORE"].created) | 0;
chemicalStore["FUEL"].create(estimateFuel - 1);
do {
  chemicalStore["FUEL"].create(1);
} while (chemicalStore["ORE"].created <= targetOre);

console.log(`part 2: ${chemicalStore["FUEL"].created - 1}`);
