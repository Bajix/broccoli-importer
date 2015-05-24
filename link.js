var fs = require('fs'),
  sources = fs.readdirSync('./lib'),
  count = 0;

var isHidden = function (path) {
  return (/(^|.\/)\.+[^\/\.]/g).test(path);
};

for (var i = 0; i < sources.length; i++) {
  var source = '../lib/' + sources[i],
    destination = 'node_modules/' + sources[i];

  if (!isHidden(source)) {
    var exists = fs.existsSync(destination);
    if (exists) {
      console.log('>> Destination %s already exists', destination);
    } else {
      fs.symlinkSync(source, destination, 'dir');
      count++;
    }
  }
}

console.log('>> Created %d symbolic links.', count);
