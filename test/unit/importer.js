var importTree = require('../../index');

describe('Broccoli Importer', function() {
  it('Makes paths relative', function() {
    var tree = importTree('./sub-tree');
    assert.equal(tree, 'test/unit/sub-tree/assets');
  });
});