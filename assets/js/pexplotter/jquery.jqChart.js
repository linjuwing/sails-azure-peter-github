/*
 * jqChart v4.0.0.0 (http://www.jqchart.com)
 * Copyright 2016 jqChart Inc. All rights reserved.
 *
 * jqChart commercial licenses may be obtained at
 * http://www.jqchart.com/pricing.aspx
 * If you do not own a commercial license, this file shall be governed by the trial license terms.
 */
(function ($) {

/**
 * @class Chart.jqChart 
 *
 * Defines jqChart plugin. Example:
 *
 *     @example
 *     $('#selector').jqChart({
 *         title: { text: 'Chart Title' },
 *         axes: [
 *           {
 *             type: 'category',
 *             location: 'bottom',
 *             zoomEnabled: true
 *           }
 *         ],
 *         series: [
 *           {
 *             type: 'column',
 *             title: 'Column',
 *             data: [62, 70, 68, 58, 52, 60, 48]
 *           }
 *         ]
 *     });
 */
$.fn.jqChart = function (option, settings, value) {

    /**
     * @cfg {String} width
     * Specifies the chart width - exp: width : '400px'
     */

    /**
     * @cfg {String} height
     * Specifies the chart height - exp: height: '300px'
     */

    /**
    * @cfg {String/Common.Gradient} background
    * Specifies the chart background fill style.
    */

    /**
    * @cfg {String/Common.Gradient} chartAreaBackground
    * Specifies the chart area background fill style.
    */

    /**
     * @cfg {Number} globalAlpha
     * Specifies the chart global alpha. The globalAlpha attribute specifies the transparency of the chart. 
     * It can be a number between 0 and 1. 
     * 
     * 0=full transparency, 1=no transparency. 
     */

    /**
    * @cfg {Common.Border} border
    * Specifies the chart border.
    */

    /**
    * @cfg {String/Common.Title} title
    * Specifies the chart title.
    */

    /**
    * @cfg {Chart.Legend} legend
    * Specifies the chart legend.
    */

    /**
    * @cfg {Common.Tooltips} tooltips
    * Specifies the chart tooltips.
    */

    /**
    * @cfg {Chart.Crosshairs} crosshairs
    * Specifies the chart crosshairs.
    */

    /**
      * @cfg {Chart.ChartPaletteColors} paletteColors
      * Specifies the palette colors.
      */

    /**
      * @cfg {Common.Animation} animation
      * Specifies the chart animation.
      */

    /**
      * @cfg {Common.Title} noDataMessage
      * Specifies the displayed message, when there is no chart data.
      */

    /**
      * @cfg {Common.Shadows} shadows
      * Specifies the chart shadows.
      */

    /**
      * @cfg {Common.Watermark} watermark
      * Specifies the chart watermark.
      */

    /**
      * @cfg {Chart.ChartToolbar} toolbar
      * Specifies the chart toolbar.
      */

    /**
      * @cfg {String} mouseInteractionMode
      * Specifies the chart mouse interaction mode - 'zooming' or 'panning'.
      *
      * Defaults to: 'panning'
      */

    /**
      * @cfg {String} mouseWheelInteractionMode
      * Specifies the chart mouse wheel interaction mode - 'zooming' or 'scrolling'.
      *
      * Defaults to: 'zooming'
      */

    /**
      * @cfg {Chart.SelectionRect} selectionRect
      * Specifies the chart selection rect.
      */

    /**
      * @cfg {Array/Chart.DataSource} dataSource
      * Specifies the chart data source.
      */

    /**
      * @cfg {Chart.Axes.Axis[]} axes
      * Specifies the chart axes.
      */

    /**
      * @cfg {Chart.Series.Series[]} series
      * Specifies the chart series.
      */

    if (typeof option === 'object') {
        settings = option;
    }
    else if (typeof option === 'string') {
        option = option.toLowerCase();

        if ($.fn.jqChart.methods[option]) {
            return $.fn.jqChart.methods[option].call(this, settings, value);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.jqChart');
        }
    }

    var chart = this.data('data');
    if (!chart) {
        chart = new JQChart(this);
        this.data('data', chart);
    }

    chart._processOptions(settings);

    return this;
};

$.fn.jqChart.methods = {

    chart: function () {
        return this.data('data');
    },
    destroy: function () {
        var chart = this.data('data');
        if (chart) {
            chart.destroy();
            this.removeData('data');
        }
    },
    options: function () {

        var chart = this.data('data');
        if (!chart) {
            return;
        }

        return chart.options;
    },
    option: function (option, value) {

        var chart = this.data('data');
        if (!chart) {
            return;
        }

        if (!value) {
            return chart.options[option];
        }

        chart.options[option] = value;

        chart._processOptions(chart.options);
    },
    update: function (settings) {

        var chart = this.data('data');
        if (!chart) {
            return this;
        }

        var options = $.extend(false, {}, chart.options, settings || {});

        chart._processOptions(options);
    },
    todataurl: function (mimetype) {
        var chart = this.data('data');
        if (!chart) {
            return null;
        }

        return chart.toDataURL(mimetype);
    },
    highlightdata: function (items) {
        var chart = this.data('data');
        if (chart) {
            chart.highlightData(items);
        }
    },
    ismouseover: function () {
        var chart = this.data('data');
        if (chart) {
            return chart.isMouseOver;
        }

        return false;
    },
    exporttoimage: function (config) {
        var chart = this.data('data');
        if (chart) {
            chart.exportToImage(config);
        }
    },
    exporttopdf: function (config) {
        var chart = this.data('data');
        if (chart) {
            chart.exportToPdf(config);
        }
    }
};

$.fn.jqChart.defaults = {
    title: {
        margin: 8,
        font: '22px sans-serif'
    },
    tooltips: {
        disabled: false,
        type: 'normal', // normal, shared
        borderColor: 'auto',
        snapArea: 25,
        highlighting: true,
        highlightingFillStyle: 'rgba(204, 204, 204, 0.5)',
        highlightingStrokeStyle: 'rgba(204, 204, 204, 0.5)'
    },
    crosshairs: {
        enabled: false,
        snapToDataPoints: true,
        hLine: { visible: true, strokeStyle: 'red' },
        vLine: { visible: true, strokeStyle: 'red' }
    },
    globalAlpha: 1,
    mouseInteractionMode: 'panning', // zooming, panning
    mouseWheelInteractionMode: 'zooming', // zooming, scrolling
    mouseWheelZoomInDirect: 'up',  // scroll up to zoom in
    selectionRect: {
        fillStyle: 'rgba(125,125,125,0.2)',
        strokeStyle: 'gray',
        lineWidth: 0
    },
    shadows: {
        enabled: false,
        shadowColor: '#cccccc', // rgba(0, 0, 0, 0)
        shadowBlur: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2
    },
    watermark: {
        hAlign: 'right',
        vAlign: 'bottom'
    },
    noDataMessage: {
        text: 'No data available',
        font: '20px sans-serif'
    },
    exportConfig: {
        server: 'http://www.jqchart.com/export/default.aspx',
        method: 'post'
    }
};

$.fn.jqChart.labelFormatter = function (format, val) {
    if (!format) {
        return String(val);
    }

    return $.jqChartSprintf(format, val);
};

$.fn.jqMouseCapture = function (params) {
    var $doc = $(document);

    this.each(function () {
        var $this = $(this);
        var sharedData = {};

        $this.mousedown(function (e) {
            // mousemove

            var moveHandler;

            if (params.move) {
                moveHandler = function (e) {
                    params.move.call($this, e, sharedData);
                };

                $doc.mousemove(moveHandler);
            }

            // mouseup                

            var upHandler;

            var unbind = function () {
                if (params.move) $doc.unbind("mousemove", moveHandler);
                $doc.unbind("mouseup", upHandler);
            };

            if (params.up) {
                upHandler = function (e) {
                    unbind();
                    return params.up.call($this, e, sharedData);
                };
            }
            else {
                upHandler = unbind;
            }

            $doc.mouseup(upHandler);

            // mousedown

            e.preventDefault()

            return params.down.call($this, e, sharedData);
        });
    });

    return this;
};

    /**
    * JavaScript printf/sprintf functions.
    *
    * This code is unrestricted: you are free to use it however you like.
    * 
    * The functions should work as expected, performing left or right alignment,
    * truncating strings, outputting numbers with a required precision etc.
    *
    * For complex cases, these functions follow the Perl implementations of
    * (s)printf, allowing arguments to be passed out-of-order, and to set the
    * precision or length of the output based on arguments instead of fixed
    * numbers.
    *
    * See http://perldoc.perl.org/functions/sprintf.html for more information.
    *
    * Implemented:
    * - zero and space-padding
    * - right and left-alignment,
    * - base X prefix (binary, octal and hex)
    * - positive number prefix
    * - (minimum) width
    * - precision / truncation / maximum width
    * - out of order arguments
    *
    * Not implemented (yet):
    * - vector flag
    * - size (bytes, words, long-words etc.)
    * 
    * Will not implement:
    * - %n or %p (no pass-by-reference in JavaScript)
    *
    * @version 2007.04.27
    * @author Ash Searle
    */
    $.jqChartSprintf = function () {
        function pad(str, len, chr, leftJustify) {
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        }

        function justify(value, prefix, leftJustify, minWidth, zeroPad) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, ' ', leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }

            return value;
        }

        function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && { '2': '0b', '8': '0', '16': '0x'}[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        }

        function formatString(value, leftJustify, minWidth, precision, zeroPad) {
            if (precision != null) {
                value = value.slice(0, precision);
            }

            return justify(value, '', leftJustify, minWidth, zeroPad);
        }

        var a = arguments, i = 0, format = a[i++];
        return format.replace($.jqChartSprintf.regex, function (substring, valueIndex, flags, minWidth, _, precision, type) {
            if (substring == '%%') return '%';

            // parse flags
            var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false;
            for (var j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
                case ' ': positivePrefix = ' '; break;
                case '+': positivePrefix = '+'; break;
                case '-': leftJustify = true; break;
                case '0': zeroPad = true; break;
                case '#': prefixBaseX = true; break;
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values

            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth == '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void (0);
            } else if (precision == '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

            switch (type) {
                case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
                case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    {
                        var number = parseInt(+value);
                        var prefix = number < 0 ? '-' : positivePrefix;
                        value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                        return justify(value, prefix, leftJustify, minWidth, zeroPad);
                    }
                case 'e':
                case 'E':
                case 'f':
                case 'F':
                case 'g':
                case 'G':
                    {
                        var number = +value;
                        var prefix = number < 0 ? '-' : positivePrefix;
                        var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                        var textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                        value = prefix + Math.abs(number)[method](precision);
                        return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                    }
                default: return substring;
            }
        });
    }
    $.jqChartSprintf.regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;


    /*
    * Date Format 1.2.3
    * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
    * MIT license
    *
    * Includes enhancements by Scott Trenda <scott.trenda.net>
    * and Kris Kowal <cixar.com/~kris.kowal/>
    *
    * Accepts a date, a mask, or a date and a mask.
    * Returns a formatted version of the given date.
    * The date defaults to the current date/time.
    * The mask defaults to dateFormat.masks.default.
    */

    $.jqChartDateFormatter = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = $.jqChartDateFormat;
            var amPm = dF.amPm;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || "ddd mmm dd yyyy HH:MM:ss");

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.dayNames[D],
			    dddd: dF.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.monthNames[m],
			    mmmm: dF.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? amPm[0].charAt(0) || "" : amPm[1].charAt(0) || "",
			    tt: H < 12 ? amPm[0] : amPm[1],
			    T: H < 12 ? amPm[2].charAt(0) || "" : amPm[3].charAt(0) || "",
			    TT: H < 12 ? amPm[2] : amPm[3],
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: dF.s(d)
			};

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    $.jqChartDateFormat = {
        // Some common format strings
        masks: {
            shortDate: "m/d/yyyy",
            shortTime: "h:MM TT",
            longTime: "h:MM:ss TT",
            inforbartime: "d.m.yyyy HH:MM:ss"
        },
        dayNames: [
		    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        amPm: ["am", "pm", "AM", "PM"],
        s: function (j) { return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th' },
        monthNames: [
		    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    }

/**
 * @class Common.Storyboard
 *
 */
function Storyboard(callback) {

    this.callback = callback;
    this.animations = [];    
}

Storyboard.prototype = {
    begin: function () {

        if (CanvasControl.use_excanvas) {
            return;
        }

        var animaitons = this.animations;

        if (!animaitons || animaitons.length == 0) {
            return;
        }

        this.stopped = false;

        var startTime = new Date();

        // set start times
        for (var i = 0; i < animaitons.length; i++) {

            var animation = animaitons[i];
            animation.begin(startTime);
        }

        this.animate();
    },

    animate: function () {

        if (this.stopped) {
            return;
        }

        var animaitons = this.animations;

        var time = new Date();
        var animating = false;

        for (var i = 0; i < animaitons.length; i++) {

            var animation = animaitons[i];
            var animate = animation.animate(time);

            animating = animating || animate;
        }

        if (!animating) {
            return;
        }

        this.callback();

        requestFrame($.proxy(this.animate, this));
    },

    stop: function () {
        this.stopped = true;
    },

    clear: function () {
        this.animations = [];
    },

    addAnimation: function (animation) {
        this.animations.push(animation);
    }
}

var requestFrame = (function () {
    return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function (fn, element) {
	    		    return window.setTimeout(function () {
	    		        fn();
	    		    }, 25);
	    		}
	    	);
})();

function Timer(fn) {
    var callback = fn;
    var active = false;
    var running = false;

    function trigger(time) {
        if (active) {
            callback();
            requestFrame(trigger);
            running = true;
            active = false;
        }
        else {
            running = false;
        }
    }

    this.kick = function (fn) {
        active = true;
        if (!running) {
            trigger();
        }
    };

    this.end = function (fn) {
        var cb = callback;

        if (!fn) {
            return;
        }

        // If the timer is not running, simply call the end callback.
        if (!running) {
            fn();
        }
        // If the timer is running, and has been kicked lately, then
        // queue up the current callback and the end callback, otherwise
        // just the end callback.
        else {
            callback = active ? function () { cb(); fn(); } : fn;

            active = true;
        }
    };
}

/**
 * @class Common.Animation
 *
 * Defines an animation.
 *
 * Sample configuration:
 *
 *     var animationConfig: {
 *         enabled : true,
 *         delayTime: 1,
 *         duration: 2
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Animation' },
 *               animation: {
 *                   enabled: true,
 *                   delayTime: 1,
 *                   duration: 2
 *               },
 *               series: [
 *                   {
 *                       type: 'column',
 *                       title: 'Column',
 *                       data: [['A', 46], ['B', 35], ['C', 68], ['D', 30], 
 *                              ['E', 27], ['F', 85], ['D', 43], ['H', 29]]
 *                   },
 *                   {
 *                       type: 'line',
 *                       title: 'Line',
 *                       data: [['A', 69], ['B', 57], ['C', 86], ['D', 23], 
 *                              ['E', 70], ['F', 60], ['D', 88], ['H', 22]]
 *                   }
 *               ]
 *           });
 *       });
 **/
function Animation(settings, object, option, from, to) {

    var defs = {
        /**
         * @cfg {Boolean} enabled
         * Specifies whether or not the animation is enabled.
         */
        enabled: true,
        /**
         * @cfg {Number} delayTime
         * Specifies the initial delay time of the animation (in seconds).
         */
        delayTime: 0,
        /**
         * @cfg {Number} duration
         * Specifies the animation duration (in seconds).
         */
        duration : 2
    }

    if (!settings) {
        return;
    }

    this.enabled = !(settings.enabled === false);

    this.delayTime = settings.delayTime || 0;
    this.duration = settings.duration || 2;

    this.from = from;
    this.to = to;

    this.object = object;
    this.option = option;
}

Animation.prototype = {
    begin: function (time) {

        this.startTime = jDate.addSeconds(time, this.delayTime);
        this.endTime = jDate.addSeconds(this.startTime, this.duration);

        this.timeDiff = this.endTime.getTime() - this.startTime.getTime();
        this.valueDiff = this.to - this.from;

        this.object[this.option] = this.from;

        this.lastIsSet = false;
    },

    animate: function (time) {

        if (time >= this.endTime) {

            if (!this.lastIsSet) {
                this.object[this.option] = this.to;
                this.lastIsSet = true;
                return true;
            }

            return false;
        }

        if (time > this.startTime) {

            var currTime = time.getTime() - this.startTime.getTime();

            var curValue = this.from + this.valueDiff * currTime / this.timeDiff;

            if (curValue === this.to) {
                this.lastIsSet = true;
            }

            this.object[this.option] = curValue;
        }

        return true;
    }
}

/**
 * @class Common.OptionAnimation
 * @extends Common.Animation
 *
 */
function OptionAnimation(settings, object, option, from, to) {
    Animation.call(this, settings, object, option, from, to);
}

OptionAnimation.prototype = new Animation();
OptionAnimation.constructor = OptionAnimation;

OptionAnimation.prototype.begin = function (time) {

    this.startTime = jDate.addSeconds(time, this.delayTime);
    this.endTime = jDate.addSeconds(this.startTime, this.duration);

    this.object[this.option] = this.from;

    this.lastIsSet = false;
}

OptionAnimation.prototype.animate = function (time) {

    if (time >= this.endTime) {

        if (!this.lastIsSet) {
            this.object[this.option] = this.to;
            this.lastIsSet = true;
            return true;
        }

        return false;
    }

    return true;
}

/**
 * @class Common.Tool
 *
 */
function Tool(view) {
    this.view = view;
}

Tool.prototype = {

    canStart: function (e) {
        return false;
    },

    start: function () {

    },

    keyDown: function (e) {

    },

    keyUp: function (e) {

    },

    mouseMove: function (e) {

    },

    mouseDown: function (e) {

    },

    mouseUp: function (e) {

    },


    touchStart: function (e) {

    },

    touchMove: function (e) {

    },

    touchEnd: function (e) {

    },

    mouseWheel: function (e, delta, deltaX, deltaY) {

    },
    
    stop: function () {

    },

    stopTool: function () {
        if (this.view.currentTool == this) {
            this.view.setCurrentTool(null);
        }
    }
}

/**
 * @class Common.DefaultTool
 * @extends Common.Tool
 *
 */
function DefaultTool(view) {
    Tool.call(this, view);
}

DefaultTool.prototype = new Tool();
DefaultTool.constructor = DefaultTool;

DefaultTool.prototype.mouseDown = function (e) {

    var tools = this.view.mouseDownTools;

    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.canStart(e)) {
            this.view.setCurrentTool(tool);
            return;
        }
    }
}

DefaultTool.prototype.mouseMove = function (e) {

    var tools = this.view.mouseMoveTools;

    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.canStart(e)) {
            this.view.setCurrentTool(tool);
            return;
        }
    }

    this.view._processMouseMove(e);
}

DefaultTool.prototype.touchStart = function (e) {

    var tools = this.view.touchStartTools;

    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.canStart(e)) {
            this.view.setCurrentTool(tool);
            return;
        }
    }

    this.view._processTouchStart(e);
}

DefaultTool.prototype.touchMove = function (e) {

    var tools = this.view.touchMoveTools;

    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.canStart(e)) {
            this.view.setCurrentTool(tool);
            return;
        }
    }

    this.view._processTouchMove(e);
}

/**
 * @class Common.CanvasControl
 *
 * Defines a base plugin class functionalities. 
 */
function CanvasControl(elem) {

	if (!elem) {
		return;
	}

	this.shapes = [];

	this.mouseDownTools = [];
	this.mouseMoveTools = [];

	this.touchStartTools = [];
	this.touchMoveTools = [];

	this.defaultTool = new DefaultTool(this);
	this.currentTool = this.defaultTool;

	this._createElements(elem);
}

CanvasControl.setShadows = function (shape, opts, chart) {

	if (!chart) {
		return;
	}

	var shadows = chart.options.shadows;

	shape.shadowColor = !jMath.isNull(opts.shadowColor) ? opts.shadowColor : shadows.shadowColor;
	shape.shadowBlur = !jMath.isNull(opts.shadowBlur) ? opts.shadowBlur : shadows.shadowBlur;
	shape.shadowOffsetX = !jMath.isNull(opts.shadowOffsetX) ? opts.shadowOffsetX : shadows.shadowOffsetX;
	shape.shadowOffsetY = !jMath.isNull(opts.shadowOffsetY) ? opts.shadowOffsetY : shadows.shadowOffsetY;
};

CanvasControl.support_canvas = function () {
	return !!document.createElement('canvas').getContext;
};

CanvasControl.use_excanvas = !CanvasControl.support_canvas() ? true : false;

CanvasControl.isMouseDevice = !!('onmousedown' in window || 'onmousedown' in window.document);
CanvasControl.isTouchDevice = !!('ontouchstart' in window);
CanvasControl.isGestureDevice = !!('ongesturestart' in window);
CanvasControl.isPointerDevice = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;

CanvasControl.checkIfRetinaDisplay = function () {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

	if (window.devicePixelRatio >= 2) {
		return true;
	}

	if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
		return true;
	}

	return false;
};

CanvasControl.isRetinaDisplay = CanvasControl.checkIfRetinaDisplay();

CanvasControl.prototype = {

	_createElements: function (elem) {

		this.elem = elem;

		var that = this;

		if (CanvasControl.isMouseDevice) {

			elem.mouseenter(function (e) {
				that._mouseEnter(e);
			});
			elem.mouseleave(function (e) {
				that._mouseLeave(e);
			});

			elem.jqMouseCapture({
				down: $.proxy(that._mouseDown, this),
				move: $.proxy(that._mouseMove, this),
				up: $.proxy(that._mouseUp, this)
			});

			elem.mousemove(function (e) {
				if (!that.isMouseDown) {
					that._mouseMove(e);
				}
			});
		}

		elem.keydown(function (e) {
			that._keyDown(e);
		});
		elem.keyup(function (e) {
			that._keyUp(e);
		});

		elem.click(function (e) {
			that._click(e);
		});

		elem.dblclick(function (e) {
			that._dblClick(e);
		});

		elem.resize(function () {
			that._resize();
		});

		$(window).bind('resize.jqChart', function () {
			that._resize();
		});

		$(window.document).bind('keydown.jqChart', function (e) {
			that._keyDown(e);
		});

		elem.bind('mousewheel', function (e, delta, deltaX, deltaY) {
			that._mouseWheel(e, delta, deltaX, deltaY);
		});

		if (CanvasControl.isTouchDevice) {
			elem.bind('touchstart', function (e) {
				that._touchStart(e);
			});
			elem.bind('touchmove', function (e) {
				that._touchMove(e);
			});
			elem.bind('touchend', function (e) {
				that._touchEnd(e);
			});
		}
		else if (CanvasControl.isPointerDevice) {

			$.each(['pointerdown', 'MSPointerDown'], function () {
				elem.bind(this, function (e) {
					that._touchStart(e);
				});
			});

			$.each(['pointermove', 'MSPointerMove'], function () {
				elem.bind(this, function (e) {
					that._touchMove(e);
				});
			});

			$.each(['pointerup', 'pointercancel', 'MSPointerUp', 'MSPointerCancel'], function () {
				elem.bind(this, function (e) {
					that._touchEnd(e);
				});
			});
		}

		this.canvas = this._createCanvas();
		this.tooltip = this._createTooltip();

		// main canvas renderer
		this.shapeRenderer = new ShapeRenderer(this.canvas, this);
		this.ctx = this.shapeRenderer.ctx;
	},

	_setOptions: function (options) {

		this.locOffset = null;

		var elem = this.elem;

		this.originalCursor = 'auto'; // elem.css('cursor');

		if (!elem.hasClass(this.pluginClass)) {
			elem.addClass(this.pluginClass);
		}

		if (elem.css('position') == 'static') {
			elem.css('position', 'relative');
		}

		if (!this.tooltip.hasClass(this.tooltipClass)) {
			this.tooltip.addClass(this.tooltipClass)
		}
	},

	_createHighlightRenderer: function () {

		if (CanvasControl.use_excanvas) {
			this.hlCanvas = this._createCanvas(true);

			var div = $('<div style="position:absolute"></div>');

			this.getCanvasContainer().append(div);
			div.append(this.hlCanvas);

			this.hlRenderer = new ShapeRenderer(this.hlCanvas, this);
			this.hlRenderer.div = div;
		}
		else {
			this.hlCanvas = this._createCanvas();
			this.hlRenderer = new ShapeRenderer(this.hlCanvas, this);
		}

		this.hlRenderer.isHighlighting = true;
	},

	_createCanvas: function (notAppend) {
		var canvas = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		$(canvas).css({ position: 'absolute', left: 0, top: 0 });

		if (CanvasControl.use_excanvas) {
			window.G_vmlCanvasManager.init_(document);
			window.G_vmlCanvasManager.initElement(canvas);
		}

		if (!notAppend) {
			this.getCanvasContainer().append(canvas);
		}

		return canvas;
	},

	_setCanvasSize: function (canvas, w, h) {
		canvas.width = w;
		canvas.height = h;
	},

	_setRetinaDispOpts: function (canvas, w, h) {
		canvas.setAttribute('width', 2 * w);
		canvas.setAttribute('height', 2 * h);

		var context = canvas.getContext('2d');
		context.scale(2, 2);
	},

	_createTooltip: function () {

		var tooltip = $('<div style="position:absolute;display:none"></div>');

		this.getCanvasContainer().append(tooltip);

		return tooltip;
	},


	_addTrialWatermark: function (shapes) {
		var indexOf = window.location.host.indexOf('www.jquerychart.com');
		if (indexOf != -1) {
			return;
		}

		indexOf = window.location.host.indexOf('www.jqchart.com');
		if (indexOf != -1) {
			return;
		}

		var textBlock = new TextBlock('www.jqchart.com');
		textBlock.chart = this;
		textBlock.font = '14px sans-serif';
		textBlock.fillStyle = 'gray';
		textBlock.measure(this.ctx);
		textBlock.x = this._width - textBlock.width - 16;
		textBlock.y = this._height - textBlock.height;

		shapes.push(textBlock);
	},


	_measure: function () {
	},

	_arrange: function () {
	},


	_keyDown: function (e) {
		this.currentTool.keyDown(e);
	},

	_keyUp: function (e) {
		this.currentTool.keyUp(e);
	},


	_mouseEnter: function (e) {
		this.isMouseOver = true;
	},

	_mouseLeave: function (e) {
		this._clearRenderers();
		this.locOffset = null;
		this.isMouseOver = false;
	},

	_mouseDown: function (e) {

		this.isMouseDown = true;

		if (this._oldShape != null) {
			this._triggerShapeEvent('MouseDown', this._oldShape);
		}

		this.currentTool.mouseDown(e);
	},

	_mouseMove: function (e) {

		this._initMouseInput(e);

		this._processMouseEvents();

		this.currentTool.mouseMove(e);
	},

	_mouseUp: function (e) {
		if (this._oldShape != null) {
			this._triggerShapeEvent('MouseUp', this._oldShape);
		}

		this.isMouseDown = false;

		this.currentTool.mouseUp(e);
	},

	_mouseWheel: function (e, delta, deltaX, deltaY) {
		this.currentTool.mouseWheel(e, delta, deltaX, deltaY);
	},

	_click: function (e) {
		if (this._oldShape != null) {
			this._triggerShapeEvent('Click', this._oldShape);
		}
	},

	_dblClick: function (e) {
		if (this._oldShape != null) {
			this._triggerShapeEvent('DblClick', this._oldShape);
		}
	},


	_touchStart: function (e) {

		this._initTouchInput(e);

		this.isTouchOver = true;

		this._processTouchEvents();

		this.currentTool.touchStart(e);
	},

	_touchMove: function (e) {

		this._initTouchInput(e);

		var touch = this.touchInput[0];

		this.isTouchOver = this.contains(touch.locX, touch.locY);

		this._processTouchEvents();

		this.currentTool.touchMove(e);
	},

	_touchEnd: function (e) {

		this._initTouchInput(e);

		if (this._oldShape != null) {
			this._triggerShapeEvent('TouchEnd', this._oldShape);
			this._oldShape = null;
		}

		this.currentTool.touchEnd(e);
	},

	_initMouseInput: function (e) {
		this.isMouseOver = true;

		var x = e.pageX;
		var y = e.pageY;

		if (!this.locOffset) {
			this.locOffset = this._getLocOffset();
		}

		var offset = this.locOffset;

		var locX = x - offset.left;
		var locY = y - offset.top;

		var input = {
			x: x,
			y: y,
			locX: locX,
			locY: locY
		};

		this.mouseInput = input;
	},

	_initTouchInput: function (e) {
		// var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		// var touches = this.getAllTouches(e);
		var touches = e.originalEvent.touches;

		if (!this.locOffset) {
			this.locOffset = this._getLocOffset();
		}

		var offset = this.locOffset;

		var input = [];

		for (var i = 0; i < touches.length; i++) {

			var touch = touches[i];

			var x = touch.pageX;
			var y = touch.pageY;

			var locX = x - offset.left;
			var locY = y - offset.top;

			input.push({
				x: x,
				y: y,
				locX: locX,
				locY: locY
			});
		}

		this.touchInput = input;
	},

	_getLocOffset: function () {
		var offset = this.getCanvasContainer().offset();

		var left = parseFloat($(document.body).css('borderLeftWidth'));
		if (!isNaN(left)) {
			offset.left += left;
		}

		var top = parseFloat($(document.body).css('borderTopWidth'));
		if (!isNaN(top)) {
			offset.top += top;
		}

		return offset;
	},

	getAllTouches: function (e) {
		var props = ["touches", "changedTouches"];

		var allTouches = [];

		for (var i = 0; i < props.length; i++) {
			var touches = e.originalEvent[props[i]];

			for (var j = 0; j < touches.length; j++) {
				var touch = touches[j];

				if ($.inArray(touch, allTouches) == -1) {
					allTouches.push(touch);
				}
			}
		}

		return allTouches;
	},

	_resize: function () {

		var elem = this.elem;

		var w = elem.width();
		var h = elem.height();

		if (w != this._width || h != this._height) {

			var opts = this.options;
			if (opts) {
				if (!jMath.isNull(opts.width)) {
					opts.width = w;
				}

				if (!jMath.isNull(opts.height)) {
					opts.height = h;
				}
			}

			this._setOptions(this.options);
		}
	},

	_clearRenderers: function () {

		if (this._oldTShapes) {
			this._oldTShapes = null;
			this.elem.trigger('dataHighlighting', null);
		}

		this._oldShape = null;
		this._resetCursor();

		this.hideTooltip();

		if (this.hlRenderer) {
			this.hlRenderer._clear();
		}
	},

	_processMouseMove: function (e) {
		this._processTooltips(this.mouseInput);
	},

	_processMouseEvents: function () {

		var input = this.mouseInput;
		if (!input) {
			return;
		}

		var newShape = this.hitTest(input.locX, input.locY);

		if (this._oldShape != null && this._oldShape == newShape) {
			this._triggerShapeEvent('MouseMove', this._oldShape);
		}
		else {
			if (this._oldShape != null) {
				this._triggerShapeEvent('MouseLeave', this._oldShape);

				if (this._oldShape.cursor) {
					this._resetCursor();
				}
			}

			if (newShape != null) {
				this._triggerShapeEvent('MouseEnter', newShape);

				if (newShape.cursor) {
					this.setCursor(newShape.cursor);
				}
			}

			this._oldShape = newShape;
		}
	},

	_processTouchEvents: function () {

		var touch = this.touchInput[0];
		if (!touch) {
			return;
		}

		var newShape = this.hitTest(touch.locX, touch.locY);

		if (this._oldShape != null && this._oldShape == newShape) {
			this._triggerShapeEvent('TouchMove', this._oldShape);
		}
		else {
			if (this._oldShape != null) {
				this._triggerShapeEvent('TouchEnd', this._oldShape);
			}

			if (newShape != null) {
				this._triggerShapeEvent('TouchStart', newShape);
			}

			this._oldShape = newShape;
		}
	},

	_processTooltips: function (input) {

		var hasTooltips = this.hasTooltips;
		var hasHighlighting = this.hasHighlighting;
		if (!hasTooltips && !hasHighlighting) {
			return;
		}

		var area = this.options.tooltips.snapArea;
		var newShapes = this._getTooltipShapes(input.locX, input.locY, area, input);

		var different = true;

		if (this._oldTShapes == null || !jMath.compareArrays(this._oldTShapes, newShapes)) {
			if (newShapes != null) {
				different = this._initTooltip(newShapes);
				this._highlightShapes(newShapes);
			}

			if (newShapes) {
				this._oldTShapes = newShapes;
			}
		}
		else {
			different = false;
		}

		if (newShapes && hasTooltips && different) {
			this._setTooltipPos(newShapes, input);
		}
	},

	_setTooltipPos: function (shapes, input) {
		var w = this.tooltip.outerWidth(true);
		var h = this.tooltip.outerHeight(true);

		var chW = this._width;
		var chH = this._height;

		var pt = shapes[0]._getTooltipPosition(input, w, h, chW, chH);

		var y = pt.y;

		var len = shapes.length;

		var that = this;

		if (len > 1) {
			y = 0;
			$.each(shapes, function () {
				y += this._getTooltipPosition(input, w, h, chW, chH).y;
			});

			y /= len;
		}

		y = jMath.fitInRange(y, 0, chH - h);
		pt.x = jMath.fitInRange(pt.x, 0, chW - w);

		this.tooltip.stop();
		this.tooltip.animate({ left: pt.x, top: y }, 100);
	},

	_processTouchStart: function (e) {
		this._processTooltips(this.touchInput[0]);
	},

	_processTouchMove: function (e) {
		this._processTooltips(this.touchInput[0]);
	},


	_initTooltip: function (shapes) {

		if (!this.hasTooltips || !shapes || !shapes.length) {
			return false;
		}

		var len = shapes.length;
		var text = '';
		var context;

		if (len == 1) {
			context = shapes[0].context;
		}
		else {
			context = [];

			$.each(shapes, function () {
				context.push(this.context);
			});
		}

		if (!context) {
			return false;
		}

		var event = new $.Event('tooltipFormat');
		this.elem.trigger(event, [context]);

		var chart = this;

		if (event.result === false) {
			this.hideTooltip();
			return false;
		}

		if (event.result) {
			text = event.result;
		}
		else {
			text = this._getTooltipText(shapes);
		}

		if (!text) {
			return false;
		}

		this.tooltip.html(text);

		var tooltips = this.options.tooltips;

		if (len == 1) {

			if (tooltips.borderColor) {
				if (tooltips.borderColor == 'auto') {
					this.tooltip.css("border-color", shapes[0].getTooltipColor());
				}

				this.tooltip.css("border-color", tooltips.borderColor);
			}
		}

		if (tooltips.background) {
			this.tooltip.css("background", tooltips.background);
		}

		this.showTooltip();

		return true;
	},

	_highlightShapes: function (shapes) {
		if (!this.hasHighlighting) {
			return;
		}

		this.hlRenderer._clear();

		if (!shapes || !shapes.length) {
			return;
		}

		var op = this.options.tooltips;

		var newShapes = [];

		$.each(shapes, function (index, shape) {
			var newShape = shape._createHighlightShape(op.highlightingFillStyle, op.highlightingStrokeStyle);
			newShapes.push(newShape);
		});

		var context;

		if (newShapes.length == 1) {
			context = newShapes[0].context;
			context.shape = newShapes[0];
		}
		else {
			context = [];

			$.each(newShapes, function () {
				context.push(this.context);
				context.shape = this;
			});
		}

		var event = new $.Event('dataHighlighting');
		this.elem.trigger(event, [context]);

		if (event.result !== false) {

			if (CanvasControl.use_excanvas) {
				this.hlRenderer._render(newShapes);
			}
			else {
				this.hlRenderer.ctx.save();

				if (this._setClip) {
					this._setClip(this.hlRenderer.ctx);
				}

				this.hlRenderer._render(newShapes);

				this.hlRenderer.ctx.restore();
			}
		}
	},

	_getClosestShape: function (shapes, area, input) {

		var result = shapes[0];

		for (var i = 1; i < shapes.length; i++) {
			var shape = shapes[i];

			if (Shape.compare(result, shape, input, area) == false) {
				result = shape;
			}
		}

		return result;
	},

	_getTooltip: function (shape) {

		return "Tooltip";
	},

	_getTooltipText: function (shapes) {

		var text = '';
		var that = this;

		$.each(shapes, function () {

			var itemText = that._getTooltip(this);
			if (itemText) {
				text += itemText;
			}
		});

		return text;
	},

	_getTooltipShapes: function (x, y, area, input) {

		if (!area) {
			area = 0;
		}

		var shapes = [];

		for (var i = this.shapes.length - 1; i >= 0; i--) {
			var shape = this.shapes[i];

			if (!shape.context || shape.isLegendItem || shape.isAxisLabel) {
				continue;
			}

			var result = shape.hitTest(input.locX, input.locY, area);

			if (typeof (shape.hitTestNonHV) == 'function') {
				result = shape.hitTestNonHV(input.locX, input.locY, area);
			}

			if (result === true) {
				shapes.push(shape);
			}
			else if (result) {
				shapes.push(result);
			}
		}

		var sh = this._getClosestShape(shapes, area, input);

		if (!sh) {
			return null;
		}

		return [sh];
	},

	_resetCursor: function () {

		if (this.getCursor() != this.originalCursor) {
			this.setCursor(this.originalCursor);
		}
	},

	_triggerShapeEvent: function (name, shape) {
		shape.context.shape = shape;
		this.elem.trigger('dataPoint' + name, shape.context);
	},

	_exportToImage: function (config, defaults) {

		config = config || {};
		var exportConfig = $.extend({}, defaults, config);

		exportConfig.type = config.type || 'image/png';

		if (config.fileName) {
			exportConfig.fileName = jMath.replaceTextForExport(config.fileName);
		}
		else {
			switch (exportConfig.type) {
				case 'image/jpeg':
					exportConfig.fileName = 'jqChart.jpg';
					break;
				case 'image/png':
				default:
					exportConfig.fileName = 'jqChart.png';
					break;
			}
		}

		var json = this.toJSON(exportConfig);

		this._doRequest(exportConfig.server, json, exportConfig.method);
	},

	_exportToPdf: function (config, defaults) {

		config = config || {};
		var exportConfig = $.extend({}, defaults, config);

		exportConfig.type = 'application/pdf';
		exportConfig.fileName = jMath.replaceTextForExport(config.fileName) || 'chart.pdf';

		var json = this.toJSON(exportConfig);

		this._doRequest(exportConfig.server, json, exportConfig.method);
	},


	_toJSON: function (shapes, config) {
		var me = this;

		var result = "{type:'" + config.type + "',fileName:'" + config.fileName + "'";

		result += ',width:' + me._width + ',height:' + me._height + ',shapes:[';
		for (var i = 0; i < shapes.length; i++) {

			var shJson = shapes[i].toJSON();

			if (shJson) {
				result += '{' + shJson + '}';

				if (i != shapes.length - 1) {
					result += ',';
				}
			}
		}

		return result + ']}';
	},

	_doRequest: function (url, data, method) {
		// url and data options required
		if (url && data) {
			var inputs = '<input type="hidden" name="canvas" value="' + data + '" />';
			jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
            .appendTo('body').submit().remove();
		};
	},

	getCursor: function () {
		return this.elem.css('cursor');
	},

	setCursor: function (cursor) {
		if (!this.keepCursor) {
			this.elem.css('cursor', cursor);
		}
	},

	getCanvasContainer : function() {
		return this.canvasContainer || this.elem;
	},

	getCurrentTool: function () {
		return this.currentTool;
	},

	setCurrentTool: function (tool) {

		if (this.currentTool == tool) {
			return;
		}

		if (this.currentTool != null) {
			this.currentTool.stop();
		}

		if (!tool) {
			this.currentTool = this.defaultTool;
		}
		else {
			this.currentTool = tool;
		}

		if (this.currentTool) {
			this.currentTool.start();
		}
	},

	contains: function (x, y) {
		return x >= 0 && x <= this._width &&
               y >= 0 && y <= this._height;
	},

	hitTest: function (x, y, area) {

		if (!area) {
			area = 0;
		}

		for (var i = this.shapes.length - 1; i >= 0; i--) {
			var shape = this.shapes[i];

			if (!shape.context) {
				continue;
			}

			if (shape.hitTest(x, y, area)) {
				return shape;
			}
		}
	},

	showTooltip: function () {
		this.tooltip.show();
	},

	hideTooltip: function () {
		this.tooltip.hide();
	},

	stringFormat: function (val, format) {

		return $.jqChartSprintf(format, val);
	},



	clear: function () {

		this._clearRenderers();

		this.shapeRenderer._clear();
	},

	render: function () {
	},

	/**
     * Remove the plugin functionality completely. This will return the element back to its pre-init state.
     */
	destroy: function () {

		var elem = this.elem;

		elem.empty();
		elem.unbind();

		$(window).unbind('resize.jqChart');
		$(window.document).unbind('keydown.jqChart');

		var options = this.options;

		if (elem.hasClass(this.pluginClass)) {
			elem.removeClass(this.pluginClass);
		}
	},

	/**
     * Returns the canvas image as data URL (e.g., data:image/png;base64,iVBORw0KGg...). 
     * @param {String} mimetype Default to 'image/png'.
     */
	toDataURL: function (mimetype) {

		if (CanvasControl.use_excanvas) {
			return null;
		}

		return this.canvas.toDataURL(mimetype);
	},

	getShapesPerData: function (items) {
		var shapes = [];
		var chartShapes = this.shapes;

		$.each(items, function () {

			var item = this;

			$.each(chartShapes, function () {
				if (this.context) {

					var ctxPoints = this.context.points;
					if (ctxPoints) {
						for (var j = 0; j < ctxPoints.length; j++) {
							if (ctxPoints[j].dataItem == item) {

								var newShape = jQuery.extend({}, this);

								newShape.context = ctxPoints[j];
								newShape.context.series = this.context.series;
								newShape.context.chart = this.context.chart;

								var center = {
									x: this.pts[2 * j],
									y: this.pts[2 * j + 1]
								};

								newShape.tooltipOrigin = center;

								newShape.getCenter = function () {
									return center;
								}

								shapes.push(newShape);
								break;
							}
						}
					}
					else {

						if (this.context.dataItem == item) {
							shapes.push(this);
						}
					}
				}
			});
		});

		return shapes;
	},

	highlightData: function (items) {

		if (!items) {
			this._clearRenderers();
			return null;
		}

		var shapes = this.getShapesPerData(items);

		if (shapes.length == 0) {
			return null;
		}

		this._highlightShapes(shapes);
		this._initTooltip(shapes);

		var pt = shapes[0].getCenter();

		this._setTooltipPos(shapes, { locX: pt.x, locY: pt.y });

		return shapes;
	}
}

/**
 * @class Common.AxisBase
 *
 * Specifies base axis class.
 */
function AxisBase(options) {

    this._initDefs(options);
    this.setOptions(options);
}

AxisBase.prototype = {

    _initDefs: function () {

        $.extend(this, {
            maxInter200Px: 8,
            lblMargin: 4,

            crossOffsetX: 0,
            crossOffsetY: 0,

            origin: 0,
            length: 300,
            x: 0,
            y: 0
        });
    },

    _calculateActualInterval: function (min, max) {
        if (this.interval) {
            return this.interval;
        }

        var mult = 1;

        if (!this.getOrientation || this.getOrientation() == 'x') {
            mult = 0.8;
        }

        var adjMaxInter = mult * this.maxInter200Px;
        var maxInterCount = Math.max(this.length * adjMaxInter / 200.0, 1.0);
        var range = max - min;
        var bestInterval = range / maxInterCount;

        var minIdealInter = Math.pow(10, Math.floor(jMath.log10(bestInterval)));

        var idMults = [10, 5, 2, 1];

        for (var i = 0; i < idMults.length; i++) {
            var idealMultiplier = idMults[i];
            var curIdealInter = minIdealInter * idealMultiplier;
            if (maxInterCount < (range / curIdealInter)) {
                break;
            }

            bestInterval = curIdealInter;
        }

        return bestInterval;
    },

    _setVisibleRanges: function () {

        this.actualVisibleMinimum = jMath.isNull(this.visibleMinimum) ? this.actualMinimum : this.visibleMinimum;
        this.actualVisibleMaximum = jMath.isNull(this.visibleMaximum) ? this.actualMaximum : this.visibleMaximum;

        if ($.type(this.actualVisibleMinimum) == 'date') {
            this.actualVisibleMinimum = this.actualVisibleMinimum.getTime();
        }

        if ($.type(this.actualVisibleMaximum) == 'date') {
            this.actualVisibleMaximum = this.actualVisibleMaximum.getTime();
        }

        if (this.options) {
            this.options.visibleMinimum = this.visibleMinimum;
            this.options.visibleMaximum = this.visibleMaximum;
        }
    },

    _setMinMax: function (min, max) {

        if (this.logarithmic) {
            this.actualMinimum = jMath.isNull(this.minimum) ? min : jMath.log(this.minimum, this.logBase);
            this.actualMaximum = jMath.isNull(this.maximum) ? max : jMath.log(this.maximum, this.logBase);
        }
        else {
            this.actualMinimum = jMath.isNull(this.minimum) ? min : this.minimum;
            this.actualMaximum = jMath.isNull(this.maximum) ? max : this.maximum;
        }
    },

    _getNextPosition: function (current, interval) {
        return jMath.round(current + interval);
    },

    _getMarkInterval: function (mark, major) {
        var intr;

        if (mark.interval) {
            intr = mark.interval;
        }
        else {
            if (major) {
                intr = this.actualInterval;
            }
            else {
                intr = this.actualInterval / 2;
            }
        }

        return intr;
    },

    _getIntervals: function (interval, mark) {
        var offset = 0;
        if (mark && mark.intervalOffset) {
            offset = mark.intervalOffset;
        }

        var intrs = [];

        var intrStart = this._getIntervalStart(this._getActualVisibleMinimum(), interval);

        for (var i = intrStart + offset; i <= this._getActualVisibleMaximum() ; i = this._getNextPosition(i, interval)) {
            intrs.push(i);
        }

        return intrs;
    },

    _getIntervalStart: function (min, interval) {
        var crossValue = min - this.getCrossing();

        var intrStart = this._alignToInterval(crossValue, interval);
        if (intrStart < min) {
            intrStart = this._alignToInterval(crossValue + interval, interval);
        }

        return intrStart;
    },

    _alignToInterval: function (value, interval) {
        return jMath.round(jMath.round(Math.floor(value / interval)) * interval) + this.getCrossing();
    },

    _createLabel: function (text, settings) {
        var tBlock = new TextBlock(text);

        tBlock.isAxisLabel = true;

        tBlock.context = {
            chart: this.chart,
            axis: this,
            text: text
        };

        $.extend(tBlock, settings);

        this.chart.elem.trigger('axisLabelCreating', tBlock);

        tBlock.measure(this.chart.ctx);

        return tBlock;
    },

    _getLabelIntervals: function (interval, mark) {
        return this._getIntervals(interval, mark);
    },

    _measureRotatedLabels: function (labels) {

        var isVertical = this.isAxisVertical;

        var w = 0;
        var h = 0;

        for (var i = 0; i < labels.length; i++) {

            var lbl = labels[i];

            var hypotenuse = Math.sqrt(lbl.width * lbl.width + lbl.height * lbl.height);
            var rotAngle = lbl.rotationAngle;

            if (isVertical) {
                var width = Math.abs(Math.cos(rotAngle) * hypotenuse);
                w = Math.max(w, width);
            }
            else {
                var height = Math.abs(Math.sin(rotAngle) * hypotenuse);
                h = Math.max(h, height);
            }
        }

        if (this.labels.position == 'inside') {
            this.lblsW = w;
            this.lblsH = h;

            return { w: 0, h: 0 };
        }

        return { w: w, h: h };
    },

    _correctLabelsPositions: function (labels) {

        var w = 0;
        var h = 0;

        var reversed = this.reversed === true;
        var inside = this.labels.position == 'inside';

        var isVertical = this.isAxisVertical;
        var margin = this.lblMargin;

        if (isVertical) {

            var spots = [];

            for (var i = 0; i < labels.length; i++) {

                var lbl = labels[i];
                var success = false;

                var y = lbl.y;
                switch (lbl.textBaseline) {
                    case 'middle':
                        y -= lbl.height / 2;
                        break;
                    case 'bottom':
                        y -= lbl.height;
                        break;
                }

                var j = 0;

                // look for an available place
                for (j = 0; j < spots.length; j++) {
                    var spot = spots[j];

                    if (reversed) {
                        success = y > spot.y + spot.h;
                    }
                    else {
                        success = spot.y > y + lbl.height;
                    }

                    if (success) {

                        spot.y = y;
                        spot.h = lbl.height;
                        spot.w = Math.max(spot.w, lbl.width + margin);
                        spot.labels.push(lbl);
                        break;
                    }
                }

                if (success == false) {
                    spots[j] = { y: y, h: lbl.height, w: lbl.width + margin, labels: [lbl] };
                }
            }

            var isRight = this.location == 'right';
            isRight = inside ? !isRight : isRight;
            w = 0;

            for (var i = 0; i < spots.length; i++) {

                var spot = spots[i];

                for (var j = 0; j < spot.labels.length; j++) {
                    var lbl = spot.labels[j];

                    if (isRight) {
                        lbl.x += w;
                    }
                    else {
                        lbl.x -= w;
                    }
                }

                w += spot.w;
            }
        }
        else {

            var spots = [];

            for (var i = 0; i < labels.length; i++) {

                var lbl = labels[i];
                var x = lbl.x;
                switch (lbl.textAlign) {
                    case 'center':
                        x -= lbl.width / 2;
                        break;
                    case 'right':
                        x -= lbl.width;
                        break;
                }

                var success = false;

                var j = 0;

                // look for an available place
                for (j = 0; j < spots.length; j++) {
                    var spot = spots[j];

                    if (reversed) {
                        success = spot.x > x + lbl.width + margin;
                    }
                    else {
                        success = x > spot.x + spot.w + margin;
                    }

                    if (success) {

                        spot.x = x;
                        spot.w = lbl.width;
                        spot.h = Math.max(spot.h, lbl.height + margin);
                        spot.labels.push(lbl);
                        success = true;
                        break;
                    }
                }

                if (success == false) {
                    spots[j] = { x: x, w: lbl.width, h: lbl.height + margin, labels: [lbl] };
                }
            }

            var isBottom = this.location == 'bottom';
            isBottom = inside ? !isBottom : isBottom;
            h = 0;

            for (var i = 0; i < spots.length; i++) {

                var spot = spots[i];

                for (var j = 0; j < spot.labels.length; j++) {
                    var lbl = spot.labels[j];

                    if (isBottom) {
                        lbl.y += h;
                    }
                    else {
                        lbl.y -= h;
                    }
                }

                h += spot.h;
            }
        }

        if (this.labels.position == 'inside') {
            this.lblsW = w;
            this.lblsH = h;

            return { w: 0, h: 0 };
        }

        return { w: w, h: h };
    },

    //make sure the end labels dont overflow chart border,show completely
    prediktor_dealAxisXEndLabels: function (labels) {
        var isVertical = this.isAxisVertical;
        if (!isVertical) {
            for (var i = 0; i < labels.length; i++) {
                var index = i;
                if (this.reversed) {
                    index = labels.length - i - 1;
                }

                if (index == 0) {
                    var lbl = labels[index];
                    var x = lbl.x;
                    switch (lbl.textAlign) {
                        case 'center':
                            x -= lbl.width / 2;
                            break;
                        case 'right':
                            x -= lbl.width;
                            break;
                    }

                    var left = x;
                    if (left < 0) {
                        lbl.x = lbl.width / 2;
                    }
                }
                else if (index == labels.length - 1) {
                    var lbl = labels[index];
                    var x = lbl.x;
                    switch (lbl.textAlign) {
                        case 'center':
                            x += lbl.width / 2;
                            break;
                        case 'right':
                            x -= lbl.width;
                            break;
                    }

                    var right = x;
                    var chartwidth = this.chart._width;
                    if (right > chartwidth) {
                        lbl.x = chartwidth - lbl.width / 2;
                    }
                }
            }
        }
    },

    _removeOverlappedLabels: function (labels) {

        var w = 0;
        var h = 0;

        var left = 0;
        var right = 0;
        var lastRight = 0;
        var top = 0;
        var bottom = 0;
        var lastTop = maxVl;

        var reversed = this.reversed === true;
        var inside = this.labels.position == 'inside';

        var isVertical = this.isAxisVertical;
        var margin = this.lblMargin;
        var removeMargin = 2 * margin;

        if (isVertical) {

            var spots = [];

            for (var i = 0; i < labels.length; i++) {

                var index = i;
                if (this.reversed) {
                    index = labels.length - i - 1;
                }

                var lbl = labels[index];
                var success = false;

                var y = lbl.y;
                switch (lbl.textBaseline) {
                    case 'middle':
                        y -= lbl.height / 2;
                        break;
                    case 'bottom':
                        y -= lbl.height;
                        break;
                }

                top = lbl.y;
                bottom = top + lbl.height + removeMargin;

                if (bottom < lastTop) {
                    lastTop = top;
                }
                else {
                    lbl.visible = false;
                    continue;
                }

                w = Math.max(w, lbl.width + margin);
            }
        }
        else {
            for (var i = 0; i < labels.length; i++) {

                var index = i;
                if (this.reversed) {
                    index = labels.length - i - 1;
                }

                var lbl = labels[index];
                var x = lbl.x;
                switch (lbl.textAlign) {
                    case 'center':
                        x -= lbl.width / 2;
                        break;
                    case 'right':
                        x -= lbl.width;
                        break;
                }

                left = lbl.x;
                right = left + lbl.width + removeMargin;

                if (left > lastRight) {
                    lastRight = right;
                }
                else {
                    lbl.visible = false;
                    continue;
                }

                h = Math.max(h, lbl.height + margin);
            }
        }

        if (this.labels.position == 'inside') {
            this.lblsW = w;
            this.lblsH = h;

            return { w: 0, h: 0 };
        }

        return { w: w, h: h };
    },

    _measure: function () {

        var rangeSliderBreadth = 0;

        if (this.zoomEnabled) {
            rangeSliderBreadth = this.rangeSlider.breadth;
        }

        var size = { w: 0, h: 0 };

        if (this.labels) {
            if (this.labels.angle) {
                size = this._measureRotatedLabels(this._getLabels());
            }
            else {
                switch (this.labels.resolveOverlappingMode) {
                    case 'hide':
                        var labels = this._getLabels();
                        this.prediktor_dealAxisXEndLabels(labels);
                        size = this._removeOverlappedLabels(labels);
                        break;
                    case 'multipleRows':
                    default:
                        size = this._correctLabelsPositions(this._getLabels());
                        break;
                }
            }
        }

        this.title._measure();

        var offset = this.title.height + rangeSliderBreadth + this.lineWidth / 2;

        if (this.isAxisVertical) {
            size.w += offset;
        }
        else {
            size.h += offset;
        }

        var mrg = this.margin + this._getMaxOutsideTickMarksLength();

        if (this.isAxisVertical) {
            if (this.isCustomWidth == false) {

                var w = size.w + mrg;

                if (this.width != w) {
                    this.width = w;

                    return true;
                }
            }
        }
        else {
            if (this.isCustomHeight == false) {

                var h = size.h + mrg;

                if (this.height != h) {
                    this.height = h;

                    return true;
                }
            }
        }

        return false;
    },

    _arrange: function () {
        var x1 = this.x;
        var y1 = this.y;
        var x2 = this.x + this.width;
        var y2 = this.y + this.height;

        switch (this.location) {
            case 'left':
                x2 = x1 = this.x + this.width;
                break;
            case 'right':
                x2 = x1 = this.x;
                break;
            case 'top':
                y2 = y1 = this.y + this.height;
                break;
            case 'bottom':
                y2 = y1 = this.y;
            default:
                break;
        }

        if (this.title.text) {
            switch (this.location) {
                case 'left':
                    this.title.x = this.title.rotX = this.x;
                    this.title.y = this.title.rotY = this.y + (this.height + this.title.width) / 2;
                    this.title.rotationAngle = jMath.radians(-90);
                    break;
                case 'right':
                    this.title.x = this.title.rotX = this.x + this.width;
                    this.title.y = this.title.rotY = this.y + (this.height - this.title.width) / 2;
                    this.title.rotationAngle = jMath.radians(90);
                    break;
                case 'top':
                    this.title.x = this.x + (this.width - this.title.width) / 2;
                    this.title.y = this.y;
                    break;
                case 'bottom':
                    this.title.x = this.x + (this.width - this.title.width) / 2;
                    this.title.y = this.y + this.height - this.title.height;
                    break;
            }
        }

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.offset = this.lineWidth / 2;
    },

    _updateOrigin: function () {
        if (this.isAxisVertical) {
            this.origin = this.y;
            this.length = this.height;
        }
        else {
            this.origin = this.x;
            this.length = this.width;
        }
    },

    _render: function (shapes) {

        var postShapes = [];

        // add tickmarks
        var minor = this._getTickMarks(this.minorTickMarks, false);
        $.merge(postShapes, minor);

        var major = this._getTickMarks(this.majorTickMarks, true);
        $.merge(postShapes, major);

        // add main line
        var line = this._getMainLine();
        postShapes.push(line);

        // add labels
        var labels = this._getLabels();

        //make sure that the first and the last label are shown completely
        this.prediktor_dealAxisXEndLabels(labels);

        if (this.labels && !this.labels.angle) {

            switch (this.labels.resolveOverlappingMode) {
                case 'hide':
                    this._removeOverlappedLabels(labels);
                    break;
                case 'multipleRows':
                default:
                    this._correctLabelsPositions(labels);
                    break;
            }
        }

        this._filterLabels(labels);

        this.title._render(postShapes);

        $.merge(postShapes, labels);

        return { postShapes: postShapes, contextShapes: labels };
    },

    _getMainLine: function () {

        var crossOffsetX = this.crossOffsetX,
            crossOffsetY = this.crossOffsetY;

        var line = new Line(this.x1 + crossOffsetX, this.y1 + crossOffsetY, this.x2 + crossOffsetX, this.y2 + crossOffsetY);
        line.strokeStyle = this.strokeStyle;
        line.lineWidth = this.lineWidth;
        line.strokeDashArray = this.strokeDashArray;

        return line;
    },

    _getMaxInsideTickMarksLength: function () {
        var length = 0;

        if (this.minorTickMarks != null &&
            this.minorTickMarks.visible &&
            this.minorTickMarks.isInside()) {
            length = Math.max(length, this.minorTickMarks.length);
        }

        if (this.majorTickMarks != null &&
            this.majorTickMarks.visible &&
            this.majorTickMarks.isInside()) {
            length = Math.max(length, this.majorTickMarks.length);
        }

        return length;
    },

    _getMaxOutsideTickMarksLength: function () {
        var length = 0;

        if (this.minorTickMarks != null &&
            this.minorTickMarks.visible &&
            !this.minorTickMarks.isInside()) {
            length = Math.max(length, this.minorTickMarks.length);
        }

        if (this.majorTickMarks != null &&
            this.majorTickMarks.visible &&
            !this.majorTickMarks.isInside()) {
            length = Math.max(length, this.majorTickMarks.length);
        }

        return length;
    },

    _getLabels: function () {

        var label = this.labels;

        if (label == null || label.visible === false) {
            return [];
        }

        var inside = label.position == 'inside';
        var offset = this.lblMargin;
        var lblOffset = this.offset;

        var crossOffsetX = this.crossOffsetX,
            crossOffsetY = this.crossOffsetY;

        var vertical = this.isAxisVertical;

        if ((vertical && label.vAlign == 'center') ||
            (!vertical && label.hAlign == 'center')) {
            offset += inside ? this._getMaxInsideTickMarksLength() + this.lineWidth / 2 : this._getMaxOutsideTickMarksLength();
        }

        var shapes = [];

        var intr = this._getMarkInterval(label, true);

        if (!intr) {
            return [];
        }

        var intrs = this._getLabelIntervals(intr, label);

        var len = intrs.length;
        var showFirst = label.showFirstLabel;
        var showLast = label.showLastLabel;

        for (var i = 0; i < len; i++) {

            if ((!showFirst && i == 0) ||
                (!showLast && i == len - 1)) {
                continue;
            }

            var val = intrs[i];

            var lblText = this.getLabel(val);

            var tBlock = this._createLabel(lblText, label);

            var pos = this.getPosition(val);

            switch (this.location) {
                case 'left':
                    if (inside) {
                        tBlock.x = this.x + this.width + offset + crossOffsetX;
                    }
                    else {
                        tBlock.x = this.x + this.width - offset - lblOffset + crossOffsetX;
                        tBlock.textAlign = 'right';
                    }

                    tBlock.y = pos;

                    switch (label.vAlign) {
                        case 'bottom':
                            tBlock.textBaseline = 'top';
                            break;
                        case 'top':
                            tBlock.textBaseline = 'bottom';
                            break;
                    }

                    if (this.labels.angle) {

                        var angle = Math.min(90, Math.max(-90, this.labels.angle));
                        var rotAngle = jMath.radians(angle);

                        tBlock.rotX = tBlock.x;
                        tBlock.rotY = tBlock.y;

                        tBlock.rotationAngle = rotAngle;
                    }

                    break;
                case 'right':
                    if (inside) {
                        tBlock.x = this.x - offset + crossOffsetX;
                        tBlock.textAlign = 'right';
                    }
                    else {
                        tBlock.x = this.x + offset + lblOffset + crossOffsetX;
                    }
                    tBlock.y = pos;

                    switch (label.vAlign) {
                        case 'bottom':
                            tBlock.textBaseline = 'top';
                            break;
                        case 'top':
                            tBlock.textBaseline = 'bottom';
                            break;
                    }

                    if (this.labels.angle) {

                        var angle = Math.min(90, Math.max(-90, this.labels.angle));
                        var rotAngle = jMath.radians(angle);

                        tBlock.rotX = tBlock.x;
                        tBlock.rotY = tBlock.y;

                        tBlock.rotationAngle = rotAngle;
                    }

                    break;
                case 'top':
                    tBlock.x = pos;
                    if (inside) {
                        tBlock.y = this.y + this.height + offset + tBlock.height / 2 + crossOffsetY;
                    }
                    else {
                        tBlock.y = this.y + this.height - offset - tBlock.height / 2 - lblOffset + crossOffsetY;
                    }
                    tBlock.textBaseline = 'middle';

                    switch (label.hAlign) {
                        case 'center':
                            tBlock.textAlign = 'center';
                            break;
                        case 'left':
                            tBlock.textAlign = 'right';
                            break;
                        case 'right':
                            tBlock.textAlign = 'left';
                            break;
                    }
                    if (this.labels.angle) {

                        var angle = Math.min(90, Math.max(-90, this.labels.angle));
                        tBlock.flip = angle > 0;

                        if (angle > 0) {
                            angle = -180 + angle;
                        }

                        var rotAngle = jMath.radians(angle);

                        var hypotenuse = Math.sqrt(tBlock.width * tBlock.width + tBlock.height * tBlock.height);

                        tBlock.rotX = tBlock.x + 0.5 * Math.cos(rotAngle) * hypotenuse;
                        tBlock.rotY = tBlock.y + 0.5 * Math.sin(rotAngle) * hypotenuse;
                        tBlock.rotationAngle = rotAngle;
                    }
                    break;
                case 'bottom':
                    tBlock.x = pos;
                    if (inside) {
                        tBlock.y = this.y - offset - tBlock.height / 2 + crossOffsetY;
                    }
                    else {
                        tBlock.y = this.y + offset + tBlock.height / 2 + lblOffset + crossOffsetY;
                    }

                    tBlock.textBaseline = 'middle';

                    switch (label.hAlign) {
                        case 'center':
                            tBlock.textAlign = 'center';
                            break;
                        case 'left':
                            tBlock.textAlign = 'right';
                            break;
                        case 'right':
                            tBlock.textAlign = 'left';
                            break;
                    }
                    if (this.labels.angle) {

                        var angle = Math.min(90, Math.max(-90, this.labels.angle));
                        tBlock.flip = angle < 0;

                        if (angle < 0) {
                            angle = 180 + angle;
                        }

                        var rotAngle = jMath.radians(angle);

                        var hypotenuse = Math.sqrt(tBlock.width * tBlock.width + tBlock.height * tBlock.height);

                        tBlock.rotX = tBlock.x + 0.5 * Math.cos(rotAngle) * hypotenuse;
                        tBlock.rotY = tBlock.y + 0.5 * Math.sin(rotAngle) * hypotenuse;
                        tBlock.rotationAngle = rotAngle;
                    }
                    break;
            }

            shapes.push(tBlock);
        }

        return shapes;
    },

    _filterLabels: function (labels) {

        if (!this.labels || this.labels.position != 'inside') {
            return;
        }

        var gArea = this.chart.gridArea;

        var rX = gArea.x;
        var rY = gArea.y;
        var rW = gArea.width;
        var rH = gArea.height;

        for (var i = labels.length - 1; i >= 0; i--) {
            var lbl = labels[i];

            if (!lbl.isInRect(rX, rY, rW, rH)) {
                var index = $.inArray(lbl, labels);
                labels.splice(index, 1);
            }
        }
    },

    _getTickMarks: function (mark, major) {
        if (mark == null || mark.visible != true) {
            return [];
        }

        var shapes = [];

        var crossOffsetX = this.crossOffsetX,
            crossOffsetY = this.crossOffsetY;

        var offset = this.offset;
        var inside = mark.position == 'inside';

        var intr = this._getMarkInterval(mark, major);
        var lng = mark.length;

        var intrs = this._getIntervals(intr, mark, major);

        var x1, y1, x2, y2;

        for (var i = 0; i < intrs.length; i++) {

            var pos = this.getPosition(intrs[i]);

            switch (this.location) {
                case 'left':
                    y1 = y2 = pos;
                    if (inside) {
                        x2 = this.x + this.width + lng + this.lineWidth / 2 + crossOffsetX;
                    }
                    else {
                        x2 = this.x + this.width - offset + crossOffsetX;
                    }
                    x1 = x2 - lng;
                    break;
                case 'right':
                    y1 = y2 = pos;
                    if (inside) {
                        x1 = this.x - lng - this.lineWidth / 2 + crossOffsetX;
                    }
                    else {
                        x1 = this.x + offset + crossOffsetX;
                    }
                    x2 = x1 + lng;
                    break;
                case 'top':
                    x1 = x2 = pos;
                    if (inside) {
                        y2 = this.y + this.height + lng + this.lineWidth / 2 + crossOffsetY;
                    }
                    else {
                        y2 = this.y + this.height - offset + crossOffsetY;
                    }
                    y1 = y2 - lng;
                    break;
                case 'bottom':
                    x1 = x2 = pos;
                    if (inside) {
                        y2 = this.y - lng - this.lineWidth / 2 + crossOffsetY;
                    }
                    else {
                        y2 = this.y + offset + crossOffsetY;
                    }
                    y1 = y2 + lng;
                default:
                    break;
            }

            var line = new Line(x1, y1, x2, y2);
            mark._setLineSettings(line);
            shapes.push(line);
        }

        return shapes;
    },

    _setChart: function (chart) {
        this.chart = chart;
        this.title.chart = chart;
    },

    _getValue: function (value) {
        return value;
    },

    getCrossing: function () {
        return this.crossing || 0;
    },

    _initRadialMeasures: function () {

        var diameter;

        if (this.chart.options.halfPolar) {
            diameter = Math.min(2 * this.width - 10, this.height);

            this.cx = this.x + 10;
        }
        else {

            diameter = Math.min(this.width, this.height);
            this.cx = this.x + this.width / 2;
        }

        this.cy = this.y + this.height / 2;
        this.radius = diameter / 2;
    },

    _getActualVisibleMinimum: function () {
        return this.actualVisibleMinimum;
    },

    _getActualVisibleMaximum: function () {
        return this.actualVisibleMaximum;
    },

    _getActualMinimum: function () {
        return this.actualMinimum;
    },

    _getActualMaximum: function () {
        return this.actualMaximum;
    },

    _addEmptyDaysOffset: function (date) {
        return date;
    },

    getZoom: function () {

        if (!this.actualMaximum) {
            return 1;
        }

        var range = this._getActualMaximum() - this._getActualMinimum();
        var visibleRange = this._getActualVisibleMaximum() - this._getActualVisibleMinimum();

        var zoom = visibleRange / range;

        return zoom;
    },

    setOptions: function (options) {

        if (options != null && (typeof options.title == 'string')) {
            options.title = { text: options.title };
            $.extend(options.title, this.defaults.title);
        }

        var settings = $.extend(true, {}, this.defaults, options || {});
        $.extend(this, settings);

        this.options = options;

        if (options) {
            this.isCustomWidth = options.width != null;
            this.isCustomHeight = options.height != null;
        }
        // tick marks
        this.majorTickMarks = new TickMark(settings.majorTickMarks);

        if (settings.minorTickMarks) {
            this.minorTickMarks = new TickMark(settings.minorTickMarks);
            this.minorTickMarks.major = this.majorTickMarks;
        }

        // grid lines
        if (settings.majorGridLines) {
            this.majorGridLines = new GridLine(settings.majorGridLines);
        }

        if (settings.minorGridLines) {
            this.minorGridLines = new GridLine(settings.minorGridLines);
            this.minorGridLines.major = this.majorGridLines;
        }

        this.isAxisVertical = this.isVertical();

        this.title = new Title(settings.title);
    },

    getPosition: function (val) {

        var maximum = this._getActualVisibleMaximum();
        var minimum = this._getActualVisibleMinimum();

        var position = this.length / (maximum - minimum) * (val - minimum);

        var reversed = this.reversed === true;
        var vertical = this.isAxisVertical;

        if ((vertical && reversed === false) ||
            (vertical === false && reversed)) {
            position = this.origin + this.length - position;
        }
        else {
            position += this.origin;
        }

        return position;
    },

    getValue: function (position) {

        var maximum = this._getActualVisibleMaximum();
        var minimum = this._getActualVisibleMinimum();

        var value = (position - this.origin) * (maximum - minimum) / this.length + minimum;

        var reversed = this.reversed === true;
        var vertical = this.isAxisVertical;

        if ((vertical && reversed === false) ||
            (vertical === false && reversed)) {
            value = minimum + maximum - value;
        }

        value = this._addEmptyDaysOffset(value);

        return value;
    },

    getLabel: function (value) {

        var stringFormat = null;
        if (this.labels != null) {
            stringFormat = this.labels.stringFormat;
        }

        var label = $.fn.jqChart.labelFormatter(stringFormat, value);

        return label;
    },

    isVertical: function () {
        if (this.location == 'left' || this.location == 'right') {
            return true;
        }

        return false;
    },

    isValueVisible: function (val) {
        if (this.logarithmic) {
            val = jMath.log(val, this.logBase);
        }

        return val >= this.actualVisibleMinimum && val <= this.actualVisibleMaximum;
    },


    isInVisibleRange: function (val) {

        var min = this.visibleMinimum;
        var max = this.visibleMaximum;

        if (jMath.isNull(min) || jMath.isNull(max)) {
            return true;
        }

        if (this.logarithmic) {
            min = jMath.log(min, this.logBase);
            max = jMath.log(max, this.logBase);
        }

        return val >= min && val <= max;
    },

    defaults: {

        location: 'left',

        /**
         * @cfg {Common.AxisLabels} labels
         * Specifies the axis labels.
         */
        labels: {
            visible: true,
            fillStyle: 'black',
            lineWidth: 1,
            font: '11px sans-serif',
            position: 'outside',
            showLastLabel: true,
            showFirstLabel: true,
            hAlign: 'center',
            vAlign: 'center'
        },

        title: {
            text: undefined,
            font: '14px sans-serif',
            margin: 2
        },

        strokeStyle: 'black',
        lineWidth: 1,
        margin: 5,
        visible: true,

        /**
        * @cfg {Boolean} reversed
        * Specifies whether or not the axis scale is reversed.
        */
        reversed: false,
        zoomEnabled: false

        /**
        * @cfg {Common.TickMark} majorTickMarks
        * Specifies the axis major tick marks.
        */

        /**
        * @cfg {Common.TickMark} minorTickMarks
        * Specifies the axis minor tick marks.
        */
    }
}

var minVl = -Number.MAX_VALUE;
var maxVl = Number.MAX_VALUE;

function jMath() {
}

jMath.isNull = function (value) {

	if (value === null || value === undefined) {
		return true;
	}

	if (!isNaN(value)) {
		return false;
	}

	var type = $.type(value);

	return type !== 'date' && type !== 'array';
}

jMath.roundH = function (value) {
	// return ~ ~(value + 0.5) - 0.5;
	return Math.round(value) - 0.5;
}

jMath.round = function (value) {
	var rec = 1.0 / value;
	if (Math.abs(rec) > 10000) {
		var sigDigits = jMath.log10(Math.abs(rec));
		if (sigDigits > 13) {
			return value;
		}
	}

	var roundVl = value.toPrecision(14);
	var result = parseFloat(roundVl);

	return result;
}

jMath.log10 = function (x) {
	return Math.log(x) / Math.LN10;
}

jMath.log = function (x, base) {
	return Math.log(x) / Math.log(base);
}

jMath.radians = function (angle) {
	return angle * (Math.PI / 180);
}

jMath.degrees = function (angle) {
	return 180 * angle / Math.PI;
}

jMath.normalizeAngle = function (angle) {
	var result = angle % (2 * Math.PI);

	if (result < 0) {
		result += 2 * Math.PI;
	}

	return result;
}

jMath.fitInRange = function (val, min, max) {
	if (val < min) {
		val = min;
	}
	else if (val > max) {
		val = max;
	}

	return val;
}

jMath.sum = function (arr) {
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		sum += arr[i];
	}

	return sum;
}

jMath.compareArrays = function (arr1, arr2) {

	if (!arr1 && !arr2) {
		return true;
	}

	if (!arr1 || !arr2) {
		return false;
	}


	if (arr1.length != arr2.length) {
		return false;
	}

	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
}

jMath.rotatePointAt = function (x, y, angle, originX, originY) {
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);

	var dx = x - originX;
	var dy = y - originY;

	var resX = originX + dx * cos - dy * sin;
	var resY = originY + dx * sin + dy * cos;

	return { x: resX, y: resY };
}

jMath.rotatePointsAt = function (pts, angle, originX, originY) {
	var result = [];

	for (var i = 0; i < pts.length; i += 2) {

		var pt = jMath.rotatePointAt(pts[i], pts[i + 1], angle, originX, originY);
		result.push(pt.x);
		result.push(pt.y);
	}

	return result;
}

jMath.reversePoints = function (pts) {
	var newPts = [];

	for (var i = pts.length - 2; i >= 0; i -= 2) {
		newPts.push(pts[i]);
		newPts.push(pts[i + 1]);
	}

	return newPts;
}

jMath.trimPoints = function (pts) {
	var newPts = pts.slice(0);

	var len = newPts.length;

	while ((len > 1) && (jMath.isNull(newPts[0]) || jMath.isNull(newPts[1]))) {
		newPts.splice(0, 2);
		len = newPts.length;
	}

	while ((len > 1) && (jMath.isNull(newPts[len - 2]) || jMath.isNull(newPts[len - 1]))) {
		newPts.splice(len - 2, 2);
		len = newPts.length;
	}

	return newPts;
}

jMath.intersection = function (a1, a2, b1, b2) {
	var result,
        ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
        ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
        u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

	if (u_b != 0) {
		var ua = ua_t / u_b;
		var ub = ub_t / u_b;

		result = {
			x: a1.x + ua * (a2.x - a1.x),
			y: a1.y + ua * (a2.y - a1.y)
		}
	}

	return result;
}

jMath.processDataValue = function (value, type) {

	switch (type) {
		case 'numeric':
			if (typeof value == 'string') {
				value = parseFloat(value);
			}
			break;
		case 'dateTime':
			if (typeof value == 'string') {
				value = new Date(value);
			}
			break;
		case 'string':
			if (typeof value != 'string') {
				value = value.toString();
			}
			break;
	}

	return value;
}

jMath.processDataField = function (dataSource, valuesField) {

	if (!valuesField) {
		return null;
	}

	var name, type, convert, format;
	var isPlain = $.isPlainObject(valuesField);

	if (isPlain) {
		name = valuesField.name;
		type = valuesField.type;
		convert = valuesField.convert;
	}
	else {
		name = valuesField;
	}

	var item, vl;
	var arr = [];

	for (var i = 0; i < dataSource.length; i++) {
		item = dataSource[i];
		vl = item[name];

		if (convert) {
			vl = convert(vl);
		}
		else if (type) {
			switch (type) {
				case 'numeric':
					if (typeof vl == 'string') {
						vl = parseFloat(vl);
					}
					break;
				case 'dateTime':
					if (typeof vl == 'string') {
						vl = new Date(vl);
					}
					break;
			}
		}

		arr.push(vl);
	}

	return arr;
}

jMath.mergeArraysXY = function (xValues, yValues) {
	if (!xValues || xValues.length == 0) {
		return yValues;
	}


	var result = [];

	for (var i = 0; i < xValues.length; i++) {
		var elem = [];
		elem.push(xValues[i]);

		result.push(elem);
	}

	var len = result.length;

	var item;

	for (var i = 0; i < yValues.length; i++) {

		item = yValues[i];

		if (i < len) {
			var elem = result[i];
			elem.push(item);
		}
		else {
			var elem = [null, item];
			result.Add(elem);
		}
	}

	return result;
}

jMath.mergeArrays = function (lists) {

	var listCount = lists.length;
	var result = [];

	for (var i = 0; i < listCount; i++) {
		var list = lists[i];
		if (list == null) {
			continue;
		}

		var count = result.length;

		for (var j = 0; j < list.length; j++) {
			var item = list[j];

			if (j < count) {
				var elem = result[j];
				elem[i] = item;
			}
			else {
				var elem = [];
				elem[i] = item;
				result.push(elem);
			}
		}
	}

	return result;
}

jMath.cloneArray = function (arr) {
	return arr.slice(0);
}

jMath.calcNullValue = function (arrData, i, type, dataType) {

	var leftVl, rightVl, vl, nullVl;

	// find left value
	for (var left = i - 1; left >= 0; left--) {

		vl = arrData[left];
		if (jMath.isNull(vl)) {
			continue;
		}

		switch (type) {
			case 'x':
				vl = vl[iX];
				break;
			case 'y':
				vl = vl[iY];
				break;
		}

		if (!jMath.isNull(vl)) {
			leftVl = vl;
			break;
		}
	}

	// find right value
	for (var right = i + 1; right < arrData.length; right++) {

		vl = arrData[right];
		if (jMath.isNull(vl)) {
			continue;
		}

		switch (type) {
			case 'x':
				vl = vl[iX];
				break;
			case 'y':
				vl = vl[iY];
				break;
		}

		if (!jMath.isNull(vl)) {
			rightVl = vl;
			break;
		}
	}

	var isLeftVlNull = jMath.isNull(leftVl);
	var isRightVlNull = jMath.isNull(rightVl);

	if (isLeftVlNull && isRightVlNull) {
		// all values are null
		return null;
	}

	if (isLeftVlNull) {
		leftVl = rightVl;
	}
	else if (isRightVlNull) {
		rightVl = leftVl;
	}

	var result;

	if (dataType == 'DateTimeAxis') {
		var leftTime = leftVl.getTime();
		var rightTime = rightVl.getTime();

		result = leftTime + (rightTime - leftTime) / (right - left);
		result = new Date(result);
	}
	else {
		result = leftVl + (rightVl - leftVl) / (right - left);
	}

	return result;
}

jMath.getDistances = function (shapes) {
	var distances = [];

	var distance, sh1, sh2;

	for (var i = 0; i < shpaes.length - 1; i++) {
		sh1 = shapes[i];
		sh2 = shapes[i + 1];

		distance = sh2.y - sh1.y - sh1.height;
		distances.push(distance);
	}

	return distances;
}

jMath.replaceAll = function (str, find, replace) {

	// return str.split(find).join(replace);

	return str.replace(new RegExp(find, 'g'), replace);
};

jMath.replaceTextForExport = function (str) {

	if (!str) {
		return str;
	}

	if (typeof str != 'string') {
		str = str.toString();
	}

	var text = jMath.replaceAll(str, "'", ";#39;");
	return jMath.replaceAll(text, '"', ";#34;");
};

jMath.replaceTextForTooltip = function (str) {

	if (!str) {
		return str;
	}

	if (typeof str != 'string') {
		str = str.toString();
	}

	var text = jMath.replaceAll(str, "&", '&amp;');
	text = jMath.replaceAll(text, '"', '&quot;');
	text = jMath.replaceAll(text, "'", '&#39;');

	text = jMath.replaceAll(text, "<", '&lt;');
	return jMath.replaceAll(text, ">", '&gt;');
};

function jDate() {
}

jDate.ticksInDay = 24 * 60 * 60 * 1000;

jDate.getDaysInMonth = function (year, month) {
    if (month == 1) {
        return new Date(year, 1, 29).getDate() == 29 ? 29 : 28;
    }
    return [31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

jDate.addSeconds = function (date, value) {

    var newDate = new Date(date.getTime() + value * 1000);
    return newDate;
}

jDate.addDays = function (date, value) {

    value = Math.max(value, 1);

    var newDate = new Date(date.getTime());
    newDate.setDate(date.getDate() + value);
    return newDate;
}

jDate.addYears = function (date, value) {

    var newDate = new Date(date.getTime());
    newDate.setFullYear(date.getFullYear() + value);

    return newDate;
}

jDate.addMonths = function (date, value) {

    var result = new Date(date.getTime());

    var n = result.getDate();
    result.setDate(1);
    result.setMonth(result.getMonth() + value);
    result.setDate(Math.min(n, jDate.getDaysInMonth(result.getFullYear(), result.getMonth())));
    return result;
};

jDate.getDayOfWeek = function (date) {
    var dow = date.getDay();
    return dow === 0 ? 7 : dow;
};

jDate.fromDays = function (days) {
    return days * jDate.ticksInDay;
}

jDate.fromHours = function (hours) {
    return hours * 60 * 60 * 1000;
}

jDate.fromMinutes = function (minutes) {
    return minutes * 60 * 1000;
}

jDate.fromSeconds = function (seconds) {
    return seconds * 1000;
}

jDate.roundToDay = function (date) {

    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return newDate;
}

// Shape
function Shape() {
	// fill
	this.fillStyle = 'black';

	// stroke
	this.strokeStyle = 'black';
	this.lineWidth = 1;
	this.lineCap = 'butt'; // butt | round | square;
	this.lineJoin = 'miter'; // round | bevel | miter
	this.miterLimit = 10;

	this.visible = true;

	this.shadowColor = 'rgba(0, 0, 0, 0)';
	this.shadowBlur = 0;
	this.shadowOffsetX = 0;
	this.shadowOffsetY = 0;
}

Shape.compare = function (sh1, sh2, input, area) {

	if (!sh1.useHitTestArea && !sh2.useHitTestArea) {
		return true;
	}

	if (sh1.useHitTestArea && !sh2.useHitTestArea) {
		return sh1.hitTest(input.locX, input.locY, area / 3);
	}

	if (sh1.hitTest(input.locX, input.locY, 0)) {
		return true;
	}

	var origin1 = sh1.getCenter(input);
	var origin2 = sh2.getCenter(input);

	var dx = input.locX - origin1.x;
	var dy = input.locY - origin1.y;
	var dist1 = Math.sqrt(dx * dx + dy * dy);

	dx = input.locX - origin2.x;
	dy = input.locY - origin2.y;
	var dist2 = Math.sqrt(dx * dx + dy * dy);

	return dist1 <= dist2;
}

Shape.getColorFromFillStyle = function (fillStyle) {

	if (fillStyle == null) {
		return '#dddddd';
	}

	if (typeof (fillStyle) == 'string') {
		return fillStyle;
	}

	if (fillStyle.colorStops && fillStyle.colorStops[0]) {

		var firstColor = fillStyle.colorStops[0].color;

		if (firstColor != 'white' && firstColor != '#ffffff') {
			return firstColor;
		}

		return fillStyle.colorStops[1].color;
	}

	return '#dddddd';
}

Shape.prototype.hitTest = function (x, y, area) {
	return false;
}

Shape.prototype.boundsHitTest = function (x, y, area) {

	if (!this.useHitTestArea) {
		area = 0;
	}

	return x >= this.x - area && x <= this.x + this.width + area &&
           y >= this.y - area && y <= this.y + this.height + area;
}

Shape.prototype.isInRect = function (rX, rY, rW, rH) {

	var x = this.x;
	var y = this.y;
	var w = this.width;
	var h = this.height;

	return x >= rX && y >= rY && x + w <= rX + rW && y + h <= rY + rH;
}

Shape.prototype.render = function (ctx, noOpts) {
	if (!noOpts) {
		this.setProperties(ctx);
	}
}

Shape.prototype.renderDashedLine = function (x1, y1, x2, y2, strokeDashArray, ctx) {

	var lt = function (a, b) { return Math.round(a) <= Math.round(b); };
	var gt = function (a, b) { return Math.round(a) >= Math.round(b); };

	var capmin = function (a, b) { return Math.min(a, b); };
	var capmax = function (a, b) { return Math.max(a, b); };

	var checkX = { thereYet: gt, cap: capmin };
	var checkY = { thereYet: gt, cap: capmin };

	ctx.beginPath();

	if (y1 - y2 > 0) {
		checkY.thereYet = lt;
		checkY.cap = capmax;
	}

	if (x1 - x2 > 0) {
		checkX.thereYet = lt;
		checkX.cap = capmax;
	}

	ctx.moveTo(x1, y1);
	var offsetX = x1;
	var offsetY = y1;
	var idx = 0, dash = true;

	var length = strokeDashArray.length;

	while (!(checkX.thereYet(offsetX, x2) && checkY.thereYet(offsetY, y2))) {

		var ang = Math.atan2(y2 - y1, x2 - x1);
		var len = strokeDashArray[idx];

		offsetX = checkX.cap(x2, offsetX + (Math.cos(ang) * len));
		offsetY = checkY.cap(y2, offsetY + (Math.sin(ang) * len));

		if (dash) {
			ctx.lineTo(offsetX, offsetY);
		}
		else {
			ctx.moveTo(offsetX, offsetY);
		}

		idx = (idx + 1) % length;
		dash = !dash;
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Shape.prototype.renderRectPath = function (ctx, x, y, width, height) {
	ctx.beginPath();

	var strokeDashArray = this.strokeDashArray;
	if (strokeDashArray) {

		ctx.moveTo(x, y);
		this.renderDashedLine(x, y, x + width, y, strokeDashArray, ctx);
		this.renderDashedLine(x + width, y, x + width, y + height, strokeDashArray, ctx);
		this.renderDashedLine(x + width, y + height, x, y + height, strokeDashArray, ctx);
		this.renderDashedLine(x, y + height, x, y, strokeDashArray, ctx);
	}
	else {
		ctx.moveTo(x, y);
		ctx.lineTo(x + width, y);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x, y + height);
	}

	ctx.closePath();
}

Shape.prototype.setProperties = function (ctx) {

	ctx.fillStyle = this._createGradient(ctx, this.fillStyle) || "#000000";

	ctx.strokeStyle = this.strokeStyle || "#000000";

	ctx.lineWidth = this.lineWidth || 0;

	ctx.lineCap = this.lineCap;
	ctx.lineJoin = this.lineJoin;
	ctx.miterLimit = this.miterLimit;

	ctx.shadowColor = this.shadowColor;
	ctx.shadowBlur = this.shadowBlur;
	ctx.shadowOffsetX = this.shadowOffsetX;
	ctx.shadowOffsetY = this.shadowOffsetY;
}

Shape.prototype.calculateBounds = function (pts) {

	if (pts == null) {
		return;
	}

	var x0 = maxVl;
	var y0 = maxVl;

	var x1 = minVl;
	var y1 = minVl;

	var x, y;

	for (var i = 0; i < pts.length; i += 2) {
		x = pts[i];
		y = pts[i + 1];

		if (jMath.isNull(x)) {
			continue;
		}

		x0 = Math.min(x0, x);
		y0 = Math.min(y0, y);

		x1 = Math.max(x1, x);
		y1 = Math.max(y1, y);
	}

	this.x = x0;
	this.y = y0;

	this.width = x1 - x0;
	this.height = y1 - y0;

	this.center = this.getCenter();
}

Shape.prototype.getCenter = function () {

	if (this.center) {
		return this.center;
	}

	return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
}

Shape.prototype.getTooltipColor = function () {

	return Shape.getColorFromFillStyle(this.fillStyle);
}

Shape.prototype.fillStyleToJSON = function (fillStyle) {

	if (typeof (fillStyle) == 'string' ||
        this.width == null ||
        this.height == null ||
        this.x == null ||
        this.y == null) {
		return "'" + fillStyle + "'";
	}

	var result = "{type:'" + fillStyle.type + "'";

	if (!jMath.isNull(fillStyle.x0)) {
		result += ",x0:" + fillStyle.x0;
	}

	if (!jMath.isNull(fillStyle.x1)) {
		result += ",x1:" + fillStyle.x1;
	}

	if (!jMath.isNull(fillStyle.y0)) {
		result += ",y0:" + fillStyle.y0;
	}

	if (!jMath.isNull(fillStyle.y1)) {
		result += ",y1:" + fillStyle.y1;
	}

	if (fillStyle.type == 'radialGradient') {
		if (!jMath.isNull(fillStyle.r0)) {
			result += ",r0:" + fillStyle.r0;
		}

		if (!jMath.isNull(fillStyle.r1)) {
			result += ",r1:" + fillStyle.r1;
		}
	}

	result += ',colorStops:[';

	var len = fillStyle.colorStops.length;

	for (var i = 0; i < len; i++) {
		var colorStop = fillStyle.colorStops[i];

		result += "{color:'" + colorStop.color + "'";

		if (!jMath.isNull(colorStop.offset)) {
			result += ",offset:" + colorStop.offset;
		}

		result += '}';

		if (i != len - 1) {
			result += ',';
		}
	}

	result += ']}';

	return result;
}

Shape.prototype.arrayToJSON = function (pts) {
	var pt,
        result = '[';

	for (var i = 0; i < pts.length; i++) {
		pt = pts[i];

		result += pt;

		if (i != pts.length - 1) {
			result += ',';
		}
	}

	return result + ']';
}

Shape.prototype.toJSON = function () {
	var me = this;

	var result = '';

	if (me.lineWidth) {
		result = ',lineWidth:' + me.lineWidth;
	}

	if (me.fillStyle) {
		result += ",fillStyle:" + me.fillStyleToJSON(me.fillStyle);
	}

	if (me.strokeStyle) {
		result += ",strokeStyle:'" + me.strokeStyle + "'";
	}

	if (!me.visible) {
		result += ',visible:' + me.visible;
	}

	if (me.shadowColor != 'rgba(0, 0, 0, 0)') {
		result += ",shadowColor:'" + me.shadowColor + "'";
	}

	if (me.shadowBlur) {
		result += ',shadowBlur:' + me.shadowBlur;
	}

	if (me.shadowOffsetX) {
		result += ',shadowOffsetX:' + me.shadowOffsetX;
	}

	if (me.shadowOffsetY) {
		result += ',shadowOffsetY:' + me.shadowOffsetY;
	}

	if (me.strokeDashArray) {
		result += ',strokeDashArray:' + me.arrayToJSON(me.strokeDashArray);
	}

	return result;
}

Shape.prototype._createGradient = function (ctx, fillStyle) {

	var ax = this.x;
	var ay = this.y;

	if (fillStyle == null || typeof (fillStyle) == 'string' ||
        this.width == null ||
        this.height == null ||
        ax == null ||
        ay == null) {
		return fillStyle;
	}

	if (this.xOffset) {
		ax += this.xOffset;
	}

	if (this.yOffset) {
		ay += this.yOffset;
	}

	var gradient;

	var fStyle = { x0: 0, y0: 0, x1: 1, y1: 1, r0: 0, r1: 1 };
	$.extend(fStyle, fillStyle);

	switch (fillStyle.type) {
		case 'radialGradient':
			var x0 = ax + fStyle.x0 * this.width;
			var y0 = ay + fStyle.y0 * this.height;
			var r0 = fStyle.r0 * this.width / 2;

			var x1 = ax + fStyle.x1 * this.width;
			var y1 = ay + fStyle.y1 * this.height;
			var r1 = fStyle.r1 * this.width / 2;

			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
			break;
		default:
			var x = ax + fStyle.x0 * this.width;
			var y = ay + fStyle.y0 * this.height;
			var w = ax + fStyle.x1 * this.width;
			var h = ay + fStyle.y1 * this.height;
			gradient = ctx.createLinearGradient(x, y, w, h);
			break;
	}

	var stops = fStyle.colorStops;
	if (stops != null) {
		for (var i = 0; i < stops.length; i++) {
			var stop = stops[i];
			gradient.addColorStop(stop.offset || 0, stop.color);
		}
	}

	return gradient;
}

Shape.prototype._createHighlightShape = function (fillStyle, strokeStyle) {

	var newShape = new Shape();
	$.extend(newShape, this);

	newShape.fillStyle = newShape.highlightingFillStyle || fillStyle;

	if (this instanceof Line) {
		newShape.strokeStyle = newShape.highlightingStrokeStyle || strokeStyle;
	}

	return newShape;
}

Shape.prototype._getTooltipPosition = function (input, w, h, chartW, chartH) {

	var pt = this._getTooltipOrigin(input);
	return this._getTooltipPositionFromOrigin(pt.x, pt.y, w, h, chartW, chartH);
}

Shape.prototype._getTooltipOrigin = function (input) {

	if (this.tooltipOrigin) {
		return this.tooltipOrigin;
	}

	return { x: this.x + this.width / 2, y: this.y };
	// return { x: input.locX, y: input.locY };
}

Shape.prototype._getTooltipPositionFromOrigin = function (ptx, pty, w, h, chartW, chartH) {

	var offset = 15;

	var x = ptx - w - offset;
	var y = pty - h + 10;

	if (x < 0) {
		x = Math.max(0, ptx + offset);
	}

	if (y < 0) {
		y = Math.max(0, pty - offset);
	}

	return { x: x, y: y };
}

Shape.prototype._getAnimationPoints = function (pts, length) {

	if (pts.length == length) {
		return pts;
	}

	var diff = length % 2;
	length -= diff;

	var newPts = pts.slice(0, length);

	diff /= 2;

	var prevX = pts[length - 2];
	var prevY = pts[length - 1];

	var x = pts[length];
	var y = pts[length + 1];

	if (!jMath.isNull(prevY) && !jMath.isNull(y)) {

		x = prevX + (x - prevX) * diff;
		y = prevY + (y - prevY) * diff;

		newPts.push(x);
		newPts.push(y);
	}

	return newPts;
}

// Line
function Line(x1, y1, x2, y2) {
	Shape.call(this);

	this.x1 = x1;
	this.y1 = y1;

	this.x2 = x2;
	this.y2 = y2;

	this.useHitTestArea = true;
}

Line.prototype = new Shape();
Line.constructor = new Line;

Line.prototype.hitTest = function (x, y, area) {
	var x1 = this.x1;
	var y1 = this.y1;
	var x2 = this.x2;
	var y2 = this.y2;

	var dif = Math.max(area, Math.max(3, this.lineWidth / 2));

	if (x1 == x2) {

		var dx = x + 1;

		if (dx > x1 - dif &&
            dx < x2 + dif &&
            y >= y1 - dif &&
            y <= y2 + dif) {
			return true;
		}

		return false;
	}

	if (y1 == y2) {

		var dy = y + 0.5;

		if (x >= x1 - dif &&
            x <= x2 + dif &&
            dy > y1 - dif &&
            dy < y2 + dif) {
			return true;
		}

		return false;
	}

	return false;
}

Line.prototype.hitTestNonHV = function (x, y, area) {

	var x1 = this.x1;
	var y1 = this.y1;
	var x2 = this.x2;
	var y2 = this.y2;

	// set the bounds
	if (x1 < x2) {
		this.x = x1;
		this.width = x2 - x1;
	}
	else {
		this.x = x2;
		this.width = x1 - x2;
	}

	if (y1 < y2) {
		this.y = y1;
		this.width = y2 - y1;
	}
	else {
		this.y = y2;
		this.width = y1 - y2;
	}

	//if (this.boundsHitTest(x, y, area) == false)
	//{
	//    return false;
	//}

	var dx = x2 - x1;
	var dy = y2 - y1;

	var a, b, c;

	if (dx == 0) {
		a = 1.0;
		b = 0.0;
		c = -x1;
	}
	else if (dy == 0) {
		a = 0.0;
		b = -1.0;
		c = -y1;
	}
	else if (Math.abs(dx) < Math.abs(dy)) {
		a = 1.0;
		b = (dx / dy);
		c = -((x1 * y2 - y1 * x2) / dy);
	}
	else {
		a = -(dy / dx);
		b = -1.0;
		c = -((y1 * x2 - x1 * y2) / dx);
	}

	var nrDistance = Math.sqrt(a * a + b * b);

	var normalDistance = (a * x - b * y + c) / nrDistance;

	var diff = Math.max(area, 3);

	if (Math.abs(normalDistance) < diff) {
		return true;
	}

	return false;
}

Line.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var fn = Math.floor(this.lineWidth % 2) ? jMath.roundH : Math.round;
	if (this.dontRound) {
		fn = function (a) { return a };
	}

	var x1 = fn(this.x1);
	var y1 = fn(this.y1);

	var x2 = fn(this.x2);
	var y2 = fn(this.y2);

	// For animation purposes
	if (this.xOffset) {
		x1 += this.xOffset;
		x2 += this.xOffset;
	}

	if (this.yOffset) {
		y1 += this.yOffset;
		y2 += this.yOffset;
	}

	if (this.rotationAngle && !jMath.isNull(this.rotX) && !jMath.isNull(this.rotY)) {
		var newPts = jMath.rotatePointsAt([x1, y1, x2, y2], this.rotationAngle, this.rotX, this.rotY);

		x1 = newPts[0];
		y1 = newPts[1];

		x2 = newPts[2];
		y2 = newPts[3];
	}

	if (this.strokeDashArray) {
		this.renderDashedLine(x1, y1, x2, y2, this.strokeDashArray, ctx);
		return;
	}

	ctx.beginPath();

	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Line.prototype.toJSON = function () {
	var me = this;

	var result = "type:'line',x1:" + me.x1 + ',y1:' + me.y1 + ',x2:' + me.x2 + ',y2:' + me.y2;
	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Rectangle
function Rectangle(x, y, width, height) {
	Shape.call(this);

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.cornerRadius = 0;
}

Rectangle.prototype = new Shape();
Rectangle.constructor = new Rectangle;

Rectangle.prototype.hitTest = function (x, y, area) {
	return this.boundsHitTest(x, y, area);
}

Rectangle.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var hasStorke = this.strokeStyle != null && this.lineWidth > 0;

	var fn = hasStorke && Math.floor(this.lineWidth % 2) ? jMath.roundH : Math.round;

	var corr = this.correction || 0;
	corr = Math.round(corr);

	var x = fn(this.x);
	var y = fn(this.y);
	var width = Math.round(this.width);
	var height = Math.round(this.height);

	var context = this.context;

	// for animaiton purposes
	if (this.xDecrease) {
		width -= this.xDecrease;

		if (this.isAnimReversed) {
			x += this.xDecrease;
		}
	}

	if (this.yDecrease) {
		height -= this.yDecrease;

		if (this.isAnimReversed) {
			y += this.yDecrease;
		}
	}

	if (this.xOffset) {
		x += this.xOffset;
	}

	if (this.yOffset) {
		y += this.yOffset;
	}

	if (width <= 0 || height <= 0) {
		return;
	}

	if (this.cornerRadius == 0) {
		this.renderRectPath(ctx, x, y, width, height);
	}
	else {
		this.renderRoundedRectPath(ctx, x, y, width, height);
	}

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (hasStorke) {
		ctx.stroke();
	}
}

Rectangle.prototype.renderRoundedRectPath = function (ctx, x, y, width, height) {
	var r = this.cornerRadius;

	var angle = Math.PI / 2;

	ctx.beginPath();

	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);

	ctx.arc(x + width - r, y + r, r, -angle, 0, false);
	ctx.lineTo(x + width, y + height - r);

	ctx.arc(x + width - r, y + height - r, r, 0, angle, false);
	ctx.lineTo(x + r, y + height);

	ctx.arc(x + r, y + height - r, r, angle, 2 * angle, false);
	ctx.lineTo(x, y + r);

	ctx.arc(x + r, y + r, r, 2 * angle, -angle, false);

	ctx.closePath();
}

Rectangle.prototype.toJSON = function () {
	var me = this;

	var result = "type:'rectangle',x:" + me.x + ',y:' + me.y + ',width:' + me.width + ',height:' + me.height;

	if (me.cornerRadius) {
		result += ',cornerRadius:' + me.cornerRadius;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Ellipse
function Ellipse(x, y, width, height) {
	Shape.call(this);

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Ellipse.prototype = new Shape();
Ellipse.constructor = new Ellipse;

Ellipse.prototype.hitTest = function (x, y, area) {

	if (this.boundsHitTest(x, y, area) == false) {
		return false;
	}

	var w2 = (this.width + area) / 2;
	var h2 = (this.height + area) / 2;

	var cX = this.x + w2;
	var cY = this.y + h2;

	var dx = x - cX;
	var dy = y - cY;

	var a = (dx * dx) / (w2 * w2);
	var b = (dy * dy) / (h2 * h2);

	return (a + b <= 1);
}

Ellipse.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var aX = this.x;
	var aY = this.y;
	var aWidth = this.width;
	var aHeight = this.height;

	// For animation purposes
	if (this.xOffset) {
		aX += this.xOffset;
	}

	if (this.yOffset) {
		aY += this.yOffset;
	}

	var hB = (this.width / 2) * .5522848,
            vB = (this.height / 2) * .5522848,
            eX = aX + aWidth,
            eY = aY + aHeight,
            mX = aX + aWidth / 2,
            mY = aY + aHeight / 2;

	ctx.beginPath();

	ctx.moveTo(aX, mY);
	ctx.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
	ctx.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
	ctx.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
	ctx.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}

}

Ellipse.prototype.toJSON = function () {
	var me = this;

	var result = "type:'ellipse',x:" + me.x + ',y:' + me.y + ',width:' + me.width + ',height:' + me.height;
	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Arc
function Arc(x, y, radius, startAngle, endAngle) {
	Shape.call(this);

	this.x = x;
	this.y = y;
	this.radius = radius;
	this.startAngle = startAngle;
	this.endAngle = endAngle;

	this.width = this.height = 2 * radius;
}

Arc.prototype = new Shape();
Arc.constructor = new Arc;

Arc.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	ctx.beginPath();

	var r = Math.max(0, this.radius);

	ctx.arc(Math.round(this.x + r), Math.round(this.y + r), Math.round(r), this.startAngle, this.endAngle, false);

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Arc.prototype.toJSON = function () {
	var me = this;

	var result = "type:'arc',x:" + me.x + ',y:' + me.y + ',radius:' + me.radius + ',startAngle:' + me.startAngle + ',endAngle:' + me.endAngle;
	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Circle
function Circle(x, y, radius) {
	Shape.call(this);

	this.x = x;
	this.y = y;
	this.radius = radius;

	this.width = this.height = 2 * radius;
}

Circle.prototype = new Shape();
Circle.constructor = new Circle;

Circle.prototype.hitTest = function (x, y, area) {

	if (!this.useHitTestArea) {
		area = 0;
	}

	var cX = this.x + this.width / 2;
	var cY = this.y + this.height / 2;

	var expr = Math.pow(x - cX, 2) + Math.pow(y - cY, 2);

	if (expr > Math.pow(this.radius + area, 2)) {
		return false;
	}

	return true;
}

Circle.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	ctx.beginPath();

	var r = Math.max(0, this.radius);

	ctx.arc(Math.round(this.x + r), Math.round(this.y + r), Math.round(r), 0, Math.PI * 2, false);

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Circle.prototype.toJSON = function () {
	var me = this;

	var result = "type:'circle',x:" + me.x + ',y:' + me.y + ',radius:' + me.radius;
	result += Shape.prototype.toJSON.call(this);

	return result;
}

//prediktor_code below
    // CrossCircle
function CrossCircle(x, y, radius) {
    Shape.call(this);

    this.x = x;
    this.y = y;
    this.radius = radius;

    this.width = this.height = 2 * radius;
}

CrossCircle.prototype = new Shape();
CrossCircle.constructor = new CrossCircle;

CrossCircle.prototype.hitTest = function (x, y, area) {

    if (!this.useHitTestArea) {
        area = 0;
    }

    var cX = this.x + this.width / 2;
    var cY = this.y + this.height / 2;

    var expr = Math.pow(x - cX, 2) + Math.pow(y - cY, 2);

    if (expr > Math.pow(this.radius + area, 2)) {
        return false;
    }

    return true;
}

CrossCircle.prototype.render = function (ctx, noOpts) {
    //Always Red background and White cross
    if (!this.visible) {
        return;
    }

    Shape.prototype.render.call(this, ctx, noOpts);

    ctx.beginPath();
        var r = Math.max(0, this.radius);
        ctx.fillStyle = '#FF0000';
        ctx.lineWidth = 0;
        ctx.arc(Math.round(this.x + r), Math.round(this.y + r), Math.round(r+1), 0, Math.PI * 2, false);
        ctx.fill();
    ctx.closePath();

    ctx.beginPath();
        var sqt2 = Math.sqrt(2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.moveTo(this.x - r / sqt2 + r, this.y - r / sqt2 +r);
        ctx.lineTo(this.x + r / sqt2 + r, this.y + r / sqt2 + r);
        ctx.moveTo(this.x - r / sqt2 + r, this.y + r / sqt2 + r);
        ctx.lineTo(this.x + r /sqt2 + r, this.y - r / sqt2 + r);
        ctx.stroke();
    ctx.closePath();
}

CrossCircle.prototype.toJSON = function () {
    var me = this;

    var result = "type:'crosscircle',x:" + me.x + ',y:' + me.y + ',radius:' + me.radius;
    result += Shape.prototype.toJSON.call(this);

    return result;
}
//prediktor_code above

// PieSlice
function PieSlice(x, y, innerRadius, outerRadius, startAngle, endAngle) {
	Shape.call(this);

	this.x = x;
	this.y = y;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.startAngle = startAngle;
	this.endAngle = endAngle;

	this.width = this.height = 2 * outerRadius;

	var angle = (startAngle + endAngle) / 2;

	var orX = x + outerRadius * Math.cos(angle);
	var orY = y + outerRadius * Math.sin(angle);

	this.center = this.tooltipOrigin = { x: orX, y: orY };
}

PieSlice.prototype = new Shape();
PieSlice.constructor = new PieSlice;

PieSlice.prototype.hitTest = function (x, y, area) {

	var cX = this.x;
	var cY = this.y;

	var expr = Math.pow(x - cX, 2) + Math.pow(y - cY, 2);

	if (expr > Math.pow(this.outerRadius, 2) || 
		expr < Math.pow(this.innerRadius, 2)) {
		return false;
	}

	var dx = cX - x;
	var dy = cY - y;

	var angle = Math.atan2(dy, dx) + Math.PI;
	angle = jMath.normalizeAngle(angle);

	var startAngle = jMath.normalizeAngle(this.startAngle);
	var endAngle = jMath.normalizeAngle(this.endAngle);

	// full circle case
	if (startAngle == endAngle && this.startAngle != this.endAngle) {
		return true;
	}

	if (startAngle > endAngle) {
		if ((angle >= startAngle && angle <= 2 * Math.PI) || (angle < endAngle && angle >= 0)) {
			return true;
		}
	}
	else {
		if (angle >= startAngle && angle < endAngle) {
			return true;
		}
	}

	return false;
}

PieSlice.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	if (this.startAngle == this.endAngle) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	ctx.beginPath();

	var x = Math.round(this.x);
	var y = Math.round(this.y);

	var start = this.startAngle;
	var end = this.endAngle;

	if (CanvasControl.use_excanvas) {
		var diff = 2 * Math.PI - 0.000125;

		if (end - start >= diff) {
			end = start + diff;
		}
	}

	if (this.innerRadius) {
		ctx.arc(x, y, Math.round(this.innerRadius), end, start, true);
	}
	else {
		ctx.moveTo(x, y);
	}

	ctx.arc(x, y, Math.round(this.outerRadius), start, end, false);

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

PieSlice.prototype.toJSON = function () {
	var me = this;

	var result = "type:'pieSlice',x:" + me.x + ',y:' + me.y + ',radius:' + me.outerRadius +
		',outerRadius:' + me.outerRadius +
		',innerRadius:' + me.innerRadius +
		',startAngle:' + me.startAngle + ',endAngle:' + me.endAngle;

	result += Shape.prototype.toJSON.call(this);

	return result;
}

function PolyShape() {
	Shape.call(this);
}

PolyShape.prototype = new Shape();
PolyShape.constructor = new PolyShape;

PolyShape.prototype.hitTest = function (x, y, area) {

	var context = this.context;

	if (!context || !context.points) {
		return this.boundsHitTest(x, y, area);
	}

	var pts = this.pts;

	var maxExpr = Math.pow(area, 2);

	var resIndex = -1;
	var minExpr = maxVl;

	var ptX, ptY, expr;

	var step = this.isStepLine ? 4 : 2;

	for (var i = 0; i < pts.length; i += step) {

		ptX = pts[i];
		ptY = pts[i + 1];

		expr = Math.pow(x - ptX, 2) + Math.pow(y - ptY, 2);

		if (expr > minExpr || expr > maxExpr) {
			continue;
		}

		minExpr = expr;
		resIndex = i;
	}

	if (resIndex == -1) {
		return false;
	}

	return this.createHighlightMark(resIndex);
}

PolyShape.prototype.createHighlightMark = function (index) {

	if (index == -1) {
		return null;
	}

	var context = this.context;
	var pts = this.pts;

	var idx = index / 2;
	if (this.isStepLine) {
		idx /= 2;
	}

	var cPt = context.points[idx];

	var r = 5;

	var circle = new Circle(pts[index] - r, pts[index + 1] - r, r);
	circle.fillStyle = circle.highlightingFillStyle = this.strokeStyle;
	circle.strokeStyle = 'white';
	circle.lineWidth = 1;
	circle.useHitTestArea = true;

	circle.context = {
		series: context.series,
		chart: context.chart
	};

	$.extend(circle.context, cPt);

	return circle;
}

PolyShape.prototype.getCenter = function (input) {

	if (this.center) {
		return this.center;
	}

	var context = this.context;

	if (!context || !context.points) {
		return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
	}

	var pts = this.pts;

	var result = 0;
	var dx = maxVl;

	var x = input.locX;

	var diff;

	var step = this.isStepLine ? 4 : 2;

	for (var i = 0; i < pts.length; i += step) {

		diff = Math.abs(pts[i] - x);
		if (dx > diff) {
			dx = diff;
			result = i;
		}
	}

	return { x: pts[result], y: pts[result + 1], mark: this.createHighlightMark(result) };
}

PolyShape.prototype.getLength = function () {
	return this.pts.length;
}

// Polyline
function Polyline(pts, isBoundsHitTest, closed) {
	PolyShape.call(this);

	this.pts = pts;
	this.closed = closed;

	if (isBoundsHitTest) {
		this.isBoundsHitTest = isBoundsHitTest;
		this.calculateBounds(pts);
	}
}

Polyline.prototype = new PolyShape();
Polyline.constructor = new Polyline;

Polyline.prototype.renderPoints = function (ctx, pts, noSplit) {

	var length = pts.length;
	if (length <= 2) {
		return;
	}

	if (this.strokeDashArray) {
		this.renderDashed(ctx, pts);
		return;
	}

	var notConnect = this.nullHandling != 'connect';

	var started = true;

	for (var i = 2; i < length; i += 2) {

		var x = pts[i];

		if (x == null) {
			if (notConnect) {
				if (this.strokeStyle != null && this.lineWidth > 0) {
					ctx.stroke();
				}
				started = false;
			}
			continue;
		}

		var y = pts[i + 1];

		if (!started) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			started = true;
			continue;
		}

		ctx.lineTo(x, y);

		if (i % 1000 == 0 && !noSplit) {
			if (this.strokeStyle != null && this.lineWidth > 0) {
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.moveTo(x, y);
		}
	}
}

Polyline.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var pts = jMath.trimPoints(this.pts);

	if (this.closed) {
		pts.push(pts[0]);
		pts.push(pts[1]);
	}

	if (!jMath.isNull(this.length)) {
		var len = this.closed ? this.length + 2 : this.length;
		pts = this._getAnimationPoints(pts, len);
	}

	var length = pts.length;
	if (length <= 2) {
		return;
	}

	// for animaiton purposes
	if (this.xOffset) {

		// clone current points
		pts = pts.slice(0);

		for (var i = 0; i < pts.length; i += 2) {
			pts[i] += this.xOffset;
		}
	}

	if (this.yOffset) {

		// clone current points
		pts = pts.slice(0);

		for (var i = 1; i < pts.length; i += 2) {
			pts[i] += this.yOffset;
		}
	}

	ctx.beginPath();
	ctx.moveTo(pts[0], pts[1]);

	this.renderPoints(ctx, pts);

	if (this.strokeStyle != null &&
        this.lineWidth > 0) {
		ctx.stroke();
	}
}

Polyline.prototype.renderDashed = function (ctx, pts) {

	var length = pts.length;

	var notConnect = this.nullHandling != 'connect';

	var strokeDashArray = this.strokeDashArray;

	var started = false;

	var prevX, prevY;

	for (var i = 0; i < length; i += 2) {

		var x = pts[i];

		if (x == null) {
			if (notConnect) {
				started = false;
			}
			continue;
		}

		var y = pts[i + 1];

		if (!started) {
			prevX = x;
			prevY = y;
			started = true;
			continue;
		}

		this.renderDashedLine(prevX, prevY, x, y, strokeDashArray, ctx);

		prevX = x;
		prevY = y;
	}
}

Polyline.prototype.toJSON = function () {
	var me = this;

	var result = "type:'polyline',pts:" + me.arrayToJSON(me.pts);

	if (this.nullHandling) {
		result += ",nullHandling:'" + me.nullHandling + "'";
	}

	if (me.closed) {
		result += ',closed:' + me.closed;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Curve
function Curve(pts, closed) {
	PolyShape.call(this);

	if (!pts) {
		return;
	}

	this.closed = closed;
	this.pts = pts;

	this.calculateBounds(pts);
}

Curve.prototype = new PolyShape();
Curve.constructor = new Curve;

Curve.prototype.renderPoints = function (ctx, points) {

	var t = 0.4;
	var closed = this.closed;

	var pts = [];
	$.merge(pts, points);

	var cp = [];

	var n = pts.length;
	if (n <= 2) {
		return;
	}

	if (n == 4) {
		ctx.lineTo(pts[2], pts[3]);
		return;
	}

	if (closed) {
		pts.push(pts[0], pts[1], pts[2], pts[3]);
		pts.unshift(pts[n - 1]);
		pts.unshift(pts[n - 1]);
		for (var i = 0; i < n; i += 2) {
			cp = cp.concat(this.getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t));
		}

		cp = cp.concat(cp[0], cp[1]);

		for (var i = 2; i < n + 2; i += 2) {
			ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
		}
	}
	else {
		for (var i = 0; i < n - 4; i += 2) {
			cp = cp.concat(this.getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t));
		}

		ctx.quadraticCurveTo(cp[0], cp[1], pts[2], pts[3]);

		for (var i = 2; i < n - 5; i += 2) {
			ctx.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], pts[i + 2], pts[i + 3]);
		}

		ctx.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], pts[n - 2], pts[n - 1]);
	}
}

Curve.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var pts = jMath.trimPoints(this.pts);
	if (!jMath.isNull(this.length)) {
		pts = this._getAnimationPoints(pts, this.length);
	}

	var length = pts.length;
	if (length < 4) {
		return;
	}

	ctx.beginPath();
	ctx.moveTo(pts[0], pts[1]);

	this.renderPoints(ctx, pts);

	if (this.closed) {
		ctx.closePath();

		if (this.fillStyle != null) {
			ctx.fill();
		}
	}

	if (this.strokeStyle != null &&
        this.lineWidth > 0) {
		ctx.stroke();
	}
}

Curve.prototype.getControlPoints = function (x0, y0, x1, y1, x2, y2, t) {
	var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	var fa = t * d01 / (d01 + d12);
	var fb = t - fa;

	var p1x = x1 + fa * (x0 - x2);
	var p1y = y1 + fa * (y0 - y2);

	var p2x = x1 - fb * (x0 - x2);
	var p2y = y1 - fb * (y0 - y2);

	return [p1x, p1y, p2x, p2y];
}

Curve.prototype.toJSON = function () {
	var me = this;

	var result = "type:'curve',pts:" + me.arrayToJSON(me.pts);

	if (me.closed) {
		result += ',closed:' + me.closed;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Area
function Area(pts, crossPos, vertical, isCurve) {
	PolyShape.call(this);

	this.pts = pts;

	this.crossPos = crossPos;
	this.vertical = vertical || false;
	this.isCurve = isCurve || false;

	if (pts && pts.length >= 2) {
		var areaPts = [];
		$.merge(areaPts, pts);

		if (vertical) {
			$.merge(areaPts, [crossPos, pts[pts.length - 1], crossPos, pts[1]]);
		}
		else {
			$.merge(areaPts, [pts[pts.length - 2], crossPos, pts[0], crossPos]);
		}

		this.calculateBounds(areaPts);
	}
}

Area.prototype = new PolyShape();
Area.constructor = new Area;

Area.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var pts = jMath.trimPoints(this.pts);
	if (!jMath.isNull(this.length)) {
		pts = this._getAnimationPoints(pts, this.length);
	}

	var length = pts.length;

	if (length <= 2) {
		return;
	}

	var polyline;

	if (this.isCurve) {
		polyline = new Curve(pts);
	}
	else {
		polyline = new Polyline(pts);
		polyline.nullHandling = 'connect';
	}

	ctx.beginPath();
	ctx.moveTo(pts[0], pts[1]);

	polyline.renderPoints(ctx, pts, true);

	if (this.vertical) {
		ctx.lineTo(this.crossPos, pts[pts.length - 1]);
		ctx.lineTo(this.crossPos, pts[1]);
	}
	else {
		ctx.lineTo(pts[pts.length - 2], this.crossPos);
		ctx.lineTo(pts[0], this.crossPos);
	}

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Area.prototype.toJSON = function () {
	var me = this;

	var result = "type:'area',pts:" + me.arrayToJSON(me.pts) + ',crossPos:' + me.crossPos + ',vertical:' + me.vertical;

	if (me.isCurve) {
		result += ',isCurve:' + me.isCurve;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

// RangeShape
function RangeShape(pts1, pts2, isCurve, hasHalfTootlips) {
	PolyShape.call(this);

	if (!pts1) {
		return;
	}

	this.pts1 = pts1;
	this.pts2 = pts2;

	this.pts = [];
	$.merge(this.pts, pts1);

	if (!hasHalfTootlips) {
		$.merge(this.pts, jMath.reversePoints(pts2));
	}

	this.calculateBounds(this.pts);
	this.center = null;

	this.isCurve = isCurve || false;
}

RangeShape.prototype = new PolyShape();
RangeShape.constructor = new RangeShape;

RangeShape.prototype.getLength = function () {
	return this.pts1.length;
}

RangeShape.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var pts1 = this.pts1;
	var pts2 = this.pts2;

	if (!jMath.isNull(this.length)) {
		pts1 = this._getAnimationPoints(pts1, this.length);
		pts2 = this._getAnimationPoints(pts2, this.length);
	}

	pts2 = jMath.reversePoints(pts2);

	var length = pts1.length;

	if (length < 2) {
		return;
	}

	var polyline;

	if (this.isCurve) {
		polyline = new Curve(pts1);
	}
	else {
		polyline = new Polyline(pts1);
	}

	ctx.beginPath();
	ctx.moveTo(pts1[0], pts1[1]);

	polyline.renderPoints(ctx, pts1, true);

	ctx.lineTo(pts2[0], pts2[1]);

	if (this.isCurve) {
		polyline = new Curve(pts2);
	}
	else {
		polyline = new Polyline(pts2);
	}

	polyline.renderPoints(ctx, pts2, true);

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

RangeShape.prototype.toJSON = function () {
	var me = this;

	var result = "type:'rangeShape',pts1:" + me.arrayToJSON(me.pts1) + ',pts2:' + me.arrayToJSON(me.pts2);

	if (me.isCurve) {
		result += ',isCurve:' + me.isCurve;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

// Polygon
function Polygon(pts) {
	PolyShape.call(this);

	this.pts = pts;
	this.calculateBounds(pts);
}

Polygon.prototype = new PolyShape();
Polygon.constructor = new Polygon;

Polygon.prototype.hitTest = function (x, y, area) {

	var context = this.context;

	if (context && context.points) {
		return PolyShape.prototype.hitTest.call(this, x, y, area);
	}

	var test = this.boundsHitTest(x, y, area);

	if (test == false) {
		return false;
	}

	if (this.isBoundsHitTest && area) {
		return true;
	}

	var pts = this.pts;

	var oddNodes = false;
	var count = pts.length;

	var x1, y1, x2, y2;

	var j = 0;
	for (var i = 0; i < count; i += 2) {

		j += 2;

		if (j == count) {
			j = 0;
		}

		x1 = pts[i];
		y1 = pts[i + 1];

		x2 = pts[j];
		y2 = pts[j + 1];

		if (y1 < y && y2 >= y || y2 < y && y1 >= y) {
			if (x1 + (y - y1) / (y2 - y1) * (x2 - x1) < x) {
				oddNodes = !oddNodes;
			}
		}
	}

	return oddNodes;
}

Polygon.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var pts = this.pts;

	var length = pts.length;

	if (length < 4) {
		return;
	}

	// for animaiton purposes
	if (this.xOffset) {

		// clone current points
		pts = pts.slice(0);

		for (var i = 0; i < pts.length; i += 2) {
			pts[i] += this.xOffset;
		}
	}

	if (this.yOffset) {

		// clone current points
		pts = pts.slice(0);

		for (var i = 1; i < pts.length; i += 2) {
			pts[i] += this.yOffset;
		}
	}

	if (this.rotationAngle && !jMath.isNull(this.rotX) && !jMath.isNull(this.rotY)) {
		pts = jMath.rotatePointsAt(pts, this.rotationAngle, this.rotX, this.rotY);
	}

	var fn = Math.floor(this.lineWidth % 2) ? jMath.roundH : Math.round;
	if (this.dontRound) {
		fn = function (a) { return a };
	}

	ctx.beginPath();

	ctx.moveTo(fn(pts[0]), fn(pts[1]));

	for (var i = 2; i < length; i += 2) {
		ctx.lineTo(fn(pts[i]), fn(pts[i + 1]));
	}

	ctx.closePath();

	if (this.fillStyle != null) {
		ctx.fill();
	}

	if (this.strokeStyle != null && this.lineWidth > 0) {
		ctx.stroke();
	}
}

Polygon.prototype.toJSON = function () {
	var me = this;

	var result = "type:'polygon',pts:" + me.arrayToJSON(me.pts);
	result += Shape.prototype.toJSON.call(this);

	return result;
}

function TextBlock(text, x, y) {
	this.text = text;

	this.x = x;
	this.y = y;

	this.width = 0;
	this.height = 0;

	this.strokeStyle = null;
	this.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom; def - alphabetic
	this.font = '10px sans-serif';
	this.textAlign = 'left'; // start, end, left, right, center; def- start
}

TextBlock.prototype = new Shape();
TextBlock.constructor = TextBlock;

TextBlock.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

TextBlock.separator = "\n";

TextBlock.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var x = jMath.roundH(this.x);
	var y = jMath.roundH(this.y);

	if (this.rotationAngle && !jMath.isNull(this.rotX) && !jMath.isNull(this.rotY)) {

		ctx.save();

		ctx.translate(this.rotX, this.rotY);
		ctx.rotate(this.rotationAngle);

		if (this.flip) {
			ctx.scale(-1, -1);
		}

		this.renderBg(ctx);

		if (this.fillStyle != null) {
			ctx.fillText(this.text, 0, 0);
		}

		if (this.strokeStyle != null) {
			ctx.strokeText(this.text, 0, 0);
		}

		ctx.restore();
	}
	else {

		this.renderBg(ctx);

		this.renderText(ctx, x, y);
	}
}

TextBlock.prototype.renderText = function (ctx, x, y) {

	var text = '' + this.text;

	var isMultiline = text && text.search(TextBlock.separator) != -1;

	if (isMultiline) {
		var lines = text.split(TextBlock.separator);
		var lineHeight = this.getHeight();
		var line;

		switch (this.textBaseline) {
			case 'middle':
				y -= (this.height - lineHeight) / 2;
				break;
			case 'bottom':
				y -= this.height - lineHeight;
				break;
		}

		for (var i = 0; i < lines.length; i++) {
			line = lines[i];

			if (this.fillStyle != null) {
				ctx.fillText(line, x, y);
			}

			if (this.strokeStyle != null) {
				ctx.strokeText(line, x, y);
			}

			y += lineHeight;
		}
	}
	else {

		if (this.fillStyle != null) {
			ctx.fillText(text, x, y);
		}

		if (this.strokeStyle != null) {
			ctx.strokeText(text, x, y);
		}
	}
}

TextBlock.prototype.renderBg = function (ctx) {

	var bg = this.background;

	if (!bg) {
		return;
	}

	var x = jMath.roundH(this.x);
	var y = jMath.roundH(this.y);

	if (!this.width) {
		this.measure(ctx);
	}

	var width = Math.round(this.width);
	var height = Math.round(this.height);

	ctx.fillStyle = this._createGradient(ctx, bg) || "#000000";

	var pt = this._correctXY(x, y, width, height);

	this.renderRectPath(ctx, pt.x, pt.y, width, height);

	ctx.fill();

	ctx.fillStyle = this._createGradient(ctx, this.fillStyle) || "#000000";
}

TextBlock.prototype.getHeight = function () {

	var h = 0;
	var words = this.font.split(' ');

	for (var i = 0; i < words.length; i++) {
		var word = words[i];

		var ch = word.charAt(0);
		if ($.inArray(ch, TextBlock.numbers) != -1) {
			h = parseFloat(word) || 0;
			break;
		}
	}

	return h;
}

TextBlock.prototype.measure = function (ctx) {
	this.setProperties(ctx);

	var h = this.getHeight();
	var w, size;

	var text = '' + this.text;

	var isMultiline = text && text.search(TextBlock.separator) != -1;

	if (isMultiline) {
		var lines = this.text.split(TextBlock.separator);
		h = lines.length * h;
		w = 0;

		var line;

		for (var i = 0; i < lines.length; i++) {
			size = ctx.measureText(lines[i]);

			w = Math.max(w, size.width);
		}
	}
	else {
		size = ctx.measureText(this.text);
		w = size.width;
	}

	this.width = w;
	this.height = h;

	return { width: w, height: h };
}

TextBlock.prototype._correctXY = function (x, y, w, h) {

	switch (this.textAlign) {
		case 'center':
			x -= w / 2;
			break;
		case 'right':
			x -= w;
			break;
	}

	switch (this.textBaseline) {
		case 'middle':
			y -= h / 2;
			break;
		case 'bottom':
			y -= h;
			break;
	}

	return { x: x, y: y };
}

TextBlock.prototype.isInRect = function (rX, rY, rW, rH) {

	var x = this.x;
	var y = this.y;
	var w = this.width;
	var h = this.height;

	switch (this.textAlign) {
		case 'center':
			x -= w / 2;
			break;
		case 'right':
			x -= w;
			break;
	}

	switch (this.textBaseline) {
		case 'middle':
			y -= h / 2;
			break;
		case 'bottom':
			y -= h;
			break;
	}

	return x >= rX && y >= rY && x + w <= rX + rW && y + h <= rY + rH;
}

TextBlock.prototype.intersectWith = function (rX, rY, rW, rH) {

	var x = this.x;
	var y = this.y;
	var w = this.width;
	var h = this.height;

	var xy = this._correctXY(x, y, w, h);
	x = xy.x;
	y = xy.y;

	return ((rX < (x + w)) && (x < (rX + rW)) && (rY < (y + h))) && (y < (rY + rH));
}

TextBlock.prototype.setProperties = function (ctx) {
	Shape.prototype.setProperties.call(this, ctx);

	ctx.font = this.font;
	ctx.textAlign = this.textAlign;
	ctx.textBaseline = this.textBaseline;
}

TextBlock.prototype.hitTest = function (x, y, area) {

	if (!this.isLegendItem && !this.isAxisLabel) {
		return false;
	}

	var w = this.width;
	var h = this.height;

	switch (this.textAlign) {
		case 'center':
			x += w / 2;
			break;
		case 'right':
			x += w;
			break;
	}

	switch (this.textBaseline) {
		case 'middle':
			y += h / 2;
			break;
		case 'bottom':
			y += h;
			break;
	}

	return this.boundsHitTest(x, y, area);
}

TextBlock.prototype.toJSON = function () {
	var me = this;

	if (!me.text || me.text == '') {
		return false;
	}

	var text = jMath.replaceTextForExport(this.text);

	var result = "type:'textBlock',x:" + me.x + ',y:' + me.y + ',width:' + me.width + ',height:' + me.height + ",text:'" + text + "'";
	result += ",font:'" + me.font + "'";
	result += ",textBaseline:'" + me.textBaseline + "'";
	result += ",textAlign:'" + me.textAlign + "'";

	if (!jMath.isNull(me.rotationAngle)) {
		result += ',rotationAngle:' + me.rotationAngle;
	}

	if (!jMath.isNull(me.rotX)) {
		result += ',rotX:' + me.rotX;
	}

	if (!jMath.isNull(me.rotY)) {
		result += ',rotY:' + me.rotY;
	}

	if (me.flip) {
		result += ',flip:' + me.flip;
	}

	result += Shape.prototype.toJSON.call(this);

	return result;
}

function ImageShape(x, y, src) {

	this.x = x;
	this.y = y;

	this.src = src;
}

ImageShape.prototype = new Shape();
ImageShape.constructor = ImageShape;

ImageShape.prototype.hitTest = function (x, y, area) {
	return this.boundsHitTest(x, y, area);
}

ImageShape.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	var imageObj = new Image();

	var x = this.x;
	var y = this.y;

	var that = this;

	imageObj.onload = function () {

		if (that.deleted) {
			return;
		}

		var w = imageObj.width;
		var h = imageObj.height;

		x -= w / 2;
		y -= h / 2;

		that.x = x;
		that.y = y;

		if (that.offsetX) {
			x += that.offsetX;
		}

		if (that.offsetY) {
			y += that.offsetY;
		}

		that.width = w;
		that.height = h;

		ctx.drawImage(imageObj, x, y);
	};

	imageObj.src = this.src;
}

ImageShape.prototype._createHighlightShape = function (fillStyle, strokeStyle) {

	var newShape = new Rectangle();

	newShape.context = this.context;

	newShape.x = this.x;
	newShape.y = this.y;

	newShape.width = this.width;
	newShape.height = this.height;

	newShape.fillStyle = fillStyle;
	newShape.strokeStyle = 'gray';

	return newShape;
}

// MultiShape
function MultiShape(shapes) {
	Shape.call(this);

	this.shapes = shapes;
}

MultiShape.prototype = new Shape();
MultiShape.constructor = new MultiShape;

MultiShape.prototype.hitTest = function (x, y, area) {

	var shapes = this.shapes;

	for (var i = 0; i < shapes.length; i++) {
		var sh = shapes[i];
		if (sh.hitTest(x, y, area)) {
			return true;
		}
	}

	return false;
}

MultiShape.prototype._getTooltipOrigin = function (input) {

	return { x: input.locX, y: input.locY };
}

MultiShape.prototype.render = function (ctx, noOpts) {

	if (!this.visible) {
		return;
	}

	Shape.prototype.render.call(this, ctx, noOpts);

	var shapes = this.shapes;

	for (var i = 0; i < shapes.length; i++) {
		var sh = shapes[i];
		sh.render(ctx, true);
	}
}

// Clip
function Clip(x, y, width, height) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Clip.prototype.toJSON = function () {
	var me = this;

	var result = "type:'clip',x:" + me.x + ',y:' + me.y + ',width:' + me.width + ',height:' + me.height;

	return result;
}

// Reset Clip
function ResetClip() {
}

ResetClip.prototype.toJSON = function () {
	var me = this;

	var result = "type:'resetClip'";

	return result;
}

// Shadows
function Shadows(renderShadows) {

	this.renderShadows = renderShadows;
}

Shadows.prototype.toJSON = function () {
	var me = this;

	var result = "type:'shadows',renderShadows:" + me.renderShadows;

	return result;
}

/**
 * @class Common.ShapeRenderer
 *
 */
function ShapeRenderer(canvas, chart) {
    if (this.canvas == null) {

        this.canvas = canvas;
        this.ctx = this._getContext(this.canvas);
    }

    this.chart = chart;
}

ShapeRenderer.prototype._getContext = function (canvas) {
    if (canvas.getContext) {
        return canvas.getContext("2d");
    }

    return null;
}

ShapeRenderer.emptyColor = 'rgba(0, 0, 0, 0)';

ShapeRenderer.prototype._render = function (shapes) {

    var hasTransform = this.offsetX || this.offsetY;

    var options = this.chart.options;
    var ctx = this.ctx;

    if (!jMath.isNull(options.globalAlpha)) {
        ctx.globalAlpha = options.globalAlpha;
    }

    if (hasTransform) {
        ctx.save();
        ctx.translate(this.offsetX, this.offsetY);
    }

    for (var i = 0; i < shapes.length; i++) {

        var sh = shapes[i];
        if (sh) {

            if (!this.isHighlighting &&
                sh.context &&
                sh.context.series &&
                !sh.isLegendItem &&
                !(sh instanceof TextBlock)) {
                this.chart.elem.trigger('shapeRendering', sh);
            }

            if (sh.src && this.isExcanvas) {
                sh.offsetX = this.offsetX;
                sh.offsetY = this.offsetY;

                ctx.translate(-this.offsetX, -this.offsetY);

                sh.render(ctx);

                ctx.translate(this.offsetX, this.offsetY);
            }
            else {

                var shadowColor = sh.shadowColor;
                sh.shadowColor = ShapeRenderer.emptyColor;

                sh.render(ctx);

                sh.shadowColor = shadowColor;
            }
        }
    }

    if (hasTransform) {
        ctx.restore();
    }
}

ShapeRenderer.prototype._renderShadows = function (shapes) {

    if (CanvasControl.use_excanvas) {
        return;
    }

    var hasTransform = this.offsetX && this.offsetY;

    var options = this.chart.options;

    if (!options.shadows || !options.shadows.enabled) {
        return;
    }

    var ctx = this.ctx;

    if (!jMath.isNull(options.globalAlpha)) {
        ctx.globalAlpha = options.globalAlpha;
    }

    if (hasTransform) {
        ctx.save();
        ctx.translate(this.offsetX, this.offsetY);
    }

    for (var i = 0; i < shapes.length; i++) {

        var sh = shapes[i];
        if (sh && sh.shadowColor && sh.shadowColor != 'rgba(0, 0, 0, 0)') {
            sh.render(ctx);
        }
    }

    if (hasTransform) {
        ctx.restore();
    }
}

ShapeRenderer.prototype._clear = function () {

    var shapes = this.shapes;
    if (shapes) {
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].deleted = true;
        }
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 * @class Common.Title
 *
 * Defines a title. 
 * 
 * Sample configuration:
 *
 *     var titleConfig = {
 *        text: 'Title Text',
 *        font: '40px sans-serif',
 *        lineWidth: 1,
 *        strokeStyle: 'black',
 *        fillStyle: 'yellow'
 *     }
 *
 * Example usage:
 *
 *        @example
 *        $('#selector').jqChart({
 *           title: {
 *               text: 'Chart Title',
 *               font: '40px sans-serif',
 *               lineWidth: 1,
 *               strokeStyle: 'black',
 *               fillStyle: 'yellow'
 *           },
 *           series: [
 *              {
 *                  type: 'column',
 *                  data: [['a', 70], ['b', 40], ['c', 85], 
 *                          ['d', 50], ['e', 25], ['f', 40]]
 *              }
 *           ]
 *       });
 **/
function Title(options) {

    this.defaults = {
        /**
        * @cfg {String} text
        * Specifies the title text.
        */
        text : '',
        /**
         * @cfg {String} font
         * Specifies text font.
         */
        font: '14px sans-serif',
        /**
        * @cfg {String/Common.Gradient} fillStyle
        * Specifies text color.
        */
        fillStyle: 'black',
        
        /**
        * @cfg {Number} lineWidth
        * Specifies text border line width.
        */
        lineWidth: 0,
        /**
        * @cfg {Number} margin
        * Specifies title margins.
        */
        margin: 6

        /**
        * @cfg {String} strokeStyle
        * Specifies text border color.
        */
    };

    this.x = 0;
    this.y = 0;
    
    this.setOptions(options);    
}

Title.prototype._render = function (shapes) {
    if (this.text == null) {
        return;
    }

    this.textBlock.x = this.x + this.margin;
    this.textBlock.y = this.y + this.margin;

    this.textBlock.rotX = this.rotX;
    this.textBlock.rotY = this.rotY;
    this.textBlock.rotationAngle = this.rotationAngle;

    shapes.push(this.textBlock);
}

Title.prototype._measure = function () {
    var size;

    if (!this.text) {
        this.width = 0;
        this.height = 0;
        return;
    }

    size = this.textBlock.measure(this.chart.ctx);

    var l = 2 * this.margin;

    this.width = size.width + l;
    this.height = size.height + l;
}

Title.prototype.setOptions = function (options) {

    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);

    // init text block
    this.textBlock = new TextBlock(this.text);
    this.textBlock.textBaseline = 'top';
    this.textBlock.font = this.font;

    this.textBlock.fillStyle = this.fillStyle;
    this.textBlock.strokeStyle = this.strokeStyle;
    this.textBlock.lineWidth = this.lineWidth;
}

/**
 * @class Common.Watermark
 * @extends Common.Title
 *
 * Defines a watermark. For example:
 *
 * Sample configuration:
 *
 *     var watermarkConfig: {
 *          text: 'Copyright Information',
 *          fillStyle: 'red',
 *          font: '16px sans-serif',
 *          hAlign: 'right',
 *          vAlign: 'bottom'
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: 'Watermark',
 *               watermark: {
 *                   text: 'Copyright Information',
 *                   fillStyle: 'red',
 *                   font: '16px sans-serif',
 *                   hAlign: 'right',
 *                   vAlign: 'bottom'
 *               },
 *               series: [
 *                   {
 *                       title: 'Series 1',
 *                       type: 'column',
 *                       data: [['A', 70], ['B', 40], ['C', 85], 
 *                              ['D', 50], ['E', 25], ['F', 40]]
 *                   }
 *               ]
 *           });
 *       });
 */
function Watermark(chart) {

    var defs = $.extend(false, {}, this.defaults, {
        /**
         * @cfg {String} hAlign
         * Specifies the watermark horizontal alignment -  'left', 'center' or 'right'.
         */
        hAlign: 'left',
        /**
         * @cfg {String} vAlign
         * Specifies the watermark vertical alignment -  'top', 'center' or 'bottom'.
         */
        vAlign: 'top'
    });

    this.defaults = defs;

    this.chart = chart;
}

Watermark.prototype = new Title();
Watermark.constructor = Watermark;

Watermark.prototype._render = function (shapes) {

    var chart = this.chart;
    if (this.text == null || !chart) {
        return;
    }

    var w = chart._width;
    var h = chart._height;

    var x = this.margin + this.textBlock.width / 2;
    var y = this.margin;

    switch (this.hAlign) {
        case 'center':
            x += (w - this.width) / 2;
            break;
        case 'right':
            x += w - this.width;
        default:
            break;
    }

    switch (this.vAlign) {
        case 'center':
            y += (h - this.height) / 2;
            break;
        case 'bottom':
            y += h - this.height;
        default:
            break;
    }

    this.textBlock.textAlign = 'center';

    this.textBlock.x = x;
    this.textBlock.y = y;

    this.textBlock.rotX = x;
    this.textBlock.rotY = y;
    this.textBlock.rotationAngle = this.angle;

    shapes.push(this.textBlock);
}

/**
 * @class Common.Border
 *
 * Defines a border. 
 *
 * Sample configuration:
 *
 *     var borderConfig = {
 *         visilbe: true,
 *         strokeStyle : 'red',
 *         lineWidth: 4,
 *         cornerRadius : 12,
 *         padding : 6
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Chart Border' },
 *               border: {
 *                   cornerRadius: 20,
 *                   lineWidth: 4,
 *                   strokeStyle: '#6ba851'
 *               },
 *               series: [
 *                   {
 *                       type: 'column',
 *                       data: [['A', 70], ['B', 40], ['C', 85],
 *                              ['D', 50], ['E', 25], ['F', 40]]
 *                   }
 *               ]
 *           });
 *       });
 **/
function Border(options) {

    this.defaults = {
         /**
         * @cfg {Boolean} visible
         * Specifies whether or not the border should be displayed.
         */
        visible: true,
         /**
         * @cfg {String} strokeStyle
         * Specifies the border line color.
         */
        strokeStyle: 'black',
        /**
         * @cfg {Number} lineWidth
         * Specifies the border line width.
         */
        lineWidth: 1,

        lineCap: 'butt', // butt | round | square
        lineJoin: 'miter', // round | bevel | miter
        miterLimit: 10,

        /**
         * @cfg {Number} cornerRadius
         * Specifies the border corner radius.
         */
        cornerRadius: 10,
        /**
         * @cfg {Common.Padding} padding
         * Specifies the border padding.
         */
        padding: 4,

        /**
         * @cfg {Boolean} ignoreOffset
         * Specifies whether to ignore the border offset set there for aesthetics.
         *
         * NOTE: When you ignore the border offset, you will need to put bigger border paddings on the sides that you need to adjust.
         */
        ignoreOffset: false
    };

    this.x = 0;
    this.y = 0;

    this.setOptions(options);
}

Border.prototype._setShapeSettings = function (shape) {
    // fill
    shape.fillStyle = this.fillStyle;

    // stroke
    if (this.visible) {
        shape.strokeStyle = this.strokeStyle;
        shape.lineWidth = this.lineWidth;
        shape.lineCap = this.lineCap;
        shape.lineJoin = this.lineJoin;
        shape.miterLimit = this.miterLimit;

        shape.cornerRadius = this.cornerRadius;
    }
    else {
        shape.lineWidth = 0;
    }
}

Border.prototype._render = function (shapes) {

    var offset = this.visible ? this.lineWidth / 2 : 0;

    var x = this.x + offset;
    var y = this.y + offset;
    var w = this.width - 2 * offset;
    var h = this.height - 2 * offset;

    var rect = new Rectangle(x, y, w, h);
    this._setShapeSettings(rect);

    shapes.push(rect);
}

Border.prototype.setOptions = function (options) {
    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);
}

Border.prototype.getPaddings = function () {

    var paddings = { left: 0, right: 0, top: 0, bottom: 0 };

    if (!this.visible) {
        return paddings;
    }

    var offset = this.lineWidth + this.cornerRadius / 2;

    if (this.ignoreOffset === true)
    {
        offset = this.lineWidth;
    }

    var left, top, right, bottom;

    var padding = this.padding;

    if ($.isPlainObject(padding)) {
        left = padding.left || 0;
        top = padding.top || 0;
        right = padding.right || 0;
        bottom = padding.bottom || 0;
    }
    else {
        left = top = right = bottom = padding || 0;
    }

    paddings.left = left + offset;
    paddings.top = top + offset;
    paddings.right = right + offset;
    paddings.bottom = bottom + offset;

    return paddings;
}

/**
 * @class Common.TickMark
 *
 * Defines tick marks.
 *
 * Sample configuration:
 *
 *     var tickMarksConfig: {
 *         lineWidth: 2,
 *         strokeStyle: 'red',
 *         length : 12,
 *         interval: 10
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Tick Marks' },
 *               axes: [
 *                   {
 *                       location: 'left',
 *                       majorTickMarks: {
 *                           lineWidth: 2,
 *                           strokeStyle: 'red',
 *                           length: 12,
 *                           interval: 10
 *                       },
 *                       minorTickMarks: {
 *                           lineWidth: 1,
 *                           strokeStyle: 'green',
 *                           interval: 2
 *                       }
 *                   }
 *               ],
 *               series: [
 *                   {
 *                       type: 'column',
 *                       data: [['A', 70], ['B', 40], ['C', 85],
 *                              ['D', 50], ['E', 25], ['F', 40]]
 *                   }
 *               ]
 *           });
 *       });
 */
function TickMark(options) {

    this.defaults = {
        /**
         * @cfg {String} strokeStyle
         * Specifies tick marks color.
         */
        strokeStyle: 'black',
        /**
         * @cfg {Number} lineWidth
         * Specifies tick marks lines width.
         */
        lineWidth: 1,
        /**
         * @cfg {Number} length
         * Specifies tick marks interval.
         */
        length: 6,
        /**
         * @cfg {String} position
         * Specifies tick marks position 'outside' or 'inside'.
         */
        position: 'outside',
        /**
         * @cfg {Boolean} visible
         * Specifies whether or not the tick marks should be displayed.
         */
        visible: true,
        /**
         * @cfg {Number} zIndex
         * Specifies tick marks zIndex.
         */
        zIndex: 2,
        /**
         * @cfg {Number} offset
         * Specifies tick marks offset.
         */
        offset: 0.4
        /**
         * @cfg {Number} interval
         * Specifies tick marks interval.
         */
    };

    this.setOptions(options);
}

TickMark.prototype.isInside = function () {
    return this.position == 'inside';
}

TickMark.prototype._setLineSettings = function (line) {
    line.strokeStyle = this.strokeStyle;
    line.lineWidth = this.lineWidth;
    line.strokeDashArray = this.strokeDashArray;
}

TickMark.prototype.setOptions = function (options) {
    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);
}

/**
 * @class Chart.DefaultChartTool 
 * @extends Common.DefaultTool
 * 
 */
function DefaultChartTool(view) {
    DefaultTool.call(this, view);
}

DefaultChartTool.prototype = new DefaultTool();
DefaultChartTool.constructor = DefaultChartTool;

DefaultChartTool.prototype.mouseWheel = function (e, delta, deltaX, deltaY) {

    if (!delta) {
        return;
    }

    var mode = this.view.options.mouseWheelInteractionMode;
    if (mode != 'scrolling' && mode != 'zooming') {
        return;
    }

    var direction = this.view.options.mouseWheelZoomInDirect;
    if (direction == 'down') {
        //reverse direction
        delta = -delta;
    }

    var axes = this.view.axes.getZoomableAxes();
    if (axes.length > 0) {
        e.preventDefault();
    }

    for (var i = 0; i < axes.length; i++) {
        if (mode == 'scrolling') {
            axes[i]._mouseWheelScroll(delta);
        }
        else {
            axes[i]._mouseWheelZoom(delta);
        }
    }

    this.view.partialDelayedUpdate();
}

/**
 * @class Chart.ZoomingTool 
 * @extends Common.Tool
 * 
 */
function ZoomingTool(view) {
    Tool.call(this, view);
}

ZoomingTool.prototype = new Tool();
ZoomingTool.constructor = ZoomingTool;

ZoomingTool.prototype.canStart = function (e) {

    if (this.view.options.mouseInteractionMode != 'zooming') {
        return false;
    }

    if (!this.view.gridArea.isMouseOver) {
        return false;
    }

    if (this.view.canZoom) {
        e.preventDefault();
        return true;
    }

    return false;
}

ZoomingTool.prototype.start = function () {

    this.view._clearRenderers();

    this.zoomableAxes = this.view.axes.getZoomableAxes();
    this.mouseInput1 = this.view.mouseInput;

    this.currCursor = this.view.elem.css('cursor').toString();

    if (this.view.canZoomHor && this.view.canZoomVer) {
        this.view.elem.css('cursor', 'crosshair');
    }
    else if (this.view.canZoomHor) {
        this.view.elem.css('cursor', 'e-resize');
    }
    else {
        this.view.elem.css('cursor', 's-resize');
    }
}

ZoomingTool.prototype.mouseMove = function (e) {
    
    var mouseInput2 = this.view.mouseInput;
    this.view._renderSelectionRect(this.mouseInput1, mouseInput2);
}

ZoomingTool.prototype.mouseUp = function (e) {

    // do zoom
    var mouseInput1 = this.mouseInput1;
    var mouseInput2 = this.view.mouseInput;

    var dx = Math.abs(mouseInput1.x - mouseInput2.x);
    var dy = Math.abs(mouseInput1.y - mouseInput2.y);

    if (dx > 1 || dy > 1) {
        var axes = this.zoomableAxes;

        for (var i = 0; i < axes.length; i++) {
            axes[i]._scaleToRegion(mouseInput1, mouseInput2);
        }

        this.view.partialDelayedUpdate();
    }

    // stop tool
    this.stopTool();
}

ZoomingTool.prototype.keyDown = function (e) {

    if (e.which == 27) {
        e.preventDefault();
        this.stopTool();
    }
}

ZoomingTool.prototype.stop = function () {
    // set old cursor
    this.zoomableAxes = null;

    this.view._clearSelectionRect();
    this.view.elem.css('cursor', this.currCursor);

    Tool.prototype.stop.call(this);
}

/**
 * @class Chart.PanningTool 
 * @extends Common.Tool
 * 
 */
function PanningTool(view) {
    Tool.call(this, view);
}

PanningTool.prototype = new Tool();
PanningTool.constructor = PanningTool;

PanningTool.prototype.canStart = function (e) {

    if (this.view.options.mouseInteractionMode != 'panning') {
        return false;
    }

    if (!this.view.gridArea.isMouseOver) {
        return false;
    }

    if (this.view.canZoom) {
        e.preventDefault();
        return true;
    }

    return false;
}

PanningTool.prototype.start = function () {

    this.zoomableAxes = this.view.axes.getZoomableAxes();
    this.oldMouseInput = this.view.mouseInput;

    this.currCursor = this.view.originalCursor;

    var cursor = this.view.originalCursor = ($.browser && $.browser.mozilla) ? '-moz-grabbing' : 'move';

    this.view.elem.css('cursor', cursor);
}

PanningTool.prototype.mouseMove = function (e) {

    var zoomableAxes = this.zoomableAxes;
    var mouseInput = this.view.mouseInput;
    var axes = this.zoomableAxes;

    var dx = this.oldMouseInput.locX - mouseInput.locX;
    var dy = this.oldMouseInput.locY - mouseInput.locY;

    for (var i = 0; i < axes.length; i++) {
        axes[i]._moveVisibleRange(dx, dy);
    }

    this.oldMouseInput = mouseInput;

    this.view.partialDelayedUpdate();
}

PanningTool.prototype.mouseUp = function (e) {
    this.stopTool();
}

PanningTool.prototype.stop = function () {
    // set old cursor
    this.zoomableAxes = null;

    this.view.originalCursor = this.currCursor;

    this.view._resetCursor();

    Tool.prototype.stop.call(this);
}

/**
 * @class Chart.TouchTool 
 * @extends Common.Tool
 * 
 */
function TouchTool(view) {
    Tool.call(this, view);
}

TouchTool.prototype = new Tool();
TouchTool.constructor = TouchTool;

TouchTool.prototype.canStart = function (e) {

    if (!this.view.canZoom) {
        return false;
    }

    var touches = this.view.touchInput;

    for (var i = 0; i < touches.length; i++) {

        var touch = touches[i];

        if (!this.view.gridArea._contains(touch.locX, touch.locY)) {
            return false;
        }
    }

    e.preventDefault();

    return true;
}

TouchTool.prototype.start = function () {
    this.zoomableAxes = this.view.axes.getZoomableAxes();
    this.oldTouchInput = this.view.touchInput;
}

TouchTool.prototype.touchMove = function (e) {

    e.preventDefault();

    if (!this.oldTouchInput) {
        this.oldTouchInput = this.view.touchInput;
        return;
    }

    var len = this.view.touchInput.length;

    if (len > 2) {
        return;
    }

    var isScaling = false;

    if (len == 2) {
        isScaling = true;
    }

    if (this.isScaling != isScaling) {
        this.oldTouchInput = this.view.touchInput;
        this.isScaling = isScaling;
    }

    if (isScaling) {
        this.doScale(e);
    }
    else {
        this.doPan(e);
    }
}

TouchTool.prototype.touchEnd = function (e) {
    if (this.view.touchInput.length == 0) {
        this.stopTool();
    }
    else {
        this.oldTouchInput = null;
    }
}

TouchTool.prototype.stop = function () {
    this.zoomableAxes = null;
    this.oldTouchInput = null;

    Tool.prototype.stop.call(this);
}

TouchTool.prototype.doPan = function (e) {
    var axes = this.zoomableAxes;

    var touches = this.view.touchInput;

    var touch = touches[0];
    var oldTouch = this.oldTouchInput[0];

    var dx = oldTouch.locX - touch.locX;
    var dy = oldTouch.locY - touch.locY;

    for (var i = 0; i < axes.length; i++) {
        axes[i]._moveVisibleRange(dx, dy);
    }

    this.oldTouchInput = touches;

    this.view.partialDelayedUpdate();
}

TouchTool.prototype.doScale = function (e) {

    var touches = this.view.touchInput;

    if (!this.oldTouchInput || this.oldTouchInput.length != 2) {

        this.oldTouchInput = touches;
        return;
    }

    var oldTouchInput = this.getTwoTouchPointData(this.oldTouchInput);
    var touchInput = this.getTwoTouchPointData(touches);

    var axes = this.zoomableAxes;

    for (var i = 0; i < axes.length; i++) {
        axes[i]._scaleVisibleRange(oldTouchInput, touchInput);
    }

    this.oldTouchInput = touches;

    this.view.partialDelayedUpdate();
}

TouchTool.prototype.getTwoTouchPointData = function (touches) {

    var input = {
        x1: touches[0].locX,
        y1: touches[0].locY,
        x2: touches[1].locX,
        y2: touches[1].locY
    };

    input.centerX = (input.x1 + input.x2) / 2;
    input.centerY = (input.y1 + input.y2) / 2;

    input.dx = Math.abs(input.x2 - input.x1);
    input.dy = Math.abs(input.y2 - input.y1);

    return input;
}

/**
 * @class Chart.Chart
 * @extends Common.CanvasControl
 * 
 *
 */
function JQChart(elem) {

	this.pluginClass = 'ui-jqchart';
	this.tooltipClass = 'ui-jqchart-tooltip';

	CanvasControl.call(this, elem);

	this.timer = new Timer($.proxy(this.partialUpdate, this));
	this.storyboard = new Storyboard($.proxy(this._renderShapes, this));

	this.defaultTool = new DefaultChartTool(this);
	this.currentTool = this.defaultTool;

	this.mouseDownTools.push(new PanningTool(this));
	this.mouseDownTools.push(new ZoomingTool(this));
	this.touchMoveTools.push(new TouchTool(this));
}

JQChart.prototype = new CanvasControl();
JQChart.constructor = JQChart;

JQChart.prototype._createElements = function (elem) {
	CanvasControl.prototype._createElements.call(this, elem);

	if (CanvasControl.use_excanvas) {
		// area canvas
		this.areaCanvas = this._createCanvas(true);

		var areaDiv = $('<div style="position:absolute"></div>');

		this.elem.append(areaDiv);
		areaDiv.append(this.areaCanvas);

		// area canvas renderer
		this.areaRenderer = new ShapeRenderer(this.areaCanvas, this);
		this.areaRenderer.div = areaDiv;
		this.areaRenderer.isExcanvas = true;

		// upper canvas
		this.upperCanvas = this._createCanvas(true);

		var upperDiv = $('<div style="position:absolute"></div>');

		this.elem.append(upperDiv);
		upperDiv.append(this.upperCanvas);

		// upper canvas renderer
		this.upperRenderer = new ShapeRenderer(this.upperCanvas, this);
		this.upperRenderer.div = upperDiv;
		this.upperRenderer.isExcanvas = true;
	}

	this.chCanvas = this._createCanvas();
	this.chRenderer = new ShapeRenderer(this.chCanvas, this);

	this._createHighlightRenderer();

	// grid area
	this.gridArea = new GridArea(this);

	this.border = new Border();
	this.paletteColors = new ChartPaletteColors();

	this.title = new Title();
	this.title.chart = this;

	this.legend = new Legend();
	this.legend.chart = this;

	this.watermark = new Watermark(this);
	this.toolbar = new ChartToolbar(this);

	this.noDataMessage = new Title();
	this.noDataMessage.chart = this;

	// series
	this.series = new SeriesArray(this);

	// axes
	this.axes = new AxesArray(this);
}

JQChart.prototype._processOptions = function (options) {
	var me = this;

	options = options || {};

	me.arrDataSource = null;

	var dataSource = options.dataSource;

	if (dataSource && $.isArray(dataSource)) {
		me.arrDataSource = dataSource;
		me._setOptions(options);
		return;
	}

	if ($.isPlainObject(dataSource) && dataSource.ajax) {
		var ajax = dataSource.ajax;

		var config = {};

		$.extend(config, ajax);

		config.success = function (msg) {
			me.arrDataSource = msg.hasOwnProperty("d") ? msg.d : msg;
		}

		var ajaxComplete = config.complete;

		config.complete = function () {

			if (ajaxComplete) {
				ajaxComplete();
			}

			me._setOptions(options);
		}

		$.ajax(config);
		return;
	}

	me._setOptions(options);
}

JQChart.prototype._setOptions = function (options) {

	if (!this.elem || this.elem.length == 0) {
		return;
	}

	var settings = options || {};

	if (typeof settings.title == 'string') {
		settings.title = { text: settings.title };
	}

	settings.title = settings.title || {};
	settings.title = $.extend({}, $.fn.jqChart.defaults.title, settings.title);

	settings.crosshairs = $.extend(true, {}, $.fn.jqChart.defaults.crosshairs, settings.crosshairs);
	settings.tooltips = $.extend(true, {}, $.fn.jqChart.defaults.tooltips, settings.tooltips);

	settings.shadows = $.extend(true, {}, $.fn.jqChart.defaults.shadows, settings.shadows);
	settings.selectionRect = $.extend(true, {}, $.fn.jqChart.defaults.selectionRect, settings.selectionRect);
	settings.watermark = $.extend(true, {}, $.fn.jqChart.defaults.watermark, settings.watermark);

	if (typeof settings.noDataMessage == 'string') {
		settings.noDataMessage = { text: settings.noDataMessage };
	}
	settings.noDataMessage = $.extend(true, {}, $.fn.jqChart.defaults.noDataMessage, settings.noDataMessage);

	settings.globalAlpha = jMath.isNull(settings.globalAlpha) ? $.fn.jqChart.defaults.globalAlpha : settings.globalAlpha;
	settings.mouseInteractionMode = settings.mouseInteractionMode || $.fn.jqChart.defaults.mouseInteractionMode;
	settings.mouseWheelInteractionMode = settings.mouseWheelInteractionMode || $.fn.jqChart.defaults.mouseWheelInteractionMode;

	this.hasCrosshairs = settings.crosshairs.enabled === true;
	this.hasTooltips = settings.tooltips && !settings.tooltips.disabled;
	this.hasHighlighting = settings.tooltips && settings.tooltips.highlighting;

	this.options = settings;

	CanvasControl.prototype._setOptions.call(this, settings);

	var ops = options || {};

	if (ops.width) {
		this.elem.css('width', ops.width);
	}
	else if (this.elem.width() == 0) {
		this.elem.css('width', '400px');
	}

	if (ops.height) {
		this.elem.css('height', ops.height);
	}
	else if (this.elem.height() == 0) {
		this.elem.css('height', '250px');
	}

	var w = this._width = this.elem.width();
	var h = this._height = this.elem.height();

	var settings = this.options;

	this.border.setOptions(settings.border);
	this.border.fillStyle = settings.background || this.border.fillStyle;

	this.gridArea.fillStyle = settings.chartAreaBackground;

	this.paletteColors.setOptions(settings.paletteColors);
	this.title.setOptions(settings.title);
	this.legend.setOptions(settings.legend);
	this.watermark.setOptions(settings.watermark);
	this.toolbar.setOptions(settings.toolbar);
	this.noDataMessage.setOptions(settings.noDataMessage);

	// setOptions series
	this.series.setOptions(settings.series);

	// setOptions axes
	this.axes.setOptions(settings.axes);

	this._setCanvasSize(this.canvas, w, h);
	this._setCanvasSize(this.chCanvas, w, h);
	this._setCanvasSize(this.hlCanvas, w, h);

	if (this.areaCanvas) {
		this._setCanvasSize(this.areaCanvas, w, h);
	}

	if (this.upperCanvas) {
		this._setCanvasSize(this.upperCanvas, w, h);
	}

	// create chart
	this.update();
};

JQChart.prototype.isServerFiltering = function () {
	var dataSource = this.options.dataSource;

	if (!dataSource) {
		return false;
	}

	if (dataSource.serverFiltering === true && $.isPlainObject(dataSource) && dataSource.ajax) {
		return true;
	}

	return false;
}

JQChart.prototype._processAsyncData = function () {

	if (!this.isServerFiltering()) {
		return;
	}

	var that = this;
	var dataSource = that.options.dataSource;

	that.arrDataSource = null;

	var ajax = dataSource.ajax;

	var config = {};

	$.extend(config, ajax);

	config.url += '?';

	var axes = this.axes.getZoomableAxes();
	for (var i = 0; i < axes.length; i++) {
		var axis = axes[i];

		axis.minimum = axis.actualMinimum;
		axis.maximum = axis.actualMaximum;

		if (i > 0) {
			config.url += '&';
		}

		if (axis.name) {
			config.url += 'name=' + axis.name + '&';
		}

		var timeZoneOffset = 0;
		if (axis.DataType == 'DateTimeAxis') {
			timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
		}

		config.url += 'start=' + (axis.visibleMinimum - timeZoneOffset) + '&end=' + (axis.visibleMaximum - timeZoneOffset);
	}

	config.success = function (msg) {
		that.arrDataSource = msg.hasOwnProperty("d") ? msg.d : msg;
	}

	var ajaxComplete = config.complete;

	config.complete = function () {

		if (ajaxComplete) {
			ajaxComplete();
		}

		that.series._processData();

		that.update();
	}

	$.ajax(config);
}

JQChart.prototype._mouseEnter = function (e) {
	CanvasControl.prototype._mouseEnter.call(this, e);
	this.toolbar.show();
}

JQChart.prototype._mouseLeave = function (e) {
	CanvasControl.prototype._mouseLeave.call(this, e);
	this.toolbar.hide();
}

JQChart.prototype._measure = function () {
	this.title._measure();
	this.legend._measure();
	this.watermark._measure();
	this.noDataMessage._measure();

	return this.axes._measure();
};

JQChart.prototype._arrange = function () {
	var w = this._width;
	var h = this._height;

	// border
	this.border.width = w;
	this.border.height = h;

	var paddings = this.border.getPaddings();

	w -= paddings.left + paddings.right;
	h -= paddings.top + paddings.bottom;

	var x = paddings.left;
	var y = paddings.top + this.title.height;

	// grid area
	var axesW = this.axes._getTotalWidth();
	var axesH = this.axes._getTotalHeight();

	if (this.legend._isHorizontal()) {
		this.gridArea.width = Math.round(w - axesW);
		this.gridArea.height = Math.round(h - (axesH + this.title.height + this.legend.height));
	}
	else {
		this.gridArea.width = Math.round(w - (axesW + this.legend.width));
		this.gridArea.height = Math.round(h - (axesH + this.title.height));
	}

	switch (this.legend.location) {
		case 'left':
			x += this.legend.width;
			break;
		case 'top':
			y += this.legend.height;
			break;
	}

	// axes
	var verCrossingAxis = this.axes.verCrossingAxis;
	var horCrossingAxis = this.axes.horCrossingAxis;

	// left
	var lAxes = this.axes._getAxesInLoc('left');
	for (var i = lAxes.length - 1; i >= 0; i--) {
		var axis = lAxes[i];

		axis.x = x;

		axis.height = this.gridArea.height;

		if (!horCrossingAxis) {
			x = Math.ceil(x + axis.width);
		}
	}

	// grid area x
	this.gridArea.x = x;
	x += this.gridArea.width;

	// right
	var rAxes = this.axes._getAxesInLoc('right');
	for (var i = 0; i < rAxes.length; i++) {
		var axis = rAxes[i];

		axis.x = x;

		axis.height = this.gridArea.height;
		if (!horCrossingAxis) {
			x = Math.ceil(x + axis.width);
		}
	}

	// top
	var tAxes = this.axes._getAxesInLoc('top');
	for (var i = tAxes.length - 1; i >= 0; i--) {
		var axis = tAxes[i];

		axis.x = this.gridArea.x;
		axis.y = y;

		axis.width = this.gridArea.width;

		if (!verCrossingAxis) {
			y = Math.ceil(y + axis.height);
		}
	}

	// grid area y
	this.gridArea.y = y;
	y += this.gridArea.height;

	// bottom
	var bAxes = this.axes._getAxesInLoc('bottom');
	for (var i = 0; i < bAxes.length; i++) {
		var axis = bAxes[i];

		axis.x = this.gridArea.x;
		axis.y = y;

		axis.width = this.gridArea.width;

		if (!verCrossingAxis) {
			y = Math.ceil(y + axis.height);
		}
	}

	var vertAxes = lAxes.concat(rAxes);
	for (var i = 0; i < vertAxes.length; i++) {
		var axis = vertAxes[i];
		axis.y = this.gridArea.y;
	}

	// radial
	var bAxes = this.axes._getAxesInLoc('radial');
	for (var i = 0; i < bAxes.length; i++) {
		var axis = bAxes[i];

		axis.x = this.gridArea.x;
		axis.y = this.gridArea.y;

		axis.width = this.gridArea.width;
		axis.height = this.gridArea.height;
	}

	// title
	this.title.x = paddings.left + (w - this.title.width) / 2;
	this.title.y = paddings.top;

	// legend
	switch (this.legend.location) {
		case 'bottom':
			this.legend.x = paddings.left + (w - this.legend.width) / 2;
			this.legend.y = paddings.top + h - this.legend.height;
			break;
		case 'left':
			this.legend.x = paddings.left;
			this.legend.y = paddings.top + this.gridArea.y + (this.gridArea.height - this.legend.height) / 2.0;
			break;
		case 'top':
			this.legend.x = paddings.left + (w - this.legend.width) / 2;
			this.legend.y = paddings.top + this.title.height;
			break;
		case 'right':
		default:
			this.legend.x = paddings.left + w - this.legend.width;
			this.legend.y = this.gridArea.y + (this.gridArea.height - this.legend.height) / 2.0;
			break;
	}

	this.gridArea._arrange();
	this.axes._arrange();
	this.legend._arrange();

	// no data message
	this.noDataMessage.x = paddings.left + (w - this.noDataMessage.width) / 2;
	this.noDataMessage.y = paddings.top + (h - this.noDataMessage.height) / 2;
};

JQChart.prototype.setPointerAt = function (input) {

	if (!input) {
		this._clearRenderers();
		return;
	}

	var e = {
		locX: input.x,
		locY: input.y
	};

	this.mouseInput = e;
	this._processMouseMove(e);
}

JQChart.prototype._processMouseMove = function (e) {

	var input = this.mouseInput;

	if (this.gridArea) {
		var contains = this.gridArea._contains(input.locX, input.locY);

		if (this.gridArea.isMouseOver != contains) {

			if (!contains) {
				this._clearRenderers();
			}

			this.gridArea.isMouseOver = contains;
		}
	}

	this._processMouseEvents();

	if (this.gridArea.isMouseOver) {
		this._processTooltips(input);
		this._initCrosshairs(input);
	}
	else {
		if (this.hasCrosshairs) {
			this.elem.trigger('crosshairsMove', null);
		}
	}
}

JQChart.prototype._initTouchInput = function (e) {

	CanvasControl.prototype._initTouchInput.call(this, e);

	var touch = this.touchInput[0];

	if (!this.gridArea || !touch) {
		return;
	}

	var contains = this.gridArea._contains(touch.locX, touch.locY);

	if (this.gridArea.isTouchOver != contains) {

		if (!contains) {
			this._clearRenderers();
		}

		this.gridArea.isTouchOver = contains;
	}
}

JQChart.prototype._processTouchStart = function (e) {

	if (!this.gridArea.isTouchOver) {
		return;
	}

	var touch = this.touchInput[0];

	e.preventDefault();
	this._processTooltips(touch);
	this._initCrosshairs(touch);
}

JQChart.prototype._processTouchMove = function (e) {

	if (!this.gridArea.isTouchOver) {
		return;
	}

	var touch = this.touchInput[0];

	e.preventDefault();
	this._processTouchEvents();
	this._processTooltips(touch);
	this._initCrosshairs(touch);
}

JQChart.prototype._clearRenderers = function () {

	CanvasControl.prototype._clearRenderers.call(this);

	if (this.chRenderer) {
		this.chRenderer._clear();
	}

	if (this._oldChShape) {
		this._oldChShape = null;
	}
};

JQChart.prototype._getClosestShapeAtX = function (shapes, input) {

	var result = null;
	var dx = maxVl;

	var x = input.locX;

	for (var i = shapes.length - 1; i >= 0; i--) {
		var shape = shapes[i];

		if (!shape.context || shape.isLegendItem || shape.isAxisLabel) {
			continue;
		}

		var series = shape.context.series;
		if (series.tooltips && series.tooltips.disabled) {
			continue;
		}


		var center = shape.getCenter(input);
		var diff = Math.abs(center.x - x);
		if (dx > diff) {
			dx = diff;
			result = shape;
			if (center.mark) {
				result = center.mark;
			}
		}
	}

	return result;
};

JQChart.prototype._getClosestShapeAtY = function (shapes, input) {

	var result = null;
	var dy = maxVl;

	var y = input.locY;

	for (var i = shapes.length - 1; i >= 0; i--) {
		var shape = shapes[i];

		var centerY = shape.getCenter(input).y;
		var diff = Math.abs(centerY - y);
		if (dy > diff) {
			dy = diff;
			result = shape;
		}
	}

	return result;
};

JQChart.prototype._getShapesAtX = function (x, shape, shapes, input) {

	var result = [shape];
	var series = [shape.context.series];
	var diffs = [0];

	for (var i = 0; i < shapes.length; i++) {
		var sh = shapes[i];

		if (sh == shape ||
            !sh.context ||
            sh.isLegendItem ||
            sh.isAxisLabel) {
			continue;
		}

		var ser = sh.context.series;

		var index = $.inArray(ser, series);
		if (index == 0) {
			continue;
		}

		var center = sh.getCenter(input);
		var diff = Math.abs(x - center.x);

		if (diff >= 3) {
			continue;
		}

		if (index != -1) {
			var prevDiff = diffs[index];
			if (diff < prevDiff) {

				if (center.mark) {
					result[index] = center.mark;
				}
				else {
					result[index] = sh;
				}

				diffs[index] = diff;
			}

			continue;
		}

		if (center.mark) {
			result.push(center.mark);
		}
		else {
			result.push(sh);
		}

		series.push(ser);
		diffs.push(diff);
	}

	return result;
};

JQChart.prototype._getTooltipShapes = function (x, y, area, input) {

	var shapes = null;

	var tooltips = this.options.tooltips;
	if (tooltips.type == 'shared') {
		var closestShape = this._getClosestShapeAtX(this.shapes, input);
		if (closestShape) {
			shapes = this._getShapesAtX(closestShape.getCenter(input).x, closestShape, this.shapes, input);
		}
	}
	else {
		shapes = CanvasControl.prototype._getTooltipShapes.call(this, x, y, area, input);
	}

	if (shapes) {

		series = this.series.items;

		shapes.sort(function (a, b) {

			var index1 = $.inArray(a.context.series, series);
			var index2 = $.inArray(b.context.series, series);

			return index1 - index2;
		});
	}

	return shapes;
};

JQChart.prototype._getTooltip = function (shape) {

	return shape.context.series._getTooltip(shape.context);
};

JQChart.prototype._getTooltipText = function (shapes) {

	var text = '';
	var that = this;

	var axes = [];

	// axes values
	for (var i = 0; i < shapes.length; i++) {
		var sh = shapes[i];

		if (!sh.context.series) {
			continue;
		}

		var xAxis = sh.context.series.realXAxis;
		if (xAxis && sh.context.x && $.inArray(xAxis, axes) == -1) {

			var xText = xAxis._getTooltip(sh.context.x);
			text += xText;
			axes.push(xAxis);
		}
	}

	// series values
	$.each(shapes, function () {

		var tText = that._getTooltip(this);
		if (tText) {
			text += tText;
		}
	});

	return text;
};

JQChart.prototype._initCrosshairs = function (input) {

	if (!this.hasCrosshairs) {
		return;
	}

	var crosshairs = this.options.crosshairs;

	var context = {};

	var x = input.locX;
	var y = input.locY;

	if (crosshairs.snapToDataPoints) {
		var closestShape = this._getClosestShapeAtX(this.shapes, input);

		if (closestShape) {

			var newShapes = this._getShapesAtX(closestShape.getCenter(input).x, closestShape, this.shapes, input);
			closestShape = this._getClosestShapeAtY(newShapes, input);

			if (closestShape) {

				var pt = closestShape.getCenter(input);
				x = pt.x;
				y = pt.y;

				if (this._oldChShape != closestShape) {

					this._oldChShape = closestShape;

					$.extend(context, closestShape.context);
					context.locX = x;
					context.locY = y;

					this.elem.trigger('crosshairsMove', context);
				}
			}
		}
	}
	else {
		context.x = x;
		context.y = y;

		this.elem.trigger('crosshairsMove', context);
	}

	this._renderCrosshairs(x, y);
};

JQChart.prototype._renderCrosshairs = function (x, y) {
	if (!this.hasCrosshairs) {
		return;
	}

	var gridArea = this.gridArea;

	if (!gridArea._contains(x, y)) {
		return;
	}

	var crosshairs = this.options.crosshairs;

	var shapes = [];

	if (crosshairs.hLine && crosshairs.hLine.visible) {
		var hLine = new Line(gridArea.x, y, gridArea.x + gridArea.width, y);
		if (crosshairs.hLine) {
			$.extend(hLine, crosshairs.hLine);
		}

		shapes.push(hLine);
	}

	if (crosshairs.vLine && crosshairs.vLine.visible) {
		var vLine = new Line(x, gridArea.y, x, gridArea.y + gridArea.height);
		if (crosshairs.vLine) {
			$.extend(vLine, crosshairs.vLine);
		}

		shapes.push(vLine);
	}

	this.chRenderer._clear();
	this.chRenderer._render(shapes);
};

JQChart.prototype._renderSelectionRect = function (input1, input2) {

	var gridArea = this.gridArea;

	var x1 = gridArea.fitHor(input1.locX);
	var y1 = gridArea.fitVer(input1.locY);

	var x2 = gridArea.fitHor(input2.locX);
	var y2 = gridArea.fitVer(input2.locY);

	if (!this.canZoomVer) {
		y1 = gridArea.y;
		y2 = gridArea.y + gridArea.height;
	}
	else if (!this.canZoomHor) {
		x1 = gridArea.x;
		x2 = gridArea.x + gridArea.width;
	}

	var x = Math.min(x1, x2);
	var y = Math.min(y1, y2);
	var w = Math.abs(x1 - x2);
	var h = Math.abs(y1 - y2);

	var rect = new Rectangle(x, y, w, h);

	$.extend(rect, this.options.selectionRect);

	this.chRenderer._clear();
	this.chRenderer._render([rect]);
}

JQChart.prototype._clearSelectionRect = function () {
	this.chRenderer._clear();
}

JQChart.prototype._initZooming = function () {
	var that = this;

	that.canZoomVer = false;
	that.canZoomHor = false;

	$.each(this.axes.items, function () {
		if (this.zoomEnabled) {
			if (this.location != 'radial') {
				if (this.isAxisVertical) {
					that.canZoomVer = true;
				}
				else {
					that.canZoomHor = true;
				}
			}
		}
	});

	this.canZoom = this.canZoomVer || this.canZoomHor;
}

JQChart.prototype._triggerShapeEvent = function (name, shape) {

	if (shape.isLegendItem) {
		this.legend._handleEvent(name, shape);
	}
	else if (shape.context.series) {
		shape.context.series._handleEvent(name, shape);
	}

	var start = shape.isLegendItem ? 'legendItem' : 'dataPoint';

	if (shape.isAxisLabel) {
		start = 'axisLabel';
	}

	shape.context.shape = shape;

	this.elem.trigger(start + name, shape.context);
}

JQChart.prototype.setOptions = function (options) {


};

JQChart.prototype.clear = function () {

	CanvasControl.prototype.clear.call(this);

	if (CanvasControl.use_excanvas) {
		this.areaRenderer._clear();
		this.upperRenderer._clear();
	}
};

JQChart.prototype._setClip = function (ctx) {

	var gArea = this.gridArea;

	ctx.beginPath();
	ctx.rect(gArea.x, gArea.y, gArea.width, gArea.height);
	ctx.clip();
};

JQChart.prototype._createShapes = function () {

	var allShapes = {};
	var contextShapes = [];

	var gArea = this.gridArea;

	// create shapes
	var shapes = allShapes.shapes = [];

	// put chart elements
	this.border._render(shapes);

	if (this.hasData) {
		this.title._render(shapes);
		var legendContextShapes = this.legend._render(shapes);

		allShapes.gaShapes = [];
		gArea._render(allShapes.gaShapes);

		allShapes.axesShapes = [];
		var axisResult = this.axes._render(allShapes.axesShapes);

		allShapes.postAxisShapes = axisResult.postShapes;

		// nonGridAreaSerShapes
		var nonGridAreaSerShapes = allShapes.nonGridAreaSerShapes = [];
		this.series._render(nonGridAreaSerShapes);

		// series
		var serShapes = allShapes.serShapes = [];
		var postSeriesShapes = gArea._renderSeries(serShapes);

		allShapes.gaZIndexShapes = [];
		gArea._renderZIndex(allShapes.gaZIndexShapes, 2);

		$.merge(nonGridAreaSerShapes, postSeriesShapes);

		$.merge(contextShapes, serShapes);
		$.merge(contextShapes, nonGridAreaSerShapes);
		$.merge(contextShapes, legendContextShapes);
		$.merge(contextShapes, axisResult.contextShapes);
	}
	else {
		this.noDataMessage._render(shapes);
	}

	shapes = allShapes.ws = [];
	this.watermark._render(shapes);
	

	this.shapes = contextShapes;

	this.allShapes = allShapes;
};

JQChart.prototype._renderShapes = function () {

	var isRetinaDisplay = CanvasControl.isRetinaDisplay;
	var w = this._width,
        h = this._height;

	if (isRetinaDisplay) {
		this._setRetinaDispOpts(this.canvas, w, h);
		this._setRetinaDispOpts(this.chCanvas, w, h);
		this._setRetinaDispOpts(this.hlCanvas, w, h);
	}

	this.shapeRenderer._clear();

	if (CanvasControl.use_excanvas) {
		this.areaRenderer._clear();
		this.upperRenderer._clear();
	}

	var gArea = this.gridArea;
	var allShapes = this.allShapes;

	// shapes
	this.shapeRenderer._render(allShapes.shapes);

	if (this.hasData) {

		// grid area shapes
		var gaShapes = allShapes.gaShapes;
		if (CanvasControl.use_excanvas) {
			this.areaRenderer._render(gaShapes);
		}
		else {
			this.ctx.save();

			this._setClip(this.ctx);

			this.shapeRenderer._renderShadows(gaShapes);
			this.shapeRenderer._render(gaShapes);

			this.ctx.restore();
		}

		// series shapes
		var serShapes = allShapes.serShapes;

		if (serShapes.length > 0) {
			this.elem.trigger('seriesShapesRendering', [serShapes]);
		}

		if (CanvasControl.use_excanvas) {
			this.areaRenderer._render(serShapes);

			this.areaRenderer._render(allShapes.gaZIndexShapes);
		}
		else {
			this.ctx.save();

			this._setClip(this.ctx);

			this.shapeRenderer._renderShadows(serShapes);
			this.shapeRenderer._render(serShapes);

			this.shapeRenderer._render(allShapes.gaZIndexShapes);

			this.ctx.restore();
		}

		var upperRenderer;
		if (CanvasControl.use_excanvas) {
			upperRenderer = this.upperRenderer;
		}
		else {
			upperRenderer = this.shapeRenderer;
		}

		// axesShapes
		upperRenderer._render(allShapes.axesShapes);

		// nonGridAreaSerShapes
		var nonGridAreaSerShapes = allShapes.nonGridAreaSerShapes;

		if (nonGridAreaSerShapes.length > 0) {
			this.elem.trigger('seriesShapesRendering', [nonGridAreaSerShapes]);
		}

		upperRenderer._renderShadows(nonGridAreaSerShapes);
		upperRenderer._render(nonGridAreaSerShapes);

		// postAxisShapes
		upperRenderer._render(allShapes.postAxisShapes);
	}

	// watermarks
	this.shapeRenderer._render(allShapes.ws);

	this.shapeRenderer.shapes = this.shapes;

	if (isRetinaDisplay) {
		$(this.canvas).css({ width: w, height: h });
		$(this.chCanvas).css({ width: w, height: h });
		$(this.hlCanvas).css({ width: w, height: h });
	}
};


JQChart.prototype.stringFormat = function (val, format) {

	if ($.type(val) == 'date') {
		return $.jqChartDateFormatter(val, format);
	}

	return $.jqChartSprintf(format, val);
}


JQChart.prototype.render = function () {

	this._clearRenderers();

	this._createShapes();
	this._renderShapes();
}

JQChart.prototype.findAxis = function (name) {
	if (this.axes) {
		return this.axes.find(name);
	}
};

JQChart.prototype.update = function () {

	this.hasData = this.series.hasData();

	// init series data
	this.series._initData();

	// init series axes
	this.axes._initSeriesAxes();

	// init axes series
	this.axes._initSeries();

	this._initZooming();

	this.axes._initRanges();

	this.series._initVisibleData();

	// init series colors
	this.series._initColors();

	// init legend
	this.legend._init();

	this.axes._resetWH();
	this.axes._initCrossingAxes();

	var isSizeChanged = false;

	for (var i = 0; i < 10; i++) {

		// measure chart parts
		isSizeChanged = this._measure();

		// arrange chart parts
		this._arrange();

		// update x and length
		this.axes._updateOrigins();

		// process axis data
		this.axes._initRanges();

		this.axes._updateCrossings();

		// make origin corrections
		this.axes._correctOrigins();

		if (isSizeChanged == false) {
			break;
		}
	}

	// init toolbar
	this.toolbar._init();

	this.render();

	this.storyboard.begin();
};

JQChart.prototype.partialDelayedUpdate = function () {

	if (this.isServerFiltering()) {
		this._processAsyncData();
	}
	else {
		this.timer.kick();
	}
}

JQChart.prototype.partialUpdate = function () {

	this.series._initVisibleData();

	this.axes._resetWH();

	var isSizeChanged = false;

	this.axes._initRanges();

	for (var i = 0; i < 10; i++) {

		// measure chart parts
		isSizeChanged = this._measure();

		// arrange chart parts
		this._arrange();

		// update x and length
		this.axes._updateOrigins();

		// process axis data
		this.axes._initRanges();

		this.axes._updateCrossings();

		// make origin corrections
		this.axes._correctOrigins();

		if (isSizeChanged == false) {
			break;
		}
	}

	this.render();
};

JQChart.prototype.highlightData = function (items) {

	var shapes = CanvasControl.prototype.highlightData.call(this, items);
	if (shapes) {
		var pt = shapes[0].getCenter();
		this._renderCrosshairs(pt.x, pt.y);
	}
}

JQChart.prototype.destroy = function () {

	this.axes.clear();

	CanvasControl.prototype.destroy.call(this);
}

JQChart.prototype.exportToImage = function (config) {
	this._exportToImage(config, $.fn.jqChart.defaults.exportConfig);
}

JQChart.prototype.exportToPdf = function (config) {
	this._exportToPdf(config, $.fn.jqChart.defaults.exportConfig);
}

JQChart.prototype.toJSON = function (config) {
	var gArea = this.gridArea;

	var shadows = this.options.shadows;
	var shadowsEnabled = shadows && shadows.enabled;

	var clip = new Clip(gArea.x, gArea.y, gArea.width, gArea.height);
	var resetClip = new ResetClip();

	var shadows = new Shadows(true);
	var noShadows = new Shadows(false);

	var allShapes = this.allShapes;

	var shapes = [];
	$.merge(shapes, allShapes.shapes);

	if (this.hasData) {

		shapes.push(clip);

		// shadows
		if (shadowsEnabled) {
			shapes.push(shadows);
			$.merge(shapes, allShapes.gaShapes);
			shapes.push(noShadows);
		}

		$.merge(shapes, allShapes.gaShapes);
		shapes.push(resetClip);

		$.merge(shapes, allShapes.axesShapes);

		// series shapes
		shapes.push(clip);

		// shadows
		if (shadowsEnabled) {
			shapes.push(shadows);
			$.merge(shapes, allShapes.serShapes);
			shapes.push(noShadows);
		}

		$.merge(shapes, allShapes.serShapes);
		$.merge(shapes, allShapes.gaZIndexShapes);

		shapes.push(resetClip);

		// nonGridAreaSerShapes
		// shadows
		if (shadowsEnabled) {
			shapes.push(shadows);
			$.merge(shapes, allShapes.nonGridAreaSerShapes);
			shapes.push(noShadows);
		}

		$.merge(shapes, allShapes.nonGridAreaSerShapes);

		$.merge(shapes, allShapes.postAxisShapes);
	}

	$.merge(shapes, allShapes.ws);

	return this._toJSON(shapes, config);
}


// StockShape
function StockShape(x, high, low, open, close, width) {
    Shape.call(this);

    this.high = high;
    this.low = low;
    this.open = open;
    this.close = close;

    this.x = x - width / 2;
    this.width = width;
    this.height = Math.abs(high - low);
    this.y = Math.min(high, low);

    this.isUp = close < open;

    this.tooltipOrigin = { x: x, y: Math.min(high, low) };
    this.center = { x: x, y: (open + close) / 2 };

    if (this.createElements) {
        this.createElements(x, high, low, open, close, width);
    }
}

StockShape.prototype = new Shape();
StockShape.constructor = new StockShape;

StockShape.prototype.createElements = function (x, high, low, open, close, width) {
    var items = [];

    var w = width / 2;

    // high-low
    var line = new Line(x, high, x, low);
    items.push(line);

    // open
    line = new Line(x - w, open, x, open);
    items.push(line);

    // close
    line = new Line(x, close, x + w, close);
    items.push(line);

    this.items = items;
}

StockShape.prototype.hitTest = function (x, y, area) {
    if (area) {
        return this.boundsHitTest(x, y, area);
    }

    for (var i = 0; i < this.items.length; i++) {

        var item = this.items[i];
        if (item.hitTest(x, y, area)) {
            return true;
        }
    }

    return false;
}

StockShape.prototype.render = function (ctx) {

    if (!this.visible) {
        return;
    }

    Shape.prototype.render.call(this, ctx);

    for (var i = 0; i < this.items.length; i++) {

        var item = this.items[i];
        this.setProperties(item);

        if (this.isUp) {
            if (this.priceUpStrokeStyle) {
                item.strokeStyle = this.priceUpStrokeStyle;
            }
        }
        else {
            if (this.priceDownStrokeStyle) {
                item.strokeStyle = this.priceDownStrokeStyle;
            }
        }

        item.render(ctx);
    }
}

StockShape.prototype._createHighlightShape = function (fillStyle, strokeStyle) {

    var newShape = new StockShape();
    $.extend(newShape, this);

    newShape.fillStyle = fillStyle;
    newShape.priceUpFillStyle = fillStyle;
    newShape.priceDownFillStyle = fillStyle;

    newShape.strokeStyle = strokeStyle;
    newShape.lineWidth += 2;

    return newShape;
}

StockShape.prototype.getTooltipColor = function () {
    if (this.isUp) {
        if (this.priceUpStrokeStyle) {
            return Shape.getColorFromFillStyle(this.priceUpStrokeStyle);
        }
    }

    if (this.priceDownStrokeStyle) {
        return Shape.getColorFromFillStyle(this.priceDownStrokeStyle);
    }

    return Shape.prototype.getTooltipColor.call(this);
}

StockShape.prototype.toJSON = function () {
    var me = this;

    var result = "type:'stock',x:" + me.x + ',width:' + me.width + ',high:' + me.high + ',low:' + me.low + ',open:' + me.open + ',close:' + me.close;

    if (me.priceUpStrokeStyle) {
        result += ",priceUpStrokeStyle:'" + me.priceUpStrokeStyle + "'";
    }

    if (me.priceDownStrokeStyle) {
        result += ",priceDownStrokeStyle:'" + me.priceDownStrokeStyle + "'";
    }

    result += Shape.prototype.toJSON.call(this);

    return result;
}

// CandlestickShape
function CandlestickShape(x, high, low, open, close, width) {
    StockShape.call(this, x, high, low, open, close, width);
}

CandlestickShape.prototype = new StockShape();
CandlestickShape.constructor = new CandlestickShape;

CandlestickShape.prototype.createElements = function (x, high, low, open, close, width) {
    var items = [];

    var w = Math.floor(width / 2);
    var x = Math.round(x);

    // open - close
    var y1 = Math.round(open);
    var y2 = Math.round(close);

    if (y1 > y2) {
        var tmp = y2;
        y2 = y1;
        y1 = tmp;
    }

    if (high > low) {
        var tmp = low;
        low = high;
        high = tmp;
    }

    if (y2 - y1 >= 1) {
        var rect = new Rectangle(x - w, y1, 2 * w, y2 - y1);
        rect.useHitTestArea = true;
        items.push(rect);
    }
    else {
        var line = new Line(x - w, y1, x + w, y1);
        items.push(line);
    }

    // high
    var line = new Line(x, high, x, y1);
    items.push(line);

    // low
    var line = new Line(x, y2, x, low);
    items.push(line);

    this.items = items;
}


CandlestickShape.prototype.render = function (ctx) {

    if (!this.visible) {
        return;
    }

    Shape.prototype.render.call(this, ctx);

    for (var i = 0; i < this.items.length; i++) {

        var item = this.items[i];
        this.setProperties(item);

        if (item instanceof Rectangle) {
            if (this.isUp) {
                item.fillStyle = this.priceUpFillStyle;
            }
            else {
                item.fillStyle = this.priceDownFillStyle;
            }
        }

        item.render(ctx);
    }
}

CandlestickShape.prototype.getTooltipColor = function () {
    if (this.isUp) {
        return Shape.getColorFromFillStyle(this.priceUpFillStyle);
    }

    return Shape.getColorFromFillStyle(this.priceDownFillStyle);
}

CandlestickShape.prototype.toJSON = function () {
    var me = this;

    var result = "type:'candlestick',x:" + me.x + ',width:' + me.width + ',high:' + me.high + ',low:' + me.low + ',open:' + me.open + ',close:' + me.close;

    if (me.priceUpFillStyle) {
        result += ",priceUpFillStyle:" + me.fillStyleToJSON(me.priceUpFillStyle);
    }

    if (me.priceDownFillStyle) {
        result += ",priceDownFillStyle:" + me.fillStyleToJSON(me.priceDownFillStyle);
    }

    result += Shape.prototype.toJSON.call(this);

    return result;
}

/**
 * @class Chart.ChartPaletteColors 
 * 
 * Defines chart palette colors.
 *
 * Sample configuration:
 *
 *     var paletteColorsConig = {
 *          type: 'customColors',
 *          customColors: ['#A0522D', '#D2691E', '#8B0000', '#CD853F']
 *     }
 *
 * Example usage:
 *
 *        @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Custom Colors' },
 *               legend: { location: 'bottom' },
 *               paletteColors: {
 *                   type: 'customColors',
 *                   customColors: ['#A0522D', '#D2691E', '#8B0000', '#CD853F']
 *               }, 
 *               axes: [
 *                   {
 *                       type: 'category',
 *                       location: 'bottom',
 *                       categories: ['A', 'B', 'C', 'D']
 *                   }
 *               ],
 *               series: [
 *                   {
 *                       type: 'column',
 *                       title: 'Series 1',
 *                       data: [62, 70, 68, 58]
 *                   },
 *                   {
 *                       type: 'column',
 *                       title: 'Series 2',
 *                       data: [56, 50, 62, 65]
 *                   },
 *                   {
 *                       type: 'column',
 *                       title: 'Series 3',
 *                       data: [60, 55, 42, 68]
 *                   },
 *                   {
 *                       type: 'column',
 *                       title: 'Series 4',
 *                       data: [68, 30, 56, 40]
 *                   }
 *               ]
 *           });
 *       });
 */
function ChartPaletteColors(options) {

    this.colorsDefault = ['#418CF0', '#FCB441', '#E0400A', '#056492', '#BFBFBF', '#1A3B69', '#FFE382', '#129CDD', '#CA6B4B', '#005CDB', '#F3D288', '#506381', '#F1B9A8', '#E0830A', '#7893BE'];
    this.colorsGrayScale = initializeGrayScaleColors();

    this.defaults = {
        /**
        * @cfg {String} type
        * Specifies the pallete type -  'default', 'grayscale' or 'customColors'.
        */
        type: 'default'
        /**
        * @cfg {String[]} customColors
        * Specifies an array of colors - ['red', 'green', ...]
        */
    };

    this.setOptions(options);
}

ChartPaletteColors.prototype.setOptions = function (options) {
    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);
}

function initializeGrayScaleColors() {
    var len = 16;

    var colors = [];
    for (var i = 0; i < len; i++) {
        var red = 200 - (i * 11);
        red = red.toString();

        var color = 'rgb(' + red + ',' + red + ',' + red + ')';

        colors.push(color);
    }

    return colors;
}

ChartPaletteColors.prototype.getColor = function (index) {
    var palette = this.getColors(this.type);

    var len = palette.length;

    index %= len;

    return palette[index];
}

ChartPaletteColors.prototype.getColors = function (paletteType) {
    switch (paletteType.toLowerCase()) {
        case 'customcolors':
            return this.customColors;
        case 'grayscale':
            return this.colorsGrayScale;
        case 'default':
        default:
            return this.colorsDefault;
    }
}

/**
 * @class Chart.ChartToolbar 
 * 
 * Defines chart toolbar.
 *
 * Sample configuration:
 *
 *     var toolbarConfig = {
 *           visibility: 'auto',
 *           resetZoomTooltipText: 'Reset Zoom (100%)',
 *           zoomingTooltipText: 'Zoom in to selection area',
 *           panningTooltipText: 'Pan the chart',
 *			 resetZoomButtonVisible: true,
 *			 zoomingButtonVisible: true,
 *			 panningButtonVisible: true
 *     }
 *
 * Example usage:
 *
 *        @example
 *           function addDays(date, value) {
 *             var newDate = new Date(date.getTime());
 *             newDate.setDate(date.getDate() + value);
 *             return newDate;
 *           }
 *
 *           function round(d) {
 *               return Math.round(100 * d) / 100;
 *           }
 *
 *           var data1 = [];
 *           var data2 = [];
 *
 *           var yValue1 = 50;
 *           var yValue2 = 200;
 *
 *           var date = new Date(2010, 0, 1);
 *
 *           for (var i = 0; i < 200; i++) {
 *
 *               yValue1 += Math.random() * 10 - 5;
 *               data1.push([date, round(yValue1)]);
 *
 *               yValue2 += Math.random() * 10 - 5;
 *               data2.push([date, round(yValue2)]);
 *
 *               date = addDays(date, 1);
 *           }
 *
 *           $(document).ready(function () {
 *                $('#selector').jqChart({
 *                   title: 'Chart Toolbar', 
 *                   toolbar: {
 *                       visibility: 'auto', // auto, visible, hidden
 *                       resetZoomTooltipText: 'Reset Zoom (100%)',
 *                       zoomingTooltipText: 'Zoom in to selection area',
 *                       panningTooltipText: 'Pan the chart'
 *                   },
 *                   mouseInteractionMode: 'zooming', // zooming, panning
 *                   axes: [
 *                       {
 *                           type: 'dateTime',
 *                           location: 'bottom',
 *                           zoomEnabled: true
 *                       },
 *                       {
 *                           type: 'linear',
 *                           location: 'left',
 *                           zoomEnabled: true
 *                       }
 *                   ], 
 *                   series: [
 *                       {
 *                           type: 'line',
 *                           data: data1,
 *                           markers: null
 *                       },
 *                       {
 *                           type: 'line',
 *                           data: data2,
 *                           markers: null
 *                       }
 *                   ]
 *               });
 *           });
 */
function ChartToolbar(chart) {
    this.chart = chart;

    this.defaults = {
        /**
        * @cfg {String} visibility
        * Specifies the chart toolbar visibility -  'auto', 'visible' or 'hidden'.
        */
        visibility: 'auto',
        /**
        * @cfg {String} resetZoomTooltipText
        * Specifies reset zoom button tooltip text.
        */
        resetZoomTooltipText: 'Reset Zoom (100%)',
        /**
        * @cfg {String} zoomingTooltipText
        * Specifies zooming button tooltip text.
        */
        zoomingTooltipText: 'Zoom in to selection area',
        /**
        * @cfg {String} panningTooltipText
        * Specifies panning button tooltip text.
        */
        panningTooltipText: 'Pan the chart',
        /**
         * @cfg {String} hAlign
         * Specifies the toolbar horizontal alignment -  'left', 'center' or 'right'.
         */
        hAlign: 'right',
        /**
         * @cfg {String} vAlign
         * Specifies the toolbar vertical alignment -  'top', 'center' or 'bottom'.
         */
        vAlign: 'top',

    	/**
         * @cfg {Boolean} resetZoomButtonVisible
         * Specifies whether or not the "reset zoom" button is visible.
         */
        resetZoomButtonVisible: true,
    	/**
         * @cfg {Boolean} zoomingButtonVisible
         * Specifies whether or not the "zooming" button is visible.
         */
        zoomingButtonVisible: true,
    	/**
         * @cfg {Boolean} panningButtonVisible
         * Specifies whether or not the " panning" button is visible.
         */
        panningButtonVisible: true
    };
}

ChartToolbar.prototype = {

    setOptions: function (options) {

        var settings = $.extend({}, this.defaults, options || {});
        $.extend(this, settings);
    },

    _init: function () {
        var toolbar = this.toolbar;

        var chart = this.chart;

        if (this.visibility == 'hidden' || (this.visibility == 'auto' && !chart.canZoom)) {

            if (toolbar) {
                toolbar.remove();
                this.toolbar = null;
            }

            return;
        }

        if (!toolbar) {
            this.toolbar = toolbar = $('<ul onselectstart="return false;" class="ui-jqchart-toolbar ui-widget ui-widget-content ui-corner-all"></ul>');

            this._addButtons();
            toolbar.hide();
            chart.elem.append(toolbar);

            toolbar.mousedown(function (e) {
                e.preventDefault();
                return false;
            });

            toolbar.mouseenter(function (e) {
                chart._clearRenderers();
                e.preventDefault();
                return false;
            });

            toolbar.mousemove(function (e) {
                e.preventDefault();
                return false;
            });
        }

        var w = toolbar.outerWidth();
        var h = toolbar.outerHeight();

        var ga = chart.gridArea;

        var x = ga.x;
        var y = ga.y;

        switch (this.hAlign) {
            case 'center':
                x += (ga.width - w) / 2;
                break;
            case 'right':
                x += ga.width - w;
                break;
        }

        switch (this.vAlign) {
            case 'center':
                y += (ga.height - h) / 2;
                break;
            case 'bottom':
                y += ga.height - h;
                break;
        }

        toolbar.css({ left: x, top: y });

        if (this.visibility == 'visible') {
            toolbar.show();
        }
    },
    _addButtons: function () {
        var toolbar = this.toolbar;

        var chart = this.chart;

        if (this.resetZoomButtonVisible) {
        	var resetZoom = $("<li class='ui-corner-all ui-widget-header'><span class='ui-icon ui-icon-arrow-4-diag'></span></li>");
        	toolbar.append(resetZoom);
        	this._addHover(resetZoom);
        	resetZoom.attr('title', this.resetZoomTooltipText);
        	resetZoom.mousedown(function (e) {

        		e.preventDefault();

        		var axes = chart.axes.items;
        		for (var i = 0; i < axes.length; i++) {
        			axes[i].resetZoom();
        		}

        		chart.partialDelayedUpdate();

        		return false;
        	});
        }

        if (this.resetZoomButtonVisible && (this.zoomingButtonVisible || this.panningButtonVisible)) {

        	// var separator = $("<li class='ui-jqchart-toolbar-separator ui-widget-header'></li>");
        	var separator = $("<li class='ui-jqchart-toolbar-separator'></li>");
        	toolbar.append(separator);
        }

        if (this.panningButtonVisible) {
        	var pan = $("<li class='ui-corner-all ui-widget-header'><span class='ui-icon ui-icon-arrow-4'></span></li>");
        	toolbar.append(pan);
        	this._addHover(pan);
        	pan.attr('title', this.panningTooltipText);
        	pan.mousedown(function (e) {
        		e.preventDefault();

        		chart.options.mouseInteractionMode = 'panning';

        		pan.addClass('ui-state-active');
        		zoom.removeClass('ui-state-active');

        		return false;
        	});
        }

        if (this.zoomingButtonVisible) {
        	var zoom = $("<li class='ui-corner-all ui-widget-header'><span class='ui-icon ui-icon-zoomin'></span></li>");
        	toolbar.append(zoom);
        	this._addHover(zoom);
        	zoom.attr('title', this.zoomingTooltipText);
        	zoom.mousedown(function (e) {
        		e.preventDefault();

        		chart.options.mouseInteractionMode = 'zooming';

        		pan.removeClass('ui-state-active');
        		zoom.addClass('ui-state-active');

        		return false;
        	});
        }

        switch (chart.options.mouseInteractionMode) {
        	case 'zooming':
        		if (zoom) {
        			zoom.addClass('ui-state-active');
        		}
                break;
            default:
            	if (pan) {
            		pan.addClass('ui-state-active');
            	}
                break;
        }
    },
    _addHover: function (elem) {
        elem.hover(function () {
            $(this).addClass("ui-state-hover");
        },
		function () {
		    $(this).removeClass("ui-state-hover");
		});
    },
    show: function () {
        if (this.toolbar && this.visibility == 'auto') {
            this.toolbar.stop(true, true).fadeIn('slow');
        }
    },
    hide: function () {
        if (this.toolbar && this.visibility == 'auto') {
            this.toolbar.stop(true, true).fadeOut('slow');
        }
    }
}

/**
 * @class Chart.Marker 
 * 
 * Defines chart markers.
 *
 * Sample configuration:
 *
 *     var markersConfig = {
 *          size: 10,
 *          type: 'rectangle',
 *          strokeStyle: 'black',
 *          fillStyle: 'red',
 *          lineWidth: 1
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Markers' },
 *               series: [
 *                   {
 *                       type: 'line',
 *                       title: 'Line',
 *                       data: [['A', 56], ['B', 30], ['C', 62],
 *                              ['D', 65], ['E', 40], ['F', 36], ['D', 70]],
 *                       markers: {
 *                           size: 10,
 *                           type: 'rectangle',
 *                           strokeStyle: 'black',
 *                           fillStyle: 'red',
 *                           lineWidth: 1
 *                       }
 *                   }
 *               ]
 *           });
 *       });
 */
function Marker(options) {

    this.defaults = {

        lineCap: 'butt', // butt | round | square
        lineJoin: 'miter', // round | bevel | miter
        miterLimit: 10,
        /**
        * @cfg {Number} lineWidth
        * Specifies the border line width.
        */
        lineWidth: 1,
        /**
        * @cfg {Number} size
        * Specifies the marker diameter in pixels.
        */
        size: 8,
        /**
         * @cfg {Number} offset
         * Specifies the marker offset in pixels.
         */
        offset: 0,
        /**
        * @cfg {Number} linkLineWidth
        * Specifies the marker link line width.
        */
        linkLineWidth: 1,

        /**
         * @cfg {String} type
         * Specifies the marker type. Possible values are:
         *
         * * 'circle'
         * * 'rectangle'
         * * 'diamond'
         * * 'triangle'
         * * 'plus'         
         * * 'cross' 
         * * 'line'
         * * 'image'
         */
        type: 'circle'

        /**
         * @cfg {String} src
         * Specifies the image src when marker type is image.
         */

        /**
         * @cfg {String} linkLineStrokeStyle
         * Specifies the marker link line color.
         */

        /**
        * @cfg {String} strokeStyle
        * Specifies the marker border line color.
        */

        /**
        * @cfg {String/Common.Gradient} fillStyle
        * Specifies the marker fill style.
        */
    };

    this.setOptions(options);
}

Marker.prototype._setShapeSettings = function (shape) {
    // fill
    shape.fillStyle = this.fillStyle;

    // stroke
    shape.strokeStyle = this.strokeStyle;
    shape.lineWidth = this.lineWidth;
    shape.lineCap = this.lineCap;
    shape.lineJoin = this.lineJoin;
    shape.miterLimit = this.miterLimit;

    shape.shadowColor = this.shadowColor;
    shape.shadowBlur = this.shadowBlur;
    shape.shadowOffsetX = this.shadowOffsetX;
    shape.shadowOffsetY = this.shadowOffsetY;

    shape.cursor = this.cursor;
}

Marker.prototype._setLineSettings = function (line) {
    line.lineWidth = this.linkLineWidth;
    line.strokeStyle = this.linkLineStrokeStyle;
}

Marker.prototype.setOptions = function (options) {
    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);
}

Marker.prototype.getSize = function () {
    return { width: this.size, height: this.size };
}

Marker.prototype.getShape = function (x, y, r, imagePath, type) {

    if (this.visible === false) {
        return null;
    }

    var r2 = 2 * r;
    var shape = null;

    type = type || this.type;

    if (imagePath != null)
        type = 'image';

    switch (type) {
        case 'circle':
            shape = new Circle(x - r, y - r, r);
            break;
        case 'rectangle':
            shape = new Rectangle(x - r, y - r, r2, r2);
            break;
        case 'diamond':
            var pts = [];
            pts.push(x);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y);

            pts.push(x);
            pts.push(y + r);

            pts.push(x - r);
            pts.push(y);

            shape = new Polygon(pts);
            shape.isBoundsHitTest = true;
            break;
        case 'triangle':
            var pts = [];
            pts.push(x);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y + r);

            pts.push(x - r);
            pts.push(y + r);

            shape = new Polygon(pts);
            shape.isBoundsHitTest = true;
            break;
        case 'line':
            shape = new Line(x - r, y, x + r, y);
            break;
        case 'plus':
            var pts = [];
            pts.push(x - r);
            pts.push(y);

            pts.push(x + r);
            pts.push(y);

            pts.push(null);
            pts.push(null);

            pts.push(x);
            pts.push(y - r);

            pts.push(x);
            pts.push(y + r);

            shape = new Polyline(pts, true);
            break;
        case 'cross':
            var pts = [];
            pts.push(x - r);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y + r);

            pts.push(null);
            pts.push(null);

            pts.push(x - r);
            pts.push(y + r);

            pts.push(x + r);
            pts.push(y - r);

            shape = new Polyline(pts, true);
            break;
        case 'image':
            var src = imagePath || this.src;
            if (!src) {
                return null;
            }
            shape = new ImageShape(x, y, src);
            break;
    }

    if (shape) {
        shape.useHitTestArea = true;
        shape.center = {
            x: Math.round(x),
            y: Math.round(y)
        };
    }

    return shape;
}

Marker.prototype.prediktor_getShape = function (x, y, r, dataItem, type) {

    //if (this.visible === false) {
    //    return null;
    //}

    var r2 = 2 * r;
    var shape = null;

    switch (type) {
        case 'crossCircle':
            shape = new CrossCircle(x - r, y - r, r);
            break;
        case 'directionalArrow':
            // calculate triangle points based on x y r and rotateAngleOrImageUrl
            // before rotate
            //(x - r2,y - r) up left point
            //               (x,y) right center point 
            //(x - r2,y + r) bottom left point
            // point (x,y) is rotate axis
            //after rotate  (θ = rotateAngleOrImageUrl)
            //rcp = (x0,y0); ulp = (x0 + 2r cos(θ+π6/7)，y0 + 2r sin(θ+π6/7)); blp = (x0 + 2r cos(θ-π6/7)，y0 + 2r sin(θ-π6/7));
            //For coordinate system of screen or window, top corresponding 0 of y axis, left corresponding 0 of x axis
            //So looks like the arrows' rotation is to the opposite direction, but it's just the right direction in this coor. system.
            var pts = [];
            pts.push(x);
            pts.push(y);

            pts.push(x + r2 * Math.cos(dataItem[iArrowMarkerAngle]+2.9));
            pts.push(y + r2 * Math.sin(dataItem[iArrowMarkerAngle]+2.9));

            pts.push(x + r2 * Math.cos(dataItem[iArrowMarkerAngle]-2.9));
            pts.push(y + r2 * Math.sin(dataItem[iArrowMarkerAngle]-2.9));

            shape = new Polygon(pts);
            shape.isBoundsHitTest = true;
            break;
        case 'circle':
            shape = new Circle(x - r, y - r, r);
            break;
        case 'rectangle':
            shape = new Rectangle(x - r, y - r, r2, r2);
            break;
        case 'diamond':
            var pts = [];
            pts.push(x);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y);

            pts.push(x);
            pts.push(y + r);

            pts.push(x - r);
            pts.push(y);

            shape = new Polygon(pts);
            shape.isBoundsHitTest = true;
            break;
        case 'triangle':
            var pts = [];
            pts.push(x);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y + r);

            pts.push(x - r);
            pts.push(y + r);

            shape = new Polygon(pts);
            shape.isBoundsHitTest = true;
            break;
        case 'line':
            shape = new Line(x - r, y, x + r, y);
            break;
        case 'plus':
            var pts = [];
            pts.push(x - r);
            pts.push(y);

            pts.push(x + r);
            pts.push(y);

            pts.push(null);
            pts.push(null);

            pts.push(x);
            pts.push(y - r);

            pts.push(x);
            pts.push(y + r);

            shape = new Polyline(pts, true);
            break;
        case 'cross':
            var pts = [];
            pts.push(x - r);
            pts.push(y - r);

            pts.push(x + r);
            pts.push(y + r);

            pts.push(null);
            pts.push(null);

            pts.push(x - r);
            pts.push(y + r);

            pts.push(x + r);
            pts.push(y - r);

            shape = new Polyline(pts, true);
            break;
        case 'image':
            var src = dataItem[iImage] || this.src;
            if (!src) {
                return null;
            }
            shape = new ImageShape(x, y, src);
            break;
    }

    if (shape) {
        shape.useHitTestArea = true;
        shape.center = {
            x: Math.round(x),
            y: Math.round(y)
        };
    }

    return shape;
}

Marker.prototype.isVisible = function () {
    return this.visible !== false && this.type != 'none';
}

/**
 * @class Chart.GridLine
 *
 * Defines grid lines.
 *
 * Sample configuration:
 *
 *       var gridLinesConfig = {
 *          lineWidth: 2,
 *          strokeStyle: 'red',
 *          interval: 20
 *       } 
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *                title: { text: 'Grid Lines' },
 *                axes: [
 *                   {
 *                       location: 'left',
 *                       majorGridLines: {
 *                           lineWidth: 2,
 *                           strokeStyle: 'red',
 *                           interval: 20
 *                       },
 *                       minorGridLines: {
 *                           lineWidth: 1,
 *                           strokeStyle: 'green',
 *                           strokeDashArray: [2, 2],
 *                           interval: 5
 *                       }
 *                   }
 *               ],
 *               series: [
 *                   {
 *                       type: 'column',
 *                       data: [['A', 70], ['B', 40], ['C', 85], ['D', 50], ['E', 25], ['F', 40]]
 *                   }
 *               ]
 *           });
 *         });
 **/
function GridLine(options) {

    this.defaults = {
        /**
         * @cfg {String} strokeStyle
         * Specifies grid lines color.
         */
        strokeStyle: 'gray',
        /**
         * @cfg {Number} lineWidth
         * Specifies grid lines width.
         */
        lineWidth: 1,
        /**
         * @cfg {Boolean} visible
         * Specifies whether or not the grid lines should be displayed.
         */
        visible: true
        /**
         * @cfg {Number} interval
         * Specifies grid lines interval.
         */
    };

    this.setOptions(options);
}

GridLine.prototype._setLineSettings = function (line) {
    line.strokeStyle = this.strokeStyle;
    line.lineWidth = this.lineWidth;
    line.strokeDashArray = this.strokeDashArray;
}

GridLine.prototype.setOptions = function (options) {
    var settings = $.extend({}, this.defaults, options || {});
    $.extend(this, settings);
}

/**
 * @class Chart.PlotLine 
 * 
 * Defines axis plot line.
 *
 * Sample configuration:
 *
 *      var plotLineConfig = {
 *          lineWidth: 2,
 *          strokeStyle: 'green',
 *          value: 42,
 *          title: {
 *              text: 'Target 1',
 *              hAlign: 'right',
 *              fillStyle: 'green'
 *          }
 *      }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Plot Lines' },
 *               axes: [
 *                   {
 *                       location: 'left',
 *                       type: 'linear',
 *                       plotLines: [
 *                           {
 *                               lineWidth: 2,
 *                               strokeStyle: 'green',
 *                               value: 42,
 *                               zIndex : 0,
 *                               title: {
 *                                   text: 'Target 1',
 *                                   hAlign: 'right',
 *                                   fillStyle: 'green'
 *                               }
 *                           },
 *                           {
 *                               lineWidth: 2,
 *                               strokeStyle: 'red',
 *                               value: 72,
 *                               zIndex : 0,
 *                               title: {
 *                                   text: 'Target 2',
 *                                   hAlign: 'right',
 *                                   fillStyle: 'red'
 *                               }
 *                           }
 *                       ]
 *                   }
 *               ],
 *               series: [
 *                   {
 *                       type: 'column',
 *                       data: [['A', 70], ['B', 40], ['C', 85], 
 *                              ['D', 50], ['E', 25], ['F', 40]]
 *                   }
 *               ]
 *           });
 *       });
 */
function PlotLine(options) {

    this.defaults = {

        /**
        * @cfg {String} strokeStyle
        * Specifies the plot line color.
        */
        strokeStyle: 'gray',
        /**
         * @cfg {Number} lineWidth
         * Specifies the plot line width.
         */
        lineWidth: 1,

        /**
         * @cfg {Number} zIndex
         * Specifies the plot line z-index.
         * 
         * Possible values are:
         * 
         * * 0 - Plot line is rendered below the grid lines.
         * * 1 - Plot line is rendered above the grid lines and below the chart series.
         * * 2 - Plot line is rendered above the chart series.
         */
        zIndex : 0,

        /**
         * @cfg {String/Common.Title} title
         * Specifies the plot line title.
         */
        title: {
            margin: 2,
            hAlign: 'left',
            vAlign: 'top'
        }

        /**
         * @cfg {Number/Date} value
         * Specifies plot line value.
         */
    };

    this.setOptions(options);
}

PlotLine.prototype = {

    _setLineSettings: function (line) {
        line.strokeStyle = this.strokeStyle;
        line.lineWidth = this.lineWidth;
        line.strokeDashArray = this.strokeDashArray;
    },

    setOptions: function (options) {

        if (options != null && (typeof options.title == 'string')) {
            options.title = { text: options.title };
            $.extend(options.title, this.defaults.title);
        }

        var settings = $.extend(true, {}, this.defaults, options || {});
        $.extend(this, settings);
    }
}

/**
 * @class Chart.PlotBand 
 * 
 * Defines axis plot band.
 *
 * Sample configuration:
 *
 *      var plotBandConfig = {
 *          fillStyle: '#fcb441',
 *          from: 40,
 *          to: 60,
 *          zIndex : 0,
 *          title: 'Good'
 *      }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Plot Bands' },
 *               axes: [
 *                   {
 *                       location: 'left',
 *                       type: 'linear',
 *                       majorGridLines: { strokeDashArray: [1, 3] },
 *                       plotBands: [
 *                           {
 *                               fillStyle: '#fcb441',
 *                               from: 40,
 *                               to: 60,
 *                               zIndex : 0,
 *                               title: 'Good'
 *                           },
 *                           {
 *                               fillStyle: '#e0400a',
 *                               from: 60,
 *                               to: 70,
 *                               zIndex : 0,
 *                               title: 'Very Good'
 *                           }
 *                       ]
 *                   }
 *               ],
 *               series: [
 *                   {
 *                       type: 'column',
 *                       data: [['A', 45], ['B', 35], ['C', 68], 
 *                              ['D', 50], ['E', 5], ['F', 44]]
 *                   }
 *               ]
 *           });
 *       });
 */
function PlotBand(options) {

    this.defaults = {

        /**
         * @cfg {Number} lineWidth
         * Specifies the plot band border line width.
         */
        lineWidth: 0,
        /**
       * @cfg {String/Common.Gradient} fillStyle
       * Specifies the plot band fill style.
       */
        fillStyle: 'gray',

        /**
         * @cfg {Number} zIndex
         * Specifies the plot band z-index.
         * 
         * Possible values are:
         * 
         * * 0 - Plot band is rendered below the grid lines.
         * * 1 - Plot band is rendered above the grid lines and below the chart series.
         * * 2 - Plot band is rendered above the chart series.
         */
        zIndex: 0,

        /**
         * @cfg {String/Common.Title} title
         * Specifies the plot band title.
         */
        title: {
            margin: 2,
            hAlign: 'left',
            vAlign: 'top'
        }

        /**
        * @cfg {Number/Date} from
        * Specifies plot band from value.
        */

        /**
        * @cfg {Number/Date} to
        * Specifies plot band to value.
        */

        /**
        * @cfg {String} strokeStyle
        * Specifies the plot band border line color.
        */
    };

    this.setOptions(options);
}

PlotBand.prototype = {

    _setShapeSettings: function (line) {

        line.fillStyle = this.fillStyle;

        line.strokeStyle = this.strokeStyle;
        line.lineWidth = this.lineWidth;
        line.strokeDashArray = this.strokeDashArray;
    },

    setOptions: function (options) {

        if (options != null && (typeof options.title == 'string')) {
            options.title = { text: options.title };
            $.extend(options.title, this.defaults.title);
        }

        var settings = $.extend(true, {}, this.defaults, options || {});
        $.extend(this, settings);
    }
}

/**
 * @class Chart.Legend 
 * 
 * Defines a chart legend. It contains visual appearance, position and content properties. 
 *
 * Sample configuration:
 *
 *     var legendConfig = {
 *        visible: true,
 *        title: {
 *            text: 'Legend Title',
 *            font: '14px sans-serif',
 *            fillStyle: 'red'
 *        },
 *        border: {
 *            lineWidth: 2,
 *            strokeStyle: 'green'
 *        },
 *        font: '12px sans-serif',
 *        textFillStyle: '#418CF0',
 *        background: '#eeeeee',
 *        margin: 10
 *     }
 *
 * Example usage:
 *
 *         @example
 *         $(document).ready(function () {
 *           $('#selector').jqChart({
 *               title: { text: 'Chart Legend' },
 *               legend: {
 *                   visible: true,
 *                   allowHideSeries: true,
 *                   location : 'right',
 *                   title: {
 *                       text: 'Legend Title',
 *                       font: '14px sans-serif',
 *                       fillStyle: 'red'
 *                   },
 *                   border: {
 *                       lineWidth: 2,
 *                       strokeStyle: 'green'
 *                   },
 *                   font: '12px sans-serif',
 *                   textFillStyle: '#418CF0',
 *                   background: '#eeeeee',
 *                   margin: 10
 *               },
 *               series: [
 *                  {
 *                      title: 'Series Title 1',
 *                      type: 'column',
 *                      data: [['A', 70], ['B', 40], ['C', 85],
 *                             ['D', 50], ['E', 25], ['F', 40]]
 *                  },
 *                  {
 *                      title: 'Series Title 2',
 *                      type: 'column',
 *                      data: [['A', 67], ['B', 25], ['C', 11],
 *                             ['D', 18], ['E', 44], ['F', 14]]
 *                  }
 *               ]
 *           });
 *         });
 */
function Legend(options) {

    this.defaults = {
        /**
         * @cfg {String} location
         * Specifies the legend location -  'right', 'bottom', 'left' or 'top'.
         */
        location: 'right',
        /**
         * @cfg {String/Common.Title} title
         * Specifies the legend title.
         */
        title: {
            text: undefined,
            margin: 0
        },
        /**
         * @cfg {Common.Border} border
         * Specifies the legend border.
         */
        border: {
            padding: 2,
            strokeStyle: 'gray',
            cornerRadius: 6
        },

        /**
         * @cfg {Number} margin
         * Specifies the legend margin.
         */
        margin: 4,
        /**
        * @cfg {Boolean} visible
        * Specifies whether or not the legend should be displayed.
        */
        visible: true,

        /**
         * @cfg {String} font
         * Specifies the legend font.
         */
        font: '12px sans-serif',
        /**
        * @cfg {Number} textLineWidth
        * Specifies legend items text border line width.
        */
        textLineWidth: 0,

        /**
         * @cfg {Number} inactiveTextLineWidth
         * Specifies legend items text border line width.
         */
        inactiveTextLineWidth: 0,

        /**
          * @cfg {Number} itemsHorMargin
          * Specifies the horizontal margin between legend items.
          */
        itemsHorMargin: 4,

        /**
          * @cfg {Number} itemsVerMargin
          * Specifies the vertical margin between legend items.
          */
        itemsVerMargin: 0,

        /**
        * @cfg {Boolean} allowHideSeries
        * Specifies whether or not the series can be hide from the legend.
        */
        allowHideSeries: true,

        /**
        * @cfg {String} itemsCursor
        * Specifies legend items cursor.
        */

        /**
        * @cfg {Chart.LegendItem[]} customItems
        * Specifies an array of custom legend items.
        */

        /**
         * @cfg {String/Common.Gradient} background
         * Specifies the background fill style of the legend.
         */

        /**
        * @cfg {String} textStrokeStyle
        * Specifies legend items text border color.
        */

        /**
        * @cfg {String} textFillStyle
        * Specifies legend items text color.
        */

        /**
        * @cfg {String} inactiveTextStrokeStyle
        * Specifies legend items text border color.
        */

        /**
        * @cfg {String} inactiveTextFillStyle
        * Specifies legend items text color.
        */
        inactiveTextFillStyle: 'gray',
        /**
        * @cfg {String} inactiveFillStyle
        * Specifies legend items fill style.
        */
        inactiveFillStyle: 'gray',
        /**
        * @cfg {String} inactiveStrokeStyle
        * Specifies legend items fill style.
        */
        inactiveStrokeStyle: 'gray'
    };

    this.setOptions(options);
}

Legend.prototype._isHorizontal = function () {
    if (this.location == 'top' || this.location == 'bottom') {
        return true;
    }

    return false;
}

Legend.prototype._init = function () {

    this.items = [];

    if (this.visible == false) {
        return;
    }

    if (this.customItems) {
        for (var i = 0; i < this.customItems.length; i++) {

            var opt = this.customItems[i];

            if (opt != null && (typeof opt.text == 'string')) {
                opt.text = { text: opt.text };
            }

            var defOptions = { marker: { type: 'rectangle', fillStyle: '#418CF0' } };
            opt = $.extend(true, {}, defOptions, opt || {});

            var marker = new Marker(opt.marker);
            opt.marker = marker;

            var newOpt = {};
            $.extend(newOpt, opt);
            newOpt.text = opt.text.text;
            newOpt.font = opt.text.font || '12px sans-serif';
            newOpt.textFillStyle = opt.text.fillStyle || 'black';
            newOpt.textStrokeStyle = opt.text.strokeStyle;
            newOpt.textLineWidth = opt.text.lineWidth;
            newOpt.context = {
                chart: this.chart,
                title: newOpt.text
            };
            newOpt.cursor = newOpt.cursor || this.itemsCursor;

            var legendItem = new LegendItem(newOpt);
            legendItem.chart = this.chart;

            this.items.push(legendItem);
        }
    }
    else {

        var cursor = this.itemsCursor;
        if (this.allowHideSeries) {
            cursor = cursor || 'pointer';
        }

        var itemOptions = {
            font: this.font,
            textStrokeStyle: this.textStrokeStyle,
            textFillStyle: this.textFillStyle,
            textLineWidth: this.textLineWidth,
            cursor: cursor,

            inactiveTextFillStyle: this.inactiveTextFillStyle,
            inactiveTextStrokeStyle: this.inactiveTextStrokeStyle,
            inactiveTextLineWidth: this.inactiveTextLineWidth,

            inactiveFillStyle: this.inactiveFillStyle,
            inactiveStrokeStyle: this.inactiveStrokeStyle
        };

        var series = this.chart.series.items;

        for (var i = 0; i < series.length; i++) {
            var ser = series[i];

            if (!ser.visible) {
                continue;
            }

            $.merge(this.items, ser._getLegendItems(itemOptions));
        }
    }
}

Legend.prototype._measure = function () {

    if (this.visible == false) {
        this.width = 0;
        this.height = 0;
        return;
    }

    var paddings = this.paddings = this.border.getPaddings();

    this.title._measure();

    var w = this.title.width;
    var h = this.title.height;

    if (this.title.text) {
        h += paddings.top;
    }

    var isHorizontal = this._isHorizontal();

    var itemsHorMargin = this.itemsHorMargin;
    var itemsVerMargin = this.itemsVerMargin;

    var itemsWidth = 0;
    var itemsHeight = 0;

    var maxItemWidth = 0;

    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        item._measure();

        if (isHorizontal) {
            itemsWidth += item.width;

            if (i > 0) {
                itemsWidth += itemsHorMargin;
            }

            itemsHeight = Math.max(itemsHeight, item.height);
            maxItemWidth = Math.max(maxItemWidth, item.width + itemsHorMargin);
        }
        else {
            itemsWidth = Math.max(itemsWidth, item.width);
            itemsHeight += item.height;

            if (i > 0) {
                itemsHeight += itemsVerMargin;
            }
        }
    }

    var offsetW = 2 * this.margin + paddings.left + paddings.right;
    var offsetH = 2 * this.margin + paddings.top + paddings.bottom;

    var chartPaddings = this.chart.border.getPaddings();

    var maxWidth = this.chart._width - chartPaddings.left - chartPaddings.right - offsetW;
    if (isHorizontal && itemsWidth > maxWidth) {

        var rows = Math.floor(maxWidth / maxItemWidth) || 1;
        var columns = Math.ceil(this.items.length / rows);

        this.rows = rows;
        this.cellHeight = itemsHeight + itemsHorMargin;
        this.cellWidth = maxItemWidth;

        itemsWidth = rows * maxItemWidth;
        itemsHeight = columns * itemsHeight + (columns - 1) * itemsHorMargin;
    }
    else {
        this.rows = 0;
    }

    w = Math.max(w, itemsWidth);
    h += itemsHeight;

    this.width = this.isCustomWidth || (w + offsetW);
    this.height = this.isCustomHeight || (h + offsetH);
}

Legend.prototype._arrange = function () {

    if (this.visible == false) {
        return;
    }

    var x = this.x + this.margin;
    var y = this.y + this.margin;

    var l = 2 * this.margin;

    this.border.x = x;
    this.border.y = y;

    var w = this.width - l;

    this.border.width = w;
    this.border.height = this.height - l;

    var paddings = this.paddings;

    w -= paddings.left + paddings.right;

    x += paddings.left;
    y += paddings.top;

    if (this.title.text) {

        this.title.x = x + (w - this.title.width) / 2;
        this.title.y = y;

        y += this.title.height + paddings.top;
    }

    var isHorizontal = this._isHorizontal();

    var rows = this.rows;

    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];

        item.x = x;
        item.y = y;

        if (isHorizontal) {

            if (rows) {
                item.x += (i % rows) * this.cellWidth;
                item.y += Math.floor(i / rows) * this.cellHeight;
            }
            else {
                x += item.width + this.itemsHorMargin;
            }
        }
        else {
            y += item.height + this.itemsVerMargin;
        }

        item._arrange();
    }
}

Legend.prototype._render = function (shapes) {

    if (this.visible == false) {
        return [];
    }

    this.border._render(shapes);
    this.title._render(shapes);

    var contextShapes = [];

    for (var i = 0; i < this.items.length; i++) {

        var item = this.items[i];
        var contextItemShapes = item._render(shapes);
        $.merge(contextShapes, contextItemShapes);
    }

    return contextShapes;
}

Legend.prototype._handleEvent = function (name, shape) {

    if (!this.allowHideSeries) {
        return;
    }

    var context = shape.context;
    var series = context.series;
    var chart = context.chart;

    if (!series) {
        return;
    }

    switch (name) {
        case "MouseDown":
        case "TouchEnd":
            series._hideFromLegend(context);
            // chart.partialDelayedUpdate();
            var mouseInput = chart.mouseInput;
            chart.update();
            chart._processMouseEvents();
            break;
    }
}

Legend.prototype.setOptions = function (options) {

    if (options != null && (typeof options.title == 'string')) {
        options.title = { text: options.title };
        $.extend(options.title, this.defaults.title);
    }

    var settings = $.extend(true, {}, this.defaults, options || {});
    $.extend(this, settings);
    this.margin = settings.margin;

    if (options) {
        this.isCustomWidth = options.width;
        this.isCustomHeight = options.height;
    }

    this.border = new Border(settings.border);
    this.border.fillStyle = this.background || this.border.fillStyle;

    this.title = new Title(settings.title);
    this.title.chart = this.chart;
}


/**
 * @class Chart.LegendItem 
 * 
 */
function LegendItem(options) {

    this.defaults = {
        /**
         * @cfg {String} font
         * Specifies the legend item font.
         */
        font: '12px sans-serif',
        /**
         * @cfg {String} textFillStyle
         * Specifies legend item text color.
         */
        textFillStyle: 'black',
        
        /**
         * @cfg {Number} textLineWidth
         * Specifies legend item text border line width.
         */
        textLineWidth: 0
        /**
         * @cfg {Chart.Marker} marker
         * Specifies legend item marker.
         */

        /**
         * @cfg {String} textStrokeStyle
         * Specifies legend item text border color.
         */
    };

    this.lblMargin = 4;

    this.setOptions(options);
}

LegendItem.prototype._measure = function () {
    var size;

    if (this.text) {
        size = this.textBlock.measure(this.chart.ctx);
    }
    else {
        size = { width: 0, height: 0 };
    }

    this.width = size.width + this.marker.size + this.lblMargin;
    this.height = size.height;
}

LegendItem.prototype._arrange = function () {
    var r = this.marker.size / 2;
    var x = this.x + r;
    var y = this.y + r + (this.height - this.marker.size) / 2;

    this.markerShape = this.marker.getShape(x, y, r);

    if (this.markerShape) {
        this.marker._setShapeSettings(this.markerShape);
        this.markerShape.context = this.context;
        this.markerShape.cursor = this.cursor;
        this.markerShape.isLegendItem = true;
    }

    this.textBlock.x = this.x + this.marker.size + this.lblMargin;
    this.textBlock.y = this.y;
}

LegendItem.prototype._render = function (shapes) {

    var elems = [];

    if (this.markerShape) {
        elems.push(this.markerShape);
    }

    if (this.textBlock) {
        elems.push(this.textBlock);
    }

    $.merge(shapes, elems);

    return elems;
}

LegendItem.prototype.setOptions = function (options) {

    var settings = $.extend(false, {}, this.defaults, options || {});
    $.extend(this, settings);

    // init text block
    this.textBlock = new TextBlock(this.text);
    this.textBlock.textBaseline = 'top';
    this.textBlock.font = this.font;

    this.textBlock.fillStyle = this.textFillStyle;
    this.textBlock.strokeStyle = this.textStrokeStyle;
    this.textBlock.lineWidth = this.textLineWidth;

    this.textBlock.cursor = this.cursor;
    this.textBlock.context = this.context;
    this.textBlock.isLegendItem = true;
}


/**
 * @class Chart.GridArea 
 * 
 */
function GridArea(chart) {
    this.chart = chart;

    this.border = new Border();
    // this.border.fillStyle = 'yellow';
    this.border.cornerRadius = 0;
    this.border.lineWidth = 0;

    this.isMouseOver = false;
}

GridArea.prototype._arrange = function () {
    var x = this.x;
    var y = this.y;

    // arrange border
    this.border.x = x;
    this.border.y = y;
    this.border.width = this.width;
    this.border.height = this.height;

    this._arrangeRenderer(this.chart.areaRenderer);
    this._arrangeRenderer(this.chart.hlRenderer);
}

GridArea.prototype._arrangeRenderer = function (renderer) {
    if (!CanvasControl.use_excanvas) {
        return;
    }

    var x = this.x;
    var y = this.y;

    // arrange area canvas
    var canvas = renderer.canvas;
    var div = renderer.div;

    var w = Math.max(this.width, 0);
    var h = Math.max(this.height, 0);

    div.css({ left: x, top: y, width: w, height: h });

    canvas.width = w;
    canvas.height = h;

    renderer.offsetX = -x;
    renderer.offsetY = -y;
}

GridArea.prototype._renderZIndex = function (shapes, zIndex) {
    var texts = this._renderPlots(shapes, zIndex);
    $.merge(shapes, texts);
}

GridArea.prototype._render = function (shapes) {

    this.border.fillStyle = this.fillStyle;

    this.border._render(shapes);
    var texts = this._renderPlots(shapes, 0);
    this._renderGridLines(shapes);
    $.merge(shapes, texts);

    this._renderZIndex(shapes, 1);
}

GridArea.prototype._renderSeries = function (shapes) {
    var series = this.chart.series.items;

    var postShapes = [];

    for (var i = 0; i < series.length; i++) {
        var ser = series[i];
        if (!ser.notInGridArea) {
            var postSerShapes = ser._render(shapes);
            if (postSerShapes) {
                $.merge(postShapes, postSerShapes);
            }
        }
    }

    return postShapes;
}

GridArea.prototype._renderStripes = function (shapes) {
    var axes = this.chart.axes.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];

        // add stripes
        var stripes = this._getStripes(axis);
        $.merge(shapes, stripes);
    }
}

GridArea.prototype._renderPlots = function (shapes, zIndex) {

    var texts = [];

    var axes = this.chart.axes.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];

        // add plot bands
        var plotBands = this._getPlotBands(axis, zIndex);
        if (plotBands) {
            $.merge(shapes, plotBands.shapes);
            $.merge(texts, plotBands.texts);
        }
        // add plot lines
        var plotLines = this._getPlotLines(axis, zIndex);
        if (plotLines) {
            $.merge(shapes, plotLines.shapes);
            $.merge(texts, plotLines.texts);
        }
    }

    return texts;
}

GridArea.prototype._renderGridLines = function (shapes) {
    var axes = this.chart.axes.items;

    for (var i = 0; i < axes.length; i++) {
        var axis = axes[i];

        var majorGridLines = axis.majorGridLines;
        if (majorGridLines == null && axis.getOrientation() == 'y') {
            majorGridLines = new GridLine();

            if (axis.minorGridLines != null) {
                axis.minorGridLines.major = majorGridLines;
            }
        }

        var minor = this._getGridLines(axis, axis.minorGridLines, false);
        $.merge(shapes, minor);

        var major = this._getGridLines(axis, majorGridLines, true);
        $.merge(shapes, major);
    }
}

GridArea.prototype._getStripes = function (axis) {

    var stripes = axis.stripes;

    if (stripes == null || $.isArray(stripes) != true) {
        return [];
    }

    var gArea = this;

    var shapes = [];

    $.each(stripes, function () {

        var stripe = new Stripe(this);

        var intr;

        if (stripe.interval) {
            intr = stripe.interval;
        }
        else {
            intr = 2 * axis.actualInterval;
        }

        var width;

        if (stripe.width) {
            width = stripe.width;
        }
        else {
            width = axis.actualInterval;
        }

        var lineWidth = stripe.lineWidth;
        var lw2 = lineWidth / 2;

        var intrs = axis._getIntervals(intr, stripe, true);

        for (var i = 0; i < intrs.length; i++) {
            var val = intrs[i];

            if (val >= axis.actualVisibleMaximum) {
                continue;
            }

            var pos1 = axis.getPosition(val);

            var next = axis._getNextPosition(val, width);
            var pos2 = axis.getPosition(next);

            var rect;

            if (axis.isAxisVertical) {
                rect = new Rectangle(gArea.x + lw2, Math.min(pos1, pos2), gArea.width - lineWidth, Math.abs(pos2 - pos1));
            }
            else {
                rect = new Rectangle(Math.min(pos1, pos2), gArea.y + lw2, Math.abs(pos2 - pos1), gArea.height - lineWidth);
            }

            stripe._setSettings(rect);
            shapes.push(rect);
        }
    });

    return shapes;
}

GridArea.prototype._getGridLines = function (axis, mark, major) {
    if (axis.location == 'radial' || mark == null || mark.visible != true) {
        return [];
    }

    var shapes = [];

    var intr = axis._getMarkInterval(mark, major);

    var intrs = axis._getIntervals(intr, mark, major);

    var x1, y1, x2, y2;

    for (var i = 0; i < intrs.length; i++) {

        var pos = axis.getPosition(intrs[i]);

        if (axis.isAxisVertical) {
            y1 = y2 = pos;
            x1 = this.x;
            x2 = x1 + this.width;
        }
        else {
            x1 = x2 = pos;
            y1 = this.y;
            y2 = y1 + this.height;
        }

        var line = new Line(x1, y1, x2, y2);
        mark._setLineSettings(line);
        shapes.push(line);
    }

    return shapes;
}

GridArea.prototype._getPlotLines = function (axis, zIndex) {

    var plotLines = axis.plotLines;

    if (plotLines == null || $.isArray(plotLines) != true) {
        return null;
    }

    var gArea = this;

    var shapes = [];
    var texts = [];

    for (var i = 0; i < plotLines.length; i++) {

        var plotLine = new PlotLine();
        if (!axis.isAxisVertical) {
            plotLine.defaults.title.hAlign = 'right';
        }

        plotLine.setOptions(plotLines[i]);

        if (jMath.isNull(plotLine.value)) {
            continue;
        }

        if (jMath.fitInRange(plotLine.zIndex, 0, 2) != zIndex) {
            continue;
        }

        var lineWidth = plotLine.lineWidth / 2;

        var pos = axis.getPosition(plotLine.value);

        var title = new Title(plotLine.title);
        title.chart = this.chart;
        title._measure();

        if (axis.isAxisVertical) {
            y1 = y2 = pos;
            x1 = this.x;
            x2 = x1 + this.width;

            title.x = x1;
            title.y = y1;

            switch (title.hAlign) {
                case 'center':
                    title.x = gArea.x + (gArea.width - title.width) / 2;
                    break;
                case 'right':
                    title.x = gArea.x + gArea.width - title.width;
                    break;
            }

            switch (title.vAlign) {
                case 'bottom':
                    title.y += lineWidth;
                    break;
                case 'center':
                    title.y -= title.height / 2;
                    break;
                case 'top':
                    title.y -= title.height + lineWidth;
                    break;
            }
        }
        else {
            x1 = x2 = pos;
            y1 = this.y;
            y2 = y1 + this.height;

            title.x = x1;
            title.y = y1;

            switch (title.hAlign) {
                case 'right':
                    title.x += lineWidth;
                    break;
                case 'center':
                    title.x -= title.height / 2;
                    break;
                case 'left':
                    title.x -= title.height + lineWidth;
                    break;
            }

            switch (title.vAlign) {
                case 'center':
                    title.y += (gArea.height - title.width) / 2;
                    break;
                case 'bottom':
                    title.y += gArea.height - title.width;
                    break;
            }

            title.rotX = title.x + title.height - title.margin;
            title.rotY = title.y + title.margin;

            title.rotationAngle = jMath.radians(90);
        }

        var line = new Line(x1, y1, x2, y2);
        plotLine._setLineSettings(line);
        shapes.push(line);

        title._render(texts);
    };

    return { shapes: shapes, texts: texts };
}

GridArea.prototype._getPlotBands = function (axis, zIndex) {

    var plotBands = axis.plotBands;

    if (plotBands == null || $.isArray(plotBands) != true) {
        return null;
    }

    var gArea = this;

    var shapes = [];
    var texts = [];

    for (var i = 0; i < plotBands.length; i++) {

        var plotBand = new PlotBand();
        if (!axis.isAxisVertical) {
            plotBand.defaults.title.hAlign = 'right';
        }

        plotBand.setOptions(plotBands[i]);

        if (jMath.isNull(plotBand.from) || jMath.isNull(plotBand.to)) {
            continue;
        }

        if (jMath.fitInRange(plotBand.zIndex, 0, 2) != zIndex) {
            continue;
        }

        var lineWidth = plotBand.lineWidth;
        var lw2 = lineWidth / 2;

        var pos1 = axis.getPosition(plotBand.from);
        var pos2 = axis.getPosition(plotBand.to);

        var x, y, w, h;

        if (axis.isAxisVertical) {
            x = gArea.x + lw2;
            y = Math.min(pos1, pos2);
            w = gArea.width - lineWidth;
            h = Math.abs(pos2 - pos1);
        }
        else {
            x = Math.min(pos1, pos2);
            y = gArea.y + lw2;
            w = Math.abs(pos2 - pos1);
            h = gArea.height - lineWidth;
        }

        var rect = new Rectangle(x, y, w, h);

        plotBand._setShapeSettings(rect);
        shapes.push(rect);

        var title = new Title(plotBand.title);
        title.chart = this.chart;
        title._measure();

        if (axis.isAxisVertical) {
            title.x = x;
            title.y = y;

            switch (title.hAlign) {
                case 'center':
                    title.x += (w - title.width) / 2;
                    break;
                case 'right':
                    title.x += w - title.width;
                    break;
            }

            switch (title.vAlign) {
                case 'center':
                    title.y += (h - title.height) / 2;
                    break;
                case 'bottom':
                    title.y += h - title.height;
                    break;
            }
        }
        else {

            title.x = x;
            title.y = y;

            switch (title.hAlign) {
                case 'center':
                    title.x += (w - title.height) / 2;
                    break;
                case 'right':
                    title.x += w - title.height;
                    break;
            }

            switch (title.vAlign) {
                case 'center':
                    title.y += (h - title.width) / 2;
                    break;
                case 'bottom':
                    title.y += h - title.width;
                    break;
            }

            title.rotX = title.x + title.height - title.margin;
            title.rotY = title.y + title.margin;

            title.rotationAngle = jMath.radians(90);
        }

        title._render(texts);
    };

    return { shapes: shapes, texts: texts };
}

GridArea.prototype._contains = function (x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
}

GridArea.prototype.getRight = function () {
    return this.x + this.width;
}

GridArea.prototype.fitHor = function (x) {
    return jMath.fitInRange(x, this.x, this.getRight());
}

GridArea.prototype.fitVer = function (y) {
    return jMath.fitInRange(y, this.y, this.y + this.height);
}

/**
 * @class Chart.Series.SeriesArray 
 *
 */ 
function SeriesArray(chart, options) {
    this.chart = chart;

    if (options) {
        this.setOptions(options);
    }
}

SeriesArray.prototype.setOptions = function (options) {
    this.items = [];

    if ($.isArray(options) == false) {
        return;
    }

    for (var i = 0; i < options.length; i++) {

        var op = options[i];
        if (op == null) {
            continue;
        }

        var series;

        var cType = op.type || 'column';
        cType = cType.toLowerCase();

        switch (cType) {
            case 'area':
                series = new AreaSeries(op);
                break;
            case 'splinearea':
                series = new SplineAreaSeries(op);
                break;
            case 'bar':
                series = new BarSeries(op);
                break;
            case 'bubble':
                series = new BubbleSeries(op);
                break;
            case 'line':
                series = new LineSeries(op);
                break;
            case 'stepline':
                series = new StepLineSeries(op);
                break;
            case 'steparea':
                series = new StepAreaSeries(op);
                break;
            case 'spline':
                series = new SplineSeries(op);
                break;
            case 'pie':
                series = new PieSeries(op);
                break;
        	case 'donut':
        	case 'doughnut':
        		series = new DoughnutSeries(op);
        		break;
            case 'scatter':
                series = new ScatterSeries(op);
                break;
            case 'stackedcolumn':
                series = new StackedColumnSeries(op);
                break;
            case 'stackedbar':
                series = new StackedBarSeries(op);
                break;
            case 'stacked100column':
                series = new Stacked100ColumnSeries(op);
                break;
            case 'stacked100bar':
                series = new Stacked100BarSeries(op);
                break;
            case 'rangecolumn':
                series = new RangeColumnSeries(op);
                break;
            case 'rangebar':
                series = new RangeBarSeries(op);
                break;

            case 'gantt':
                series = new GanttSeries(op);
                break;

            case 'stock':
                series = new StockSeries(op);
                break;
            case 'candlestick':
                series = new CandlestickSeries(op);
                break;
            case 'radar':
            case 'radarline':
                series = new RadarLineSeries(op);
                break;
            case 'radararea':
                series = new RadarAreaSeries(op);
                break;
            case 'radarspline':
                series = new RadarSplineSeries(op);
                break;
            case 'radarsplinearea':
                series = new RadarSplineAreaSeries(op);
                break;

            case 'polar':
            case 'polarline':
                series = new PolarLineSeries(op);
                break;
            case 'polararea':
                series = new PolarAreaSeries(op);
                break;
            case 'polarspline':
                series = new PolarSplineSeries(op);
                break;
            case 'polarsplinearea':
                series = new PolarSplineAreaSeries(op);
                break;
            case 'polarscatter':
                series = new PolarScatterSeries(op);
                break;

            case 'trendline':
                series = new TrendlineSeries(op);
                break;

            case 'verticalline':
                series = new VertLineSeries(op);
                break;
            case 'verticalspline':
                series = new VertSplineSeries(op);
                break;
            case 'verticalarea':
                series = new VertAreaSeries(op);
                break;
            case 'verticalsplinearea':
                series = new VertSplineAreaSeries(op);
                break;

            case 'range':
                series = new RangeSeries(op);
                break;
            case 'splinerange':
                series = new SplineRangeSeries(op);
                break;

            case 'stackedline':
                series = new StackedLineSeries(op);
                break;
            case 'stackedspline':
                series = new StackedSplineSeries(op);
                break;
            case 'stacked100line':
                series = new Stacked100LineSeries(op);
                break;
            case 'stacked100spline':
                series = new Stacked100SplineSeries(op);
                break;

            case 'stackedarea':
                series = new StackedAreaSeries(op);
                break;
            case 'stackedsplinearea':
                series = new StackedSplineAreaSeries(op);
                break;
            case 'stacked100area':
                series = new Stacked100AreaSeries(op);
                break;
            case 'stacked100splinearea':
                series = new Stacked100SplineAreaSeries(op);
                break;

            case 'column':
            default:
                series = new ColumnSeries(op);
        }

        series.type = cType;
        series.chart = this.chart;
        this.items.push(series);
    }

    this._processData();
}

SeriesArray.prototype._processData = function () {
    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];
        if (ser.visible) {
            ser._processData();
        }
    }
}

SeriesArray.prototype._initData = function () {
    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];
        if (ser.isInScene()) {
            ser._initData();
        }
    }
}

SeriesArray.prototype._initVisibleData = function () {
    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];
        if (ser.isInScene()) {
            ser._initVisibleData();
        }
    }
}

SeriesArray.prototype._initCategories = function () {
    var categories = [];
    var length = 0;
    var j = 0;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];

        if (!ser.isInScene() || !ser.categories) {
            continue;
        }

        for (j = length; j < ser.categories.length; j++) {

            var cat = ser.categories[j];

            categories.push(cat);
        }

        length = j;
    }

    this.categories = categories;
}

SeriesArray.prototype._initRanges = function () {
    var min = maxVl;
    var max = minVl;

    var minX = maxVl;
    var maxX = minVl;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];
        if (!ser.isInScene()) {
            continue;
        }

        if (min > ser.min) {
            min = ser.min;
        }

        if (max < ser.max) {
            max = ser.max;
        }

        if (minX > ser.minX) {
            minX = ser.minX;
        }

        if (maxX < ser.maxX) {
            maxX = ser.maxX;
        }
    }

    this.min = min;
    this.max = max;

    this.minX = minX;
    this.maxX = maxX;
}

SeriesArray.prototype._findClusters = function (series, seriesType) {
    var index = -1;
    var count = 0;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {
        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        if (ser == series) {
            index = count;
        }

        if (ser.type == seriesType) {
            count++;
        }
    }

    return { index: index, count: count };
}

SeriesArray.prototype._findStackedClusters = function (series, seriesType) {

    var groupName = series.stackedGroupName;

    var groups = this._getStackedGroupsFromType(seriesType);

    var groupIndex = $.inArray(groupName, groups);
    var groupCount = groups.length;

    var index = -1;
    var count = 0;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {
        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        if (ser == series) {
            index = count;
        }

        if (ser.type == seriesType && ser.stackedGroupName == groupName) {
            count++;
        }
    }

    return {
        index: index,
        count: count,
        groupIndex: groupIndex,
        groupCount: groupCount
    };
}

SeriesArray.prototype._getSeriesFromType = function (seriesType) {
    var newSeries = [];

    var items = this.items;

    for (var i = 0; i < items.length; i++) {
        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        if (ser.type == seriesType) {
            newSeries.push(ser);
        }
    }

    return newSeries;
}

SeriesArray.prototype._getStackedSeriesFromType = function (seriesType, groupName) {
    var newSeries = [];

    var items = this.items;

    for (var i = 0; i < items.length; i++) {
        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        if (ser.type == seriesType && ser.stackedGroupName == groupName) {
            newSeries.push(ser);
        }
    }

    return newSeries;
}

SeriesArray.prototype._getStackedGroupsFromType = function (seriesType) {
    var groups = [];

    $.each(this.items, function () {

        if (this.isInScene() && this.type == seriesType) {

            var index = $.inArray(this.stackedGroupName, groups);
            if (index == -1) {
                groups.push(this.stackedGroupName);
            }
        }

    });

    return groups;
}

SeriesArray.prototype._initColors = function () {
    var palette = this.chart.paletteColors;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];
        ser._initColors(palette.getColor(i), palette);
    }
}

SeriesArray.prototype._getPixelMargins = function (axis) {

    var maxLeft = 0;
    var maxRight = 0;

    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        var margin = ser._getPixelMargins(axis);
        maxLeft = Math.max(maxLeft, margin.left);
        maxRight = Math.max(maxRight, margin.right);
    }

    return { left: maxLeft, right: maxRight };
}

SeriesArray.prototype._isAnchoredToOrigin = function () {

    var items = this.items;
    for (var i = 0; i < items.length; i++) {
        var ser = items[i];

        if (!ser.isInScene()) {
            continue;
        }

        if (ser._isAnchoredToOrigin()) {
            return true;
        }
    }

    return false;
}

SeriesArray.prototype._render = function (shapes) {
    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];

        if (!ser.visible) {
            continue;
        }

        if (ser.notInGridArea) {
            ser._render(shapes);
        }
    }
}

SeriesArray.prototype.getSeries = function (index) {
    return this.items[index];
}

SeriesArray.prototype.hasData = function () {
    var items = this.items;

    for (var i = 0; i < items.length; i++) {

        var ser = items[i];

        if (!ser.visible) {
            continue;
        }

        if (ser.hasRealData) {
            return true;
        }
    }

    return false;
};

/**
 * @class Chart.Series.Series 
 * 
 * Base chart series class.
 **/
function Series(options) {

	this.setOptions(options);
}

Series.prototype = {


	_getMarker: function (x, y, r, vl, imagePath, index, context) {
		if (r == null) {
			r = this.markers.size / 2.0;
		}

		var isEmptyData = this.hasNullValues && $.inArray(index, this.nullIndexes) != -1;
		var emptyMarker = this.emptyPointStyleObj.marker;
		var markerType;
		if (isEmptyData) {
			markerType = emptyMarker.visible ? emptyMarker.type : 'none';
			r = this.emptyPointStyleObj.marker.size / 2;
		}

		var marker;
        prediktor_codes:{
		    if (this.arrData[index][iMarkerType] != undefined && this.arrData[index][iMarkerType] != null) {
		        if (this.arrData[index][iMarkerRadius] == undefined && this.arrData[index][iMarkerRadius] == null) {
		            r = 4;
		        }
		        else {
		            r = this.arrData[index][iMarkerRadius];
		        }
		        //markerRadius = 7;
		        //arrowMarkerAngle = 8;
		        //markerTypeIndex = 4;
		        
		        marker = this.markers.prediktor_getShape(x, y, r, this.arrData[index], this.arrData[index][iMarkerType]);
		    }
		    else {
		        marker = this.markers.getShape(x, y, r, imagePath, markerType);
		    }
        }
	    //marker = this.markers.getShape(x, y, r, imagePath, markerType); // this is jqchart's original code

		if (marker == null) {
			return null;
		}

		marker.context = context;

		this.markers._setShapeSettings(marker);
		this._setMarkerSettings(marker);

		if (isEmptyData) {
			$.extend(marker, this.emptyPointStyleObj.marker);
			context.isEmptyData = true;
		}

		return marker;
	},

	prediktor_getMarker: function (x, y, r, vl, dataItem, index, context) {
	    if (r == null) {
	        r = this.markers.size / 2.0;
	    }

	    var isEmptyData = this.hasNullValues && $.inArray(index, this.nullIndexes) != -1;
	    var emptyMarker = this.emptyPointStyleObj.marker;
	    var markerType;
	    if (isEmptyData) {
	        markerType = emptyMarker.visible ? emptyMarker.type : 'none';
	        r = this.emptyPointStyleObj.marker.size / 2;
	    }

	    var marker = this.markers.prediktor_getShape(x, y, r, dataItem, markerType);

	    if (marker == null) {
	        return null;
	    }

	    marker.context = context;

	    this.markers._setShapeSettings(marker);
	    this._setMarkerSettings(marker);

	    if (isEmptyData) {
	        $.extend(marker, this.emptyPointStyleObj.marker);
	        context.isEmptyData = true;
	    }

	    return marker;
	},

	_addMarker: function (x, y, r, vl, imagePath, index, context) {

		var pt = this._correctMarkerPosition(x, y, vl);

		var marker = this._getMarker(pt.x, pt.y, r, vl, imagePath, index, context);

		var offset = this.markers.offset;
		var line = null;

		if (offset) {
			line = new Line(x, y, pt.x, pt.y);
			this.markers._setLineSettings(line);
			this._setMarkerLinkLineSettings(line);
		}

		return {
			marker: marker,
			line: line,
			offset: pt.offset
		};
	},

	_correctMarkerPosition: function (x, y, vl) {
		var offset = this.markers.offset;

		if (offset) {
			var isTop = vl >= this.realYAxis.getCrossing();
			y = isTop ? y - offset : y + offset;
		}

		return { x: x, y: y, offset: offset };
	},

	_addMarkerAndLabel: function (markers, txtBlocks, x, y, i, length, vlX, vlY, lblOffset, context) {

		if (jMath.isNull(vlX) && !this.realXAxis.isValueVisible(i + 0.5)) {
			return;
		}

		if (!jMath.isNull(vlX) && !this.realXAxis.isValueVisible(vlX)) {
			return;
		}

		var mOffset = 0;

		var dataX = !jMath.isNull(vlX) ? vlX : i;

		if (!context) {
			context = {
				chart: this.chart,
				series: this,
				dataItem: this.arrData[i],
				index: i,
				x: this.realXAxis._getValue(dataX),
				y: vlY
			};
		}

		if (this.markers && this.markers.isVisible() && this.realYAxis.isValueVisible(vlY)) {
		    var imagePath = context.dataItem[iImage];

			var marker = this._addMarker(x, y, null, vlY, imagePath, i, context);
			if (marker.marker) {

				if (marker.line) {
					markers.push(marker.line);
				}

				markers.push(marker.marker);
				mOffset = this.markers.offset;

				this._addShapeAnimation(marker.marker, i, length);
			}
		}

		if (this.labels && this.labels.visible !== false) {

			var labelValue = this._getLabelValue(vlY, i);

			if (this.labels.valueType == 'percentage') {
				labelValue = context.percentage;
			}

			var tBlock = this._getDataPointLabel(vlY, x, y, lblOffset + mOffset, labelValue);

			tBlock.context = context;

			this.chart.elem.trigger('dataPointLabelCreating', tBlock);

			txtBlocks.push(tBlock);

			this._addShapeAnimation(tBlock, i, length);
		}
	},

	prediktor_addMarkerAndLabel: function (markers, txtBlocks, x, y, i, length, vlX, vlY, lblOffset, context) {

	    if (jMath.isNull(vlX) && !this.realXAxis.isValueVisible(i + 0.5)) {
	        return;
	    }

	    if (!jMath.isNull(vlX) && !this.realXAxis.isValueVisible(vlX)) {
	        return;
	    }

	    var mOffset = 0;

	    var dataX = !jMath.isNull(vlX) ? vlX : i;

	    if (!context) {
	        context = {
	            chart: this.chart,
	            series: this,
	            dataItem: this.arrData[i],
	            index: i,
	            x: this.realXAxis._getValue(dataX),
	            y: vlY
	        };
	    }

	    if (this.realYAxis.isValueVisible(vlY)) {
	        var imagePath = context.dataItem[iImage];

	        var marker = this._addMarker(x, y, null, vlY, imagePath, i, context);
	        if (marker.marker) {

	            if (marker.line) {
	                markers.push(marker.line);
	            }

	            markers.push(marker.marker);
	            mOffset = this.markers.offset;

	            this._addShapeAnimation(marker.marker, i, length);
	        }
	    }

	    if (this.labels && this.labels.visible !== false) {

	        var labelValue = this._getLabelValue(vlY, i);

	        if (this.labels.valueType == 'percentage') {
	            labelValue = context.percentage;
	        }

	        var tBlock = this._getDataPointLabel(vlY, x, y, lblOffset + mOffset, labelValue);

	        tBlock.context = context;

	        this.chart.elem.trigger('dataPointLabelCreating', tBlock);

	        txtBlocks.push(tBlock);

	        this._addShapeAnimation(tBlock, i, length);
	    }
	},

	_getAnimation: function () {

		return this.animation || this.chart.options.animation;

	},

	_addShapeAnimation: function (shape, i, len) {

		var anOptions = this._getAnimation();

		if (!anOptions || anOptions.enabled === false) {
			return;
		}

		var animation = new OptionAnimation(anOptions, shape, "visible", false, true);

		var duration = animation.duration / len;
		var delayTime = animation.delayTime + i * duration;

		animation.delayTime = delayTime;
		animation.duration = duration;
		this.chart.storyboard.addAnimation(animation);
	},

	_addLengthAnimation: function (polyline) {

		var anOptions = this._getAnimation();

		if (!anOptions || anOptions.enabled === false) {
			return;
		}

		var animation = new Animation(anOptions, polyline, "length", 0, polyline.getLength());
		this.chart.storyboard.addAnimation(animation);
	},

	_setMarkerSettings: function (marker) {

		marker.fillStyle = marker.fillStyle || this.fillStyle;
		marker.strokeStyle = marker.strokeStyle || this.strokeStyle;

		var options = this.options;

		if (!options.markers || jMath.isNull(options.markers.lineWidth)) {
			if (!jMath.isNull(options.lineWidth)) {
				marker.lineWidth = options.lineWidth;
			}
		}

		marker.cursor = marker.cursor || this.cursor;

		var shadows = this.chart.options.shadows;

		if (jMath.isNull(marker.shadowColor)) {
			marker.shadowColor = !jMath.isNull(this.shadowColor) ? this.shadowColor : shadows.shadowColor;
		}

		if (jMath.isNull(marker.shadowBlur)) {
			marker.shadowBlur = !jMath.isNull(this.shadowBlur) ? this.shadowBlur : shadows.shadowBlur;
		}

		if (jMath.isNull(marker.shadowOffsetX)) {
			marker.shadowOffsetX = !jMath.isNull(this.shadowOffsetX) ? this.shadowOffsetX : shadows.shadowOffsetX;
		}

		if (jMath.isNull(marker.shadowOffsetY)) {
			marker.shadowOffsetY = !jMath.isNull(this.shadowOffsetY) ? this.shadowOffsetY : shadows.shadowOffsetY;
		}
	},

	_setMarkerLinkLineSettings: function (line) {
		line.strokeStyle = line.strokeStyle || this.markers.strokeStyle || this.fillStyle;
	},

	_setShapeSettings: function (shape, index) {

		// fill
		if (this.fillStyles && !jMath.isNull(index)) {
			shape.fillStyle = this.fillStyles[index % this.fillStyles.length];
		}
		else {
			shape.fillStyle = this.fillStyle;
		}

		// stroke
		shape.strokeStyle = this.strokeStyle;
		shape.lineWidth = this.lineWidth;
		shape.lineCap = this.lineCap;
		shape.lineJoin = this.lineJoin;
		shape.miterLimit = this.miterLimit;
		shape.strokeDashArray = this.strokeDashArray;

		// shadows
		CanvasControl.setShadows(shape, this, this.chart);

		// cursor
		shape.cursor = this.cursor;

		// empty style
		shape.nullHandling = this.nullHandling;

		// set empty style
		if (shape.context && this.hasNullValues && $.inArray(index, this.nullIndexes) != -1) {
			$.extend(shape, this.emptyPointStyleObj);
			shape.context.isEmptyData = true;
		}
	},

	_processXAxisType: function () {

		var data = this.arrData;

		var xAxisType = 'none';

		this.isSingleArrData = false;

		if ($.isArray(data) == false) {
			this.xAxisType = xAxisType;
			return;
		}

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (item == null) {
				continue;
			}

			if ($.isArray(item) == false) {
				xAxisType = 'CategoryAxis';
				this.isSingleArrData = true;
				break;
			}

			var val = item[iX];

			if (val == null) {
				continue;
			}

			var type = $.type(val);
			switch (type) {
				case 'number':
					xAxisType = 'LinearAxis';
					break;
				case 'date':
					xAxisType = 'DateTimeAxis';
					break;
				case 'string':
					xAxisType = 'CategoryAxis';
					break;
				default:
					xAxisType = 'none';
					break;
			}

			break;
		}

		this.xAxisType = xAxisType;
	},

	_resolveAxisType: function (axisOp) {

		var loc = axisOp.location;
		if (!loc) {
			return;
		}

		if (this.isVertical) {
			if (loc == 'bottom' || loc == 'top') {
				return;
			}
		}
		else {
			if (loc == 'left' || loc == 'right') {
				return;
			}
		}

		switch (this.xAxisType) {
			case 'LinearAxis':
				axisOp.type = 'linear';
				break;
			case 'DateTimeAxis':
				axisOp.type = 'dateTime';
				break;
			case 'CategoryAxis':
				axisOp.type = 'category';
				break;
		}
	},

	_processData: function () {

		this.arrData = null;

		if (this.data) {

			if (!this.xValuesType &&
                !this.yValuesType) {
				this.arrData = jMath.cloneArray(this.data);
			}
			else {
				this.arrData = [];

				for (var i = 0; i < this.data.length; i++) {

					// clone the array
					var dItem = this.data[i].slice(0);

					dItem[iX] = jMath.processDataValue(dItem[iX], this.xValuesType);
					dItem[iY] = jMath.processDataValue(dItem[iY], this.yValuesType);

					this.arrData.push(dItem);
				}
			}
		}
		else {

			var arrDataSource = this.chart.arrDataSource;

			if (arrDataSource) {
				var xValuesField = this.xValuesField;
				var yValuesField = this.yValuesField;

				var xValues = jMath.processDataField(arrDataSource, xValuesField);
				var yValues = jMath.processDataField(arrDataSource, yValuesField);

				if (yValues) {
					this.arrData = jMath.mergeArraysXY(xValues, yValues);
				}
			}
		}

		this._processXAxisType();
		this._processNullValues();
		this._processErrorBars();
	},

	_processErrorBars: function () {
		// init ErrorBars if there is
		var errorBars = this.errorBars;
		if (errorBars && this.hasErrorBars && this.arrData) {
			this.errorBarsObj = new ErrorBars(this, errorBars);
		}
	},

	_processNullValues: function () {

		this.hasRealData = this.hasData();

		if (!this.hasRealData) {
			return;
		}

		this.hasNullValues = false;

		var arrData = this.arrData;
		if (!arrData || this.nullHandling != 'emptyPoint') {
			return;
		}

		this.hasNullValues = true;

		if (this.nullValuesIndexes) {
			this.nullIndexes = this.nullValuesIndexes;
			return;
		}

		var nullIndexes = this.nullIndexes = [];

		var item, nullItem, nullX, nullY, newValue;

		for (var i = 0; i < arrData.length; i++) {

			item = arrData[i];
			nullItem = jMath.isNull(item);

			if (this.isSingleArrData) {
				if (nullItem) {

					newValue = jMath.calcNullValue(arrData, i, 'vl');

					if (i == 0 && jMath.isNull(newValue)) {
						this.hasRealData = false;
						return;
					}

					nullIndexes.push(i);
					arrData[i] = newValue;
				}
			}
			else {

				nullX = nullItem || jMath.isNull(item[iX]);
				nullY = nullItem || jMath.isNull(item[iY]);

				if (!nullX && !nullY) {
					continue;
				}

				if (nullItem) {
					arrData[i] = [];
				}

				if (nullX) {
					newValue = jMath.calcNullValue(arrData, i, 'x', this.xAxisType);

					if (i == 0 && jMath.isNull(newValue)) {
						this.hasRealData = false;
						return;
					}

					arrData[i][iX] = newValue;
				}

				if (nullY) {
					newValue = jMath.calcNullValue(arrData, i, 'y');

					if (i == 0 && jMath.isNull(newValue)) {
						this.hasRealData = false;
						return;
					}

					arrData[i][iY] = newValue;
				}

				nullIndexes.push(i);
			}
		}
	},

	_processDataXYZ: function () {

		this.arrData = null;

		if (this.data) {

			if (!this.xValuesType &&
                !this.fromValuesType &&
                !this.toValuesType) {
				this.arrData = jMath.cloneArray(this.data);
			}
			else {
				this.arrData = [];

				for (var i = 0; i < this.data.length; i++) {

					// clone the array
					var dItem = this.data[i].slice(0);
                    //index of dItem has been changed by prediktor
					dItem[0] = jMath.processDataValue(dItem[0], this.xValuesType);
					dItem[1] = jMath.processDataValue(dItem[1], this.fromValuesType);
					dItem[2] = jMath.processDataValue(dItem[2], this.toValuesType);
					dItem[3] = jMath.processDataValue(dItem[3], this.labelValuesType);

					this.arrData.push(dItem);
				}
			}
		}
		else {
			var arrDataSource = this.chart.arrDataSource;
			if (arrDataSource) {
				var xValuesField = this.xValuesField;
				var fromValuesField = this.fromValuesField;
				var toValuesField = this.toValuesField;
				var labelValuesField = this.labelValuesField;

				var xValues = jMath.processDataField(arrDataSource, xValuesField);
				var fromValues = jMath.processDataField(arrDataSource, fromValuesField);
				var toValues = jMath.processDataField(arrDataSource, toValuesField);
				var labelValues = jMath.processDataField(arrDataSource, labelValuesField);

				if (xValues && fromValues && toValues) {
					this.arrData = jMath.mergeArrays([xValues, fromValues, toValues, labelValues]);
				}
			}
		}

		this._processXAxisType();
		this.hasRealData = this.hasData();
	},

	_initXYData: function () {

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var minX = maxVl;
		var maxX = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			var vlX = vl[iX];

			if (minX > vlX) {
				minX = vlX;
			}

			if (maxX < vlX) {
				maxX = vlX;
			}

			var vlY = vl[iY];

			if (!jMath.isNull(vlY)) {
				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			min -= errorBars.getLowerError();
			max += errorBars.getUpperError();
		}

		this.min = min;
		this.max = max;

		this.minX = minX;
		this.maxX = maxX;
	},

	_initCatValueData: function () {

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var categories = [];
		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				categories.push((i + 1).toString());
				continue;
			}

			var vlY = vl;

			if ($.isArray(vl) == false) {
				categories.push((i + 1).toString());
			}
			else {

				categories.push(vl[iX]);

				vlY = vl[iY];
			}

			if (!jMath.isNull(vlY)) {
				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			min -= errorBars.getLowerError();
			max += errorBars.getUpperError();
		}

		this.min = min;
		this.max = max;

		this.categories = categories;
	},

	_initDateValueData: function () {
		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var minX = maxVl;
		var maxX = minVl;

		var len = data.length;

		var vl, vlX, vlY;

		for (var i = 0; i < len; i++) {

			vl = data[i];
			if (jMath.isNull(vl)) {
				continue;
			}

			vlX = vl[iX];

			if (jMath.isNull(vlX)) {
				continue;
			}

			vlX = vlX.getTime();

			if (minX > vlX) {
				minX = vlX;
			}

			if (maxX < vlX) {
				maxX = vlX;
			}

			vlY = vl[iY];
			if (!jMath.isNull(vlY)) {
				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			min -= errorBars.getLowerError();
			max += errorBars.getUpperError();
		}

		this.min = min;
		this.max = max;

		this.minX = minX;
		this.maxX = maxX;
	},

	_initXYDataRange: function (from, to) {

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var minX = maxVl;
		var maxX = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null || $.isArray(vl) == false) {
				continue;
			}

			var vlX = vl[iX];

			if (minX > vlX) {
				minX = vlX;
			}

			if (maxX < vlX) {
				maxX = vlX;
			}

			for (var j = from; j < to; j++) {

				var vlY = vl[j];

				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		this.min = min;
		this.max = max;

		this.minX = minX;
		this.maxX = maxX;
	},

	_initCatValueDataRange: function (from, to, allowDuplicated) {

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var categories = [];
		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				categories.push((i + 1).toString());
				continue;
			}

			var cat = vl[iX];

			if (allowDuplicated || $.inArray(cat, categories) == -1) {
				categories.push(cat);
			}

			for (var j = from; j < to; j++) {

				var vlY = vl[j];
				if (jMath.isNull(vlY)) {
					continue;
				}

				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		this.min = min;
		this.max = max;

		this.categories = categories;
	},

	_initDateValueDataRange: function (from, to) {
		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var minX = maxVl;
		var maxX = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null || $.isArray(vl) == false) {
				continue;
			}

			var vlX = vl[iX].getTime();

			if (minX > vlX) {
				minX = vlX;
			}

			if (maxX < vlX) {
				maxX = vlX;
			}

			for (var j = from; j < to; j++) {

				var vlY = vl[j];
				if (jMath.isNull(vlY)) {
					continue;
				}

				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		this.min = min;
		this.max = max;

		this.minX = minX;
		this.maxX = maxX;
	},

	_initData: function () {

		switch (this.xAxisType) {
			case 'LinearAxis':
				this._initXYData();
				return;
			case 'DateTimeAxis':
				this._initDateValueData();
				return;
			case 'CategoryAxis':
				this._initCatValueData();
				return;
		}
	},


	_initVisibleData: function () {

		switch (this.xAxisType) {
			case 'LinearAxis':
			case 'DateTimeAxis':
				this._initVisibleXYData();
				return;
			case 'CategoryAxis':
				this._initVisibleCatValueData();
				return;
		}
	},

	_initVisibleXYData: function () {

		if (this.realYAxis.zoomEnabled) {
			return;
		}

		var xAxis = this.realXAxis;

		var vMin = xAxis.visibleMinimum || xAxis.minimum;
		var vMax = xAxis.visibleMaximum || xAxis.maximum;

		var hasMin = !jMath.isNull(vMin);
		var hasMax = !jMath.isNull(vMax);

		if (!hasMin && !hasMax) {
			return;
		}

		//if (xAxis.skipEmptyDays) {
		//    vMin = xAxis._addEmptyDaysOffset(vMin);
		//    vMax = xAxis._addEmptyDaysOffset(vMax);
		//}

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			var vlY = vl[iY];

			if (jMath.isNull(vlY)) {
				continue;
			}

			var vlX = vl[iX];

			if ((hasMin && vlX < vMin) ||
                (hasMax && vlX > vMax)) {
				continue;
			}

			if (min > vlY) {
				min = vlY;
			}

			if (max < vlY) {
				max = vlY;
			}
		}

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			min -= errorBars.getLowerError();
			max += errorBars.getUpperError();
		}

		this.min = min;
		this.max = max;
	},

	_initVisibleCatValueData: function () {

		if (this.realYAxis.zoomEnabled) {
			return;
		}

		var xAxis = this.realXAxis;

		var vMin = xAxis.visibleMinimum || xAxis.minimum;
		var vMax = xAxis.visibleMaximum || xAxis.maximum;

		var hasMin = !jMath.isNull(vMin);
		var hasMax = !jMath.isNull(vMax);

		if (!hasMin && !hasMax) {
			return;
		}

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			var vlY = vl;

			if ($.isArray(vl)) {
				vlY = vl[iY];
			}

			if (jMath.isNull(vlY)) {
				continue;
			}

			if ((hasMin && i + 1 < vMin) ||
                (hasMax && i > vMax)) {
				continue;
			}

			if (min > vlY) {
				min = vlY;
			}

			if (max < vlY) {
				max = vlY;
			}
		}

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			min -= errorBars.getLowerError();
			max += errorBars.getUpperError();
		}

		this.min = min;
		this.max = max;
	},

	_initVisibleCatValueDataRange: function (from, to) {

		if (this.realYAxis.zoomEnabled) {
			return;
		}

		var xAxis = this.realXAxis;

		var vMin = xAxis.visibleMinimum || xAxis.minimum;
		var vMax = xAxis.visibleMaximum || xAxis.maximum;

		var hasMin = !jMath.isNull(vMin);
		var hasMax = !jMath.isNull(vMax);

		if (!hasMin && !hasMax) {
			return;
		}

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			if ((hasMin && i + 1 < vMin) ||
                (hasMax && i > vMax)) {
				continue;
			}

			for (var j = from; j < to; j++) {

				var vlY = vl[j];
				if (jMath.isNull(vlY)) {
					continue;
				}

				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		this.min = min;
		this.max = max;
	},

	_initVisibleXYDataRange: function (from, to) {

		if (this.realYAxis.zoomEnabled) {
			return;
		}

		var xAxis = this.realXAxis;

		var vMin = xAxis.visibleMinimum || xAxis.minimum;
		var vMax = xAxis.visibleMaximum || xAxis.maximum;

		var hasMin = !jMath.isNull(vMin);
		var hasMax = !jMath.isNull(vMax);

		if (!hasMin && !hasMax) {
			return;
		}

		//if (xAxis.skipEmptyDays) {
		//    vMin = xAxis._addEmptyDaysOffset(vMin);
		//    vMax = xAxis._addEmptyDaysOffset(vMax);
		//}

		var data = this.arrData;

		var min = maxVl;
		var max = minVl;

		var len = data.length;

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			var vlX = vl[iX];

			if ((hasMin && vlX < vMin) ||
                (hasMax && vlX > vMax)) {
				continue;
			}

			for (var j = from; j < to; j++) {

				var vlY = vl[j];
				if (jMath.isNull(vlY)) {
					continue;
				}

				if (min > vlY) {
					min = vlY;
				}

				if (max < vlY) {
					max = vlY;
				}
			}
		}

		this.min = min;
		this.max = max;
	},


	_initStackedData: function (seriesType) {

		var data = this.arrData;

		if ($.isArray(data) == false) {
			return;
		}

		var clust = this.chart.series._findStackedClusters(this, seriesType);
		var stackedSeries = this.chart.series._getStackedSeriesFromType(seriesType, this.stackedGroupName);

		var stackedResult = this._calcStackedData(data, clust, stackedSeries);

		$.extend(this, stackedResult);
	},

	_initVisibleStackedData: function (seriesType) {

		var data = this.arrData;

		if ($.isArray(data) == false) {
			return;
		}

		var clust = this.chart.series._findStackedClusters(this, seriesType);
		var stackedSeries = this.chart.series._getStackedSeriesFromType(seriesType, this.stackedGroupName);

		var stackedResult = this._calcVisibleStackedData(data, clust, stackedSeries);

		$.extend(this, stackedResult);
	},


	_calcStackedData: function (data, clust, stackedSeries) {

		var min = maxVl;
		var max = minVl;

		var minX = maxVl;
		var maxX = minVl;

		var categories = [];
		var len = data.length;

		var tuples = {};

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				categories.push((i + 1).toString());
				continue;
			}

			if (this.xAxisType == 'CategoryAxis') {
				if ($.isArray(vl) == false) {
					categories.push((i + 1).toString());
				}
				else {
					categories.push(vl[iX]);
				}
			}
			else {
				var vlX = vl[iX];
				if ($.type(vlX) == 'date') {
					vlX = vlX.getTime();
				}

				if (minX > vlX) {
					minX = vlX;
				}

				if (maxX < vlX) {
					maxX = vlX;
				}
			}

			var xValue = this._getXValue(vl, i);

			var tuple = { positive: 0, negative: 0 };

			var oldTuple = null;

			for (var j = clust.index - 1; j >= 0; j--) {

				var dataValues = stackedSeries[j].dataValues;
				if (!dataValues) {
					continue;
				}

				oldTuple = dataValues[xValue];
				if (oldTuple) {
					tuple.positive = oldTuple.positive;
					tuple.negative = oldTuple.negative;
					break;
				}
			}

			if ($.isArray(vl)) {
				vl = vl[iY];
			}

			tuple.actualValue = vl;

			if (!jMath.isNull(vl)) {
				if (vl > 0) {
					tuple.positive += vl;
					tuple.value = tuple.positive;
				}
				else if (vl < 0) {
					tuple.negative += vl;
					tuple.value = tuple.negative;
				}
				else {
					if (oldTuple != null) {
						tuple.value = oldTuple.value;
					}
					else {
						tuple.value = 0;
					}
				}
			}
			else {
				tuple.value = null;
			}

			tuples[xValue] = tuple;

			if (tuple.value) {
				max = Math.max(max, tuple.value);
				min = Math.min(min, tuple.value);
			}
		}

		var result = {
			min: min,
			max: max,
			dataValues: tuples
		};

		if (this.xAxisType == 'CategoryAxis') {
			result.categories = categories;
		}
		else {
			result.minX = minX;
			result.maxX = maxX;
		}

		return result;
	},

	_calcVisibleStackedData: function (data, clust, stackedSeries) {

		if (this.realYAxis.zoomEnabled) {
			return;
		}

		var xAxis = this.realXAxis;

		if (!xAxis) {
			return;
		}

		var vMin = xAxis.visibleMinimum || xAxis.minimum;
		var vMax = xAxis.visibleMaximum || xAxis.maximum;

		var hasMin = !jMath.isNull(vMin);
		var hasMax = !jMath.isNull(vMax);

		if (!hasMin && !hasMax) {
			return;
		}

		//if (xAxis.skipEmptyDays) {
		//    vMin = xAxis._addEmptyDaysOffset(vMin);
		//    vMax = xAxis._addEmptyDaysOffset(vMax);
		//}

		var min = maxVl;
		var max = minVl;

		var len = data.length;

		var tuples = {};

		for (var i = 0; i < len; i++) {

			var vl = data[i];
			if (vl == null) {
				continue;
			}

			if (this.xAxisType == 'CategoryAxis') {
				if ((hasMin && i + 1 < vMin) ||
                    (hasMax && i > vMax)) {
					continue;
				}
			}
			else {
				var vlX = vl[iX];

				if ((hasMin && vlX < vMin) ||
                    (hasMax && vlX > vMax)) {
					continue;
				}
			}

			var xValue = this._getXValue(vl, i);

			var tuple = { positive: 0, negative: 0 };

			var oldTuple = null;

			for (var j = clust.index - 1; j >= 0; j--) {
				oldTuple = stackedSeries[j].dataValues[xValue];
				if (oldTuple) {
					tuple.positive = oldTuple.positive;
					tuple.negative = oldTuple.negative;
					break;
				}
			}

			if ($.isArray(vl)) {
				vl = vl[iY];
			}

			tuple.actualValue = vl;

			if (vl > 0) {
				tuple.positive += vl;
				tuple.value = tuple.positive;
			}
			else if (vl < 0) {
				tuple.negative += vl;
				tuple.value = tuple.negative;
			}
			else {
				if (oldTuple != null) {
					tuple.value = oldTuple.value;
				}
				else {
					tuple.value = 0;
				}
			}

			tuples[xValue] = tuple;

			max = Math.max(max, tuple.value);
			min = Math.min(min, tuple.value);
		}

		var result = {
			min: min,
			max: max,
			dataValues: tuples
		};

		return result;
	},


	_createXAxis: function () {

		if (!this.hasRealData) {
			return null;
		}

		var settings = { location: 'bottom', orientation: 'x' };

		var axis;

		switch (this.xAxisType) {
			case 'DateTimeAxis':
				axis = new DateTimeAxis(settings);
				break;
			case 'CategoryAxis':
				axis = new CategoryAxis(settings);
				break;
			default:
				axis = new LinearAxis(settings);
				break;
		}

		axis.chart = this.chart;

		return axis;
	},

	_createYAxis: function () {
		var axis = new LinearAxis({ location: 'left', orientation: 'y' });
		axis.chart = this.chart;

		return axis;
	},

	_initXAxis: function (axes) {
		var axis = this._findXAxis(axes);
		if (axis == null) {
			axis = this._createXAxis();
			if (axis) {
				axes.push(axis);
			}
		}

		this.realXAxis = axis;
	},

	_initYAxis: function (axes) {
		var axis = this._findYAxis(axes);
		if (axis == null) {
			axis = this._createYAxis();
			axes.push(axis);
		}

		this.realYAxis = axis;
	},

	_initSharedAxes: function () {
		if (this.realXAxis && this.realYAxis) {
			this.realXAxis.sharedAxis = this.realYAxis;
			this.realYAxis.sharedAxis = this.realXAxis;
		}
	},

	_findAxis: function (axes, name) {
		if (name != null) {
			for (var i = 0; i < axes.length; i++) {

				var axis = axes[i];
				if (axis.name == name) {
					return axis;
				}
			}
		}

		return null;
	},

	_findXAxis: function (axes) {
		// try find an axis with that name
		var axis = this._findAxis(axes, this.axisX);
		if (axis != null) {
			return axis;
		}

		// try find an axis with valid type
		for (var i = 0; i < axes.length; i++) {
			axis = axes[i];

			if (axis.getOrientation(this) != 'x' || axis.isVertical()) {
				continue;
			}

			if (axis.DataType == this.xAxisType) {
				return axis;
			}
		}

		return null;
	},

	_findYAxis: function (axes) {
		// try find an axis with that name
		var axis = this._findAxis(axes, this.axisY);
		if (axis != null) {
			return axis;
		}

		// try find an axis with valid type
		for (var i = 0; i < axes.length; i++) {

			axis = axes[i];

			if (axis.getOrientation(this) != 'y' || axis.isVertical() == false) {
				continue;
			}

			if (axis.DataType == 'LinearAxis') {
				return axis;
			}
		}

		return null;
	},

	_getLegendItems: function (options) {
		var items = [];

		if (!this.showInLegend) {
			return items;
		}

		var title;

		if (this.title != null) {
			title = this.title;
		}
		else {
			var index = $.inArray(this, this.chart.series.items) + 1;
			title = 'Series ' + index.toString();
		}

		var marker = new Marker();

		var serOptions = this.options;
		if (!jMath.isNull(serOptions.lineWidth)) {
			marker.lineWidth = serOptions.lineWidth;
		}

		// marker.lineWidth = this.lineWidth;

		if (this.showInScene) {
			marker.fillStyle = this.fillStyle;
			marker.strokeStyle = this.strokeStyle;
		}
		else {
			marker.fillStyle = options.inactiveFillStyle;
			marker.strokeStyle = options.inactiveStrokeStyle;
		}

		switch (this.type) {
			case 'line':
			case 'trendline':
				marker.type = 'line';
				marker.lineWidth = this.lineWidth;
				break;
			case 'scatter':
			case 'bubble':
				// marker.fillStyle = this.fillStyle;
				// marker.lineWidth = 0;
				if (this.markers) {
					marker.type = this.markers.type;
				}
				break;
		}

		var context = {
			chart: this.chart,
			series: this
		};

		var itemOptions = $.extend(false, {}, options, { context: context, text: title, marker: marker });

		if (!this.showInScene) {
			itemOptions.textFillStyle = options.inactiveTextFillStyle;
			itemOptions.textStrokeStyle = options.inactiveTextStrokeStyle;
		}

		var item = new LegendItem(itemOptions);
		item.chart = this.chart;
		item.series = this;
		items.push(item);

		return items;
	},

	_initColors: function (color) {
		this.fillStyle = this.fillStyle || color;
		this.strokeStyle = this.strokeStyle || color;
	},

	_getPixelMargins: function (axis) {

		var offset = 4;
		var markersOffset = 0;

		// markers
		var size;
		if (this.markers) {
			size = this.markers.getSize();
			markersOffset = this.markers.offset;
		}
		else {
			size = { width: 0, height: 0 };
		}

		// labels
		var lblSize;
		if (this.labels && this.labels.visible !== false) {
			var tBlock = new TextBlock('TEST');
			$.extend(tBlock, this.labels);
			lblSize = tBlock.measure(this.chart.ctx);
		}
		else {
			lblSize = { width: 0, height: 0 };
		}

		var isVertical = axis.isVertical();
		var isBar = this.isVertical;

		var margin;

		if (isVertical) {
			margin = size.height / 2.0 + lblSize.height + offset;
		}
		else {
			margin = size.width / 2.0 + lblSize.width + offset;
		}

		if ((isBar && !isVertical) || (!isBar && isVertical)) {
			margin += markersOffset;
			margin *= 1.25;
			var ratio = margin / axis.length;
			margin *= 1 + ratio;
		}

		if (axis.getOrientation(this) == 'x') {
			margin = Math.max(margin, 6);
		}
		else {
			margin = Math.max(margin, 12);
		}

		var errorBars = this.errorBarsObj;
		if (errorBars && axis.getOrientation(this) == 'x') {
			margin = Math.max(margin, errorBars.capLength / 2 + offset);
		}

		return { left: margin, right: margin };
	},

	_isAnchoredToOrigin: function () {
		return false;
	},

	_getLabelText: function (vl) {

		var text = $.fn.jqChart.labelFormatter(this.labels.stringFormat, vl);

		return text;
	},

	_getLabelValue: function (vl, index) {

		switch (this.labels.valueType) {
			case 'percentage':
				vl = this.getPercentage(vl, index);
				break;
		}

		return vl;
	},

	_getDataPointLabel: function (vl, x, y, offset, dataValue) {

		var isTop = vl >= this.realYAxis.getCrossing();

		var text = this._getLabelText(dataValue);
		var tBlock = new TextBlock(text);
		CanvasControl.setShadows(tBlock, this, this.chart);
		$.extend(tBlock, this.labels);

		tBlock.measure(this.chart.ctx);

		tBlock.textAlign = 'center';
		tBlock.x = x;

		if (isTop) {
			tBlock.y = y - offset;
			tBlock.textBaseline = 'bottom';
		}
		else {
			tBlock.y = y + offset;
			tBlock.textBaseline = 'top';
		}

		return tBlock;
	},

	_getTotal: function (seriesType, index) {

		var series = this.chart.series._getSeriesFromType(seriesType);

		var positive = 0;
		var negative = 0;

		for (var i = 0; i < series.length; i++) {
			var ser = series[i];

			var data = ser.arrData;

			if (data == null) {
				continue;
			}

			var vl = data[index];

			if ($.isArray(vl)) {
				vl = vl[iY];
			}

			if (vl == null) {
				continue;
			}

			if (vl > 0) {
				positive += vl;
			}
			else {
				negative += vl;
			}
		}

		return { positive: positive, negative: negative };
	},

	_getStackedTotal: function (series, xValue) {

		var positive = 0;
		var negative = 0;

		for (var i = 0; i < series.length; i++) {
			var ser = series[i];
			var dataValues = ser.dataValues;

			if (!dataValues) {
				continue;
			}

			var val = dataValues[xValue];
			if (!val) {
				continue;
			}

			if (val.actualValue > 0) {
				positive += val.actualValue;
			}
			else {
				negative += val.actualValue;
			}

		}

		return { positive: positive, negative: negative };
	},

	_getPrevStackedPosition: function (series, serIndex, xValue, crossPos, axis, isPositive) {

		for (var i = serIndex - 1; i >= 0; i--) {

			var dataValues = series[i].dataValues;

			if (!dataValues) {
				continue;
			}

			var val = dataValues[xValue];
			if (!val) {
				continue;
			}

			var value = this._scaleValue(series, val.value, xValue);

			if (isPositive) {
				if (val.value == val.positive) {
					return axis.getPosition(value);
				}
			}
			else {
				if (val.value == val.negative) {
					return axis.getPosition(value);
				}
			}
		}

		return crossPos;
	},

	_getXValue: function (vl, index) {

		var xValue, data = this.arrData;

		if (this.xAxisType == 'CategoryAxis') {
			if ($.isArray(vl) == false) {
				xValue = (index + 1).toString();
			}
			else {
				xValue = vl[iX];
			}
		}
		else {
			xValue = vl[iX];

			if ($.type(xValue) == 'date') {
				xValue = xValue.getTime();
			}
		}

		if (xValue) {
			xValue = xValue.toString();
		}
		else {
			xValue = '';
		}

		return xValue;
	},


	_getTooltip: function (context) {

		var tooltip = "<b>" + context.y + "</b><br/>";

		if (this.title) {
			var color = Shape.getColorFromFillStyle(this.fillStyle);
			tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
		}

		return tooltip;
	},

	_calcColumnScale: function (series) {

		var dataPoints = [];

		for (var i = 0; i < series.length; i++) {

			$.merge(dataPoints, series[i].arrData || []);
		}

		dataPoints.sort(function (a, b) {
			if (!a || !b) {
				return 0;
			}

			return a[0] - b[0];
		});

		var a, b, vl, minDiff = maxVl;

		for (var i = 0; i < dataPoints.length - 1; i++) {
			vl = dataPoints[i];
			if (!vl) {
				continue;
			}

			a = vl[iX];
			if ($.type(a) == 'date') {
				a = a.getTime();
			}

			vl = dataPoints[i + 1];
			if (!vl) {
				continue;
			}

			b = vl[iX];
			if ($.type(b) == 'date') {
				b = b.getTime();
			}

			if (a != b) {
				minDiff = Math.min(minDiff, b - a);
			}
		}

		var xAxis = this.realXAxis;
		var axisSeries = xAxis.series;

		var min = jMath.isNull(xAxis.minimum) ? axisSeries.minX : xAxis.minimum;
		var max = jMath.isNull(xAxis.maximum) ? axisSeries.maxX : xAxis.maximum;

		var range = max - min;
		if (xAxis.skipEmptyDays) {
			range -= xAxis.totalEmptyDaysTicks;
		}

		range = Math.min(0.5, minDiff / range);

		return range;
	},

	_getSeriesFromThisType: function () {
		return this.chart.series._getSeriesFromType(this.type);
	},

	_hideFromLegend: function (context) {
		var show = !this.showInScene;
		this.showInScene = show;
		this.options.showInScene = show;
	},

	_handleEvent: function (name, shape) {
	},

	_render: function (shapes) {

		if (!this.hasRealData || !this.isInScene()) {
			return;
		}

		switch (this.xAxisType) {
			case 'LinearAxis':
			case 'DateTimeAxis':
				return this._renderLinearData(shapes);
			case 'CategoryAxis':
				return this._renderCatData(shapes);
				break;
		}
	},

	_createErrorBars: function (shapes) {

		if (this.errorBarsObj) {
			this.errorBarsObj._createShapes(shapes);
		}
	},

	hasData: function () {
		return !!this.arrData && this.xAxisType != 'none';
	},

	getPercentage: function (vl, index) {
		var total = this._getTotal(this.type, index);
		var sum = vl > 0 ? total.positive : total.negative;
		vl = sum != 0 ? 100 * Math.abs(vl) / Math.abs(sum) : 0;

		return vl;
	},

	setOptions: function (options) {

		var settings = $.extend({}, this.defaults, options || {});
		$.extend(this, settings);

		this.options = options;

		if (options) {
			this.emptyPointStyleObj = new EmptyPointStyle(settings.emptyPointStyle);
		}

		if (settings.markers != null) {
			this.markers = new Marker(settings.markers);
		}
	},

	isInScene: function () {
		return this.visible && this.showInScene;
	},

	_getTooltipTitle: function () {
		return jMath.replaceTextForTooltip(this.title);
	},

	getLabelsOffset: function () {

		var hasMarkers = this.markers && this.markers.isVisible();
		var offset = hasMarkers ? this.markers.size / 2 : 0;

		var errorBars = this.errorBarsObj;
		if (errorBars) {
			offset = Math.max(offset, errorBars.getMaxLength());
		}

		return offset;
	},

	defaults: {

		lineCap: 'butt', // butt | round | square;
		lineJoin: 'round', // round | bevel | miter
		miterLimit: 10,
		pointWidth: 0.6,

		minimumWidth: 1,

		/**
         * @cfg {String} nullHandling
         * Specifies how the null values are handled - 'break', 'connect', or 'emptyPoint'
         */
		nullHandling: 'break',

		/**
          * @cfg {Chart.EmptyPointStyle} emptyPointStyle
          * Specifies the empty point style.
          */

		/**
          * @cfg {Number[]} nullValuesIndexes
          * Specifies indexes of the series data, which will be treated as null values.
          */

		/**
        * @cfg {Chart.ErrorBars} errorBars
        * Specifies the series error bars.
        */

		/**
          * @cfg {Boolean} visible
          * Specifies whether or not this series should be displayed.
          */
		visible: true,
		/**
          * @cfg {Number} lineWidth
          * Specifies the series line width.
          */
		lineWidth: 1,
		/**
         * @cfg {String} strokeStyle
         * Specifies the series line color.
         */
		strokeStyle: null,

		/**
          * @cfg {Boolean} showInLegend
          * Specifies whether or not this series should be displayed in the legend.
          */
		showInLegend: true,

		/**
          * @cfg {Boolean} showInScene
          * Specifies whether or not this series should be displayed in the scene.
          */
		showInScene: true

		/**
         * @cfg {String/Common.Gradient} fillStyle
         * Specifies the series fill style.
         */

		/**
         * @cfg {String} title
         * Specifies the series title.
         */

		/**
         * @cfg {Number[]} strokeDashArray
         * Specifies the series line stroke dash array - [2, 4].
         */


		/**
        * @cfg {Array} data
        * Specifies the series data.
        */

		/**
        * @cfg {Common.Animation} animation
        * Specifies the series animation.
        */

		/**
        * @cfg {Chart.DataPointLabels} labels
        * Specifies the series labels.
        */

		/**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */

		/**
        * @cfg {String} cursor
        * Specifies the cursor when the mouse is over a data point from this series.
        */

	}
}

/**
 * @class Chart.Series.Line
 * @extends Chart.Series.Series
 * 
 * A line chart (or line graph) is a common family of charts that displays quantitative 
 * information via lines connected by data points. They often illustrate trends with the passing of time.
 */
function LineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 2,
        /**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */
        markers: {}

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });
    this.defaults = defs;

    Series.call(this, options);

    this.hasErrorBars = true;
}

LineSeries.prototype = new Series();
LineSeries.constructor = LineSeries;

LineSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = x = i + 0.5;

        if ($.isArray(vl) == false) {
            vlY = vl;
        }
        else {
            vlY = vl[iY];

            if (jMath.isNull(vlY)) {
                pts.push(null);
                pts.push(null);
                if (!hasMarkers) {
                    cPoints.push(null);
                }
                continue;
            }
        }

        x = this.realXAxis.getPosition(x);
        y = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: this.realXAxis._getValue(i),
                y: vlY
            });
        }

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, null, vlY, lblOffset);
    }

    var polyline = this._createShape(pts, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

LineSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();
    var hasLabels = this.labels != null && this.labels.visible !== false;

    if (len > 1000 &&
        hasMarkers == false &&
        hasLabels == false) {
        this._renderLargeXYData(shapes);
        return;
    }

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        prediktor_codes:{
            if (vl[iMarkerType] && vl[iMarkerType] == 'lineBreak') {
                pts.push(null);
                pts.push(null);
                cPoints.push(null);
                continue;
            }
        }
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];

        if (jMath.isNull(vlX) || jMath.isNull(vlY)) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        x = this.realXAxis.getPosition(vlX);
        y = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: vlX,
                y: vlY
            });
        }

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        prediktor_codes: {
            if (vl[iMarkerType]) {
                this.prediktor_addMarkerAndLabel(markers, txtBlocks, x, y, i, len, vlX, vlY, lblOffset);
            }
            else {
                this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, vlX, vlY, lblOffset);
            }
        }
        //this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, vlX, vlY, lblOffset); // this is jqchart's original code
    }

    var polyline = this._createShape(pts, shapes);

    prediktor_codes:{
        if (markers.length == 0 && polyline) {
            polyline.context = {
                chart: this.chart,
                series: this,
                points: cPoints
            };
        }
        else {
            $.merge(shapes, markers);
        }
    }
//jqchart's original code below
    //if (!hasMarkers && polyline) {
    //    polyline.context = {
    //        chart: this.chart,
    //        series: this,
    //        points: cPoints
    //    };
    //}
    //else {
    //    $.merge(shapes, markers);
    //}
//jqchart's original code above

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

LineSeries.prototype._renderLargeXYData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var width = this.chart.gridArea.width;
    var height = this.chart.gridArea.height;

    var xAxis = this.realXAxis;
    var yAxis = this.realYAxis;

    // var coefX = 2 * (this.maxX - this.minX) / width;
    // var coefY = 2 * (this.max - this.min) / height;

    var coefX = 2 * (xAxis.actualVisibleMaximum - xAxis.actualVisibleMinimum) / width;
    var coefY = 2 * (yAxis.actualVisibleMaximum - yAxis.actualVisibleMinimum) / height;

    var pts = [];

    var x, y, vlX, vlY;

    var oldX = 0;
    var oldY = 0;
    var cumX = 0;
    var cumY = 0;
    var vl, dx, dy;

    // var count = 0;

    var cPoints = [];

    for (var i = 0; i < len; i++) {

        vl = data[i];

        prediktor_codes: {
            if (vl[iMarkerType] != null && vl[iMarkerType] == 'lineBreak') {
                pts.push(null);
                pts.push(null);
                cPoints.push(null);
                continue;
            }
        }

        if (vl === null) {
            pts.push(null);
            pts.push(null);
            cPoints.push(null);
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];

        if (vlY === null) {
            pts.push(null);
            pts.push(null);
            cPoints.push(null);
            continue;
        }

        // fix
        // if (!xAxis.isValueVisible(vlX) ||
        //    !yAxis.isValueVisible(vlY)) {
        //    continue;
        // }

        dx = oldX - vlX;
        dy = oldY - vlY;

        cumX += dx < 0 ? -dx : dx;
        cumY += dy < 0 ? -dy : dy;

        if (cumX < coefX &&
            cumY < coefY) {
            // count++;
            continue;
        }

        cumX = 0;
        cumY = 0;

        oldX = vlX;
        oldY = vlY;

        x = xAxis.getPosition(vlX);
        y = yAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        cPoints.push({
            dataItem: vl,
            index: i,
            x: vlX,
            y: vlY
        });
    }

    var polyline = this._createShape(pts, shapes);
    if (polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
}

LineSeries.prototype._createShape = function (pts, shapes) {

    this._createErrorBars(shapes);

    var polyline = new Polyline(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.Area
 * @extends Chart.Series.Line
 * 
 * Based on line charts, area charts (or area graphs) highlight an area between the axis and line, 
 * commonly emphasized with colors and textures. They typically emphasize the degree of change over time and 
 * also show the relationship of parts to a whole.
 */
function AreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

AreaSeries.prototype = new LineSeries();
AreaSeries.constructor = AreaSeries;

AreaSeries.prototype._createShape = function (pts, shapes) {
    var linePts = [];
    $.merge(linePts, pts);

    var polyline = new Polyline(linePts);
    this._setShapeSettings(polyline);

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);

    var polygon = new Area(pts, crossPos);
    this._setShapeSettings(polygon);
    polygon.lineWidth = 0;
    shapes.push(polygon);

    this._createErrorBars(shapes);

    shapes.push(polyline);

    this._addLengthAnimation(polygon);
    this._addLengthAnimation(polyline);

    return polyline;
}

AreaSeries.prototype._isAnchoredToOrigin = function () {
    return true;
}

/**
 * @class Chart.Series.SplineArea
 * @extends Chart.Series.Area
 * 
 * The Spline Area chart type is an Area chart that plots a fitted curve through each data point in a series.
 */
function SplineAreaSeries(options) {
    AreaSeries.call(this, options);
}

SplineAreaSeries.prototype = new AreaSeries();
SplineAreaSeries.constructor = SplineAreaSeries;

SplineAreaSeries.prototype._createShape = function (pts, shapes) {
    var linePts = [];
    $.merge(linePts, pts);

    var curve = new Curve(linePts);
    this._setShapeSettings(curve);

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);
    
    var polygon = new Area(pts, crossPos, false, true);
    this._setShapeSettings(polygon);
    polygon.lineWidth = 0;
    shapes.push(polygon);

    this._createErrorBars(shapes);

    shapes.push(curve);

    this._addLengthAnimation(polygon);
    this._addLengthAnimation(curve);

    return curve;
}

/**
 * @class Chart.Series.Bar
 * @extends Chart.Series.Series
 * 
 * A bar chart (or bar graph) illustrates comparisons among individual items. 
 * It is a chart of rectangular bars with lengths proportional to the values they represent. 
 * Categories are organized horizontally while values are displayed vertically in order to place more emphasis 
 * on comparing values (and less emphasis on time).
 */
function BarSeries(options) {

    /**
    * @cfg {String/Chart.DataField} xValuesField
    * Specifies the data item field containing the X value.
    */

    /**
    * @cfg {String/Chart.DataField} yValuesField
    * Specifies the data item field containing the Y value.
    */

       /**
        * @cfg {String} xValuesType
        * Specifies the data type for automatic conversion from received inline data to the required value.
        *
        * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
        */

    /**
     * @cfg {String} yValuesType
     * Specifies the data type for automatic conversion from received inline data to the required value.
     *
     * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
     */

    /**
    * @cfg {String} axisX
    * Specifies the x-axis name that this series belong to.
    */
    /**
    * @cfg {String} axisY
    * Specifies the y-axis name that this series belong to.
    */

    /**
    * @cfg {String/Common.Gradient[]} fillStyles
    * Specifies series fill styles - ['red', 'blue'].
    */

    /**
    * @cfg {number} pointWidth
    * Specifies the height of the bars - from 0 to 1
    * 
    * Defaults to: 0.6
    */

    /**
    * @cfg {number} minimumWidth
    * Specifies the minimum height of the bars in pixels.
    * 
    * Defaults to: 1
    */


    this.isVertical = true;

    Series.call(this, options);

    this.hasErrorBars = true;
}

BarSeries.prototype = new Series();
BarSeries.constructor = BarSeries;

BarSeries.prototype._createXAxis = function () {

	if (!this.hasRealData) {
		return null;
	}

    var settings = { location: 'left', orientation: 'x' };

    var axis;

    switch (this.xAxisType) {
        case 'DateTimeAxis':
            axis = new DateTimeAxis(settings);
            break;
        case 'CategoryAxis':
            axis = new CategoryAxis(settings);
            break;
        default:
            axis = new LinearAxis(settings);
            break;
    }

    axis.chart = this.chart;

    return axis;
}

BarSeries.prototype._createYAxis = function () {
    var axis = new LinearAxis({ location: 'bottom', orientation: 'y' });
    axis.chart = this.chart;

    return axis;
}

BarSeries.prototype._findXAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisX);
    if (axis != null) {
        return axis;
    }

    var type;

    if (this.categories) {
        type = CategoryAxis;
    }
    else {
        type = LinearAxis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];

        if (axis.getOrientation(this) != 'x' || axis.isVertical() == false) {
            continue;
        }

        if (axis instanceof type) {
            return axis;
        }
    }

    return null;
}

BarSeries.prototype._findYAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisY);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {

        axis = axes[i];

        if (axis.getOrientation(this) != 'y' || axis.isVertical()) {
            continue;
        }

        if (axis instanceof LinearAxis) {
            return axis;
        }
    }

    return null;
}

BarSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = left + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);
    crossPos = Math.round(crossPos);

    var clust = this.chart.series._findClusters(this, this.type);
    var len = data.length;

    var gAreaHeight = gArea.height / this.realXAxis.getZoom();

    var groupH = gAreaHeight / len;
    var barH = groupH / clust.count;

    var h = Math.round(this.pointWidth * barH);

    var totalBarHeight = clust.count * h;
    var offset = (groupH - totalBarHeight) / 2;

    offset = Math.round(offset + clust.index * h);

    h = Math.max(h, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset() + 2;

    var x, y;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null) {
            continue;
        }

        var vlX = i;
        var vlY;

        if ($.isArray(vl) == false) {
            vlY = vl;
        }
        else {
            vlY = vl[iY];
        }

        if (vlY == null) {
            continue;
        }

        y = Math.round(this.realXAxis.getCatPosition(vlX) - offset - h);
        x = Math.round(this.realYAxis.getPosition(vlY));

        var mX = x;
        var width;
        if (x <= crossPos) {
            width = crossPos - x;

            var maxLeft = gArea.x - 10;
            if (x < maxLeft) {
                var diff = maxLeft - x;
                x += diff;
                width -= diff;
            }
        }
        else {
            width = x - crossPos;
            x = crossPos;

            var maxRight = gArea.getRight() + 10;

            if (x + width > maxRight) {
                width = maxRight - x;
            }
        }

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: this.realXAxis._getValue(i),
            y: vlY
        };

        var rect = new Rectangle(x, y, width, h);
        rect.context = context;
        rect.center = { x: Math.round(mX), y: Math.round(y + h / 2) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        y += h / 2;

        this._addMarkerAndLabel(markers, txtBlocks, mX, y, i, len, null, vlY, lblOffset, context);
    }

    this._createErrorBars(shapes);

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

BarSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = left + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);
    crossPos = Math.round(crossPos);

    var len = data.length;

    var gAreaHeight = gArea.height / this.realXAxis.getZoom();

    var series = this._getSeriesFromThisType();
    var groupH = this._calcColumnScale(series) * gAreaHeight;

    var h = this.pointWidth * groupH;
    h = Math.max(h, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY, vl;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null || $.isArray(vl) == false) {
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];

        if (vlX == null || vlY == null) {
            continue;
        }

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: vlX,
            y: vlY
        };

        y = this.realXAxis.getPosition(vlX);
        x = Math.round(this.realYAxis.getPosition(vlY));

        var mX = x;
        var width;
        if (x <= crossPos) {
            width = crossPos - x;

            var maxLeft = gArea.x - 10;
            if (x < maxLeft) {
                var diff = maxLeft - x;
                x += diff;
                width -= diff;
            }
        }
        else {
            width = x - crossPos;
            x = crossPos;

            var maxRight = gArea.getRight() + 10;

            if (x + width > maxRight) {
                width = maxRight - x;
            }
        }

        var locY = y - h / 2;

        var rect = new Rectangle(x, locY, width, h);
        rect.context = context;
        rect.center = { x: Math.round(mX), y: Math.round(locY + h / 2) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        this._addMarkerAndLabel(markers, txtBlocks, mX, y, i, len, vlX, vlY, lblOffset, context);
    }

    this._createErrorBars(shapes);

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

BarSeries.prototype._addAnimation = function (rect, i, len) {

    var anOptions = this._getAnimation();

    if (!anOptions || anOptions.enabled === false) {
        return;
    }

    var animation = new Animation(anOptions, rect, "xDecrease", rect.width, 0);

    this._setIsAnimReversed(rect);

    var duration = animation.duration / len;
    var delayTime = animation.delayTime + i * duration;

    animation.delayTime = delayTime;
    animation.duration = duration;
    this.chart.storyboard.addAnimation(animation);
}

BarSeries.prototype._setIsAnimReversed = function (rect) {
    var rectReversed = rect.context.y < this.realYAxis.getCrossing();
    var reversed = this.realYAxis.reversed;

    rect.isAnimReversed = (!reversed && rectReversed) || (reversed && !rectReversed);
}

BarSeries.prototype._correctMarkerPosition = function (x, y, vl) {
    var offset = this.markers.offset;

    if (offset) {
        var isTop = vl >= this.realYAxis.getCrossing();
        x = isTop ? x + offset : x - offset;
    }

    return { x: x, y: y };
}

BarSeries.prototype._getPixelMargins = function (axis) {

    if (axis.isVertical() == false) {
        var markerMargin = Series.prototype._getPixelMargins.call(this, axis);

        var margin = axis.length / 10;

        var left = Math.max(margin, markerMargin.left);
        var right = Math.max(margin, markerMargin.right);

        return { left: left, right: right };
    }

    if (!this.hasData()) {
        return { left: 0, right: 0 };
    }

    var offset = 4;

    var series = this._getSeriesFromThisType();
    var columnScale = this._calcColumnScale(series);

    var length = axis.length;

    var width = 0.5 * columnScale * length + offset;

    return { left: width, right: width };
}

BarSeries.prototype._isAnchoredToOrigin = function () {
    return true;
}

BarSeries.prototype._getDataPointLabel = function (vl, x, y, offset, dataValue) {

    var isLeft = vl <= this.realYAxis.getCrossing();

    var text = this._getLabelText(dataValue);
    var tBlock = new TextBlock(text);
    CanvasControl.setShadows(tBlock, this, this.chart);
    $.extend(tBlock, this.labels);

    tBlock.measure(this.chart.ctx);

    tBlock.y = y;

    var gArea = this.chart.gridArea;

    if (isLeft) {
        tBlock.x = x - offset;
        tBlock.textAlign = 'right';

        if (tBlock.x - tBlock.width < gArea.x + 4) {
            tBlock.x = gArea.x + tBlock.width + 4;
        }
    }
    else {
        tBlock.x = x + offset;
        tBlock.textAlign = 'left';

        var maxRight = gArea.getRight() - 4;
        if (tBlock.x + tBlock.width > maxRight) {
            tBlock.x = maxRight - tBlock.width;
        }
    }

    return tBlock;
}

BarSeries.prototype._initColors = function (color) {
    this.fillStyle = this.fillStyle || color;
}

/**
 * @class Chart.Series.Bubble
 * @extends Chart.Series.Series
 * 
 * Bubble charts (or bubble graphs) are a variation of the X-Y chart, 
 * where the data points are replaced by bubbles of different sizes. The second Y value is used 
 * to control the size of the bubble. Although the chart is called "bubble," it also can display different 
 * shapes: rectangle, diamond, triangle.
 */
function BubbleSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: { strokeStyle: null }

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
        * @cfg {String/Chart.DataField} sizeValuesField
        * Specifies the data item field containing the Size value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} sizeValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });
    this.defaults = defs;

    Series.call(this, options);
}

BubbleSeries.prototype = new Series();
BubbleSeries.constructor = BubbleSeries;

BubbleSeries.prototype._processData = function () {

    this.arrData = null;

    if (this.data) {

        if (!this.xValuesType &&
            !this.yValuesType &&
            !this.sizeValuesType) {
            this.arrData = jMath.cloneArray(this.data);
        }
        else {
            this.arrData = [];

            for (var i = 0; i < this.data.length; i++) {

                // clone the array
                var dItem = this.data[i].slice(0);
                //index has been changed by prediktor
                dItem[iX] = jMath.processDataValue(dItem[iX], this.xValuesType);
                dItem[iY] = jMath.processDataValue(dItem[iY], this.yValuesType);
                dItem[iRangeTo] = jMath.processDataValue(dItem[iRangeTo], this.sizeValuesType); // irangeto is acctually means radius

                this.arrData.push(dItem);
            }
        }
    }
    else {

        var arrDataSource = this.chart.arrDataSource;
        if (arrDataSource) {
            var xValuesField = this.xValuesField;
            var yValuesField = this.yValuesField;
            var sizeValuesField = this.sizeValuesField;

            var xValues = jMath.processDataField(arrDataSource, xValuesField);
            var yValues = jMath.processDataField(arrDataSource, yValuesField);
            var sizeValues = jMath.processDataField(arrDataSource, sizeValuesField);

            if (xValues && yValues && sizeValues) {
                this.arrData = jMath.mergeArrays([xValues, yValues, sizeValues]);
            }
        }
    }

    this._processXAxisType();
    this.hasRealData = this.hasData();
}

BubbleSeries.prototype._initData = function () {

    if (!this.arrData) {
        return;
    }

    var data = [];
    $.merge(data, this.arrData);

    var serItems = this.chart.series.items;
    for (var i = 0; i < serItems.length; i++) {
        var ser = serItems[i];

        if (ser == this || ser.type != 'bubble') {
            continue;
        }

        $.merge(data, ser.arrData);
    }

    if ($.isArray(data) == false) {
        return;
    }

    var min = maxVl;
    var max = minVl;

    var minX = maxVl;
    var maxX = minVl;

    var minSize = maxVl;
    var maxSize = minVl;

    var len = data.length;

    for (var i = 0; i < len; i++) {

        var vlX = data[i][iX];
        var vlY = data[i][iY];
        var vlSize = data[i][iRangeTo];

        if (vlX == null ||
            vlY == null ||
            vlSize == null) {
            continue;
        }

        // x values
        minX = Math.min(minX, vlX);
        maxX = Math.max(maxX, vlX);

        // y values
        min = Math.min(min, vlY);
        max = Math.max(max, vlY);

        // size values
        minSize = Math.min(minSize, vlSize);
        maxSize = Math.max(maxSize, vlSize);
    }

    this.min = min;
    this.max = max;

    this.minX = minX;
    this.maxX = maxX;

    this.minSize = minSize;
    this.maxSize = maxSize;
}

BubbleSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var chart = this.chart;
    var opts = chart.options;

    var maxSize = opts.maxBubbleSize;

    if (!maxSize) {
        var ga = chart.gridArea;
        maxSize = Math.min(ga.width, ga.height) * 0.25;
    }

    var bubbleMaxSize = opts.maxBubbleScale;
    if (!bubbleMaxSize) {
        bubbleMaxSize = this.maxSize;
    }

    var len = data.length;
    var x, y, r, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null) {
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];
        r = vl[iRangeTo];

        if (vlX == null || vlY == null || r == null) {
            continue;
        }

        var ratio = r / bubbleMaxSize;
        var size = Math.max(ratio * maxSize, 0);

        x = this.realXAxis.getPosition(vlX);
        y = this.realYAxis.getPosition(vlY);

        if (this.markers && this.markers.isVisible()) {

            var context = {
                chart: this.chart,
                series: this,
                dataItem: data[i],
                index: i,
                x: vlX,
                y: vlY,
                size: r
            };

            var marker = this._getMarker(x, y, size / 2, null, null, i, context);
            shapes.push(marker);

            this._addShapeAnimation(marker, i, len);
        }

        if (this.labels && this.labels.visible !== false) {
            var labelValue = this._getLabelValue(vlY, i);
            var tBlock = this._getDataPointLabel(vlY, x, y, size / 2, labelValue);
            shapes.push(tBlock);

            this._addShapeAnimation(tBlock, i, len);
        }
    }
}

BubbleSeries.prototype._getPixelMargins = function (axis) {

    var ga = this.chart.gridArea;
    if (ga.width == null) {
        return { left: 0, right: 0 };
    }

    var maxSize = Math.min(ga.width, ga.height) * 0.35;
    var r = maxSize / 2;

    return { left: r + 4, right: r + 4 };
}

BubbleSeries.prototype._getTooltip = function (context) {

    var tooltip = "y: <b>" + context.y.toString() + "</b><br/>" +
                  "size: <b>" + context.size.toString() + "</b>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Column
 * @extends Chart.Series.Series
 * 
 * A column chart (or column graph) uses a sequence of columns (vertical rectangles) to show individual reference 
 * values that are compared with other columns across categories.
 */
function ColumnSeries(options) {

    /**
    * @cfg {String/Chart.DataField} xValuesField
    * Specifies the data item field containing the X value.
    */

    /**
    * @cfg {String/Chart.DataField} yValuesField
    * Specifies the data item field containing the Y value.
    */

    /**
     * @cfg {String} xValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

    /**
     * @cfg {String} yValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

    /**
     * @cfg {String} axisX
     * Specifies the x-axis name that this series belong to.
     */
    /**
    * @cfg {String} axisY
    * Specifies the y-axis name that this series belong to.
    */

    /**
    * @cfg {String/Common.Gradient[]} fillStyles
    * Specifies series fill styles - ['red', 'blue'].
    */

    /**
    * @cfg {number} pointWidth
    * Specifies the width of the columns - from 0 to 1
    * 
    * Defaults to: 0.6
    */

    /**
    * @cfg {number} minimumWidth
    * Specifies the minimum width of the columns in pixels.
    * 
    * Defaults to: 1
    */

    Series.call(this, options);

    this.hasErrorBars = true;
}

ColumnSeries.prototype = new Series();
ColumnSeries.constructor = ColumnSeries;

ColumnSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);
    crossPos = Math.round(crossPos);

    var clust = this.chart.series._findClusters(this, this.type);
    var len = data.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var groupW = gAreaWidth / len;
    var columnW = groupW / clust.count;

    var w = Math.round(this.pointWidth * columnW);

    var totalColumnWidth = clust.count * w;
    var offset = (groupW - totalColumnWidth) / 2;

    offset = Math.round(offset + clust.index * w);

    w = Math.max(w, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null) {
            continue;
        }

        x = i;

        if ($.isArray(vl) == false) {
            vlY = vl;
        }
        else {
            vlY = vl[iY];
        }

        if (vlY == null) {
            continue;
        }

        x = Math.round(this.realXAxis.getCatPosition(x) + offset);
        y = Math.round(this.realYAxis.getPosition(vlY));

        var mY = y;
        var height;
        if (y <= crossPos) {
            height = crossPos - y;
        }
        else {
            height = y - crossPos;
            y = crossPos;
        }

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: this.realXAxis._getValue(i),
            y: vlY
        };

        var rect = new Rectangle(x, y, w, height);
        rect.context = context;
        rect.center = { x: Math.round(x + w / 2), y: Math.round(mY) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        x += w / 2;

        this._addMarkerAndLabel(markers, txtBlocks, x, mY, i, len, null, vlY, lblOffset, context);
    }

    this._createErrorBars(shapes);

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

ColumnSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);
    crossPos = Math.round(crossPos);

    var len = data.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var series = this._getSeriesFromThisType();
    var columnW = this._calcColumnScale(series) * gAreaWidth;

    var w = this.pointWidth * columnW;
    w = Math.max(w, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null || $.isArray(vl) == false) {
            continue;
        }

        vlX = x = vl[iX];
        vlY = vl[iY];

        if (x == null || vlY == null) {
            continue;
        }

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: x,
            y: vlY
        };

        x = this.realXAxis.getPosition(x);
        y = Math.round(this.realYAxis.getPosition(vlY));

        var mY = y;
        var height;
        if (y <= crossPos) {
            height = crossPos - y;
        }
        else {
            height = y - crossPos;
            y = crossPos;
        }

        var locX = x - w / 2;

        var rect = new Rectangle(locX, y, w, height);
        rect.context = context;
        rect.center = { x: Math.round(locX + w / 2), y: Math.round(mY) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, mY, i, len, vlX, vlY, lblOffset, context);
    }

    this._createErrorBars(shapes);

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

ColumnSeries.prototype._addAnimation = function (rect, i, len) {

    var anOptions = this._getAnimation();

    if (!anOptions || anOptions.enabled === false) {
        return;
    }

    var animation = new Animation(anOptions, rect, "yDecrease", rect.height, 0);

    this._setIsAnimReversed(rect);

    var duration = animation.duration / len;
    var delayTime = animation.delayTime + i * duration;

    animation.delayTime = delayTime;
    animation.duration = duration;
    this.chart.storyboard.addAnimation(animation);
}

ColumnSeries.prototype._setIsAnimReversed = function (rect) {
    var rectReversed = rect.context.y >= this.realYAxis.getCrossing();
    var reversed = this.realYAxis.reversed;

    rect.isAnimReversed = (!reversed && rectReversed) || (reversed && !rectReversed);
}

ColumnSeries.prototype._getPixelMargins = function (axis) {

    if (axis.isVertical()) {
        var markerMargin = Series.prototype._getPixelMargins.call(this, axis);

        var margin = axis.length / 10;

        var left = Math.max(margin, markerMargin.left);
        var right = Math.max(margin, markerMargin.right);

        return { left: left, right: right };
    }

    if (!this.hasData()) {
        return { left: 0, right: 0 };
    }

    var offset = 4;

    var series = this._getSeriesFromThisType();
    var columnScale = this._calcColumnScale(series);

    var length = axis.length;

    var width = 0.5 * columnScale * length + offset;

    return { left: width, right: width };
}

ColumnSeries.prototype._isAnchoredToOrigin = function () {
    return true;
}

ColumnSeries.prototype._initColors = function (color) {
    this.fillStyle = this.fillStyle || color;
}

/**
 * @class Chart.Series.Pie
 * @extends Chart.Series.Series
 * 
 * Pie charts (or pie graphs) go by many names (circle chart, sector chart, segmented chart, etc.), 
 * and are one of the most widely used chart types. Pie charts are circles divided into sectors, 
 * showing how percentages or relative magnitudes compare with each other and contribute to the whole.
 */
function PieSeries(options) {

	var defs = $.extend(true, {}, this.defaults, {

		/**
        * @cfg {Number} margin
        * Specifies the series margin.
        */
		margin: 8,

		/**
        * @cfg {Number} startAngle
        * Specifies the start angle in degrees.
        */
		startAngle: -90,

		/**
         * @cfg {Number} explodedRadius
         * Specifies the exploded radius.
         */
		explodedRadius: 10,

		/**
       * @cfg {Number[]} hiddenSlices
       * Specifies indexes of the slices, which are hidden.
       */
		hiddenSlices: [],

		/**
        * @cfg {Boolean} allowExplodeSlices
        * Specifies whether or not the slices can be explode dynamically.
        */
		allowExplodeSlices: true,

		/**
         * @cfg {String/Chart.DataField} dataLabelsField
         * Specifies the data item field containing the Label value.
         */

		/**
        * @cfg {String/Chart.DataField} dataValuesField
        * Specifies the data item field containing the Data value.
        */

		/**
        * @cfg {String/Chart.DataField} explodedField
        * Specifies the data item field containing whether the pie slice is exploded.
        */

		/**
         * @cfg {String} dataLabelsType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

		/**
         * @cfg {String} dataValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

		/**
         * @cfg {Number[]} explodedSlices
         * Specifies indexes of the exploded slices.
         */
		explodedSlices: [],

		/**
        * @cfg {String/Common.Gradient[]} fillStyles
        * Specifies series fill styles - ['red', 'blue'].
        */

		/**
        * @cfg {String} labelsPosition
        * Specifies the labels position.
        *
        * Possible values are: 'inside' or 'outside'.
        */
		labelsPosition: 'inside',

		/**
        * @cfg {String} labelsAlign
        * Specifies the labels align when the labels are outside.
        *
        * Possible values are: 'circle' or 'column'.
        */
		labelsAlign: 'circle',

		/**
        * @cfg {Number} labelsExtend
        * Specifies the labels extend when the labels are outside.
        */
		labelsExtend: 20,

		/**
        * @cfg {Number} leaderLineWidth
        * Specifies the leader line width when the labels are outside.
        */
		leaderLineWidth: 1,

		/**
         * @cfg {String} leaderLineStrokeStyle
         * Specifies the leader line color when the labels are outside.
         */
		leaderLineStrokeStyle: 'black',


		innerExtent: 0,
		outerExtent: 1
	});

	this.defaults = defs;

	Series.call(this, options);
}

PieSeries.prototype = new Series();
PieSeries.constructor = PieSeries;

PieSeries.prototype._initXAxis = function (axes) {
}

PieSeries.prototype._initYAxis = function (axes) {
}

PieSeries.prototype._initVisibleData = function () {
}

PieSeries.prototype._processData = function () {

	this.arrData = null;

	if (this.data) {

		this.expIndexes = this.explodedSlices;

		if (!this.dataLabelsType &&
            !this.dataValuesType) {
			this.arrData = jMath.cloneArray(this.data);
		}
		else {
			this.arrData = [];

			for (var i = 0; i < this.data.length; i++) {

				// clone the array
				var dItem = this.data[i].slice(0);

				dItem[0] = jMath.processDataValue(dItem[0], this.dataLabelsType);
				dItem[1] = jMath.processDataValue(dItem[1], this.dataValuesType);

				this.arrData.push(dItem);
			}
		}
	}
	else {

		var arrDataSource = this.chart.arrDataSource;
		if (arrDataSource) {
			var dataLabelsField = this.dataLabelsField;
			var dataValuesField = this.dataValuesField;

			var dataLabels = jMath.processDataField(arrDataSource, dataLabelsField);
			var dataValues = jMath.processDataField(arrDataSource, dataValuesField);

			this.arrData = jMath.mergeArraysXY(dataLabels, dataValues);

			// exploded slices
			this.expIndexes = [];

			for (var i = 0; i < arrDataSource.length; i++) {
				var item = arrDataSource[i];
				var vl = item[this.explodedField];
				if (vl) {
					this.expIndexes.push(i);
				}
			}
		}
	}

	this._processXAxisType();
	this._processNullValues();
}

PieSeries.prototype._getYValues = function () {
	var result = [];

	var data = this.arrData;

	var len = data.length;

	for (var i = 0; i < len; i++) {

		var vl = data[i];
		if (vl == null) {
			continue;
		}

		var vlY;

		if ($.isArray(vl) == false) {
			vlY = vl;
		}
		else {
			vlY = vl[1];
		}

		result.push(Math.abs(vlY));
	}

	return result;
}


PieSeries.prototype._createLabels = function () {
	var data = this.arrData;

	var pieContext = {};

	if (!data) {
		return pieContext;
	}

	var gArea = this.chart.gridArea;
	var w = gArea.width;
	var h = gArea.height;

	var values = this._getYValues();
	var len = values.length;
	var sum = this.getTotal();

	var margin = this.margin;
	var radius = this._calcRadius({ h: margin, v: margin });

	if (radius < 0) {
		return pieContext;
	}

	var innerRadius = radius * this.innerExtent;
	var outerRadius = radius * this.outerExtent;

	var x = gArea.x + w / 2;
	var y = gArea.y + h / 2;

	var unit = (Math.PI * 2) / sum;

	var startAngle = jMath.radians(this.startAngle);
	var explodedRadius = this.explodedRadius;

	// labels
	if (!this.labels || this.labels.visible === false) {
		return pieContext;
	}

	var center, exploded;

	var tBlocks = [];
	var startAngle = jMath.radians(this.startAngle);
	var outside = this.labelsPosition == 'outside';
	var hiddenSlices = this.hiddenSlices;
	var animLen = len - hiddenSlices.length;
	var skippedIndexes = 0;

	for (var i = 0; i < len; i++) {

		if ($.inArray(i, hiddenSlices) != -1) {
			skippedIndexes++;
			continue;
		}

		var vl = values[i];
		var percentage = 100 * vl / sum;
		var labelValue = vl;

		var endAngle = startAngle + vl * unit;

		switch (this.labels.valueType) {
			case 'percentage':
				labelValue = percentage;
				break;
		}

		if (vl == 0) {
			continue;
		}

		var text = this._getLabelText(labelValue);
		var angle = (startAngle + endAngle) / 2;

		var textBlock = new TextBlock(text);
		textBlock.textBaseline = 'top';
		$.extend(textBlock, this.labels);

		textBlock.context = {
			chart: this.chart,
			series: this,
			dataItem: data[i],
			index: i,
			value: vl,
			percentage: percentage
		};
		this.chart.elem.trigger('dataPointLabelCreating', textBlock);

		var size = textBlock.measure(this.chart.ctx);

		var cx = x;
		var cy = y;

		exploded = this.isExploded(i);

		if (exploded) {
			cy = y + explodedRadius * Math.sin(angle);
			cx = x + explodedRadius * Math.cos(angle);
		}

		if (outside) {
			center = this._getSliceCenter(cx, cy, angle, outerRadius + this.labelsExtend);
		}
		else {

			var nRadius = innerRadius ? (innerRadius + outerRadius) / 2 : outerRadius * 0.6;
			center = this._getSliceCenter(cx, cy, angle, nRadius);
		}

		textBlock.x = center.x - size.width / 2;
		textBlock.y = center.y - size.height / 2;

		startAngle = endAngle;

		if (!outside && this.isOverlap(textBlock, tBlocks)) {
			continue;
		}

		tBlocks.push(textBlock);

		segment = {
			pt: this._getSliceCenter(cx, cy, angle, outerRadius),
			angle: angle,
			index: i,
			animIndex: i - skippedIndexes,
			cx: cx,
			cy: cy
		};

		angle = jMath.normalizeAngle(angle + Math.PI / 2);
		segment.isLeft = angle >= Math.PI;

		textBlock.segment = segment;

		this._addShapeAnimation(textBlock, i - skippedIndexes, animLen);
	}

	$.extend(pieContext, {
		x: x,
		y: y,
		radius: radius,
		margin: margin,
		labels: tBlocks
	});

	return pieContext;
}

PieSeries.prototype._arrangeLabels = function (pieContext) {

	var txtBlocks = pieContext.labels;

	if (!txtBlocks || this.labelsPosition != 'outside') {
		return {
			margins: { h: this.margin, v: this.margin },
			lines: []
		};
	}

	var leftLabels = [];
	var rightLabels = [];

	var margins = this._calculateLabelsMargin(txtBlocks, pieContext);
	var radius = this._calcRadius(margins);

	var innerRadius = radius * this.innerExtent;
	var outerRadius = radius * this.outerExtent;

	pieContext.radius = outerRadius;

	var txtBlock, i, w,
        maxLeftWidth = minVl,
        maxRightWidth = minVl;

	for (i = 0; i < txtBlocks.length; i++) {

		txtBlock = txtBlocks[i];
		w = txtBlock.width;

		if (txtBlock.segment.isLeft) {
			leftLabels.push(txtBlock);
			maxLeftWidth = Math.max(maxLeftWidth, w);
		}
		else {
			rightLabels.push(txtBlock);
			maxRightWidth = Math.max(maxRightWidth, w);
		}
	}

	leftLabels.sort(this.labelComparator(true));
	rightLabels.sort(this.labelComparator(false));

	var lines = [];

	var angle, segment, center,
        exploded, cx, cy;

	var explodedRadius = this.explodedRadius;

	// left labels
	for (i = 0; i < leftLabels.length; i++) {
		txtBlock = leftLabels[i];
		segment = txtBlock.segment;

		// recalc
		cx = pieContext.x;
		cy = pieContext.y;
		angle = segment.angle;

		exploded = this.isExploded(segment.index);

		if (exploded) {
			cy += explodedRadius * Math.sin(angle);
			cx += explodedRadius * Math.cos(angle);
		}

		center = this._getSliceCenter(cx, cy, angle, outerRadius + this.labelsExtend);

		txtBlock.x = center.x - txtBlock.width - this.labelsExtend;
		txtBlock.y = center.y - txtBlock.height / 2;

		segment.pt = this._getSliceCenter(cx, cy, angle, outerRadius);
	}

	var distances = this._distancesBetweenLabels(leftLabels);
	this._distributeLabels(distances, leftLabels);

	for (i = 0; i < leftLabels.length; i++) {
		txtBlock = leftLabels[i];

		this._hLabelAlign(txtBlock, maxLeftWidth, maxRightWidth, pieContext);
		lines.push(this._addLabelLine(txtBlock, pieContext, txtBlocks.length));
	}

	// right labels
	for (i = 0; i < rightLabels.length; i++) {
		txtBlock = rightLabels[i];
		segment = txtBlock.segment;

		// recalc
		cx = pieContext.x;
		cy = pieContext.y;
		angle = segment.angle;

		exploded = this.isExploded(segment.index);

		if (exploded) {
			cy += explodedRadius * Math.sin(angle);
			cx += explodedRadius * Math.cos(angle);
		}

		center = this._getSliceCenter(cx, cy, angle, outerRadius + this.labelsExtend);

		txtBlock.x = center.x + this.labelsExtend;
		txtBlock.y = center.y - txtBlock.height / 2;

		segment.pt = this._getSliceCenter(cx, cy, angle, outerRadius);
	}

	distances = this._distancesBetweenLabels(rightLabels);
	this._distributeLabels(distances, rightLabels);

	for (i = 0; i < rightLabels.length; i++) {
		txtBlock = rightLabels[i];

		this._hLabelAlign(txtBlock, maxLeftWidth, maxRightWidth, pieContext);
		lines.push(this._addLabelLine(txtBlock, pieContext, txtBlocks.length));
	}

	return { margins: margins, lines: lines };
}

PieSeries.prototype.labelComparator = function (reverse) {
	reverse = (reverse) ? -1 : 1;

	return function (a, b) {

		var angleA = a.segment.angle;
		var angleB = b.segment.angle;

		var angleA = jMath.normalizeAngle(angleA + 3 * Math.PI / 2);
		var angleB = jMath.normalizeAngle(angleB + 3 * Math.PI / 2);

		return (angleA - angleB) * reverse;
	}
}

PieSeries.prototype._addLabelLine = function (txtBlock, pieContext, len) {

	var space = 4;
	var padding = 4;

	var isCircle = this.labelsAlign == 'circle';

	var segment = txtBlock.segment;
	var points = [];

	var radius = pieContext.radius;
	if (this.isExploded(segment.index)) {
		radius += this.explodedRadius;
	}

	var cx = pieContext.x;
	var cy = pieContext.y;

	points.push(segment.pt.x);
	points.push(segment.pt.y);

	var endX = txtBlock.x;
	var endY = txtBlock.y + txtBlock.height / 2;

	var crossing, middleX, sr;
	var circle = new Circle(cx - radius, cy - radius, radius);

	if (segment.isLeft) {
		endX += txtBlock.width + padding;
		middleX = endX + space;

		crossing = jMath.intersection({ x: cx, y: cy }, segment.pt, { x: endX, y: endY }, { x: middleX, y: endY });

		crossing = crossing || { x: middleX, y: endY };
		crossing.x = Math.max(crossing.x, middleX);

		if (circle.hitTest(crossing.x, crossing.y) || crossing.x > cx) {
			sr = cx - radius - space;

			if (isCircle) {
				if (sr > middleX) {
					points.push(sr);
					points.push(segment.pt.y);
				} else {
					points.push(segment.pt.x - space * 2);
					points.push(segment.pt.y);
				}
			}
			else {
				points.push(sr);
				points.push(segment.pt.y);
			}

			points.push(middleX);
			points.push(endY);
		}
		else {
			crossing.y = endY;

			points.push(crossing.x);
			points.push(crossing.y);
		}

	}
	else {
		endX -= padding;
		middleX = endX - space;

		crossing = jMath.intersection({ x: pieContext.x, y: pieContext.y }, segment.pt, { x: endX, y: endY }, { x: middleX, y: endY });

		crossing = crossing || { x: middleX, y: endY };
		crossing.x = Math.min(crossing.x, middleX);

		if (circle.hitTest(crossing.x, crossing.y) || crossing.x < cx) {
			sr = cx + radius + space;

			if (isCircle) {
				if (sr < middleX) {
					points.push(sr);
					points.push(segment.pt.y);
				}
				else {
					points.push(segment.pt.x + space * 2);
					points.push(segment.pt.y);
				}
			}
			else {
				points.push(sr);
				points.push(segment.pt.y);
			}

			points.push(middleX);
			points.push(endY);
		}
		else {
			crossing.y = endY;

			points.push(crossing.x);
			points.push(crossing.y);
		}
	}

	points.push(endX);
	points.push(endY);

	var polyline = new Polyline(points);
	polyline.lineWidth = this.leaderLineWidth;
	polyline.strokeStyle = this.leaderLineStrokeStyle;

	this._addShapeAnimation(polyline, segment.animIndex, len);

	return polyline;
}

PieSeries.prototype._renderSlices = function (shapes, margins) {

	var data = this.arrData;

	if (!data) {
		return;
	}

	var gArea = this.chart.gridArea;
	var w = gArea.width;
	var h = gArea.height;

	var values = this._getYValues();
	var len = values.length;
	var sum = this.getTotal();

	var radius = this._calcRadius(margins);

	if (radius < 0) {
		return;
	}

	var innerRadius = radius * this.innerExtent;
	var outerRadius = radius * this.outerExtent;

	var x = gArea.x + w / 2;
	var y = gArea.y + h / 2;

	var unit = (Math.PI * 2) / sum;
	var startAngle = jMath.radians(this.startAngle);
	var fillStyles = this.fillStyles;
	var explodedRadius = this.explodedRadius;
	var hiddenSlices = this.hiddenSlices;
	var animLen = len - hiddenSlices.length;
	var skippedIndexes = 0;

	var exploded;

	// slices
	for (var i = 0; i < len; i++) {

		if ($.inArray(i, hiddenSlices) != -1) {
			skippedIndexes++;
			continue;
		}

		var vl = values[i];
		var percentage = 100 * vl / sum;

		var endAngle = startAngle + vl * unit;

		var cx = x;
		var cy = y;

		exploded = this.isExploded(i);

		if (exploded) {
			var angle = (startAngle + endAngle) / 2;

			cy = y + explodedRadius * Math.sin(angle);
			cx = x + explodedRadius * Math.cos(angle);
		}

		var slice = new PieSlice(cx, cy, innerRadius, outerRadius, startAngle, endAngle);

		var context = {
			chart: this.chart,
			series: this,
			dataItem: data[i],
			index: i,
			value: vl,
			percentage: percentage
		};

		slice.context = context;
		this._setShapeSettings(slice, i);
		slice.fillStyle = this.getSliceColor(i);

		shapes.push(slice);

		this._addSliceAnimation(slice, i - skippedIndexes, animLen);

		startAngle = endAngle;
	}
}

PieSeries.prototype._distancesBetweenLabels = function (labels) {

	if (!labels || labels.length == 0) {
		return [];
	}

	var distances = [];

	var label;
	var firstLabel = labels[0];
	var gArea = this.chart.gridArea;
	var h = gArea.height;
	var y = gArea.y;

	distances.push(firstLabel.y - y);

	for (var i = 1; i < labels.length; i++) {
		label = labels[i];

		distances.push(label.y - firstLabel.y - firstLabel.height);

		firstLabel = label;
	}

	distances.push(y + h - firstLabel.y - firstLabel.height);

	return distances;
}

PieSeries.prototype._distributeLabels = function (distances, labels) {
	var count = distances.length,
        remaining,
        left,
        right,
        i;

	for (i = 0; i < count; i++) {
		left = right = i;
		remaining = -distances[i];
		while (remaining > 0 && (left >= 0 || right < count)) {
			remaining = this._takeDistance(distances, i, --left, remaining);
			remaining = this._takeDistance(distances, i, ++right, remaining);
		}
	}

	this._reflowLabels(distances, labels);
}

PieSeries.prototype._hLabelAlign = function (txtBlock, maxLeftWidth, maxRightWidth, pieContext) {

	var segment = txtBlock.segment;
	var isCircle = this.labelsAlign == 'circle';

	if (isCircle) {

		var x = pieContext.x;
		var y = pieContext.y;
		var currRadius = pieContext.radius + this.labelsExtend;

		if (this.isExploded(segment.index)) {
			currRadius += this.explodedRadius;
		}

		var t = Math.min(Math.abs(y - txtBlock.y), Math.abs(y - txtBlock.y - txtBlock.height));

		if (t < currRadius) {
			if (segment.isLeft) {
				txtBlock.x = x - txtBlock.width - Math.sqrt((currRadius * currRadius) - (t * t));
			}
			else {
				txtBlock.x = x + Math.sqrt((currRadius * currRadius) - (t * t));
			}
		}
	}
	else {

		var gArea = this.chart.gridArea;

		if (segment.isLeft) {
			txtBlock.x = gArea.x + maxLeftWidth - txtBlock.width;
		}
		else {
			txtBlock.x = gArea.x + gArea.width - maxRightWidth;
		}
	}
}

PieSeries.prototype._reflowLabels = function (distances, labels) {
	var labelsCount = labels.length,
        label;

	var gArea = this.chart.gridArea;
	var h = gArea.height;
	var y = gArea.y;

	distances[0] += 2;

	for (var i = 0; i < labelsCount; i++) {

		label = labels[i];
		y += distances[i];

		label.y = y;

		y += label.height;
	}
}

PieSeries.prototype._takeDistance = function (distances, anchor, position, amount) {

	if (distances[position] > 0) {
		var available = Math.min(distances[position], amount);
		amount -= available;
		distances[position] -= available;
		distances[anchor] += available;
	}

	return amount;
}

PieSeries.prototype._calculateLabelsMargin = function (txtBlocks, pieContext) {

	if (this.labelsPosition != 'outside') {
		return { h: 0, v: 0 };
	}

	var hMargin = pieContext.margin;
	var vMargin = this.margin;

	var labelsExtend = this.labelsExtend;

	for (var i = 0; i < txtBlocks.length; i++) {
		var txtBlock = txtBlocks[i];

		hMargin = Math.max(hMargin, txtBlock.width + 2 * labelsExtend);
		vMargin = Math.max(vMargin, txtBlock.height + labelsExtend);
	}

	return { h: hMargin, v: vMargin };
}

PieSeries.prototype._render = function (shapes) {

	if (!this.hasRealData || !this.isInScene()) {
		return;
	}

	var pieContext = this._createLabels(shapes);
	var result = this._arrangeLabels(pieContext);

	this._renderSlices(shapes, result.margins);

	if (pieContext.labels) {
		$.merge(shapes, pieContext.labels);
	}

	$.merge(shapes, result.lines);
}

PieSeries.prototype._calcRadius = function (margins) {

	var originalMargin = margins.v || this.margin;

	var gArea = this.chart.gridArea;
	var w = gArea.width - 2 * margins.h;
	var h = gArea.height - 2 * originalMargin;

	var radius;
	if (w < h) {
		radius = w / 2.0;
	}
	else {
		radius = h / 2.0;
	}

	if (this.expIndexes && this.expIndexes.length > 0) {
		radius -= this.explodedRadius;
	}

	return radius;
}

PieSeries.prototype.getSliceColor = function (index) {

	var fillStyles = this.fillStyles;

	if (fillStyles && fillStyles.length) {
		return fillStyles[index % fillStyles.length];
	}

	return this.palette.getColor(index);
}

PieSeries.prototype.isExploded = function (index) {
	var indexes = this.expIndexes;
	if (!indexes || !indexes.length) {
		return false;
	}

	return $.inArray(index, indexes) != -1;
}

PieSeries.prototype.isOverlap = function (textBlock, tBlocks) {

	for (var j = 0; j < tBlocks.length; j++) {
		var tBlock = tBlocks[j];
		if (tBlock.intersectWith(textBlock.x, textBlock.y, textBlock.width, textBlock.height)) {
			return true;
		}
	}

	return false;
}

PieSeries.prototype._getSliceCenter = function (x, y, angle, radius) {

	return { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) };
}

PieSeries.prototype._getLegendItems = function (options) {
	var items = [];

	if (!this.showInLegend) {
		return items;
	}

	var data = this.arrData;

	if (!data) {
		return items;
	}

	var values = this._getYValues();

	var title;

	var len = data.length;

	for (var i = 0; i < len; i++) {

		var vl = data[i];
		if (vl == null) {
			continue;
		}

		var showInScene = $.inArray(i, this.hiddenSlices) == -1;

		var vlY;

		if ($.isArray(vl) == false) {
			var index = i + 1;
			title = index.toString();
		}
		else {
			title = vl[0];
		}

		var marker = new Marker();

		if (showInScene) {
			marker.fillStyle = this.getSliceColor(i);
		}
		else {
			marker.fillStyle = options.inactiveFillStyle;
		}

		var context = {
			chart: this.chart,
			series: this,
			dataItem: vl,
			index: i,
			value: values[i]
		};

		var itemOptions = $.extend(false, {}, options, { context: context, text: title, marker: marker });

		if (!showInScene) {
			itemOptions.textFillStyle = options.inactiveTextFillStyle;
			itemOptions.textStrokeStyle = options.inactiveTextStrokeStyle;
		}

		var item = new LegendItem(itemOptions);
		item.chart = this.chart;
		item.series = this;
		items.push(item);
	}

	return items;
}

PieSeries.prototype._initColors = function (color, palette) {
	this.palette = palette;
}

PieSeries.prototype._getTooltip = function (context) {

	// var percentage = this.getPercentage(context.value);
	var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

	var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

	var title = context.dataItem[0]

	if (title) {
		tooltip = jMath.replaceTextForTooltip(title) + '<br/>' + tooltip;
	}

	return tooltip;
}

PieSeries.prototype._addSliceAnimation = function (slice, i, len) {

	var anOptions = this._getAnimation();

	if (!anOptions || anOptions.enabled === false) {
		return;
	}

	var animation = new Animation(anOptions, slice, "endAngle", slice.startAngle, slice.endAngle);

	var duration = animation.duration / len;
	var delayTime = animation.delayTime + i * duration;

	animation.delayTime = delayTime;
	animation.duration = duration;
	this.chart.storyboard.addAnimation(animation);
}

PieSeries.prototype._hideFromLegend = function (context) {

	var index = context.index;
	var hiddenSlices = this.hiddenSlices;

	var arrIndex = $.inArray(index, hiddenSlices);
	if (arrIndex > -1) {
		hiddenSlices.splice(arrIndex, 1);
	}
	else {
		hiddenSlices.push(index);
	}
}

PieSeries.prototype._handleEvent = function (name, shape) {

	if (!this.allowExplodeSlices) {
		return;
	}

	var context = shape.context;
	var index = context.index;
	var series = this;
	var expIndexes = series.expIndexes;
	var chart = series.chart;

	switch (name) {
		case "MouseDown":
		case "TouchEnd":
			var indexInArr = $.inArray(index, expIndexes);
			if (indexInArr == -1) {
				expIndexes.push(index);
			}
			else {
				expIndexes.splice(indexInArr, 1);
			}

			var animation = chart.options.animation;
			chart.options.animation = null;
			chart.update();
			chart._processMouseEvents();
			chart.options.animation = animation;
			break;
	}
}

PieSeries.prototype.setOptions = function (options) {
	Series.prototype.setOptions.call(this, options);

	if (this.allowExplodeSlices) {
		this.cursor = this.cursor || 'pointer';
	}
}

PieSeries.prototype.getTotal = function () {
	var values = this._getYValues();

	var sum = 0;
	for (var i = 0; i < values.length; i++) {
		if ($.inArray(i, this.hiddenSlices) != -1) {
			continue;
		}

		sum += values[i];
	}

	return sum;
}

PieSeries.prototype.getPercentage = function (vl) {
	var sum = this.getTotal();
	return 100 * vl / sum;
}

/**
 * @class Chart.Series.Doughnut
 * @extends Chart.Series.Pie
 * 
 * The Doughnut chart type is similar to the Pie chart type, except that it has a hole in the center. 
 */
function DoughnutSeries(options) {

	PieSeries.call(this, options);

	var defs = $.extend(true, {}, this.defaults, {
		/**
		* @cfg {Number} innerRadius
		* Specifies the inner extent (from 0 to 1) of the circle that is used for the doughnut hole. 
		* The larger the value of innerExtent, the larger the doughnut hole of the chart. 
		*/
		innerExtent: 0.5,
		/**
		* @cfg {Number} outerRadius
		* Specifies the outer extent (from 0 to 1) of the doughnut circle.
		*/
		outerExtent: 1
	});

	this.defaults = defs;

	this.setOptions(options);
}

DoughnutSeries.prototype = new PieSeries();
DoughnutSeries.constructor = DoughnutSeries;

/**
 * @class Chart.Series.Scatter
 * @extends Chart.Series.Line
 * 
 * A scatter chart (or scatter graph) is used to show correlations between two sets of values. 
 * It is often used for pricing data and scientific data modeling, though it's typically not used 
 * with time-dependent data (where a line chart is more suitable).
 */
function ScatterSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: { type: 'diamond' }
    });
    this.defaults = defs;

    Series.call(this, options);
}

ScatterSeries.prototype = new LineSeries();
ScatterSeries.constructor = ScatterSeries;

ScatterSeries.prototype._createShape = function (pts, shapes) {

    this._createErrorBars(shapes);

    return null;
}

/**
 * @class Chart.Series.Spline
 * @extends Chart.Series.Line
 * 
 * The Spline chart type is a Line chart that plots a fitted curve through each data point in a series.
 */
function SplineSeries(options) {
    LineSeries.call(this, options);
}

SplineSeries.prototype = new LineSeries();
SplineSeries.constructor = SplineSeries;

SplineSeries.prototype._createShape = function (pts, shapes) {

    this._createErrorBars(shapes);

    var polyline = new Curve(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.StepLine
 * @extends Chart.Series.Line
 * 
 * The Step Line chart type is similar to the Line chart type, but it does not use the shortest distance to connect two data points. 
 * Instead, this chart type uses vertical and horizontal lines to connect the data points in a series forming a step-like progression. 
 */
function StepLineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null,

        /**
        * @cfg {String} stepDirection
        * Specifies the step direction - 'forward' or 'backward'.
        */
        stepDirection: 'forward'
    });

    this.defaults = defs;

    LineSeries.call(this, options);
}

StepLineSeries.prototype = new LineSeries();
StepLineSeries.constructor = StepLineSeries;

StepLineSeries.prototype._createShape = function (pts, shapes) {

    var x, y, x1, y1,
        i, j,
        newPts = [],
        len = pts.length;

    var isForward = this.stepDirection == 'forward';

    for (i = 0; i < len; i += 2) {

        x = pts[i];
        y = pts[i + 1];

        if (!x || !y) {
            continue;
        }

        newPts.push(x);
        newPts.push(y);

        if (i >= len - 2) {
            break;
        }

        x1 = null;
        y1 = null;

        for (j = i + 2; j < len; j += 2) {
            x1 = pts[j];
            y1 = pts[j + 1];

            if (x1 && y1) {
                break;
            }
        }

        if (j != i + 2 && this.nullHandling == 'break') {
            newPts.push(null);
            newPts.push(null);
        }
        else if (x1 && y) {

            if (isForward) {
                newPts.push(x1);
                newPts.push(y);
            }
            else {
                newPts.push(x);
                newPts.push(y1);
            }
        }

        i = j - 2;
    }

    var polyline = new Polyline(newPts);
    polyline.isStepLine = true;
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.StepArea
 * @extends Chart.Series.Line
 * 
 * The Step Area chart type is similar to the Area chart type, but it does not use the shortest distance to connect two data points. 
 * Instead, this chart type uses vertical and horizontal lines to connect the data points in a series forming a step-like progression. 
 */
function StepAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null,

        /**
        * @cfg {String} stepDirection
        * Specifies the step direction - 'forward' or 'backward'.
        */
        stepDirection: 'forward'
    });
    this.defaults = defs;

    Series.call(this, options);
}

StepAreaSeries.prototype = new LineSeries();
StepAreaSeries.constructor = StepAreaSeries;

StepAreaSeries.prototype._createShape = function (pts, shapes) {

    var x, y,
        newPts = [],
        len = pts.length;

    for (var i = 0; i < len; i += 2) {

        x = pts[i];
        y = pts[i + 1];
        newPts.push(x);
        newPts.push(y);

        if (i >= len - 2) {
            break;
        }

        newPts.push(pts[i + 2]);
        newPts.push(y);
    }

    var linePts = [];
    $.merge(linePts, newPts);

    var polyline = new Polyline(linePts);
    polyline.isStepLine = true;
    this._setShapeSettings(polyline);

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);

    var polygon = new Area(newPts, crossPos);
    polygon.isStepLine = true;
    this._setShapeSettings(polygon);
    polygon.lineWidth = 0;
    shapes.push(polygon);

    shapes.push(polyline);

    this._addLengthAnimation(polygon);
    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.StackedLine
 * @extends Chart.Series.Line
 * 
 * The Stacked Line chart type is a Line chart that stacks two or more data series on top of one another. 
 */
function StackedLineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {String} stackedGroupName
         * Specifies the name of the stacked group.
         *
         * To place multiple series in the same stacked group, assign the same name to them.
         * 
         * To show multiple stacks, assign different names to multiple series.
         */
        stackedGroupName: ''
    });

    this.defaults = defs;

    LineSeries.call(this, options);

    this.hasErrorBars = false;
}

StackedLineSeries.prototype = new LineSeries();
StackedLineSeries.constructor = StackedLineSeries;

StackedLineSeries.prototype._initData = function () {

    this._initStackedData(this.type);
}

StackedLineSeries.prototype._initVisibleData = function () {

    this._initVisibleStackedData(this.type);
}

StackedLineSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var clust = this.chart.series._findStackedClusters(this, this.type);
    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var axisType = this.xAxisType;

    var x, y, vl, vlX, vlY, contextX;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        vlY = this._scaleValue(stackedSeries, vl.value, xValue);

        if (axisType == 'CategoryAxis') {
            vlX = i + 0.5;
            contextX = this.realXAxis._getValue(i);
        }
        else {
            vlX = data[i][iX];
            contextX = vlX;
        }

        x = this.realXAxis.getPosition(vlX);
        y = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

        var context = {
            chart: this.chart,
            series: this,
            dataItem: vl,
            index: i,
            x: contextX,
            y: vlY,
            value: dataValue,
            percentage: percentage
        };

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: contextX,
                y: vlY,
                value: dataValue,
                percentage: percentage
            });
        }

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, null, vlY, lblOffset, context);
    }

    var polyline = this._createShape(pts, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

StackedLineSeries.prototype._getSeriesFromThisType = function () {
    return this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);
}

StackedLineSeries.prototype._getTooltip = function (context) {
    var tooltip = "<b>" + context.value + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

StackedLineSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {
    return value;
}

StackedLineSeries.prototype._createShape = function (pts, shapes) {
    var polyline = new Polyline(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.StackedSpline
 * @extends Chart.Series.StackedLine
 * 
 * The Stacked Spline chart type is a Spline chart that stacks two or more data series on top of one another. 
 */
function StackedSplineSeries(options) {
    StackedLineSeries.call(this, options);
}

StackedSplineSeries.prototype = new StackedLineSeries();
StackedSplineSeries.constructor = StackedSplineSeries;

StackedSplineSeries.prototype._createShape = function (pts, shapes) {
    var polyline = new Curve(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.Stacked100Spline
 * @extends Chart.Series.StackedSpline
 * 
 * The 100% Stacked Spline chart type displays multiple series of data as stacked splines. 
 * The cumulative proportion of each stacked element is always 100% of the Y axis.
 */
function Stacked100SplineSeries(options) {
    StackedSplineSeries.call(this, options);
}

Stacked100SplineSeries.prototype = new StackedSplineSeries();
Stacked100SplineSeries.constructor = Stacked100SplineSeries;

Stacked100SplineSeries.prototype._initVisibleData = function () {

    StackedSplineSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100SplineSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100SplineSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Stacked100Line
 * @extends Chart.Series.StackedLine
 * 
 * The 100% Stacked Line chart type displays multiple series of data as stacked lines. 
 * The cumulative proportion of each stacked element is always 100% of the Y axis. 
 */
function Stacked100LineSeries(options) {
    StackedLineSeries.call(this, options);
}

Stacked100LineSeries.prototype = new StackedLineSeries();
Stacked100LineSeries.constructor = Stacked100LineSeries;

Stacked100LineSeries.prototype._initVisibleData = function () {

    StackedLineSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100LineSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100LineSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.StackedArea
 * @extends Chart.Series.StackedLine
 * 
 * The Stacked Area chart type is an Area chart that stacks two or more data series on top of one another. 
 */
function StackedAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null,
        /**
         * @cfg {String} stackedGroupName
         * Specifies the name of the stacked group.
         *
         * To place multiple series in the same stacked group, assign the same name to them.
         * 
         * To show multiple stacks, assign different names to multiple series.
         */
        stackedGroupName: ''
    });

    this.defaults = defs;

    Series.call(this, options);
}

StackedAreaSeries.prototype = new StackedLineSeries();
StackedAreaSeries.constructor = StackedAreaSeries;

StackedAreaSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var clust = this.chart.series._findStackedClusters(this, this.type);
    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);

    var axisType = this.xAxisType;

    var len = data.length;

    var pts1 = [];
    var pts2 = [];

    var cPoints = [];

    var x, y1, y2, vl, vlX, vlY1, vlY2, contextX;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        if (axisType == 'CategoryAxis') {
            vlX = i + 0.5;
            contextX = this.realXAxis._getValue(i);
        }
        else {
            vlX = data[i][0];
            contextX = vlX;
        }

        vlY1 = this._scaleValue(stackedSeries, vl.value, xValue);

        x = this.realXAxis.getPosition(vlX);
        y1 = this.realYAxis.getPosition(vlY1);

        pts1.push(x);
        pts1.push(y1);

        if (clust.index != 0) {
            y2 = this._getPrevStackedPosition(stackedSeries, clust.index, xValue, 0, this.realYAxis, vlY1 >= 0);
            pts2.push(x);
            pts2.push(y2);
        }

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

       
        cPoints.push({
            dataItem: vl,
            index: i,
            x: contextX,
            y: vlY1,
            value: dataValue,
            percentage: percentage
        });
    }

    var polyline = this._createShape(pts1, pts2, shapes);

    if (polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
}

StackedAreaSeries.prototype._isAnchoredToOrigin = function () {
    return true;
}

StackedAreaSeries.prototype._createShape = function (pts1, pts2, shapes) {

    if (!pts2.length) {
        return AreaSeries.prototype._createShape.call(this, pts1, shapes);
    }

    var polygon = new RangeShape(pts1, pts2, false, true);
    this._setShapeSettings(polygon);

    shapes.push(polygon);

    this._addLengthAnimation(polygon);

    return polygon;
}

/**
 * @class Chart.Series.StackedSplineArea
 * @extends Chart.Series.StackedArea
 * 
 * The Stacked Spline Area chart type is a Spline Area chart that stacks two or more data series on top of one another. 
 */
function StackedSplineAreaSeries(options) {
    StackedAreaSeries.call(this, options);
}

StackedSplineAreaSeries.prototype = new StackedAreaSeries();
StackedSplineAreaSeries.constructor = StackedSplineAreaSeries;

StackedSplineAreaSeries.prototype._createShape = function (pts1, pts2, shapes) {

    if (!pts2.length) {
        return SplineAreaSeries.prototype._createShape.call(this, pts1, shapes);
    }

    var polygon = new RangeShape(pts1, pts2, true, true);
    this._setShapeSettings(polygon);

    shapes.push(polygon);

    this._addLengthAnimation(polygon);

    return polygon;
}

/**
 * @class Chart.Series.Stacked100Area
 * @extends Chart.Series.StackedArea
 * 
 * The 100% Stacked Area chart type displays multiple series of data as stacked areas. 
 * The cumulative proportion of each stacked element is always 100% of the Y axis. 
 */
function Stacked100AreaSeries(options) {
    StackedAreaSeries.call(this, options);
}

Stacked100AreaSeries.prototype = new StackedAreaSeries();
Stacked100AreaSeries.constructor = Stacked100AreaSeries;

Stacked100AreaSeries.prototype._initVisibleData = function () {

    StackedLineSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100AreaSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100AreaSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Stacked100SplineArea
 * @extends Chart.Series.StackedSplineArea
 * 
 * The 100% Stacked Spline Area chart type displays multiple series of data as stacked spline areas. 
 * The cumulative proportion of each stacked element is always 100% of the Y axis. 
 */
function Stacked100SplineAreaSeries(options) {
    StackedSplineAreaSeries.call(this, options);
}

Stacked100SplineAreaSeries.prototype = new StackedSplineAreaSeries();
Stacked100SplineAreaSeries.constructor = Stacked100SplineAreaSeries;

Stacked100SplineAreaSeries.prototype._initVisibleData = function () {

    StackedLineSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100SplineAreaSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100SplineAreaSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.StackedColumn
 * @extends Chart.Series.Column
 * 
 * The Stacked Column chart type is used to compare the contribution of each value to a total across categories.
 */
function StackedColumnSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {String} stackedGroupName
         * Specifies the name of the stacked group.
         *
         * To place multiple series in the same stacked group, assign the same name to them.
         * 
         * To show multiple stacks, assign different names to multiple series.
         */
        stackedGroupName: ''
    });

    this.defaults = defs;

    ColumnSeries.call(this, options);

    this.hasErrorBars = false;
}

StackedColumnSeries.prototype = new ColumnSeries();
StackedColumnSeries.constructor = StackedColumnSeries;

StackedColumnSeries.prototype._initData = function () {

    this._initStackedData(this.type);
}

StackedColumnSeries.prototype._initVisibleData = function () {

    this._initVisibleStackedData(this.type);
}


StackedColumnSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    if (!data) {
        return;
    }

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);
    crossPos = Math.round(crossPos);

    var clust = this.chart.series._findStackedClusters(this, this.type);
    var len = data.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var groupW = gAreaWidth / len;
    var columnW = groupW / clust.groupCount;

    var w = Math.round(this.pointWidth * columnW);

    var totalColumnWidth = clust.groupCount * w;
    var offset = (groupW - totalColumnWidth) / 2;

    offset = Math.round(offset + clust.groupIndex * w);

    w = Math.max(w, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);

    var lblOffset = this.getLabelsOffset();

    var x, y, vl;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        var vlY = this._scaleValue(stackedSeries, vl.value, xValue);

        x = i;

        x = Math.round(this.realXAxis.getCatPosition(x) + offset);
        y = Math.round(this.realYAxis.getPosition(vlY));

        var prevPos = this._getPrevStackedPosition(stackedSeries, clust.index, xValue, crossPos, this.realYAxis, vlY >= 0);

        var mY = y;
        var height;
        if (y <= prevPos) {
            height = prevPos - y;
        }
        else {
            height = y - prevPos;
            y = prevPos;
        }

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            value: dataValue,
            x: this.realXAxis._getValue(i),
            y: vlY,
            percentage: percentage
        };

        var rect = new Rectangle(x, y, w, height);
        rect.context = context;
        rect.center = { x: Math.round(x + w / 2), y: Math.round(mY) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, clust.index, clust.count);

        x += w / 2;

        if (this.markers && this.realYAxis.isValueVisible(vlY)) {
            var marker = this._getMarker(x, mY, null, vlY, null, i, context);
            markers.push(marker);

            this._addShapeAnimation(marker, clust.index, clust.count);
        }

        if (this.labels && this.labels.visible !== false &&
            vl.actualValue != 0 &&
            this.realXAxis.isValueVisible(i + 0.5)) {

            var labelValue = dataValue;

            switch (this.labels.valueType) {
                case 'percentage':
                    labelValue = percentage;
                    break;
            }

            var isOutside = this.labels.position == 'outside';
            var tbOffset = isOutside ? lblOffset : -height / 2;

            var tBlock = this._getDataPointLabel(vl.actualValue, x, mY, tbOffset, labelValue);
            if (!isOutside) {
                tBlock.textBaseline = 'middle';
            }

            tBlock.context = context;
            this.chart.elem.trigger('dataPointLabelCreating', tBlock);

            txtBlocks.push(tBlock);

            this._addShapeAnimation(tBlock, clust.index, clust.count);
        }
    }

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

StackedColumnSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    if (!data) {
        return;
    }

    var gArea = this.chart.gridArea;
    var top = gArea.y;
    var bottom = gArea.y + gArea.height;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, top, bottom);
    crossPos = Math.round(crossPos);

    var clust = this.chart.series._findStackedClusters(this, this.type);
    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);

    var len = data.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var columnW = this._calcColumnScale(stackedSeries) * gAreaWidth;

    var w = this.pointWidth * columnW;
    w = Math.max(w, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vl;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        var vlY = this._scaleValue(stackedSeries, vl.value, xValue);

        x = data[i][0];

        x = Math.round(this.realXAxis.getPosition(x));
        y = Math.round(this.realYAxis.getPosition(vlY));

        var prevPos = this._getPrevStackedPosition(stackedSeries, clust.index, xValue, crossPos, this.realYAxis, vlY >= 0);

        var mY = y;
        var height;
        if (y <= prevPos) {
            height = prevPos - y;
        }
        else {
            height = y - prevPos;
            y = prevPos;
        }

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            value: dataValue,
            x: data[i][0],
            y: vlY,
            percentage: percentage
        };

        var locX = x - w / 2;

        var rect = new Rectangle(locX, y, w, height);
        rect.context = context;
        rect.center = { x: Math.round(x), y: Math.round(mY) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, clust.index, clust.count);

        if (this.markers && this.realYAxis.isValueVisible(vlY)) {
            var marker = this._getMarker(x, mY, null, vlY, null, i, context);
            markers.push(marker);

            this._addShapeAnimation(marker, clust.index, clust.count);
        }

        if (this.labels && this.labels.visible !== false && vl.actualValue != 0) {

            var labelValue = dataValue;

            switch (this.labels.valueType) {
                case 'percentage':
                    labelValue = percentage;
                    break;
            }

            var isOutside = this.labels.position == 'outside';
            var tbOffset = isOutside ? lblOffset : -height / 2;

            var tBlock = this._getDataPointLabel(vl.actualValue, x, mY, tbOffset, labelValue);
            if (!isOutside) {
                tBlock.textBaseline = 'middle';
            }

            tBlock.context = context;
            this.chart.elem.trigger('dataPointLabelCreating', tBlock);

            txtBlocks.push(tBlock);

            this._addShapeAnimation(tBlock, clust.index, clust.count);
        }
    }

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

StackedColumnSeries.prototype._getSeriesFromThisType = function () {
    return this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);
}

StackedColumnSeries.prototype._getTooltip = function (context) {
    var tooltip = "<b>" + context.value + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

StackedColumnSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {
    return value;
}

/**
 * @class Chart.Series.StackedBar
 * @extends Chart.Series.Bar
 * 
 * The Stacked Bar chart type displays series of the same chart type as stacked bars.
 */
function StackedBarSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {String} stackedGroupName
         * Specifies the name of the stacked group.
         *
         * To place multiple series in the same stacked group, assign the same name to them.
         * 
         * To show multiple stacks, assign different names to multiple series.
         */
        stackedGroupName: ''
    });

    this.defaults = defs;

    BarSeries.call(this, options);

    this.hasErrorBars = false;
}

StackedBarSeries.prototype = new BarSeries();
StackedBarSeries.constructor = StackedBarSeries;

StackedBarSeries.prototype._initData = function () {

    this._initStackedData(this.type);
}

StackedBarSeries.prototype._initVisibleData = function () {

    this._initVisibleStackedData(this.type);
}

StackedBarSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    if (!data) {
        return;
    }

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = left + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);
    crossPos = Math.round(crossPos);

    var clust = this.chart.series._findStackedClusters(this, this.type);
    var len = data.length;

    var gAreaHeight = gArea.height / this.realXAxis.getZoom();

    var groupH = gAreaHeight / len;
    var barH = groupH / clust.groupCount;

    var h = Math.round(this.pointWidth * barH);

    var totalBarHeight = clust.groupCount * h;
    var offset = (groupH - totalBarHeight) / 2;

    offset = Math.round(offset + clust.groupIndex * h);

    h = Math.max(h, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);

    var lblOffset = this.getLabelsOffset() + 2;

    var x, y, vl;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        var vlY = this._scaleValue(stackedSeries, vl.value, xValue);

        x = i;

        y = Math.round(this.realXAxis.getCatPosition(x) - offset - h);
        x = Math.round(this.realYAxis.getPosition(vlY));

        var prevPos = this._getPrevStackedPosition(stackedSeries, clust.index, xValue, crossPos, this.realYAxis, vlY >= 0);

        var mX = x;
        var width;
        if (x <= prevPos) {
            width = prevPos - x;
        }
        else {
            width = x - prevPos;
            x = prevPos;
        }

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            value: dataValue,
            x: this.realXAxis._getValue(i),
            y: vlY,
            percentage: percentage
        };

        var rect = new Rectangle(x, y, width, h);
        rect.context = context;
        rect.center = { x: Math.round(mX), y: Math.round(y + h / 2) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, clust.index, clust.count);

        y += h / 2;

        if (this.markers && this.realYAxis.isValueVisible(vlY)) {
            var marker = this._getMarker(mX, y, null, vlY, null, i, context);
            markers.push(marker);

            this._addShapeAnimation(marker, clust.index, clust.count);
        }

        if (this.labels &&
            this.labels.visible !== false &&
            vl.actualValue != 0 && 
            this.realXAxis.isValueVisible(i + 0.5)) {

            var labelValue = dataValue;

            switch (this.labels.valueType) {
                case 'percentage':
                    labelValue = percentage;
                    break;
            }

            var isOutside = this.labels.position == 'outside';
            var tbOffset = isOutside ? lblOffset : -width / 2;

            var tBlock = this._getDataPointLabel(vl.actualValue, mX, y, tbOffset, labelValue);

            if (!isOutside) {
                tBlock.textBaseline = 'middle';
                tBlock.textAlign = 'center';
            }

            tBlock.context = context;
            this.chart.elem.trigger('dataPointLabelCreating', tBlock);

            txtBlocks.push(tBlock);

            this._addShapeAnimation(tBlock, clust.index, clust.count);
        }
    }

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

StackedBarSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    if (!data) {
        return;
    }

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = left + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);
    crossPos = Math.round(crossPos);

    var stackedSeries = this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);
    var clust = this.chart.series._findStackedClusters(this, this.type);

    var len = data.length;

    var gAreaHeight = gArea.height / this.realXAxis.getZoom();

    var series = this._getSeriesFromThisType();
    var groupH = this._calcColumnScale(series) * gAreaHeight;

    var h = this.pointWidth * groupH;
    h = Math.max(h, this.minimumWidth);

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset() + 2;

    var x, y, vl;

    for (var i = 0; i < len; i++) {

        vl = data[i];
        if (vl == null) {
            continue;
        }

        var xValue = this._getXValue(vl, i);

        vl = this.dataValues[xValue];
        if (vl == null || vl.value == null) {
            continue;
        }

        var vlY = this._scaleValue(stackedSeries, vl.value, xValue);

        x = data[i][0];

        y = Math.round(this.realXAxis.getCatPosition(x));
        x = Math.round(this.realYAxis.getPosition(vlY));

        var prevPos = this._getPrevStackedPosition(stackedSeries, clust.index, xValue, crossPos, this.realYAxis, vlY >= 0);

        var mX = x;
        var width;
        if (x <= prevPos) {
            width = prevPos - x;
        }
        else {
            width = x - prevPos;
            x = prevPos;
        }

        var dataValue = vl.actualValue;

        var total = this._getStackedTotal(stackedSeries, xValue);
        var sum = dataValue > 0 ? total.positive : total.negative;
        var percentage = sum != 0 ? 100 * Math.abs(dataValue) / Math.abs(sum) : 0;

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            value: dataValue,
            x: data[i][0],
            y: vlY,
            percentage: percentage
        };

        var locY = y - h / 2;

        var rect = new Rectangle(x, locY, width, h);
        rect.context = context;
        rect.center = { x: Math.round(mX), y: Math.round(y) };
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, clust.index, clust.count);

        if (this.markers && this.realYAxis.isValueVisible(vlY)) {
            var marker = this._getMarker(mX, y, null, vlY, null, i, context);
            markers.push(marker);

            this._addShapeAnimation(marker, clust.index, clust.count);
        }

        if (this.labels && this.labels.visible !== false && vl.actualValue != 0) {

            var labelValue = dataValue;

            switch (this.labels.valueType) {
                case 'percentage':
                    labelValue = percentage;
                    break;
            }

            var isOutside = this.labels.position == 'outside';
            var tbOffset = isOutside ? lblOffset : -width / 2;

            var tBlock = this._getDataPointLabel(vl.actualValue, mX, y, tbOffset, labelValue);

            if (!isOutside) {
                tBlock.textBaseline = 'middle';
                tBlock.textAlign = 'center';
            }

            tBlock.context = context;
            this.chart.elem.trigger('dataPointLabelCreating', tBlock);

            txtBlocks.push(tBlock);

            this._addShapeAnimation(tBlock, clust.index, clust.count);
        }
    }

    $.merge(shapes, markers);
    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

StackedBarSeries.prototype._getSeriesFromThisType = function () {
    return this.chart.series._getStackedSeriesFromType(this.type, this.stackedGroupName);
}

StackedBarSeries.prototype._getTooltip = function (context) {
    var tooltip = "<b>" + context.value + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

StackedBarSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {
    return value;
}

/**
 * @class Chart.Series.Stacked100Column
 * @extends Chart.Series.StackedColumn
 * 
 * This chart type displays multiple data series as stacked columns, 
 * and the cumulative proportion of each stacked element always totals 100%.
 * 
 * 
 * The 100% stacked column chart is useful for measuring multiple series as a proportion versus time. 
 * For example, use this chart type for displaying the proportion of a monthly mortgage payment that is applied to 
 * interest and principal over time. In this example, the mortgage payment amount represents 100%, 
 * while the interest and the principal values are the two stacked elements that make up one column. 
 * 
 */
function Stacked100ColumnSeries(options) {
    StackedColumnSeries.call(this, options);
}

Stacked100ColumnSeries.prototype = new StackedColumnSeries();
Stacked100ColumnSeries.constructor = Stacked100ColumnSeries;

Stacked100ColumnSeries.prototype._initVisibleData = function () {

    StackedColumnSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100ColumnSeries.prototype._getPixelMargins = function (axis) {

    if (axis.isVertical() || !this.hasData()) {
        return { left: 0, right: 0 };
    }

    var offset = 4;

    var series = this._getSeriesFromThisType();
    var columnScale = this._calcColumnScale(series);

    var length = axis.length;

    var width = 0.5 * columnScale * length + offset;

    return { left: width, right: width };
}

Stacked100ColumnSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100ColumnSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Stacked100Bar
 * @extends Chart.Series.StackedBar
 * 
 * This chart type displays multiple data series as stacked bars, and the cumulative proportion of 
 * each stacked element always totals 100%.
 * 
 * 
 * The 100% stacked bar chart is useful for measuring multiple series as a proportion vs. time. 
 * For example, use this chart type for displaying the proportion of a monthly mortgage payment that is applied 
 * to interest and principal over time. In this example, the mortgage payment amount represents 100%, 
 * while the interest and the principal values are the two stacked elements that make up one bar.
 * 
 */
function Stacked100BarSeries(options) {
    StackedBarSeries.call(this, options);
}

Stacked100BarSeries.prototype = new StackedBarSeries();
Stacked100BarSeries.constructor = StackedBarSeries;

Stacked100BarSeries.prototype._initVisibleData = function () {

    StackedBarSeries.prototype._initVisibleData.call(this);

    this.min = 0;
    this.max = 100;
}

Stacked100BarSeries.prototype._getPixelMargins = function (axis) {

    if (axis.isVertical() == false || !this.hasData()) {
        return { left: 0, right: 0 };
    }

    var offset = 4;

    var series = this._getSeriesFromThisType();
    var columnScale = this._calcColumnScale(series);

    var length = axis.length;

    var width = 0.5 * columnScale * length + offset;

    return { left: width, right: width };
}

Stacked100BarSeries.prototype._scaleValue = function (stackedSeries, value, xValue) {

    var total = this._getStackedTotal(stackedSeries, xValue).positive || 1;

    return 100 * value / total;
}

Stacked100BarSeries.prototype._getTooltip = function (context) {

    var percentage = this.chart.stringFormat(context.percentage, '%.2f%%');

    var tooltip = "<b>" + context.value + ' (' + percentage + ')' + "</b><br/>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<span style="color:' + color + '">' + this._getTooltipTitle() + '</span>: ' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.RangeColumn
 * @extends Chart.Series.Series
 * 
 * The Range Column chart type displays a range of data by plotting two Y values per data point. 
 * Each Y value used is drawn as the upper, and lower bounds of a column. This is similar to the Range Bar chart, 
 * except the columns are positioned vertically. The range between the Y values 
 * can be filled with color, information, or even an image. 
 */
function RangeColumnSeries(options) {
    ColumnSeries.call(this, options);

    /**
    * @cfg {String} priceDownFillStyle
    * Specifies the price down fill style.
    */
    /**
     * @cfg {String} priceUpFillStyle
     * Specifies the price up fill style.
     */

    /**
    * @cfg {String/Chart.DataField} xValuesField
    * Specifies the data item field containing the X value.
    */

    /**
    * @cfg {String/Chart.DataField} fromValuesField
    * Specifies the data item field containing the From value.
    */

    /**
    * @cfg {String/Chart.DataField} toValuesField
    * Specifies the data item field containing the To value.
    */

	/**
	* @cfg {String/Chart.DataField} labelValuesField
	* Specifies the data item field containing the Label value.
	*/

    /**
     * @cfg {String} xValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

    /**
     * @cfg {String} fromValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

    /**
     * @cfg {String} toValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

	/**
	 * @cfg {String} labelValuesType
	* Specifies the data type for automatic conversion from received inline data to the required value.
	*
	* Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
	*/

    /**
    * @cfg {String} axisX
    * Specifies the x-axis name that this series belong to.
    */
    /**
    * @cfg {String} axisY
    * Specifies the y-axis name that this series belong to.
    */

    /**
    * @cfg {String/Common.Gradient[]} fillStyles
    * Specifies series fill styles - ['red', 'blue'].
    */

    /**
    * @cfg {number} pointWidth
    * Specifies the width of the columns - from 0 to 1
    * 
    * Defaults to: 0.6
    */

    /**
    * @cfg {number} minimumWidth
    * Specifies the minimum width of the columns in pixels.
    * 
    * Defaults to: 1
    */
}

RangeColumnSeries.prototype = new ColumnSeries();
RangeColumnSeries.constructor = RangeColumnSeries;

RangeColumnSeries.prototype._initXYData = function () {
    this._initXYDataRange(1, 3);
}

RangeColumnSeries.prototype._initCatValueData = function () {
    this._initCatValueDataRange(1, 3);
}

RangeColumnSeries.prototype._initDateValueData = function () {
    this._initDateValueDataRange(1, 3);
}

RangeColumnSeries.prototype._initVisibleCatValueData = function () {
    this._initVisibleCatValueDataRange(1, 3);
}

RangeColumnSeries.prototype._initVisibleXYData = function () {
    this._initVisibleXYDataRange(1, 3);
}

RangeColumnSeries.prototype._processData = function () {
    this._processDataXYZ();
}

RangeColumnSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;
    var gArea = this.chart.gridArea;
    var cats = this.categories;
    var len = cats.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();
    var groupW = gAreaWidth / len;

    var w = Math.round(this.pointWidth * groupW);
    var offset = Math.round((groupW - w) / 2);

    w = Math.max(w, this.minimumWidth);

    var txtBlocks = [];
    var x, y1, y2, vlX, vlY1, vlY2;

    for (var i = 0; i < data.length; i++) {

        var vl = data[i];
        if (vl == null) {
            continue;
        }

        var catIndex = $.inArray(vl[0], cats);
        if (catIndex > -1) {
            vlX = catIndex;
        }
        else {
            vlX = i;
        }

        vlY1 = vl[1];
        vlY2 = vl[2];

        x = Math.round(this.realXAxis.getCatPosition(vlX) + offset);
        y1 = Math.round(this.realYAxis.getPosition(vlY1));
        y2 = Math.round(this.realYAxis.getPosition(vlY2));

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            catIndex: vlX,
            x: this.realXAxis._getValue(vlX),
            from: vlY1,
            to: vlY2
        };

        var y = Math.min(y1, y2);
        var height = Math.abs(y1 - y2);

        var rect = new Rectangle(x, y, w, height);
        rect.context = context;
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        if (this.labels && this.labels.visible !== false) {

        	var labelValue = vl[3];
        	if (labelValue === undefined) {
        		continue;
        	}

        	var tBlock = this._getDataPointLabel(undefined, x + w / 2, y + height / 2, 0, labelValue);
        	tBlock.textBaseline = 'middle';
        	tBlock.textAlign = 'center';

        	tBlock.context = context;
        	this.chart.elem.trigger('dataPointLabelCreating', tBlock);

        	txtBlocks.push(tBlock);

        	this._addShapeAnimation(tBlock, i, len);
        }
    }

    return txtBlocks;
}

RangeColumnSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var gArea = this.chart.gridArea;

    var len = data.length;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var series = this._getSeriesFromThisType();
    var columnW = this._calcColumnScale(series) * gAreaWidth;

    var w = this.pointWidth * columnW;
    w = Math.max(w, this.minimumWidth);

    var txtBlocks = [];
    var x, y1, y2, vlX, vlY1, vlY2;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null || $.isArray(vl) == false) {
            continue;
        }

        vlX = vl[0];

        vlY1 = vl[1];
        vlY2 = vl[2];

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            catIndex: i,
            x: vlX,
            from: vlY1,
            to: vlY2
        };

        x = this.realXAxis.getPosition(vlX);
        y1 = Math.round(this.realYAxis.getPosition(vlY1));
        y2 = Math.round(this.realYAxis.getPosition(vlY2));

        var locX = x - w / 2;

        var y = Math.min(y1, y2);
        var height = Math.abs(y1 - y2);

        var rect = new Rectangle(locX, y, w, height);
        rect.context = context;
        this._setShapeSettings(rect, i);
        shapes.push(rect);

        this._addAnimation(rect, i, len);

        if (this.labels && this.labels.visible !== false) {

        	var labelValue = vl[3];
        	if (labelValue === undefined) {
        		continue;
        	}

        	var tBlock = this._getDataPointLabel(undefined, x, y + height / 2, 0, labelValue);
        	tBlock.textBaseline = 'middle';
        	tBlock.textAlign = 'center';

        	tBlock.context = context;
        	this.chart.elem.trigger('dataPointLabelCreating', tBlock);

        	txtBlocks.push(tBlock);

        	this._addShapeAnimation(tBlock, i, len);
        }
    }

    return txtBlocks;
}

RangeColumnSeries.prototype._setIsAnimReversed = function (rect) {
    var context = rect.context;
    var reversed = this.realYAxis.reversed;

    rect.isAnimReversed = (!reversed && context.from < context.to) || (reversed && context.from > context.to);
}

RangeColumnSeries.prototype._setShapeSettings = function (shape) {

    Series.prototype._setShapeSettings.call(this, shape, shape.context.catIndex);

    if (shape.context.from <= shape.context.to) {
        if (this.priceUpStrokeStyle) {
            shape.strokeStyle = this.priceUpStrokeStyle;
        }

        if (this.priceUpFillStyle) {
            shape.fillStyle = this.priceUpFillStyle;
        }
    }
    else {
        if (this.priceDownStrokeStyle) {
            shape.strokeStyle = this.priceDownStrokeStyle;
        }

        if (this.priceDownFillStyle) {
            shape.fillStyle = this.priceDownFillStyle;
        }
    }
}

RangeColumnSeries.prototype._getTooltip = function (context) {
    var tooltip = "From: <b>" + context.from.toString() + "</b><br/>" +
                  "To: <b>" + context.to.toString() + "</b>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.RangeBar
 * @extends Chart.Series.Series
 * 
 * The Range Bar chart type displays separate events that have beginning and end values. 
 * Data can be plotted using either a date and time or numerical scale. Use this chart type when planning the use of resources. 
 */
function RangeBarSeries(options) {
	BarSeries.call(this, options);

	/**
    * @cfg {String} priceDownFillStyle
    * Specifies the price down fill style.
    */
	/**
     * @cfg {String} priceUpFillStyle
     * Specifies the price up fill style.
     */

	/**
    * @cfg {String/Chart.DataField} xValuesField
    * Specifies the data item field containing the X value.
    */

	/**
    * @cfg {String/Chart.DataField} fromValuesField
    * Specifies the data item field containing the From value.
    */

	/**
    * @cfg {String/Chart.DataField} toValuesField
    * Specifies the data item field containing the To value.
    */

	/**
    * @cfg {String/Chart.DataField} labelValuesField
    * Specifies the data item field containing the Label value.
    */

	/**
     * @cfg {String} xValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

	/**
     * @cfg {String} fromValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

	/**
     * @cfg {String} toValuesType
    * Specifies the data type for automatic conversion from received inline data to the required value.
    *
    * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
    */

	/**
	 * @cfg {String} labelValuesType
	* Specifies the data type for automatic conversion from received inline data to the required value.
	*
	* Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
	*/

	/**
    * @cfg {String} axisX
    * Specifies the x-axis name that this series belong to.
    */
	/**
    * @cfg {String} axisY
    * Specifies the y-axis name that this series belong to.
    */

	/**
    * @cfg {String/Common.Gradient[]} fillStyles
    * Specifies series fill styles - ['red', 'blue'].
    */

	/**
    * @cfg {number} pointWidth
    * Specifies the height of the bars - from 0 to 1
    * 
    * Defaults to: 0.6
    */

	/**
    * @cfg {number} minimumWidth
    * Specifies the minimum height of the bars in pixels.
    * 
    * Defaults to: 1
    */
}

RangeBarSeries.prototype = new BarSeries();
RangeBarSeries.constructor = RangeBarSeries;

RangeBarSeries.prototype._initXYData = function () {
	this._initXYDataRange(1, 3);
}

RangeBarSeries.prototype._initCatValueData = function () {
	this._initCatValueDataRange(1, 3);
}

RangeBarSeries.prototype._initDateValueData = function () {
	this._initDateValueDataRange(1, 3);
}

RangeBarSeries.prototype._initVisibleCatValueData = function () {
	this._initVisibleCatValueDataRange(1, 3);
}

RangeBarSeries.prototype._initVisibleXYData = function () {
	this._initVisibleXYDataRange(1, 3);
}

RangeBarSeries.prototype._processData = function () {
	this._processDataXYZ();
}

RangeBarSeries.prototype._renderCatData = function (shapes) {

	var data = this.arrData;
	var gArea = this.chart.gridArea;
	var cats = this.categories;
	var len = cats.length;

	var gAreaHeight = gArea.height / this.realXAxis.getZoom();
	var groupH = gAreaHeight / len;

	var h = this.pointWidth * groupH;
	var offset = Math.round((groupH - h) / 2);

	h = Math.max(h, this.minimumWidth);

	var txtBlocks = [];
	var x1, x2, y, vlX, vlY1, vlY2;

	for (var i = 0; i < data.length; i++) {

		var vl = data[i];
		if (vl == null) {
			continue;
		}

		var catIndex = $.inArray(vl[0], cats);
		if (catIndex > -1) {
			vlX = catIndex;
		}
		else {
			vlX = i;
		}

		vlY1 = vl[1];
		vlY2 = vl[2];

		y = Math.round(this.realXAxis.getCatPosition(vlX) - offset - h);
		x1 = Math.round(this.realYAxis.getPosition(vlY1));
		x2 = Math.round(this.realYAxis.getPosition(vlY2));

		if (x2 < gArea.x || x1 > gArea.x + gArea.width) {
			continue;
		}

		var context = {
			chart: this.chart,
			series: this,
			dataItem: data[i],
			index: i,
			catIndex: vlX,
			x: this.realXAxis._getValue(vlX),
			from: vlY1,
			to: vlY2
		};

		var x = Math.min(x1, x2);
		var width = Math.abs(x1 - x2);

		var rect = new Rectangle(x, y, width, h);
		rect.context = context;

		this._setShapeSettings(rect, i);
		shapes.push(rect);

		this._addAnimation(rect, i, len);

		if (this.labels && this.labels.visible !== false) {

			var labelValue = vl[3];
			if (labelValue === undefined) {
				continue;
			}

			var tBlock = this._getDataPointLabel(undefined, x + width / 2, y + h / 2, 0, labelValue);
			tBlock.textBaseline = 'middle';
			tBlock.textAlign = 'center';

			tBlock.context = context;
			this.chart.elem.trigger('dataPointLabelCreating', tBlock);

			txtBlocks.push(tBlock);

			this._addShapeAnimation(tBlock, i, len);
		}
	}

	return txtBlocks;
}

RangeBarSeries.prototype._renderLinearData = function (shapes) {

	var data = this.arrData;
	var gArea = this.chart.gridArea;

	var len = data.length;

	var gAreaHeight = gArea.height / this.realXAxis.getZoom();

	var series = this._getSeriesFromThisType();
	var groupH = this._calcColumnScale(series) * gAreaHeight;

	var h = this.pointWidth * groupH;
	h = Math.max(h, this.minimumWidth);

	var txtBlocks = [];
	var x1, x2, y, vlX, vlY1, vlY2;

	for (var i = 0; i < len; i++) {

		var vl = data[i];
		if (vl == null || $.isArray(vl) == false) {
			continue;
		}

		vlX = vl[0];

		vlY1 = vl[1];
		vlY2 = vl[2];

		var context = {
			chart: this.chart,
			series: this,
			dataItem: data[i],
			index: i,
			catIndex: i,
			x: vlX,
			from: vlY1,
			to: vlY2
		};

		y = this.realXAxis.getPosition(vlX);
		x1 = Math.round(this.realYAxis.getPosition(vlY1));
		x2 = Math.round(this.realYAxis.getPosition(vlY2));

		if (x2 < gArea.x || x1 > gArea.x + gArea.width) {
			continue;
		}

		var locY = y - h / 2;

		var x = Math.min(x1, x2);
		var width = Math.abs(x1 - x2);

		var rect = new Rectangle(x, locY, width, h);
		rect.context = context;

		this._setShapeSettings(rect, i);
		shapes.push(rect);

		this._addAnimation(rect, i, len);

		if (this.labels && this.labels.visible !== false) {

			var labelValue = vl[3];
			if (labelValue === undefined) {
				continue;
			}

			var tBlock = this._getDataPointLabel(undefined, x + width / 2, y, 0, labelValue);
			tBlock.textBaseline = 'middle';
			tBlock.textAlign = 'center';

			tBlock.context = context;
			this.chart.elem.trigger('dataPointLabelCreating', tBlock);

			txtBlocks.push(tBlock);

			this._addShapeAnimation(tBlock, i, len);
		}
	}

	return txtBlocks;
}

RangeBarSeries.prototype._setIsAnimReversed = function (rect) {
	var context = rect.context;
	var reversed = this.realYAxis.reversed;

	rect.isAnimReversed = (!reversed && context.from > context.to) || (reversed && context.from < context.to);
}

RangeBarSeries.prototype._setShapeSettings = function (shape, i) {

	Series.prototype._setShapeSettings.call(this, shape, shape.context.catIndex);

	if (shape.context.from <= shape.context.to) {
		if (this.priceUpStrokeStyle) {
			shape.strokeStyle = this.priceUpStrokeStyle;
		}

		if (this.priceUpFillStyle) {
			shape.fillStyle = this.priceUpFillStyle;
		}
	}
	else {
		if (this.priceDownStrokeStyle) {
			shape.strokeStyle = this.priceDownStrokeStyle;
		}

		if (this.priceDownFillStyle) {
			shape.fillStyle = this.priceDownFillStyle;
		}
	}
}

RangeBarSeries.prototype._getTooltip = function (context) {
	var tooltip = "From: <b>" + context.from.toString() + "</b><br/>" +
                  "To: <b>" + context.to.toString() + "</b>";

	if (this.title) {
		var color = Shape.getColorFromFillStyle(this.fillStyle);
		tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
	}

	return tooltip;
}

/**
 * @class Chart.Series.Gantt 
 * @extends Chart.Series.RangeBar
 * 
 * A Gantt chart is a type of bar chart, that illustrates a project schedule. 
 * Gantt charts illustrate the start and finish dates of the terminal elements and summary elements of a project. 
 */
function GanttSeries(options) {
    RangeBarSeries.call(this, options);
}

GanttSeries.prototype = new RangeBarSeries();
GanttSeries.constructor = GanttSeries;

GanttSeries.prototype._createYAxis = function () {
    var axis = new DateTimeAxis({ location: 'bottom', orientation: 'y' });
    axis.chart = this.chart;

    return axis;
}

GanttSeries.prototype._initData = function () {
    RangeBarSeries.prototype._initData.call(this);

    var min = this.min;
    var max = this.max;

    if ($.type(min) == 'date') {
        min = min.getTime();
    }

    if ($.type(max) == 'date') {
        max = max.getTime();
    }

    this.min = min;
    this.max = max;
}

GanttSeries.prototype._initVisibleData = function () {
    RangeBarSeries.prototype._initVisibleData.call(this);

    var min = this.min;
    var max = this.max;

    if ($.type(min) == 'date') {
        min = min.getTime();
    }

    if ($.type(max) == 'date') {
        max = max.getTime();
    }

    this.min = min;
    this.max = max;
}

GanttSeries.prototype._findYAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisY);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {

        axis = axes[i];

        if (axis.getOrientation(this) != 'y' || axis.isVertical()) {
            continue;
        }

        if (axis instanceof DateTimeAxis) {
            return axis;
        }
    }

    return null;
}

GanttSeries.prototype._resolveAxisType = function (axisOp) {

    var loc = axisOp.location;
    if (!loc) {
        return;
    }

    if (loc == 'bottom' || loc == 'top') {
        axisOp.type = 'dateTime';
        return;
    }

    RangeBarSeries.prototype._resolveAxisType.call(this, axisOp);
}

GanttSeries.prototype._getTooltip = function (context) {

    var yAxis = this.realYAxis;

    var tooltip = yAxis._getTooltip(context.from).replace('<br/>', '') +
        " - " + yAxis._getTooltip(context.to);

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Stock
 * @extends Chart.Series.Series
 * 
 * A Stock chart is typically used to illustrate significant stock price points including a stock's open, 
 * close, high, and low price points. However, this type of chart can also be used to analyze scientific data, 
 * because each series of data displays high, low, open, and close values. The opening values are shown on the left, 
 * and the closing values are shown on the right.
 */
function StockSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        lineWidth: 2

        /**
         * @cfg {String} priceDownStrokeStyle
         * Specifies the price down stroke style.
         */

        /**
         * @cfg {String} priceUpStrokeStyle
         * Specifies the price up stroke style.
         */

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} highValuesField
        * Specifies the data item field containing the High value.
        */


        /**
        * @cfg {String/Chart.DataField} lowValuesField
        * Specifies the data item field containing the Low value.
        */

        /**
        * @cfg {String/Chart.DataField} openValuesField
        * Specifies the data item field containing the Open value.
        */


        /**
        * @cfg {String/Chart.DataField} closeValuesField
        * Specifies the data item field containing the Close value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} highValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} lowValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} openValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} closeValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

    	/**
		* @cfg {number} pointWidth
		* Specifies the width of the columns - from 0 to 1
		* 
		* Defaults to: 0.6
		*/

    	/**
		* @cfg {number} minimumWidth
		* Specifies the minimum width of the columns in pixels.
		* 
		* Defaults to: 1
		*/


        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });

    this.defaults = defs;

    Series.call(this, options);
}

StockSeries.prototype = new Series();
StockSeries.constructor = StockSeries;

StockSeries.prototype._initXYData = function () {
    this._initXYDataRange(1, 5);
}

StockSeries.prototype._initCatValueData = function () {
    this._initCatValueDataRange(1, 5, true);
}

StockSeries.prototype._initDateValueData = function () {
    this._initDateValueDataRange(1, 5);
}

StockSeries.prototype._initVisibleCatValueData = function () {
    this._initVisibleCatValueDataRange(1, 5);
}

StockSeries.prototype._initVisibleXYData = function () {
    this._initVisibleXYDataRange(1, 5);
}

StockSeries.prototype._processData = function () {

    this.arrData = null;

    if (this.data) {

        if (!this.xValuesType &&
            !this.highValuesType &&
            !this.lowValuesType &&
            !this.openValuesType &&
            !this.closeValuesType) {
            this.arrData = jMath.cloneArray(this.data);
        }
        else {
            this.arrData = [];

            for (var i = 0; i < this.data.length; i++) {

                // clone the array
                var dItem = this.data[i].slice(0);

                dItem[0] = jMath.processDataValue(dItem[0], this.xValuesType);
                dItem[1] = jMath.processDataValue(dItem[1], this.highValuesType);
                dItem[2] = jMath.processDataValue(dItem[2], this.lowValuesType);
                dItem[3] = jMath.processDataValue(dItem[3], this.openValuesType);
                dItem[4] = jMath.processDataValue(dItem[4], this.closeValuesType);

                this.arrData.push(dItem);
            }
        }
    }
    else {
        var arrDataSource = this.chart.arrDataSource;
        if (arrDataSource) {
            var xValuesField = this.xValuesField;
            var highValuesField = this.highValuesField;
            var lowValuesField = this.lowValuesField;
            var openValuesField = this.openValuesField;
            var closeValuesField = this.closeValuesField;

            var xValues = jMath.processDataField(arrDataSource, xValuesField);
            var highValues = jMath.processDataField(arrDataSource, highValuesField);
            var lowValues = jMath.processDataField(arrDataSource, lowValuesField);
            var openValues = jMath.processDataField(arrDataSource, openValuesField);
            var closeValues = jMath.processDataField(arrDataSource, closeValuesField);

            if (xValues && highValues && lowValues && openValues && closeValues) {
                this.arrData = jMath.mergeArrays([xValues, highValues, lowValues, openValues, closeValues]);
            }
        }
    }

    this._processXAxisType();
    this.hasRealData = this.hasData();
}


StockSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var gArea = this.chart.gridArea;

    var len = data.length;

    var x, high, low, open, close;

    var gAreaWidth = gArea.width / this.realXAxis.getZoom();

    var width;

    if (this.xAxisType == 'CategoryAxis') {
        width = this.pointWidth * gAreaWidth / len;
    }
    else {
        var columnW = this._calcColumnScale([this]) * gAreaWidth;
        width = this.pointWidth * columnW;
    }

    width = Math.max(width, this.minimumWidth);

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null || $.isArray(vl) == false) {
            continue;
        }

        var dataX = i;

        switch (this.xAxisType) {
            case 'LinearAxis':
            case 'DateTimeAxis':
                x = vl[0];
                dataX = x;
                break;
            case 'CategoryAxis':
                x = i + 0.5;
                break;
        }

        high = vl[1];
        low = vl[2];
        open = vl[3];
        close = vl[4];

        var context = {
            chart: this.chart,
            series: this,
            dataItem: vl,
            index: i,
            x: this.realXAxis._getValue(dataX),
            high: high,
            low: low,
            open: open,
            close: close
        };

        x = this.realXAxis.getPosition(x);

        high = this.realYAxis.getPosition(high);
        low = this.realYAxis.getPosition(low);
        open = this.realYAxis.getPosition(open);
        close = this.realYAxis.getPosition(close);

        var sh = this._createShape(x, high, low, open, close, width);
        sh.context = context;

        this._addShapeAnimation(sh, i, len);

        shapes.push(sh);
    }
}

StockSeries.prototype._setShapeSettings = function (shape) {

    Series.prototype._setShapeSettings.call(this, shape);

    shape.priceDownStrokeStyle = this.priceDownStrokeStyle;
    shape.priceUpStrokeStyle = this.priceUpStrokeStyle;
}

StockSeries.prototype._createShape = function (x, high, low, open, close, width) {
    var sh = new StockShape(x, high, low, open, close, width);

    this._setShapeSettings(sh);

    return sh;
}

StockSeries.prototype._getPixelMargins = function (axis) {

    if (axis.isVertical()) {
        return Series.prototype._getPixelMargins.call(this, axis);
    }

    if (!this.hasData()) {
        return { left: 0, right: 0 };
    }

    var offset = 4;

    var columnScale = this._calcColumnScale([this]);

    var length = axis.length;

    var width = 0.5 * columnScale * length + offset;

    return { left: width, right: width };
}

StockSeries.prototype._getTooltip = function (context) {
    var tooltip = "Open: <b>" + context.open.toString() + "</b><br/>" +
                  "High: <b>" + context.high.toString() + "</b><br/>" +
                  "Low: <b>" + context.low.toString() + "</b><br/>" +
                  "Close: <b>" + context.close.toString() + "</b>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.Candlestick
 * @extends Chart.Series.Series
 * 
 * The Candlestick chart type is used to display stock information using high, low, open and close values. 
 * The size of the line is determined by the high and low values, while the size of the bar is determined 
 * by the open and close values. The open and close bars are displayed using different colors. 
 * The color used depends on whether the stock's price has gone up or down.
 */
function CandlestickSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 1

        /**
         * @cfg {String} priceDownFillStyle
         * Specifies the price down fill style.
         */

        /**
         * @cfg {String} priceUpFillStyle
         * Specifies the price up fill style.
         */


        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} highValuesField
        * Specifies the data item field containing the High value.
        */

        /**
        * @cfg {String/Chart.DataField} lowValuesField
        * Specifies the data item field containing the Low value.
        */

        /**
        * @cfg {String/Chart.DataField} openValuesField
        * Specifies the data item field containing the Open value.
        */

        /**
        * @cfg {String/Chart.DataField} closeValuesField
        * Specifies the data item field containing the Close value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} highValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} lowValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} openValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} closeValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

    	/**
		* @cfg {number} pointWidth
		* Specifies the width of the columns - from 0 to 1
		* 
		* Defaults to: 0.6
		*/

    	/**
		* @cfg {number} minimumWidth
		* Specifies the minimum width of the columns in pixels.
		* 
		* Defaults to: 1
		*/

        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });
    this.defaults = defs;

    Series.call(this, options);
}

CandlestickSeries.prototype = new StockSeries();
CandlestickSeries.constructor = CandlestickSeries;

CandlestickSeries.prototype._setShapeSettings = function (shape) {

    shape.priceDownFillStyle = this.priceDownFillStyle || this.fillStyle;
    shape.priceUpFillStyle = this.priceUpFillStyle;

    // stroke
    shape.strokeStyle = this.strokeStyle;
    shape.lineWidth = this.lineWidth;
    shape.lineCap = this.lineCap;
    shape.lineJoin = this.lineJoin;
    shape.miterLimit = this.miterLimit;

    CanvasControl.setShadows(shape, this, this.chart);

    shape.cursor = this.cursor;
}

CandlestickSeries.prototype._createShape = function (x, high, low, open, close, width) {
    var sh = new CandlestickShape(x, high, low, open, close, width);

    this._setShapeSettings(sh);

    return sh;
}

/**
 * @class Chart.Series.RadarLine
 * @extends Chart.Series.Series
 * 
 * The Radar chart type is a circular chart that is used primarily as a data comparison tool. 
 * It is sometimes called a spider chart or a star chart. The plot area can also be displayed as a polygon.
 */
function RadarLineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 2,
        /**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */
        markers: {}

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

    });
    this.defaults = defs;

    Series.call(this, options);

    this.notInGridArea = true;
}

RadarLineSeries.prototype = new Series();
RadarLineSeries.constructor = RadarLineSeries;

RadarLineSeries.prototype._resolveAxisType = function () {
}

RadarLineSeries.prototype._createXAxis = function () {

    var axis = new CategoryAngleAxis();
    axis.chart = this.chart;

    return axis;
}

RadarLineSeries.prototype._createYAxis = function () {
    var axis = new LinearRadiusAxis();
    axis.chart = this.chart;

    return axis;
}

RadarLineSeries.prototype._findXAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisX);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];

        if (axis instanceof CategoryAngleAxis) {
            return axis;
        }
    }

    return null;
}

RadarLineSeries.prototype._findYAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisY);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];

        if (axis instanceof LinearRadiusAxis) {
            return axis;
        }
    }

    return null;
}

RadarLineSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();
    var hasLabels = this.labels != null && this.labels.visible !== false;

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlY;

    var cx = this.realYAxis.cx;
    var cy = this.realYAxis.cy;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        if ($.isArray(vl) == false) {
            vlY = vl;
        }
        else {
            vlY = vl[1];

            if (vlY === null) {
                pts.push(null);
                pts.push(null);
                if (!hasMarkers) {
                    cPoints.push(null);
                }
                continue;
            }
        }

        var angle = this.realXAxis._getAngle(i);

        x = this.realYAxis.getPosition(vlY);
        y = cy;

        var pt = jMath.rotatePointAt(x, y, angle, cx, cy);
        x = pt.x;
        y = pt.y;

        pts.push(x);
        pts.push(y);

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: this.realXAxis._getValue(i),
                y: vlY
            });
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, null, vlY, lblOffset);
    }

    var polygon = this._createShape(pts);
    if (polygon) {
        shapes.push(polygon);
        if (!hasMarkers) {
            polygon.context = {
                chart: this.chart,
                series: this,
                points: cPoints
            };
        }
    }

    $.merge(shapes, markers);
    $.merge(shapes, txtBlocks);
}

RadarLineSeries.prototype._createShape = function (pts) {

    var polyline = new Polyline(pts, false, true);
    this._setShapeSettings(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

RadarLineSeries.prototype._getPixelMargins = function (axis) {

    return { left: 0, right: 0 };
}

/**
 * @class Chart.Series.RadarArea
 * @extends Chart.Series.RadarLine
 * 
 * The Radar chart type is a circular chart that is used primarily as a data comparison tool. 
 * It is sometimes called a spider chart or a star chart. The plot area can also be displayed as a polygon.
 */
function RadarAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

RadarAreaSeries.prototype = new RadarLineSeries();
RadarAreaSeries.constructor = RadarAreaSeries;

RadarAreaSeries.prototype._createShape = function (pts) {
    var polygon = new Polygon(pts);
    this._setShapeSettings(polygon);
    return polygon;
}

/**
 * @class Chart.Series.RadarSplineArea
 * @extends Chart.Series.RadarLine
 * 
 * The Radar chart type is a circular chart that is used primarily as a data comparison tool. 
 * It is sometimes called a spider chart or a star chart. The plot area can also be displayed as a polygon.
 */
function RadarSplineAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

RadarSplineAreaSeries.prototype = new RadarLineSeries();
RadarSplineAreaSeries.constructor = RadarSplineAreaSeries;

RadarSplineAreaSeries.prototype._createShape = function (pts) {
    var shape = new Curve(pts, true);
    this._setShapeSettings(shape);
    return shape;
}

/**
 * @class Chart.Series.RadarSpline
 * @extends Chart.Series.RadarLine
 * 
 * The Radar chart type is a circular chart that is used primarily as a data comparison tool. 
 * It is sometimes called a spider chart or a star chart. The plot area can also be displayed as a polygon.
 */
function RadarSplineSeries(options) {

    Series.call(this, options);
}

RadarSplineSeries.prototype = new RadarLineSeries();
RadarSplineSeries.constructor = RadarSplineSeries;

RadarSplineSeries.prototype._createShape = function (pts) {
    var shape = new Curve(pts, true);
    this._setShapeSettings(shape);
    shape.fillStyle = null;

    // this._addLengthAnimation(shape);

    return shape;
}

/**
 * @class Chart.Series.PolarLine
 * @extends Chart.Series.Series
 * 
 * The Polar chart type is a circular graph on which data points are displayed using the angle, 
 * and the distance from the center point. The X axis is located on the boundaries of the circle and the Y axis connects 
 * the center of the circle with the X axis. 
 */
function PolarLineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 2,
        /**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */
        markers: {}

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

    });
    this.defaults = defs;

    Series.call(this, options);

    this.notInGridArea = true;
}

PolarLineSeries.prototype = new Series();
PolarLineSeries.constructor = PolarLineSeries;

PolarLineSeries.prototype._resolveAxisType = function () {
}

PolarLineSeries.prototype._createXAxis = function () {

    var axis = new LinearAngleAxis();
    axis.chart = this.chart;

    return axis;
}

PolarLineSeries.prototype._createYAxis = function () {
    var axis = new LinearRadiusAxis();
    axis.chart = this.chart;

    return axis;
}

PolarLineSeries.prototype._findXAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisX);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];

        if (axis instanceof LinearAngleAxis) {
            return axis;
        }
    }

    return null;
}

PolarLineSeries.prototype._findYAxis = function (axes) {
    // try find an axis with that name
    var axis = this._findAxis(axes, this.axisY);
    if (axis != null) {
        return axis;
    }

    // try find an axis with valid type
    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];

        if (axis instanceof LinearRadiusAxis) {
            return axis;
        }
    }

    return null;
}

PolarLineSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();
    var hasLabels = this.labels != null && this.labels.visible !== false;

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    var cx = this.realYAxis.cx;
    var cy = this.realYAxis.cy;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];

        if (vlX === null || vlY === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        var angle = this.realXAxis._getAngle(vlX);

        x = this.realYAxis.getPosition(vlY);
        y = cy;

        var pt = jMath.rotatePointAt(x, y, angle, cx, cy);
        x = pt.x;
        y = pt.y;

        pts.push(x);
        pts.push(y);

        //  if (this.realYAxis.isValueVisible(vlY) === false) {
        //      continue;
        //  }

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: vlX,
            y: vlY
        };

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: vlX,
                y: vlY
            });
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, vlX, vlY, lblOffset);
    }

    var polygon = this._createShape(pts);
    if (polygon) {
        shapes.push(polygon);
        if (!hasMarkers) {
            polygon.context = {
                chart: this.chart,
                series: this,
                points: cPoints
            };
        }
    }

    $.merge(shapes, markers);
    $.merge(shapes, txtBlocks);
}

PolarLineSeries.prototype._createShape = function (pts) {
    var polyline = new Polyline(pts);
    this._setShapeSettings(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

PolarLineSeries.prototype._getPixelMargins = function (axis) {
    return { left: 0, right: 0 };
}

/**
 * @class Chart.Series.PolarArea
 * @extends Chart.Series.PolarLine
 * 
 * The Polar chart type is a circular graph on which data points are displayed using the angle, 
 * and the distance from the center point. The X axis is located on the boundaries of the circle and the Y axis connects 
 * the center of the circle with the X axis. 
 */
function PolarAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

PolarAreaSeries.prototype = new PolarLineSeries();
PolarAreaSeries.constructor = PolarAreaSeries;

PolarAreaSeries.prototype._createShape = function (pts) {
    var polygon = new Polygon(pts);
    this._setShapeSettings(polygon);
    return polygon;
}

/**
 * @class Chart.Series.PolarSpline
 * @extends Chart.Series.PolarLine
 * 
 * The Polar chart type is a circular graph on which data points are displayed using the angle, 
 * and the distance from the center point. The X axis is located on the boundaries of the circle and the Y axis connects 
 * the center of the circle with the X axis. 
 */
function PolarSplineSeries(options) {
    Series.call(this, options);
}

PolarSplineSeries.prototype = new PolarLineSeries();
PolarSplineSeries.constructor = PolarSplineSeries;

PolarSplineSeries.prototype._createShape = function (pts) {
    var shape = new Curve(pts, false);
    this._setShapeSettings(shape);
    shape.fillStyle = null;

    this._addLengthAnimation(shape);

    return shape;
}

/**
 * @class Chart.Series.PolarSplineArea
 * @extends Chart.Series.PolarLine
 * 
 * The Polar chart type is a circular graph on which data points are displayed using the angle, 
 * and the distance from the center point. The X axis is located on the boundaries of the circle and the Y axis connects 
 * the center of the circle with the X axis. 
 */
function PolarSplineAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

PolarSplineAreaSeries.prototype = new PolarLineSeries();
PolarSplineAreaSeries.constructor = PolarSplineAreaSeries;

PolarSplineAreaSeries.prototype._createShape = function (pts) {
    var shape = new Curve(pts, true);
    this._setShapeSettings(shape);
    return shape;
}

/**
 * @class Chart.Series.PolarScatter
 * @extends Chart.Series.PolarLine
 * 
 * The Polar chart type is a circular graph on which data points are displayed using the angle, 
 * and the distance from the center point. The X axis is located on the boundaries of the circle and the Y axis connects 
 * the center of the circle with the X axis. 
 */
function PolarScatterSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: { type: 'diamond'}
    });

    this.defaults = defs;

    Series.call(this, options);
}

PolarScatterSeries.prototype = new PolarLineSeries();
PolarScatterSeries.constructor = PolarScatterSeries;

PolarScatterSeries.prototype._createShape = function (pts) {
    return null;
}

/**
 * @class Chart.Series.Trendline
 * @extends Chart.Series.Series
 * 
 * A Trendline chart is graphic representation of trends in data series, such as a 
 * line sloping upward to represent increased sales over a period of months. 
 * Trendlines are used for the study of problems of prediction, also called regression analysis.
 */
function TrendlineSeries(options) {
    var defs = $.extend(true, {}, this.defaults, {
        /**
          * @cfg {Number} lineWidth
          * Specifies the series line width.
          */
        lineWidth: 2,
        /**
         * @cfg {String} trendlineType
         * Specifies the trendline type - 'linear' or 'exponential' ('exp') 
         */
        trendlineType: 'linear',
        /**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */
        markers: {}

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */


        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });

    this.defaults = defs;

    Series.call(this, options);
}

TrendlineSeries.prototype = new Series();
TrendlineSeries.constructor = TrendlineSeries;

TrendlineSeries.prototype._initData = function () {

    var data = this.tData = this._getTrendlineResult();

    var min = maxVl;
    var max = minVl;

    var minX = maxVl;
    var maxX = minVl;

    var len = data.length;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl == null) {
            continue;
        }

        var vlX = vl[iX];

        if (minX > vlX) {
            minX = vlX;
        }

        if (maxX < vlX) {
            maxX = vlX;
        }

        var vlY = vl[iY];

        if (min > vlY) {
            min = vlY;
        }

        if (max < vlY) {
            max = vlY;
        }
    }

    this.min = min;
    this.max = max;

    this.minX = minX;
    this.maxX = maxX;
}


TrendlineSeries.prototype._getTrendlineResult = function () {

    var data = this.arrData;

    var len = data.length;

    var ret;
    var res;

    var ypred = [];

    var x = [];
    var y = [];

    for (var i = 0; i < len; i++) {
        var vl = data[i];

        if (vl == null) {
            continue;
        }

        if ($.isArray(vl) == false) {
            x.push(i + 0.5);
            y.push(vl);
        }
        else {
            var vlX = vl[iX];

            switch (this.xAxisType) {
                case 'CategoryAxis':
                    vlX = i + 0.5;
                    break;
                case 'DateTimeAxis':
                    vlX = vlX.getTime();
                    break;
            }

            x.push(vlX);
            y.push(vl[iY]);
        }
    }

    switch (this.trendlineType) {
        case 'exp':
        case 'exponential':
            ret = this._getExpRegression(x, y);
            for (var i = 0; i < x.length; i++) {
                res = ret[1] * Math.pow(ret[0], x[i]);
                ypred.push([x[i], res]);
            }
            break;
        case 'linear':
        default:
            ret = this._getLinearRegression(x, y);
            for (var i = 0; i < x.length; i++) {
                res = ret[0] * x[i] + ret[1];
                ypred.push([x[i], res]);
            }
            break;
    }

    return ypred;
}

TrendlineSeries.prototype._getRegression = function (x, y) {

    var type = this.trendlineType;

    var len = this.arrData.length;

    var SX = 0;
    var SY = 0;

    var SXX = 0;
    var SXY = 0;
    var SYY = 0;

    var Y = [];
    var X = [];

    if (type == 'linear') {
        X = x;
        Y = y;
    }
    else if (type == 'exp' || type == 'exponential') {
        for (var i = 0; i < y.length; i++) {
            // ignore points <= 0, log undefined.
            if (y[i] <= 0) {
                len--;
            }
            else {
                X.push(x[i]);
                Y.push(Math.log(y[i]));
            }
        }
    }

    for (var i = 0; i < len; i++) {
        SX = SX + X[i];
        SY = SY + Y[i];
        SXY = SXY + X[i] * Y[i];
        SXX = SXX + X[i] * X[i];
        SYY = SYY + Y[i] * Y[i];
    }

    var slope = (len * SXY - SX * SY) / (len * SXX - SX * SX);
    var intercept = (SY - slope * SX) / len;

    return [slope, intercept];

}

TrendlineSeries.prototype._getLinearRegression = function (x, y) {
    return this._getRegression(x, y);
}

TrendlineSeries.prototype._getExpRegression = function (x, y) {

    var ret = this._getRegression(x, y);
    var base = Math.exp(ret[0]);
    var coeff = Math.exp(ret[1]);
    return [base, coeff];

}

TrendlineSeries.prototype._render = function (shapes) {

    if (!this.hasRealData || !this.isInScene()) {
        return;
    }

    var data = this.arrData;

    var ypred = this.tData;

    var pts = [];

    var di = 1;

    if (this.trendlineType == 'linear') {
        di = ypred.length - 1;
    }

    var x, y, vlX, vlY;

    for (var i = 0; i < ypred.length; i += di) {
        var vl = ypred[i];

        vlX = vl[iX];
        vlY = vl[iY];

        x = this.realXAxis.getPosition(vlX);
        y = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);
    }

    var shape;

    switch (this.trendlineType) {
        case 'exp':
        case 'exponential':
            shape = new Curve(pts);
            break;
        case 'linear':
        default:
            shape = new Polyline(pts);
            break;
    }

    this._setShapeSettings(shape);
    shapes.push(shape);

    this._addLengthAnimation(shape);
}

/**
 * @class Chart.Series.VerticalLine
 * @extends Chart.Series.Series
 * 
 * The Vertical Line chart type is a Line chart that is oriented vertically. 
 */
function VertLineSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 2,
        /**
        * @cfg {Chart.Marker} markers
        * Specifies the series markers.
        */
        markers: {}

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} yValuesField
        * Specifies the data item field containing the Y value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} yValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */


        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });

    this.defaults = defs;

    Series.call(this, options);
}

VertLineSeries.prototype = new BarSeries();
VertLineSeries.constructor = VertLineSeries;

VertLineSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = x = i + 0.5;

        if ($.isArray(vl) == false) {
            vlY = vl;
        }
        else {
            vlY = vl[1];

            if (jMath.isNull(vlY)) {
                pts.push(null);
                pts.push(null);
                if (!hasMarkers) {
                    cPoints.push(null);
                }
                continue;
            }
        }

        y = this.realXAxis.getPosition(x);
        x = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: vlX,
                y: vlY
            });
        }

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, null, vlY, lblOffset);
    }

    var polyline = this._createShape(pts, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

VertLineSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();
    var hasLabels = this.labels != null && this.labels.visible !== false;

    var pts = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y, vlX, vlY;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = vl[iX];
        vlY = vl[iY];

        if (jMath.isNull(vlX) || jMath.isNull(vlY)) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        y = this.realXAxis.getPosition(vlX);
        x = this.realYAxis.getPosition(vlY);

        pts.push(x);
        pts.push(y);

        if (!hasMarkers) {
            cPoints.push({
                dataItem: vl,
                index: i,
                x: vlX,
                y: vlY
            });
        }

        if (this.realYAxis.isValueVisible(vlY) === false) {
            continue;
        }

        this._addMarkerAndLabel(markers, txtBlocks, x, y, i, len, vlX, vlY, lblOffset);
    }

    var polyline = this._createShape(pts, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

VertLineSeries.prototype._createShape = function (pts, shapes) {

    this._createErrorBars(shapes);

    var polyline = new Polyline(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

VertLineSeries.prototype._initColors = function (color) {
    this.fillStyle = this.fillStyle || color;
    this.strokeStyle = this.strokeStyle || color;
}

VertLineSeries.prototype._getPixelMargins = function (axis) {
    return Series.prototype._getPixelMargins.call(this, axis);
}

/**
 * @class Chart.Series.VerticalSpline
 * @extends Chart.Series.VerticalLine
 * 
 * The Vertical Spline chart type is a Spline chart that is oriented vertically. 
 */
function VertSplineSeries(options) {
    VertLineSeries.call(this, options);
}

VertSplineSeries.prototype = new VertLineSeries();
VertSplineSeries.constructor = VertSplineSeries;

VertSplineSeries.prototype._createShape = function (pts, shapes) {

    this._createErrorBars(shapes);

    var polyline = new Curve(pts);
    this._setShapeSettings(polyline);

    shapes.push(polyline);

    this._addLengthAnimation(polyline);

    return polyline;
}

/**
 * @class Chart.Series.VerticalArea
 * @extends Chart.Series.VerticalLine
 * 
 * The Vertical Area chart type is an Area chart that is oriented vertically. 
 */
function VertAreaSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {Number} lineWidth
         * Specifies the series line width.
         */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null
    });
    this.defaults = defs;

    Series.call(this, options);
}

VertAreaSeries.prototype = new VertLineSeries();
VertAreaSeries.constructor = VertAreaSeries;

VertAreaSeries.prototype._createShape = function (pts, shapes) {

    var linePts = [];
    $.merge(linePts, pts);

    var polyline = new Polyline(linePts);
    this._setShapeSettings(polyline);

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = gArea.x + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);

    var polygon = new Area(pts, crossPos, true);
    this._setShapeSettings(polygon);
    polygon.lineWidth = 0;
    shapes.push(polygon);

    this._createErrorBars(shapes);

    shapes.push(polyline);

    this._addLengthAnimation(polygon);
    this._addLengthAnimation(polyline);

    return polyline;
}

VertAreaSeries.prototype._isAnchoredToOrigin = function () {
    return true;
}

/**
 * @class Chart.Series.VerticalSplineArea
 * @extends Chart.Series.VerticalArea
 * 
 * The Vertical Spline Area chart type is a Spline Area chart that is oriented vertically. 
 */
function VertSplineAreaSeries(options) {
    VertAreaSeries.call(this, options);
}

VertSplineAreaSeries.prototype = new VertAreaSeries();
VertSplineAreaSeries.constructor = VertSplineAreaSeries;

VertSplineAreaSeries.prototype._createShape = function (pts, shapes) {

    var linePts = [];
    $.merge(linePts, pts);

    var curve = new Curve(linePts);
    this._setShapeSettings(curve);

    var gArea = this.chart.gridArea;
    var left = gArea.x;
    var right = gArea.x + gArea.width;

    var crossPos = this.realYAxis.getCrossingPosition();
    crossPos = jMath.fitInRange(crossPos, left, right);

    var polygon = new Area(pts, crossPos, true, true);
    this._setShapeSettings(polygon);
    polygon.lineWidth = 0;
    shapes.push(polygon);

    this._createErrorBars(shapes);

    shapes.push(curve);

    this._addLengthAnimation(polygon);
    this._addLengthAnimation(curve);

    return curve;
}

/**
 * @class Chart.Series.Range
 * @extends Chart.Series.Series
 * 
 * The Range chart type displays a range of data by plotting two Y values per data point, 
 * with each Y value being drawn as a line chart. The range between the Y values can then be filled with color, or an image. 
 */
function RangeSeries(options) {

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} lineWidth
        * Specifies the series line width.
        */
        lineWidth: 0,
        /**
         * @cfg {Chart.Marker} markers
         * Specifies the series markers.
         */
        markers: null

        /**
        * @cfg {String/Chart.DataField} xValuesField
        * Specifies the data item field containing the X value.
        */

        /**
        * @cfg {String/Chart.DataField} fromValuesField
        * Specifies the data item field containing the From value.
        */

        /**
        * @cfg {String/Chart.DataField} toValuesField
        * Specifies the data item field containing the To value.
        */

        /**
         * @cfg {String} xValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} fromValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
         * @cfg {String} toValuesType
         * Specifies the data type for automatic conversion from received inline data to the required value.
         *
         * Possible values are: 'string', 'numeric' or 'dateTime'. If the type is not specified no conversion is applied.
         */

        /**
        * @cfg {String} axisX
        * Specifies the x-axis name that this series belong to.
        */
        /**
        * @cfg {String} axisY
        * Specifies the y-axis name that this series belong to.
        */
    });
    this.defaults = defs;

    Series.call(this, options);
}

RangeSeries.prototype = new Series();
RangeSeries.constructor = RangeSeries;

RangeSeries.prototype._initXYData = function () {
    this._initXYDataRange(1, 3);
}

RangeSeries.prototype._initCatValueData = function () {
    this._initCatValueDataRange(1, 3, true);
}

RangeSeries.prototype._initDateValueData = function () {
    this._initDateValueDataRange(1, 3);
}

RangeSeries.prototype._initVisibleCatValueData = function () {
    this._initVisibleCatValueDataRange(1, 3);
}

RangeSeries.prototype._initVisibleXYData = function () {
    this._initVisibleXYDataRange(1, 3);
}

RangeSeries.prototype._processData = function () {
    this._processDataXYZ();
}

RangeSeries.prototype._renderCatData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();

    var pts1 = [];
    var pts2 = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y1, y2, vlX, vlY1, vlY2;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts1.push(null);
            pts1.push(null);
            pts2.push(null);
            pts2.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = i + 0.5;
        vlY1 = vl[1];
        vlY2 = vl[2];

        x = this.realXAxis.getPosition(vlX);
        y1 = this.realYAxis.getPosition(vlY1);
        y2 = this.realYAxis.getPosition(vlY2);

        pts1.push(x);
        pts1.push(y1);

        pts2.push(x);
        pts2.push(y2);

        if (!hasMarkers) {
            cPoints[i] = cPoints[2 * len - i - 1] = {
                dataItem: vl,
                index: i,
                x: vlX,
                from: vlY1,
                to: vlY2
            };
        }

        this._addMarkersAndLabels(markers, txtBlocks, x, y1, y2, i, len, null, vlY1, vlY2, lblOffset);
    }

    var polyline = this._createShape(pts1, pts2, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

RangeSeries.prototype._renderLinearData = function (shapes) {

    var data = this.arrData;

    var len = data.length;

    var hasMarkers = this.markers != null && this.markers.isVisible();
    var hasLabels = this.labels != null && this.labels.visible !== false;

    var pts1 = [];
    var pts2 = [];

    var cPoints = [];

    var markers = [];
    var txtBlocks = [];

    var lblOffset = this.getLabelsOffset();

    var x, y1, y2, vlX, vlY1, vlY2;

    for (var i = 0; i < len; i++) {

        var vl = data[i];
        if (vl === null) {
            pts.push(null);
            pts.push(null);
            if (!hasMarkers) {
                cPoints.push(null);
            }
            continue;
        }

        vlX = vl[iX];
        vlY1 = vl[iY];
        vlY2 = vl[iRangeTo];

        x = this.realXAxis.getPosition(vlX);
        y1 = this.realYAxis.getPosition(vlY1);
        y2 = this.realYAxis.getPosition(vlY2);

        pts1.push(x);
        pts1.push(y1);

        pts2.push(x);
        pts2.push(y2);

        if (!hasMarkers) {
            cPoints[i] = cPoints[2 * len - i - 1] = {
                dataItem: vl,
                index: i,
                x: vlX,
                from: vlY1,
                to: vlY2
            };
        }

        this._addMarkersAndLabels(markers, txtBlocks, x, y1, y2, i, len, null, vlY1, vlY2, lblOffset);
    }

    var polyline = this._createShape(pts1, pts2, shapes);

    if (!hasMarkers && polyline) {
        polyline.context = {
            chart: this.chart,
            series: this,
            points: cPoints
        };
    }
    else {
        $.merge(shapes, markers);
    }

    // $.merge(shapes, txtBlocks);
    return txtBlocks;
}

RangeSeries.prototype._createShape = function (pts1, pts2, shapes) {

    var polygon = new RangeShape(pts1, pts2);
    this._setShapeSettings(polygon);

    shapes.push(polygon);

    this._addLengthAnimation(polygon);

    return polygon;
}

RangeSeries.prototype._addMarkersAndLabels = function (markers, txtBlocks, x, y1, y2, i, length, vlX, vlY1, vlY2, lblOffset) {

    var mOffset = 0;
    var data = this.arrData;

    var dataX = vlX ? vlX : i;

    if (this.markers && this.markers.isVisible()) {

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index: i,
            x: this.realXAxis._getValue(dataX),
            from: vlY1,
            to: vlY2
        };

        mOffset = this.markers.offset;

        var imagePath = context.dataItem[iImage];

        var marker = this._addMarker(x, y1, null, vlY1, imagePath, i, context);
        if (marker.marker) {

            if (marker.line) {
                markers.push(marker.line);
            }

            markers.push(marker.marker);

            this._addShapeAnimation(marker.marker, i, length);
        }

        marker = this._addMarker(x, y2, null, vlY2, imagePath, i, context);
        if (marker.marker) {

            if (marker.line) {
                markers.push(marker.line);
            }

            markers.push(marker.marker);

            this._addShapeAnimation(marker.marker, i, length);
        }
    }

    if (this.labels && this.labels.visible !== false) {

        var labelValue = this._getLabelValue(vlY1, i);
        var tBlock = this._getDataPointLabel(vlY1, x, y1, lblOffset + mOffset, labelValue, vlY1 > vlY2);

        var context = {
            chart: this.chart,
            series: this,
            dataItem: data[i],
            index : i
        };

        tBlock.context = context;

        this.chart.elem.trigger('dataPointLabelCreating', tBlock);

        txtBlocks.push(tBlock);

        this._addShapeAnimation(tBlock, i, length);


        labelValue = this._getLabelValue(vlY2, i);
        tBlock = this._getDataPointLabel(vlY2, x, y2, lblOffset + mOffset, labelValue, vlY2 > vlY1);

        tBlock.context = context;

        this.chart.elem.trigger('dataPointLabelCreating', tBlock);

        txtBlocks.push(tBlock);

        this._addShapeAnimation(tBlock, i, length);
    }
}

RangeSeries.prototype._getDataPointLabel = function (vl, x, y, offset, dataValue, isTop) {

    var text = this._getLabelText(dataValue);
    var tBlock = new TextBlock(text);
    CanvasControl.setShadows(tBlock, this, this.chart);
    $.extend(tBlock, this.labels);

    tBlock.measure(this.chart.ctx);

    tBlock.textAlign = 'center';
    tBlock.x = x;

    if (isTop) {
        tBlock.y = y - offset;
        tBlock.textBaseline = 'bottom';
    }
    else {
        tBlock.y = y + offset;
        tBlock.textBaseline = 'top';
    }

    return tBlock;
}

RangeSeries.prototype._getTooltip = function (context) {
    var tooltip = "From: <b>" + context.from.toString() + "</b><br/>" +
                  "To: <b>" + context.to.toString() + "</b>";

    if (this.title) {
        var color = Shape.getColorFromFillStyle(this.fillStyle);
        tooltip = '<div style="color:' + color + '">' + this._getTooltipTitle() + '</div>' + tooltip;
    }

    return tooltip;
}

/**
 * @class Chart.Series.SplineRange
 * @extends Chart.Series.Range
 * 
 * The Spline Range chart type displays a range of data by plotting two Y values per data point, 
 * with each Y value drawn as a line chart. The range between the Y values can be filled with color, information, or even an image. 
 */
function SplineRangeSeries(options) {
    RangeSeries.call(this, options);
}

SplineRangeSeries.prototype = new RangeSeries();
SplineRangeSeries.constructor = SplineRangeSeries;

SplineRangeSeries.prototype._createShape = function (pts1, pts2, shapes) {

    var polygon = new RangeShape(pts1, pts2, true);
    this._setShapeSettings(polygon);

    shapes.push(polygon);

    this._addLengthAnimation(polygon);

    return polygon;
}

/**
 * @class Chart.Axes.AxesArray
 * 
 * 
 **/
function AxesArray(chart, options) {

    this.chart = chart;

    if (options) {
        this.setOptions(options);
    }
}

AxesArray.prototype.setOptions = function (options) {
	options = options || {};

    var axes = [];
    var currentAxes = this.userAxes;

    for (var i = 0; i < options.length; i++) {

    	var axisOp = options[i];

        this._resolveType(axisOp);

        var axis;

        if (currentAxes) {
        	var currAxis = currentAxes[i];
        	if (currAxis && currAxis.options == axisOp) {
        		currAxis.setOptions(axisOp);
        		axes.push(currAxis);
        		if (currAxis.rangeSlider.visible !== false) {
        			currAxis.skipClear = true;
				}
        		continue;
        	}
        }

        switch (axisOp.type) {
            case 'category':
                axis = new CategoryAxis(axisOp);
                break;
            case 'dateTime':
                axis = new DateTimeAxis(axisOp);
                break;
            case 'linearRadius':
                axis = new LinearRadiusAxis(axisOp);
                break;
            case 'categoryAngle':
                axis = new CategoryAngleAxis(axisOp);
                break;
            case 'linearAngle':
                axis = new LinearAngleAxis(axisOp);
                break;
            case 'linear':
            default:
                axis = new LinearAxis(axisOp);
        }

        axis._setChart(this.chart);
        axes.push(axis);
    }

    this.userAxes = axes;

    this.clear();
}

AxesArray.prototype._resolveType = function (axisOp) {

    if (axisOp.type) {
        return;
    }

    var series = this.chart.series.items;

    if (series.length < 1) {
        return;
    }

    series[0]._resolveAxisType(axisOp);
}

AxesArray.prototype._initSeriesAxes = function () {
    var axes = [];
    $.merge(axes, this.userAxes);

    var series = this.chart.series.items;

    for (var i = 0; i < series.length; i++) {

        var ser = series[i];

        if (!ser.isInScene()) {
            continue;
        }

        ser._initXAxis(axes);
        ser._initYAxis(axes);
        ser._initSharedAxes();
    }

    this.items = axes;
}

AxesArray.prototype._initSeries = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {
        var axis = axes[i];
        axis._initSeries();
    }
}

AxesArray.prototype._initRanges = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        axis._initRange();
    }
}

AxesArray.prototype._resetWH = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];

        if (!axis.isCustomWidth) {
            axis.width = 0;
        }

        if (!axis.isCustomHeight) {
        	axis.height = 0;
        }
    }
}

AxesArray.prototype._measure = function () {
    var axes = this.items;

    var isSizeChanged = false;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];

        var isAxisSizeChanged = axis._measure();

        isSizeChanged = isSizeChanged || isAxisSizeChanged;
    }

    return isSizeChanged;
}

AxesArray.prototype._arrange = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        axis._arrange();
    }
}

AxesArray.prototype._getAxesInLoc = function (location) {
    var res = [];
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.location == location) {
            res.push(axis);
        }
    }

    return res;
}

AxesArray.prototype._getVAxes = function () {
    var res = [];
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.isVertical()) {
            res.push(axis);
        }
    }

    return res;
}

AxesArray.prototype._getHAxes = function () {
    var res = [];
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.isVertical() == false) {
            res.push(axis);
        }
    }

    return res;
}

AxesArray.prototype._getTotalWidth = function () {

    if (this.horCrossingAxis) {
        return 0;
    }

    var tW = 0;
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.isVertical()) {
            tW = tW + axis.width;
        }
    }

    return tW;
}

AxesArray.prototype._getTotalHeight = function () {

    if (this.verCrossingAxis) {
        return 0;
    }

    var tH = 0;
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.isVertical() == false) {
            tH = tH + axis.height;
        }
    }

    return tH;
}

AxesArray.prototype._render = function (shapes) {
    var axes = this.items;

    var postShapes = [];
    var contextShapes = [];

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        var shs = axis._render(shapes);
        if (shs.postShapes) {
            $.merge(postShapes, shs.postShapes);
        }

        if (shs.contextShapes) {
            $.merge(contextShapes, shs.contextShapes);
        }
    }

    return { postShapes: postShapes, contextShapes: contextShapes };
}

AxesArray.prototype._updateOrigins = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        axis._updateOrigin();
    }
}


AxesArray.prototype._correctOrigins = function () {
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis._correctOrigin) {
            axis._correctOrigin();
        }
    }
}

AxesArray.prototype._updateCrossings = function () {

    //var verCrossingAxis = this.verCrossingAxis;
    //var horCrossingAxis = this.horCrossingAxis;

    //if (verCrossingAxis) {
    //    var crossPos = verCrossingAxis.getPosition(verCrossingAxis.crossing);

    //    var hAxes = this._getHAxes();
    //    for (var i = 0; i < hAxes.length; i++) {

    //        var axis = hAxes[i];
    //        axis.crossOffsetY = crossPos - axis.y;

    //        if (axis.location == 'top') {
    //            axis.crossOffsetY -= axis.height;
    //        }
    //    }
    //}

    //if (horCrossingAxis) {
    //    var crossPos = horCrossingAxis.getPosition(horCrossingAxis.crossing);

    //    var vAxes = this._getVAxes();
    //    for (var i = 0; i < vAxes.length; i++) {

    //        var axis = vAxes[i];
    //        axis.crossOffsetX = crossPos - axis.x;

    //        if (axis.location == 'left') {
    //            axis.crossOffsetX -= axis.width;
    //        }
    //    }
    //}
}

AxesArray.prototype._initCrossingAxes = function () {

    //var vAxes = this._getVAxes();
    //var hAxes = this._getHAxes();

    //var horCrossingAxis = null;
    //var verCrossingAxis = null;

    //for (var i = 0; i < vAxes.length; i++) {

    //    var axis = vAxes[i];

    //    if (!jMath.isNull(axis.crossing)) {
    //        verCrossingAxis = axis;
    //        break;
    //    }
    //}

    //for (var i = 0; i < hAxes.length; i++) {

    //    var axis = hAxes[i];

    //    if (!jMath.isNull(axis.crossing)) {
    //        horCrossingAxis = axis;
    //        break;
    //    }
    //}

    //this.horCrossingAxis = horCrossingAxis;
    //this.verCrossingAxis = verCrossingAxis;
}


AxesArray.prototype.getZoomableAxes = function () {
    var res = [];
    var axes = this.items;

    for (var i = 0; i < axes.length; i++) {

        var axis = axes[i];
        if (axis.zoomEnabled) {
            res.push(axis);
        }
    }

    return res;
}

AxesArray.prototype.find = function (name) {
    var axes = this.items;

    // try find an axis with that name
    if (name != null) {
        for (var i = 0; i < axes.length; i++) {

            var axis = axes[i];
            if (axis.name == name) {
                return axis;
            }
        }
    }

    return null;
}

AxesArray.prototype.clear = function () {

    if (!this.items) {
        return;
    }

    $.each(this.items, function () {
    	if (!this.skipClear) {
    		this.clear();
    	}
    	else {
    		this.skipClear = false;
    	}
    });
}

/**
 * @class Chart.Axes.Axis
 * @extends Common.AxisBase
 * 
 * Base chart axis class.
 * 
 **/
function Axis(options) {
    AxisBase.call(this, options);
}

Axis.prototype = new AxisBase();
Axis.constructor = Axis;

Axis.prototype._initDefs = function () {

    AxisBase.prototype._initDefs.call(this);

    var defs = $.extend(true, {}, this.defaults, {

        /**
         * @cfg {Object} rangeSlider
         * Specifies the axis range slider.
         */
        rangeSlider: {
            visible: true,
            breadth: 20
        },

    	/**
        * @cfg {Number} margin
        * Specifies how big is the step when zoom with mouse wheel.
        */
        mouseWheelZoomStep: 0.001,

    	/**
        * @cfg {Number} margin
        * Specifies how big is the step when scroll with mouse wheel.
        */
        mouseWheelScrollStep: 0.05,

        /**
        * @cfg {Number} margin
        * Specifies the axis margin.
        *
        */
        margin: 5,

        /**
          * @cfg {String} strokeStyle
          * Specifies the axis line color.
          */
        strokeStyle: 'black',
        /**
         * @cfg {Number} lineWidth
         * Specifies the axis line width.
         */
        lineWidth: 1,

        /**
        * @cfg {Boolean} zoomEnabled
        * Specifies whether or not the axis zoom is enabled.
        */
        zoomEnabled: false,

        /**
        * @cfg {Boolean} visible
        * Specifies whether or not this axis should be displayed.
        */
        visible: true

        /**
        * @cfg {String} type
        * Specifies the axis type -  'category', 'linear', 'dateTime', 'categoryAngle', 'linearRadius' or 'linearAngle'.
        */

        /**
        * @cfg {String} name
        * Specifies the axis name.
        */

        /**
         * @cfg {String} location
         * Specifies the axis location -  'right', 'bottom', 'left' or 'top'.
         *
         * Defaults to: 'left'
         */

        /**
         * @cfg {Number[]} strokeDashArray
         * Specifies the axis line stroke dash array - [2, 4].
         */

        /**
        * @cfg {Chart.GridLine} majorGridLines
        * Specifies the axis major grid lines.
        */

        /**
        * @cfg {Chart.GridLine} minorGridLines
        * Specifies the axis minor grid lines.
        */

        /**
        * @cfg {String/Common.Title} title
        * Specifies the axis title.
        */
    });

    this.defaults = defs;
}

Axis.prototype._initSeries = function () {
    var axSeries = new SeriesArray(null, this.chart);

    var series = this.chart.series.items;

    for (var i = 0; i < series.length; i++) {
        var ser = series[i];

        if (ser.realXAxis == this || ser.realYAxis == this) {
            axSeries.items.push(ser);
        }
    }

    this.series = axSeries;
}

Axis.prototype._setVisibleRanges = function () {
    AxisBase.prototype._setVisibleRanges.call(this);

    if (!this.jqRangeSlider) {
        return;
    }

    var smallChange = (this.actualMaximum - this.actualMinimum) / 10;

    this.jqRangeSlider.jqRangeSlider('update', {
        minimum: this.actualMinimum,
        maximum: this.actualMaximum,
        smallChange: smallChange,
        largeChange: 2 * smallChange,
        minRange: smallChange / 100,
        range: {
            minimum: this.actualVisibleMinimum,
            maximum: this.actualVisibleMaximum
        }
    });
}

Axis.prototype._arrange = function () {
    AxisBase.prototype._arrange.call(this);

    if (!this.zoomEnabled) {
        this.clear();
        return;
    }

    var rangeSliderBreadth = this.rangeSlider.breadth;

    if (this.rangeSlider.visible === false) {
        return;
    }

    this.offset += rangeSliderBreadth;
    var offset = this.offset;

    if (!this.jqRangeSlider) {

        var rangeSlider = $('<div style="position:absolute"></div>').jqRangeSlider({});

        var that = this;
        var chartOpts = that.chart.options;

        if (!chartOpts.dataSource || chartOpts.dataSource.serverFiltering !== true) {
            rangeSlider.bind('rangeChanging', function (event, range) {
                that._sliderZoom(range, {sliderZooming: true});
            });
        }

        rangeSlider.bind('rangeChanged', function (event, range) {
            that._sliderZoom(range, {sliderZooming: true });
        });

        this.chart.elem.append(rangeSlider);
        this.jqRangeSlider = rangeSlider;
    }

    var css;

    switch (this.location) {
        case 'left':
            css = {
                left: this.x + this.width - offset,
                top: this.y,
                width: rangeSliderBreadth,
                height: this.height
            };
            break;
        case 'right':
            css = {
                left: this.x + this.lineWidth / 2,
                top: this.y,
                width: rangeSliderBreadth,
                height: this.height
            };
            break;
        case 'top':
            css = {
                left: this.x,
                top: this.y + this.height - offset,
                width: this.width,
                height: rangeSliderBreadth
            };
            break;
        case 'bottom':
            css = {
                left: this.x,
                top: this.y + this.lineWidth / 2,
                width: this.width,
                height: rangeSliderBreadth
            };
        default:
            break;
    }

    if (css) {
        var orientation = this.isAxisVertical ? 'vertical' : 'horizontal';

        this.jqRangeSlider.css(css).jqRangeSlider('update', {
            orientation: orientation,
            reversed: this.reversed
        });
    }
}

Axis.prototype._moveVisibleRange = function (dx, dy) {

    var vertical = this.isAxisVertical;

    var min = this.actualVisibleMinimum;
    var max = this.actualVisibleMaximum;

    var range = max - min;

    var offset = 0;

    if (vertical) {
        offset = -range * dy / this.length;
    }
    else {
        offset = range * dx / this.length;
    }

    if (this.reversed) {
        offset = -offset;
    }

    offset = Math.max(offset, this.actualMinimum - min);
    offset = Math.min(offset, this.actualMaximum - max);

    this.visibleMinimum = min + offset;
    this.visibleMaximum = max + offset;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype._mouseWheelZoom = function (delta) {

    var min = this.actualVisibleMinimum;
    var max = this.actualVisibleMaximum;

    var minRange = this.mouseWheelZoomStep * (this.actualMaximum - this.actualMinimum);

    var offset = delta * 50 * minRange;

    min = Math.max(this.actualMinimum, min + offset);
    max = Math.min(this.actualMaximum, max - offset);

    if (min > max - minRange) {

        minRange /= 2;

        var center = (min + max) / 2;
        min = center - minRange;
        max = center + minRange
    }

    this.visibleMinimum = min;
    this.visibleMaximum = max;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype._mouseWheelScroll = function (delta) {

    var min = this.actualVisibleMinimum;
    var max = this.actualVisibleMaximum;

    var range = this.mouseWheelScrollStep * delta * (this.actualMaximum - this.actualMinimum);

    if (min + range < this.actualMinimum) {
        range = this.actualMinimum - min;
    }

    if (max + range > this.actualMaximum) {
        range = this.actualMaximum - max;
    }

    min += range;
    max += range;

    this.visibleMinimum = min;
    this.visibleMaximum = max;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype._scaleVisibleRange = function (input1, input2) {

    var min = this.actualVisibleMinimum;
    var max = this.actualVisibleMaximum;

    var range = max - min;
    var zoom = this.getZoom();

    var scale, offset1, offset2;

    var vertical = this.isAxisVertical;

    if (vertical) {
        scale = input1.dy / input2.dy;

        var dy1 = input2.y1 - input1.y1;
        var dy2 = input2.y2 - input1.y2;

        offset1 = -range * dy2 / this.length / zoom;
        offset2 = -range * dy1 / this.length / zoom;

        if (input1.y1 > input1.y2) {
            var temp = offset1;
            offset1 = offset2;
            offset2 = temp;
        }
    }
    else {
        scale = input1.dx / input2.dx;

        var dx1 = input2.x1 - input1.x1;
        var dx2 = input2.x2 - input1.x2;

        offset1 = range * dx1 / this.length / zoom;
        offset2 = range * dx2 / this.length / zoom;

        if (input1.x1 > input1.x2) {
            var temp = offset1;
            offset1 = offset2;
            offset2 = temp;
        }
    }

    if (this.reversed) {
        var temp = offset1;
        offset1 = -offset2;
        offset2 = -temp;
    }

    var center = (min + max) / 2;

    var minRange = (this.actualMaximum - this.actualMinimum) / 1000;

    min = Math.max(this.actualMinimum, min - offset1);
    max = Math.min(this.actualMaximum, max - offset2);

    if (min > max - minRange) {

        minRange /= 2;

        min = center - minRange;
        max = center + minRange
    }

    this.visibleMinimum = min;
    this.visibleMaximum = max;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype._scaleToRegion = function (input1, input2) {

    var gridArea = this.chart.gridArea;

    var x1 = gridArea.fitHor(input1.locX);
    var y1 = gridArea.fitVer(input1.locY);

    var x2 = gridArea.fitHor(input2.locX);
    var y2 = gridArea.fitVer(input2.locY);

    var reversed = this.reversed;

    var vl1, vl2;
    if (this.isAxisVertical) {
        if (reversed) {
            vl1 = Math.min(y1, y2);
            vl2 = Math.max(y1, y2);
        }
        else {
            vl1 = Math.max(y1, y2);
            vl2 = Math.min(y1, y2);
        }
    }
    else {
        if (reversed) {
            vl1 = Math.max(x1, x2);
            vl2 = Math.min(x1, x2);
        }
        else {
            vl1 = Math.min(x1, x2);
            vl2 = Math.max(x1, x2);
        }
    }

    vl1 = this.getValue(vl1);
    vl2 = this.getValue(vl2);

    var minRange = (this.actualMaximum - this.actualMinimum) / 1000;

    if (vl2 - vl1 < minRange) {
        var diff = (minRange - (vl2 - vl1)) / 2;
        vl1 -= diff;
        vl2 += diff;
    }

    this.visibleMinimum = vl1;
    this.visibleMaximum = vl2;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype._sliderZoom = function (range, opts) {

    this.visibleMinimum = this.options.visibleMinimum = range.minimum;
    this.visibleMaximum = this.options.visibleMaximum = range.maximum;

    this.chart.partialDelayedUpdate();
    this._zoom(opts);
}

Axis.prototype._zoom = function (opts) {

    this.chart.elem.trigger('axisZoom', { chart: this.chart, axis: this , opts: opts});
}

Axis.prototype._getTooltip = function (value) {
	return '<b>' + jMath.replaceTextForTooltip(value) + '</b><br/>';
}

Axis.prototype.getCatPosition = function (value) {

    return AxisBase.prototype.getPosition.call(this, value);
}

Axis.prototype.resetZoom = function () {
    if (!this.zoomEnabled) {
        return;
    }

    this.visibleMinimum = this.actualMinimum;
    this.visibleMaximum = this.actualMaximum;

    this._setVisibleRanges();
    this._zoom();
}

Axis.prototype.clear = function () {
    if (this.jqRangeSlider) {
        this.jqRangeSlider.jqRangeSlider('destroy');
        this.jqRangeSlider.remove();
        this.jqRangeSlider = null;
    }
}

/**
 * @class Chart.Axes.Category
 * @extends Chart.Axes.Axis
 * 
 * 
 * The Category Axis is used for representing data grouped by a set 
 * of discrete values along an axis. It defines a set of labels that 
 * appear along an axis of a chart. For example, charts that renders 
 * data according to City, Country and so on. 
 */
function CategoryAxis(options) {

    /**
    * @cfg {String[]} categories
    * Specifies the axis categories array - ['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5', 'Cat 6'].
    *
    * Automatically generated if categories are not set.
    */

    Axis.call(this, options);

    this.DataType = 'CategoryAxis';
}

CategoryAxis.prototype = new Axis();
CategoryAxis.constructor = CategoryAxis;

CategoryAxis.prototype.getCategories = function () {

    if (this.categories) {
        return this.categories;
    }

    var arrDataSource = this.chart.arrDataSource;

    if (!arrDataSource) {
        return null;
    }

    var categoriesField = this.categoriesField;

    var cats = jMath.processDataField(arrDataSource, categoriesField);
    return cats;
}

CategoryAxis.prototype._initRange = function () {
    var series = this.series;
    series._initCategories();

    var cats = series.categories;

    this.arrCats = this.getCategories();

    var categoriesLength = cats.length;

    if (this.arrCats) {
        categoriesLength = Math.max(categoriesLength, this.arrCats.length);
    }

    var min = 0;
    var max = categoriesLength;

    if (!jMath.isNull(this.minimum)) {
        min = this.minimum;
    }

    if (!jMath.isNull(this.maximum)) {
        max = this.maximum;
    }

    this.actualMinimum = min;
    this.actualMaximum = max;

    this._setVisibleRanges();

    this.actualInterval = this.interval || 1;
    this.seriesCategories = cats;
}

CategoryAxis.prototype._getLabelIntervals = function (interval, mark) {
    var offset = 0;
    if (mark && mark.intervalOffset) {
        offset = mark.intervalOffset;
    }

    var intrs = [];

    var min = Math.round(this.actualVisibleMinimum);

    var intrStart = this._getIntervalStart(min, interval) + 0.5;

    for (var i = intrStart + offset; i <= this.actualVisibleMaximum; i = jMath.round(i + interval)) {
        intrs.push(i);
    }

    return intrs;
}

CategoryAxis.prototype._getIntervalCount = function () {
    return this.arrCats.length;
}

CategoryAxis.prototype._getValue = function (value) {

    var index = Math.round(value);

    var category;

    if (this.arrCats && index < this.arrCats.length) {
        category = this.arrCats[index];
    }
    else {
        category = this.seriesCategories[index];
    }

    return category;
}

CategoryAxis.prototype.getLabel = function (value) {

    var label;

    if ($.type(value) == 'string') {
        label = value;
    }
    else {
        var index = Math.round(value - 0.5);

        if (this.arrCats && index < this.arrCats.length) {
            label = this.arrCats[index];
        }
        else {
            label = this.seriesCategories[index];
        }
    }

    label = label || '';

    return Axis.prototype.getLabel.call(this, label);
}

CategoryAxis.prototype.getCatPosition = function (value) {

    if (this.reversed) {
        value++;
    }

    return AxisBase.prototype.getPosition.call(this, value);

}

CategoryAxis.prototype.getOrientation = function (series) {
    return 'x';
}

/**
 * @class Chart.Axes.Linear
 * @extends Chart.Axes.Axis
 * 
 * 
 * The Linear Axis maps numeric values evenly between a minimum and maximum 
 * value along a chart axis. By default, it determines minimum, maximum, 
 * and interval values from the charting data to fit all of the chart elements on the screen. 
 * You can also explicitly set specific values for these properties.
 **/
function LinearAxis(options) {

	Axis.call(this, options);

	this.DataType = 'LinearAxis';
}

LinearAxis.prototype = new Axis();
LinearAxis.constructor = LinearAxis;

LinearAxis.prototype._initDefs = function () {

	Axis.prototype._initDefs.call(this);

	var defs = $.extend(true, {}, this.defaults, {

		/**
         * @cfg {Boolean} extendRangeToOrigin
         * Specifies whether or not the axis range should be extended to the origin.
         * 
         * The "extendRangeToOrigin" option of the linear axis is used when 
         * you want to display the origin (0 or the 'crossing' value) on the 
         * linear axis, but you don't want to have to set "minimum" or "maximum" 
         * because your data could have positive or negative values - or both.
         */
		extendRangeToOrigin: false,

		/**
         * @cfg {Boolean} logarithmic
         * Specifies whether or not the axis scale is logarithmic.
         */
		logarithmic: false,
		/**
        * @cfg {Number} logBase
        * Specifies logarithmic scale base.
        *
        */
		logBase: 10,
		labels: {
			resolveOverlappingMode: 'hide'// hide | multipleRows
		}

		/**
        * @cfg {Number} minimum
        * Specifies the axis minimum.
        *
        * Automatically calculated if it is not set.
        */

		/**
        * @cfg {Number} maximum
        * Specifies the axis maximum.
        *
        * Automatically calculated if it is not set.
        */

		/**
        * @cfg {Number} interval
        * Specifies how often points are plotted along that axis.
        *
        * Automatically calculated if it is not set.
        */


		/**
        * @cfg {Number} crossing
        * Specifies the axis crossing.
        *
        */


		/**
        * @cfg {Number} leftMargin
        * Specifies the axis left margin.
        */

		/**
        * @cfg {Number} rightMargin
        * Specifies the axis right margin.
        */

		/**
        * @cfg {Number} topMargin
        * Specifies the axis top margin.
        */

		/**
        * @cfg {Number} bottomMargin
        * Specifies the axis bottom margin.
        */

		/**
        * @cfg {Number} minimumRange
        * Specifies the axis minimum range.
        */
	});

	this.defaults = defs;
}

LinearAxis.prototype._initRange = function () {
	var series = this.series;
	series._initRanges();

	var dMin, dMax;
	if (this.getOrientation() == 'x') {
		dMin = series.minX;
		dMax = series.maxX;
	}
	else {
		dMin = series.min;
		dMax = series.max;
	}

	if (dMin == maxVl && dMax == minVl) {
		dMin = 0;
		dMax = 10;
	}

	var plotRange = this._addPlotsInRange(dMin, dMax);
	dMin = plotRange.min;
	dMax = plotRange.max;

	if (!jMath.isNull(this.minimum)) {
		dMin = this.minimum;
	}

	if (!jMath.isNull(this.maximum)) {
		dMax = this.maximum;
	}

	var range = Math.abs(dMax - dMin);

	// fix when the range is too small compare to the values
	var divisor = this.DataType == 'DateTimeAxis' ? 100000000000 : 1000000;
	if (range < Math.abs(dMin) / divisor) {
		range = 0;
	}

	if (this.skipEmptyDays) {
		range -= this.totalEmptyDaysTicks;
	}

	if (range <= 0) {
		range = Math.max(1, dMax / 10);
		dMin -= range / 2;
		dMax += range / 2;
	}

	var leftMargin = 0;
	var rightMargin = 0;

	var margin = series._getPixelMargins(this);

	if (this.isAxisVertical) {
		margin.left = jMath.isNull(this.bottomMargin) ? margin.left + 0.5 : this.bottomMargin;
		margin.right = jMath.isNull(this.topMargin) ? margin.right + 0.5 : this.topMargin;
	}
	else {
		margin.left = jMath.isNull(this.leftMargin) ? margin.left + 0.5 : this.leftMargin;
		margin.right = jMath.isNull(this.rightMargin) ? margin.right + 0.5 : this.rightMargin;
	}

	var valuePerPixels = range / this.length;

	leftMargin = valuePerPixels * margin.left;
	rightMargin = valuePerPixels * margin.right;

	if (this.logarithmic === true) {
		leftMargin = Math.max(0, jMath.log(leftMargin, this.logBase));
		rightMargin = Math.max(0, jMath.log(rightMargin, this.logBase));
	}

	var currMin = dMin - leftMargin;
	var currMax = dMax + rightMargin;

	var isDataAnchoredToOrigin = this.series._isAnchoredToOrigin();
	var cross = this.getCrossing();

	if (isDataAnchoredToOrigin && this.getOrientation() == 'y') {
		if (dMin >= cross && currMin < cross) {
			currMin = cross;
		}
		else if (dMax <= cross && currMax > cross) {
			currMax = cross;
		}
	}

	if (this.extendRangeToOrigin) {
		if (currMin > cross) {
			currMin = cross;
		}
		else if (currMax < cross) {
			currMax = cross;
		}
	}

	if (this.logarithmic === true) {

		var minValue = 1;

		if (currMin < minValue) {
			currMin = minValue;
		}

		currMin = jMath.log(currMin, this.logBase);
		currMax = jMath.log(currMax, this.logBase);

		var currInterval = this._calculateActualIntervalLogarithmic(currMin, currMax);
		currMin = jMath.round(Math.floor(currMin / currInterval) * currInterval);
		currMax = jMath.round(Math.ceil(currMax / currInterval) * currInterval);
	}

	var minRange = this.minimumRange;
	if (minRange) {
		var currDiff = currMax - currMin;
		if (minRange > currDiff) {
			currDiff = (minRange - currDiff) / 2;
			currMin -= currDiff;
			currMax += currDiff;
		}
	}

	this._setMinMax(currMin, currMax);

	this._setVisibleRanges();

	if (this.logarithmic === true) {
		this.actualInterval = this._calculateActualIntervalLogarithmic(this.actualVisibleMinimum, this.actualVisibleMaximum);
	}
	else {
		this.actualInterval = this._calculateActualInterval(this.actualVisibleMinimum, this.actualVisibleMaximum);
	}
}

LinearAxis.prototype._addPlotsInRange = function (dMin, dMax) {
	var plotLines = this.plotLines;

	if (plotLines) {
		for (var i = 0; i < plotLines.length; i++) {
			var vl = plotLines[i].value;

			if (!jMath.isNull(vl)) {
				dMin = Math.min(dMin, vl);
				dMax = Math.max(dMax, vl);
			}
		}
	}

	var plotBands = this.plotBands;

	if (plotBands) {
		for (var i = 0; i < plotBands.length; i++) {
			var from = plotBands[i].from;
			var to = plotBands[i].to;

			if (!jMath.isNull(from)) {
				dMin = Math.min(dMin, from);
				dMax = Math.max(dMax, from);
			}

			if (!jMath.isNull(to)) {
				dMin = Math.min(dMin, to);
				dMax = Math.max(dMax, to);
			}
		}
	}

	return { min: dMin, max: dMax };
}

LinearAxis.prototype._calculateActualIntervalLogarithmic = function (min, max) {
	if (this.interval) {
		return this.interval;
	}

	var interval = (max - min) / 3.0;

	var baseInterval = Math.floor(jMath.log10(Math.abs(interval)));
	if (baseInterval == 0) {
		baseInterval = 1;
	}

	return jMath.round(Math.floor((interval / baseInterval)) * baseInterval);
}

LinearAxis.prototype._getIntervals = function (interval, mark, major) {

	if (this.customTickMarks) {
		return this.customTickMarks;
	}

	if (this.logarithmic === false) {
		return Axis.prototype._getIntervals.call(this, interval, mark);
	}

	if (major === false) {
		return this._getLogarithmicMinorIntervals(interval, mark);
	}

	var offset = 0;
	if (mark && mark.intervalOffset) {
		offset = mark.intervalOffset;
	}

	var intrs = [];

	var intrStart = this._getIntervalStart(this._getActualVisibleMinimum(), interval);

	for (var i = intrStart + offset; i <= this._getActualVisibleMaximum() ; i = jMath.round(i + interval)) {

		intrs.push(Math.pow(this.logBase, i));
	}

	return intrs;
}

LinearAxis.prototype._getLogarithmicMinorIntervals = function (interval, mark) {

	var majorIntr = this._getMarkInterval(mark.major, true);
	var majorIntrs = this._getIntervals(majorIntr, mark.major, true);

	var intrs = [];

	var prevMajor = null;

	for (var i = 0; i < majorIntrs.length; i++) {
		var major = majorIntrs[i];

		if (prevMajor == null) {
			prevMajor = major;
			continue;
		}

		var value1 = prevMajor;
		var value2 = major;

		if (value1 < value2) {
			var temp = value1;
			value1 = value2;
			value2 = temp;
		}

		var minorDelta = (value1 - value2) * interval / 10;

		var minorPositionValue = value2 + minorDelta;

		while (minorPositionValue < value1) {
			intrs.push(jMath.round(minorPositionValue));
			minorPositionValue += minorDelta;
		}

		prevMajor = major;
	}

	return intrs;
}

LinearAxis.prototype._getIntervalCount = function () {
	return Math.ceil(this._getActualMaximum() - this._getActualMinimum());
}


LinearAxis.prototype.getCrossingPosition = function () {
	return this.getPosition(this.getCrossing());
}

LinearAxis.prototype.getOrientation = function (series) {

	var isVertical = this.isVertical();

	if (this.series) {
		for (var i = 0; i < this.series.items.length; i++) {
			series = this.series.items[i];
		}
	}

	if (series && series.isVertical) {
		isVertical = !isVertical;
	}

	if (isVertical) {
		return 'y';
	}

	return 'x';
}

LinearAxis.prototype.getPosition = function (val) {

	if (this.logarithmic == true) {

		val = jMath.log(val, this.logBase);
	}

	var value = Axis.prototype.getPosition.call(this, val);

	return value;
}

/**
 * @class Chart.Axes.DateTime
 * @extends Chart.Axes.Linear
 * 
 * The DateTime Axis maps time values evenly between a minimum and maximum value 
 * along a chart axis. By default, it determines minimum, maximum, interval and 
 * intervalType values from the charting data to fit all of the chart elements on the screen. 
 * You can also explicitly set specific values for these properties.
 * 
 * The DateTime Axis chooses the most reasonable intervals to mark the axis 
 * by examining the range between the minimum and maximum values of the axis.
 * 
 */
function DateTimeAxis(options) {

    LinearAxis.call(this, options);

    this.DataType = 'DateTimeAxis';
}

DateTimeAxis.prototype = new LinearAxis();
DateTimeAxis.constructor = DateTimeAxis;

DateTimeAxis.prototype._initDefs = function () {

    LinearAxis.prototype._initDefs.call(this);

    var masks = $.jqChartDateFormat.masks;

    var defs = $.extend(true, {}, this.defaults, {

        labels: {
            yearsIntervalStringFormat: 'yyyy',
            monthsIntervalStringFormat: masks.shortDate,
            weeksIntervalStringFormat: masks.shortDate,
            daysIntervalStringFormat: masks.shortDate,
            hoursIntervalStringFormat: masks.shortDate + ' ' + masks.shortTime,
            minutesIntervalStringFormat: masks.shortTime,
            secondsIntervalStringFormat: masks.longTime,
            millisecondsIntervalStringFormat: masks.longTime
        },
        /**
        * @cfg {Boolean} skipEmptyDays
        * Specifies whether or not to skip the days, which don't have data (like weekends and holidays). 
        */
        skipEmptyDays: false

        /**
        * @cfg {Date} minimum
        * Specifies the axis minimum.
        *
        * Automatically calculated if it is not set.
        */

        /**
        * @cfg {Date} maximum
        * Specifies the axis maximum.
        *
        * Automatically calculated if it is not set.
        */

        /**
        * @cfg {String} intervalType
        * specifies the date time interval type -  'years' |  'months' | 'weeks' | 'days' | 'minutes' | 'seconds' | 'millisecond'
        * 
        * Automatically calculated if it is not set.
        */
    });

    this.defaults = defs;
}

DateTimeAxis.prototype._initRange = function () {

    if (this.skipEmptyDays) {
        this.emptyDays = this._getEmptyDays();
        this.totalEmptyDaysTicks = this.emptyDays.length * jDate.ticksInDay;
    }
    else {
        this.totalEmptyDaysTicks = 0;
    }

    LinearAxis.prototype._initRange.call(this);

    this._initActualStringFormat();
}

DateTimeAxis.prototype._setMinMax = function (min, max) {

    if (this.minimum != null) {
        if ($.type(this.minimum) == 'date') {
            this.actualMinimum = this.minimum.getTime();
        }
        else {
            this.actualMinimum = this.minimum;
        }
    }
    else {
        this.actualMinimum = min;
    }

    if (this.maximum != null) {
        if ($.type(this.minimum) == 'date') {
            this.actualMaximum = this.maximum.getTime();
        }
        else {
            this.actualMaximum = this.maximum;
        }
    }
    else {
        this.actualMaximum = max;
    }
}

DateTimeAxis.prototype._calculateActualInterval = function (min, max) {

    //if (this.skipEmptyDays) {
    //    max += this.totalEmptyDaysTicks;
    //}

    var actualInterval = this._calculateDateTimeInterval(min, max);

    if (this.intervalType != null) {
        this.actualIntervalType = this.intervalType;
    }
    else {
        this.actualIntervalType = this.type;
    }

    if (this.interval != null) {
        actualInterval = this.interval;
    }

    return actualInterval;
}

DateTimeAxis.prototype._calculateDateTimeInterval = function (min, max) {

    var timeSpan = max - min;

    var maxIntervals = 0.8 * this.maxInter200Px;

    var actualWidth = Math.max(1, this.length);
    var rangeMultiplicator = actualWidth / (200 * 10 / maxIntervals);

    var milliseconds = timeSpan / rangeMultiplicator;

    this.type = 'year';

    // Minutes
    var inter = milliseconds / (1000 * 60);

    if (inter <= 1.0) {

        // Milli Seconds        
        if (milliseconds <= 10) {
            this.type = "milliseconds";
            return 1;
        }

        if (milliseconds <= 50) {
            this.type = "milliseconds";
            return 4;
        }

        if (milliseconds <= 200) {
            this.type = "milliseconds";
            return 20;
        }

        if (milliseconds <= 500) {
            this.type = "milliseconds";
            return 50;
        }

        // Seconds
        var seconds = milliseconds / 1000;

        if (seconds <= 7) {
            this.type = "seconds";
            return 1;
        }

        if (seconds <= 15) {
            this.type = "seconds";
            return 2;
        }

        if (seconds <= 30) {
            this.type = "seconds";
            return 5;
        }

        if (seconds <= 60) {
            this.type = "seconds";
            return 10;
        }
    }
    else if (inter <= 2.0) {
        this.type = "seconds";
        return 20;
    }

    if (inter <= 3.0) {
        this.type = "seconds";
        return 30;
    }

    if (inter <= 10) {
        this.type = "minutes";
        return 1;
    }

    if (inter <= 20) {
        this.type = "minutes";
        return 2;
    }

    if (inter <= 60) {
        this.type = "minutes";
        return 5;
    }

    if (inter <= 120) {
        this.type = "minutes";
        return 10;
    }

    if (inter <= 180) {
        this.type = "minutes";
        return 30;
    }

    if (inter <= 60 * 12) {
        this.type = "hours";
        return 1;
    }

    if (inter <= 60 * 24) {
        this.type = "hours";
        return 4;
    }

    if (inter <= 60 * 24 * 2) {
        this.type = "hours";
        return 6;
    }

    if (inter <= 60 * 24 * 3) {
        this.type = "hours";
        return 12;
    }

    if (inter <= 60 * 24 * 10) {
        this.type = "days";
        return 1;
    }

    if (inter <= 60 * 24 * 20) {
        this.type = "days";
        return 2;
    }

    if (inter <= 60 * 24 * 30) {
        this.type = "days";
        return 3;
    }

    if (inter <= 60 * 24 * 30.5 * 2) {
        this.type = "weeks";
        return 1;
    }

    if (inter <= 60 * 24 * 30.5 * 5) {
        this.type = "weeks";
        return 2;
    }

    if (inter <= 60 * 24 * 30.5 * 12) {
        this.type = "months";
        return 1;
    }

    if (inter <= 60 * 24 * 30.5 * 24) {
        this.type = "months";
        return 3;
    }

    if (inter <= 60 * 24 * 30.5 * 48) {
        this.type = "months";
        return 6;
    }

    // if more than 48 months interval is year 
    this.type = "years";

    var years = inter / 60 / 24 / 365;
    if (years < 5) {
        return 1;
    }

    if (years < 10) {
        return 2;
    }

    return Math.floor(years / 5);
}

DateTimeAxis.prototype._getNextPosition = function (current, interval) {
    return this._incrementDateTime(current, interval, this.actualIntervalType);
}

DateTimeAxis.prototype._incrementDateTime = function (current, interval, intervalType) {

    var date = new Date(current);

    var span = 0;

    if (intervalType == "days") {
        //span = jDate.fromDays(interval);
        date = jDate.addDays(date, interval);
    }
    else if (intervalType == "hours") {
        span = jDate.fromHours(interval);
    }
    else if (intervalType == "milliseconds") {
        span = interval;
    }
    else if (intervalType == "seconds") {
        span = jDate.fromSeconds(interval);
    }
    else if (intervalType == "minutes") {
        span = jDate.fromMinutes(interval);
    }
    else if (intervalType == "weeks") {
        // span = jDate.fromDays(7.0 * interval);
        date = jDate.addDays(date, 7 * interval);
    }
    else if (intervalType == "months") {
        // Special case handling when current date point
        // to the last day of the month
        var lastMonthDay = false;
        if (date.getDate() == jDate.getDaysInMonth(date.getFullYear(), date.getMonth())) {
            lastMonthDay = true;
        }

        // Add specified amount of months
        date = jDate.addMonths(date, Math.floor(interval));
        span = jDate.fromDays(30.0 * (interval - Math.floor(interval)));

        // Check if last month of the day was used
        if (lastMonthDay && span == 0) {
            // Make sure the last day of the month is selected
            var daysInMonth = jDate.getDaysInMonth(date.getFullYear(), date.getMonth());
            date = jDate.addDays(date, daysInMonth - date.getDate());
        }
    }
    else if (intervalType == "years") {
        date = jDate.addYears(date, Math.floor(interval));
        span = jDate.fromDays(365.0 * (interval - Math.floor(interval)));
    }

    return date.getTime() + span;
}

DateTimeAxis.prototype._getIntervalStart = function (start, intervalSize, intervalType) {

    if (intervalType == null) {
        return start;
    }

    // Get the beginning of the interval depending on intervalType
    var newStartDate = new Date(start);

    // Adjust the months interval depending on size
    if (intervalSize > 0.0 && intervalSize != 1.0) {
        if (intervalType == "months" && intervalSize <= 12.0 && intervalSize > 1) {
            // Make sure that the beginning is aligned correctly for cases
            // like quarters and half years
            var resultDate = newStartDate;
            var sizeAdjustedDate = new Date(newStartDate.getFullYear(), 0, 1, 0, 0, 0);
            while (sizeAdjustedDate < newStartDate) {
                resultDate = sizeAdjustedDate;
                sizeAdjustedDate = jDate.addMonths(sizeAdjustedDate, intervalSize);
            }

            newStartDate = resultDate;
            return newStartDate.getTime();
        }
    }

    // Check interval type
    switch (intervalType) {
        case "years":
            var year = (newStartDate.getFullYear() / intervalSize) * intervalSize;
            if (year <= 0) {
                year = 1;
            }
            newStartDate = new Date(year, 0, 1, 0, 0, 0);
            break;

        case "months":
            var month = (newStartDate.getMonth() / intervalSize) * intervalSize;
            if (month < 0) {
                month = 0;
            }
            newStartDate = new Date(newStartDate.getFullYear(), month, 1, 0, 0, 0);
            break;

        case "days":
            var day = (newStartDate.getDate() / intervalSize) * intervalSize;
            if (day <= 0) {
                day = 1;
            }
            newStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), day, 0, 0, 0);
            break;

        case "hours":
            var hour = (newStartDate.getHours() / intervalSize) * intervalSize;
            newStartDate = new Date(
                        newStartDate.getFullYear(),
                        newStartDate.getMonth(),
                        newStartDate.getDate(),
                        hour,
                        0,
                        0);
            break;

        case "minutes":
            var minute = (newStartDate.getMinutes() / intervalSize) * intervalSize;
            newStartDate = new Date(
                        newStartDate.getFullYear(),
                        newStartDate.getMonth(),
                        newStartDate.getDate(),
                        newStartDate.getHours(),
                        minute,
                        0);
            break;

        case "seconds":
            var second = (newStartDate.getSeconds() / intervalSize) * intervalSize;
            newStartDate = new Date(
                        newStartDate.getFullYear(),
                        newStartDate.getMonth(),
                        newStartDate.getDate(),
                        newStartDate.getHours(),
                        newStartDate.getMinutes(),
                        second,
                        0);
            break;

        case "milliseconds":
            var milliseconds = (newStartDate.getMilliseconds() / intervalSize) * intervalSize;
            newStartDate = new Date(
                        newStartDate.getFullYear(),
                        newStartDate.getMonth(),
                        newStartDate.getDate(),
                        newStartDate.getHours(),
                        newStartDate.getMinutes(),
                        newStartDate.getSeconds(),
                        milliseconds);
            break;

        case "weeks":

            newStartDate = new Date(
                        newStartDate.getFullYear(),
                        newStartDate.getMonth(),
                        newStartDate.getDate(),
                        0,
                        0,
                        0);

            newStartDate = jDate.addDays(newStartDate, -jDate.getDayOfWeek(newStartDate));
            break;
    }

    return newStartDate.getTime();
}

DateTimeAxis.prototype._initActualStringFormat = function () {

    if (!this.labels || this.labels.visible === false) {
        return;
    }

    if (this.labels.stringFormat) {
        this.actualStringFormat = this.labels.stringFormat;
        return;
    }

    switch (this.actualIntervalType) {

        case 'years':
            this.actualStringFormat = this.labels.yearsIntervalStringFormat;
            break;
        case 'months':
            this.actualStringFormat = this.labels.monthsIntervalStringFormat;
            break;
        case 'weeks':
            this.actualStringFormat = this.labels.weeksIntervalStringFormat;
            break;
        case 'days':
            this.actualStringFormat = this.labels.daysIntervalStringFormat;
            break;
        case 'hours':
            this.actualStringFormat = this.labels.hoursIntervalStringFormat;
            break;
        case 'minutes':
            this.actualStringFormat = this.labels.minutesIntervalStringFormat;
            break;
        case 'seconds':
            this.actualStringFormat = this.labels.secondsIntervalStringFormat;
            break;
        case 'milliseconds':
            this.actualStringFormat = this.labels.millisecondsIntervalStringFormat;
            break;
        default:
            this.actualStringFormat = "default";
            break;
    }
}

DateTimeAxis.prototype._getIntervals = function (interval, mark) {

    if (this.customTickMarks) {
        return this.customTickMarks;
    }

    var intrs = [];

    var min = this.actualVisibleMinimum;
    var max = this.actualVisibleMaximum;

    //if (this.skipEmptyDays) {
    //    min = this._addEmptyDaysOffset(min);
    //    max = this._addEmptyDaysOffset(max);
    //}

    var intrStart = this._getIntervalStart(min, interval, this.actualIntervalType);

    while (intrStart < min) {
        intrStart = this._incrementDateTime(intrStart, interval, this.actualIntervalType);
    }

    if (mark && mark.intervalOffset) {

        var intervalOffsetType = this.actualIntervalType;
        var offset = mark.intervalOffset;

        if (mark.intervalOffsetType) {
            intervalOffsetType = mark.intervalOffsetType;
        }

        intrStart = this._incrementDateTime(intrStart, offset, intervalOffsetType);
    }

    for (var i = intrStart; i <= max; i = this._incrementDateTime(i, interval, this.actualIntervalType)) {

        var nonEmptyDay = this._getNextNonEmptyDay(i);
        if (nonEmptyDay) {
            if (this.skipEmptyDays && i < nonEmptyDay) {
                i = nonEmptyDay;
            }

            intrs.push(nonEmptyDay);
        }
    }

    return intrs;
}

DateTimeAxis.prototype._getIntervalCount = function () {

    var diff = this._getActualMaximum() - this._getActualMinimum();

    diff = Math.ceil(diff / jDate.ticksInDay);

    return diff;
}

DateTimeAxis.prototype._getNextNonEmptyDay = function (val) {
    if (!this.emptyDays) {
        return val;
    }

    var index = $.inArray(val, this.emptyDays);
    if (index == -1) {
        return val;
    }

    var start = jDate.addDays(new Date(val), 1);

    var max = this.actualVisibleMaximum;

    //if (this.skipEmptyDays) {
    //    max += this.totalEmptyDaysTicks;
    //}

    for (var i = start; i <= max; i = jDate.addDays(i, 1)) {

        var iTime = i.getTime();

        index = $.inArray(iTime, this.emptyDays);
        if (index == -1) {
            return iTime;
        }
    }

    return null;
}

DateTimeAxis.prototype._getEmptyDaysOffset = function (date) {

    if (!this.emptyDays) {
        return 0;
    }

    var days = 0;

    for (var i = 0; i < this.emptyDays.length; i++) {

        var item = this.emptyDays[i];
        if (item < date) {
            days++;
        }
        else {
            break;
        }
    }

    return days * jDate.ticksInDay;
}

DateTimeAxis.prototype._addEmptyDaysOffset = function (date) {

    if (jMath.isNull(date)) {
        return null;
    }

    var result = date + this._getEmptyDaysOffset(date);

    var diff = this._getEmptyDaysOffset(result) - this._getEmptyDaysOffset(date);

    date = result;
    result += diff;

    while (diff) {
        diff = this._getEmptyDaysOffset(result) - this._getEmptyDaysOffset(date);

        date = result;
        result += diff;
    }

    return result;
}

DateTimeAxis.prototype._getEmptyDays = function () {
    var dates = [];

    for (var i = 0; i < this.series.items.length; i++) {
        var series = this.series.items[i];

        if (i == 0) {
            dates = this._getEmptyDaysFromSeries(series);
        }
        else {
            this._excludeDaysFromSeries(series, dates);
        }
    }

    return dates;
}

DateTimeAxis.prototype._getEmptyDaysFromSeries = function (series) {
    var dates = [];

    var data = [];
    $.merge(data, series.arrData);

    data.sort(function (a, b) {
        return a[0] - b[0];
    });

    var prev = jDate.roundToDay(data[0][iX]);

    for (var j = 1; j < data.length; j++) {
        var item = jDate.roundToDay(data[j][iX]);

        var diff = (item - prev) / jDate.ticksInDay;

        for (var k = 1; k < diff; k++) {
            dates.push(jDate.addDays(prev, k).getTime());
        }

        prev = item;
    }

    return dates;
}

DateTimeAxis.prototype._excludeDaysFromSeries = function (series, dates) {
    $.each(series.arrData, function (i, item) {
        var time = jDate.roundToDay(item[iX]).getTime();
        var index = $.inArray(time, dates);
        if (index != -1) {
            dates.splice(index, 1);
        }
    });
}

DateTimeAxis.prototype._getTooltip = function (value) {

    var masks = $.jqChartDateFormat.masks;

    var format = '';

    if (value.getSeconds() != 0) {
        format += masks.shortDate + ' ' + masks.longTime;
    }
    else if (value.getHours() != 0 || value.getMinutes() != 0) {
        format += masks.shortDate + ' ' + masks.shortTime;
    }
    else {
        format = masks.shortDate;
    }

    value = this.chart.stringFormat(value, format);
    return '<b>' + value + '</b><br/>';
}

DateTimeAxis.prototype._getActualVisibleMinimum = function () {
    var value = this.actualVisibleMinimum;
    return value - this._getEmptyDaysOffset(value);
}

DateTimeAxis.prototype._getActualVisibleMaximum = function () {
    var value = this.actualVisibleMaximum;
    return value - this._getEmptyDaysOffset(value);
}

DateTimeAxis.prototype._getActualMinimum = function () {
    var value = this.actualMinimum;
    return value - this._getEmptyDaysOffset(value);
}

DateTimeAxis.prototype._getActualMaximum = function () {
    var value = this.actualMaximum;
    return value - this._getEmptyDaysOffset(value);
}

DateTimeAxis.prototype.getPosition = function (val) {

    if ($.type(val) == 'date') {
        val = val.getTime();
    }

    var offset = 0;

    if (this.skipEmptyDays) {
        offset = this._getEmptyDaysOffset(val);
    }

    var value = LinearAxis.prototype.getPosition.call(this, val - offset);

    return value;
}

DateTimeAxis.prototype.getLabel = function (value) {

    if (!this.labels ||
        this.labels.visible === false ||
        !this.actualStringFormat) {
        return;
    }

    var date = new Date(value);

    return $.jqChartDateFormatter(date, this.actualStringFormat);
}

/**
 * @class Chart.Axes.LinearRadius
 * @extends Chart.Axes.Linear
 * 
 * The Linear Radius Axis is used with the Radar and Polar series.
 */
function LinearRadiusAxis(options) {

    LinearAxis.call(this, options);

    this.DataType = "LinearRadiusAxis";
}

LinearRadiusAxis.prototype = new LinearAxis();
LinearRadiusAxis.constructor = LinearRadiusAxis;

LinearRadiusAxis.prototype._initDefs = function () {

    LinearAxis.prototype._initDefs.call(this);

    var defs = $.extend(true, {}, this.defaults, {
        /**
          * @cfg {Number} innerExtent
          * Specifies the axis inner extent - from 0 to 1.
          */
        innerExtent: 0.2,
        /**
         * @cfg {String} renderStyle
         * Specifies the axis render style -  'circle' or 'polygon'.
         */
        renderStyle: 'circle',
        majorTickMarks: { visible: false },
        location: 'radial',
        majorGridLines: {
            strokeStyle: 'gray',
            lineWidth: 1,
            visible: true
        }
    });

    this.defaults = defs;
}

LinearRadiusAxis.prototype.getOrientation = function () {
    return 'y';
}

LinearRadiusAxis.prototype._measure = function () {

    this.width = 0;
    this.height = 0;

    return false;
}


LinearRadiusAxis.prototype._arrange = function () {
    this._initRadialMeasures();
}

LinearRadiusAxis.prototype._updateOrigin = function () {

    var margin = this.innerExtent * this.radius;

    this.origin = this.cx + margin;
    this.length = this.radius - margin;
    this.extent = margin;
}

LinearRadiusAxis.prototype._getLabels = function () {

    var label = this.labels;

    if (label == null || label.visible === false) {
        return [];
    }

    var offset = this._getMaxOutsideTickMarksLength() + this.lblMargin;

    var shapes = [];

    var intr = this._getMarkInterval(label, true);

    var intrs = this._getLabelIntervals(intr, label);

    var len = intrs.length;
    var showFirst = label.showFirstLabel;
    var showLast = label.showLastLabel;

    for (var i = 0; i < len; i++) {

        if ((!showFirst && i == 0) ||
            (!showLast && i == len - 1)) {
            continue;
        }

        var val = intrs[i];

        var lblText = this.getLabel(val);

        var tBlock = this._createLabel(lblText, label);

        var pos = this.getPosition(val);

        var y = this.cy;
        var x = pos;

        var pt = jMath.rotatePointAt(x, y, -Math.PI / 2, this.cx, this.cy);

        tBlock.x = pt.x - offset;
        tBlock.y = pt.y;
        tBlock.textAlign = 'right';

        shapes.push(tBlock);
    }

    return shapes;
}

LinearRadiusAxis.prototype._getTickMarks = function (mark, major) {
    if (mark == null || mark.visible != true) {
        return [];
    }

    var shapes = [];

    var intr = this._getMarkInterval(mark, major);
    var lng = mark.length;

    var intrs = this._getIntervals(intr, mark, major);

    var sharedAxis = this.sharedAxis;
    var sharedAxisIntrs = sharedAxis._getIntervals(sharedAxis.actualInterval);

    var x1, y1, x2, y2;

    for (var i = 0; i < intrs.length; i++) {

        var pos = this.getPosition(intrs[i]);

        x1 = x2 = pos;
        y2 = this.cy;
        y1 = y2 - lng;

        for (var j = 0; j < sharedAxisIntrs.length; j++) {

            var vl = sharedAxisIntrs[j];

            var angle = this.sharedAxis._getAngle(vl);

            var pt1 = jMath.rotatePointAt(x1, y1, angle, this.cx, this.cy);
            var pt2 = jMath.rotatePointAt(x2, y2, angle, this.cx, this.cy);

            var line = new Line(pt1.x, pt1.y, pt2.x, pt2.y);
            mark._setLineSettings(line);
            shapes.push(line);
        }
    }

    return shapes;
}

LinearRadiusAxis.prototype._getGridLines = function (mark, major) {
    if (mark == null || mark.visible != true) {
        return [];
    }

    var shapes = [];

    var intr = this._getMarkInterval(mark, major);
    var intrs = this._getIntervals(intr, mark, true);

    for (var i = 0; i < intrs.length; i++) {
        var interval = intrs[i];
        var circle = this._getRenderShape(interval);
        mark._setLineSettings(circle);
        circle.fillStyle = null;
        shapes.push(circle);
    }

    return shapes;
}

LinearRadiusAxis.prototype._render = function (shapes) {

    var minorGridLines = this._getGridLines(this.minorGridLines, false);
    $.merge(shapes, minorGridLines);

    var majorGridLines = this._getGridLines(this.majorGridLines, true);
    $.merge(shapes, majorGridLines);

    var postShapes = [];

    // add tickmarks
    var minor = this._getTickMarks(this.minorTickMarks, false);
    $.merge(postShapes, minor);

    var major = this._getTickMarks(this.majorTickMarks, true);
    $.merge(postShapes, major);

    // add main circle/polygon
    var circle = this._getRenderShape(this.actualMinimum);
    circle.strokeStyle = this.strokeStyle;
    circle.lineWidth = this.lineWidth;
    circle.strokeDashArray = this.strokeDashArray;
    circle.fillStyle = null;
    shapes.push(circle);

    var labels = this._getLabels();
    $.merge(postShapes, labels);

    return { postShapes: postShapes, contextShapes: labels };
}

LinearRadiusAxis.prototype._getRenderShape = function (interval) {
    var pos = this.getPosition(interval);
    var r = pos - this.origin + this.extent;

    var circle = this._createRenderShape(this.cx - r, this.cy - r, r);

    return circle;
}

LinearRadiusAxis.prototype._createRenderShape = function (x, y, r) {

    var sharedAxis = this.sharedAxis;

    if (this.renderStyle != 'polygon') {
        if (!jMath.isNull(sharedAxis.startAngle) && !jMath.isNull(sharedAxis.endAngle)) {

            var rStartAngle = jMath.radians(sharedAxis.startAngle);
            var rEndAngle = jMath.radians(sharedAxis.endAngle);

            var sweepAngle = rEndAngle - rStartAngle;
            if (sweepAngle < 2 * Math.PI - 0.000125) {
                var startAngle = rStartAngle - Math.PI / 2;
                var endAngle = rEndAngle - Math.PI / 2;

                return new Arc(x, y, r, startAngle, endAngle);
            }
        }

        return new Circle(x, y, r);
    }

    var pts = [];

    var len = this.sharedAxis.actualMaximum;
    var unit = 2 * Math.PI / len;

    var x = this.cx;
    var y = this.cy - r;

    for (var i = 0; i < len; i++) {

        var pt = jMath.rotatePointAt(x, y, i * unit, this.cx, this.cy);
        pts.push(pt.x);
        pts.push(pt.y);
    }

    return new Polygon(pts);
}

/**
 * @class Chart.Axes.CategoryAngle
 * @extends Chart.Axes.Category
 * 
 * The Category Angle Axis is used with the Radar series and can define custom radar categories.
 */
function CategoryAngleAxis(options) {

    Axis.call(this, options);

    this.DataType = 'CategoryAngleAxis';
}

CategoryAngleAxis.prototype = new CategoryAxis();
CategoryAngleAxis.constructor = CategoryAngleAxis;

CategoryAngleAxis.prototype._initDefs = function () {

    Axis.prototype._initDefs.call(this);

    var defs = $.extend(true, {}, this.defaults, {
        /**
         * @cfg {String} strokeStyle
         * Specifies the axis line color.
         */
        strokeStyle: 'gray',
        /**
        * @cfg {Boolean} renderLinesOverGraph
        * Specifies whether or not the axis lines should be rendered over the chart series.
        */
        renderLinesOverGraph: true,
        location: 'radial'
    });

    this.defaults = defs;
}

CategoryAngleAxis.prototype._measure = function () {

    this.width = 0;
    this.height = 0;

    return false;
}

CategoryAngleAxis.prototype._arrange = function () {
    this._initRadialMeasures();
}

CategoryAngleAxis.prototype._updateOrigin = function () {

    this.origin = this.cx;
    this.length = 2 * Math.PI * this.radius;
}

CategoryAngleAxis.prototype._correctOrigin = function () {
    var correction = 0;

    var left = this.x;
    var top = this.y;
    var right = this.x + this.width;
    var bottom = this.y + this.height;

    var labels = this._getLabels();

    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];

        if (label.x < left) {
            correction = Math.max(correction, left - label.x);
        }

        var lblRight = label.x + label.width;
        if (lblRight > right) {
            correction = Math.max(correction, lblRight - right);
        }

        var lblTop = label.y - label.height / 2
        if (lblTop < top) {
            correction = Math.max(correction, top - lblTop);
        }

        var lblBottom = label.y + label.height / 2;
        if (lblBottom > bottom) {
            correction = Math.max(correction, lblBottom - bottom);
        }
    }


    this.radius -= correction;
    this.length = 2 * Math.PI * this.radius;

    if (this.sharedAxis) {
        this.sharedAxis.radius = this.radius;
        this.sharedAxis._updateOrigin();
        this.sharedAxis._initRange();
    }
}

CategoryAngleAxis.prototype._getAngle = function (value) {

    var len = this.actualMaximum;

    var unit = 2 * Math.PI / len;

    var angle = value * unit;

    if (this.reversed === true) {
        angle = 2 * Math.PI - angle;
    }

    return angle - Math.PI / 2;
}

CategoryAngleAxis.prototype._getLabels = function () {

    var label = this.labels;

    if (label == null || label.visible === false) {
        return [];
    }

    var len = this.actualMaximum;

    if (len == 0) {
        return;
    }

    var cx = this.cx;
    var cy = this.cy;

    var x = cx;
    var y = cy - this.radius;

    var unit = 2 * Math.PI / len;

    var lblMar = 8;

    var tBlocks = [];
    var label = this.labels;

    for (var i = 0; i < len; i++) {

        var angle = i * unit;

        var pt = jMath.rotatePointAt(x, y, angle, cx, cy);

        var lblText = this.getLabel(i);

        var tBlock = this._createLabel(lblText, label);

        tBlock.x = pt.x;
        tBlock.y = pt.y;

        if (angle == Math.PI) {
            tBlock.x -= tBlock.width / 2;
            tBlock.y += lblMar;
        }
        else if (angle == 0) {
            tBlock.x -= tBlock.width / 2;
            tBlock.y -= lblMar;
        }
        else if (angle > Math.PI) {
            tBlock.x -= tBlock.width + lblMar;
        }
        else {
            tBlock.x += lblMar;
        }

        tBlocks.push(tBlock);
    }

    return tBlocks;
}

CategoryAngleAxis.prototype._render = function (shapes) {

    var postShapes = [];

    var len = this.actualMaximum;

    if (len == 0) {
        return;
    }

    var cx = this.cx;
    var cy = this.cy;

    var x1 = cx;
    var y1 = cy - this.sharedAxis.extent;

    var x2 = cx;
    var y2 = cy - this.radius;

    var over = this.renderLinesOverGraph;

    var unit = 2 * Math.PI / len;

    for (var i = 0; i < len; i++) {

        var angle = i * unit;

        var pt1 = jMath.rotatePointAt(x1, y1, angle, cx, cy);
        var pt2 = jMath.rotatePointAt(x2, y2, angle, cx, cy);

        var line = new Line(pt1.x, pt1.y, pt2.x, pt2.y);
        line.strokeStyle = this.strokeStyle;
        line.lineWidth = this.lineWidth;
        line.strokeDashArray = this.strokeDashArray;
        if (over) {
            postShapes.push(line);
        }
        else {
            shapes.push(line);
        }
    }

    var labels = this._getLabels();
    $.merge(postShapes, labels);

    return { postShapes: postShapes, contextShapes: labels };
}

/**
 * @class Chart.Axes.LinearAngle
 * @extends Chart.Axes.Linear
 * 
 * The Linear Angle Axis is used with the Polar series and defines custom minimum, maximum, startAngle and endAngle values.
 */
function LinearAngleAxis(options) {

    Axis.call(this, options);

    this.DataType = 'LinearAngleAxis';
    this.location = 'radial';
}

LinearAngleAxis.prototype = new LinearAxis();
LinearAngleAxis.constructor = LinearAngleAxis;

LinearAngleAxis.prototype._initDefs = function () {

    Axis.prototype._initDefs.call(this);

    var defs = $.extend(true, {}, this.defaults, {
        /**
        * @cfg {Number} minimum
        * Specifies the axis minimum.
        */
        minimum: 0,
        /**
        * @cfg {Number} maximum
        * Specifies the axis maximum.
        */
        maximum: 360,
        /**
        * @cfg {Number} startAngle
        * Specifies the axis start angle.
        */
        startAngle: 0,
        /**
        * @cfg {Number} endAngle
        * Specifies the axis end angle.
        */
        endAngle: 360,
        /**
          * @cfg {Boolean} renderLinesOverGraph
          * Specifies whether or not the axis lines should be rendered over the chart series.
          */
        renderLinesOverGraph: true,
        /**
         * @cfg {String} strokeStyle
         * Specifies the axis line color.
         */
        strokeStyle: 'gray'
    });

    this.defaults = defs;
}

LinearAngleAxis.prototype._initRange = function () {

    this._setMinMax(this.minimum, this.maximum);

    this._setVisibleRanges();

    if (this.logarithmic === true) {
        this.actualInterval = this._calculateActualIntervalLogarithmic(this.actualVisibleMinimum, this.actualVisibleMaximum);
    }
    else {
        this.actualInterval = this._calculateActualInterval(this.actualVisibleMinimum, this.actualVisibleMaximum);
    }
}

LinearAngleAxis.prototype._measure = function () {

    this.width = 0;
    this.height = 0;

    return false;
}

LinearAngleAxis.prototype._arrange = function () {
    this._initRadialMeasures();
}

LinearAngleAxis.prototype._updateOrigin = function () {

    this.origin = this.cx;
    this.length = 2 * Math.PI * this.radius;
}

LinearAngleAxis.prototype._correctOrigin = function () {
    var correction = 0;

    var left = this.x;
    var top = this.y;
    var right = this.x + this.width;
    var bottom = this.y + this.height;

    var labels = this._getLabels();

    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];

        if (label.x < left) {
            correction = Math.max(correction, left - label.x);
        }

        var lblRight = label.x + label.width;
        if (lblRight > right) {
            correction = Math.max(correction, lblRight - right);
        }

        var lblTop = label.y - label.height / 2
        if (lblTop < top) {
            correction = Math.max(correction, top - lblTop);
        }

        var lblBottom = label.y + label.height / 2;
        if (lblBottom > bottom) {
            correction = Math.max(correction, lblBottom - bottom);
        }
    }

    this.radius -= correction;
    this.length = 2 * Math.PI * this.radius;

    if (this.sharedAxis) {
        this.sharedAxis.radius = this.radius;
        this.sharedAxis._updateOrigin();
        this.sharedAxis._initRange();
    }
}

LinearAngleAxis.prototype._getAngle = function (value) {

    var valueDiff = this.actualMaximum - this.actualMinimum;
    var angleDiff = this.endAngle - this.startAngle;
    var angleDiffRadians = jMath.radians(angleDiff);
    var startAngleRadians = jMath.radians(this.startAngle);
    var resultAngle;

    if (valueDiff === 0) {
        resultAngle = startAngleRadians + angleDiffRadians / 2;
    }
    else {
        resultAngle = startAngleRadians + angleDiffRadians * (value - this.actualMinimum) / valueDiff;
    }

    if (this.reversed === true) {
        resultAngle = 2 * Math.PI - resultAngle;
    }

    return resultAngle - Math.PI / 2;
}

LinearAngleAxis.prototype._getLabels = function () {

    var label = this.labels;

    if (label == null || label.visible === false) {
        return [];
    }

    var cx = this.cx;
    var cy = this.cy;

    var x = cx + this.radius;
    var y = cy;

    var lblMar = 8;

    var tBlocks = [];

    var intr = this._getMarkInterval(label, true);
    var intrs = this._getLabelIntervals(intr, label);

    var len = this._getIntervalsLength(intrs);

    for (var i = 0; i < len; i++) {

        var val = intrs[i];

        var lblText = this.getLabel(val);
        var angle = this._getAngle(val);

        var pt = jMath.rotatePointAt(x, y, angle, cx, cy);

        var tBlock = this._createLabel(lblText, label);

        tBlock.x = pt.x;
        tBlock.y = pt.y;

        angle += Math.PI / 2;

        angle = jMath.normalizeAngle(angle);

        // angle = angle % (2 * Math.PI);
        // if (angle < 0) {
        //     angle += 2 * Math.PI;
        // }

        if (angle == Math.PI) {
            tBlock.x -= tBlock.width / 2;
            tBlock.y += lblMar;
        }
        else if (angle == 0) {
            tBlock.x -= tBlock.width / 2;
            tBlock.y -= lblMar;
        }
        else if (angle > Math.PI) {
            tBlock.x -= tBlock.width + lblMar;
        }
        else {
            tBlock.x += lblMar;
        }

        tBlocks.push(tBlock);
    }

    return tBlocks;
}

LinearAngleAxis.prototype._getIntervalsLength = function (intrs) {

    if ((this.endAngle - this.startAngle) == 360) {
        return intrs.length - 1;
    }

    return intrs.length;
}

LinearAngleAxis.prototype._render = function (shapes) {

    var postShapes = [];

    var cx = this.cx;
    var cy = this.cy;

    var x1 = cx;
    var y1 = cy;

    if (this.sharedAxis) {
        y1 -= this.sharedAxis.extent;
    }

    var x2 = cx;
    var y2 = cy - this.radius;

    var over = this.renderLinesOverGraph;

    var intrs = this._getIntervals(this.actualInterval);

    var len = this._getIntervalsLength(intrs);

    for (var i = 0; i < len; i++) {

        var val = intrs[i];

        var angle = this._getAngle(val) + Math.PI / 2;

        var pt1 = jMath.rotatePointAt(x1, y1, angle, cx, cy);
        var pt2 = jMath.rotatePointAt(x2, y2, angle, cx, cy);

        var line = new Line(pt1.x, pt1.y, pt2.x, pt2.y);
        line.strokeStyle = this.strokeStyle;
        line.lineWidth = this.lineWidth;
        line.strokeDashArray = this.strokeDashArray;
        if (over) {
            postShapes.push(line);
        }
        else {
            shapes.push(line);
        }
    }

    var labels = this._getLabels();
    $.merge(postShapes, labels);

    return { postShapes: postShapes, contextShapes: labels };
}

/**
 * @class Chart.ErrorBars 
 * 
 * Defines the chart error bars.
 *
 * Sample configuration:
 *
 *     var errorBars = {
 *          calculationType : 'standardError',
 *          displayType: 'both',
 *          strokeStyle: 'black',
 *          lineWidth: 2,
 *          capLength: 10
 *     }
 */
function ErrorBars(series, options) {

	this.series = series;

	this.defaults = {
		/**
         * @cfg {String} calculationType
         * Specifies the error calculation type -  'standardError', 'standardDeviation', 'percentage' or 'fixedValue'.
         */
		calculationType: 'standardError',

		/**
         * @cfg {String} displayType
         * Specifies the error display style -  'both', 'upper' or 'lower'.
         */
		displayType: 'both',



		/**
         * @cfg {Number} value
         * Specifies the error value or percentage error.
         */
		value: 10,

		/**
         * @cfg {String} strokeStyle
         * Specifies the line color.
         */
		strokeStyle: 'black',
		/**
         * @cfg {Number} lineWidth
         * Specifies the line width.
         */
		lineWidth: 2,

		/**
         * @cfg {Number} capLength
         * Specifies the length of the lower and upper lines.
         */
		capLength: 10
	};

	this.setOptions(options);

	this.errorAmount = this._calculateErrorAmount();
}

ErrorBars.prototype.setOptions = function (options) {
	var settings = $.extend({}, this.defaults, options || {});
	$.extend(this, settings);
}

ErrorBars.prototype._getYValues = function () {

	var series = this.series;
	var data = series.arrData;
	var len = data.length;

	var xAxisType = series.xAxisType;

	var vl, vlY;
	var yValues = [];

	for (var i = 0; i < data.length; i++) {

		vl = data[i];
		if (vl === null) {
			continue;
		}

		if (xAxisType == 'CategoryAxis') {

			if ($.isArray(vl) == false) {
				vlY = vl;
			}
			else {
				vlY = vl[1];
			}
		}
		else {
			vlY = vl[1];
		}

		if (!jMath.isNull(vlY)) {
			yValues.push(vlY);
		}
	}

	return yValues;
}

ErrorBars.prototype._calculateErrorAmount = function () {

	var series = this.series;

	if (!series.arrData) {
		return 0;
	}

	var yValues = this._getYValues(series);
	var len = yValues.length;

	switch (this.calculationType) {
		case 'standardError':

			if (len <= 1) {
				return 0;
			}

			var error = 0;

			for (var i = 0; i < len; i++) {
				error += Math.pow(yValues[i], 2);
			}

			error = Math.sqrt(error / (len * (len - 1))) / 2;

			return error;
		case 'standardDeviation':

			if (len <= 1) {
				return 0;
			}

			var sum = jMath.sum(yValues);
			var average = sum / len;

			var deviation = 0;

			for (var i = 0; i < len; i++) {
				deviation += Math.pow(yValues[i] - average, 2);
			}

			deviation = Math.sqrt(deviation / (len - 1));

			return deviation;
		case 'percentage':

			var lowerErrorAmount = 0;
			var upperErrorAmount = 0;
			var max = minVl;
			var min = maxVl;
			var vl, errorAmount, currMin, currMax;

			for (var i = 0; i < len; i++) {
				vl = yValues[i];
				errorAmount = Math.abs(vl) * this.value / 100;
				currMin = vl - errorAmount;
				currMax = vl + errorAmount;

				if (max < currMax) {
					max = currMax;
					upperErrorAmount = errorAmount;
				}

				if (min > currMin) {
					min = currMin;
					lowerErrorAmount = errorAmount;
				}
			}

			return {
				lower: lowerErrorAmount,
				upper: upperErrorAmount
			};
		case 'fixedValue':
			return this.value;
	}
}

ErrorBars.prototype.getUpperError = function () {

	var displayType = this.displayType;

	if (displayType == 'both' || displayType == 'upper') {

		if (this.calculationType == 'percentage') {
			return this.errorAmount.upper;
		}

		return this.errorAmount;
	}

	return 0;
}

ErrorBars.prototype.getLowerError = function () {

	var displayType = this.displayType;

	if (displayType == 'both' || displayType == 'lower') {

		if (this.calculationType == 'percentage') {
			return this.errorAmount.lower;
		}

		return this.errorAmount;
	}

	return 0;
}

ErrorBars.prototype.getMaxLength = function () {

	var series = this.series;
	var isVertical = series.isVertical;
	var maxLength = 0;

	if (series.realYAxis._getActualVisibleMinimum() === undefined) {
		return 0;
	}

	var error = this.getUpperError();

	var y1 = series.realYAxis.getPosition(0);
	var y2 = series.realYAxis.getPosition(error);

	if (isNaN(y1) || isNaN(y2)) {
		return 0;
	}

	return Math.abs(y1 - y2) + this.lineWidth / 2 + 2;
}

ErrorBars.prototype._createShapes = function (shapes) {

	var series = this.series;

	var isVertical = series.isVertical;
	var data = series.arrData;
	var len = data.length;
	var xAxisType = series.xAxisType;

	var vl, vlX, vlY, x, x1, x2, y, y1, y2, lower, upper;
	var line, lowerLine, upperLine;
	var displayType = this.displayType;

	var errorAmount = this.errorAmount;
	var capWidth = this.capLength / 2;

	for (var i = 0; i < data.length; i++) {

		vl = data[i];
		if (vl === null) {
			continue;
		}

		if (xAxisType == 'CategoryAxis') {
			vlX = i + 0.5;

			if ($.isArray(vl) == false) {
				vlY = vl;
			}
			else {
				vlY = vl[1];
			}
		}
		else {
			vlX = vl[0];
			vlY = vl[1];
		}

		if (jMath.isNull(vlX) || jMath.isNull(vlY)) {
			continue;
		}

		if (this.calculationType == 'percentage') {
			errorAmount = Math.abs(vlY) * this.value / 100;
		}

		lower = vlY - errorAmount;
		upper = vlY + errorAmount;

		if (isVertical) {

			y = series.realXAxis.getPosition(vlX);
			x = series.realYAxis.getPosition(vlY);
			x1 = series.realYAxis.getPosition(lower);
			x2 = series.realYAxis.getPosition(upper);

			switch (displayType) {
				case 'lower':
					line = new Line(x, y, x1, y);
					break;
				case 'upper':
					line = new Line(x2, y, x, y);
					break;
				default:
					line = new Line(x1, y, x2, y);
					break;
			}

			line.lineWidth = this.lineWidth;
			line.strokeStyle = this.strokeStyle;
			shapes.push(line);

			if (displayType == 'both' || displayType == 'lower') {
				lowerLine = new Line(x1, y - capWidth, x1, y + capWidth);
				lowerLine.lineWidth = this.lineWidth;
				lowerLine.strokeStyle = this.strokeStyle;
				shapes.push(lowerLine);
			}

			if (displayType == 'both' || displayType == 'upper') {
				upperLine = new Line(x2, y - capWidth, x2, y + capWidth);
				upperLine.lineWidth = this.lineWidth;
				upperLine.strokeStyle = this.strokeStyle;
				shapes.push(upperLine);
			}
		}
		else {

			x = series.realXAxis.getPosition(vlX);
			y = series.realYAxis.getPosition(vlY);
			y1 = series.realYAxis.getPosition(lower);
			y2 = series.realYAxis.getPosition(upper);

			switch (displayType) {
				case 'lower':
					line = new Line(x, y, x, y1);
					break;
				case 'upper':
					line = new Line(x, y2, x, y);
					break;
				default:
					line = new Line(x, y1, x, y2);
					break;
			}

			line.lineWidth = this.lineWidth;
			line.strokeStyle = this.strokeStyle;
			shapes.push(line);

			if (displayType == 'both' || displayType == 'lower') {
				lowerLine = new Line(x - capWidth, y1, x + capWidth, y1);
				lowerLine.lineWidth = this.lineWidth;
				lowerLine.strokeStyle = this.strokeStyle;
				shapes.push(lowerLine);
			}

			if (displayType == 'both' || displayType == 'upper') {
				upperLine = new Line(x - capWidth, y2, x + capWidth, y2);
				upperLine.lineWidth = this.lineWidth;
				upperLine.strokeStyle = this.strokeStyle;
				shapes.push(upperLine);
			}
		}
	}
}

/**
 * @class Chart.EmptyPointStyle 
 * 
 * Defines the empty point style.
 *
 * Sample configuration:
 *
 *     var emptyPontStyle = {
 *          marker: {
 *               type: 'cross',
 *               fillStyle: 'red',
 *               strokeStyle: 'red',
 *               lineWidth: 4,
 *               size : 10
 *           },
 *           fillStyle: '#cccccc',
 *           strokeStyle: 'red',
 *           lineWidth: 2
 *     }
 *
 */
function EmptyPointStyle(options) {

    this.defaults = {

        /**
        * @cfg {Chart.Marker} marker
        * Specifies the empty point marker style.
        */
        marker: {
            visible: true,
            type: 'cross',
            fillStyle: 'red',
            strokeStyle: 'red',
            lineWidth: 4,
            size: 10
        },

        /**
           * @cfg {String/Common.Gradient} fillStyle
           * Specifies the empty point fill style.
           */
        fillStyle: '#cccccc',
        /**
           * @cfg {String} strokeStyle
           * Specifies the empty point line color.
           */
        strokeStyle: 'red',
        /**
           * @cfg {Number} lineWidth
           * Specifies the empty point line width.
           */
        lineWidth: 2
    };

    this.setOptions(options);
}

EmptyPointStyle.prototype.setOptions = function (options) {
    var settings = $.extend(true, {}, this.defaults, options || {});
    $.extend(this, settings);
}

var iX = 0;
var iY = 1; //this value is used in jqChart.js must not be changed
var iRangeTo = 2; //this value is used in jqChart.js must not be changed
var iQuality = 3;
var iMarkerType = 4; //this value is used in jqChart.js must not be changed
var iMarkerRadius = 5;
var iArrowMarkerAngle = 6;
var iImage = 7; //this value is used in jqChart.js must not be changed
var iTimestamp = 8;

})(jQuery);
