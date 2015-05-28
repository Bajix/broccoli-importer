var path = require('path'),
  cwd = process.cwd();

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

module.exports = function resolveTree( makeTree, dirname ) {
  process.chdir(dirname);
  var tree = updateTreePaths(makeTree());
  process.chdir(cwd);

  return tree;
};