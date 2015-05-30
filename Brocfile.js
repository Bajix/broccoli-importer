var mergeTrees = require('broccoli-merge-trees'),
  importTree = require('./index');

var trees = [
  'sinon',
  'mocha',
  'canjs',
  'bit-c3',
  'jquery',
  'angular',
  'bourbon',
  'bit-autocomplete',
].map(importTree);

module.exports = mergeTrees(trees, {
  overwrite: true
});