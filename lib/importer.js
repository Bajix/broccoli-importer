var resolveTree = require('./resolve-tree'),
  exportMain = require('./export-main'),
  exportAMD = require('./export-amd'),
  funnel = require('broccoli-funnel'),
  findup = require('findup-sync'),
  path = require('path'),
  fs = require('fs');

function exportBrocfile( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  var brocfile = findup('Brocfile.js', {
    cwd: moduleDir,
    nocase: true
  });

  if (brocfile && path.dirname(brocfile) !== cwd) {
    return resolveTree(function() {
      return require(brocfile);
    }, moduleDir);
  }
}

function exportAssets( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  var file = findup('package.json', {
    cwd: moduleDir
  });

  if (file && path.dirname(file) !== cwd) {
    var pkg = require(file),
      directories = pkg.directories;

    if (directories.hasOwnProperty('assets')) {
      return resolveTree(function() {
        return funnel(directories.assets);
      }, path.dirname(file));
    }
  }
}

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