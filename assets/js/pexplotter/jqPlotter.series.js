var JqPlotter_SeriesFactory = (function () {
    var my = {};

    //create series based on curve property
    my.createSeriesArray = function (curveProperties, commonProperty) {
        var seriesArray = [];

        if (commonProperty.isXYPlot) {
            for (var i = 0; i < curveProperties.length; i++) {
                var curveProperty = curveProperties[i];

                var curveSeries = createCurveSeries(curveProperty, commonProperty);
                curveProperty.series = curveSeries;
                seriesArray.push(curveSeries);

                //if curve is hidden, then hide axis
                if (!curveProperty.curveVisible)
                    setCurveVisible(curveProperty, false);
            }
            return seriesArray;
        }

        for (var i = 0; i < curveProperties.length; i++) {
            var curveProperty = curveProperties[i];

            var seriesAppearance = createSeriesAppearance(curveProperty.curveColor,
                    curveProperty.curvePensize,
                    curveProperty.curveLineType,
                    curveProperty.curvePlotType,
                    curveProperty.markCurrentPoint,
                    curveProperty.symbolsOnlyOnChange);
            var curveSeries = createCurveSeries(curveProperty, commonProperty);

            var itemAttrSeries = createItemAttributesSeries(curveProperty, commonProperty);

            curveProperty.series = curveSeries;
            curveProperty.itemAttrSeries = itemAttrSeries;

            seriesArray.push(curveSeries);
            seriesArray = seriesArray.concat(curveProperty.itemAttrSeries);

            //if curve is hidden, then hide axis
            if (!curveProperty.curveVisible)
                setCurveVisible(curveProperty, false);
        }

        return seriesArray;
    };

    function createCurveSeries(curveProperty, commonProperty) {
        var series = {
            axisX: curveProperty.axisX.name,
            axisY: curveProperty.axisY.name,
            name: curveProperty.itemIdX == null? curveProperty.itemIdY : curveProperty.itemIdX + "_" + curveProperty.itemIdY,
            visible: curveProperty.curveVisible,
            data: [],

            nullHandling: 'break',

            seriesType: CONSTANT.seriesTypes.curve,
            itemTag: curveProperty.itemTag,
            itemTagX: curveProperty.itemTagX,
            itemTagY: curveProperty.itemTagY,
            itemIdX: curveProperty.itemIdX,
            itemIdY: curveProperty.itemIdY,
            curveIndex: curveProperty.curveIndex,
            attributeIndex: -1,
            numDecimalsX: curveProperty.numDecimalsLegendX,     //for ruler and export data
            numDecimalsY: curveProperty.numDecimalsLegendY,
            useScientificNotation: commonProperty.useScientificNotation,
            rangeTo: null,  // specifiy the 'to' value of Range Chart

            originalXYData: [],               // used for xy plot
            originalXYDataVisibleStartIndex: -1,        // used for xy plot
            vectorDataPoints: [],
            currentPointIndex: -1,
        };

        var appearanceProperty = {
            color: curveProperty.curveColor,
            penSize: curveProperty.curvePensize,
            curveType: curveProperty.curveLineType,
            plotType: curveProperty.curvePlotType,
            markCurrentPoint: curveProperty.markCurrentPoint,
            symbolsOnlyOnChange: curveProperty.symbolsOnlyOnChange,
        };
        
        setAppearanceToSeries(series, appearanceProperty);

        return series;
    }

    // create series for item attributes
    function createItemAttributesSeries(curveProperty, commonProperty) {
        // TODO: support X 
        var seriesArray = [];
        var attributes = curveProperty.itemAttributesY || [];
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if (attribute.ItemReference.toLowerCase() != 'true') {
                // draw static line for attributes that don't change over time
                continue;
            }

            var series = {
                axisX: curveProperty.axisX.name,
                axisY: curveProperty.axisY.name,
                name: attribute.Name,
                visible: curveProperty.curveVisible,
                data: [],
                rangeTo: attribute.AreaPlotItemIndex, // specifiy the 'to' value of Range Chart

                seriesType: CONSTANT.seriesTypes.itemAttribute,
                itemTag: attribute.Value,
                curveIndex: curveProperty.curveIndex,
                attributeIndex: i,
                areaPlotItemIndex: attribute.AreaPlotItemIndex ? parseInt(attribute.AreaPlotItemIndex) : -1,
                currentPointIndex: -1,

                attribute: attribute,
            };

            var appearanceProperty = {
                color: attribute.Color,
                penSize: attribute.PenSize,
                curveType: attribute.CurveType,
                plotType: attribute.PlotType,
                markCurrentPoint: curveProperty.markCurrentPoint,
                symbolsOnlyOnChange: curveProperty.symbolsOnlyOnChange,
            };
            setAppearanceToSeries(series, appearanceProperty);

            seriesArray.push(series);
        };

        return seriesArray;
    }

    //get series type appearance property
    function createSeriesAppearance(color, penSize, curveType, plotType) {
        var marker = null;
        var strokeDashArray = null;
        var lineWidth = adjustLineWidth(penSize);

        var type = 'line';
        var rangeTo;
        var areaNext = false, areaPrevious = false;

        switch (plotType) {
            case "Line":
                type = 'line';
                break;
            case "Area":
                type = 'area';
                break;
            case "Line_Stepped":
                type = 'stepLine';
                break;
            case 'Area_Stepped':
                type = 'stepArea';
                break;
            case 'Area_Next_Curve':
                type = 'range';
                areaNext = true;
                break;
            case 'Area_Previous_Curve':
                type = 'range';
                areaPrevious = true;
                break;
            default:
                break;
        }

        if (isValidObject(curveType)) {
            strokeDashArray = PropertyParser.getStrokeDashArrayFromCurveType(curveType);

            marker = PropertyParser.getMarkerFromCurveType(curveType, color, penSize);

            if (curveType.indexOf("NO_CURVE") > -1) {
                lineWidth = 0;
            }
        }

        var rgba = hexToRgb(color,
            plotType.toLowerCase().indexOf("area") < 0 ? 1 : jqPlotterConstants.defaults.curveAlpha);
        if (rgba == null) {
            rgba = new Object();
            rgba.r = 0;
            rgba.g = 0;
            rgba.b = 0;
            rgba.a = 0;
        }
        var seriesAppearance = {
            fillStyle: 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')',
            strokeStyle: 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')',
            type: type,
            markers: marker,
            strokeDashArray: strokeDashArray,
            lineWidth: lineWidth,
            rangeTo: rangeTo,
            areaNext: areaNext,
            areaPrevious: areaPrevious,
        }

        return seriesAppearance;
    }

    my.setAppearanceToSeries = setAppearanceToSeries;
    function setAppearanceToSeries(series, appearanceProperty) {
        var seriesAppearance = createSeriesAppearance(appearanceProperty.color,
                    appearanceProperty.penSize,
                    appearanceProperty.curveType,
                    appearanceProperty.plotType);

        series.type = seriesAppearance.type;
        series.strokeStyle = seriesAppearance.strokeStyle;
        series.fillStyle = seriesAppearance.fillStyle;        
        series.strokeDashArray = seriesAppearance.strokeDashArray;
        series.lineWidth = seriesAppearance.lineWidth;
        series.markers = seriesAppearance.markers;
        series.areaNext = seriesAppearance.areaNext;
        series.areaPrevious = seriesAppearance.areaPrevious;

        if (!appearanceProperty.markCurrentPoint)
            clearPointMarkersOfSeries(series.data, series.currentPointIndex);

        series.appearanceProperty = appearanceProperty;
    }

    return my;
}());

function addMinMaxChangedListener(jqPlotter) {
    jqPlotter.chart.series.forEach(function (series) {
        if (series.type.toString() != 'range') {
            return;
        }

        var rangeToSeries = getRangeToSeries(series, jqPlotter);
        var rangeToCurveProperty = getCurvePropertyByCurveIndex(rangeToSeries.curveIndex, jqPlotter.curveProperties);
        var valueAxis = getAxisByCurveIndex(series.curveIndex, false, jqPlotter.allAxesY);

        var ee = window.pageProperty.eventEmitter;
        ee.addListener(valueAxis.name + "MinMaxChanged", function () {
            series.data = recalculateRangeData(series, jqPlotter);
        });
        ee.addListener(rangeToCurveProperty.axisY.name + "MinMaxChanged", function () {
            series.data = recalculateRangeData(series, jqPlotter);
        });
    });
}

//set curve visible, including its axis
function setCurveVisible(curveProperty, visible) {
    var axisX = curveProperty.axisX;
    var axisY = curveProperty.axisY;
    var series = curveProperty.series;

    series.visible = visible;

    if (axisX.curveIndex == curveProperty.curveIndex)
        setAxisVisible(axisX, visible);

    if (axisY.curveIndex == curveProperty.curveIndex)
        setAxisVisible(axisY, visible);
}

function updateArea(item, itemProperty, jqPlotter) {
    // This is needed otherwise when axis' curve type is Area, the area will only 
    // cover from 0 to curve value by default
    axis.crossing = axis.visibleMinimum;
}

function getItemAttributeCount(curveProperties) {
    var count = 0;
    for (var i = 0; i < curveProperties.length; i++) {
        count += curveProperties[i].itemAttrSeries.length;
    }

    return count;
}

function getSeriesByItemTag(itemTag, allSeries) {
    for (var i = 0; i < allSeries.length; i++) {
        if (itemTag == allSeries[i].itemTag)
            return allSeries[i];
    }
}

function getSeriesByItemTagAndSeriesType(itemTag, seriesType, allSeries) {
    for (var i = 0; i < allSeries.length; i++) {
        if (allSeries[i].seriesType == seriesType && allSeries[i].itemTag.indexOf(itemTag) >= 0)
            return allSeries[i];
    }
}

function getSeriesArrayByItemTag(itemTag, allSeries) {
    var seriesArray = [];
    for (var i = 0; i < allSeries.length; i++) {
        if (allSeries[i].itemTag != null && allSeries[i].itemTag.indexOf(itemTag) >= 0)
            seriesArray.push(allSeries[i]);
    }
    return seriesArray;
}

function getCurveSeriesByCurveIndex(curveIndex, allSeries) {
    for (var i = 0; i < allSeries.length; i++) {
        if (allSeries[i].seriesType == CONSTANT.seriesTypes.curve && allSeries[i].curveIndex == curveIndex)
            return allSeries[i];
    }
}

function getSeriesByCurveIndexAndAttributeIndex(curveIndex, attributeIndex, allSeries) {
    for (var i = 0; i < allSeries.length; i++) {
        if (allSeries[i].curveIndex == curveIndex
            && allSeries[i].attributeIndex == attributeIndex)
            return allSeries[i];
    }
}

function getCurveSeries(allSeries, sortPredicate, findPredicate) {
    if (typeof findPredicate !== 'function') {
        throw new TypeError('findPredicate must be a function');
    }
    if (typeof sortPredicate !== 'function') {
        throw new TypeError('sortPredicate must be a function');
    }

    return allSeries.filter(function (series) {
        return series.seriesType == CONSTANT.seriesTypes.curve
    }).sort(function (a, b) {
        return sortPredicate.call(null, a, b);
    }).find(function (curveSeries) {
        return findPredicate.call(null, curveSeries);
    });
}

function getPreviousCurveSeries(currentCurveIndex, allSeries) {
    return getCurveSeries(allSeries, function (a, b) {
        return parseInt(b.curveIndex) - parseInt(a.curveIndex);
    }, function (curveSeries) {
        return parseInt(curveSeries.curveIndex) < currentCurveIndex;
    });
}

function getNextCurveSeries(currentCurveIndex, allSeries) {
    return getCurveSeries(allSeries, function (a, b) {
        return parseInt(a.curveIndex) - parseInt(b.curveIndex);
    }, function (curveSeries) {
        return parseInt(curveSeries.curveIndex) > currentCurveIndex;
    });
}

function getRangeToSeries(series, jqPlotter) {
    var rangeToSeries = null;
    var curveIndex = parseInt(series.curveIndex);

    var indexInVisibleSeries = jqPlotter.visibleSeries.findIndex(function (aSeries) {
        return aSeries.itemTag === series.itemTag;
    });

    if (series.seriesType == CONSTANT.seriesTypes.curve) {
        // handle curve series
        rangeToSeries = series.areaNext ? jqPlotter.visibleSeries[indexInVisibleSeries+1] :
                   series.areaPrevious ? jqPlotter.visibleSeries[indexInVisibleSeries-1] : null;
    }
    else if (series.seriesType == CONSTANT.seriesTypes.itemAttribute) {
        // handle item attributes series
        var areaPlotItemIndex = parseInt(series.areaPlotItemIndex);
        if (series.areaNext || series.areaPrevious) {
            if (0 <= areaPlotItemIndex
                && areaPlotItemIndex < jqPlotter.visibleSeries.length) {
                rangeToSeries = jqPlotter.visibleSeries[areaPlotItemIndex];
            } else {
                rangeToSeries = series.areaNext ? jqPlotter.visibleSeries[indexInVisibleSeries + 1] :
                               series.areaPrevious ? jqPlotter.visibleSeries[indexInVisibleSeries - 1] : null;
            }
        }
    }

    if (!rangeToSeries) {
        series.type = 'area';
        series.appearanceProperty.plotType = "Area";
    }

    return rangeToSeries;
}

function adjustValue(rangeToValue, rangeToMin, rangeToMax, min, max) {
    var ratio = (max - min) / (rangeToMax - rangeToMin);
    var shift = min - 0;

    return (rangeToValue - rangeToMin) * ratio + shift;
}

function recalculateRangeData(series, jqPlotter) {
    if (series.type.toString() != "range") {
        return series.data;
    }

    var curveIndex = parseInt(series.curveIndex);
    var rangeToSeries = getRangeToSeries(series, jqPlotter);

    if (!rangeToSeries) {
        return series.data;
    }

    var rangeToSerieItems = rangeToSeries.data;

    var fromValueYAxis = getAxisByCurveIndex(curveIndex, false, jqPlotter.allAxesY);
    var min = fromValueYAxis.minimum;
    var max = fromValueYAxis.maximum;
    var toValueYAxis = getAxisByCurveIndex(rangeToSeries.curveIndex, false, jqPlotter.allAxesY);
    var rangeToMin = toValueYAxis.minimum;
    var rangeToMax = toValueYAxis.maximum;

    var length = Math.max(series.data.length, rangeToSerieItems.length);
    var seriesData = [];
    for (var i = 0; i < length; i++) {
        var rangeFromItem; 
        if (i < series.data.length) {
            rangeFromItem = series.data[i];
        } else {
            rangeFromItem = series.data[series.data.length - 1];
        }

        var rangeToItem;
        if (i < rangeToSerieItems.length) {
            rangeToItem = rangeToSerieItems[i];
        } else {
            rangeToItem = rangeToSerieItems[rangeToSerieItems.length - 1];
        }

        if (!!rangeToItem) {
            var adjustedValue = adjustValue(parseFloat(rangeToItem[CONSTANT.yIndex]), rangeToMin, rangeToMax, min, max);
            rangeFromItem[CONSTANT.xIndex] = rangeToItem[CONSTANT.xIndex]
            rangeFromItem[CONSTANT.rangeToIndex] = adjustedValue;
        }

        seriesData.push(rangeFromItem);
    }

    return seriesData;
}

var PropertyParser = (function () {
    var my = {};

    my.getStrokeDashArrayFromCurveType = function (curveType) {
        var strokeDashArray = null;
        if (curveType.indexOf("EVEN_DASHED") > -1)
            strokeDashArray = [10, 10];
        else if (curveType.indexOf("LONG_SHORT") > -1)
            strokeDashArray = [16, 4];
        else if (curveType.indexOf("SHORT_LONG") > -1)
            strokeDashArray = [4, 16];
        return strokeDashArray;
    }

    my.getMarkerFromCurveType = function (curveType, color, pensize) {
        var marker = { visible: false };
        pensize = 1;            //fix this as 1
        if (curveType.indexOf("CIRCLE") > -1)
            marker = {
                type: 'circle',
                fillStyle: color,
                strokeStyle: color,
                lineWidth: pensize,
                visible: true,
            }
        else if (curveType.indexOf("STAR") > -1)
            marker = {
                type: 'diamond',
                fillStyle: color,
                strokeStyle: color,
                lineWidth: pensize,
                visible: true,
            }
        else if (curveType.indexOf("XMARK") > -1)
            marker = {
                type: 'cross',
                fillStyle: color,
                strokeStyle: color,
                lineWidth: pensize,
                visible: true,
            }
        return marker;
    }

    return my;
}());
