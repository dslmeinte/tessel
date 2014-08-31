var tessel = require('tessel'); // import tessel
var gpio = tessel.port['GPIO']; // select the GPIO port

var xPin = gpio.analog[4];		// A5 ~ pin 6
var yPin = gpio.analog[3];		// A4 ~ pin 8
var selPin = gpio.digital[3];	// G4 ~ pin 20

/*
 * Connect Tessel <-> Analog Thumb Joystick Breakout Board:
 * 
 * 	GND ~ pin 1 to GND
 *  3.3V ~ pin 3 to Vcc
 * 
 * Connect a pull-up resistor (e.g. 10k = brown black orange) (directly) between Vcc and Sel.
 */

var joystick = require('./joystick.js')(xPin, yPin, selPin);

setInterval(joystick.logDeflections, 100);

