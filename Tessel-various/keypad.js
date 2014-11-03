var tessel = require('tessel'); // import tessel
var gpio = tessel.port['GPIO']; // select the GPIO port

var common = gpio.digital[2];
var key1 = gpio.digital[3];		// G4 ~ pin 20
key1.pull('pullup')
key1.input();
common.output(1);

function logKeys () {
	console.log(key1.rawRead());
}

setInterval(logKeys, 100);

