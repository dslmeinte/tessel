var tessel = require('tessel'); // import tessel
var gpio = tessel.port['GPIO']; // select the GPIO port

var weather = require('./mpl115a2.js')(gpio);	// pins 5 (SCL) and 7 (SDA)

setInterval(function () {
	weather.measure(function (measurements) {
		console.log('pressure=' + measurements.pressure + '; temperature=' + measurements.temperature);
	});
}, 1000);

