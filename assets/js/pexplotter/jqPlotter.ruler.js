var JqPlotter_Ruler = (function () {
    var my = {};

    my.createPlotterLine = function (commonProperty, parentEle) {
        var elemID = commonProperty.elementId;
        var $chartDiv = $('#' + elemID + '_chartdiv');
        var jqPlotter = $chartDiv[0].jqPlotter;
        var rulerLine = $('<div id="' + elemID + '_RulerLine"></div>').addClass("jqPlotter-rulerLine").data('jqPlotter', jqPlotter)
            .appendTo(parentEle);
    }

    my.updateRulerLinePosForClick = updateRulerLinePosForClick;
    function updateRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;

        jqPlotter.commonProperty.rulerOn = !jqPlotter.commonProperty.rulerOn;
        if (jqPlotter.commonProperty.isXYPlot) {
            if (jqPlotter.rulerStatus.isVertical) {
                xyPlotterUpdateVRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv);
            }
            else {//horizontal
                xyPlotterUpdateHRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv);
            }
        }
        else {
            if (jqPlotter.rulerStatus.isVertical) {
                trendPlotterUpdateVRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv);
            }
            else {//horizontal
                trendPlotterUpdateHRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv);
            }
        }
    }

    my.updateRulerLinePosForDblClick = function (jqPlotter, e, gridarea) {
        jqPlotter.rulerStatus.clickCount = 2;
        jqPlotter.rulerStatus.displayMode = 1;
        function testTimeout(jqP) {
            jqP.rulerStatus.clickCount = 0;
        }
        timerId = setTimeout(function () { testTimeout(jqPlotter); }, 500);
        //Create divs for display as tooltips
        createTooltipsForRuler(jqPlotter, gridarea);
        updateRulerLinePosForClick(jqPlotter, e, gridarea);
    }

    my.updateRulerLinePosForTplClick = function (jqPlotter, e, gridarea) {
        jqPlotter.rulerStatus.clickCount = 3;
        jqPlotter.rulerStatus.displayMode = 2;
        updateMouseCursorInfo(jqPlotter, e);

        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.data.length > 0) {
                var theIndex = -1;
                if (jqPlotter.commonProperty.isXYPlot) {
                    if (jqPlotter.rulerStatus.isVertical) {
                        theIndex = searchXValueDataPointForXYPlotter(series.data, getXValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                    }
                    else {
                        theIndex = searchYValueDataPointForXYPlotter(series.data, getYValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                    }
                }
                else {
                    theIndex = searchDataPoint(series.data, getDatetimeByMouseCurvePos(jqPlotter.mouseCursorInfo));
                }

                if (theIndex >= 0) {
                    if (jqPlotter.rulerStatus.isVertical) {
                        updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                    else {
                        if (jqPlotter.commonProperty.isXYPlot) {
                            updateHorizontalRulerTooltipsH(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                        }
                        else{
                        }
                    }
                }
            }
        });
    }

    my.updateRulerLinePosForMouseMove = function (jqPlotter, e) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        if (jqPlotter.commonProperty.rulerOn) { //if ruler on
            if (jqPlotter.commonProperty.isXYPlot) {
                if (jqPlotter.rulerStatus.isVertical) {
                    xyPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e);
                }
                else {//horizontal
                    xyPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e);
                }
            }
            else {
                if (jqPlotter.rulerStatus.isVertical) {
                    trendPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e);
                }
                else {//horizontal
                    trendPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e);
                }
            }
        }
    }

    my.updateRulerLinePosFordaUpdate = function (jqPlotter) {
        if (jqPlotter.commonProperty.rulerOn) {// if ruler on {
            if (jqPlotter.commonProperty.isXYPlot) {
                if (jqPlotter.rulerStatus.isVertical) {
                    xyPlotterUpdateVRulerLinePosFordaUpdate(jqPlotter);
                }
                else {//horizontal
                    xyPlotterUpdateHRulerLinePosFordaUpdate(jqPlotter);
                }
            }
            else {
                if (jqPlotter.rulerStatus.isVertical) {
                    trendPlotterUpdateVRulerLinePosFordaUpdate(jqPlotter);
                }
                else {//horizontal
                }
            }
        }
    }

    //this function update info bar's resolution, endtimestamp, and legend's value and quality
    my.updateInfobarAndLegendForSliderBar = function (timeAxis, jqPlotter) {
        if (jqPlotter.commonProperty.rulerOn) 
            return;
        //Showing information on Legend and inforbar
        var minResolution = 0;
        jqPlotter.visibleSeries.forEach(function (series) {// use zoomAxis.maximum as dest timestamp search the value to show
            var theIndex = searchDataPoint(series.data, timeAxis.visibleMaximum);        //axisSource.actualVisibleMaximum);

            if (theIndex >= 0) {
                series.visibleEndIndex = theIndex;

                // send ruler event so the corresponding legend item can also update its value and quality
                JqPlotter_Ruler.updateRulerValueToLegend(series, theIndex, jqPlotter);
                if (theIndex > 0) {
                    var resolution = series.data[theIndex][0].getTime() - series.data[theIndex - 1][0].getTime();
                    if (resolution < minResolution || minResolution == 0) {
                        minResolution = resolution;
                    }
                }
            }
        });

        JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        JqPlotter_InfoBar.updateEndTimestamp(timeAxis.visibleMaximum, jqPlotter.commonProperty);
    }

    my.dealingWithToggle = function (jqPlotter, e) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        if (jqPlotter.commonProperty.rulerOn) { //if ruler on
            //if the performance couldn't meet requirement
            //correcting the x,y coordinate in variable e make it in the grid area
            //and disable the correcting code in function updateMouseCursorInfo
            if (jqPlotter.commonProperty.isXYPlot) {
                if (jqPlotter.rulerStatus.isVertical) {
                    xyPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e);
                }
                else {//horizontal
                    xyPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e);
                }
            }
            else {
                if (jqPlotter.rulerStatus.isVertical) {
                    showTooltipsForRuler(jqPlotter);
                    trendPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e);
                }
                else {//horizontal
                    hideTooltipsForRuler(jqPlotter);
                    trendPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e);
                }
            }
        }
    }

    my.setPlotterLineProp = function (commonProperty, isVertical) {// set the ruler vertical or horizontal
        rulerLine = $('#' + commonProperty.elementId + '_RulerLine');

        if (isVertical) {
            rulerLine.css('left', 0);
            //if ruler on
            if (commonProperty.rulerOn)
                rulerLine.css('width', 1);
            else
                rulerLine.css('width', 0);
            rulerLine.css('top', 0);
            rulerLine.css('height', commonProperty.gridAreaPosition.gridHeight);
        }
        else {
            rulerLine.css('top', 0);
            //if ruler on
            if (commonProperty.rulerOn)
                rulerLine.css('height', 1);
            else
                rulerLine.css('height', 0);
            rulerLine.css('left', 0);
            rulerLine.css('width', commonProperty.gridAreaPosition.gridWidth);
        }
    }

    my.updateRulerValueToLegend = updateRulerValueToLegend;
    function updateRulerValueToLegend(series, selectedIndex, jqPlotter) {
        var valueForUpdate = series.data[selectedIndex];
        if (jqPlotter.commonProperty.isXYPlot) {
            var val = [];
            val[0] = 0;
            val[1] = valueForUpdate[CONSTANT.xIndex];
            val[2] = valueForUpdate[CONSTANT.qualityIndex];
            var ee = window.pageProperty.eventEmitter;
            var itemChangedEventName = jqPlotter.commonProperty.elementId + "_" + series.itemTagX + "_ValueOnRuler";
            ee.emitEvent(itemChangedEventName, [val]);
            val[1] = valueForUpdate[CONSTANT.yIndex];
            itemChangedEventName = jqPlotter.commonProperty.elementId + "_" + series.itemTagY + "_ValueOnRuler";
            ee.emitEvent(itemChangedEventName, [val]);
        }
        else {
            //valueForUpdate [0]:timestamp [1]:value valueForUpdate[3]:quality
            var val = [];
            val[0] = 0;
            val[1] = valueForUpdate[CONSTANT.yIndex];
            val[2] = valueForUpdate[CONSTANT.qualityIndex];
            var ee = window.pageProperty.eventEmitter;
            var itemChangedEventName = jqPlotter.commonProperty.elementId + "_" + series.itemTag + "_ValueOnRuler";
            ee.emitEvent(itemChangedEventName, [val]);
        }
    }

    function createTooltipsForRuler(jqPlotter, parentEle) {
        var elemID = jqPlotter.commonProperty.elementId;
        //Create tooltips base onto series number
        jqPlotter.visibleSeries.forEach(function (series) {
            var seriesTooltip = $('<div id="' + elemID + '_RulerTooltips"></div>').addClass("jqPlotter-rulerTooltips").data('jqPlotter', jqPlotter)
                    .appendTo(parentEle).css("color", series.strokeStyle);
            series.seriesTooltip = seriesTooltip;
        });
        //jqPlotter.visibleSeries.forEach(function (series) {
        //    var seriesTooltip = $('<div id="' + elemID + '_RulerTooltips"></div>').addClass("jqPlotter-rulerTooltips").data('jqPlotter', jqPlotter)
        //            .appendTo(parentEle).css("background-color", series.strokeStyle);
        //    series.seriesTooltip = seriesTooltip;
        //});
    }

    function hideTooltipsForRuler(jqPlotter) {
        if (jqPlotter.rulerStatus.displayMode < 1)
            return;
        jqPlotter.visibleSeries.forEach(function (series) {
            series.seriesTooltip.css('visibility', 'hidden');
        });
    }

    function showTooltipsForRuler(jqPlotter) {
        if (jqPlotter.rulerStatus.displayMode < 1)
            return;
        jqPlotter.visibleSeries.forEach(function (series) {
            series.seriesTooltip.css('visibility', 'visible');
        });
    }

    function removeTooltipsForRuler(jqPlotter, parentEle) {
        if (jqPlotter.rulerStatus.displayMode < 1)
            return;

        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.seriesTooltip)
                parentEle.removeChild(series.seriesTooltip[0]);
        });
    }

    function getDatetimeByMouseCurvePos(mouseCursorInfo) {
        return new Date((mouseCursorInfo.vMax - mouseCursorInfo.vMin) * (mouseCursorInfo.offsetX) / (mouseCursorInfo.gridAreaRight - mouseCursorInfo.gridAreaLeft) + mouseCursorInfo.vMin);
    }

    function getXValueByMouseCurvePos(mouseCursorInfo) {
        return (mouseCursorInfo.vMax - mouseCursorInfo.vMin) * (mouseCursorInfo.offsetX) / (mouseCursorInfo.gridAreaRight - mouseCursorInfo.gridAreaLeft) + mouseCursorInfo.vMin;
    }

    function getYValueByMouseCurvePos(mouseCursorInfo) {
        return (mouseCursorInfo.vMax - mouseCursorInfo.vMin) * (mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop - mouseCursorInfo.offsetY) / (mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop);
    }

    function searchXValueDataPointForXYPlotter(curveData, dest) {
        //curveData is an 2 dimension array [i][0]->x [i][1]->y [i][3]->timestamp
        //data is sorted by time so the sequence cannot be used here, must check all data and find the nearest value then return the index
        //Math.abs(-7.25)
        if (curveData.length <= 0)
            return -1;
        else if (curveData.length == 1)
            return 0;
        var index = 0;
        var minDis = Math.abs(curveData[0][CONSTANT.xIndex] - dest);
        for (var i = 0; i < curveData.length; i++) {
            var dis = Math.abs(curveData[i][CONSTANT.xIndex] - dest);
            if (minDis > dis) {
                index = i;
                minDis = dis;
            }
            else if (minDis == 0) {
                return i;
            }
        }
        return index;
    }

    function searchYValueDataPointForXYPlotter(curveData, dest) {
        //curveData is an 2 dimension array [i][0]->x [i][1]->y [i][3]->timestamp
        //data is sorted by time so the sequence cannot be used here, must check all data and find the nearest value then return the index
        //Math.abs(-7.25)
        if (curveData.length <= 0)
            return -1;
        else if (curveData.length == 1)
            return 0;
        var index = 0;
        var minDis = Math.abs(curveData[0][CONSTANT.yIndex] - dest);
        for (var i = 0; i < curveData.length; i++) {
            var dis = Math.abs(curveData[i][CONSTANT.yIndex] - dest);
            if (minDis > dis) {
                index = i;
                minDis = dis;
            }
            else if (minDis == 0) {
                return i;
            }
        }
        return index;
    }

    function searchDataPoint(curveData, dest) {
        return searchDataPointInRange(curveData, dest, 0, curveData.length - 1);
    }

    my.searchDataPointInRange = searchDataPointInRange;
    function searchDataPointInRange(curveData, dest, indexBegin, indexEnd) {
        if (indexBegin < 0)
            indexBegin = 0;
        if (indexEnd > curveData.length - 1)
            indexEnd = curveData.length - 1;
        var h = indexEnd,
            l = indexBegin;
        while (l <= h) {
            var m = Math.floor((h + l) / 2);
            if (curveData[m][CONSTANT.xIndex] == dest) {
                return m;
            }
            if (dest > curveData[m][CONSTANT.xIndex]) {
                l = m + 1;
            } else {
                h = m - 1;
            }
        }
        if (l >= indexEnd)
            l = indexEnd;
        return l;
    }

    function updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, mouseCursorInfo) {
        if (!series.seriesTooltip)
            return;

        var valueOnRuler = series.data[theIndex];
        var rulerDisplayMode = jqPlotter.rulerStatus.displayMode;

        var formattedValue = CommonFunction.formatItemValue(valueOnRuler[CONSTANT.yIndex],
                        false,
                        series.numDecimalsY);

        //update tooltip
        if (rulerDisplayMode == 1) {
            series.seriesTooltip[0].innerText = formattedValue.toString();
        }
        else if (rulerDisplayMode == 2) {
            var xyString;
            if (jqPlotter.commonProperty.isXYPlot) {
                var formattedValueX = CommonFunction.formatItemValue(valueOnRuler[CONSTANT.xIndex],
                    false,
                    series.numDecimalsX);
                xyString = "y: " + formattedValue.toString() + " x: " + formattedValueX.toString(); //y: val x: val
            }
            else {
                xyString = "y: " + formattedValue.toString() + " x: " + valueOnRuler[CONSTANT.xIndex].toLocaleTimeString(); //y: val x: time
            }

            series.seriesTooltip[0].innerText = xyString;
        }

        var tooltipsTop = getVerticalCoordination(jqPlotter, series, valueOnRuler[CONSTANT.yIndex], mouseCursorInfo);
        series.seriesTooltip.css("top", correctionVerticalCoordinateForTooltips(series.seriesTooltip, tooltipsTop, mouseCursorInfo, jqPlotter.visibleSeries));
    }

    function updateVerticalRulerTooltipsH(jqPlotter, mouseCursorInfo) {
        if (jqPlotter.rulerStatus.displayMode < 1)
            return;

        //update all tooltips H coordination
        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.seriesTooltip)
                series.seriesTooltip.css("left", correctionHorizontalCoordinateForTooltips(series.seriesTooltip, mouseCursorInfo.offsetX, mouseCursorInfo));
        });
    }

    function updateHorizontalRulerTooltipsV(jqPlotter, mouseCursorInfo) {
        if (jqPlotter.rulerStatus.displayMode < 1)
            return;

        //update all tooltips Vertical coordination
        tooltipsTop = mouseCursorInfo.offsetY;
        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.seriesTooltip)
                series.seriesTooltip.css("top", correctionVerticalCoordinateForTooltips(series.seriesTooltip, tooltipsTop, mouseCursorInfo, jqPlotter.visibleSeries));
        })
    }

    function updateHorizontalRulerTooltipsH(series, theIndex, jqPlotter, mouseCursorInfo) { //caller must be xyplotter
        var valueOnRuler = series.data[theIndex];
        var rulerDisplayMode = jqPlotter.rulerStatus.displayMode;

        var formattedValue = CommonFunction.formatItemValue(valueOnRuler[CONSTANT.yIndex],
                        false,
                        series.numDecimalsY);
        var formattedValueX = 0;
        if (jqPlotter.commonProperty.isXYPlot) {
            formattedValueX = CommonFunction.formatItemValue(valueOnRuler[CONSTANT.xIndex],
            false,
            series.numDecimalsX);
        }
        if (rulerDisplayMode == 1) {
            series.seriesTooltip[0].innerText = formattedValueX.toString();
        }
        else if (rulerDisplayMode == 2) {
            var xyString;
            xyString = "y: " + formattedValue.toString() + " x: " + formattedValueX.toString(); //y: val x: val
            series.seriesTooltip[0].innerText = xyString;
        }
        var tooltipsLeft = getHorizontalCoordination(jqPlotter, series, valueOnRuler[CONSTANT.xIndex], mouseCursorInfo);
        series.seriesTooltip.css("left", correctionHorizontalCoordinateForTooltips(series.seriesTooltip, tooltipsLeft, mouseCursorInfo));
    }

    function checkConflict(cTop, cBottom, top, bottom) {
        if (top < cBottom && top >= cTop) {
            return -1; //under conflictArea
        }
        else {
            if (bottom <= cBottom && bottom > cTop) {
                return 1;//above conflictArea
            }
        }
        return 0; // no conflicts
    }

    function expendConflictArea(positionCode, conflictArea, newTop, newBottom) {
        if (conflictArea.top == 0 && conflictArea.bottom == 0) {
            conflictArea.top = newTop;
            conflictArea.bottom = newBottom;
        }
        else {
            if (conflictArea.top > newTop) {
                conflictArea.top = newTop;
            }
            if(conflictArea.bottom < newBottom){
                conflictArea.bottom = newBottom;
            }
        }
        return conflictArea;
    }

    function checkAndDealWithPositionConflicts(theTooltip, tooltipsTop, mouseCursorInfo, series)
    {
        if (series.length <= 0)
            return 0;
        //assume there has no conflicts before theTooltip's top value has been sat(there could have conflicts at first but will not influent function work)
        var currentTop = tooltipsTop;
        var currentBottom = currentTop + theTooltip.height();
        var lowerPriority = true;
        var conflictArea = { top: 0, bottom: 0 }; // conflict area will only expend shall never be reduced
        //check if there's some other tooltips conflict with this postision
        //tooltip with lower index value holds higher priority.
        for (var i = 0; i < series.length; i++) {
            if (series[i].seriesTooltip === theTooltip){
                lowerPriority = false;//current curve // after this step current tooltip have higher priority than those after
                tooltipsTop = currentTop;
            }
            else {
                var top = parseInt(series[i].seriesTooltip.css('top'));
                var bottom = top + series[i].seriesTooltip.height();
                if (lowerPriority) {
                    var conflictCode = checkConflict(top, bottom, currentTop, currentBottom);
                    if(conflictCode != 0){
                        conflictArea = expendConflictArea(conflictCode, conflictArea, top, bottom);
                        var conflictCode1 = checkConflict(conflictArea.top, conflictArea.bottom, currentTop, currentBottom);
                        if (conflictCode1 == 1) {
                            currentBottom = conflictArea.top;
                            currentTop = currentBottom - theTooltip.height();
                            if(currentTop < 0)
                                conflictCode1 = -1;
                        }
                        if (conflictCode == -1) {//else if (conflictCode == -1)
                            currentTop = conflictArea.bottom;
                            currentBottom = currentTop + theTooltip.height();
                            if (currentBottom > mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop) {
                                currentBottom = conflictArea.top;
                                currentTop = currentBottom - theTooltip.height();
                            }
                        }
                    }
                }
                else {// Current tooltip have higher priority
                    //here currentTop/Bottom means last tooltip's top/bottom
                    var conflictCode = checkConflict(currentTop, currentBottom, top, bottom);
                    if (conflictCode != 0) {
                        conflictArea = expendConflictArea(conflictCode, conflictArea, currentTop, currentBottom);
                        var conflictCode1 = checkConflict(conflictArea.top, conflictArea.bottom, top, top);
                        if (conflictCode1 == 1) {
                            bottom = conflictArea.top;
                            top = bottom - series[i].seriesTooltip.height();
                            if (top < 0)
                                conflictCode1 = -1;
                        }
                        if (conflictCode == -1) {//else if (conflictCode == -1)
                            top = conflictArea.bottom;
                            bottom = top + series[i].seriesTooltip.height();
                            if (currentBottom > mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop) {
                                bottom = conflictArea.top;
                                top = currentBottom - series[i].seriesTooltip.height();
                            }
                        }
                        //set
                        if (series[i].seriesTooltip.css('top') != top) {//set conflicted tooltips position
                            series[i].seriesTooltip.css('top',top)
                        }
                        currentTop = top;
                        currentBottom = bottom;
                    }
                }
            }
        }
        return tooltipsTop;
    }

    function correctionVerticalCoordinateForTooltips(theTooltip, tooltipsTop, mouseCursorInfo, series) {
        var gridHeight = mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop;
        if (tooltipsTop + theTooltip.height() >= gridHeight) {
            tooltipsTop = tooltipsTop - theTooltip.height();
            if (tooltipsTop > gridHeight) {
                tooltipsTop = gridHeight - theTooltip.height();
            }
        }
        if (tooltipsTop < 0)
            tooltipsTop = 0;
        tooltipsTop = checkAndDealWithPositionConflicts(theTooltip, tooltipsTop, mouseCursorInfo, series);
        return tooltipsTop;
        
    }

    function correctionHorizontalCoordinateForTooltips(theTooltip, tooltipsLeft, mouseCursorInfo) {
        var gridWidth = mouseCursorInfo.gridAreaRight - mouseCursorInfo.gridAreaLeft;
        if ((tooltipsLeft + theTooltip.width()) >= gridWidth) {
            tooltipsLeft = tooltipsLeft - theTooltip.width();
            if (tooltipsLeft > gridWidth) {
                tooltipsLeft = gridWidth - theTooltip.width();
            }
        }
        if (tooltipsLeft < 0) {
            tooltipsLeft = 0;
        }
        return tooltipsLeft;
    }

    my.getVerticalCoordination = getVerticalCoordination;
    function getVerticalCoordination(jqPlotter, series, valueOnRuler, mouseCursorInfo) {
        var axisY = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesY);
        if (!axisY)
            return 0;
        var yVmax = axisY.visibleMaximum;
        var yVmin = axisY.visibleMinimum;
        var height = (mouseCursorInfo.gridAreaBottom - mouseCursorInfo.gridAreaTop);
        return height - height * (valueOnRuler - yVmin) / (yVmax - yVmin);
    }

    my.getHorizontalCoordination = getHorizontalCoordination;
    function getHorizontalCoordination(jqPlotter, series, valueOnRuler, mouseCursorInfo) {
        var axisX = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesX);
        if (!axisX)
            return 0;
        var xVmax = axisX.visibleMaximum;
        var xVmin = axisX.visibleMinimum;
        var width = (mouseCursorInfo.gridAreaRight - mouseCursorInfo.gridAreaLeft);
        return width * (valueOnRuler - xVmin) / (xVmax - xVmin);
    }

    function updateMouseCursorInfo(jqPlotter, e) {
        var plotterX = document.getElementById(jqPlotter.commonProperty.elementId + "_chartdiv").getBoundingClientRect().left;
        var plotterY = document.getElementById(jqPlotter.commonProperty.elementId + "_chartdiv").getBoundingClientRect().top;
        //var plotterX1 = jqPlotter.left;
        var chart = $("#" + jqPlotter.elm.id + "_chartdiv").jqChart('chart');
        var gridArea = chart.gridArea;
        jqPlotter.mouseCursorInfo.offsetX = e.clientX - gridArea.x - plotterX;
        jqPlotter.mouseCursorInfo.offsetY = e.clientY - gridArea.y - plotterY;
        /////////////////////////////////////if performance couldn't meet needs implement this sector in function dealingWithToggle
        if (jqPlotter.mouseCursorInfo.offsetX < 0)
            jqPlotter.mouseCursorInfo.offsetX = 0;
        if (jqPlotter.mouseCursorInfo.offsetX > gridArea.width)
            jqPlotter.mouseCursorInfo.offsetX = gridArea.width;
        if (jqPlotter.mouseCursorInfo.offsetY < 0)
            jqPlotter.mouseCursorInfo.offsetY = 0;
        if (jqPlotter.mouseCursorInfo.offsetY > gridArea.height)
            jqPlotter.mouseCursorInfo.offsetY = gridArea.height;
        //////////////////////////////////////
        if (jqPlotter.rulerStatus.isVertical) {
            jqPlotter.mouseCursorInfo.vMax = jqPlotter.visibleAxesX[0].visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = jqPlotter.visibleAxesX[0].visibleMinimum;
        }
        else {
            jqPlotter.mouseCursorInfo.vMax = jqPlotter.visibleAxesY[0].visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = jqPlotter.visibleAxesY[0].visibleMinimum;
        }
        jqPlotter.mouseCursorInfo.gridAreaLeft = gridArea.x;
        jqPlotter.mouseCursorInfo.gridAreaTop = gridArea.y;
        jqPlotter.mouseCursorInfo.gridAreaRight = gridArea.x + gridArea.width;
        jqPlotter.mouseCursorInfo.gridAreaBottom = gridArea.height + gridArea.y;
    }

    function trendPlotterUpdateVRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        rulerLine = $('#' + jqPlotter.commonProperty.elementId + '_RulerLine');
        //jqPlotter.visibleAxesX[0].plotLines[i].visible = jqPlotter.commonProperty.rulerOn;
        if (jqPlotter.commonProperty.rulerOn) {
            updateMouseCursorInfo(jqPlotter, e);
            //set plotterline pos.
            rulerLine.css("left", jqPlotter.mouseCursorInfo.offsetX);
            //update horizental coordination of tooltips
            jqPlotter.visibleSeries.forEach(function (series) {
                series.latestDataPointIndex = -1;
            });
            updateVerticalRulerTooltipsH(jqPlotter, jqPlotter.mouseCursorInfo);
            updateDisplayComponentsForTrendVerticalRuler(jqPlotter);
            rulerLine.css('width', 1);
        }
        else {
            rulerLine.css('width', 0);

            removeTooltipsForRuler(jqPlotter, gridAreaContainerDiv);
        }
    }

    function trendPlotterUpdateHRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        rulerLine = $('#' + jqPlotter.commonProperty.elementId + '_RulerLine');
        //jqPlotter.visibleAxesX[0].plotLines[i].visible = jqPlotter.commonProperty.rulerOn;
        if (jqPlotter.commonProperty.rulerOn) {
            updateMouseCursorInfo(jqPlotter, e);
            //var minResolution = 0;
            //set plotterline pos.
            rulerLine.css("top", jqPlotter.mouseCursorInfo.offsetY);
            //update horizental coordination of tooltips
            //updateHorizontalRulerTooltipsV(jqPlotter, jqPlotter.mouseCursorInfo);
            //updateDisplayComponentsForTrendHorizontal(jqPlotter);
            rulerLine.css('height', 1);
        }
        else {
            rulerLine.css('height', 0);
            removeTooltipsForRuler(jqPlotter, gridAreaContainerDiv);
        }
    }

    function trendPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e) {
        updateMouseCursorInfo(jqPlotter, e);
        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("left", jqPlotter.mouseCursorInfo.offsetX);

        updateVerticalRulerTooltipsH(jqPlotter, jqPlotter.mouseCursorInfo);

        throttle(updateDisplayComponentsForTrendVerticalRuler, this, [jqPlotter]);
    }

    function trendPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e) {
        updateMouseCursorInfo(jqPlotter, e);
        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("top", jqPlotter.mouseCursorInfo.offsetY);
    }

    function trendPlotterUpdateVRulerLinePosFordaUpdate(jqPlotter) {
        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("left", jqPlotter.mouseCursorInfo.offsetX);
        jqPlotter.mouseCursorInfo.vMax = jqPlotter.timeSliderAxis.visibleMaximum;
        jqPlotter.mouseCursorInfo.vMin = jqPlotter.timeSliderAxis.visibleMinimum;
        var rulerTimestamp = getDatetimeByMouseCurvePos(jqPlotter.mouseCursorInfo);

        var minResolution = 0;
        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.data.length > 0) {
                var theIndex = searchDataPoint(series.data, rulerTimestamp);
                if (theIndex >= 0) {
                    series.latestDataPointIndex = theIndex;

                    //calculate resolution
                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.xIndex].getTime() - series.data[theIndex - 1][CONSTANT.xIndex].getTime();
                        if (resolution < minResolution || minResolution == 0)
                            minResolution = resolution;
                    }

                    //update value and quality in infor bar
                    updateRulerValueToLegend(series, theIndex, jqPlotter);

                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update vertical coordination of tooltips and value in the tooltips
                        updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });

        //update resolution
        JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);

        //update timestamp
        JqPlotter_InfoBar.updateTimestampOnInfoBar(rulerTimestamp.getTime(), jqPlotter.commonProperty);
    }

    function trendPlotterUpdateHRulerLinePosFordaUpdate(jqPlotter) {

    }

    function xyPlotterUpdateVRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv) {//respond for vertical ruler
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        rulerLine = $('#' + jqPlotter.commonProperty.elementId + '_RulerLine');
        //jqPlotter.visibleAxesX[0].plotLines[i].visible = jqPlotter.commonProperty.rulerOn;
        if (jqPlotter.commonProperty.rulerOn) {
            updateMouseCursorInfo(jqPlotter, e);
            //set plotterline pos.
            rulerLine.css("left", jqPlotter.mouseCursorInfo.offsetX);
            //update horizental coordination of tooltips
            updateVerticalRulerTooltipsH(jqPlotter, jqPlotter.mouseCursorInfo);
            jqPlotter.visibleSeries.forEach(function (series) {
                series.latestDataPointIndex = -1;
            });
            updateDisplayComponentsForxyPlotterVerticalRuler(jqPlotter);
            rulerLine.css('width', 1);
        }
        else {
            rulerLine.css('width', 0);
            removeTooltipsForRuler(jqPlotter, gridAreaContainerDiv);
        }
    }

    function xyPlotterUpdateVRulerLinePosForMouseMove(jqPlotter, e) {
        updateMouseCursorInfo(jqPlotter, e);
        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("left", jqPlotter.mouseCursorInfo.offsetX);
        updateVerticalRulerTooltipsH(jqPlotter, jqPlotter.mouseCursorInfo);
        throttle(updateDisplayComponentsForxyPlotterVerticalRuler, this, [jqPlotter]);
    }

    function xyPlotterUpdateVRulerLinePosFordaUpdate(jqPlotter) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;

        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("left", jqPlotter.mouseCursorInfo.offsetX);
        //jqPlotter.mouseCursorInfo.vMax = jqPlotter.visibleAxesX[0].visibleMaximum;
        //jqPlotter.mouseCursorInfo.vMin = jqPlotter.visibleAxesX[0].visibleMinimum;
        var minResolution = 0;
        var theIndexChanged = true;
        jqPlotter.visibleSeries.forEach(function (series) {
            var axisX = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesX);
            if (!axisX)
                return;

            jqPlotter.mouseCursorInfo.vMax = axisX.visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = axisX.visibleMinimum;
            if (series.data.length > 0) {
                var theIndex = searchXValueDataPointForXYPlotter(series.data, getXValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                if (theIndex >= 0) {
                    //jqPlotter.mouseCursorInfo.lastDataPointIndex.set(ii, theIndex);
                    series.latestDataPointIndex = theIndex;
                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.timestampIndex] - series.data[theIndex - 1][CONSTANT.timestampIndex];
                        if (resolution < minResolution || minResolution == 0) {
                            minResolution = resolution;
                        }
                    }

                    updateRulerValueToLegend(series, theIndex, jqPlotter);

                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update vertical coordination of tooltips and value in the tooltips
                        updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });

        if (theIndexChanged) {
            JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        }
    }

    function xyPlotterUpdateHRulerLinePosForClick(jqPlotter, e, gridAreaContainerDiv) {//respond for horizontal ruler
        if (jqPlotter.visibleAxesX.length < 1)
            return;
        rulerLine = $('#' + jqPlotter.commonProperty.elementId + '_RulerLine');
        //jqPlotter.visibleAxesX[0].plotLines[i].visible = jqPlotter.commonProperty.rulerOn;
        if (jqPlotter.commonProperty.rulerOn) {
            updateMouseCursorInfo(jqPlotter, e);
            //set plotterline pos.
            rulerLine.css("top", jqPlotter.mouseCursorInfo.offsetY);

            //update horizental coordination of tooltips
            updateHorizontalRulerTooltipsV(jqPlotter, jqPlotter.mouseCursorInfo);
            jqPlotter.visibleSeries.forEach(function (series) {
                series.latestDataPointIndex = -1;
            });
            updateDisplayComponentsForxyPlotterHorizontalRuler(jqPlotter);
            rulerLine.css('height', 1);
        }
        else {
            rulerLine.css('height', 0);
            removeTooltipsForRuler(jqPlotter, gridAreaContainerDiv);
        }
    }

    function xyPlotterUpdateHRulerLinePosForMouseMove(jqPlotter, e) { // for horizontal ruler
        updateMouseCursorInfo(jqPlotter, e);
        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("top", jqPlotter.mouseCursorInfo.offsetY);
        updateHorizontalRulerTooltipsV(jqPlotter, jqPlotter.mouseCursorInfo);
        throttle(updateDisplayComponentsForxyPlotterHorizontalRuler, this, [jqPlotter]);
    }

    function xyPlotterUpdateHRulerLinePosFordaUpdate(jqPlotter) {
        if (jqPlotter.visibleAxesX.length < 1)
            return;

        $('#' + jqPlotter.commonProperty.elementId + '_RulerLine').css("top", jqPlotter.mouseCursorInfo.offsetY);

        var minResolution = 0;
        var theIndexChanged = true;
        jqPlotter.visibleSeries.forEach(function (series) {
            var axisX = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesX);
            if (!axisX)
                return;

            jqPlotter.mouseCursorInfo.vMax = axisX.visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = axisX.visibleMinimum;

            if (series.data.length > 0) {
                var theIndex = searchYValueDataPointForXYPlotter(series.data, getYValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                if (theIndex >= 0) {
                    series.latestDataPointIndex = theIndex;

                    //calculate resolution
                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.timestampIndex] - series.data[theIndex - 1][CONSTANT.timestampIndex];
                        if (resolution < minResolution || minResolution == 0) {
                            minResolution = resolution;
                        }
                    }

                    updateRulerValueToLegend(series, theIndex, jqPlotter);
                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update horizontal coordination of tooltips and value in the tooltips
                        updateHorizontalRulerTooltipsH(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });
        if (theIndexChanged) {
            JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        }
    }

    function updateDisplayComponentsForTrendVerticalRuler(jqPlotter) {
        var minResolution = 0;
        var theIndexChanged = true;

        jqPlotter.mouseCursorInfo.vMax = jqPlotter.timeSliderAxis.visibleMaximum;
        jqPlotter.mouseCursorInfo.vMin = jqPlotter.timeSliderAxis.visibleMinimum;
        var rulerTimestamp = getDatetimeByMouseCurvePos(jqPlotter.mouseCursorInfo);

        //return value on the ruler should according to the specific axes that the curve belong
        //means should calculate each value for each curve based on the axis the curve corresponding
        jqPlotter.visibleSeries.forEach(function (series) {
            if (series.data.length > 0) {
                var theIndex = searchDataPoint(series.data, rulerTimestamp);
                if (series.latestDataPointIndex != theIndex)
                    theIndexChanged = true;
                else
                    theIndexChanged = false;

                if (theIndex >= 0 && theIndexChanged) {
                    series.latestDataPointIndex = theIndex;

                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.xIndex].getTime() - series.data[theIndex - 1][CONSTANT.xIndex].getTime();
                        if (resolution < minResolution || minResolution == 0) {
                            minResolution = resolution;
                        }
                    }

                    updateRulerValueToLegend(series, theIndex, jqPlotter);
                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update vertical coordination of tooltips and value in the tooltips
                        updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });

        if (theIndexChanged) {
            JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        }
    }

    function updateDisplayComponentsForTrendHorizontalRuler(jqPlotter) {
    }

    function updateDisplayComponentsForxyPlotterVerticalRuler(jqPlotter) {
        var minResolution = 0;
        var theIndexChanged = true;
        //return value on the ruler should according to the specific axes that the curve belong
        //means should calculate each value for each curve based on the axis the curve corresponding
        jqPlotter.visibleSeries.forEach(function (series) {
            var axisX = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesX);
            if (!axisX)
                return;
            jqPlotter.mouseCursorInfo.vMax = axisX.visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = axisX.visibleMinimum;

            if (series.data.length > 0) {
                var theIndex = searchXValueDataPointForXYPlotter(series.data, getXValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                if (series.latestDataPointIndex != theIndex)
                    theIndexChanged = true;
                else
                    theIndexChanged = false;

                if (theIndex >= 0 && theIndexChanged) {
                    series.latestDataPointIndex = theIndex;

                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.timestampIndex] - series.data[theIndex - 1][CONSTANT.timestampIndex];
                        if (resolution < minResolution || minResolution == 0) {
                            minResolution = resolution;
                        }
                    }

                    updateRulerValueToLegend(series, theIndex, jqPlotter);
                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update vertical coordination of tooltips and value in the tooltips
                        updateVerticalRulerTooltipsV(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });

        if (theIndexChanged) {
            JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        }
    }

    function updateDisplayComponentsForxyPlotterHorizontalRuler(jqPlotter) {
        var minResolution = 0;
        var theIndexChanged = false;
        //return value on the ruler should according to the specific axes that the curve belong
        //means should calculate each value for each curve based on the axis the curve corresponding
        jqPlotter.visibleSeries.forEach(function (series) {
            var axisY = getAxisByMergedCurveIndex(series.curveIndex, jqPlotter.allAxesY);
            if (!axisY)
                return;
            jqPlotter.mouseCursorInfo.vMax = axisY.visibleMaximum;
            jqPlotter.mouseCursorInfo.vMin = axisY.visibleMinimum;

            if (series.data.length > 0) {
                var theIndex = searchYValueDataPointForXYPlotter(series.data, getYValueByMouseCurvePos(jqPlotter.mouseCursorInfo));
                //if (jqPlotter.mouseCursorInfo.lastDataPointIndex.get(ii) != theIndex) 
                if (series.latestDataPointIndex != theIndex)
                    theIndexChanged = true;
                else
                    theIndexChanged = false;

                if (theIndex >= 0 && theIndexChanged) {
                    //jqPlotter.mouseCursorInfo.lastDataPointIndex.set(ii, theIndex);
                    series.latestDataPointIndex = theIndex;

                    if (theIndex > 0) {
                        var resolution = series.data[theIndex][CONSTANT.timestampIndex] - series.data[theIndex - 1][CONSTANT.timestampIndex];
                        if (resolution < minResolution || minResolution == 0) {
                            minResolution = resolution;
                        }
                    }

                    updateRulerValueToLegend(series, theIndex, jqPlotter);
                    if (jqPlotter.rulerStatus.displayMode == 1 || jqPlotter.rulerStatus.displayMode == 2) {
                        //update vertical coordination of tooltips and value in the tooltips
                        updateHorizontalRulerTooltipsH(series, theIndex, jqPlotter, jqPlotter.mouseCursorInfo);
                    }
                }
            }
        });

        if (theIndexChanged) {
            JqPlotter_InfoBar.updateResolution(minResolution, jqPlotter.commonProperty);
        }
    }

    return my;
}());

function MouseCursorInfo(offsetX, offsetY, vMax, vMin, gridAreaLeft, gridAreaTop, gridAreaRight, gridAreaBottom) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.vMax = vMax;
    this.vMin = vMin;
    this.gridAreaLeft = gridAreaLeft;
    this.gridAreaTop = gridAreaTop;
    this.gridAreaRight = gridAreaRight;
    this.gridAreaBottom = gridAreaBottom;
};

function RulerStatusInfo(displayMode, clickCount, isVertical) {
    this.displayMode = displayMode; //0:no tooltips 1:tooltips show x or y value 2:tooltips show x and y value
    this.clickCount = clickCount;
    this.isVertical = isVertical;
};