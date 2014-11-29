var tessel = require('tessel');
var gpio = tessel.port['GPIO'];

var i2cBus = new gpio.I2C(0x62);


/**
 * Make a while-loop with a delay of the given number of milliseconds after each run of the given code.
 *
 * @param ms - milliseconds
 * @param code - the code to execute each loop: while-loop ends after first false is returned
 * @returns {Function}
 */
function mkTimedLoop(ms, code) {
    var loopedCode = function () {
        if (code()) {
            setTimeout(loopedCode, ms);
        }
    };
    return loopedCode;
}


/*
 * code (loosely) translated from:
 * https://github.com/PulsedLight3D/LIDARLite_Basics/blob/master/Arduino/LIDARLite_I2C_Library_GetDistance_ContinuousRead/LIDARLite_I2C_Library_GetDistance_ContinuousRead.ino
 */

setTimeout(function () {
    mkTimedLoop(500, function () {
        i2cBus.send(new Buffer([0x00, 0x04]));  // initiate measurement
        // wait for 10ms for the measurement to finish:
        setTimeout(function () {
            i2cBus.transfer(new Buffer([0x8f]), 2, function (err, rx) {
                var distance = (rx[0] << 8) + rx[1];
                console.log(distance);
            });
        }, 10);
        return true;   // Run, Forrest, run!
    })();
}, 100);    // wait for 100ms for warm-up

