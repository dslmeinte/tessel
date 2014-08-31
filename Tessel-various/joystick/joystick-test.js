function AnalogPin () {

	this.read = function () {
		return Math.random();
	};

}

function DigitalPin () {

	this.read = function () {
		return Math.floor(2*Math.random());
	};

}

var joystick = require('./joystick.js')(new AnalogPin(), new AnalogPin(), new DigitalPin());

joystick.logDeflections();

