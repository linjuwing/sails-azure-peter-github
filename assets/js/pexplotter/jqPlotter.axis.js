var JqPlotter_AxesFactory = (function () {
    var my = {};

    function createValueAxisX(curveProperty, commonProperty) {
        var labelStringFormat = getNumberFormat(curveProperty.numDecimalsAxisX);
        var axisColor = curveProperty.curveColor;

        var axis = {
            name: commonProperty.elementId + '_' + curveProperty.curveIndex + '_X',
            margin: 0,
            type: 'linear',
            location: curveProperty.axisLocationX,
            labels: {
                font: commonProperty.fontString,
                stringFormat: labelStringFormat,
                fillStyle: axisColor,

                fontSize: commonProperty.fontSize,
                lineWidth: jqPlotterConstants.defaults.xAxisTickmarkPenSize,

                numDecimals: curveProperty.numDecimalsAxisX,
                isNumDecimalsDefault: curveProperty.isNumDecimalsDefaultAxisX,
            },
            majorTickMarks: {
                lineWidth: jqPlotterConstants.defaults.xAxisTickmarkPenSize,
                length: jqPlotterConstants.defaults.xAxisTickmarkLength,
                strokeStyle: axisColor
            },
            minorTickMarks: { visible: false },
            majorGridLines: { visible: false },
            minorGridLines: { visible: false },
            
            basicColor: axisColor,
            strokeStyle: axisColor,
            lineWidth: jqPlotterConstants.defaults.xAxisLabelPenSize,
            rangeSlider: { visible: false, breadth: 0 },
            zoomEnabled: true,
            mouseWheelZoomStep: commonProperty.mouseWheelZoomStep,
            mouseWheelScrollStep: 0,
            reversed: curveProperty.axisInvertedX,
            hidden: commonProperty.hideAxisX,
            unit: curveProperty.unitX,
            isAxisX: true,
            visible: true,
            isMerged: false,
            curveIndex: curveProperty.curveIndex,
            itemTag: curveProperty.itemTagX,
            mergedCurveIndexes: [curveProperty.curveIndex],
            mergeIdentifier: curveProperty.mergeIdentifierX,
            numMajorGrid: commonProperty.gridXMajor,
            initialRangeLo: curveProperty.axisRangeLoX,
            initialRangeHi: curveProperty.axisRangeHiX,
            rangeLo: curveProperty.axisRangeLoX,
            rangeHi: curveProperty.axisRangeHiX,
            visibleRange: curveProperty.axisVisibleRangeX,
            initialRevsersed: curveProperty.axisInvertedX,
            useScientificNotation: commonProperty.useScientificNotation,
            div: null,
            backgroundcolor: commonProperty.backgroundcolor,
            isSelected: false,
            initialColor: curveProperty.curveColor,
            automaticMinimumMerged: null,
            automaticMaximumMerged: null,
            rangeLoMerged: null,
            rangeHiMerged: null,
            labelHeight: commonProperty.fontSize,
            logarithmic: false,
            ismoving: false,
            flagButtonDown: false,
            flagDivDown: false,
        };
        commonProperty.logArrayX.push(0);
        drawStaticLines(curveProperty.staticLinesX, axis);
        drawAttributes(curveProperty.itemAttributesX, axis);
        createAxisXDiv(axis, commonProperty);

        // listen to curve type change event
        var ee = window.pageProperty.eventEmitter;
        var rowId = JqPlotter_Legend.getLegendRowId(axis.curveIndex, -1);
        var curveTypeChangedEventName = commonProperty.elementId + "_" + rowId + "_curveTypeChanged";
        ee.addListener(curveTypeChangedEventName, function (appearanceProperty) {
            axis.plotLines.forEach(function (plotLine) {
                plotLine.strokeStyle = appearanceProperty.color;
            });
            if (axis.isMerged && commonProperty.mergeAxesBlackX)
                return;
            setAxisColor(axis, appearanceProperty.color);
        });

        return axis;
    };

    //create y axis, left or right
    function createValueAxisY(curveProperty, commonProperty) {
        var labelStringFormat = getNumberFormat(curveProperty.numDecimalsAxisY);
        var axisColor = curveProperty.curveColor;

        var axis = {
            name: commonProperty.elementId + '_' + curveProperty.curveIndex + '_Y',
            margin: 0,
            type: 'linear',
            location: curveProperty.axisLocationY,
            labels: {
                font: commonProperty.fontString,
                stringFormat: labelStringFormat,
                fillStyle: axisColor,

                fontSize: commonProperty.fontSize,
                numDecimals: curveProperty.numDecimalsAxisY,
                isNumDecimalsDefault: curveProperty.isNumDecimalsDefaultAxisY,
            },
            majorTickMarks: {
                lineWidth: jqPlotterConstants.defaults.yAxisTickmarkPenSize,
                length: jqPlotterConstants.defaults.yAxisTickmarkLength,
                strokeStyle: axisColor
            },
            minorTickMarks: { visible: false },
            majorGridLines: { visible: false },
            minorGridLines: { visible: false },

            basicColor: axisColor,
            strokeStyle: axisColor,
            lineWidth: jqPlotterConstants.defaults.yAxisLabelPenSize,
            rangeSlider: { visible: false, breadth: 0 },
            zoomEnabled: true,
            mouseWheelZoomStep: commonProperty.mouseWheelZoomStep,
            mouseWheelScrollStep: 0,
            reversed: curveProperty.axisInvertedY,
            hidden: commonProperty.hideAxisY,
            unit: curveProperty.unitY,
            isAxisX: false,
            visible: true,
            isMerged: false,
            curveIndex: curveProperty.curveIndex,
            itemTag: curveProperty.itemTagY,
            mergedCurveIndexes: [curveProperty.curveIndex],
            mergeIdentifier: curveProperty.mergeIdentifierY,
            numMajorGrid: commonProperty.gridYMajor,
            initialRangeLo: curveProperty.axisRangeLoY,
            initialRangeHi: curveProperty.axisRangeHiY,
            rangeLo: curveProperty.axisRangeLoY,
            rangeHi: curveProperty.axisRangeHiY,
            visibleRange: curveProperty.axisVisibleRangeY,
            initialRevsersed: curveProperty.axisInvertedY,
            useScientificNotation: commonProperty.useScientificNotation,
            div: null,
            backgroundcolor: commonProperty.backgroundcolor,
            isSelected: false,
            initialColor: curveProperty.curveColor,
            automaticMinimumMerged: null,
            automaticMaximumMerged: null,
            rangeLoMerged: null,
            rangeHiMerged: null,
            elementId: commonProperty.elementId,
            logarithmic: false,
            ismoving: false,
            flagButtonDown: false,
            flagDivDown: false,
        };
        //add log num array;
        commonProperty.logArrayY.push(0);
        drawStaticLines(curveProperty.staticLinesY, axis);
        drawAttributes(curveProperty.itemAttributesY, axis);

        createAxisYDiv(axis, commonProperty);

        // listen to curve type change event
        var ee = window.pageProperty.eventEmitter;
        var rowId = JqPlotter_Legend.getLegendRowId(axis.curveIndex, -1);
        var curveTypeChangedEventName = commonProperty.elementId + "_" + rowId + "_curveTypeChanged";
        ee.addListener(curveTypeChangedEventName, function (appearanceProperty) {
            axis.plotLines.forEach(function (plotLine) {
                plotLine.strokeStyle = appearanceProperty.color;
            });
            if (axis.isMerged && commonProperty.mergeAxesBlackY)
                return;
            setAxisColor(axis, appearanceProperty.color);
        });

        return axis;
    }

    //create all axes for each curve
    my.createAllAxes = function (commonProperty, curveProperties, timeAxis) {
        var axesX = [];
        var axesY = [];

        for (var i = 0; i < curveProperties.length; i++) {
            var curveProperty = curveProperties[i];

            if (curveProperty.isXYPlot) {       //if it is XYPlot, then create value axis X
                var axisX = createValueAxisX(curveProperty, commonProperty);
                curveProperty.axisX = axisX;
                axesX.push(axisX);
            } else {
                curveProperty.axisX = timeAxis;
                timeAxis.mergedCurveIndexes.push(curveProperty.curveIndex);
            }

            var axisY = createValueAxisY(curveProperty, commonProperty);
            curveProperty.axisY = axisY;
            axesY.push(axisY);
        }

        if (!commonProperty.isXYPlot)
            axesX.push(timeAxis);

        return [axesX, axesY];
    }

    function createVirtualSeries(axisX, axisY) {
        var virtualSeries = {
            type: 'line',
            showInLegend: false,
            axisX: axisX.name,
            axisY: axisY.name,
            lineWidth: 0,
            strokeStyle: 'transparent',
            data: [[0, 0]],         //give gridline data, to keep value in the chart
            markers: null,
        }
        return virtualSeries;
    }

    my.setGridLineVisible = function (onX, onY, jqPlotter) {
        if (onX != null) {
            jqPlotter.commonProperty.gridXVisible = onX;
            setGridLineVisibleX(onX, jqPlotter.gridLineAxes[0]);
        }
        if (onY != null) {
            jqPlotter.commonProperty.gridYVisible = onY;
            setGridLineVisibleY(onY, jqPlotter.gridLineAxes[1]);
        }

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    function setGridLineVisibleX(visibleX, glAxisX) {
        glAxisX.majorGridLines.visible = visibleX;
        glAxisX.minorGridLines.visible = visibleX;
    }

    function setGridLineVisibleY(visibleY, glAxisY) {
        glAxisY.majorGridLines.visible = visibleY;
        glAxisY.minorGridLines.visible = visibleY;
    }

    //axisX height is constant, the space is for inforbar
    function createGlAxes(commonProperty) {
        var gridColor = commonProperty.gridcolor;
        var gridXVisible = commonProperty.gridXVisible;
        var gridXMinor = commonProperty.gridXMinor;
        var gridXMajor = commonProperty.gridXMajor;
        var gridYVisible = commonProperty.gridYVisible;
        var gridYMinor = commonProperty.gridYMinor;
        var gridYMajor = commonProperty.gridYMajor;
        var majorLinePensize = 1.0;
        var minorLinePensize = 0.7;
        var glAxes = [];

        if (gridXMajor <= 0)
            gridXMajor = 1;
        if (gridXMinor <= 0)
            gridXMinor = 1;
        if (gridYMajor <= 0)
            gridYMajor = 1;
        if (gridYMinor <= 0)
            gridYMinor = 1;

        glAxes[0] = {
            lineWidth: 0,
            name: 'glAxisX',
            type: 'linear',
            location: 'top',
            labels: { visible: false },
            majorTickMarks: { visible: false },
            minorTickMarks: { visible: false },
            majorGridLines: {
                visible: false,
                lineWidth: majorLinePensize,
                strokeStyle: gridColor,
                interval: 100 / gridXMajor,
                intervalOffset: 0,
            },
            minorGridLines: {
                visible: false,
                lineWidth: minorLinePensize,
                strokeStyle: gridColor,
                interval: 100 / (gridXMinor * gridXMajor),
            },
            rangeSlider: { visible: false },
            height: 20,
            visibleMaximum: 100,
            visibleMinimum: 0,
        };

        glAxes[1] = {
            lineWidth: 0,
            name: 'glAxisY',
            type: 'linear',
            location: 'left',
            labels: { visible: false },
            majorTickMarks: { visible: false },
            minorTickMarks: { visible: false },
            majorGridLines: {
                visible: false,
                lineWidth: majorLinePensize,
                strokeStyle: gridColor,
                interval: 100 / gridYMajor,
                intervalOffset: 0
            },
            minorGridLines: {
                visible: false,
                lineWidth: minorLinePensize,
                strokeStyle: gridColor,
                interval: 100 / (gridYMinor * gridYMajor)
            },
            rangeSlider: { visible: false },
            width: 0,
            visibleMaximum: 100,
            visibleMinimum: 0,
        };

        setGridLineVisibleX(gridXVisible, glAxes[0]);
        setGridLineVisibleY(gridYVisible, glAxes[1]);

        return glAxes;
    }

    //draw grid line with special axes
    my.setGridLine = function (chart, commonProperty) {
        var glAxes = createGlAxes(commonProperty);

        var glSeries = createVirtualSeries(glAxes[0], glAxes[1]);

        chart.axes.push(glAxes[0]);
        chart.axes.push(glAxes[1]);
        chart.series.push(glSeries);

        return glAxes;
    }

    my.createTimeSliderBarAxis = createTimeSliderBarAxis;
    function createTimeSliderBarAxis(commonProperty) {
        var axisX = {
            name: 'TimeSlider_X',
            type: 'dateTime',
            location: 'bottom',

            labels: { visible: false },
            majorTickMarks: { visible: false },
            minorTickMarks: { visible: false },
            majorGridLines: { visible: false },
            minorGridLines: { visible: false },
            width: 0,
            margin: 1,
            lineWidth: 0,
            strokeStyle: 'transparent',
            zoomEnabled: true,

            mouseWheelZoomStep: 0,
            mouseWheelScrollStep: 0.0001,
            rangeSlider: {
                visible: true,
                breadth: 15
            },

            timespan: commonProperty.initialTimespan,
            initialTimespan: commonProperty.initialTimespan,
            lastTimestamp: 0,
            scrollbarAtEnd: true,
            mergedCurveIndexes: [],
        };

        return axisX;
    };

    my.setTimeSliderBarAxis = function (chart, commonProperty, virtualAxisY) {
        var timeSliderAxis = createTimeSliderBarAxis(commonProperty);
        var timeSliderSeries = createVirtualSeries(timeSliderAxis, virtualAxisY);

        chart.axes.push(timeSliderAxis);
        chart.series.push(timeSliderSeries);

        return timeSliderAxis;
    }

    function createTimeLabelAxis(commonProperty) {
        var labelStringFormat = commonProperty.datetimeFormat;
        var axisColor = 'black';

        var axisX = {
            name: 'TimeLabel_X',
            margin: 0,
            type: 'dateTime',
            location: commonProperty.labelAxisLocationX,
            labels: {
                font: commonProperty.fontString,
                stringFormat: labelStringFormat,
                fillStyle: axisColor,
                hAlign: 'center',

                fontSize: commonProperty.fontSize,
                lineWidth: jqPlotterConstants.defaults.xAxisTickmarkPenSize,
            },
            majorTickMarks: {
                visible: true,
                lineWidth: jqPlotterConstants.defaults.xAxisTickmarkPenSize,
                length: jqPlotterConstants.defaults.xAxisTickmarkLength,
                strokeStyle: axisColor,
            },
            minorTickMarks: { visible: false },
            majorGridLines: { visible: false },
            minorGridLines: { visible: false },
            interval: 1,
            strokeStyle: axisColor,     //axisColor,
            lineWidth: jqPlotterConstants.defaults.xAxisLabelPenSize,
            rangeSlider: { visible: false, },
            zoomEnabled: false,

            numMajorGrid: commonProperty.gridXMajor,
            labelHeight: commonProperty.fontSize,
        };

        createAxisXDiv(axisX, commonProperty);

        return axisX;
    }

    my.setTimeLabelAxis = function (chart, commonProperty, virtualAxisY) {
        var timeLabelAxis = createTimeLabelAxis(commonProperty);
        var timeLabelSeries = createVirtualSeries(timeLabelAxis, virtualAxisY);

        chart.axes.push(timeLabelAxis);
        chart.series.push(timeLabelSeries);

        return timeLabelAxis;
    }

    //return axes X based on analysis, merge or hide
    my.initializeAxesX = function (allAxesX, curveProperties, commonProperty, chart) {
        if (!commonProperty.isXYPlot) {
            commonProperty.visibleAxesCountX = 1;
            //curveProperties.forEach(function (curveProperty) {
            //    allAxesX[0].mergedCurveIndexes.push(curveProperty.curveIndex);
            //});
            return allAxesX;
        }

        var axesX = mergeAxesByMergeIdentifier(allAxesX, curveProperties, commonProperty.mergeAxesBlackX);
        axesX = axesX.reverse();        //because jqplotter's axes' sort is not as old one
        if (commonProperty.hideAxisX)
            hideAxes(axesX, chart);
        commonProperty.visibleAxesCountX = axesX.length;

        return axesX;
    }

    //return axes Y based on analysis
    my.initializeAxesY = function (allAxesY, curveProperties, commonProperty, chart) {
        var axesY = mergeAxesByMergeIdentifier(allAxesY, curveProperties, commonProperty.mergeAxesBlackY);
        axesY = axesY.reverse();
        if (commonProperty.hideAxisY)
            hideAxes(axesY, chart);
        commonProperty.visibleAxesCountY = axesY.length;
        return axesY;
    }

    my.updateResolutionForXYPlot = function (visibleSeries, commonProperty) {
        var minResolution = 0;
        visibleSeries.forEach(function (series) {
            var seriesData = series.data;
            if (seriesData.length > 1) {
                curveResolution = seriesData[seriesData.length - 1][CONSTANT.timestampIndex] - seriesData[seriesData.length - 2][CONSTANT.timestampIndex];
                if (!minResolution || curveResolution < minResolution)
                    minResolution = curveResolution;
            }
        });

        if (!commonProperty.rulerOn)
            JqPlotter_InfoBar.updateResolution(minResolution, commonProperty);
    }

    function updateTimeLabelAxisByTimeSliderAxis(timeLabelAxis, timeSliderAxis) {
        timeLabelAxis.minimum = timeSliderAxis.visibleMinimum;
        timeLabelAxis.maximum = timeSliderAxis.visibleMaximum;
        setAxisTickMarksByMaxMin(timeLabelAxis, timeSliderAxis.visibleMinimum, timeSliderAxis.visibleMaximum);
    }

    my.updateTimeLabelAxisByTimeSliderAxis = updateTimeLabelAxisByTimeSliderAxis;

    my.updateTimeAxis = updateTimeAxis;
    function updateTimeAxis(timeSliderAxis, timeLabelAxis, visibleSeries, curveProperties, commonProperty) {
        var minResolution = 0;

        var firstTimestamp = getDateTimeByTimeOffset((new Date()).getTime(), commonProperty.timeOffset);
        var lastTimestamp = 0;
        var visibleDataPointTimespan = 0;
        var haveData = false;

        visibleSeries.forEach(function (series) {
            var seriesData = series.data;

            //get resolution of series
            if (seriesData.length > 1) {
                var curveResolution = seriesData[seriesData.length - 1][0] - seriesData[seriesData.length - 2][0];
                if (!minResolution || curveResolution < minResolution)
                    minResolution = curveResolution;
            }

            if (seriesData.length > 0) {
                haveData = true;

                //if visibleDataPointCount setting is available 
                if (commonProperty.visibleDataPointCount > 0) {
                    var curveTimespan = getTimespanByVisibleDataPoint(seriesData, seriesData.length - 1, commonProperty.visibleDataPointCount, 0);
                    if (curveTimespan < visibleDataPointTimespan || visibleDataPointTimespan == 0)
                        visibleDataPointTimespan = curveTimespan;
                }

                var timestampResult = getFirstLastTimestamp(seriesData);
                if (timestampResult[0] < firstTimestamp && timestampResult[0] > 1)
                    firstTimestamp = timestampResult[0];
                if (timestampResult[1] > lastTimestamp && timestampResult[1] > 1)
                    lastTimestamp = timestampResult[1];
            }
        });

        if (haveData) {           //series have data
            timeSliderAxis.seriesFirstTimestamp = firstTimestamp.getTime();
            timeSliderAxis.seriesLastTimestamp = lastTimestamp.getTime();
            timeSliderAxis.maximum = lastTimestamp.getTime();
            if (!commonProperty.isZooming)
                timeSliderAxis.minimum = firstTimestamp.getTime();

            if (commonProperty.showAllData) {
                //if there is a fractionOfTimeSpan setting
                if (commonProperty.fractionOfTimeSpan > 0 && commonProperty.fractionOfTimeSpan < 1) {
                    timeSliderAxis.maximum = timeSliderAxis.seriesLastTimestamp
                        + (timeSliderAxis.seriesLastTimestamp - timeSliderAxis.seriesFirstTimestamp)
                        * (1 - commonProperty.fractionOfTimeSpan);
                }

                timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
                timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;

                //update time span
                updateTimespan(timeSliderAxis.maximum - timeSliderAxis.minimum, timeSliderAxis, commonProperty);

                //wheel step
                timeSliderAxis.mouseWheelZoomStep = commonProperty.mouseWheelZoomStep * timeSliderAxis.initialTimespan / (timeSliderAxis.maximum - timeSliderAxis.minimum);            //automaticlly calculate the zoom step
            }
            else if (commonProperty.visibleDataPointCount > 0 && visibleDataPointTimespan > 0) {
                timeSliderAxis.mouseWheelZoomStep = 0;

                //update time span
                updateTimespan(visibleDataPointTimespan, timeSliderAxis, commonProperty);

                //fraction of timespan
                if (commonProperty.fractionOfTimeSpan > 0 && commonProperty.fractionOfTimeSpan < 1)
                    timeSliderAxis.maximum = timeSliderAxis.seriesLastTimestamp + timeSliderAxis.timespan * (1 - commonProperty.fractionOfTimeSpan);

                //if scroll at end, update time slider bar
                if (!commonProperty.firstUpdatedData || timeSliderAxis.scrollbarAtEnd) {
                    timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
                    timeSliderAxis.visibleMinimum = timeSliderAxis.maximum - timeSliderAxis.timespan;
                }
            }
            else {
                //fraction of timespan
                if (commonProperty.fractionOfTimeSpan > 0 && commonProperty.fractionOfTimeSpan < 1)
                    timeSliderAxis.maximum = timeSliderAxis.seriesLastTimestamp + timeSliderAxis.timespan * (1 - commonProperty.fractionOfTimeSpan);

                //wheel step
                timeSliderAxis.mouseWheelZoomStep = commonProperty.mouseWheelZoomStep * timeSliderAxis.initialTimespan / (timeSliderAxis.maximum - timeSliderAxis.minimum);            //automaticlly calculate the zoom step 

                //if scroll at end, update time slider bar
                if (!commonProperty.firstUpdatedData || timeSliderAxis.scrollbarAtEnd) {
                    timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
                    timeSliderAxis.visibleMinimum = timeSliderAxis.maximum - timeSliderAxis.timespan;
                }

                //if first timestamp is moving to right, meaning first datapoint is removed
                if (timeSliderAxis.minimum > timeSliderAxis.visibleMinimum && !commonProperty.isZooming) {
                    if (timeSliderAxis.visibleMinimum + timeSliderAxis.initialTimespan < timeSliderAxis.maximum) {
                        timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;
                        timeSliderAxis.visibleMaximum = timeSliderAxis.visibleMinimum + timeSliderAxis.initialTimespan;
                        JqPlotter_InfoBar.updateEndTimestamp(timeSliderAxis.visibleMaximum, commonProperty);
                    }
                    else
                        timeSliderAxis.minimum = timeSliderAxis.visibleMinimum;
                }
            }

            //update label axis
            updateTimeLabelAxisByTimeSliderAxis(timeLabelAxis, timeSliderAxis);

            if (timeSliderAxis.scrollbarAtEnd) {
                if (!commonProperty.rulerOn)
                    //update resolution
                    JqPlotter_InfoBar.updateResolution(minResolution, commonProperty);

                //update end timestamp
                JqPlotter_InfoBar.updateEndTimestamp(timeSliderAxis.visibleMaximum, commonProperty);
            }
        }
        else {          //if no data, handle series which not have data
            timeSliderAxis.maximum = (new Date()).getTime();
            timeSliderAxis.minimum = timeSliderAxis.maximum - timeSliderAxis.timespan;
            timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;
            timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;

            updateTimeLabelAxisByTimeSliderAxis(timeLabelAxis, timeSliderAxis);
        }

        commonProperty.haveData = haveData;
        commonProperty.firstUpdatedData = true;
    }

    my.handleAxisScrollEvent = function (axisSource, jqPlotter) {
        var axisMinimum = axisSource.actualVisibleMinimum;
        var axisMaximum = axisSource.actualVisibleMaximum;

        if (axisSource.name != "TimeSlider_X")
            return;

        if (jqPlotter.commonProperty.isXYPlot) {
            if (jqPlotter.commonProperty.oneVectorOnly == true)         //onevectoronly
                JqPlotter_XYPlotMain.handleTimeSliderAxisEventForOneVectorOnly(axisSource, jqPlotter);
            else
                JqPlotter_XYPlotMain.handleTimeSliderAxisEvent(axisSource, jqPlotter);
            return;
        }

        jqPlotter.timeSliderAxis.scrollbarAtEnd = jqPlotter.timeSliderAxis.maximum <= (Math.round(axisSource.actualVisibleMaximum) + 3000);

        //set axis tickmarks
        jqPlotter.timeLabelAxis.minimum = axisMinimum;
        jqPlotter.timeLabelAxis.maximum = axisMaximum;
        setAxisTickMarksByMaxMin(jqPlotter.timeLabelAxis, axisMinimum, axisMaximum);

        JqPlotter_InfoBar.updateEndTimestamp(axisMaximum, jqPlotter.commonProperty);
        //updateInfobarAndLegendForSliderBar(jqPlotter.timeSliderAxis, jqPlotter);      //update the value data in legend

        //NOTE: calling jqchart('update') must be throttled
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    //handle axis's zoom in/out, pan event
    my.handleAxisZoomEvent = function (axisSource, jqPlotter) {
        var axisMinimum = axisSource.actualVisibleMinimum;
        var axisMaximum = axisSource.actualVisibleMaximum;

        if (axisSource.name == "TimeSlider_X") {        //handle time slider axis
            if (jqPlotter.commonProperty.isXYPlot)
                return;
            handleTimeAxisZoomEvent(axisSource, jqPlotter);
            return;
        }

        //hanle value axis
        var zoomAxis = getAxisByName(axisSource.name, jqPlotter.chart.axes);
        if (zoomAxis != null && isValueAxis(zoomAxis)) {
            //set axis tickmarks
            setAxisTickMarksByMaxMin(zoomAxis, axisMinimum, axisMaximum);

            if (jqPlotter.commonProperty.isXYPlot) {
                if (axisMinimum == zoomAxis.minimum && axisMaximum == zoomAxis.maximum)
                    setZoomStatus(jqPlotter.commonProperty, false);
                else
                    setZoomStatus(jqPlotter.commonProperty, true);
            }
        }
    }

    function handleTimeAxisZoomEvent(axisSource, jqPlotter) {
        var axisMinimum = axisSource.actualVisibleMinimum;
        var axisMaximum = axisSource.actualVisibleMaximum;

        zoomAxis = jqPlotter.timeSliderAxis;

        var initialTimespan = jqPlotter.timeSliderAxis.initialTimespan;
        zoomAxis.scrollbarAtEnd = (Math.round(axisSource.actualVisibleMaximum) + 3000) >= zoomAxis.seriesLastTimestamp;

        //handle zoom out / zoom in
        var actualTimespan = axisSource.actualVisibleMaximum - axisSource.actualVisibleMinimum;
        if (actualTimespan != initialTimespan)
            setZoomStatus(jqPlotter.commonProperty, true);
        else
            setZoomStatus(jqPlotter.commonProperty, false);

        zoomAxis.timespan = actualTimespan;
        if (actualTimespan > initialTimespan - 1000) {          //if zoom out of limit, back to initialTimespan limit
            if (zoomAxis.scrollbarAtEnd) {
                zoomAxis.visibleMaximum = axisSource.actualVisibleMaximum;
                zoomAxis.visibleMinimum = zoomAxis.visibleMaximum - initialTimespan;
            }
            else {
                var middle = axisSource.actualVisibleMinimum + actualTimespan / 2;
                zoomAxis.visibleMaximum = middle + initialTimespan / 2;
                if (zoomAxis.visibleMaximum > zoomAxis.maximum)
                    zoomAxis.visibleMaximum = zoomAxis.maximum;
                zoomAxis.visibleMinimum = zoomAxis.visibleMaximum - initialTimespan;
            }
            zoomAxis.timespan = initialTimespan;
            axisMinimum = zoomAxis.visibleMinimum;
            axisMaximum = zoomAxis.visibleMaximum;
            setZoomStatus(jqPlotter.commonProperty, false);
        } else if (actualTimespan <= 0) {
            zoomAxis.visibleMinimum = axisSource.actualVisibleMinimum;
            zoomAxis.visibleMaximum = zoomAxis.visibleMinimum + 1;
            zoomAxis.timespan = 1;
        }

        //update label axis
        jqPlotter.timeLabelAxis.minimum = axisMinimum;
        jqPlotter.timeLabelAxis.maximum = axisMaximum;
        setAxisTickMarksByMaxMin(jqPlotter.timeLabelAxis, axisMinimum, axisMaximum);

        updateGridAreaPosition(jqPlotter.commonProperty.elementId);
        if (!jqPlotter.commonProperty.isXYPlot) {
            JqPlotter_InfoBar.updateTimespanOnInfoBar(zoomAxis.timespan, jqPlotter.commonProperty);
            JqPlotter_InfoBar.updateEndTimestamp(zoomAxis.visibleMaximum, jqPlotter.commonProperty);
            //updateInfobarAndLegendForSliderBar(zoomAxis, jqPlotter);      //will search point on series
        }

        $('#' + jqPlotter.commonProperty.elementId + '_inforBar_zoomButton').show();
    }

    //get time span from visibledataPointcount configuration
    function getTimespanByVisibleDataPoint(seriesData, endIndex, visibleDataPointCount, timeIndex) {
        var timespan = 0;
        if (endIndex > 0) {
            var startIndex = endIndex - Math.min(endIndex, visibleDataPointCount) + 1;

            var endTime = seriesData[endIndex][timeIndex];
            var startTime = seriesData[startIndex][timeIndex];
            timespan = endTime - startTime;
        }
        return timespan;
    }

    //handle zoom in/out's reset
    my.handleResetZoomEvent = function () {
        if (this.commonProperty.isZooming) {
            if (!this.commonProperty.isXYPlot) {
                resetAxesZoomInOut(this.allAxesY, this.timeSliderAxis, this.timeLabelAxis);
                setZoomStatus(this.commonProperty, false);

                JqPlotter_InfoBar.updateTimespanOnInfoBar(this.timeSliderAxis.timespan, this.commonProperty);
                JqPlotter_InfoBar.updateEndTimestamp(this.timeSliderAxis.visibleMaximum, this.commonProperty);
                $("#" + this.commonProperty.elementId + "_chartdiv").jqChart('update');
            }
            else {
                var valueAxes = this.allAxesX;
                valueAxes = valueAxes.concat(this.allAxesY);
                valueAxes.forEach(function (valueAxis) {
                    setValueAxisMinMax(valueAxis, valueAxis.minimum, valueAxis.maximum);
                });
                setZoomStatus(this.commonProperty, false);
                $("#" + this.commonProperty.elementId + "_chartdiv").jqChart('update');
            }
        }
    }

    function resetAxesZoomInOut(valueAxes, timeSliderAxis, timeLabelAxis) {
        valueAxes.forEach(function (valueAxis) {
            setValueAxisMinMax(valueAxis, valueAxis.minimum, valueAxis.maximum);
        });

        var actualTimespan = timeSliderAxis.visibleMaximum - timeSliderAxis.visibleMinimum;
        var middle = timeSliderAxis.visibleMinimum + actualTimespan / 2;
        timeSliderAxis.visibleMaximum = middle + timeSliderAxis.initialTimespan / 2;
        if (timeSliderAxis.visibleMaximum > timeSliderAxis.maximum)
            timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
        timeSliderAxis.visibleMinimum = timeSliderAxis.visibleMaximum - timeSliderAxis.initialTimespan;
        updateTimeLabelAxisByTimeSliderAxis(timeLabelAxis, timeSliderAxis);
        timeSliderAxis.timespan = timeSliderAxis.initialTimespan;
    }

    //add static line to plotarea
    function drawStaticLines(staticLineProperties, axis) {
        axis.staticLineProperties = staticLineProperties;

        if (!isValidObject(axis.plotLines))
            axis.plotLines = [];

        //remove all static lines of axis
        var i = 0;
        while (axis.plotLines.length > 0 && i < axis.plotLines.length) {
            if (axis.plotLines[i].plotLineType == CONSTANT.plotLineTypes.staticLine) {
                axis.plotLines.splice(i, 1);
            }
            else
                i++;
        }

        staticLineProperties.forEach(function (staticLineProperty) {
            var plotLine = {
                plotLineType: CONSTANT.plotLineTypes.staticLine,
                lineWidth: staticLineProperty.penSize,
                value: staticLineProperty.value,
                strokeStyle: axis.basicColor,
                strokeDashArray: PropertyParser.getStrokeDashArrayFromCurveType(staticLineProperty.curveType),
                zIndex: 0,
            };
            plotLine.lineWidth = adjustLineWidth(plotLine.lineWidth);

            axis.plotLines.push(plotLine);
            valueAxisCalculateMinMax(axis, staticLineProperty.value);
        });
    }

    //add attribute lines to plotarea
    function drawAttributes(attributes, axis) {
        if (!isValidObject(axis.plotLines))
            axis.plotLines = [];

        //remove all attribute lines of axis
        var i = 0;
        while (axis.plotLines.length > 0 && i < axis.plotLines.length) {
            if (axis.plotLines[i].plotLineType == CONSTANT.plotLineTypes.attributeLine) {
                axis.plotLines.splice(i, 1);
            }
            else
                i++;
        }

        attributes.forEach(function (attribute) {
            if (attribute.ItemReference.toLowerCase() == 'true') {
                // attributes that change over time are handled in daUpdate();
                return;
            }

            var plotLine = {
                plotLineType: CONSTANT.plotLineTypes.attributeLine,
                lineWidth: attribute.PenSize,
                value: attribute.Value,
                strokeStyle: attribute.Color,
                strokeDashArray: PropertyParser.getStrokeDashArrayFromCurveType(attribute.CurveType),
                zIndex: 0,
            }
            plotLine.lineWidth = adjustLineWidth(plotLine.lineWidth);
            axis.plotLines.push(plotLine);
            valueAxisCalculateMinMax(axis, attribute.Value);
        });
    }
    my.drawAttributes = drawAttributes;

    function drawTimereferenceMarkTime(timeReferenceMarkTime, axis) {
        if (!isValidObject(axis.plotLines))
            axis.plotLines = [];

        axis.plotLines.push({
            plotLineType: CONSTANT.plotLineTypes.timeReferenceMarkTime,
            zIndex: 0,
            value: 0,
            lineWidth: timeReferenceMarkTime.penSize,
            strokeStyle: timeReferenceMarkTime.color,
            strokeDashArray: PropertyParser.getStrokeDashArrayFromCurveType(timeReferenceMarkTime.curveType),
            visible: timeReferenceMarkTime.markTimeOn,
        });
    }
    my.drawTimereferenceMarkTime = drawTimereferenceMarkTime;

    my.setValueAxisMinMaxManually = function (axis, minimum, maximum) {
        axis.automaticRange = false;
        setValueAxisMinMax(axis, minimum, maximum);
    }

    my.setValueAxisVisibleRangeManually = function (valueAxis, visibleRange, jqPlotter) {
        valueAxis.visibleRange = visibleRange;
        if (valueAxis.isAxisX)
            updateValueAxis(valueAxis, jqPlotter.allAxesX);
        else
            updateValueAxis(valueAxis, jqPlotter.allAxesY);
    }

    my.setValueAxisDecimalsManually = function (axis, decimals, isDefault, jqPlotter) {
        //send event to legend
        if (axis.labels.numDecimals != decimals) {
            var ee = window.pageProperty.eventEmitter;
            var axisDecimalsChangedEventName = jqPlotter.commonProperty.elementId + "_" + axis.curveIndex + "_" + (axis.isAxisX ? "X" : "Y") + "_axisDecimals";
            ee.emitEvent(axisDecimalsChangedEventName, [decimals]);
        }

        axis.labels.numDecimals = decimals;
        axis.labels.isNumDecimalsDefault = isDefault;
        var labelStringFormat = getNumberFormat(axis.labels.numDecimals);
        axis.labels.stringFormat = labelStringFormat;

        //update axis's space
        getLongestLabel(axis);
        if (!axis.isAxisX)
            calculateAxisSpace(axis);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
        updateGridAreaPosition(jqPlotter.commonProperty.elementId);
    }

    my.setStaticLinesManually = function (axis, staticLineProperties) {
        drawStaticLines(staticLineProperties, axis);
    }

    function updateTimespan(timespan, timeSliderAxis, commonProperty) {
        timeSliderAxis.timespan = timespan;
        timeSliderAxis.initialTimespan = timespan;
        commonProperty.initialTimespan = timespan;

        timeSliderAxis.scrollbarAtEnd = timeSliderAxis.maximum <= (Math.round(timeSliderAxis.visibleMaximum) + 3000);

        JqPlotter_InfoBar.updateTimespanOnInfoBar(timeSliderAxis.timespan, commonProperty);
    }

    function setTimespanInRuntime(timespan, visibleDataPoint, jqPlotter) {
        var timeSliderAxis = jqPlotter.timeSliderAxis;

        if (!jqPlotter.commonProperty.haveData)
            return;

        if (timespan == 0) {        //show all
            jqPlotter.commonProperty.showAllData = true;
            jqPlotter.commonProperty.visibleDataPointCount = -1;

            timeSliderAxis.minimum = timeSliderAxis.seriesFirstTimestamp;
            timeSliderAxis.maximum = timeSliderAxis.seriesLastTimestamp;
            timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;
            timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
            timespan = timeSliderAxis.visibleMaximum - timeSliderAxis.visibleMinimum;
        }
        else if (visibleDataPoint > 0) {
            jqPlotter.commonProperty.showAllData = false;
            jqPlotter.commonProperty.visibleDataPointCount = visibleDataPoint;
            timeSliderAxis.mouseWheelZoomStep = 0;

            jqPlotter.visibleSeries.forEach(function (series) {
                seriesData = series.data;
                if (seriesData.length > 0) {
                    //if visibleDataPointCount setting is available 
                    if (visibleDataPoint > 0) {
                        if (series.visibleEndIndex != null)
                            var curveTimespan = getTimespanByVisibleDataPoint(seriesData, series.visibleEndIndex, visibleDataPoint, 0);
                        else
                            var curveTimespan = getTimespanByVisibleDataPoint(seriesData, seriesData.length - 1, visibleDataPoint, 0);
                        if (curveTimespan < timespan || timespan <= 0)
                            timespan = curveTimespan;
                    }
                }
            });

            timeSliderAxis.visibleMinimum = timeSliderAxis.visibleMaximum - timespan;
        }
        else if (timespan > 0) {
            jqPlotter.commonProperty.showAllData = false;
            jqPlotter.commonProperty.visibleDataPointCount = -1;

            timeSliderAxis.visibleMinimum = timeSliderAxis.visibleMaximum - timespan;

            if (timeSliderAxis.seriesFirstTimestamp + timespan <= timeSliderAxis.maximum) {
                timeSliderAxis.minimum = timeSliderAxis.seriesFirstTimestamp;

                if (timeSliderAxis.visibleMinimum < timeSliderAxis.minimum) {
                    timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;
                    timeSliderAxis.visibleMaximum = timeSliderAxis.minimum + timespan;
                }
            }
            else {
                timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
                timeSliderAxis.visibleMinimum = timeSliderAxis.maximum - timespan;
                timeSliderAxis.minimum = timeSliderAxis.visibleMinimum;     //minimum is changed
            }
        }
        else
            return;

        updateTimespan(timespan, timeSliderAxis, jqPlotter.commonProperty);

        //update time label axis
        updateTimeLabelAxisByTimeSliderAxis(jqPlotter.timeLabelAxis, timeSliderAxis);

        //updateGridAreaPosition(jqPlotter.commonProperty.elementId);

        JqPlotter_Ruler.updateInfobarAndLegendForSliderBar(timeSliderAxis, jqPlotter);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    my.setVisibleDataPointManually = function (visibleDataPointCount, jqPlotter) {
        if (!jqPlotter.commonProperty.isXYPlot)
            setTimespanInRuntime(-1, visibleDataPointCount, jqPlotter);
        else
            JqPlotter_XYPlotMain.setTimespanInRuntimeForXYPlot(-1, visibleDataPointCount, jqPlotter);
    }

    my.setTimespanManually = function (timespan, jqPlotter) {
        if (!jqPlotter.commonProperty.isXYPlot)
            setTimespanInRuntime(timespan, -1, jqPlotter);
        else
            JqPlotter_XYPlotMain.setTimespanInRuntimeForXYPlot(timespan, -1, jqPlotter);
    }

    function setAxisColor(axis, color) {
        if (color) {
            axis.labels.fillStyle = color;
            axis.majorTickMarks.strokeStyle = color;
            axis.strokeStyle = color;
        }
    }

    return my;
}());

function setAxisStatus(axis, axesStatus) {
    var selectedDiv = $(axis.div);
    selectedDiv.toggleClass("jqplotter-axis-div-unselected jqplotter-axis-div-selected");
    if (axis.isSelected) {
        axis.isSelected = false;
        axesStatus.selectedNum--;
        axesStatus.selectedAxes.remove(axis);
    }
    else {
        axis.isSelected = true;
        axesStatus.selectedNum++;
        axesStatus.selectedAxes.push(axis);
    }
}

function getVisibleAxes(allAxes) {
    var existedAxes = [];
    for (var i = 0; i < allAxes.length; i++) {
        if (allAxes[i].visible)
            existedAxes.push(allAxes[i]);
    }
    return existedAxes;
}

//create axisx div 
function createAxisXDiv(axis, commonProperty) {
    var controlId = commonProperty.elementId;
    var axisHeight = axis.labelHeight
                + jqPlotterConstants.defaults.marginBtwAsixLabelAndTickmark
                + axis.majorTickMarks.length - 2 - 2;
    var $chartDiv = $('#' + controlId + '_chartdiv');
    var divContainer;
    var div = $("<div></div>").attr("id", axis.name + 'div').
        data("parentAxis", axis);

    if (axis.location == "bottom") {
        divContainer = $('#' + controlId + 'axisXDivBottom');
        div.addClass('jqplotter-axis-div-bottom');
        var first = divContainer.find('div').first();
        if (first.length > 0)
            div.insertBefore(first);
        else
            div.appendTo(divContainer);
    }
    else {
        divContainer = $('#' + controlId + 'axisXDivTop');
        div.addClass('jqplotter-axis-div-top');
        div.appendTo(divContainer);
    }

    div.addClass('context-menu-axisX').css('height', axisHeight);
    if (!commonProperty.userInteraction && commonProperty.isXYPlot)
        div.addClass('context-menu-disabled');
    div.data('jqPlotter', $chartDiv[0].jqPlotter).data('axisX', axis);
    axis.div = div[0];

    if (commonProperty.isXYPlot) {
        div.addClass('context-menu-axis-value')
       .addClass("jqplotter-axis-div-unselected");
        $("<span>" + axis.unit + "</span>").appendTo(div).addClass('jqplotter-axisX-div-unit noselect').css('font', commonProperty.fontString);

        if (commonProperty.userInteraction && commonProperty.userInteractionAxisScaling) {
            div.css('cursor', 'pointer');
            div.mouseup(function (e) {
                if (!axis.ismoving && axis.flagDivDown && e.button != 2)
                    setAxisStatus(axis, commonProperty.axesXStatus);
                axis.flagDivDown = false;
            });
            div.on('mousedown', [axis, commonProperty], HandleMouseDown);
        }
    }
    else {
        div.addClass('context-menu-axisX');
    }
}

function func(e) {
    var axis = e.data[0];
    if (axis.logarithmic || !axis.flagButtonDown)
        return;
    var commonProperty = e.data[1];
    var id = axis.name.substring(0, axis.name.indexOf("_"));
    axis.flagButtonDown = false;
    var selectedJqPlotter = $("#" + id + "_chartdiv");
    var min = axis.minimum;
    var max = axis.maximum;
    var that = this;
    if (axis.rangeLoItem || axis.rangeHiItem)
        return;
    if (axis.isMerged) {
        if (!axis.rangeLoMerged) {
            showManualRangeDialog.call(this, axis, selectedJqPlotter, e);
        }
        else {
            axis.rangeLoMerged = null;
            axis.rangeHiMerged = null;
            setValueAxisMinMax(axis, axis.automaticMinimumMerged, axis.automaticMaximumMerged);
            updateAxisButton($(this), true);
            selectedJqPlotter.jqChart('update');
        }
    }
    else {
        if (!axis.rangeLo) {
            showManualRangeDialog.call(this, axis, selectedJqPlotter, e);
        } else {
            axis.rangeLo = null;
            axis.rangeHi = null;
            setValueAxisMinMax(axis, axis.automaticMinimum, axis.automaticMaximum);
            updateAxisButton($(this), true);
            selectedJqPlotter.jqChart('update');
        }
    }
}


//create axisy div 
function createAxisYDiv(axis, commonProperty) {
    var controlId = commonProperty.elementId;
    var divContainer;
    var div = $("<div></div>").attr(
     "id", axis.name + 'div');
    div.data("parentAxis", axis);
    div.addClass("jqplotter-axis-div-unselected").addClass('context-menu-axis-value');
    axis.div = div[0];
    if (axis.location == "left") {
        divContainer = $('#' + controlId + 'axisYDivLeft');
        div.addClass('jqplotter-axis-div-left');
    }
    else {
        divContainer = $('#' + controlId + 'axisYDivRight');
        div.addClass('jqplotter-axis-div-right');
    }

    divContainer.append(div);
    if (!commonProperty.userInteraction)
        div.addClass('context-menu-disabled');

    if (commonProperty.userInteraction && commonProperty.userInteractionAxisScaling) {
        div.css('cursor', 'pointer');
        div.mouseup(function (e) {
            if (!axis.ismoving && axis.flagDivDown && e.button != 2)
                setAxisStatus(axis, commonProperty.axesYStatus);
            axis.flagDivDown = false;
        });
        div.on('mousedown', [axis, commonProperty], HandleMouseDown);
    }

    $("<p>" + axis.unit + "</p>").appendTo(div).addClass('jqplotter-axisY-div-unit noselect').css('font', commonProperty.fontString);
    var btn = $("<div></div>").addClass('jqplotter-axis-div-button noselect')
    var btn_span = $("<span>aut</span>").addClass('jqplotter-axis-div-button-span').appendTo(btn);
    if (axis.rangeLo || axis.rangeLoItem || axis.rangeHiItem) {
        updateAxisButton(btn, false)
    }
    if (commonProperty.userInteraction && commonProperty.userInteractionAxisScaling) {
        btn.css('cursor', 'pointer');
        btn.on('mouseup', [axis, commonProperty], func).
            on('mousedown', function (e) {
                e.stopImmediatePropagation();
                axis.flagButtonDown = true;
            });
    }
    div.append(btn);
}

function updateAxisButton($btn, isAuto) {
    $btn[0].children[0].innerHTML = isAuto ? 'aut' : 'man';
}


function HandleMouseDown(e) {
    e = e || event;
    e.stopImmediatePropagation();
    var axis = e.data[0];
    var commonProperty = e.data[1];
    axis.ismoving = false;
    axis.flagDivDown = true;
    if (axis.logarithmic)
        return;
    $document = $(document);
    var originalXY = axis.isAxisX ? e.clientX : e.clientY;
    //console.log('!!!!!' + originalY);
    var maximum = axis.maximum;
    var minimum = axis.minimum;
    var gridHeiWid = axis.isAxisX ? commonProperty.gridAreaPosition.gridWidth : commonProperty.gridAreaPosition.gridHeight;
    //add inforbar height 18
    var divOffset = axis.isAxisX ? this.getBoundingClientRect().left + commonProperty.gridAreaPosition.gridOffsetX - 3 : this.getBoundingClientRect().top + 18;
    function handleDragAxis(e) {
        e = e || event;
        axis.ismoving = true;
        var movingXY = axis.isAxisX ? e.clientX : e.clientY;
        var arr = getAxisRangeWhileMovingMouse(axis, divOffset, originalXY, movingXY, gridHeiWid, minimum, maximum);
        if (axis.isMerged) {
            axis.rangeLoMerged = arr[0];
            axis.rangeHiMerged = arr[1];
        }
        else {
            axis.rangeLo = arr[0];
            axis.rangeHi = arr[1];
        }    
        setValueAxisMinMax(axis, arr[0], arr[1]);
        $("#" + commonProperty.elementId + "_chartdiv").jqChart('update');
        if (!axis.isAxisX)
            updateAxisButton($(axis.div).find('.jqplotter-axis-div-button'), false);
    };
    $document.on('mousemove', handleDragAxis);
    $document.one('mouseup', function () {
        $document.off('mousemove', handleDragAxis);
    });
}

function getAxisRangeWhileMovingMouse(axis, divOffsetTop, originalY, movingY, axisHeight, minimum, maximum) {
    var minMax = [];
    var middlePointOffset = divOffsetTop + axisHeight / 2;
    var moveRate = (maximum - minimum) / axisHeight;
    //console.log('enter' + 'original' + originalY+'===='+'middlePointOffset'+middlePointOffset);
    if ((!axis.isAxisX && !axis.reversed) || (axis.isAxisX && axis.reversed)) {
        if (originalY < middlePointOffset) {
            maximum = (movingY - originalY) * moveRate + maximum;
        }
        else {
            minimum = (movingY - originalY) * moveRate + minimum;
        }
    }
    else {
        if (originalY > middlePointOffset) {
            maximum = -(movingY - originalY) * moveRate + maximum;
        }
        else {
            minimum = -(movingY - originalY) * moveRate + minimum;
        }
    }
    minMax.push(minimum);
    minMax.push(maximum);
    return minMax;
}

//if axis is value or datetime
function isValueAxis(axis) {
    if (axis.type != 'dateTime')
        return true;
    else
        return false;
}

//get axis by name
function getAxisByName(name, axes) {
    for (var i = 0; i < axes.length; i++) {
        if (axes[i].name == name) {
            return axes[i];
        }
    }
    return null;
}

function getAxisByCurveIndex(curveIndex, isAxisX, axes) {
    for (var i = 0; i < axes.length; i++) {
        if (axes[i].curveIndex == curveIndex && axes[i].isAxisX == isAxisX)
            return axes[i];
    }
    return null;
}

function getAxisByMergedCurveIndex(curveIndex, axes) {
    for (var i = 0; i < axes.length; i++) {
        if (isElementInArray(curveIndex, axes[i].mergedCurveIndexes))
            return axes[i];
    }
    return null;
}

function getLongestLabel(axis) {
    var labelArray = axis.customTickMarks;
    var formatedLabel;
    if (axis.type == 'linear') {
        for (var i = 0; i < labelArray.length; i++) {
            if (axis.useScientificNotation) {
                formatedLabel = CommonFunction.getScentificNotationOfNumber(Number(labelArray[i]));
                var delimiter = numeral.languageData().delimiters.decimal;
                if (delimiter != '.')
                    formatedLabel = formatedLabel.replace('.', delimiter);
            }
            else {
                var numOfDecimals = axis.labels.numDecimals;
                var defaultFormat = "0,0";
                if (numOfDecimals > 0) {
                    defaultFormat += '.';
                }
                for (j = 0; j < numOfDecimals; j++) {
                    defaultFormat += '0';
                }
                formatedLabel = numeral(labelArray[i]).format(defaultFormat)
            }
            if (axis.longestLabel == null)
                axis.longestLabel = formatedLabel;
            else if (formatedLabel.length > axis.longestLabel.length)
                axis.longestLabel = formatedLabel;
        }
    }
}

//used to set 'left' or 'right' axis's width
function calculateAxisSpace(axis) {
    if (axis.type == 'linear' && axis.visible) {
        if (axis.isAxisX) {
            var labelWidth = axis.labels.fontSize;
            axis.height = labelWidth + jqPlotterConstants.defaults.marginBtwAsixLabelAndTickmark
                + axis.majorTickMarks.length - 2;
        } else {
            var c = window.pageProperty.helperCanvas
            var ctx = c.getContext("2d")
            // set font of context so it will calculate our formatted font (bold, italic etc)
            ctx.font = axis.labels.font;
            var labelWidth = ctx.measureText(axis.longestLabel).width;
            axis.longestLabel = null;

            axis.width = labelWidth
                //there's some space between label and tickmark
                + jqPlotterConstants.defaults.marginBtwAsixLabelAndTickmark
                + axis.majorTickMarks.length;
            if (axis.width < 25)
                axis.width = 25;
        }
        axis.div.style.width = axis.width - 3 + 'px';
    }
}

//set axis's minimum and maximum
function setValueAxisMinMax(axis, minimum, maximum) {
    minimum = parseFloat(minimum);
    maximum = parseFloat(maximum);
    if (minimum > maximum) {
        var temp = maximum;
        maximum = minimum;
        minimum = temp;
    }

    if (axis.minimum != minimum || axis.maximum != maximum) {
        axis.minimum = minimum;
        axis.maximum = maximum;
        window.pageProperty.eventEmitter.emitEvent(axis.name + "MinMaxChanged",
                [minimum, maximum]);
    }

    setAxisVisibleMinMax(axis, minimum, maximum);
}

//set axis's visible minimum and maximum
function setAxisVisibleMinMax(axis, minimum, maximum) {
    axis.visibleMinimum = axis.minimum;
    axis.visibleMaximum = axis.maximum;

    setAxisTickMarksByMaxMin(axis, axis.visibleMinimum, axis.visibleMaximum);
}

//used to automaticlly calculate hi/lo for valueAxis
function valueAxisCalculateMinMax(valueAxis, itemValue) {
    valueAxis.itemValue = itemValue;

    var maxChanged = false;
    var minChanged = false;

    if (valueAxis.dataMaximum == null || valueAxis.dataMaximum < itemValue) {
        valueAxis.dataMaximum = itemValue;
        maxChanged = true;
    }
    if (valueAxis.dataMinimum == null || valueAxis.dataMinimum > itemValue) {
        valueAxis.dataMinimum = itemValue;
        minChanged = true;
    }

    if (maxChanged || minChanged) {
        var minMax = computeValueAxisMinMax(valueAxis.dataMinimum, valueAxis.dataMaximum, valueAxis.numMajorGrid);

        valueAxis.automaticMinimum = minMax[0];
        valueAxis.automaticMaximum = minMax[1];
    }
}

//caculate min/max for yAxis based on tick counts
function computeValueAxisMinMax(min, max, tickCount) {
    var minMax = new Array();
    if (min == max) {
        return [min - 1.0, max + 1.0];
    }

    maxTickCount = Math.max(4, tickCount);

    var range = Math.abs(max - min);
    var unroundedTickSize = range / maxTickCount;
    var x = Math.ceil(Math.log(unroundedTickSize) / Math.LN10 - 1);
    var pow10x = Math.pow(10, x);
    var roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
    minMax[0] = parseFloat(roundedTickRange * Math.round(min / roundedTickRange));
    while (min < minMax[0]) {
        minMax[0] -= parseFloat(roundedTickRange);
    }
    minMax[1] = parseFloat(roundedTickRange * Math.round(max / roundedTickRange));
    while (max > minMax[1]) {
        minMax[1] += parseFloat(roundedTickRange);
    }
    //for test
    if (tickCount == 2 && (minMax[1] > 20 || minMax[0] < -20)) {
        i = 0;
    }

    if (minMax[1] > 120 || minMax[0] < -80) {
        j = 0;
    }
    return minMax;
}

//used to set axis's tick mark
function setAxisTickMarksByMaxMin(axis, axisMin, axisMax) {
    if (!axis.logarithmic) {
        var axisMinimum = parseFloat(axisMin);
        var axisMaximum = parseFloat(axisMax);

        var majorGrid = axis.numMajorGrid;
        var tickMarks = [];
        var interval = (axisMaximum - axisMinimum) / majorGrid;
        if (interval > 0) {
            tickMarks[0] = axisMinimum;
            var i = 1;
            while (i < majorGrid) {
                tickMarks[i] = tickMarks[i - 1] + interval;
                i++;
            }
            tickMarks[i] = axisMaximum;

            axis.customTickMarks = tickMarks;
        }
        else if (interval == 0) {
            for (var i = 0; i <= majorGrid; i++)
                tickMarks[i] = axisMinimum;
        }
        getLongestLabel(axis);
        if (!axis.isAxisX)
            calculateAxisSpace(axis);
    }
}

//hide x/y axes
function hideAxes(axes, chart) {
    if (axes.length <= 0)
        return;

    for (var i = 0; i < axes.length; i++) {
        setAxisVisible(axes[i], false);
    }

    if (axes[0].isAxisX)
        chart.border.padding.right = 0;
}

//set axis's visible true or false
function setAxisVisible(axis, visible) {
    if (visible) {
        axis.lineWidth = jqPlotterConstants.defaults.yAxisLabelPenSize;
        axis.labels.visible = true;
        axis.majorTickMarks.visible = true;
        axis.visible = true;
        calculateAxisSpace(axis);
    }
    else {
        axis.lineWidth = 0;
        axis.labels.visible = false;
        axis.majorTickMarks.visible = false;
        axis.rangeSlider.visible = false;
        axis.visible = false;
        if (axis.location == 'top' || axis.location == 'bottom') {
            axis.height = 0;
            axis.div.style.display = 'none';
        }
        else if (axis.location == 'left' || axis.location == 'right') {
            axis.width = 0;
            axis.div.style.display = 'none';
        }
    }
}

//set axis's color
function setAxisColor(axis, color) {
    if (axis.type != 'dateTime')
        axis.strokeStyle = color;
    axis.labels.fillStyle = color;
    axis.majorTickMarks.strokeStyle = color;
}

function setAxisToCurve(axis, curveProperty) {
    axis.mergedCurveIndexes.push(curveProperty.curveIndex);
    if (axis.isAxisX)
        curveProperty.axisX = axis;
    else
        curveProperty.axisY = axis;
}

//merge many axes
function mergeSeveralAxes(axesForMerge, curveProperties, mergeAxesBlack) {
    if (axesForMerge.length <= 0)
        return null;
    for (var j = 0; j < axesForMerge.length; j++) {
        axesForMerge[j].isMerged = false;
        axesForMerge[j].rangeLoMerged = null;
        axesForMerge[j].rangeHiMerged = null;
    }
    var baseAxis = axesForMerge[0];
    for (var i = 1; i < axesForMerge.length; i++) {
        if (axesForMerge[i].reversed != baseAxis.reversed) {
            var message = "Impossible to merge inverse and non-inverse axes";
            showMergeAxesErrorDialog(message);
            return null;
        }
        if (axesForMerge[i].logarithmic != baseAxis.logarithmic) {
            var message = "Impossible to merge logarithmic and non-logarithmic axes";
            showMergeAxesErrorDialog(message);
            return null;
        }
    }

    for (var i = 1; i < axesForMerge.length; i++) {
        mergeTwoAxes(baseAxis, axesForMerge[i], curveProperties, mergeAxesBlack);
    }

    return baseAxis;
}

//merge two axes
function mergeTwoAxes(baseAxis, secondAxis, curveProperties, mergeAxesBlack) {
    while (secondAxis.mergedCurveIndexes.length > 0) {
        var curveIndex = secondAxis.mergedCurveIndexes.shift();
        var curveProperty = getCurvePropertyByCurveIndex(curveIndex, curveProperties);
        if (curveProperty != null)
            setAxisToCurve(baseAxis, curveProperty);
        setAxisVisible(secondAxis, false);      //set the merged axis as hided
        if (secondAxis.div)
            secondAxis.div.style.display = 'none';
    }
    if (baseAxis.div && baseAxis.div.firstChild && baseAxis.unit != secondAxis.unit)
        baseAxis.div.firstChild.style.display = 'none';
    if (mergeAxesBlack)
        setAxisColor(baseAxis, "black");
    baseAxis.isMerged = true;

    return baseAxis;
}

//existedAxes may order decent
function forkAxis(baseAxis, allAxes, curveProperties) {
    var forkedAxes = [];

    var curveIndexes = baseAxis.mergedCurveIndexes;
    for (var i = 1; i < curveIndexes.length; i++) {
        var curveProperty = getCurvePropertyByCurveIndex(curveIndexes[i], curveProperties);

        var axis = getAxisByCurveIndex(curveIndexes[i], baseAxis.isAxisX, allAxes);
        setAxisToCurve(axis, curveProperty);
        forkedAxes.push(axis);
        setAxisColor(axis, axis.initialColor);
        //set axis's visible
        setAxisVisible(axis, true);
        if (axis.div)
            axis.div.style.display = 'block';

        if (!axis.logarithmic) {
            //after fork, set axis's maximum and minimum
            var minMax = updateValueAxis(axis, allAxes);
            setValueAxisMinMax(axis, minMax[0], minMax[1]);
        }
        if (axis.isMerged) {
            axis.rangeLoMerged = null;
            axis.rangeHiMerged = null;
            axis.isMerged = false;
        }
    }
    baseAxis.mergedCurveIndexes = [baseAxis.curveIndex];
    baseAxis.isMerged = false;
    baseAxis.rangeLoMerged = null;
    baseAxis.rangeHiMerged = null;
    var o = !(isValidNumber(baseAxis.rangeLo) && isValidNumber(baseAxis.rangeHi)) ? true : false;
    if (!baseAxis.isAxisX) {
        updateAxisButton($(baseAxis.div).find('.jqplotter-axis-div-button'), o);
    }

    setAxisColor(baseAxis, baseAxis.initialColor);
    baseAxis.div.firstChild.style.display = 'block';
    //forkedAxes.sort(sortAxes);
    return forkedAxes.reverse();
}

//when initialize axes, merge axes by merge identifier
function mergeAxesByMergeIdentifier(allAxes, curveProperties, mergeAxesBlack) {
    var resultsAxes = [];
    var mergedReversedAxis = false;
    var mergedLogarithmicAxis = false;

    //allAxes is the different order
    for (var i = 0; i < allAxes.length; i++) {
        var axis = allAxes[i];
        var existedMerged = false;
        if (axis.mergeIdentifier >= 0) {
            for (var j = 0; j < resultsAxes.length; j++) {
                var baseAxis = resultsAxes[j];

                if (axis.mergeIdentifier == baseAxis.mergeIdentifier) {
                    if (axis.reversed == baseAxis.reversed && axis.logarithmic == baseAxis.logarithmic) {
                        mergeTwoAxes(baseAxis, axis, curveProperties, mergeAxesBlack);
                        existedMerged = true;
                    } else if (axis.reversed != baseAxis.reversed)
                        mergedReversedAxis = true;
                    else if (axis.logarithmic != baseAxis.logarithmic)
                        mergedLogarithmicAxis = true;
                }
            }
        }
        if (!existedMerged)
            resultsAxes.push(axis);
    }

    if (mergedReversedAxis)
        showMergeAxesErrorDialog("Impossible to merge inverse and non-inverse axes");
    if (mergedLogarithmicAxis)
        showMergeAxesErrorDialog("Impossible to merge logarithmic and non-logarithmic axes");

    return resultsAxes;
}

// format Y axis labels according to the locale,or change to scientific notation
function formatLabel(event, data) {
    if (data.context.axis.type == 'linear') {              //location == 'left' || data.context.axis.location == "right") {
        data.text = CommonFunction.formatItemValue(data.text,
            data.context.axis.useScientificNotation,
            data.context.axis.labels.numDecimals);
    }
}

function setZoomStatus(commonProperty, isZooming) {
    if (!commonProperty.isZooming == isZooming) {
        commonProperty.isZooming = isZooming;
        var ee = window.pageProperty.eventEmitter;
        var zoomStatusChangedEventName = commonProperty.elementId + CONSTANT.STRING.eventZoomStatusChanged;
        ee.emitEvent(zoomStatusChangedEventName, [isZooming]);
    }
}

function syncMergedValueAxesMinMax(valueAxis, allAxesY) {
    for (var i = 1; i < valueAxis.mergedCurveIndexes.length; i++) {
        var axis = getAxisByCurveIndex(valueAxis.mergedCurveIndexes[i], valueAxis.isAxisX, allAxesY);
        setValueAxisMinMax(axis, valueAxis.minimum, valueAxis.maximum);
    }
}

//get the merged axes rangelo/hi.automin/max
function valueAxisHandleMergedMinMax(valueAxis, allAxesY) {
    var minMaxArray = [];
    var rangeLoHiArray = [];
    for (var i = 0; i < valueAxis.mergedCurveIndexes.length; i++) {
        var axis = getAxisByCurveIndex(valueAxis.mergedCurveIndexes[i], valueAxis.isAxisX, allAxesY);
        if (isValidNumber(axis.automaticMinimum))
            minMaxArray.push(axis.automaticMinimum);
        if (isValidNumber(axis.automaticMaximum))
            minMaxArray.push(axis.automaticMaximum);
        if (isValidNumber(axis.rangeLo))
            rangeLoHiArray.push(axis.rangeLo);
        if (isValidNumber(axis.rangeHi))
            rangeLoHiArray.push(axis.rangeHi);
    }
    minMaxArray.sort(sortNumber);
    valueAxis.automaticMinimumMerged = minMaxArray[0];
    valueAxis.automaticMaximumMerged = minMaxArray[minMaxArray.length - 1];
    if (!(isValidNumber(valueAxis.rangeLoMerged) && isValidNumber(valueAxis.rangeHiMerged))) {
        if (rangeLoHiArray.length > 1) {
            rangeLoHiArray.sort(sortNumber);
            if ((isValidNumber(valueAxis.rangeLo) && isValidNumber(valueAxis.rangeHi))) {
                valueAxis.rangeLoMerged = rangeLoHiArray[0];
                valueAxis.rangeHiMerged = rangeLoHiArray[rangeLoHiArray.length - 1];
            }
        }
    }
}

//set valueaxes' maximum, minimum
function updateValueAxis(valueAxis, allAxesY) {
    if (valueAxis.isMerged)
        valueAxisHandleMergedMinMax(valueAxis, allAxesY);

    var rangeLoTemp = valueAxis.isMerged ? valueAxis.rangeLoMerged : valueAxis.rangeLo;
    var rangeHiTemp = valueAxis.isMerged ? valueAxis.rangeHiMerged : valueAxis.rangeHi;
    var minimum = valueAxis.isMerged ? valueAxis.automaticMinimumMerged : valueAxis.automaticMinimum;
    if (isValidNumber(valueAxis.rangeLoItemValue))
        minimum = valueAxis.rangeLoItemValue;    
    else if (isValidNumber(rangeLoTemp) && isValidNumber(rangeHiTemp))
        minimum = rangeLoTemp;

    var maximum = valueAxis.isMerged ? valueAxis.automaticMaximumMerged : valueAxis.automaticMaximum;
    if (isValidNumber(valueAxis.rangeHiItemValue))
        maximum = valueAxis.rangeHiItemValue;
    else if (isValidNumber(rangeLoTemp) && isValidNumber(rangeHiTemp))
        maximum = rangeHiTemp;


    //handle visible range
    if (!isValidNumber(valueAxis.rangeLoItemValue) && !isValidNumber(valueAxis.rangeHiItemValue)
            && isValidNumber(valueAxis.visibleRange) && valueAxis.visibleRange > 0) {        //visibleRange's priority is the lowest
        if (valueAxis.itemValue) {          //if there is a item Value
            if (valueAxis.itemValue > valueAxis.maximum) {
                maximum = valueAxis.itemValue;
                minimum = maximum - valueAxis.visibleRange;
            }
            else if (valueAxis.itemValue < valueAxis.minimum) {
                minimum = valueAxis.itemValue;
                maximum = minimum + valueAxis.visibleRange;
            }
            else {
                minimum = maximum - valueAxis.visibleRange;
            }
        }
    }

    //handle valid number
    if (!isValidNumber(minimum))
        minimum = 0;
    if (!isValidNumber(maximum))
        maximum = 1;
    if (minimum == maximum)
        maximum = minimum + 1;

    return [minimum, maximum];
}

//set valueaxes' maximum, minimum
function updateValueAxes(allValueAxes) {
    for (var i = 0; i < allValueAxes.length; i++) {
        var valueAxis = allValueAxes[i];
        if (valueAxis.visible) {
            var minMax = updateValueAxis(valueAxis, allValueAxes);
            if (!valueAxis.logarithmic)
                setValueAxisMinMax(valueAxis, minMax[0], minMax[1]);
            syncMergedValueAxesMinMax(valueAxis, allValueAxes);      //make the marged axes same minimum and maximum
        }
    }
}

//get first timestamp of series data, assume the series have data
function getFirstLastTimestamp(seriesData) {
    var firstTimestamp = 0;
    var lastTimestamp = 0;
    firstTimestamp = seriesData[0][0];
    lastTimestamp = seriesData[seriesData.length - 1][0];
    return [firstTimestamp, lastTimestamp];
}

function updateAsixCrosing(axis, crossing) {
    axis.crossing = crossing ? crossing : axis.visibleMinimum;
}

function getHighLog(number) {
    var log = number > 0 ? Math.ceil(Math.log(number) / Math.log(10)) : 0;
    return log;
}

function getLowLog(number) {
    var log = number > 0 ? Math.floor(Math.log(number) / Math.log(10)) : -1;
    return log;
};

function getAxislogTickArray(min, max, tickNum) {
    var array = [];
    low = getLowLog(min);
    high = getHighLog(max);
    var max = isValidNumber(tickNum) ? low + tickNum - 1 : high;
    for (var i = low; i <= max; i++) {
        array.push(Math.pow(10, i));
    }
    return array;
}

function getlogTickNum(array) {
    var a = array.concat();
    a.sort(sortNumber);
    return a[a.length - 1];
}

function updateLogGridLines(axis, gridXMajor, gridXMinor) {

    axis.majorGridLines.lineWidth = 0.9
    axis.majorGridLines.interval = 100 / (gridXMajor - 1);

    if (gridXMinor) {
        axis.minorGridLines.lineWidth = 0.6;
        axis.minorGridLines.interval = 100 / (gridXMinor * (gridXMajor - 1));
    }
    else {
        axis.minorGridLines.lineWidth = 0;
    }
}

function updateAxisTickmark(axis, num) {
    dataMinimum = axis.isMerged ? axis.dataMinimumMerged : axis.dataMinimum;
    dataMaximum = axis.isMerged ? axis.dataMaximumMerged : axis.dataMaximum;
    //axis already loged
    if (axis.logarithmic) {
        var array = getAxislogTickArray(dataMinimum, dataMaximum);

        var array = getAxislogTickArray(dataMinimum, dataMaximum, num);
        axis.customTickMarks = array;
        axis.minimum = array[0];
        axis.maximum = array[array.length - 1];
        axis.visibleMinimum = null;
        axis.visibleMaximum = null;
        //calculateAxisspace for axis and div
        getLongestLabel(axis)
        calculateAxisSpace(axis);
    }
        //shift to  normal axis
    else {
        axis.numMajorGrid = num - 1;
        setAxisTickMarksByMaxMin(axis, axis.minimum, axis.maximum);
        //calculateAxisspace for axis and div
        getLongestLabel(axis)
        calculateAxisSpace(axis);
    }

}

function updateAxisMergedDataLimit(baseAxis, axesYtoMerge) {
    var minMaxArray = [];
    for (var i = 0; i < axesYtoMerge.length; i++) {
        var axis = axesYtoMerge[i];
        if (isValidNumber(axis.dataMinimum))
            minMaxArray.push(axis.dataMinimum);
        if (isValidNumber(axis.dataMaximum))
            minMaxArray.push(axis.dataMaximum);

    }
    minMaxArray.sort(sortNumber);
    baseAxis.dataMinimumMerged = minMaxArray[0];
    baseAxis.dataMaximumMerged = minMaxArray[minMaxArray.length - 1];
}


//if this axis's lognumber more than others , update all the axis and girdaxis
//if not only update itself
function updateAllWhenSetAxisLog(axis, allAxes, commonProperty, gridAxis) {
    var axisName = axis.name;
    logArray = axisName.substring(axisName.length - 1) == 'Y' ? commonProperty.logArrayY : commonProperty.logArrayX;
    //var gridAxis = selectedJqPlotter.gridLineAxes[1];
    dataMinimum = axis.isMerged ? axis.dataMinimumMerged : axis.dataMinimum;
    dataMaximum = axis.isMerged ? axis.dataMaximumMerged : axis.dataMaximum;
    var axisIndex = axisName.substr(axisName.indexOf('_') + 1, 1);
    var array = getAxislogTickArray(dataMinimum, dataMaximum);
    var tickNum = getlogTickNum(logArray);
    logArray[axisIndex] = array.length;
    if (array.length > tickNum) {
        updateLogGridLines(gridAxis, array.length);
        for (var i = 0; i < allAxes.length; i++) {
            updateAxisTickmark(allAxes[i], array.length);
        }
    }
    else {
        updateAxisTickmark(axis, tickNum);
    }

}

//if this axis's lognumber less than others/equal , only update the axis
//if this axis's lognumber more than others, update all the axis and girdaxis. when this axis is the last log axis, set minor girdline
function updateALLWhenSetAxisNonLog(axis, allAxes, commonProperty, gridAxis) {
    var axisName = axis.name;
    logArray = axisName.substring(axisName.length - 1) == 'Y' ? commonProperty.logArrayY : commonProperty.logArrayX;
    var axisIndex = axisName.substr(axisName.indexOf('_') + 1, 1);
    var num = logArray[axisIndex];
    logArray[axisIndex] = 0;
    var tickNum = getlogTickNum(logArray);
    var minorTickerNum = null;
    if (num <= tickNum) {
        updateAxisTickmark(axis, tickNum);
    }
    else {
        if (tickNum == 0) {
            tickNum = commonProperty.gridYMajor + 1;
            minorTickerNum = commonProperty.gridYMinor;
            //updateLogGridLines(gridAxis, tickNum, minorTickerNum);
        }

        updateLogGridLines(gridAxis, tickNum, minorTickerNum);
        for (var i = 0; i < allAxes.length; i++) {
            updateAxisTickmark(allAxes[i], tickNum);
        }
    }
}

function updateMergedAxesStatus(baseAxis, allAxes, logArray) {
    var curveIndexes = baseAxis.mergedCurveIndexes;
    var mergedAxes = [];
    for (var i = 1; i < curveIndexes.length; i++) {
        var a = getAxisByCurveIndex(curveIndexes[i], baseAxis.isAxisX, allAxes);
        //mergedAxes.push(a);
        var Index = a.name.substr(a.name.indexOf('_') + 1, 1);
        if (a.logarithmic) {
            a.logarithmic = false;
            logArray[Index] = 0;
            a.mouseWheelZoomStep = 0.0007;
        }
        else {
            a.logarithmic = true;
            a.mouseWheelZoomStep = 0;
            var array = getAxislogTickArray(a.dataMinimum, a.dataMaximum);
            //logArray[Index] = array.length;
        }
    }
}


function updateAllAxesWhenFork(baseAxis, allAxes, commonProperty, gridAxis) {
    var axisName = baseAxis.name;
    logArray = axisName.substring(axisName.length - 1) == 'Y' ? commonProperty.logArrayY : commonProperty.logArrayX;
    updateMergedAxesLogArray(baseAxis, allAxes, commonProperty);
    //get the base axis log num, compare with all and update all axis
    //var array = getAxislogTickArray(baseAxis.dataMinimum, baseAxis.dataMaximum);
    var tickNum = getlogTickNum(logArray);

    updateLogGridLines(gridAxis, tickNum);
    for (var i = 0; i < allAxes.length; i++) {
        updateAxisTickmark(allAxes[i], tickNum);
    }
}

function updateMergedAxesLogArray(baseAxis, allAxes, commonProperty) {
    var axisName = baseAxis.name;
    logArray = axisName.substring(axisName.length - 1) == 'Y' ? commonProperty.logArrayY : commonProperty.logArrayX;
    var curveIndexes = baseAxis.mergedCurveIndexes;
    for (var i = 0; i < curveIndexes.length; i++) {
        var a = getAxisByCurveIndex(curveIndexes[i], baseAxis.isAxisX, allAxes);
        var Index = a.name.substr(a.name.indexOf('_') + 1, 1);
        var array = getAxislogTickArray(a.dataMinimum, a.dataMaximum);
        logArray[Index] = array.length;
    }
}

function showMergeAxesErrorDialog(message) {
    var lable = '<span>' + '<b style="color: red"> Error:  </b>' + message + '</span>';
    var dialogContent = $('<div>' + lable + '</div>').css({
        'padding': '10px',
        'textAlign': 'center'
    });
    dialogContent.dialog({
        title: 'Merge Axes',
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            },
        },
        close: function (event, ui) {
            dialogContent.remove();
        }
    });
}