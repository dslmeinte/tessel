module.exports = function (xPin, yPin, selPin) {

	function normalise (x) {	// runs from -1.0 to 1.0
		return (x-0.5)*2;
	}

	function logDeflections () {
		var x = normalise(xPin.read());
		var y = normalise(yPin.read());
		console.log("x=" + x.toFixed(3) + ", y=" + y.toFixed(3) + ", sel=" + (1-selPin.read()));

	}

	return {
		'logDeflections': logDeflections
	};

};

/*
 * TODO  calibration: sample with high frequency for a short while,
 * compute the mean and deviation of (x, y) in 2D, fail (return null) when deviation is too high
 * or mean is implausible.
 */

