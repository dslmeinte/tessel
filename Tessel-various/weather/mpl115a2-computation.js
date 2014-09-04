module.exports = function () {

    "use strict";

    var a0 = 0, b1 = 0, b2 = 0, c12 = 0;

    function pow2 (n) {
        return 1 << n;  // 2^n (or 2**n for Fortrannies ;))
    }

    function decodeAdc (msb, lsb) {
        return ((msb << 8) + lsb)/pow2(6);
    }

    function computeFromAdc (Padc, Tadc) {
        var Pcomp = a0 + (b1 + c12*Tadc)*Padc + b2*Tadc;
        return {
            'pressure':		(((115-50)/1023)*Pcomp) + 50,	// KPa
            'temperature':	(Tadc - 498)/(-5.35) + 25		// C
        };
    }

    function decodeTwosComplement (msb, lsb, nBits_) {
        var nBits = nBits_ || 16;	// default 16 bits, of which 1 sign bit
        var sign = msb>>>7;			// sign bit is always left-most, irregardless of #bits
        return (((msb&127)<<8) + lsb) -sign*pow2(nBits-1);
    }

    function setCoefficients (a0_, b1_, b2_, c12_) {
        a0  = a0_;
        b1  = b1_;
        b2  = b2_;
        c12 = c12_;
    }

    function getCoefficients () {
        return {
            'a0':  a0,
            'b1':  b1,
            'b2':  b2,
            'c12': c12
        };
    }

    function setCoefficientsFrom (rx) {
        var idx = 0;
        // note: JS's / is a true arithmetic (float) division, not an integer one
        a0  = decodeTwosComplement(rx[idx++], rx[idx++])/pow2(3);
        b1  = decodeTwosComplement(rx[idx++], rx[idx++])/pow2(13);
        b2  = decodeTwosComplement(rx[idx++], rx[idx++])/pow2(14);
        c12 = decodeTwosComplement(rx[idx++], rx[idx++], 14)/pow2(24);
            // 24 == 15 + 9 == shift an integer of 14 bits entirely behind binary point + pre-pad with 9 more binary 0's
    }

    return {
        'decodeAdc':            decodeAdc,
        'computeFromAdc':       computeFromAdc,
        'setCoefficientsFrom':  setCoefficientsFrom,
        // for testing only!:
        'getCoefficients':      getCoefficients,
        'setCoefficients':      setCoefficients
    };

};

