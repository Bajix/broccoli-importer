var Importer = require('./lib/importer');

module.exports = function() {
  if (arguments.length === 2) {
    return Importer.createTree.apply(this, arguments);
  }
  return Importer.loadBrocfile.apply(this, arguments);
}