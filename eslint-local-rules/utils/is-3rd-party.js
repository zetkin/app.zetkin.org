// Util to identify whether an import is 3rd party

const is3rdParty = (str) => deps.some((d) => str.startsWith(d));
module.exports = is3rdParty;

// The tsconfig is wired to allow referencing `./src/some/code` as `some/code`,
// which means we can't identify local imports by looking for a leading `.`.
// Instead we check if the import matches a dependency listed in package.json!

const packageJson = require('../../package.json');
const deps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
  '@mui', // seems we sometimes import @mui packages that aren't direct deps so we hard-code that here
];

// NB: Node packages will be identified as "not 3rd party" which is arguably correct, but likely
// this util is used to identify local imports. Another util might be needed to differentiate
// between local imports and built-in node packages.
