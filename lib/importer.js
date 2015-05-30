var resolveTree = require('./resolve-tree'),
  strategies = require('./strategies'),
  funnel = require('broccoli-funnel'),
  path = require('path');

function loadTree( module ) {
  for (var i = 0; i < strategies.length; i++) {
    var treeExporter = strategies[i],
      tree = treeExporter(module);

    if (tree) {
      return tree;
    }
  }
}

function createTree( module, options ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  return resolveTree(function() {
    return funnel(moduleDir, options);
  }, moduleDir);
}

exports.createTree = createTree;
exports.loadTree = loadTree;