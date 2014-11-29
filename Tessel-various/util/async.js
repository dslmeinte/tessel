module.exports = function () {

    /**
     * Make a while-loop with a delay of the given number of milliseconds after each run of the given code.
     *
     * @param ms - milliseconds
     * @param code - the code to execute each loop: while-loop ends after first false is returned
     * @returns {Function}
     */
    this.mkTimedLoop = function (ms, code) {
        var loopedCode = function () {
            if (!code()) {
                setTimeout(loopedCode, ms);
            }
        };
        return loopedCode;
    };

}();    // (singleton)

