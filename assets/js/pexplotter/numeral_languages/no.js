/*! 
 * numeral.js language configuration
 * language : norwegian Bokmal and Nynorsk
 * author :  Peter Jin https://github.com/jinqiupeter 
 */
(function () {
    var language = {
        delimiters: {
            thousands: ' ',
            decimal  : ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'mill',
            billion: 'mrd',
            trillion: 'b'
        },
        ordinal : function (number) {
            return '.'
        },
        currency: {
            symbol: 'NOK'
        }
    };

    // Node
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = language;
    }
    // Browser
    if (typeof window !== 'undefined' && this.numeral && this.numeral.language) {
        this.numeral.language('no', language);
    }
}());