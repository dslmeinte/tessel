var tessel = require('tessel');
var gpio = tessel.port['GPIO'];

var weather = require('./mpl115a2.js')(gpio);	// pins 5 (SCL) and 7 (SDA)

setInterval(function () {
	weather.measure(function (measurements) {
		console.log('pressure=' + measurements.pressure + '; temperature=' + measurements.temperature);
	});
}, 1000);

