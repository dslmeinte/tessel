var numberCruncher = require('./mpl115a2-computation.js')();

exports.group = {

    // numbers taken from §3.5 of data sheet:
    computeFromAdc: function (test) {
        numberCruncher.setCoefficients(2009.75, -2.37585, -0.92047, 0.000790);
        var result = numberCruncher.computeFromAdc(410, 507);
        test.ok(Math.abs(result.pressure - 96.59)<0.01);
        test.done();
    },

    // numbers taken from §3.4 of data sheet:
    decodeAdc: function (test) {
        test.equal(numberCruncher.decodeAdc(0x66, 0x80), 410, "pressure");
        test.equal(numberCruncher.decodeAdc(0x7E, 0xC0), 507, "temperature");
        test.done();
    },

    setCoefficientsFrom: function (test) {
        numberCruncher.setCoefficientsFrom([0x3E, 0xCE, 0xB3, 0xF9, 0xC5, 0x17, 0x33, 0xC8]);
        var coeffs = numberCruncher.getCoefficients();
        test.ok(Math.abs(coeffs.a0 - 2009.75)<0.01);
        test.ok(Math.abs(coeffs.b1 + 2.37585)<0.00001);
        test.ok(Math.abs(coeffs.b2 + 0.92047)<0.00001);
        test.ok(Math.abs(coeffs.c12 - 0.000790)<0.000001);
        test.done();
    }

};

