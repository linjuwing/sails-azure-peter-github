var jqPlotterConstants = {
    defaults: {
        curvePenSize: 1,
        yAxisLabelPenSize: 1,
        yAxisTickmarkPenSize: 1,
        xAxisLabelPenSize: 1,
        xAxisTickmarkPenSize: 1,
        legendBorderLineWidth: 1,
        yAxisTickmarkLength: 6,
        xAxisTickmarkLength: 6,
        marginBtwAsixLabelAndTickmark: 7,
        curveAlpha: 0.5,
    },
}

var CONSTANT = (function () {
    var my = {};

    my.STRING = {
        eventRemoveSeries: "_RemoveSeries",
        eventGridAreaChanged: "_GridAreaChanged",
        eventResetZoom: "_ResetZoom",
        eventZoomStatusChanged: "_ZoomStatusChanged",
    };

    var jqPlotterItemTypes = {
        curve: 1,
        timeReference: 2,
        rangeLoX: 3,
        rangeHiX: 4,
        rangeLoY: 5,
        rangeHiY: 6,
        resetBuffer: 7,
        visibleDataPoint: 8,
        itemAttribute: 9,
        timeReferenceArray: 10,
        orientation: 11,
    };

    var plotLineTypes = {
        timeReferenceMarkTime: 1,
        staticLine: 2,
        rulerLine: 3,
        attributeLine: 4,
    };

    var areaRangeTo = {
        Next: 'Range_Next',
        Previous: 'Range_Previous',
    }

    var legendElementTypes = {
        deleteButton: "DeleteButtons",
        curveType: "CurveType",
        itemName: "ItemName",
        value: "Value",
        unit: "Unit",
        quality: "Quality",
        description: "Descption",
    };

    my.seriesTypes = {
        curve: 1,
        itemAttribute: 3,
    };

    my.legendAppearance = {
        trHeight: 16,
        tdBorderWidth: 1,
        tableBorderWidth: 1,
        marginBottom: 1
    };

    my.jqPlotterItemTypes = jqPlotterItemTypes;
    my.plotLineTypes = plotLineTypes;
    my.areaRangeTo = areaRangeTo;
    my.legendElementTypes = legendElementTypes;


    my.xIndex = 0; //this value is used in jqChart.js must not be changed
    my.yIndex = 1; //this value is used in jqChart.js must not be changed
    my.rangeToIndex = 2; //this value is used in jqChart.js must not be changed
    my.qualityIndex = 3;
    my.markerTypeIndex = 4; 
    my.markerRadius = 5;
    my.arrowMarkerAngle = 6;
    my.imageIndex = 7;
    my.timestampIndex = 8;

    return my;
}());