module.exports = function (port) {

    // data sheet @: http://www.adafruit.com/datasheets/vcnl4000AN.pdf

    var i2c_address = 0x13;

    var i2cBus = new port.I2C(i2c_address);

    function decode (msb, lsb) {
        return (msb<<8) + lsb;
    }

    function measure (callback) {
        i2cBus.transfer(new Buffer([0x85]), 4, function (err, rx) {
            var idx = 0;
            callback({
                'ambientLight': decode(rx[idx++], rx[idx++]),
                'proximity':    decode(rx[idx++], rx[idx++])
            });
        });
    }

    function ledCurrent (current) {
        i2cBus.send(new Buffer([0x83, current]));
        return self;
    }

    var self = {
        'measure':      measure,
        'ledCurrent':   ledCurrent
    };

    return self;

};

