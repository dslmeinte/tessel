var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['B']);

var servo1 = 1; //servo plugged in at position 1

servo.on('ready', function() {
	position = 0.0;
	var dir = 1;
	/*
	 * Set the minimum and maximum duty cycle for servo 1. If the servo doesn't
	 * move to its full extent or stalls out and gets hot, try tuning these
	 * values (0.05 and 0.12). Moving them towards each other = less movement
	 * range Moving them apart = more range, more likely to stall and burn out.
	 */
	servo.configure(servo1, 0.05, 0.125, function() {
		setInterval(function() {
			servo.move(servo1, position);
			position += 0.1 * dir;
			if (position > 0.9) {
				dir = -1;
			}
			if (position < 0.0) {
				dir = 1;
			}
			servo.read(servo1, function (err, reading) {
				console.log('reading=' + reading);
			});
		}, 1000);
	});
});
