var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var servo = require('servo-pca9685').use(tessel.port['B']);

var servoPort = 1;

var accelReady = false;
var servoReady = false;

accel.on('ready', function() {
	accelReady = true;
	console.log('accel ready');
	go();
});

servo.on('ready', function() {
	servoReady = true;
	console.log('servo ready');
	go();
});

function go() {
	if (!(accelReady && servoReady)) {
		return;
	}

	servo.configure(servoPort, 0.05, 0.12, function () {
		accel.on('data', function(xyz) {
			var pos = (xyz[0] + 1)/2;
			console.log(pos);
			servo.move(servoPort, pos);
		});
	});

}

