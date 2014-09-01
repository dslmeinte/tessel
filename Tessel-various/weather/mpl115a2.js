module.exports = function (port) {

	"use strict";

	// ported from: https://github.com/adafruit/Adafruit_MPL115A2/blob/master/Adafruit_MPL115A2.cpp

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

	};

	var a0 = 0, b1 = 0, b2 = 0, c12 = 0;

	var i2cBus = new port.I2C(i2c_address);

	i2cBus.transfer(new Buffer[registers.a0_coeff_msb], 8, function (err, rx) {
		var idx = 0;
		a0 = (256*rx[idx++] + rx[idx++])/8;
		b1 = (256*rx[idx++] + rx[idx++])/8192;
		b2 = (256*rx[idx++] + rx[idx++])/16384;
		c12 = (256*rx[idx++] + rx[idx++])/(2*4194304);
	});

	function measure (callback) {
		i2cBus.send(new Buffer([registers.start_conversion, 0x00]));
		setTimeout(function () {
			i2cBus.transfer(new Buffer([registers.pressure_msb]), 4, function (err, rx) {
				var idx = 0;
				var rawPressure = (256*rx[idx++] + rx[idx++])/64;
				var rawTemperature = (256*rx[idx++] + rx[idx++])/64;
				var pressureComp = a0 + (b1 + c12*rawTemperature)*rawPressure + b2*rawTemperature;
				callback({
					'pressure':		((65.0/1023.0)*pressureComp) + 50.0,	// KPa
					'temperature':	(rawTemperature - 498)/(-5.35) + 25.0	// C
				});
			});
		}, 3);
	}

	return {
		'measure': measure
	};

};

