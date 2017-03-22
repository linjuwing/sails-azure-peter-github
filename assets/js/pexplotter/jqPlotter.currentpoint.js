function updateArrowStatusAndPosition(jqPlotter) { //call this function at daupdate
    var chart = $("#" + jqPlotter.elm.id + "_chartdiv").jqChart('chart');
    var gridArea = chart.gridArea;
    jqPlotter.mouseCursorInfo.gridAreaLeft = gridArea.x;
    jqPlotter.mouseCursorInfo.gridAreaTop = gridArea.y;
    jqPlotter.mouseCursorInfo.gridAreaRight = gridArea.x + gridArea.width;
    jqPlotter.mouseCursorInfo.gridAreaBottom = gridArea.height + gridArea.y;
    //add a fake point to show arrow
    //use currentPointIndex to record the fake point
    jqPlotter.visibleSeries.forEach(function (series) {
        if (series.appearanceProperty.markCurrentPoint) {//series.appearanceProperty.markCurrentPoint is the switch condition which defines whether show arrow or not
            if (series.data.length > 0) {
                if (jqPlotter.commonProperty.isXYPlot) {//xyPlotter 
                    if (series.data.length > 1) {

                        if (series.currentPointIndex != undefined &&
                            series.data[series.data.length - 1][CONSTANT.markerTypeIndex] != null &&
                            series.data[series.data.length - 1][CONSTANT.markerTypeIndex] != undefined &&
                            series.data[series.data.length - 1][CONSTANT.markerTypeIndex] == 'lineBreak') {
                            //clearDirectionalArrowMarkerOfSeries(series.originalXYData, series.currentPointIndex); //uncomment this to remove last arrow when linebreaking 
                        }
                        else {
                            if (series.currentPointIndex != null && series.currentPointIndex >= 0)
                                clearPointMarkersOfSeries(series.originalXYData, series.currentPointIndex);
                            series.currentPointIndex = series.originalXYData.length - 1;
                            var rotateAngle = 0;
                            if (series.currentPointAngle != undefined && series.currentPointAngle != null) {
                                rotateAngle = series.currentPointAngle;
                            }
                            else {
                                rotateAngle = calculateAngle(jqPlotter, series, jqPlotter.mouseCursorInfo);
                            }
                            series.data[series.data.length - 1][CONSTANT.markerTypeIndex] = "directionalArrow";
                            series.data[series.data.length - 1][CONSTANT.arrowMarkerAngle] = rotateAngle;
                            series.data[series.data.length - 1][CONSTANT.markerRadius] = 5;
                        }
                    }
                }
                else {//trendPlotter
                    if (series.data.length > 1) {
                        removeFakePoint(series);
                        createFakePoint(series,jqPlotter);
                    }
                }
            }
        }
    });
}

function removeFakePoint(series) {
    if (series.currentPointIndex != null && series.currentPointIndex >= 0)
        series.data.splice(series.currentPointIndex,1);
}
function createFakePoint(series, jqPlotter) {
     
    series.currentPointIndex = series.data.length;
    var rotateAngle = 0;
    if (series.currentPointAngle != undefined && series.currentPointAngle != null) {
        rotateAngle = series.currentPointAngle;
    }
    else{
        rotateAngle = calculateAngle(jqPlotter, series, jqPlotter.mouseCursorInfo);
    }

    series.data[series.currentPointIndex] = new Array();
    for (var i = 0; i < series.data[series.currentPointIndex - 1].length; i++) {
        series.data[series.currentPointIndex][i] = series.data[series.currentPointIndex - 1][i];
    }
    //series.data[series.currentPointIndex] = JSON.parse(JSON.stringify(series.data[series.data.length - 1]));
    series.data[series.currentPointIndex][CONSTANT.markerTypeIndex] = "directionalArrow";
    series.data[series.currentPointIndex][CONSTANT.arrowMarkerAngle] = rotateAngle;
    series.data[series.currentPointIndex][CONSTANT.markerRadius] = 5;
}

function clearPointMarkersOfSeries(data, index) {
    if (index != null && index >= 0 && data[index][CONSTANT.markerTypeIndex]) {
        if (data[index][CONSTANT.imageIndex] != undefined && data[index][CONSTANT.imageIndex] != null && data[index][CONSTANT.imageIndex].length > 0) {
            data[index][CONSTANT.markerTypeIndex] = 'image';
            data[index][CONSTANT.arrowMarkerAngle] = null;
            data[index][CONSTANT.markerRadius] = null;
        }
        else {
            data[index][CONSTANT.markerTypeIndex] = null;
            data[index][CONSTANT.arrowMarkerAngle] = null;
            data[index][CONSTANT.markerRadius] = null;
        }
    }
}

function clearDirectionalArrowMarkerOfSeries(data, index) {
    if (index != null && index >= 0 && data[index][CONSTANT.markerTypeIndex] == 'directionalArrow') {
        data[index][CONSTANT.markerTypeIndex] = null;
        data[index][CONSTANT.arrowMarkerAngle] = null;
        data[index][CONSTANT.markerRadius] = null;
    }
}

function clearAllArrowMarkers(series) {
    for (var i = 0; i < series.data.length; i++) {
        if (series.data[i][CONSTANT.markerTypeIndex] != undefined || series.data[i][CONSTANT.markerTypeIndex] != null) {
            if (series.data[i][CONSTANT.markerTypeIndex] == 'directionalArrow'){
                series.data[i][CONSTANT.markerTypeIndex] = null;
                series.data[i][CONSTANT.arrowMarkerAngle] = null;
                series.data[i][CONSTANT.markerRadius] = null;
            }
        }
    }
}

function calculateAngle(jqPlotter, series, mouseCursorInfo) {
    var x0 = JqPlotter_Ruler.getHorizontalCoordination(jqPlotter, series, series.data[series.data.length - 1][0], mouseCursorInfo);
    var y0 = JqPlotter_Ruler.getVerticalCoordination(jqPlotter, series, series.data[series.data.length - 1][1], mouseCursorInfo);
    var x1 = JqPlotter_Ruler.getHorizontalCoordination(jqPlotter, series, series.data[series.data.length - 2][0], mouseCursorInfo);
    var y1 = JqPlotter_Ruler.getVerticalCoordination(jqPlotter, series, series.data[series.data.length - 2][1], mouseCursorInfo);
    if(x0 >= x1)
        return Math.atan((y1 - y0) / (x1 - x0));
    else
        return Math.atan((y1 - y0) / (x1 - x0)) + Math.PI;
}
