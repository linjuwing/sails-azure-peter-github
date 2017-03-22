var JqPlotter_XYPlotMain = (function () {
    var my = {};

    function getSeriesDataByCurveIndex(curveIndex, seriesDataArray) {
        for (var i = 0; i < seriesDataArray.length; i++) {
            if (seriesDataArray[i].curveIndex == curveIndex)
                return seriesDataArray[i];
        }
        return null;
    }

    function removeSeriesDataFromLeftByTime(series, minimumTimestamp) {
        series.originalXYDataVisibleStartIndex = series.originalXYData.length - series.data.length;
        while (series.data.length > 0) {
            if (series.data[0][CONSTANT.timestampIndex] < minimumTimestamp) {
                series.data.shift();
                series.originalXYDataVisibleStartIndex++;
            }
            else
                break;
        }
    }

    function removeSeriesDataFromLeftByCount(series, visibleCount) {
        var dataCount = series.data.length;
        if (dataCount > visibleCount)
            series.data.splice(0, dataCount - visibleCount - 1);

        series.originalXYDataVisibleStartIndex = series.originalXYData.length - series.data.length;
        return series.data[0][CONSTANT.timestampIndex];
    }

    function handleUpdatedResetBufferItem(item, series) {
        var bResetBuffer = getBoolean(item.value, false);
        if (bResetBuffer) {          //while item.value is true
            for (var i = 0; i < series.length; i++) {
                series[i].originalXYData = [];
                series[i].data = [];
            }
        }
        return bResetBuffer;
    };

    //return series's data array
    function parseSubscriptionElementItems(allItems, jqPlotter) {
        if (!allItems || allItems.length <= 0)
            return [[], (new Date()).getTime()];

        var seriesDataArray = [];
        var latestTimestamp = allItems[0].timestamp;
        jqPlotter.visibleSeries.forEach(function (series) {
            var seriesData = {
                curveIndex: series.curveIndex,
                xyTimeData: [],
            };
            seriesDataArray.push(seriesData);
        });

        var bResetBuffer = false;
        allItems.forEach(function (item) {
            var itemProperty = jqPlotter.itemProperties[item.index];
            if (!isValidObject(itemProperty) || !itemProperty.enabled)      //filter the valid item
                return;

            item.timestamp = parseInt(item.timestamp);

            //caculate value based on valexpression
            var parsedVal = item.value;
            if (item.property.toString().indexOf("__", 0) == -1)
                parsedVal = CommonFunction.parseValueByExpression(item.value, itemProperty.valExpression);

            //handle datetime based on time zone
            item.date = getDateTimeByTimeOffset(item.timestamp, jqPlotter.commonProperty.timeOffset);

            var seriesData = null;
            switch (itemProperty.itemType) {
                case CONSTANT.jqPlotterItemTypes.curve:
                    item.value = parseFloat(parsedVal);
                    seriesData = getSeriesDataByCurveIndex(itemProperty.curveIndex, seriesDataArray);
                    break;
                case CONSTANT.jqPlotterItemTypes.rangeLoY:
                case CONSTANT.jqPlotterItemTypes.rangeHiY:
                case CONSTANT.jqPlotterItemTypes.rangeLoX:
                case CONSTANT.jqPlotterItemTypes.rangeHiX:
                    item.value = parseFloat(parsedVal);
                    JqPlotter_Main.handleUpdatedRangeLoItem(item, itemProperty, jqPlotter);
                    break;
                case CONSTANT.jqPlotterItemTypes.timeReference:
                    break;
                case CONSTANT.jqPlotterItemTypes.resetBuffer:
                    bResetBuffer = handleUpdatedResetBufferItem(item, jqPlotter.visibleSeries);
                    break;
                case CONSTANT.jqPlotterItemTypes.visibleDataPoint:
                    item.value = parseFloat(parsedVal);
                    JqPlotter_Main.handleVisibleDataPointItem(item, jqPlotter.commonProperty);
                    break;
                case CONSTANT.jqPlotterItemTypes.orientation:
                    series = getCurveSeriesByCurveIndex(itemProperty.curveIndex, jqPlotter.visibleSeries);
                    series.currentPointAngle = parseFloat(parsedVal);
                default:
                    break;
            }

            if (!seriesData)
                return;

            var curveProperty = getCurvePropertyByCurveIndex(seriesData.curveIndex, jqPlotter.curveProperties);

            var hasData = false;
            for (var i = 0; i < seriesData.xyTimeData.length; i++) {        //find the existed xyTimeData, and set the data to the past
                var dataPoint = seriesData.xyTimeData[i];

                //find the datapoint with the same timestamp
                if (dataPoint[CONSTANT.timestampIndex] == item.timestamp) {
                    if (itemProperty.itemXorY == "X") {     //if the item is "X", then put into the first one of data point vector
                        dataPoint[CONSTANT.xIndex] = item.value;
                    } else {
                        dataPoint[CONSTANT.yIndex] = item.value;
                    }

                    //handle quality
                    if (curveProperty.badSymbols && ((item.quality & 192) == 0)) {
                        dataPoint[CONSTANT.qualityIndex] = item.quality;
                        //dataPoint[CONSTANT.markerTypeIndex] = 'image';
                        //dataPoint[CONSTANT.imageIndex] = window.pageProperty.badSymbolImageUrl;
                        dataPoint[CONSTANT.markerTypeIndex] = 'crossCircle';
                        dataPoint[CONSTANT.imageIndex] = 5;
                    }

                    //caculate latest timestamp
                    if (item.timestamp > latestTimestamp)
                        latestTimestamp = item.timestamp;

                    hasData = true;
                }
            }

            if (!hasData) {
                if (curveProperty.badSymbols && ((item.quality & 192) == 0)){
                    dataPoint[CONSTANT.markerTypeIndex] = 'crossCircle';
                    dataPoint[CONSTANT.imageIndex] = 5;
                }

                if (itemProperty.itemXorY == "X") {
                    dataPoint = [item.value, null];  //, badSymbolImage, item.timestamp, item.quality];
                } else {
                    dataPoint = [null, item.value];  //, badSymbolImage, item.timestamp, item.quality];
                }

                dataPoint[CONSTANT.timestampIndex] = item.timestamp;
                dataPoint[CONSTANT.qualityIndex] = item.quality;
                seriesData.xyTimeData.push(dataPoint);      //if there is not, push new one to data
            }
        });     //allItems.forEach

        if (bResetBuffer)
            seriesDataArray = [];

        seriesDataArray.forEach(function (seriesData) {
            seriesData.xyTimeData.sort(function (a, b) {
                return a[CONSTANT.timestampIndex] - b[CONSTANT.timestampIndex];
            });
        });

        return [seriesDataArray, latestTimestamp];
    }

    my.daUpdate = function (allItems, jqPlotter) {
        //build a data array to store curve data
        var result = parseSubscriptionElementItems(allItems, jqPlotter);
        if (!result)
            return;

        var seriesDataArray = result[0];
        var latestTimestamp = result[1];
        var firstTimestamp = null;

        var minResolution = 0;
        var visibleDataPointStartTimestamp = 0;

        jqPlotter.visibleSeries.forEach(function (series) {
            var xAxis = getAxisByCurveIndex(series.curveIndex, true, jqPlotter.allAxesX);
            var yAxis = getAxisByCurveIndex(series.curveIndex, false, jqPlotter.allAxesY);

            //get series data from parsing array
            var updatedSeriesData = getSeriesDataByCurveIndex(series.curveIndex, seriesDataArray);

            if (updatedSeriesData) {
                //add each new data to series' original and visible data
                updatedSeriesData.xyTimeData.forEach(function (dataPoint) {
                    if (dataPoint[CONSTANT.timestampIndex] != null) {
                        //if there is some null data, then set the value equel with the previous one.
                        if (series.originalXYData.length > 0) {
                            if (dataPoint[CONSTANT.xIndex] == null)
                                dataPoint[CONSTANT.xIndex] = series.originalXYData[series.originalXYData.length - 1][CONSTANT.xIndex];
                            if (dataPoint[CONSTANT.yIndex] == null)
                                dataPoint[CONSTANT.yIndex] = series.originalXYData[series.originalXYData.length - 1][CONSTANT.yIndex];
                        }

                        //whatever, add datapoint to originalData
                        series.originalXYData.push(dataPoint);
                        //set axis range
                        valueAxisCalculateMinMax(xAxis, dataPoint[CONSTANT.xIndex]);
                        valueAxisCalculateMinMax(yAxis, dataPoint[CONSTANT.yIndex]);

                        //control the series original data by ringBufferSize
                        if (series.originalXYData.length > jqPlotter.commonProperty.ringBufferSize) {
                            series.originalXYData.shift();
                            if (series.originalXYDataVisibleStartIndex > -1)
                                series.originalXYDataVisibleStartIndex--;
                        }

                        //if the scroll bar is at end
                        if (jqPlotter.timeSliderAxis.scrollbarAtEnd &&
                            (jqPlotter.commonProperty.showAllData
                            || jqPlotter.commonProperty.visibleDataPointCount > 0
                            || dataPoint[CONSTANT.timestampIndex] >= latestTimestamp - jqPlotter.timeSliderAxis.initialTimespan)) {

                                //push data to series
                                series.data.push(dataPoint);

                                //if we add the data to visible series, then, the index is added
                                series.originalXYDataVisibleStartIndex = series.originalXYData.length - series.data.length;    
                        }
                    }
                });

                //after new data adding, if scroll at end
                if (jqPlotter.timeSliderAxis.scrollbarAtEnd && updatedSeriesData.xyTimeData.length > 0) {
                    // send item NewValue event so the corresponding legend item can also update its value and quality
                    var latestDataPoint = updatedSeriesData.xyTimeData[updatedSeriesData.xyTimeData.length - 1];
                    var ee = window.pageProperty.eventEmitter;
                    var itemChangedEventNameX = jqPlotter.commonProperty.elementId + "_" + series.itemTagX + "_NewValue";
                    ee.emitEvent(itemChangedEventNameX, [latestDataPoint[CONSTANT.xIndex], latestDataPoint[CONSTANT.qualityIndex]]);
                    var itemChangedEventNameY = jqPlotter.commonProperty.elementId + "_" + series.itemTagY + "_NewValue";
                    ee.emitEvent(itemChangedEventNameY, [latestDataPoint[CONSTANT.yIndex], latestDataPoint[CONSTANT.qualityIndex]]);

                    //caculate the resolution
                    var seriesData = series.data;
                    if (seriesData.length > 1) {
                        curveResolution = seriesData[seriesData.length - 1][CONSTANT.timestampIndex] - seriesData[seriesData.length - 2][CONSTANT.timestampIndex];
                        if (!minResolution || curveResolution < minResolution)
                            minResolution = curveResolution;
                    }
                }
            }

            //remove old data not in visible bar timespan
            if (jqPlotter.timeSliderAxis.scrollbarAtEnd) {
                if (jqPlotter.commonProperty.showAllData) {
                    series.originalXYDataVisibleStartIndex = 0;

                    if (!visibleDataPointStartTimestamp || visibleDataPointStartTimestamp < series.originalXYData[0][CONSTANT.timestampIndex])
                        visibleDataPointStartTimestamp = series.originalXYData[0][CONSTANT.timestampIndex];
                }
                else if (jqPlotter.commonProperty.visibleDataPointCount > 0) {       //if visible datapoint is setted
                    //var minimumTimestamp = removeSeriesDataFromLeftByCount(series, jqPlotter.commonProperty.visibleDataPointCount);
                    //if (minimumTimestamp > visibleDataPointTimestamp)
                    //    visibleDataPointTimestamp = minimumTimestamp;

                    var visibleStartIndex = series.originalXYData.length - jqPlotter.commonProperty.visibleDataPointCount;
                    if (visibleStartIndex < 0)        //if older than 0
                        visibleStartIndex = 0;

                    //find the newst start timetamp
                    if (!visibleDataPointStartTimestamp || visibleDataPointStartTimestamp < series.originalXYData[visibleStartIndex][CONSTANT.timestampIndex])
                        visibleDataPointStartTimestamp = series.originalXYData[visibleStartIndex][CONSTANT.timestampIndex];
                } else {            //have timespan's common update
                    removeSeriesDataFromLeftByTime(series, latestTimestamp - jqPlotter.timeSliderAxis.initialTimespan);
                }
            }

            //calculate original series' first time stamp
            if (series.originalXYData.length > 0) {
                if (!firstTimestamp)
                    firstTimestamp = series.originalXYData[0][CONSTANT.timestampIndex];
                else
                    if (series.originalXYData[0][CONSTANT.timestampIndex] < firstTimestamp)
                        firstTimeStamp = series.originalXYData[0][CONSTANT.timestampIndex];
            }
        });

        //update total timeaxis by latest timestamp
        updateTimeSliderBarAxisRange(jqPlotter.timeSliderAxis, firstTimestamp, latestTimestamp);

        //update time slider bar visible range, from drag to end
        if (jqPlotter.timeSliderAxis.scrollbarAtEnd) {
            if (jqPlotter.commonProperty.showAllData) {     //show all data
                //update visible maxim minimum
                jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.maximum;
                jqPlotter.timeSliderAxis.visibleMinimum = visibleDataPointStartTimestamp;

                //time span is changed
                updateTimespan(jqPlotter.timeSliderAxis.visibleMaximum - jqPlotter.timeSliderAxis.visibleMinimum, jqPlotter.timeSliderAxis, jqPlotter.commonProperty);
            }
            else if (jqPlotter.commonProperty.visibleDataPointCount > 0 && visibleDataPointStartTimestamp) {
                //update visible maxim minimum
                jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.maximum;
                jqPlotter.timeSliderAxis.visibleMinimum = visibleDataPointStartTimestamp;

                //time span is changed
                updateTimespan(jqPlotter.timeSliderAxis.visibleMaximum - jqPlotter.timeSliderAxis.visibleMinimum, jqPlotter.timeSliderAxis, jqPlotter.commonProperty);

                //add or remove data from begin
                jqPlotter.visibleSeries.forEach(function (series) {
                    if (jqPlotter.timeSliderAxis.visibleMinimum > jqPlotter.timeSliderAxis.dataMinimum)
                        removeSeriesDataFromLeftByTime(series, jqPlotter.timeSliderAxis.visibleMinimum);
                });
            }
            else {      //there is no visible data point
                jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.maximum;
                jqPlotter.timeSliderAxis.visibleMinimum = jqPlotter.timeSliderAxis.maximum - jqPlotter.timeSliderAxis.initialTimespan;
            }

            //update reference min&max
            jqPlotter.timeSliderAxis.dataMaximum = jqPlotter.timeSliderAxis.visibleMaximum;
            jqPlotter.timeSliderAxis.dataMinimum = jqPlotter.timeSliderAxis.visibleMinimum;

            //update end time stamp
            JqPlotter_InfoBar.updateEndTimestamp(jqPlotter.timeSliderAxis.maximum, jqPlotter.commonProperty);

            //update resolution
            if (!jqPlotter.commonProperty.rulerOn)
                JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);

            //handle current Point
            updateArrowStatusAndPosition(jqPlotter);
        }

        //common update, update minimum
        if (!jqPlotter.commonProperty.showAllData && jqPlotter.commonProperty.visibleDataPointCount <= 0) {
            //if first timestamp is moving to right, meaning first datapoint is removed
            if (jqPlotter.timeSliderAxis.minimum > jqPlotter.timeSliderAxis.visibleMinimum) {
                if (jqPlotter.timeSliderAxis.visibleMinimum + jqPlotter.timeSliderAxis.initialTimespan < jqPlotter.timeSliderAxis.maximum) {
                    jqPlotter.timeSliderAxis.visibleMinimum = jqPlotter.timeSliderAxis.minimum;
                    jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.visibleMinimum + jqPlotter.timeSliderAxis.initialTimespan;
                    JqPlotter_InfoBar.updateEndTimestamp(jqPlotter.timeSliderAxis.visibleMaximum, jqPlotter.commonProperty);
                }
                else
                    jqPlotter.timeSliderAxis.minimum = jqPlotter.timeSliderAxis.visibleMinimum;
            }
        }

        //update value axes's range
        if (jqPlotter.timeSliderAxis.scrollbarAtEnd && !jqPlotter.commonProperty.isZooming) {
            updateValueAxes(jqPlotter.allAxesX);
            updateValueAxes(jqPlotter.allAxesY);
        }

        //update ruler position
        JqPlotter_Ruler.updateRulerLinePosFordaUpdate(jqPlotter);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
        updateGridAreaPosition(jqPlotter.commonProperty.elementId);
    };

    my.handleTimeSliderAxisEvent = function (axisSource, jqPlotter) {
        var actualMinimum = axisSource.actualVisibleMinimum;
        if ((axisSource.actualVisibleMaximum - axisSource.actualVisibleMinimum) == jqPlotter.timeSliderAxis.timespan) {       //make sure it is not zoom in/out
            jqPlotter.visibleSeries.forEach(function (series) {
                //if move to left
                if (axisSource.actualVisibleMaximum < jqPlotter.timeSliderAxis.dataMaximum) {
                    //add the data from original data, whose timestamp is bigger than axisSource.actualVisibleMinimum, to visible series
                    while (series.originalXYDataVisibleStartIndex > 0) {
                        if (series.originalXYData[series.originalXYDataVisibleStartIndex - 1][CONSTANT.timestampIndex] >= actualMinimum) {
                            series.data.unshift(series.originalXYData[series.originalXYDataVisibleStartIndex - 1]);
                            series.originalXYDataVisibleStartIndex--;
                        } else {
                            break;
                        }
                    }

                    //remove the end data from series, whose timestamp is larger than axisSource.actualVisibleMaximum
                    var i = series.data.length - 1;
                    while (i >= 0) {
                        if (series.data[i][CONSTANT.timestampIndex] > axisSource.actualVisibleMaximum) {
                            series.data.pop();
                            i--;
                        } else
                            break;
                    }

                } else if (axisSource.actualVisibleMaximum > jqPlotter.timeSliderAxis.dataMaximum) {        //if move to right
                    visibleEndNextIndex = series.originalXYDataVisibleStartIndex + series.data.length;

                    //add the data from original data to right, whose timestamp is smaller than axisSource.actualVisibleMaximum
                    while (visibleEndNextIndex < series.originalXYData.length) {
                        if (series.originalXYData[visibleEndNextIndex][CONSTANT.timestampIndex] <= axisSource.actualVisibleMaximum) {
                            series.data.push(series.originalXYData[visibleEndNextIndex]);
                            visibleEndNextIndex++;
                        } else {
                            break;
                        }
                    }

                    //remove the front data from series, whose timestamp is smaller than axisSource.visibleMinimum
                    while (series.data.length > 0) {
                        if (series.data[0][CONSTANT.timestampIndex] < axisSource.actualVisibleMinimum) {
                            series.data.shift();
                            series.originalXYDataVisibleStartIndex++;
                        }
                        else
                            break;
                    }
                }

                //update infor and legend
                if (!jqPlotter.commonProperty.rulerOn) {
                    if (series.data.length > 0){
                        JqPlotter_Ruler.updateRulerValueToLegend(series, series.data.length - 1, jqPlotter);
                    }
                }
            });

            jqPlotter.timeSliderAxis.dataMaximum = axisSource.actualVisibleMaximum;
            jqPlotter.timeSliderAxis.dataMinimum = axisSource.actualVisibleMinimum;

            if (axisSource.actualVisibleMaximum < jqPlotter.timeSliderAxis.maximum)
                jqPlotter.timeSliderAxis.scrollbarAtEnd = false;
            else 
                jqPlotter.timeSliderAxis.scrollbarAtEnd = true;
 
            if (!jqPlotter.timeSliderAxis.scrollbarAtEnd) {
                jqPlotter.visibleSeries.forEach(function (series) {
                    clearPointMarkersOfSeries(series.originalXYData, series.currentPointIndex);
                });
            }

            JqPlotter_InfoBar.updateEndTimestamp(jqPlotter.timeSliderAxis.visibleMaximum, jqPlotter.commonProperty);

            $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
        }
    }
    
    function updateTimeSliderBarAxisRange (timeSliderAxis, firstTimestamp, latestTime) {
        if (!latestTime)
            latestTime = new Date().getTime();
        if (!firstTimestamp)
            firstTimestamp = latestTime - 1;

        firstTimestamp = parseInt(firstTimestamp);
        if (firstTimestamp != timeSliderAxis.minimum)
            timeSliderAxis.minimum = firstTimestamp;

        latestTime = parseInt(latestTime);
        if (latestTime != timeSliderAxis.maximum)
            timeSliderAxis.maximum = latestTime;

        timeSliderAxis.seriesFirstTimestamp = firstTimestamp;
        timeSliderAxis.seriesLastTimestamp = latestTime;
    }

    function updateTimespan(timespan, timeSliderAxis, commonProperty) {
        timeSliderAxis.timespan = timespan;
        timeSliderAxis.initialTimespan = timespan;
        commonProperty.initialTimespan = timespan;

        if (timeSliderAxis.visibleMaximum < timeSliderAxis.maximum)
            timeSliderAxis.scrollbarAtEnd = false;
        else
            timeSliderAxis.scrollbarAtEnd = true;

        JqPlotter_InfoBar.updateTimespanOnInfoBar(timeSliderAxis.timespan, commonProperty);
    }

    my.setTimespanInRuntimeForXYPlot = function (timespan, visibleDataPoint, jqPlotter) {
        var timeSliderAxis = jqPlotter.timeSliderAxis;

        if (timespan == 0) {
            jqPlotter.commonProperty.showAllData = true;
            jqPlotter.commonProperty.visibleDataPointCount = -1;

            timeSliderAxis.maximum = timeSliderAxis.seriesLastTimestamp;
            timeSliderAxis.minimum = timeSliderAxis.seriesFirstTimestamp;
            timeSliderAxis.visibleMaximum = timeSliderAxis.maximum;
            timeSliderAxis.visibleMinimum = timeSliderAxis.minimum;
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
        else if (visibleDataPoint > 0) {
            jqPlotter.commonProperty.showAllData = false;
            jqPlotter.commonProperty.visibleDataPointCount = visibleDataPoint;

            var visibleDataPointTimespan;
            jqPlotter.visibleSeries.forEach(function (series) {
                var visibleEndIndex = series.originalXYDataVisibleStartIndex + series.data.length - 1;
                var visibleStartIndex = visibleEndIndex - visibleDataPoint + 1;
                if (visibleStartIndex < 0) {
                    visibleStartIndex = 0;
                    visibleEndIndex = visibleDataPoint - 1;
                }
                if (visibleEndIndex > series.originalXYData.length - 1)
                    visibleEndIndex = series.originalXYData.length - 1;
                var visibleStartTimestamp = series.originalXYData[visibleStartIndex][CONSTANT.timestampIndex];
                var visibleEndTimestamp = series.originalXYData[visibleEndIndex][CONSTANT.timestampIndex];
                //find the smallest timespan
                if (!visibleDataPointTimespan || (visibleDataPointTimespan > visibleEndTimestamp - visibleStartTimestamp)) {
                    visibleDataPointTimespan = visibleEndTimestamp - visibleStartTimestamp;
                    timeSliderAxis.visibleMaximum = visibleEndTimestamp;
                    timeSliderAxis.visibleMinimum = visibleStartTimestamp;
                }
            });
        }
        else
            return;

        if (!jqPlotter.commonProperty.showAllData) {
            jqPlotter.visibleSeries.forEach(function (series) {
                if (timeSliderAxis.visibleMinimum < timeSliderAxis.dataMinimum) {
                    //add the data from original data, whose timestamp is bigger than axisSource.actualVisibleMinimum, to visible series
                    while (series.originalXYDataVisibleStartIndex > 0) {
                        if (series.originalXYData[series.originalXYDataVisibleStartIndex - 1][CONSTANT.timestampIndex] >= timeSliderAxis.visibleMinimum) {
                            series.data.unshift(series.originalXYData[series.originalXYDataVisibleStartIndex - 1]);
                            series.originalXYDataVisibleStartIndex--;
                        } else {
                            break;
                        }
                    }
                } else {
                    //remove the front data from series, whose timestamp is smaller than axisSource.visibleMinimum
                    while (series.data.length > 0) {
                        if (series.data[0][CONSTANT.timestampIndex] < timeSliderAxis.visibleMinimum) {
                            series.data.shift();
                            series.originalXYDataVisibleStartIndex++;
                        }
                        else
                            break;
                    }
                }

                if (timeSliderAxis.visibleMaximum > timeSliderAxis.dataMaximum) {        //if move to right
                    visibleEndNextIndex = series.originalXYDataVisibleStartIndex + series.data.length;

                    //add the data from original data to right, whose timestamp is smaller than axisSource.actualVisibleMaximum
                    while (visibleEndNextIndex < series.originalXYData.length) {
                        if (series.originalXYData[visibleEndNextIndex][CONSTANT.timestampIndex] <= timeSliderAxis.visibleMaximum) {
                            series.data.push(series.originalXYData[visibleEndNextIndex]);
                            visibleEndNextIndex++;
                        } else {
                            break;
                        }
                    }
                }
                else {
                    //remove the end data from series, whose timestamp is larger than timeSliderAxis.visibleMaximum
                    var i = series.data.length - 1;
                    while (i >= 0) {
                        if (series.data[i][CONSTANT.timestampIndex] > timeSliderAxis.visibleMaximum) {
                            series.data.pop();
                            i--;
                        } else
                            break;
                    }
                }

                if (!jqPlotter.commonProperty.rulerOn && series.data.length > 0)
                    JqPlotter_Ruler.updateRulerValueToLegend(series, series.data.length - 1, jqPlotter);
            });
        }

        timeSliderAxis.dataMaximum = timeSliderAxis.visibleMaximum;
        timeSliderAxis.dataMinimum = timeSliderAxis.visibleMinimum;

        //update time span to configuration
        updateTimespan(timeSliderAxis.visibleMaximum - timeSliderAxis.visibleMinimum, timeSliderAxis, jqPlotter.commonProperty);

        //update end timestamp
        JqPlotter_InfoBar.updateEndTimestamp(timeSliderAxis.visibleMaximum, jqPlotter.commonProperty);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    ////////////////////////////////////////////////////////////
    //Below is code for vector
    my.daUpdateForOneVectorOnly = function (allItems, jqPlotter) {
        var dataPoints = getPointFromVector(allItems, jqPlotter);
        dataPointsNullValueAutoFill(dataPoints, jqPlotter.visibleSeries);
        processItemFunctionForOneVectorOnly(allItems, jqPlotter);
        var latestTimestamp = allItems[allItems.length - 1].timestamp;

        var firstTimestamp = null;
        for (var i = 0; i < jqPlotter.visibleSeries.length; i++) {
            var xAxis = getAxisByCurveIndex(jqPlotter.visibleSeries[i].curveIndex, true, jqPlotter.allAxesX);
            var yAxis = getAxisByCurveIndex(jqPlotter.visibleSeries[i].curveIndex, false, jqPlotter.allAxesY);

            for (var j = 0; j < dataPoints.length; j++) {
                if (jqPlotter.visibleSeries[i].curveIndex == dataPoints[j].curveIndex) {
                    jqPlotter.visibleSeries[i].vectorDataPoints.push(dataPoints[j]);
                }
            }
            if (jqPlotter.timeSliderAxis.scrollbarAtEnd) {
                //jqPlotter.visibleSeries[i].data = [];
                if (jqPlotter.visibleSeries[i].vectorDataPoints.length > 0)
                    jqPlotter.visibleSeries[i].data = parseVectorDataPointToDisplayDataPoint(jqPlotter.visibleSeries[i].vectorDataPoints[jqPlotter.visibleSeries[i].vectorDataPoints.length - 1]);

                for (var k = 0; k < jqPlotter.visibleSeries[i].data.length; k++) {
                    valueAxisCalculateMinMax(xAxis, jqPlotter.visibleSeries[i].data[k][0]);
                    valueAxisCalculateMinMax(yAxis, jqPlotter.visibleSeries[i].data[k][1]);
                }
            }
            if (!firstTimestamp)
                firstTimestamp = jqPlotter.visibleSeries[i].vectorDataPoints[0].timestamp;
            else
                if (jqPlotter.visibleSeries[i].vectorDataPoints[0].timestamp < firstTimestamp)
                    firstTimeStamp = jqPlotter.visibleSeries[i].vectorDataPoints[0].timestamp;
        }

        updateTimeSliderBarAxisRange(jqPlotter.timeSliderAxis, firstTimestamp, latestTimestamp);

        if (jqPlotter.timeSliderAxis.visibleMaximum == undefined) {
            jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.maximum;
        }
        if (jqPlotter.timeSliderAxis.scrollbarAtEnd) {
            jqPlotter.timeSliderAxis.visibleMaximum = parseInt(latestTimestamp);
            jqPlotter.timeSliderAxis.visibleMinimum = jqPlotter.timeSliderAxis.visibleMaximum - jqPlotter.timeSliderAxis.timespan;
            jqPlotter.timeSliderAxis.dataMaximum = jqPlotter.timeSliderAxis.visibleMaximum;
            jqPlotter.timeSliderAxis.dataMinimum = jqPlotter.timeSliderAxis.visibleMinimum;
            jqPlotter.timeSliderAxis.timespan = 1;

            //update end time stamp
            JqPlotter_InfoBar.updateEndTimestamp(jqPlotter.timeSliderAxis.maximum, jqPlotter.commonProperty);
        }

        if (jqPlotter.timeSliderAxis.scrollbarAtEnd && !jqPlotter.commonProperty.isZooming) {
            updateValueAxes(jqPlotter.allAxesX);
            updateValueAxes(jqPlotter.allAxesY);
            updateLegendForOneVectorOnly(allItems, jqPlotter);
        }

        //update ruler position
        JqPlotter_Ruler.updateRulerLinePosFordaUpdate(jqPlotter);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
        updateGridAreaPosition(jqPlotter.commonProperty.elementId);
    }

    function PointForVector(x, y) {
        this.x = x;
        this.y = y;
    };

    function VectorDataPoint(points, timestamp, curveIndex) {
        this.points = points;
        this.timestamp = timestamp;
        this.curveIndex = curveIndex;
    };

    function dataPointsNullValueAutoFill(dataPoints, series) {
        //if dataPoint have null value fill this value by latest historical value
        // if there is no historical value to fill use 0 to fill the null value
        for (var i = 0; i < dataPoints.length; i++) {
            for (var j = 0; j < dataPoints[i].points.length; j++) {
                if (dataPoints[i].points[j].x == null) {
                    dataPoints[i].points[j].x = getLatestValue(true, dataPoints[i].curveIndex, j, series);
                }
                if (dataPoints[i].points[j].y == null) {
                    dataPoints[i].points[j].y = getLatestValue(false, dataPoints[i].curveIndex, j, series);
                }
            }
        }
    }

    function getLatestValue(isX, curveIndex, pointIndex, series) {
        if (isX) {
            for (var i = 0; i < series.length; i++) {
                if (series[i].curveIndex == curveIndex) {
                    for (j = series[i].vectorDataPoints.length - 1; j >= 0 ; j--) {
                        if (series[i].vectorDataPoints[j].points.length > pointIndex) {
                            if (series[i].vectorDataPoints[j].points[pointIndex].x != null)
                                return series[i].vectorDataPoints[j].points[pointIndex].x;
                        }
                    }

                }
            }
        }
        else {
            for (var i = 0; i < series.length; i++) {
                if (series[i].curveIndex == curveIndex) {
                    for (j = series[i].vectorDataPoints.length - 1; j >= 0 ; j--) {
                        if (series[i].vectorDataPoints[j].points.length > pointIndex) {
                            if (series[i].vectorDataPoints[j].points[pointIndex].y != null)
                                return series[i].vectorDataPoints[j].points[pointIndex].y;
                        }

                    }
                }
            }
        }
        return 0;
    }

    function parseVectorDataPointToDisplayDataPoint(vectorDataPoint) {
        displayPoints = new Array();
        for (var i = 0; i < vectorDataPoint.points.length; i++) {
            displayPoint = new Array(3);
            displayPoint[CONSTANT.xIndex] = vectorDataPoint.points[i].x;
            displayPoint[CONSTANT.yIndex] = vectorDataPoint.points[i].y;
            displayPoint[CONSTANT.timestampIndex] = vectorDataPoint.timestamp;
            displayPoints.push(displayPoint);
        }
        return displayPoints;
    }

    function parseSubscriptionElementItemsForVector(allItems, jqPlotter) {
        var seriesVectorDataArray = [];
        var latestTimestamp = allItems[0].timestamp;
        jqPlotter.visibleSeries.forEach(function (series) {
            var seriesData = {
                curveIndex: series.curveIndex,
                xyVectorTimeData: [],
            };
            seriesVectorDataArray.push(seriesData);
        });

        allItems.forEach(function (item) {
            var itemProperty = jqPlotter.itemProperties[item.index];
            if (!isValidObject(itemProperty) || !itemProperty.enabled)      //filter the valid item
                return;
        });
 
        return seriesVectorDataArray;
    }

    function getPointFromVector(allItems, jqPlotter) {
        //dimension
        //assume allItem is sorted by timestamp
        var vectorDataPoints = new Array();
        var mpPairedIndex = new MyMap(); // used to mark if the datapoint has been processed
        for (var i = 0; i < allItems.length; i++) {
            var itemProperty = jqPlotter.itemProperties[allItems[i].index];
            //if (itemProperty.itemXorY == 'X') {
            if (mpPairedIndex.get(i) != undefined || itemProperty.curveIndex == -1)
                continue;
            var pairedIndex = findPairedVectorPoint(allItems[i], allItems, jqPlotter);
            var vectorPoints = new Array();
            if (pairedIndex == -1) {
                var xoryCoordinates = parseSignalPoint(allItems[i].value);

                for (var j = 0; j < xoryCoordinates.length; j++) {
                    var pfv;
                    if (itemProperty.itemXorY == 'X') {
                        pfv = new PointForVector(xoryCoordinates[j], null);
                    }
                    else {
                        pfv = new PointForVector(null, xoryCoordinates[j]);
                    }
                    vectorPoints.push(pfv);
                }
                vectorDataPoints.push(new VectorDataPoint(vectorPoints, allItems[i].timestamp, itemProperty.curveIndex));
            }
            else {
                if (mpPairedIndex.get(pairedIndex) == undefined) {
                    if (allItems[pairedIndex].timestamp == allItems[i].timestamp) {
                        mpPairedIndex.set(pairedIndex, true);
                        mpPairedIndex.set(i, true);
                    }
                    var xCoordinates = parseSignalPoint(allItems[i].value);
                    var yCoordinates = parseSignalPoint(allItems[pairedIndex].value);
                    var maxLen = xCoordinates.length;
                    if (yCoordinates.length > maxLen)
                        maxLen = yCoordinates.length;
                    var x;
                    var y;
                    for (var j = 0; j < maxLen; j++) {
                        x = 0;
                        y = 0;
                        if (xCoordinates[j] != undefined)
                            x = xCoordinates[j];
                        if (yCoordinates[j] != undefined)
                            y = yCoordinates[j];
                        if (itemProperty.itemXorY == 'X') {
                            var pfv = new PointForVector(x, y);
                        }
                        else {
                            var pfv = new PointForVector(y, x);
                        }
                        vectorPoints.push(pfv);
                    }
                    vectorDataPoints.push(new VectorDataPoint(vectorPoints, allItems[i].timestamp, itemProperty.curveIndex));
                }
            }
            //}
            //else {//'Y'
            //    ;
            //}
        }
        return vectorDataPoints;
    }

    function findPairedVectorPoint(desItem, items, jqPlotter) {
        //assume allItem is sorted by timestamp
        // this function is used to find the corresponding coordinate from the corresponding axis (x->y; y->x)
        var itemProperty = jqPlotter.itemProperties[desItem.index];
        var lastIndex = -1;
        if (itemProperty.itemXorY == 'X') {
            for (var i = 0; i < items.length; i++) {
                if (jqPlotter.itemProperties[items[i].index].itemXorY == 'Y' && jqPlotter.itemProperties[items[i].index].curveIndex == itemProperty.curveIndex) {
                    if (desItem.timestamp == items[i].timestamp) {
                        return i;
                    }
                    if (desItem.timestamp < items[i].timestamp) {
                        if (lastIndex != -1)
                            return lastIndex;
                        else
                            return i;
                    }
                    lastIndex = i;
                }
            }
        }
        else {
            for (var i = 0; i < items.length; i++) {
                if (jqPlotter.itemProperties[items[i].index].itemXorY == 'X' && jqPlotter.itemProperties[items[i].index].curveIndex == itemProperty.curveIndex) {
                    if (desItem.timestamp == items[i].timestamp) {
                        return i;
                    }
                    if (desItem.timestamp < items[i].timestamp) {
                        if (lastIndex != -1)
                            return lastIndex;
                        else
                            return i;
                    }
                    lastIndex = i;
                }
            }
        }
        return lastIndex;
    }

    function parseSignalPoint(val) {
        var points = new Array();
        //val dataformat "val1;val2;val3;...valn;"
        var lastIndex = 0;
        do {
            var index = val.indexOf(';', lastIndex);
            if (index != -1) {
                points.push(parseFloat(val.substring(lastIndex, index)));
                lastIndex = index + 1;
            }
            else {
                break;
            }
        } while (lastIndex < val.length);
        return points;
    }

    function searchVectorPointInRange(vectors, timestamp, indexBegin, indexEnd) {
        if (indexBegin < 0)
            indexBegin = 0;
        if (indexEnd > vectors.length - 1)
            indexEnd = vectors.length - 1;
        var h = indexEnd,
            l = indexBegin;
        while (l <= h) {
            var m = Math.floor((h + l) / 2);
            if (vectors[m].timestamp == timestamp) {
                return m;
            }
            if (timestamp > vectors[m].timestamp) {
                l = m + 1;
            } else {
                h = m - 1;
            }
        }
        if (l >= indexEnd)
            l = indexEnd;
        return l;
    }

    function searchVectorPoint(vectors, timestamp) {
        return searchVectorPointInRange(vectors, timestamp, 0, vectors.length - 1);
    }

    my.handleTimeSliderAxisEventForOneVectorOnly = function (axisSource, o) {
        //translate original vector data point to pattern that .data needs
        o.visibleSeries.forEach(function (series) {
            //series.vectorDataPoints;
            var index = searchVectorPoint(series.vectorDataPoints, axisSource.actualVisibleMaximum);
            series.data = parseVectorDataPointToDisplayDataPoint(series.vectorDataPoints[index]);
        });
        if (axisSource.actualVisibleMaximum < o.timeSliderAxis.maximum) {
            o.timeSliderAxis.scrollbarAtEnd = false;
        } else {
            o.timeSliderAxis.scrollbarAtEnd = true;
        }
        if (o.timeSliderAxis.scrollbarAtEnd) //one more condition that if the timeslider bar is at end
            JqPlotter_InfoBar.updateEndTimestamp(o.timeSliderAxis.maximum, o.commonProperty);
        $("#" + o.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    function updateLegendForOneVectorOnly(allItems, jqPlotter) {
        if (!allItems || allItems.length <= 0)
            return;

        allItems.forEach(function (item) {
            var itemProperty = jqPlotter.itemProperties[item.index];
            if (!isValidObject(itemProperty) || !itemProperty.enabled)      //filter the valid item
                return;

            //caculate value based on valexpression
            var signalpoints = parseSignalPoint(item.value);
            if (signalpoints.length > 0) {
                var parsedVal = signalpoints[0]; //signalpoints[signalpoints.length - 1];
                if (item.property.toString().indexOf("__", 0) == -1)
                    parsedVal = CommonFunction.parseValueByExpression(item.value, itemProperty.valExpression);

                //handle datetime based on time zone
                item.date = getDateTimeByTimeOffset(item.timestamp, jqPlotter.commonProperty.timeOffset);

                var seriesData = null;
                if (itemProperty.itemType == CONSTANT.jqPlotterItemTypes.curve) {
                    item.value = parseFloat(parsedVal);

                    // send item NewValue event so the corresponding legend item can also update its value and quality
                    var ee = window.pageProperty.eventEmitter;
                    var itemChangedEventName = jqPlotter.commonProperty.elementId + "_" + item.property + "_NewValue";
                    ee.emitEvent(itemChangedEventName, [item.value, item.quality]);
                }
            }
        });
    }

    function processItemFunctionForOneVectorOnly(allItems, jqPlotter) {
        allItems.forEach(function (item) {
            var itemProperty = jqPlotter.itemProperties[item.index];
            if (!isValidObject(itemProperty) || !itemProperty.enabled)      //filter the valid item
                return;

            //caculate value based on valexpression
            var parsedVal = item.value;
            if (item.property.toString().indexOf("__", 0) == -1)
                parsedVal = CommonFunction.parseValueByExpression(item.value, itemProperty.valExpression);

            //handle datetime based on time zone
            item.date = getDateTimeByTimeOffset(item.timestamp, jqPlotter.commonProperty.timeOffset);

            var seriesData = null;
            switch (itemProperty.itemType) {
                case CONSTANT.jqPlotterItemTypes.curve:
                    break;
                case CONSTANT.jqPlotterItemTypes.rangeLoY:
                case CONSTANT.jqPlotterItemTypes.rangeHiY:
                case CONSTANT.jqPlotterItemTypes.rangeLoX:
                case CONSTANT.jqPlotterItemTypes.rangeHiX:
                    break;
                case CONSTANT.jqPlotterItemTypes.timeReference:
                    break;
                case CONSTANT.jqPlotterItemTypes.resetBuffer:
                    if (getBoolean(item.value, false)) {          //while item.value is true
                        for (var i = 0; i < jqPlotter.visibleSeries.length; i++) {
                            jqPlotter.visibleSeries[i].vectorDataPoints = [];
                            jqPlotter.visibleSeries[i].data = [];
                        }
                        jqPlotter.timeSliderAxis.timespan = 1;
                        jqPlotter.timeSliderAxis.maximum = parseInt(item.timestamp);
                        jqPlotter.timeSliderAxis.minimum = jqPlotter.timeSliderAxis.maximum - jqPlotter.timeSliderAxis.timespan;
                        jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.maximum;
                        jqPlotter.timeSliderAxis.visibleMinimum = jqPlotter.timeSliderAxis.visibleMaximum - jqPlotter.timeSliderAxis.timespan;
                        jqPlotter.timeSliderAxis.dataMaximum = jqPlotter.timeSliderAxis.visibleMaximum;
                        jqPlotter.timeSliderAxis.dataMinimum = jqPlotter.timeSliderAxis.visibleMinimum;
                        jqPlotter.timeSliderAxis.scrollbarAtEnd = true;
                    }
                    break;
                case CONSTANT.jqPlotterItemTypes.visibleDataPoint:
                    //item.value = parseFloat(parsedVal);
                    //JqPlotter_Main.handleVisibleDataPointItem(item, jqPlotter.commonProperty);
                    break;
                default:
                    break;
            }

        });     //allItems.forEach
    }

    //vector code end
    my.setChartAreaBackground = function (background, jqPlotter) {
        jqPlotter.chart.chartAreaBackground = background;
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart(jqPlotter.chart);
    }

    return my;
}());