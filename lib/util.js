var path = require('path'),
  cwd = process.cwd(),
  fs = require('fs');

function isDirectory( name, dir ) {
  if (path.extname(name)) {
    return false;
  }
  var pathname = path.join(dir, name),
    stat  = fs.statSync(pathname);

  return stat.isDirectory();
}

function updateTreePaths( tree ) {
  if (typeof tree === 'string') {
    return path.relative(cwd, tree);
  }

  if (typeof tree === 'object' && tree.hasOwnProperty('inputTree')) {
    tree.inputTree = updateTreePaths(tree.inputTree);
  }

  if (typeof tree === 'object' && tree.hasOwnProperty('inputTrees')) {
    tree.inputTrees = tree.inputTrees.map(function( tree ) {
      return updateTreePaths(tree);
    });
  }

  return tree;
}

function resolveTree( makeTree, dirname ) {
  process.chdir(dirname);
  var tree = updateTreePaths(makeTree());
  process.chdir(cwd);

  return tree;
}

exports.isDirectory = isDirectory;
exports.resolveTree = resolveTree;