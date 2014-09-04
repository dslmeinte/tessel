module.exports = function (port) {

	"use strict";

	// ported from: https://github.com/adafruit/Adafruit_MPL115A2/blob/master/Adafruit_MPL115A2.cpp
	// data sheet: http://www.adafruit.com/datasheets/MPL115A2.pdf

	var i2c_address = 0x60;

	var registers = {

		pressure_msb:	0x00,
		pressure_lsb:	0x01,
		temp_msb:		0x02,
		temp_lsb:		0x03,
		a0_coeff_msb:	0x04,
		a0_coeff_lsb:	0x05,
		b1_coeff_msb:	0x06,
		b1_coeff_lsb:	0x07,
		b2_coeff_msb:	0x08,
		b2_coeff_lsb:	0x09,
		c12_coeff_msb:	0x0A,
		c12_coeff_lsb:	0x0B,
		start_conversion:	0x12

	};  // (only pressure_msb, a0_coeff_msb and start_conversion are used in this code)

	var i2cBus = new port.I2C(i2c_address);

    var numberCruncher = require('./mpl115a2-computation.js')();

	i2cBus.transfer(new Buffer([registers.a0_coeff_msb]), 8, function (err, rx) {
        numberCruncher.setCoefficientsFrom(rx);
//        for( var i = 0; i < 8; i++ ) {
//        	console.log('' + i + ' -> ' + rx[i]);
//        }
//        console.log(numberCruncher.getCoefficients());
	});

	function measure (callback) {
		i2cBus.send(new Buffer([registers.start_conversion, 0x00]));
		setTimeout(function () {
			i2cBus.transfer(new Buffer([registers.pressure_msb]), 4, function (err, rx) {
				var idx = 0;
				var Padc = numberCruncher.decodeAdc(rx[idx++], rx[idx++]);
				var Tadc = numberCruncher.decodeAdc(rx[idx++], rx[idx++]);
//				console.log("Padc=" + Padc + ", Tadc=" + Tadc);
				callback(numberCruncher.computeFromAdc(Padc, Tadc));
			});
		}, 3);
	}

	return {
		'measure': measure
	};

};

