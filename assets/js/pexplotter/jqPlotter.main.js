var JqPlotter_Main = (function () {
    var my = {};

    my.initializeJqPlotter = function (ControlID, SubscriptionElements, jqPlotter) {
        jqPlotter.elm = ControlID;

        var chartDiv = document.getElementById(jqPlotter.elm.id + "_chartdiv");

        chartDiv.jqPlotter = jqPlotter;
        var propstr = chartDiv.getAttribute("props");
        var props = JSON.parse(propstr);
        jqPlotter.props = props;

        jqPlotter.subscriptionElements = SubscriptionElements;

        jqPlotter.commonProperty = JqPlotter_PropertiesFactory.createCommonProperty(props, jqPlotter.elm.id);

        var propertyResults = JqPlotter_PropertiesFactory.parseSubscriptionElements(SubscriptionElements, props, jqPlotter.commonProperty);
        jqPlotter.itemProperties = propertyResults[0];
        jqPlotter.curveProperties = propertyResults[1];

        initializePage(props, jqPlotter.commonProperty);

        //create chart
        jqPlotter.chart = createChart(jqPlotter.commonProperty);

        //create div for axesY
        if (!jqPlotter.commonProperty.chartMinimized) {
            jqPlotter.axesYDivContainer = createAxesYDivContainer(jqPlotter.commonProperty);
            jqPlotter.axesXDivContainer = createAxesXDivContainer(jqPlotter.commonProperty);
        }

        //set grid line
        jqPlotter.gridLineAxes = JqPlotter_AxesFactory.setGridLine(jqPlotter.chart, jqPlotter.commonProperty);

        //set time axis
        if (jqPlotter.commonProperty.isXYPlot)          //if it is xyPlot
            jqPlotter.timeSliderAxis = JqPlotter_AxesFactory.setTimeSliderBarAxis(jqPlotter.chart, jqPlotter.commonProperty, jqPlotter.gridLineAxes[1]);
        else {    //if it is trend view, then create time label axis
            jqPlotter.timeSliderAxis = JqPlotter_AxesFactory.createTimeSliderBarAxis(jqPlotter.commonProperty);
        }

        var axesResults = JqPlotter_AxesFactory.createAllAxes(jqPlotter.commonProperty, jqPlotter.curveProperties, jqPlotter.timeSliderAxis);
        jqPlotter.allAxesX = axesResults[0];
        jqPlotter.allAxesY = axesResults[1];
        jqPlotter.visibleAxesX = JqPlotter_AxesFactory.initializeAxesX(jqPlotter.allAxesX, jqPlotter.curveProperties, jqPlotter.commonProperty, jqPlotter.chart);
        jqPlotter.visibleAxesY = JqPlotter_AxesFactory.initializeAxesY(jqPlotter.allAxesY, jqPlotter.curveProperties, jqPlotter.commonProperty, jqPlotter.chart);
        jqPlotter.visibleSeries = JqPlotter_SeriesFactory.createSeriesArray(jqPlotter.curveProperties, jqPlotter.commonProperty);

        //set axis and series to chart
        jqPlotter.chart.axes = jqPlotter.chart.axes.concat(jqPlotter.allAxesX.reverse());
        jqPlotter.chart.axes = jqPlotter.chart.axes.concat(jqPlotter.allAxesY.reverse());
        jqPlotter.chart.series = jqPlotter.chart.series.concat(jqPlotter.visibleSeries);

        if (!jqPlotter.commonProperty.isXYPlot) {
            jqPlotter.timeLabelAxis = JqPlotter_AxesFactory.setTimeLabelAxis(jqPlotter.chart, jqPlotter.commonProperty, jqPlotter.gridLineAxes[1]);
            JqPlotter_AxesFactory.drawTimereferenceMarkTime(jqPlotter.commonProperty.timeReferenceMarkTime, jqPlotter.timeSliderAxis);
        }

        addMinMaxChangedListener(jqPlotter);

        //legend handle
        if (jqPlotter.commonProperty.chartMinimized) {       //if minimized
            jqPlotter.chart.axes.forEach(function (axis) { setAxisVisible(axis, false); });
        }

        //jqPlotter line is call the jqchart function to draw chart
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart(jqPlotter.chart);

        jqPlotter.mouseCursorInfo = new MouseCursorInfo(0, 0, 0, 0, 0, 0, 0, 0);
        jqPlotter.rulerStatus = new RulerStatusInfo(0, 0, jqPlotter.props['Track0.RulerOrientation'].toLowerCase() == 'vertical');
        //jqPlotter.rulerStatus = new RulerStatusInfo(0, 0, true);
        //create grid area continer
        var gridAreaContainerDiv = createGridAreaContainerDiv(jqPlotter.commonProperty);

        //handle legend and infor bar
        if (!jqPlotter.commonProperty.chartMinimized) {
            if (jqPlotter.commonProperty.legendPosition.toLowerCase() == 'hidden') {
                jqPlotter.commonProperty.legendVisibleRows = 0;
            }

            //create top legend
            var legendDiv = JqPlotter_Legend.createLegend(jqPlotter.commonProperty, jqPlotter.curveProperties, false);

            //create draggable legend. info bar and gridAreaContainerDiv must already be created.
            var draggableLegendDiv = JqPlotter_Legend.createLegend(jqPlotter.commonProperty, jqPlotter.curveProperties, true);
            draggableLegendDiv.hide();
            draggableLegendDiv.appendTo(gridAreaContainerDiv);
            if (jqPlotter.commonProperty.legendPosition.toLowerCase() == 'embedded') {
                var ee = window.pageProperty.eventEmitter;
                ee.emitEvent(jqPlotter.commonProperty.elementId + "HideLegend");
            }

            //create infor bar
            var inforBar = JqPlotter_InfoBar.createInforBar(jqPlotter.commonProperty);
        }

        //below is ruler event
        {
            if(jqPlotter.commonProperty.userInteraction ){
                gridAreaContainerDiv.bind('click', function (e, data) {
                    if (jqPlotter.rulerStatus.clickCount == 2) {
                        //triple click
                        JqPlotter_Ruler.updateRulerLinePosForTplClick(jqPlotter, e, this);
                        jqPlotter.rulerStatus.clickCount = 0;
                    }
                    else {
                        JqPlotter_Ruler.updateRulerLinePosForClick(jqPlotter, e, this);

                        jqPlotter.rulerStatus.displayMode = 0;
                    }
                });

                gridAreaContainerDiv.bind('mousemove', function (e, data) {
                    JqPlotter_Ruler.updateRulerLinePosForMouseMove(jqPlotter, e);
                });

                gridAreaContainerDiv.bind('dblclick', function (e, data) {
                    JqPlotter_Ruler.updateRulerLinePosForDblClick(jqPlotter, e, this);
                });
            }
        }

        var ee = window.pageProperty.eventEmitter;
        var removeSeriesEventName = jqPlotter.commonProperty.elementId + CONSTANT.STRING.eventRemoveSeries;
        jqPlotter.removeSeriesEventHandler = handleRemoveSeriesEvent.bind(jqPlotter);
        ee.addListener(removeSeriesEventName, jqPlotter.removeSeriesEventHandler);

        var resetZoomEventName = jqPlotter.commonProperty.elementId + CONSTANT.STRING.eventResetZoom;
        jqPlotter.resetZoomEventHandler = JqPlotter_AxesFactory.handleResetZoomEvent.bind(jqPlotter);
        ee.addListener(resetZoomEventName, jqPlotter.resetZoomEventHandler);

        //below is handling event
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").bind('axisLabelCreating', formatLabel);
   
        //handle zoom in/out event
        var normalAxes = jqPlotter.chart.axes.filter(function (axis) {
            // igore GridLine axes
            return !!axis.zoomEnabled;
        });
        var eventAxisSource = [];
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").bind('axisZoom', function (e, data) {
            if (data.opts && data.opts.sliderZooming) {             //it is dragging slider
                throttle(JqPlotter_AxesFactory.handleAxisScrollEvent, this, [data.axis, jqPlotter]);
            } else {        //it is zooming
                eventAxisSource.push(data.axis);
                if (eventAxisSource.length < normalAxes.length) {
                    //only call jqchart('update') once for each axisZoom event for all axes
                    return;
                }
                eventAxisSource.forEach(function (axisSource) {
                    JqPlotter_AxesFactory.handleAxisZoomEvent(axisSource, jqPlotter);
                });
                eventAxisSource = [];

                //NOTE: calling jqchart('update') must be throttled
                $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
            }
        });
    } 

    my.daUpdate = function (allItems, jqPlotter) {
        handleTimeUpdateItems(allItems, jqPlotter.itemProperties, jqPlotter.curveProperties);
        var isVector = false;
        if (jqPlotter.commonProperty.isXYPlot) {     //XYPlot handling
            for (var iVecTest = 0; iVecTest < allItems.length; iVecTest++) {
                var valueExpression = allItems[iVecTest].value;
                if (valueExpression.indexOf(';') != -1){
                    isVector = true;
                    break;
                }
            }

            if (isVector) {   //if the datapoint is a vector value
                jqPlotter.commonProperty.oneVectorOnly = true;
                JqPlotter_XYPlotMain.daUpdateForOneVectorOnly(allItems, jqPlotter);
            }
            else {
                JqPlotter_XYPlotMain.daUpdate(allItems, jqPlotter);
            }
            return;
        }

        // group items by item.index
        var groupedItems = [];
        var itemProperties = jqPlotter.itemProperties;
        allItems.forEach(function (item) {
            var itemProperty = itemProperties[item.index];
            if (!isValidObject(itemProperty) || !itemProperty.enabled)      //filter the valid item
                return;

            var groupIndex = parseInt(item.index);
            if (!groupedItems[groupIndex]) {
                groupedItems[groupIndex] = [];
            }
            groupedItems[groupIndex].push(item);
        });

        jqPlotter.chart.series.forEach(function (series) {
            series.numOfItemsAdded = 0;
        });

        groupedItems.forEach(function (serieItems) {
            for (var i = 0; i < serieItems.length; i++) {
                var item = serieItems[i];

                var itemProperty = jqPlotter.itemProperties[item.index];

                if (itemProperty.itemType == CONSTANT.jqPlotterItemTypes.curve
                    || itemProperty.itemType == CONSTANT.jqPlotterItemTypes.itemAttribute) {
                    if (!getSeriesByItemTag(itemProperty.itemTag, jqPlotter.chart.series))
                        continue;
                }

                //caculate value based on valexpression
                var parsedVal = item.value;
                if (item.property.toString().indexOf("__", 0) == -1)
                    parsedVal = CommonFunction.parseValueByExpression(item.value, itemProperty.valExpression);

                //handle datetime based on time zone
                item.date = getDateTimeByTimeOffset(item.timestamp, jqPlotter.commonProperty.timeOffset);

                // handle specific item types
                switch (itemProperty.itemType) {
                    case CONSTANT.jqPlotterItemTypes.curve:
                        item.value = parseFloat(parsedVal);
                        handleUpdatedCurveItem(item, itemProperty, jqPlotter);
                        break;
                    case CONSTANT.jqPlotterItemTypes.rangeLoY:
                    case CONSTANT.jqPlotterItemTypes.rangeHiY:
                    case CONSTANT.jqPlotterItemTypes.rangeLoX:
                    case CONSTANT.jqPlotterItemTypes.rangeHiX:
                        item.value = parseFloat(parsedVal);
                        handleUpdatedRangeLoItem(item, itemProperty, jqPlotter);
                    case CONSTANT.jqPlotterItemTypes.timeReference:
                        handleTimeReferenceItem(item, itemProperty, jqPlotter);
                        break;
                    case CONSTANT.jqPlotterItemTypes.resetBuffer:
                        handleUpdatedResetBufferItem(item, jqPlotter.visibleSeries);
                        break;
                    case CONSTANT.jqPlotterItemTypes.visibleDataPoint:
                        item.value = parseFloat(parsedVal);
                        handleVisibleDataPointItem(item, jqPlotter.commonProperty);
                        break;
                    case CONSTANT.jqPlotterItemTypes.itemAttribute:
                        item.value = parseFloat(parsedVal);
                        handleItemAttribute(item, itemProperty, jqPlotter);
                        break;
                    case CONSTANT.jqPlotterItemTypes.orientation:
                        series = getCurveSeriesByCurveIndex(itemProperty.curveIndex, jqPlotter.visibleSeries);
                        series.currentPointAngle = parseFloat(parsedVal);
                    default:
                        break;
                }

                itemProperty.latestItemValue = item.value;        //set item.value to itemProperty
            }

            if ((itemProperty.itemType == CONSTANT.jqPlotterItemTypes.curve
                || itemProperty.itemType == CONSTANT.jqPlotterItemTypes.itemAttribute)
                && serieItems.length > 0) {
                var itemTag = serieItems[0].property;

                // send item NewValue event so the corresponding legend item can also update its value and quality
                if (jqPlotter.timeSliderAxis.scrollbarAtEnd) {
                    var ee = window.pageProperty.eventEmitter;
                    var itemChangedEventName = jqPlotter.commonProperty.elementId + "_" + itemTag + "_NewValue";
                    ee.emitEvent(itemChangedEventName, [item.value, item.quality]);
                }

                var series = getSeriesByItemTag(itemTag, jqPlotter.chart.series);
                if (series)
                    series.numOfItemsAdded = jqPlotter.commonProperty.ringBufferSize > serieItems.length ? serieItems.length : jqPlotter.commonProperty.ringBufferSize;   //series.data.length;  //serieItems.length;
            }
        }, jqPlotter);

        //handle time axis
        JqPlotter_AxesFactory.updateTimeAxis(jqPlotter.timeSliderAxis, jqPlotter.timeLabelAxis, jqPlotter.visibleSeries, jqPlotter.curveProperties, jqPlotter.commonProperty);
        JqPlotter_Ruler.updateRulerLinePosFordaUpdate(jqPlotter);

        if (!jqPlotter.commonProperty.isZooming) 
            updateValueAxes(jqPlotter.allAxesY);

        // for every range chart, calculate range to value for newly added items
        handleRangeChart(false, jqPlotter);

        //update current point
        updateArrowStatusAndPosition(jqPlotter);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');

        updateGridAreaPosition(jqPlotter.commonProperty.elementId);
    }

    my.updateHistoryRaw = function (valueString, jqPlotter) {
        var val = valueString;
        var itemArray = HistoricalAccess.parseHistoryStringToItems(valueString);

        jqPlotter.chart.series.forEach(function (series) {
            series.numOfItemsAdded = 0;
        });

        for (var i = 0; i < itemArray.length; i++) {
            if (!isValidObject(itemArray[i][0]))
                continue;

            var itemProperty = jqPlotter.itemProperties[itemArray[i][0].index];
            if (!isValidObject(itemProperty))
                continue;

            for (var j = itemArray[i].length - 1; j >= 0; j--) {
                var item = itemArray[i][j];
                var parsedVal = item.value;
                if (item.property.toString().indexOf("__", 0) == -1)        //caculate value based on valexpression
                    parsedVal = CommonFunction.parseValueByExpression(item.value, itemProperty.valExpression);
                item.value = parseFloat(parsedVal);

                item.date = getDateTimeByTimeOffset(item.timestamp, jqPlotter.commonProperty.timeOffset);

                if (itemProperty.itemType == CONSTANT.jqPlotterItemTypes.curve)
                    handleHistoricalCurveItem(item, itemProperty, jqPlotter);
                else if (itemProperty.itemType == CONSTANT.jqPlotterItemTypes.itemAttribute)
                    handleHistoricalItemAttribute(item, itemProperty, jqPlotter);
            }

            if (itemProperty.itemType == CONSTANT.jqPlotterItemTypes.curve
                || itemProperty.itemType == CONSTANT.jqPlotterItemTypes.itemAttribute) {
                var itemTag = itemArray[i][0].property;
                var series = getSeriesByItemTag(itemTag, jqPlotter.chart.series);
                if (series)
                    series.numOfItemsAdded = jqPlotter.commonProperty.ringBufferSize > itemArray[i].length ? itemArray[i].length : jqPlotter.commonProperty.ringBufferSize;
            }
        }

        if (!jqPlotter.commonProperty.isZooming)
            updateValueAxes(jqPlotter.allAxesY);

        // for every range chart, calculate range to value for newly added items
        handleRangeChart(true, jqPlotter);

        //handle time axis
        JqPlotter_AxesFactory.updateTimeAxis(jqPlotter.timeSliderAxis, jqPlotter.timeLabelAxis, jqPlotter.visibleSeries, jqPlotter.curveProperties, jqPlotter.commonProperty);

        //update sliderbar to the front
        jqPlotter.timeSliderAxis.scrollbarAtEnd = false;
        jqPlotter.timeSliderAxis.visibleMinimum = jqPlotter.timeSliderAxis.minimum;
        jqPlotter.timeSliderAxis.visibleMaximum = jqPlotter.timeSliderAxis.minimum + jqPlotter.timeSliderAxis.timespan;
        JqPlotter_AxesFactory.updateTimeLabelAxisByTimeSliderAxis(jqPlotter.timeLabelAxis, jqPlotter.timeSliderAxis);

        //update inforbar and legend
        JqPlotter_Ruler.updateInfobarAndLegendForSliderBar(jqPlotter.timeSliderAxis, jqPlotter);

        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    }

    //initialize page based on pexplotter
    function initializePage (props, commonProperty) {
        if (!isValidObject(window.initialJqPlotter) || !window.initialJqPlotter) {
            window.pageProperty = JqPlotter_PropertiesFactory.createPageProperty(props);
            setLocale();
            createMenus(commonProperty);
            window.initialJqPlotter = true;
        }
        window.pageProperty.elementIdArray.push(commonProperty.elementId);
    }

    //create jqChart
    function createChart (commonProperty) {
        var chart = {
            title: {
                text: null,
                font: commonProperty.fontString
            },
            toolbar: {
                visibility: 'hidden',
            },
            shadows: {
                enabled: false
            },
            background: commonProperty.backgroundcolor,
            chartAreaBackground: commonProperty.foregroundcolor,
            border: {
                visible: true,
                strokeStyle: commonProperty.borderFill,
                lineWidth: 1,
                cornerRadius: 2,
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            legend: { visible: false },
            tooltips: { disabled: true, highlighting: false},
            mouseWheelInteractionMode: 'zooming',
            mouseWheelZoomInDirect: 'down', // default direction in jqChart to zoom in is 'up', but in old pexplotter it's 'down'
            mouseInteractionMode: 'none',
            axes: [],
            series: [],
        };
        return chart;
    }

    //handle updating curve item
    function handleUpdatedCurveItem (item, itemProperty, jqPlotter) {
        var curveSeries = getCurveSeriesByCurveIndex(itemProperty.curveIndex, jqPlotter.chart.series);

        if (curveSeries)
            addNewDataToSeries(curveSeries, item, false, jqPlotter);
    }

    my.handleUpdatedRangeLoItem = handleUpdatedRangeLoItem;
    function handleUpdatedRangeLoItem (item, itemProperty, jqPlotter) {
        var itemTypes = CONSTANT.jqPlotterItemTypes;

        var curveIndex = itemProperty.curveIndex;
        if (curveIndex < 0)
            return;

        var curveProperty = getCurvePropertyByCurveIndex(itemProperty.curveIndex, jqPlotter.curveProperties);       //find curve by curveIndex
        if (!curveProperty)
            return;
        var curveSeries = getCurveSeriesByCurveIndex(itemProperty.curveIndex, jqPlotter.chart.series);

        var axisY = getAxisByCurveIndex(itemProperty.curveIndex, false, jqPlotter.allAxesY);
        var axisX = getAxisByCurveIndex(itemProperty.curveIndex, true, jqPlotter.allAxesX);

        switch (itemProperty.itemType) {
            case itemTypes.rangeLoY:
                if (isValueAxis(axisY) && axisY.visible && curveSeries.data.length > 0)           //axis must be value axis; only the visible axis's range lo/hi worked; series must have data
                    axisY.rangeLoItemValue = item.value;
                break;
            case itemTypes.rangeHiY:
                if (isValueAxis(axisY) && axisY.visible && curveSeries.data.length > 0)
                    axisY.rangeHiItemValue = item.value;
                break;
            case itemTypes.rangeLoX:
                if (isValueAxis(axisX) && axisX.visible)
                    axisX.rangeLoItemValue = item.value;
                break;
            case itemType.rangeHiX:
                if (isValueAxis(axisX) && axisX.visible)
                    axisX.rangeHiItemValue = item.value;
                break;
            default:
                break;
        }
    }

    function handleTimeReferenceItem (item, itemProperty, jqPlotter) {
        //draw line in plotter area
        for (var i = 0; i < jqPlotter.visibleAxesX.length; i++) {
            var timeAxis = jqPlotter.visibleAxesX[i];
            if (jqPlotter.commonProperty.timeReferenceMarkTime.markTimeOn) {
                if (timeAxis.plotLines) {
                    for (var j = 0; j < timeAxis.plotLines.length; j++) {
                        if (timeAxis.plotLines[j].plotLineType == CONSTANT.plotLineTypes.timeReferenceMarkTime) {
                            timeAxis.plotLines[j].value = item.date;
                            break;
                        }
                    }
                }
            }
        }
    }

    //handle updated reset buffer item
    function handleUpdatedResetBufferItem (item, series) {
        if (getBoolean(item.value, false)) {          //while item.value is true
            for (var i = 0; i < series.length; i++) {
                series[i].data = [];
            }
        }
    }

    //handle visible data point count item
    function handleVisibleDataPointItem (item, commonProperty) {
        var count = parseInt(item.value);
        if (count < 0)
            count = 0;
        commonProperty.visibleDataPointCount = count;       //set visible data point count
    }

    function handleItemAttribute (item, itemProperty, jqPlotter) {
        var baseCurveIndex = parseInt(getCurveIndex(itemProperty.itemAttributeRefItemProperty));
        if (baseCurveIndex < 0)
            return;

        var itemTag = itemProperty.itemTag;
        var itemAttributeSeries = getSeriesByItemTag(itemTag, jqPlotter.chart.series);

        if (itemAttributeSeries)
            addNewDataToSeries(itemAttributeSeries, item, false, jqPlotter);
    }

    function handleHistoricalCurveItem (item, itemProperty, jqPlotter) {
        var curveIndex = parseInt(itemProperty.curveIndex);
        if (curveIndex < 0)
            return;

        var curveSeries = getCurveSeriesByCurveIndex(curveIndex, jqPlotter.chart.series);
        if (!curveSeries)
            return;
        if (item.date >= curveSeries.data[0][0])        //get rid of the item whose timestamp is larger than the first one
            return;

        addNewDataToSeries(curveSeries, item, true, jqPlotter);
    }

    function handleHistoricalItemAttribute (item, itemProperty, jqPlotter) {
        var baseCurveIndex = parseInt(getCurveIndex(itemProperty.itemAttributeRefItemProperty));
        if (baseCurveIndex < 0 || !baseCurveIndex)
            return;

        var itemTag = itemProperty.itemTag;
        var curveProperty = getCurvePropertyByCurveIndex(baseCurveIndex, jqPlotter.curveProperties);
        if (!curveProperty)
            return;

        var itemAttributeSeries = getSeriesByItemTag(itemTag, jqPlotter.chart.series);
        if (!itemAttributeSeries)
            return;
        if (item.date >= itemAttributeSeries.data[0][0])
            return;

        addNewDataToSeries(itemAttributeSeries, item, true, jqPlotter);
    }

    //handle range chart
    function handleRangeChart(unshift, jqPlotter) {
        //var unshift = args.unshift;
        jqPlotter.chart.series.forEach(function (series) {
            if (series.type.toString() != "range") {
                return;
            }

            var curveIndex = parseInt(series.curveIndex);
            var rangeToSeries = getRangeToSeries(series, jqPlotter);

            console.log("got rangeToSeries: ", rangeToSeries);

            if (!rangeToSeries)
                return;

            var rangeToSerieItems = rangeToSeries.data;

            var fromValueYAxis = getAxisByCurveIndex(curveIndex, false, jqPlotter.allAxesY);
            var min = fromValueYAxis.minimum;
            var max = fromValueYAxis.maximum;
            var toValueYAxis = getAxisByCurveIndex(rangeToSeries.curveIndex, false, jqPlotter.allAxesY);
            var rangeToMin = toValueYAxis.minimum;
            var rangeToMax = toValueYAxis.maximum;

            var start = unshift ? series.numOfItemsAdded : series.data.length - series.numOfItemsAdded;
            var end = unshift ? 0 : series.data.length;

            for (var i = start; rangeToSeries.numOfItemsAdded > 0 || (unshift ? i > end : i < end) ;) {
                var updatingIndex = i;
                if (start == end) {
                    updatingIndex = unshift ? 0 : series.data.length;
                }

                var newData = series.data[updatingIndex] || series.data[updatingIndex - 1];
                var rangeToItem;

                if (rangeToSerieItems) {
                    var rangeToItemIndex;
                    if (unshift) {
                        rangeToItemIndex = (rangeToSeries.numOfItemsAdded > 0 ? rangeToSeries.numOfItemsAdded - 1 : 0);
                    } else {
                        rangeToItemIndex = rangeToSerieItems.length - rangeToSeries.numOfItemsAdded;
                    }
                    
                    rangeToItem = rangeToSerieItems[rangeToItemIndex];
                }

                if (rangeToSeries.numOfItemsAdded > 0 || unshift) {
                    newData[CONSTANT.xIndex] = rangeToItem[CONSTANT.xIndex];
                    
                    var adjustedValue = adjustValue(parseFloat(rangeToItem[CONSTANT.yIndex]), rangeToMin, rangeToMax, min, max);
                    newData[CONSTANT.rangeToIndex] = adjustedValue;
                    
                    rangeToSeries.numOfItemsAdded--;
                }
                
                series.data[updatingIndex] = newData;
                if (start != end) {
                    unshift ? i-- : i++;
                }
            }
        }, jqPlotter);
    }

    //handle 
    function handleRestart(series, item, bufferRemoveProperty) {
        var bufferRemoveStrategy = bufferRemoveProperty.bufferRemoveStrategy;
        var bufferRemovePeriod = bufferRemoveProperty.bufferRemovePeriod;
        var bufferRemoveSumTime = bufferRemoveProperty.bufferRemoveSumTime;
        if (series.data.length < 1)
            return;

        var newTimestamp = item.date;
        var previousTimestamp = series.data[series.data.length - 1][0];
        var restartCount = 10;      //older than 10 points before, then restart

        if (series.data.length > restartCount && newTimestamp < series.data[series.data.length - restartCount][0]) {       //if new data is older than the previous one, then restart
            series.restart = true;
            series.restartIndex = series.data.length - 1;

            if (bufferRemoveStrategy == "Remove_Backward") {
                while (series.data.length > 0) {
                    if (series.data[0][0] < newTimestamp)       //Data older than the first datapoint after a restart will be removed
                        series.data.shift();
                    else
                        break;
                }
            }
            else if (bufferRemoveStrategy == "Remove_Forward") {
                while (series.data.length > 0) {
                    if (series.data[series.data.length - 1][0] > newTimestamp)       //Data newer than the first datapoint after a restart will be removed
                        series.data.pop();
                    else
                        break;
                }
            }
            else if (bufferRemoveStrategy == "Remove_All") {
                series.data = [];           //remove all data, after restart
            }
        }
        else {        //if it is common update
            var bBufferRemove = false;
            if (series.restart && bufferRemoveStrategy == "Remove_Inbetween") {
                if (bufferRemoveSumTime == 0) {
                    bBufferRemove = true;
                    var now = (new Date()).getTime();
                    bufferRemoveSumTime = parseInt(now / 1000) * 1000;
                } else {
                    var now = (new Date()).getTime();
                    if ((now - bufferRemoveSumTime) >= bufferRemovePeriod) {
                        bBufferRemove = true;
                        bufferRemoveSumTime = parseInt(now / 1000) * 1000;
                    }
                }
            }

            if (bBufferRemove) {
                //Data from previous run between the last update from the new run and a new update will be removed. Default behavior
                if (series.restartIndex != null && series.restartIndex > 0) {
                    var startIndex = JqPlotter_Ruler.searchDataPointInRange(series.data, previousTimestamp, 0, series.restartIndex);        //get the newest index of previous timestamp
                    if (startIndex < 0)
                        return;

                    while (startIndex < series.data.length && series.data[startIndex][0] < previousTimestamp)
                        startIndex++;

                    var removeCount = 1;
                    while (startIndex + removeCount < series.data.length && series.data[startIndex + removeCount][0] < newTimestamp) {
                        removeCount++;
                    }
                    if (index != series.data.length - 1) {      //not conclude the latest one
                        series.data.splice(startIndex, removeCount);       //remove the current timestamp one in old data
                        series.restartIndex -= removeCount;
                    }
                }
            }
        }
 
    }

    function handleSymbolsOnlyOnChange(newData, jqPlotter, series) {
        if (
            // SymbolsOnlyOnChange does not make sense to XY plotting, because if 
            // two values are the same, they will be completely overlapping
            jqPlotter.commonProperty.isXYPlot

            //symbol only on change switch
            || (!series.appearanceProperty.symbolsOnlyOnChange)

            // SymbolsOnlyOnChange does not apply to bad symbols
            || newData[CONSTANT.qualityIndex] != "192"

            // SymbolsOnlyOnChange only takes effect for non-line curves
            || !(series.markers.type && series.markers.type.match(/cross|diamond|circle/i))

            // TODO: confirm if we should check equality before or after applying NumOfDecimals to the values?
            || series.data.length <= 0
            || series.data[series.data.length - 1][1] != newData[1]
            ) {
            return newData;
        }
        
        // markerTypeIndex does not matter here, as long as we set markerRadius = 0, nothing will be drawn
        newData[CONSTANT.markerTypeIndex] = "circle";
        newData[CONSTANT.markerRadius] = 0;

        return newData;
    }

    function addNewDataToSeries(series, item, addToFront, jqPlotter) {
        //if (!addToFront)
            //handleRestart(series, item, jqPlotter.commonProperty.bufferRemoveProperty);

        var curveProperty = getCurvePropertyByCurveIndex(series.curveIndex, jqPlotter.curveProperties);

        var newData = [item.date, item.value];
        //if (item.rangeTo)    // range to 
        //    newData[CONSTANT.rangeToIndex] = (item.rangeTo);

        //handle bad symbols, item.quality & 192 == 64 means quality uncertain. Temporarily, we dont process such value as bad quality
        if (curveProperty.badSymbols && ((item.quality & 192) == 0)) {
            //newData[CONSTANT.markerTypeIndex] = 'image';
            //newData[CONSTANT.markerRadius] = (window.pageProperty.badSymbolImageUrl);
            newData[CONSTANT.markerTypeIndex] = 'crossCircle';
            newData[CONSTANT.imageIndex] = 5;
        }

        newData[CONSTANT.qualityIndex] = item.quality;

        // SymbolsOnlyOnChange only affect new data, maybe we need to update all existing points as well?
        newData = handleSymbolsOnlyOnChange(newData, jqPlotter, series);

        for (var i = 0; i < jqPlotter.commonProperty.qualityVisulizationProp.length; i++) {
            var mask = jqPlotter.commonProperty.qualityVisulizationProp[i].mask;
            var bitpattern = jqPlotter.commonProperty.qualityVisulizationProp[i].bitpattern;
            var equalcondition = jqPlotter.commonProperty.qualityVisulizationProp[i].equalcondition;
            if (isConditionMet(mask, bitpattern, equalcondition, item.quality)) {
                if (jqPlotter.commonProperty.qualityVisulizationProp[i].imgurl.length > 0) {
                    if (jqPlotter.commonProperty.qualityVisulizationProp[i].hidden) {
                        newData[CONSTANT.markerTypeIndex] = 'lineBreak';
                    }
                    else{
                        newData[CONSTANT.markerTypeIndex] = 'image';
                        newData[CONSTANT.imageIndex] = jqPlotter.commonProperty.qualityVisulizationProp[i].imgurl;
                    }
                }
            }
            else {
                if (jqPlotter.commonProperty.qualityVisulizationProp[i].hidden) {
                    removeLineBreakPointIfNecessary(series, jqPlotter, addToFront);
                }
                //if there is normal datapoint and linebreak datapoint in visible range connect the last normal point and this point by direct line
                //solotion:
                //1 remove all linebreak point in array
                //2 recalculate all the linebreak datapoint's value to make it a direct line
            }
        }
        
        //series.data.addNew(newData, jqPlotter.commonProperty.ringBufferSize, addToFront);
        addNewDataPointToSeries(series, newData, jqPlotter.commonProperty.ringBufferSize, addToFront);

        var curveValueAxis = getAxisByCurveIndex(curveProperty.curveIndex, false, jqPlotter.allAxesY);
        //set yaxis range
        valueAxisCalculateMinMax(curveValueAxis, item.value);
        // update crossing for area chart
        if (series.type.toString() == 'area')
            updateAsixCrosing(curveValueAxis);
    }

    function addNewDataPointToSeries(series, newData, maxLength, addToFront) {
        if (addToFront) {
            series.data.unshift(newData);
            series.currentPointIndex++;
        }
        else
            series.data.push(newData);

        if (maxLength && maxLength > 0) {
            var offset = 0;
            if ((offset = (series.data.length - maxLength)) > 0) {
                series.data.splice(0, offset);
                series.currentPointIndex -= offset;
            }
        }
    }

    function handleRemoveSeriesEvent (curveIndex, attributeIndex) {
        if (attributeIndex < 0) {
            for (var i = 0; i < this.itemProperties.length; i++) {
                if (this.itemProperties[i].curveIndex == curveIndex) {
                    this.itemProperties[i].enabled = false;
                }
            }

            //remove all curveProperty with item Tag
            for (var i = 0; i < this.curveProperties.length; i++) {
                if (this.curveProperties[i].curveIndex == curveIndex) {
                    this.curveProperties.splice(i, 1);
                    break;
                }
            }

            //remove all series with item tag, include the curve and itemAttribute
            for (var i = 0; i < this.chart.series.length; i++) {
                if (this.chart.series[i].curveIndex == curveIndex) {
                    this.chart.series.splice(i, 1);
                    i--;
                }
            }

            //remove all series from visible series
            for (var i = 0; i < this.visibleSeries.length; i++) {
                if (this.visibleSeries[i].curveIndex == curveIndex) {
                    this.visibleSeries.splice(i, 1);
                    i--;
                }
            }

            //remove axis
            for (var i = 0; i < this.chart.axes.length; i++) {
                var axis = this.chart.axes[i];
                if (this.chart.axes[i].curveIndex == curveIndex) {
                    if (!axis.isAxisX) {        //y axis
                        if (axis.isMerged) {
                            var foxedAxes = forkAxis(axis, this.allAxesY, this.curveProperties);
                            if (foxedAxes.length > 1)
                                mergeSeveralAxes(foxedAxes, this.curveProperties, this.commonProperty.mergeAxesBlackY);
                        }

                        if ($(axis.div))
                            $(axis.div).remove();
                        this.chart.axes.splice(i, 1);
                        i--;
                    } else {            //x axis
                        if (axis.isMerged) {
                            var foxedAxes = forkAxis(axis, this.allAxesX, this.curveProperties);
                            if (foxedAxes.length > 1)
                                mergeSeveralAxes(foxedAxes, this.curveProperties, this.commonProperty.mergeAxesBlackX);
                        }

                        if ($(axis.div))
                            $(axis.div).remove();
                        this.chart.axes.splice(i, 1);
                        i--;
                    }
                }

                //remove from axes' merged item tags
                if (typeof axis.mergedCurveIndexes != 'undefined' && axis.mergedCurveIndexes.length) {
                    for (j = 0; j < axis.mergedCurveIndexes.length; j++) {
                        if (axis.mergedCurveIndexes[j] == curveIndex) {
                            axis.mergedCurveIndexes.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
        }
        else {    //remove attributes series
            //remove series 
            for (var i = 0; i < this.chart.series.length; i++) {
                if (this.chart.series[i].seriesType == CONSTANT.seriesTypes.itemAttribute
                    && this.chart.series[i].curveIndex == curveIndex
                    && this.chart.series[i].attributeIndex == attributeIndex) {
                    this.chart.series.splice(i, 1);
                    i--;
                }
            }

            for (var i = 0; i < this.visibleSeries.length; i++) {
                if (this.visibleSeries[i].seriesType == CONSTANT.seriesTypes.itemAttribute
                    && this.visibleSeries[i].curveIndex == curveIndex
                    && this.visibleSeries[i].attributeIndex == attributeIndex) {
                    this.visibleSeries.splice(i, 1);
                    i--;
                }
            }

            //remove itemAttrSeries from curveProperty
            var curveProperty = getCurvePropertyByCurveIndex(curveIndex, this.curveProperties);
            if (!curveProperty)
                return;
            for (var i = 0; i < curveProperty.itemAttrSeries.length; i++) {
                if (curveProperty.itemAttrSeries[i].attributeIndex == attributeIndex) {
                    curveProperty.itemAttrSeries.splice(i, 1);
                    break;
                }
            }
        }

        this.visibleSeries
            .filter(function (series) {
                return (!!series.data) && series.type == 'range';
            })
            .forEach(function (series) {
                series.data = recalculateRangeData(series, this);
            }, this);
        
        $("#" + this.elm.id + "_chartdiv").jqChart('update');
    }

    //handle items update identifier, let items to be update with other
    function handleTimeUpdateItems(items, itemProperties, curveProperties) {
        if (items.length <= itemProperties.length) {           //assume it is real-time update, not include historical loading
            curveProperties.forEach(function (curveProperty) {
                var itemIndex = curveProperty.itemIndex;            //get current curve item
                var itemProperty = itemProperties[itemIndex];

                if (getLatestUpdatedItemByItemIndex(itemIndex, items) == null) {            //if can not find current curve item, in update items
                    for (var j = 0; j < curveProperty.timeUpdateItemIndexes.length; j++) {
                        var updateItemIndex = curveProperty.timeUpdateItemIndexes[j];
                        var referenceItem = getLatestUpdatedItemByItemIndex(updateItemIndex, items);
                        if (referenceItem != null) {
                            var virtualItem = createTimeUpdateItem(itemProperty, referenceItem);
                            if (virtualItem != null)
                                items.push(virtualItem);
                        }
                    }
                }
            });
        }
    }

    //create virtual item when time update
    function createTimeUpdateItem(itemProperty, referenceItem) {
        if (itemProperty.latestItemValue != null) {
            var item = {
                attribute: 'value',
                index: itemProperty.itemIndex,
                property: itemProperty.itemTag,
                quality: '192',
                qualityCode: '192',
                timestamp: referenceItem.timestamp,
                value: itemProperty.latestItemValue,
            }
            return item;
        } else
            return null;
    }

    //get updated item from items
    function getLatestUpdatedItemByItemIndex(itemIndex, items) {
        for (var i = 0; i < items.length; i++) {
            if ((items[i].index == itemIndex)
                && (((i < (items.length - 1)) && (items[i + 1].index != itemIndex))        //it is the last one with equal itemIndex
                || i == items.length - 1))                                                  //or it is the last one in items
                return items[i];
        }
        return null;
    }

    // create a div that covers the grid area, excluding infoBar div
    function createGridAreaContainerDiv(commonProperty) {
        var elemID = commonProperty.elementId;
        var $chartDiv = $('#' + elemID + '_chartdiv');
        var jqPlotter = $chartDiv[0].jqPlotter;
        var infoBar = $("#" + elemID + "_infoBar");

        var div = $('<div/>', {
            id: elemID + '_gridAreaContainer',
            class: "jqPlotter-gridAreaContainer-div"
        })
        .appendTo($chartDiv).data('jqPlotter', jqPlotter)
        .addClass('context-menu-plotArea');

        if (!commonProperty.userInteraction)
            div.addClass('context-menu-disabled');

        JqPlotter_Ruler.createPlotterLine(commonProperty, div);
        // update position and size when jqChart's chart.gridArea changed
        var ee = window.pageProperty.eventEmitter;
        var eventName = elemID + CONSTANT.STRING.eventGridAreaChanged;
        ee.addListener(eventName, function () {
            div.css('top', commonProperty.gridAreaPosition.gridOffsetY);
            div.css('left', commonProperty.gridAreaPosition.gridOffsetX);

            div.height(commonProperty.gridAreaPosition.gridHeight);
            div.width(commonProperty.gridAreaPosition.gridWidth);

            JqPlotter_Ruler.setPlotterLineProp(commonProperty, jqPlotter.rulerStatus.isVertical);
        });

        return div;
    }

    //create x div
    function createAxesXDivContainer(commonProperty) {
        var elemID = commonProperty.elementId;
        var $chartDiv = $('#' + elemID + '_chartdiv');
        var jqPlotter = $chartDiv[0].jqPlotter;
        var labelHeight = commonProperty.fontSize ? commonProperty.fontSize : 10;
        var containerBottom = $("<div></div>").attr("id", elemID + 'axisXDivBottom')
            .addClass("jqplotter-axes-div-container-bottom")
            .appendTo($chartDiv)
            .data('jqPlotter', jqPlotter);
        var containerTop = $("<div></div>").attr("id", elemID + 'axisXDivTop')
            .addClass("jqplotter-axes-div-container-top")
            .appendTo($chartDiv)
            .data('jqPlotter', jqPlotter);

        var ee = window.pageProperty.eventEmitter;
        var eventName = elemID + CONSTANT.STRING.eventGridAreaChanged;

        ee.addListener(eventName, function () {
            containerBottom.css('bottom', 0 + 'px');
            //containerBottom.css('top', commonProperty.gridAreaPosition.gridOffsetY + 15 + commonProperty.gridAreaPosition.gridHeight + 'px');
            containerBottom.css('width', commonProperty.gridAreaPosition.gridWidth + commonProperty.gridAreaPosition.gridOffsetX - 4 + 'px');
            containerBottom.css('left', 0 + 'px');
            containerTop.css({
                'top': 0 + 'px',
                'width': commonProperty.gridAreaPosition.gridWidth + commonProperty.gridAreaPosition.gridOffsetX - 4 + 'px'
            });
        });

        return [containerTop, containerBottom];
    }

    //create axes y div containercreateAxesYDivContainer
    function createAxesYDivContainer(commonProperty) {
        var elemID = commonProperty.elementId;
        var $chartDiv = $('#' + elemID + '_chartdiv');
        var jqPlotter = $chartDiv[0].jqPlotter;
        var labelHeight = commonProperty.fontSize ? commonProperty.fontSize : 10;
        var containerLeft = $("<div></div>").attr("id", elemID + 'axisYDivLeft')
            .addClass("jqplotter-axes-div-container-left")
            .appendTo($chartDiv)
            .data('jqPlotter', jqPlotter);
        var containerRight = $("<div></div>").attr("id", elemID + 'axisYDivRight')
            .addClass("jqplotter-axes-div-container-right")
            .appendTo($chartDiv)
            .data('jqPlotter', jqPlotter);

        var ee = window.pageProperty.eventEmitter;
        var eventName = elemID + CONSTANT.STRING.eventGridAreaChanged;

        ee.addListener(eventName, function () {
            containerLeft.css('top', commonProperty.gridAreaPosition.gridOffsetY - 20 + 'px');
            containerLeft.css('height', commonProperty.gridAreaPosition.gridHeight + 20 + 15 + 'px');
            containerRight.css({
                'top': commonProperty.gridAreaPosition.gridOffsetY - 20 + 'px',
                'height': commonProperty.gridAreaPosition.gridHeight + 20 + 15 + 'px'
            });
        });

        return [containerLeft, containerRight];
    }

    

    my.setChartAreaBackground = function (background, jqPlotter) {
        jqPlotter.chart.chartAreaBackground = background;
        $("#" + jqPlotter.commonProperty.elementId + "_chartdiv").jqChart(jqPlotter.chart);
    }

    return my;
}());

function updateGridAreaPosition(elemID) {
    var chart = $('#' + elemID + '_chartdiv').jqChart('chart');
    var gridArea = chart.gridArea;
    var gridAreaPosition = {
        gridOffsetX: gridArea.x,
        gridOffsetY: gridArea.y,
        gridWidth: gridArea.width,
        gridHeight: gridArea.height
    };

    var commonProperty = $('#' + elemID + '_chartdiv')[0].jqPlotter.commonProperty;
    var old = commonProperty.gridAreaPosition;
    if ((!old)
        || old.gridOffsetX != gridAreaPosition.gridOffsetX
        || old.gridOffsetY != gridAreaPosition.gridOffsetY
        || old.gridWidth != gridAreaPosition.gridWidth
        || old.gridHeight != gridAreaPosition.gridHeight
        ) {
        commonProperty.gridAreaPosition = gridAreaPosition;

        var ee = window.pageProperty.eventEmitter;
        var eventName = commonProperty.elementId + CONSTANT.STRING.eventGridAreaChanged;
        ee.emitEvent(eventName, [gridAreaPosition]);
    }
    return gridAreaPosition;
}

function isConditionMet(mask, bitpattern, equalcondition, quality) {
    var res = mask & quality;
    if (equalcondition) {
        if (mask == 12288) {
            return res == bitpattern;
        }
        else {
            var exp = 1;
            for (var i = 0; i < 32; i++) {
                if ((exp & mask) != 0)
                    break;
                exp = exp << 1;
            }
            return (res == exp * bitpattern);
        }
    }
    else {
        return ((res != 0) == (bitpattern != 0));
    }
}

function removeLineBreakPointIfNecessary(series, jqPlotter, addToFront) {
    //jqPlotter.commonProperty.ringBufferSize
    if(series.data.length < 2){
        return ;
    }
    if (addToFront) {
    }
    else {
        if (series.data.length > 1) {
            var count = 0;
            var i = series.data.length - 1;
            if (series.data[i][CONSTANT.markerTypeIndex] == 'directionalArrow')
                i--;
            for (; i >= 0; i--) {
                if (series.data[i][CONSTANT.markerTypeIndex] == 'lineBreak') {
                    if (jqPlotter.commonProperty.firstUpdatedData) {
                        if (jqPlotter.timeSliderAxis.visibleMinimum > series.data[i][CONSTANT.xIndex]) {
                            count = 0;
                            break;
                        }
                    }
                    count++;
                }
                else {
                    break;
                }
            }
            if (count > 0) {
                series.data.splice(series.data.length - 1 - count, count);
                series.currentPointIndex -= count;
            }
        }
    }
}