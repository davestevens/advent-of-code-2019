const data = require("../load")("./8/input.txt", "").map(datum =>
  Number(datum)
);

const width = 25;
const height = 6;
const size = width * height;

const layers = [];
data.forEach((pixel, index) => {
  const layer = Math.floor(index / size);
  layers[layer] = (layers[layer] || []).concat(pixel);
});

let minZeros = Number.MAX_SAFE_INTEGER;
let minZerosIndex = -1;
const pixelCounts = layers.map((layer, layerIndex) => {
  const counts = layer.reduce((acc, pixel) => {
    acc[pixel] = (acc[pixel] || 0) + 1;
    return acc;
  }, {});

  if (counts[0] < minZeros) {
    minZeros = counts[0];
    minZerosIndex = layerIndex;
  }

  return counts;
});

const part1 = pixelCounts[minZerosIndex][1] * pixelCounts[minZerosIndex][2];
console.log(`part 1: ${part1}`);

const rows = [];
for (let y = 0; y < height; ++y) {
  const pixels = [];
  for (let x = 0; x < width; ++x) {
    const index = x + y * width;
    const value = layers.reduce(
      (acc, layer) => (acc === 2 ? layer[index] : acc),
      2
    );
    pixels.push(value === 1 ? "█" : " ");
  }
  rows.push(pixels.join(""));
}

const part2 = rows.join("\n");
console.log(`part 2:\n${part2}`);
