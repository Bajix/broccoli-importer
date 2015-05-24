var findup = require('findup-sync'),
  path = require('path');

function resolveBrocfile( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  var brocfile = findup('Brocfile.js', {
    cwd: moduleDir,
    nocase: true
  });

  if (brocfile === null) {
    throw new Error('Brocfile.js not found');
  }

  return brocfile;
}

exports.resolveBrocfile = resolveBrocfile;