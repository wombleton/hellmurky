const tilenol = require('tilenol');
const path = require('path');
const fs = require('fs');
const async = require('async');

const q = async.queue(function (task, callback) {
  console.log('Slicing %s...', task.path);
  tilenol.slice({
    onTile: function (name, stdout, cb) {
      const output = path.join('..', 'images', name);
      const writeStream = fs.createWriteStream(output);
      stdout.pipe(writeStream);
      stdout.on('end', cb);
      stdout.on('error', cb);
    },
    path: task.path
  }, function (err, count) {
    if (count) {
      console.log('Generated %s tiles.', count);
    }
    callback(err, count);
  });
}, 1);

fs.readdir(path.join('..', 'srcfiles'), function (err, files) {
  files.forEach(function (file) {
    q.push({
      path: path.resolve('..', 'srcfiles', file)
    })
  });
});
