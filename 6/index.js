const input = require("../load")("./6/input.txt", "\r\n").map(datum => datum.split(")"));

const map = {};
input.forEach(([parentKey, childKey]) => {
    const parent = map[parentKey] ? map[parentKey] : map[parentKey] = { children: [], parent: null, key: parentKey };
    const child = map[childKey] ? map[childKey] : map[childKey] = { children: [], parent: null, key: childKey };
    parent.children.push(child);
    child.parent = parent;
});

const distance = (key) => {
    let count = 0;
    let current = map[key];
    while (current = current.parent) {
        count++;
    }
    return count;
}

const part1 = () => Object.keys(map).map(distance).reduce((acc, value) => acc + value, 0);

const getParents = (key) => {
    const parents = [];
    let current = map[key];
    while (current = current.parent) {
        parents.push(current.key);
    }
    return parents;
}

const part2 = (fromKey, toKey) => {
    const from = getParents(fromKey);
    const to = getParents(toKey);

    for (let fromIndex = 0; fromIndex < from.length; ++fromIndex) {
        const toIndex = to.indexOf(from[fromIndex]);
        if (toIndex > -1) {
            return fromIndex + toIndex;
        }
    }
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2("YOU", "SAN")}`);
