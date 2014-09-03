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

	};

	var a0 = 0, b1 = 0, b2 = 0, c12 = 0;

	var i2cBus = new port.I2C(i2c_address);

	i2cBus.transfer(new Buffer([registers.a0_coeff_msb]), 8, function (err, rx) {
		var idx = 0;
		a0  = decodeTwosComplement(rx[idx++], rx[idx++])/8;				// ( 2^3)
		b1  = decodeTwosComplement(rx[idx++], rx[idx++])/8192;			// (2^13)
		b2  = decodeTwosComplement(rx[idx++], rx[idx++])/16384;			// (2^14)
		c12 = decodeTwosComplement(rx[idx++], rx[idx++], 14)/16777216;	// (2^24)
	});

	function measure (callback) {
		i2cBus.send(new Buffer([registers.start_conversion, 0x00]));
		setTimeout(function () {
			i2cBus.transfer(new Buffer([registers.pressure_msb]), 4, function (err, rx) {
				var idx = 0;
				var Padc = (256*rx[idx++] + rx[idx++])/64;
				var Tadc = (256*rx[idx++] + rx[idx++])/64;
				var Pcomp = a0 + (b1 + c12*Tadc)*Padc + b2*Tadc;
				callback({
					'pressure':		(((115-50)/1023)*Pcomp) + 50,	// KPa
					'temperature':	(Tadc - 498)/(-5.35) + 25		// C
				});
			});
		}, 3);
	}

	function decodeTwosComplement (msb, lsb, nBits_) {
		var nBits = nBits_ || 16;	// default 16 bits, of which 1 sign bit
		var sign = msb>>>7;			// sign bit is always left-most, irregardless of #bits
		return (((msb&127)<<8) + lsb) -sign*(1<<(nBits-1));
	}

	return {
		'measure': measure
	};

};

