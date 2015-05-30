var resolveTree = require('./resolve-tree'),
  exportBrocfile = require('./strategies/brocfile'),
  exportAssets = require('./strategies/assets'),
  exportMain = require('./strategies/main'),
  exportAMD = require('./strategies/amd'),
  funnel = require('broccoli-funnel'),
  path = require('path');

function loadTree( module ) {
  var treeExporters = [
    exportBrocfile,
    exportAssets,
    exportAMD,
    exportMain
  ];

  for (var i = 0; i < treeExporters.length; i++) {
    var treeExporter = treeExporters[i],
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