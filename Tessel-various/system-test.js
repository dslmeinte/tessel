var tessel = require('tessel');

console.log(tessel.deviceId());

process.sendfile("foo.txt", new Buffer([0xca, 0xff, 0xee, 0xba, 0xbe]));

