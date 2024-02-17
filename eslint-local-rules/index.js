const sortImports = require('./sort-imports.rule');

// Everything exported from here will be available as rules
// with the name `local-rules/<PROPERTY_NAME>`
module.exports = {
  'sort-imports': sortImports,
};
