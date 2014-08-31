// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

// Initialize the accelerometer.
accel.on('ready', function () {
    // Stream accelerometer data
  accel.on('data', function (xyz) {
	  var x = xyz[0];
	  var y = xyz[1];
	  var z = xyz[2];
    console.log(
    		'x:', x.toFixed(2),
    		'y:', y.toFixed(2),
    		'z:', z.toFixed(2),
    		'n:', Math.sqrt(x*x + y*y + z*z).toFixed(2)
    		);
  });

});

accel.on('error', function(err){
  console.log('Error:', err);
});