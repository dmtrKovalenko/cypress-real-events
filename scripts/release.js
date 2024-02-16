const fs = require("fs-extra");
const path = require("path");
const packageJson = require("../package.json");

const newPackage = {
  ...packageJson,
  main: "./support.js",
  typings: "./index.d.ts",
};

fs.outputFileSync(
  path.resolve(__dirname, "..", "dist", "package.json"),
  JSON.stringify(newPackage, null, 2),
);

fs.copy(
  path.resolve(__dirname, "..", "src", "index.d.ts"),
  path.resolve(__dirname, "..", "dist", "index.d.ts"),
);

fs.copy(
  path.resolve(__dirname, "..", "README.md"),
  path.resolve(__dirname, "..", "dist", "README.md"),
);
