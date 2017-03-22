function debug(message) {
    var d = new Date();
    var ts = d.toTimeString().substring(0, 8) + '.' + d.getMilliseconds();

    console.log(ts, message);
    //console.debug(ts, message);
}

function throttle(method, context, argsArray, delay) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.apply(context, argsArray);
    }, delay || 25);
}

// returns a function that will be executed at most one time, no matter
// how often you call it.
function once (func) {
    var ran = false, memo;
    return function () {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
    };
};

function isValidObject(value) {
    if (typeof (value) != 'undefined' && value != null)
        return true;
    else
        return false;
}

function isValidNumber(value) {
    if (typeof (value) != 'undefined' && value != null && !isNaN(value))
        return true;
    else
        return false;
}

function sortNumber(a, b) {
    return a - b;
}

function sortAxes(a, b) {
    return getDivIndex(a.itemTag) - getDivIndex(b.itemTag);
}

function getDivIndex(id) {
    var index = id.substring(id.indexOf('.') + 1, id.lastIndexOf('.'));
    return parseInt(index);
}

function sortAxesDiv(a, b) {
    return getDivIndex(a.data('parentAxis').itemTag) - getDivIndex(b.data('parentAxis').itemTag)
}

function insertDiv($container, $div, isBottom) {
    if (isBottom) {
        var children = $container.children();
        $div.detach();
        for (var i =0; i < children.length; i++) {
            if (sortAxesDiv($div, $(children[i])) > 0)
                break;
        }
        if (i == children.length)
            $container.append($div);
        else
            $div.insertBefore($(children[i]));
    }
    else{
    var children = $container.children();
    $div.detach();
    for (var i = 0; i < children.length; i++) {
        if (sortAxesDiv($div, $(children[i])) < 0)
            break;
    }
    if (i == children.length)
        $container.append($div);
    else
        $div.insertBefore($(children[i]));
    }
}

if (!Array.prototype.indexOf) {
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
}

if (!Array.prototype.remove) {
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
    };
}

if (!Array.prototype.setMaxLength) {
    Array.prototype.setMaxLength = function (maxLength) {
        this.maxLength = maxLength;
    };
}

//add new object to array, but limit the array's length as maxlength. If beyond the limit, it will remove the front ones
if (!Array.prototype.addNew) {
    Array.prototype.addNew = function (obj, maxLength, addToFront) {
        if (!maxLength && this.maxLength && this.maxLength > 0) {
            maxLength = this.maxLength;
        }

        if (addToFront)
            this.unshift(obj);
        else
            this.push(obj);

        if (maxLength && maxLength > 0) {
            if (this.length >= maxLength) {
                this.splice(0, this.length - maxLength);
            }
        }
    };
}

if (!Array.prototype.setMaxLength) {
    Array.prototype.setMaxLength = function (maxLength) {
        this.maxLength = maxLength;
    };
}

// find an element in an array that matches certian condition 
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        }
    });
}

function isElementInArray(elem, array) {
    for (var i = 0; i < array.length; i++) {
        if (elem == array[i])
            return true;
    }
    return false;
}

function MyMap() {
    this.data = {};
}

MyMap.prototype.set = function (index, val) {
    this.data[index] = val;
}

MyMap.prototype.get = function (index) {
    return this.data[index];
}

function getBoolean(boolean, defaultValue) {
    if (boolean == null || typeof boolean == "undefined")
        return defaultValue;
    else
        return boolean.toString().toLowerCase() == "true";
}

function getBooleanReversed(boolean, defaultValue) {
    if (boolean == null || typeof boolean == "undefined")
        return defaultValue;
    else
        return boolean.toString().toLowerCase() == "false";
}

function formatTimespan(timespan) {
    var formatedTimespan;
    if (timespan <= 359999000) {
        timespanbySec = timespan / 1000;
        var second = Math.floor(timespanbySec % 60);
        if (second < 10)
            second = '0' + second;
        timespanbyMin = Math.floor(timespanbySec / 60);
        var minute = timespanbyMin % 60;
        if (minute < 10)
            minute = '0' + minute;
        hour = Math.floor(timespanbyMin / 60);
        formatedTimespan = hour > 0 ? hour + ':' + minute + ':' + second : minute + ':' + second;
    }
    else {
        days = Math.floor(timespan / 3600 / 24 / 1000);
        formatedTimespan = days + 'days';
    }
    return formatedTimespan;
}

function getTimespan(formatedTimespan) {
    hms = formatedTimespan.split(':');
    var timespan = 0;
    if (hms.length == 1)
        timespan = parseInt(hms[0]);
    else if (hms.length == 2)
        timespan = 60 * parseInt(hms[0]) + parseInt(hms[1]);
    else if (hms.length == 3)
        timespan = 3600 * parseInt(hms[0]) + 60 * parseInt(hms[1]) + parseInt(hms[2]);
    return timespan;
}

function getFontSize(fontsize) {
    var size = 11;
    switch (fontsize) {
        case "XX-Small":
            size = 8;
            break;
        case "X-Small":
            size = 9;
            break;
        case "Smaller":
            size = 10;
            break;
        case "Small":
            size = 11;
            break;
        case "Medium":
            size = 12;
            break;
        case "Large":
            size = 13;
            break;
        case "Larger":
            size = 14;
            break;
        case "X-Large":
            size = 15;
            break;
        case "XX-Large":
            size = 16;
            break;
        default:
            break;
    }
    return size;
}

function rgbToHex(rgbString) {
    var rgbStr = rgbString.substring(4, rgbString.length - 1);
    var rgbArray = rgbStr.split(',');
    var r = parseInt(rgbArray[0]);
    var g = parseInt(rgbArray[1]);
    var b = parseInt(rgbArray[2]);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// convert hex color to rgb or rgba color:
// 0033FF == #0033FF == 03F == #03F
function hexToRgb(hex, alpha) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: alpha != null ? alpha : 1,
    } : null;
}

function colorToColorString(color) {
    if (color == null || typeof color == 'undefined')
        return null;

    var number = parseInt(color);
    if (number < 0) {
        temp = 16777216 + number;
    }
    else
        temp = number;

    result = temp.toString(16);

    var len = result.length;
    for (var i = 0; i < 6 - len; i++) {
        result = "0" + result;
    }

    result = "#" + result;

    return result;
}

function getFontString(fontname, bold, italic, fontSize) {
    var fontString = "";
    if (bold.toLowerCase() == "true")
        fontString = "bold " + fontString;
    if (italic.toLowerCase() == "true")
        fontString = "italic " + fontString;

    fontString = fontString + fontSize.toString() + "px";
    fontString = fontString + " " + fontname;
    return fontString;
}

function adjustLineWidth(lineWidth) {
    var lw = parseInt(lineWidth);
    if (lw <= 1)
        lw = 1.5;
    return lw;
}

function getNumberFormat(numDecimals) {
    var labelStringFormat = '%.1f';         //default
    if (numDecimals > 0)
        labelStringFormat = '%.' + numDecimals + 'f';
    else if (numDecimals == 0)
        labelStringFormat = '%d';

    return labelStringFormat;
}

function getCurveIndex(subscriptionElementProperty) {
    var index1 = subscriptionElementProperty.indexOf('.');
    var index2 = subscriptionElementProperty.indexOf('.', index1 + 1);

    var index = subscriptionElementProperty.substring(index1 + 1, index2);

    return parseInt(index);
}

function getLocationTimezone() {
    var now = new Date().toString();
    var timezone = now.indexOf('(') > -1 ?
    now.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
    now.match(/[A-Z]{3,4}/)[0];
    if (timezone == "GMT" && /(GMT\W*\d{4})/.test(now)) TZ = RegExp.$1;
    return timezone;
}

//set languate for jqchart
function setLocale() {
    var localeTable = {
        "nn-NO": ["no", "no"], //first element is language, second is numeral
        "nb-NO": ["no", "no"],
        "en-US": ["en", "en-us"],
        "en-GB": ["en", "en-gb"],
        "it-IT": ["it", "it"],
        "ru-RU": ["ru", "ru"],
        "ru-UA": ["ru", "ru-UA"],
        "fr-CH": ["fr", "fr-ch"],
        "fr-CA": ["fr", "fr-CA"],
        "de": ["de", "de"], //standard German
        "de-AT": ["de", "de"], //Austria
        "de-LU": ["de", "de"], //Luxembourg
        "de-LI": ["de", "de"], //Liechtenstein
        "de-CH": ["de", "de-ch"], //Switzerland
        "da-DK": ["dk", "da-dk"],
        "ar-EG": ["ar", "en-us"],
        "zh-CN": ["en", "chs"],
    };
    // navigator.language: Chrome/Firefox/Safari, 
    // navigator.userLanguage: IE
    var preferredLanguage = navigator.language || navigator.userLanguage;
    var language = "en";
    var num = "en-us";
    for (var code in localeTable) {
        if (code.toUpperCase() === preferredLanguage.toUpperCase()) {
            language = localeTable[code][0];
            num = localeTable[code][1];
            break;
        }
    }

    var langJsUrl = window.pageProperty.languageFileUrl + "chart.locale-" + language + '.js';
    addRef(langJsUrl, function () {
       var f= $.jqChartDateFormat.masks.longTime;
        window.pageProperty.elementIdArray.forEach(function (id) {
            $("#" + id + "_chartdiv").jqChart('update');
        });
    });
    var numeralJsUrl = window.pageProperty.numeralFileUrl + num + '.js';
    addRef(numeralJsUrl, function () { numeral.language(num) });
}

function addRef(path, callback) {
    if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';

    script.onload = callback;

    head.appendChild(script);
}

function getDateTimeByTimeOffset(timestamp, timeOffset) {
    var datetime = new Date(parseInt(timestamp) + timeOffset);
    return datetime;
}

function getTimeOffset(props, commonProperty) {
    var localTime = getBoolean(props["LocalTime"], false);
    var jsLocalTimeOffset = new Date().getTimezoneOffset();

    if (typeof (props["TimezoneOffset"]) != 'undefined' && props["TimezoneOffset"] != null) {
        commonProperty.timeOffset = jsLocalTimeOffset * 60 * 1000 + parseInt(props["TimezoneOffset"]);
        commonProperty.timezone = props["TimezoneName"];
    }
    else {
        if (localTime) {
            commonProperty.timeOffset = 0;
            commonProperty.timezone = getLocationTimezone();
        }
        else {
            commonProperty.timeOffset = jsLocalTimeOffset * 60 * 1000;
            commonProperty.timezone = "UTC";
        }
    }
} 

var QualityParser = (function () {
    var my = {};
    // the quality codes enumertation
    // C:\tfs\Products\Development\jqChartPexPlotter\Source\Assemblies\Web Controls\Dancer\Prediktor.Dancer.DA\Resources\QualityVisualization.xml
    // 0000 0000 0000 0000 0000 0000 0000 0000
    //                                      -- opc limit mask
    //                               -- opc qualitiy mask 
    //                     ---- ---- vendor quality mask
    //                          ---- apis quality mask dvsc
    //                             - apis quality mask invalid data
    //                             - apis quality mask validity
    //                          --- apis quality mask opcua
    // ---- ---- ---- ---- apis hda quality mask
    var OPC_QUALITY_BAD = 0x00;
    var OPC_QUALITY_UNCERTAIN = 0x40; // 0100 0000 bin
    var OPC_QUALITY_GOOD = 0xC0; // 1100 0000 bin
    var OPC_HDA_QUALITY_MASK = 0xFFFF0000; //1111 1111 1111 1111 0000 0000 0000 0000 bin
    var VENDOR_QUALITY_MASK = 0xFF00; // 1111 1111 0000 0000 bin
    var OPC_QUALITY_MASK = 0xC0; // 1100 0000 bin
    var OPC_LIMIT_MASK = 0x03; // 0000 0011 bin
    var APIS_QUALITY_MASK_DVSC = 0x0F00; // 0000 1111 0000 0000 bin
    var APIS_QUALITY_MASK_VALIDITY = 0x1000; // 0001 0000 0000 0000 bin
    var APIS_QUALITY_MASK_OPCUA = 0xE000; // 1110 0000 0000 0000 bin
    var APIS_QUALITY_INVALID_DATA = 0x1000; // 0001 0000 0000 0000 bin

    var _hdaqualities = ["extradata", "interpolative", "raw", "calculated", "nobound",
			"nodata", "data lost", "conversion", "partial"];
    var _qualities = ["bad quality", "range", "roc", "watchdog", "difference",
        "abs difference", "spc unable", "spc 1beyza", "spc 9beycent", "spc 6incdec", "spc 14altupdo",
        "spc 2of3inza", "spc 4of5inzb", "spc 15inzc", "spc 8outzc"];
    var _opcua_qualities = ["n/a", "n/a", "n/a", "out of memory", "timeout",
        "no data available", "subscription id invalid", "completes asynchronously"];
    var _badSubQualities = ["non-specific", "config error", "not connected",
        "device failure", "sensor failure", "last known value", "comm failure", "out of service",
        "waiting for initial data"];
    var _uncertainSubQualities = ["non-specific", "last usable value", "", "",
        "sensor not accurate", "engineering units exceeded", "sub normal"];
    var _goodSubQualities = ["non-specific", "", "", "", "", "", "local override"];
    var _limits = ["", "low limited", "high limited", "finalant"];

    my.getOpcQualityString = function (qualityCode) {
        var qualityStrings = this.decodeOPCQuality(parseInt(item.quality));
        return qualityStrings.join(":");
    }

    my.decodeOPCQuality = function (qualityCode) {
        var qualityStrings = [];
        var hdaSpecific = (qualityCode & OPC_HDA_QUALITY_MASK) >> 16;
        qualityStrings = qualityStrings.concat(getHDQualityString(hdaSpecific));
        qualityStrings = qualityStrings.concat(decodeOPCDAQuality(qualityCode));
        return qualityStrings;
    };

    function getHDQualityString(quality) {

        switch (quality) {
            case 0x0001:
                return _hdaqualities[0];
            case 0x0002:
                return _hdaqualities[1];
            case 0x0004:
                return _hdaqualities[2];
            case 0x0008:
                return _hdaqualities[3];
            case 0x0010:
                return _hdaqualities[4];
            case 0x0020:
                return _hdaqualities[5];
            case 0x0040:
                return _hdaqualities[6];
            case 0x0080:
                return _hdaqualities[7];
            case 0x0100:
                return _hdaqualities[8];
        }
        return "N/A";
    }

    function decodeOPCDAQuality(val) {
        var vendorSpecific = (val & VENDOR_QUALITY_MASK);// >> 8);
        var quality = ((val & OPC_QUALITY_MASK));
        var subQuality = ((val & 0x3C) >> 2);
        var limit = (val & OPC_LIMIT_MASK);
        var sb = new Array();
        sb = sb.concat(getQualityString(quality));

        if (vendorSpecific > 0) {
            sb = sb.concat(getVendorQuality(vendorSpecific));
        }

        if (subQuality > 0) {
            sb = sb.concat(getSubQuality(quality, subQuality));
        }

        if (limit > 0) {
            sb = sb.concat(getLimitQuality(limit));
        }
        return sb;
    }

    function getQualityString(quality) {
        switch (quality) {
            case OPC_QUALITY_BAD:
                return "bad";
            case OPC_QUALITY_UNCERTAIN:
                return "uncertain";
            case OPC_QUALITY_GOOD:
                return "good";
            default:
                return "n/a";
        }
    }
    function getVendorQuality(vendorQuality) {

        var sb = new Array();
        var vq = (vendorQuality & APIS_QUALITY_MASK_DVSC) >> 8;
        if (vq > 0 && vq <= _qualities.length) {
            sb = sb.concat(_qualities[vq - 1]);
        }

        if ((vendorQuality & APIS_QUALITY_MASK_VALIDITY) == APIS_QUALITY_INVALID_DATA) {
            sb = sb.concat("Invalid Data");
        }

        if ((vendorQuality & APIS_QUALITY_MASK_OPCUA) != 0) {
            var d = vendorQuality >> 13;
            if (d < _opcua_qualities.length)
                sb = sb.concat(_opcua_qualities[d]);
        }
        return sb;
    }

    function getSubQuality(quality, sub) {
        if (sub > 0) {
            switch (quality) {
                case OPC_QUALITY_BAD:
                    return _badSubQualities.length > sub ? _badSubQualities[sub] : "";
                case OPC_QUALITY_UNCERTAIN:
                    return _uncertainSubQualities.length > sub ? _uncertainSubQualities[sub] : "";
                case OPC_QUALITY_GOOD:
                    return _goodSubQualities.length > sub ? _goodSubQualities[sub] : "";
            }
        }
        return "";
    }

    function getLimitQuality(limit) {
        if (limit > 0) {
            return _limits.length > limit ? _limits[limit] : "";
        }
        return "";
    }

    return my;
}());

var CommonFunction = (function () {
    var my = {};

    my.formatItemValue = function (itemValue, useScientificNotation, numDecimals) {
        var formattedValue;
        if (useScientificNotation) {
            formattedValue = CommonFunction.getScentificNotationOfNumber(Number(itemValue));
            var delimiter = numeral.languageData().delimiters.decimal;
            if (delimiter != '.')
                formattedValue = formattedValue.replace('.', delimiter);
        }
        else {
            var numOfDecimals = numDecimals;
            var defaultFormat = "0,0";
            if (numOfDecimals > 0) {
                defaultFormat += '.';
            }
            for (i = 0; i < numOfDecimals; i++) {
                defaultFormat += '0';
            }
            formattedValue = numeral(itemValue).format(defaultFormat);
        }

        return formattedValue;
    }

    my.getScentificNotationOfNumber = function (number) {
        var exponentialStandard = number.toExponential();
        var exponentialFix2 = number.toExponential(2);
        var exponential = exponentialStandard.length > exponentialFix2.length ? exponentialFix2 : exponentialStandard;
        var strArr = exponential.split('+');
        var result = strArr.join('');
        var index = result.indexOf('.');
        if (result.substring(index + 1, index + 3) == '00')
            result = result.substring(0, index) + result.substring(index + 3);
        if (result.substring(index + 2, index + 3) == '0')
            result = result.substring(0, index + 2) + result.substring(index + 3);
        return result;
    }

    my.parseValueByExpression = function(value, valExp) {
        if (valExp) {
            var expression = valExp;
            if (expression) {
                var valArray = value.split(";");
                value = "";
                for (var k = 0; k < valArray.length; k++) {
                    var val = parseFloat(valArray[k]);
                    if (!isNaN(val)) {
                        eval(expression);
                        if (k == (valArray.length - 1))
                            value += val;
                        else
                            value += val + ";";
                    }
                }
            }
        }
        return value;
    }

    return my;
}());

var HistoricalAccess = (function () {
    var my = {};

    //get historical
    my.requestHistoricalDataInTimespan = function (axisX, curveProperties, commonProperty) {
        var items = new Array();
        var controls = new Array();
        var connectors = new Array();

        var startTime = axisX.minimum - axisX.timespan;

        for (var i = 0; i < axisX.mergedCurveIndexes.length; i++) {
            var curveProperty = getCurvePropertyByCurveIndex(axisX.mergedCurveIndexes[i], curveProperties);
            var endTime = new Date();
            if (curveProperty.series.data[0] != null && curveProperty.series.data[0][CONSTANT.xIndex] != null)
                endTime = curveProperty.series.data[0][CONSTANT.xIndex];
            items.push(new Prediktor_Dancer_DA_HDALinkItem(curveProperty.itemTag, new Date(startTime), new Date(endTime)));
            curveProperty.itemAttrSeries.forEach(function (itemAttrSeries) {
                if (itemAttrSeries.data[0] != null && itemAttrSeries.data[0][CONSTANT.xIndex] != null)
                    endTime = itemAttrSeries.data[0][CONSTANT.xIndex];
                items.push(new Prediktor_Dancer_DA_HDALinkItem(itemAttrSeries.itemTag, new Date(startTime), new Date(endTime)));
            });
        }

        controls.push(new Prediktor_Dancer_DA_HDALinkControl(commonProperty.controlIndex, items));
        connectors.push(new Prediktor_Dancer_DA_HDALinkConnector(commonProperty.connectorName, controls));
        var reader = new Prediktor_Dancer_DA_HDALink();
        reader.getHistoricalData(connectors);
    };

    my.parseHistoryStringToItems = function (history) {
        var vector = false;
        var ind = history.indexOf(";"); // > -1 if vector or dynamic attribute
        if (ind > -1) {
            vector = isValidNumber(history.charAt(ind - 1));// else attribute
        }

        var tokenizer = history.split("\t");
        var itemsArr = new Array();
        var itemsCounts = 0;
        //Map<ItemData, IBasicDataPoint[]> itemMap = new HashMap<ItemData, IBasicDataPoint[]>();

        for (var nextToken = 0; nextToken < tokenizer.length;) {
            var numDatapoints = parseInt(tokenizer[nextToken++]) / 7;
            var items = new Array();
            var key = null;
            var value = 0;
            var values = null;
            var yVector = true;

            for (var i = 0; i < numDatapoints; i++) {
                if (vector) {
                    values = decodeVectorValues(tokenizer[nextToken++]);
                }
                else {
                    value = parseFloat(tokenizer[nextToken++]);
                }
                var quality = parseInt(tokenizer[nextToken++]);
                var timestamp = parseInt(tokenizer[nextToken++]);
                key = tokenizer[nextToken++]; //property. keep the name property at item object
                var attr = tokenizer[nextToken++]; // attribute
                var index = tokenizer[nextToken++]; // index
                var qualityCode = parseInt(tokenizer[nextToken++]); // qualitycode

                if (vector) {
                    items[i] = new Item(values, quality, timestamp, key, attr, index, qualityCode);
                }
                else {
                    items[i] = new Item(value, quality, timestamp, key, attr, index, qualityCode);
                }
            }
           
            items.sort(compareByTime);
            items = removeDuplicatesByTimestamp(items);
            itemsArr[itemsCounts++] = items;
        }

        return itemsArr;
    };

    my.parseHistoryStringToItemArray = function (history) {
        var vector = false;
        var ind = history.indexOf(";"); // > -1 if vector or dynamic attribute
        if (ind > -1) {
            vector = isValidNumber(history.charAt(ind - 1));// else attribute
        }

        var tokenizer = history.split("\t");
        var itemsArr = new Array();
        var itemsCounts = 0;
        //Map<ItemData, IBasicDataPoint[]> itemMap = new HashMap<ItemData, IBasicDataPoint[]>();

        for (var nextToken = 0; nextToken < tokenizer.length;) {
            var numDatapoints = parseInt(tokenizer[nextToken++]) / 7;
            var items = new Array();
            var key = null;
            var value = 0;
            var values = null;
            var yVector = true;

            for (var i = 0; i < numDatapoints; i++) {
                if (vector) {
                    values = decodeVectorValues(tokenizer[nextToken++]);
                }
                else {
                    value = parseFloat(tokenizer[nextToken++]);
                }
                var quality = parseInt(tokenizer[nextToken++]);
                var timestamp = parseInt(tokenizer[nextToken++]);
                key = tokenizer[nextToken++]; //property. keep the name property at item object
                var attr = tokenizer[nextToken++]; // attribute
                var index = tokenizer[nextToken++]; // index
                var qualityCode = parseInt(tokenizer[nextToken++]); // qualitycode

                if (vector) {
                    items[i] = new Item(values, quality, timestamp, key, attr, index, qualityCode);
                }
                else {
                    items[i] = new Item(value, quality, timestamp, key, attr, index, qualityCode);
                }
            }
            function compareByTime(a, b) {
                return a.timestamp - b.timestamp;
            }
            items.sort(compareByTime);
            items = removeDuplicatesByTimestamp(items);
            itemsArr[itemsCounts++] = items;
        }

        return itemsArr;
    };

    function compareByTime(a, b) {
        return a.timestamp - b.timestamp;
    };

    function Item(value, quality, timestamp, property, attribute, index, qualitycode) {
        this.value = value;
        this.quality = quality;
        this.timestamp = timestamp;
        this.property = property;
        this.attribute = attribute;
        this.index = index;
        this.qualitycode = qualitycode;
    };

    function decodeVectorValues(values) {
        var retval = new Array();
        var index1 = 0, index2 = values.indexOf(";");
        var i = 0;
        while (index2 > -1) {
            retval[i] = Float.parseFloat(values.substring(index1, index2));
            index1 = index2 + 1;
            index2 = values.indexOf(";", index1);
            i++;
        }
        return retval;
    };

    // the array dataPoints was sorted by timestamp already
    function removeDuplicatesByTimestamp(dataPoints) {
        var uniqueArray = new Array();
        var dataCount = 0;
        for (i = 0; i < dataPoints.length - 1; i++) {
            if (dataPoints[i].timestamp != dataPoints[i + 1]) {
                uniqueArray[dataCount++] = dataPoints[i];
            }
        }
        return uniqueArray;
    };

    return my;
}());