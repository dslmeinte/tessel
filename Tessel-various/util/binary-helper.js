module.exports = function () {

    function decodeTwosComplement (msb, lsb, nBits_) {
        var nBits = nBits_ || 16;	// default 16 bits, of which 1 sign bit
        var sign = msb>>>7;			// sign bit is always left-most, irregardless of #bits
        return (((msb&127)<<8) + lsb) -sign*pow2(nBits-1);
    }

    function decode16uint (msb, lsb) {
        return ((msb << 8) + lsb)/pow2(6);
    }

    return {
        'decodeTwosComplement': decodeTwosComplement,
        'decode16uint':         decode16uint
    }

}();    // (singleton)

