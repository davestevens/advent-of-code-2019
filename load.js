const fs = require("fs");
const path = require("path");

module.exports = (file, separator) => {
  const filePath = path.resolve(file);
  const text = fs.readFileSync(filePath, "utf-8");
  if (separator) {
    return text.split(separator);
  } else {
    return text;
  }
};
