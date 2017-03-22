function printChart(jqPlotter_chartdiv) {
    var newWindow = window.open("");
    html2canvas(jqPlotter_chartdiv.parent().get(0)).then(function (canvas) {
        var dataURL = canvas.toDataURL('image/png');
        newWindow.document.write('<img src="' + dataURL + '"/>');
        newWindow.document.close();
        newWindow.window.print();
    });
}

function saveChartToFile(jqPlotter_chartdiv) {
    html2canvas(jqPlotter_chartdiv.parent().get(0)).then(function (canvas) {
        var dataurl = canvas.toDataURL('image/png');      

        var a = $("<a href='#' class='button' id='btn-download'> Download </a>").appendTo(document.body).hide();
        if (typeof a.get(0).download != "undefined") {
            // this browser supports html5 "download" attribute, save to file directl
            a.attr('href', dataurl);
            a.attr('download', window.location.pathname.split("/").pop().match(/(.*)\.aspx/)[1] + ".png");
            a.get(0).click();
        } else {
            // otherwise open a tab to show the image
            var image = new Image();
            image.src = dataurl;
            var newWindow = window.open("");
            newWindow.document.write(image.outerHTML);
        }
    });
}

function getStringOfDataPointForTrend(dataPoint, numDecimals) {
    var dataToExport = "";

    var timeStamp = dataPoint[CONSTANT.xIndex];
    var timeStampString = timeStamp.getDate() + "/" + (timeStamp.getMonth() + 1).toString() + "/" + timeStamp.getFullYear() + " " + timeStamp.toLocaleTimeString();
    var qualityString = QualityParser.getOpcQualityString(dataPoint[CONSTANT.qualityIndex]);
    var formattedValue = CommonFunction.formatItemValue(dataPoint[CONSTANT.yIndex], false, numDecimals);
    var valueString = formattedValue.toString();

    dataToExport += timeStampString
    dataToExport += " ";
    dataToExport += qualityString;
    dataToExport += " ";
    dataToExport += valueString;
    dataToExport += " ";
    return dataToExport;
}

function getStringOfDataPointForXYPlot(dataPoint, numDecimalsX, numDecimalsY) {
    var dataToExport = "";

    var timeStamp = new Date(dataPoint[CONSTANT.timestampIndex]);
    var timeStampString = timeStamp.getDate() + "/" + (timeStamp.getMonth() + 1).toString() + "/" + timeStamp.getFullYear() + " " + timeStamp.toLocaleTimeString();
    var qualityString = QualityParser.getOpcQualityString(dataPoint[CONSTANT.qualityIndex]);
    var formattedValueY = CommonFunction.formatItemValue(dataPoint[CONSTANT.yIndex], false, numDecimalsY);
    var valueStringY = formattedValueY.toString();
    var formattedValueX = CommonFunction.formatItemValue(dataPoint[CONSTANT.xIndex], false, numDecimalsX);
    var valueStringX = formattedValueX.toString();

    dataToExport += timeStampString;
    dataToExport += " ";
    dataToExport += qualityString;
    dataToExport += " ";
    dataToExport += valueStringY;
    dataToExport += " ";
    dataToExport += valueStringX;
    dataToExport += " ";
    
    return dataToExport;
}

//export data for trend
function exportDataForTrend(jqPlotter) {
    var dataToExport = "";
    var maxDataLength = 0;

    jqPlotter.visibleSeries.forEach(function (series) {
        dataToExport += "Timestamp Quality Value: ";
        dataToExport += series.name;
        dataToExport += " ";        //&nbsp;

        if (series.data.length > maxDataLength)
            maxDataLength = series.data.length;
    });

    for (var i = 0; i < maxDataLength; i++) {
        jqPlotter.visibleSeries.forEach(function (series) {
            if (i < series.data.length) {
                dataToExport += getStringOfDataPointForTrend(series.data[i], series.numDecimals);
            }
        });
    }

    var dataWindow = window.open('', '', '');
    dataWindow.document.write(dataToExport);
    dataWindow.focus();
}

//export data for trend
function exportDataForXYPlot(jqPlotter) {
    var dataToExport = "";
    var maxDataLength = 0;

    jqPlotter.visibleSeries.forEach(function (series) {
        dataToExport += "Timestamp Quality Value: ";
        dataToExport += series.itemIdY;
        dataToExport += " Value: ";
        dataToExport += series.itemIdX;
        dataToExport += " ";

        if (series.originalXYData.length > maxDataLength)
            maxDataLength = series.originalXYData.length;
    });

    for (var i = 0; i < maxDataLength; i++) {
        jqPlotter.visibleSeries.forEach(function (series) {
            if (i < series.originalXYData.length) {
                dataToExport += getStringOfDataPointForXYPlot(series.originalXYData[i], series.numDecimalsX, series.numDecimalsY);
            }
        });
    }

    var dataWindow = window.open('', '', '');
    dataWindow.document.write(dataToExport);
    dataWindow.focus();
}

function exportData(jqPlotter) {
    if (jqPlotter.commonProperty.isXYPlot)
        exportDataForXYPlot(jqPlotter);
    else
        exportDataForTrend(jqPlotter);
}

//var strPersistance = getConfigurationPersistance(window.JqPlotter);
//persistState(window.JqPlotter.elm.id, strPersistance);
function persistState(jpPlotterId, persistence) {
    if (persistence != null) {
        var persistenceTextBox = document.getElementById(jpPlotterId + "_Persistence");
        persistenceTextBox.value = persistence;
        __doPostBack(jpPlotterId + "_Persistence", '');
    }
}

function getFontStyle(props) {
    var strFontStyle = 'plain';
    var strFSTem = props["Bold"].toLowerCase() == 'true' ? 'bold' : '';
    strFSTem += props["Italic"].toLowerCase() == 'true' ? 'italic' : '';
    if (strFSTem.length > 0)
        return strFSTem;
    return strFontStyle;
}

function getLegendPersistence(index, props, jqPlotter) {
    var strConfiguration = "#legend#(ILegend)";
    var commonProperty = jqPlotter.commonProperty;
    strConfiguration += "#showValue#";
    strKey = "Track" + index.toString() + '.showValue';
    strConfiguration += commonProperty.legendElements.value.toString();

    strConfiguration += "#showUnit#";
    strConfiguration += commonProperty.legendElements.unit.toString();

    strConfiguration += "#showQuality#";
    strConfiguration += commonProperty.legendElements.quality.toString();

    strConfiguration += "#showDescription#";
    strKey = "Track" + index.toString() + '.showDescription';
    strConfiguration += commonProperty.legendElements.description.toString();

    strConfiguration += "#showCurveType#";
    strConfiguration += commonProperty.legendElements.curveType.toString();

    strConfiguration += "#resolutionEnabled#";
    strKey = "Track" + index.toString() + '.showResolution';
    strConfiguration += commonProperty.inforbarElements.resolution.toString();

    strConfiguration += "#colWidths#";
    strKey = "Track" + index.toString() + '.LegendColumnWidths';
    strConfiguration += props[strKey];

    strConfiguration += "#(#ILegend)";
    return strConfiguration;
}

function getFontPersistence(props) {
    var strFont = 'java.awt.Font[family=';
    strFont += props["FontFile"] + ',name=';
    strFont += props["FontFile"] + ',';
    strFont += 'style=' + getFontStyle(props); //bold.toLowerCase() == "true"
    strFont += ',size='
    strFont += getFontSize(props["FontSize"].toString());
    strFont += ']'
    return strFont;
}

function getGridPersistence(index, props, isMajor, jqPlotter) {
    var strConfiguration = '';
    var commonProperty = jqPlotter.commonProperty;
    if (isMajor){
        strConfiguration += "#majorGrid#";
        strConfiguration += "(GridController)";
        strConfiguration += "#behavior#";
        strConfiguration += props["GridBehavior"];
        strConfiguration += "#numGridX#";
        strConfiguration += commonProperty.gridXMajor.toString();
        strConfiguration += "#numGridY#";
        strConfiguration += commonProperty.gridYMajor.toString();
        strConfiguration += "#xGridOn#";
        strConfiguration += commonProperty.gridXVisible;
        strConfiguration += "#yGridOn#";
        strConfiguration += commonProperty.gridYVisible;
        strConfiguration += "#major#";
        strConfiguration += "true";
        strConfiguration += "#";
        strConfiguration += "(#GridController)";
    }
    else {
        strConfiguration += "#minorGrid#";
        strConfiguration += "(GridController)";
        strConfiguration += "#behavior#";
        strConfiguration += props["GridBehavior"];
        strConfiguration += "#numGridX#";
        strConfiguration += commonProperty.gridXMinor.toString();
        strConfiguration += "#numGridY#";
        strConfiguration += commonProperty.gridYMinor.toString();
        strConfiguration += "#xGridOn#";
        strConfiguration += commonProperty.gridXVisible;
        strConfiguration += "#yGridOn#";
        strConfiguration += commonProperty.gridYVisible;
        strConfiguration += "#major#";
        strConfiguration += "false"
        strConfiguration += "#";
        strConfiguration += "(#GridController)";
    }

    return strConfiguration;
}

function getItemPersistence(i, props, jqPlotter)
{
    var strConfiguration = '';
    var curveProperty = getCurvePropertyByCurveIndex(i, jqPlotter.curveProperties);
    //var commonProperty = jqPlotter.commonProperty; //curveProperty
    strConfiguration += "#Items" + i + "#";
    strConfiguration += "(Item)";
    strConfiguration += "#curveType#";
    strConfiguration += curveProperty.curveLineType;
    strConfiguration += "#plotType#"; //Track0.Curve1.PlotType
    strConfiguration += curveProperty.curvePlotType;
    strConfiguration += "#itemHidden#";
    visible = getBooleanReversed(curveProperty.curveVisible, false);
    strConfiguration += visible;
    strConfiguration += "#itemColor#";
    strConfiguration += curveProperty.curveColor; //old version's format is like #itemColor#java.awt.Color[r=255,g=0,b=0]#
    strConfiguration += "#penSize#";
    strConfiguration += curveProperty.curvePensize;

    strConfiguration += "#markCurrentPoint#";
    strConfiguration += curveProperty.markCurrentPoint;

    strConfiguration += "#symbolsOnlyOnChange#";
    strConfiguration += curveProperty.symbolsOnlyOnChange;

    strConfiguration += "#numDecimalsLegend#";
    strConfiguration += curveProperty.numDecimals;

    strConfiguration += "#";

    strConfiguration += getAxesXorYPersistence(i, props, true, curveProperty);

    strConfiguration += getAxesXorYPersistence(i, props, false, curveProperty);

    strConfiguration += "#staticLinesX#(StaticLines)#numStaticLines#0#(#StaticLines)#staticLinesY#(StaticLines)#numStaticLines#0#(#StaticLines)"
    strConfiguration += "(#Item)";

    return strConfiguration;
}

function getAxesXorYPersistence(i, props, isX, curveProperty)
{
    var strConfiguration = '';
    if (isX) {
        strConfiguration += "#axes0#";
        strConfiguration += "(BasicAxis)";
        strConfiguration += "#mergeAxisID#";
        strConfiguration += curveProperty.mergeIdentifierX;
        strConfiguration += "#isHidden#";
        strConfiguration += props["Track0.XAxis.HideAxes"];
        strConfiguration += "#axisLocation#";
        strConfiguration += curveProperty.axisLocationX;
        strConfiguration += "#visibleRange#";
        strConfiguration += curveProperty.axisVisibleRangeX;
        strConfiguration += "#inverse#";
        strConfiguration += curveProperty.axisInvertedX;
        strConfiguration += "#unit#";
        strConfiguration += curveProperty.unitX;
        strConfiguration += "#isLogarithmic#";
        strConfiguration += props["Track0.Curve" + i + ".XAxis.Logarithmic"];
        strConfiguration += "#numDecimals#";
        strConfiguration += curveProperty.numDecimalsAxisX;
        strConfiguration += "#";
        strConfiguration += "(#BasicAxis)";
    }
    else{
        strConfiguration += "#axes1#";
        strConfiguration += "(BasicAxis)";
        strConfiguration += "#mergeAxisID#";
        strConfiguration += curveProperty.mergeIdentifierY;
        strConfiguration += "#isHidden#";
        strConfiguration += props["Track0.YAxis.HideAxes"];
        strConfiguration += "#axisLocation#";
        strConfiguration += curveProperty.axisLocationY;
        strConfiguration += "#visibleRange#";
        strConfiguration += curveProperty.axisVisibleRangeY;
        strConfiguration += "#inverse#";
        strConfiguration += curveProperty.axisInvertedY;
        strConfiguration += "#unit#";
        strConfiguration += curveProperty.unitY;
        strConfiguration += "#isLogarithmic#";
        strConfiguration += props["Track0.Curve" + i + ".YAxis.Logarithmic"];
        strConfiguration += "#numDecimals#";
        strConfiguration += curveProperty.numDecimalsAxisY;
        strConfiguration += "#";
        strConfiguration += "(#BasicAxis)"
    }
    return strConfiguration;
}

function getViewPersistence(index, props, jqPlotter) {
    var commonProperty = jqPlotter.commonProperty;
    var strKey = '';
    var strConfiguration = "#view" + index.toString() + "#";// + views[i].getPersistence();
    strConfiguration += "(SubPlotControl)";
    //strKey = "Track" + index.toString() + '';
    strConfiguration += "#timespan#";
    strConfiguration += commonProperty.initialTimespan.toString();
    strConfiguration += "#bufferSize#";
    strConfiguration += commonProperty.ringBufferSize.toString();
    
    strConfiguration += "#disableAllUserInteraction#";
    strConfiguration += (!commonProperty.userInteraction).toString();
    
    strConfiguration += "#legendPosition#";
    //strKey = "Track" + index.toString() + '.LegendPosition'; //old version use enumed value 0->Top, 1->Embeded, 2->Hidden
    strConfiguration += commonProperty.legendPosition.toString();
    strConfiguration += "#verticalSlider#";
    strConfiguration += jqPlotter.rulerStatus.isVertical.toString();
    strConfiguration += "#borderVisible#";
    strConfiguration += (commonProperty.borderFill.toString() == 'gray').toString();
    strConfiguration += "#oneVectorOnly#";
    strConfiguration += commonProperty.oneVectorOnly.toString();
    strConfiguration += "#yAxesHidden#";
    strConfiguration += commonProperty.hideAxisY.toString();
    strConfiguration += "#xAxesHidden#";
    strConfiguration += commonProperty.hideAxisX.toString();

    strConfiguration += "#numVisibleRowsInLegend#";
    strConfiguration += commonProperty.legendVisibleRows.toString();

    strConfiguration += "#denyButtonRemove#" + commonProperty.disableRemoveButton.toString();

    strConfiguration += "#gradientBackground#";
    strKey = "Track" + index.toString() + '.GradientBackground';
    strConfiguration += props[strKey];

    strConfiguration += "#mergeAxisColorY#";
    strConfiguration += commonProperty.mergeYAxisColor.toString();

    strConfiguration += "#mergeAxisColorX#";
    strConfiguration += commonProperty.mergeXAxisColor.toString();;

    strConfiguration += "#";

    strConfiguration += getLegendPersistence(index, props, jqPlotter);

    strConfiguration += getGridPersistence(index, props, true, jqPlotter);

    strConfiguration += getGridPersistence(index, props, false, jqPlotter);

    strConfiguration += "#statusBar#(StatusBar)##(#StatusBar)"; //dump status bar

    strConfiguration += "#numItems#";
    strConfiguration += jqPlotter.curveProperties.length.toString();
    strConfiguration += "#";

    /////////////////////////////////////////////////////// item persistence
    for (var i = 0; i < jqPlotter.curveProperties.length; i++) {
        strConfiguration += getItemPersistence(i, props, jqPlotter);
    }
    ///////////////////////////////////////////////////////

    strConfiguration += "(#SubPlotControl)";
    return strConfiguration;
}

function getConfigurationPersistance(jqPlotter) {
    //props = jqPlotter.props;
    //propsTem = jqPlotter.commonProperty;
    //var strConfiguration = "(Plotter)";
    //strConfiguration += "#font#";
    //strConfiguration += getFontPersistence(props);
    //strConfiguration += "#useScientific#" + props['Track0.UseScientificNotation'];
    //strConfiguration += "#numVisibleRowsInLegend#" + props['Track0.NumVisibleRowsInLegend'];
    //strConfiguration += "#numViews#";
    //strConfiguration += "1#";

    //strConfiguration += getViewPersistence(0, props, jqPlotter);
    //strConfiguration += "(#Plotter)";
    //return strConfiguration;
    props = jqPlotter.props;
    commonProperty = jqPlotter.commonProperty;
    strTem = commonProperty.toString();
    var strConfiguration = "(Plotter)";
    strConfiguration += "#font#";
    strConfiguration += getFontPersistence(props);
    strConfiguration += "#useScientific#" + commonProperty.useScientificNotation.toString();
    strConfiguration += "#numVisibleRowsInLegend#" + commonProperty.legendVisibleRows.toString();
    strConfiguration += "#numViews#";
    strConfiguration += "1#";

    strConfiguration += getViewPersistence(0, props, jqPlotter);
    strConfiguration += "(#Plotter)";
    return strConfiguration;
}

function getContentOfTag(tagName, delimiter, startIndex, content) {
    if (content != null) {
        index1 = content.indexOf("(" + tagName + ")", startIndex);
        if (index1 == -1) {
            return null;
        }
        index2 = content.indexOf("(" + delimiter + tagName + ")", index1);
        if (index2 > -1) {
            return content.substring(index1 + tagName.length + 2, index2);
        }
    }
    return null;
}

function getPropertyFromString(name, settings, defaultValue, delimiter) {
    var retval = defaultValue;
    if (settings != null) {
        index1 = settings.indexOf(delimiter + name + delimiter);
        if (index1 > -1) {
            index1 += name.length + 2;
            index2 = settings.indexOf(delimiter, index1);
            if ((index2 - index1) > 0)
                retval = settings.substring(index1, index2);
        }
    }
    return retval;
}

function setConfiguration(strPersistence, jqPlotter) {
    var delimiter = "#";
    //var strPersistence1 = strPersistence.toString();
    var props = jqPlotter.props;
    strPersistence = strPersistence.replace("\t", delimiter);
    var plotterString = getContentOfTag("Plotter", delimiter, 0, strPersistence);

    var viewContent;
    startIndex = plotterString.indexOf("#view0" + "#");
    viewContent = getContentOfTag("SubPlotControl", "#", startIndex, plotterString);
    if (viewContent != null) {
        //views[viewCounter].setPersistence(viewContent, parser);
        props["Track0.LegendPosition"] = getPropertyFromString("legendPosition", viewContent, props["Track0.LegendPosition"], delimiter);
        props["Track0.XAxis.HideAxes"] = getPropertyFromString("xAxesHidden", viewContent, props["Track0.XAxis.HideAxes"], delimiter);
        props["Track0.YAxis.HideAxes"] = getPropertyFromString("yAxesHidden", viewContent, props["Track0.YAxis.HideAxes"], delimiter);
        props["Track0.GradientBackground"] = getPropertyFromString("gradientBackground", viewContent, props["Track0.GradientBackground"], delimiter);
    }

    startIndex = plotterString.indexOf("#majorGrid#", startIndex);
    //viewContent = getContentOfTag("majorGrid", "#", startIndex, plotterString);
    viewContent = getContentOfTag("GridController", "#", startIndex, plotterString);
    props["Track0.XAxis.MajorGrid"] = getPropertyFromString("numGridX", viewContent, props["Track0.XAxis.MajorGrid"], delimiter);
    props["Track0.YAxis.MajorGrid"] = getPropertyFromString("numGridY", viewContent, props["Track0.YAxis.MajorGrid"], delimiter);
    props["Track0.XGridVisible"] = getPropertyFromString("xGridOn", viewContent, props["Track0.XGridVisible"], delimiter);
    props["Track0.YGridVisible"] = getPropertyFromString("yGridOn", viewContent, props["Track0.YGridVisible"], delimiter);

    startIndex = plotterString.indexOf("#minorGrid#", startIndex);
    //viewContent = getContentOfTag("minorGrid", "#", startIndex, plotterString);
    viewContent = getContentOfTag("GridController", "#", startIndex, plotterString);
    props["Track0.XAxis.MinorGrid"] = getPropertyFromString("numGridX", viewContent, props["Track0.XAxis.MinorGrid"], delimiter);
    props["Track0.YAxis.MinorGrid"] = getPropertyFromString("numGridY", viewContent, props["Track0.YAxis.MinorGrid"], delimiter);
    props["Track0.XGridVisible"] = getPropertyFromString("xGridOn", viewContent, props["Track0.XGridVisible"], delimiter);
    props["Track0.YGridVisible"] = getPropertyFromString("yGridOn", viewContent, props["Track0.YGridVisible"], delimiter);

    var itemCounter = 0;
    while (true) {
        startIndex = plotterString.indexOf("#Items" + itemCounter + "#", startIndex);
        if (startIndex > -1) {
            content = getContentOfTag("Item", "#", startIndex, plotterString);
            if (content == null) {
                break;
            }
            else {
                props["Track0.Curve" + itemCounter + ".CurveType"] = getPropertyFromString("curveType", content, props["Track0.Curve" + itemCounter + ".CurveType"], delimiter);
                props["Track0.Curve" + itemCounter + ".Visible"] = getBooleanReversed(getPropertyFromString("itemHidden", content, props["Track0.Curve" + itemCounter + ".Visible"], delimiter), false);
                props["Track0.Curve" + itemCounter + ".Color"] = getPropertyFromString("itemColor", content, props["Track0.Curve" + itemCounter + ".Color"], delimiter);
                props["Track0.Curve" + itemCounter + ".PenSize"] = getPropertyFromString("penSize", content, props["Track0.Curve" + itemCounter + ".PenSize"], delimiter);
                var startIndexItem = content.indexOf("#axes0#", startIndexItem);
                var itemPersist = getContentOfTag("BasicAxis", delimiter, startIndexItem, content)
                props["Track0.Curve" + itemCounter + ".XAxis.MergeIdentifier"] = getPropertyFromString("mergeAxisID", itemPersist, props["Track0.Curve" + itemCounter + "XAxis.MergeIdentifier"], delimiter);
                props["Track0.Curve" + itemCounter + ".XAxis.VisibleRange"] = getPropertyFromString("visibleRange", itemPersist, props["Track0.Curve" + itemCounter + "XAxis.VisibleRange"], delimiter);
                props["Track0.Curve" + itemCounter + ".XAxis.Inverted"] = getPropertyFromString("inverse", itemPersist, props["Track0.Curve" + itemCounter + "XAxis.Inverted"], delimiter);
                props["Track0.Curve" + itemCounter + ".XItemUnit"] = getPropertyFromString("unit", itemPersist, props["Track0.Curve" + itemCounter + "XItem.Unit"], delimiter);
                props["Track0.Curve" + itemCounter + ".XAxis.IsLogarithmic"] = getPropertyFromString("isLogarithmic", itemPersist, props["Track0.Curve" + itemCounter + "XItem.IsLogarithmic"], delimiter);
                props["Track0.Curve" + itemCounter + ".XAxis.NumDecimals"] = getPropertyFromString("numDecimals", itemPersist, props["Track0.Curve" + itemCounter + "XAxis.NumDecimals"], delimiter);
                startIndexItem = content.indexOf("#axes1#", startIndexItem);
                itemPersist = getContentOfTag("BasicAxis", delimiter, startIndexItem, content)
                props["Track0.Curve" + itemCounter + ".YAxis.MergeIdentifier"] = getPropertyFromString("mergeAxisID", itemPersist, props["Track0.Curve" + itemCounter + "YAxis.MergeIdentifier"], delimiter);
                props["Track0.Curve" + itemCounter + ".YAxis.VisibleRange"] = getPropertyFromString("visibleRange", itemPersist, props["Track0.Curve" + itemCounter + "YAxis.VisibleRange"], delimiter);
                props["Track0.Curve" + itemCounter + ".YAxis.Inverted"] = getPropertyFromString("inverse", itemPersist, props["Track0.Curve" + itemCounter + "YAxis.Inverted"], delimiter);
                props["Track0.Curve" + itemCounter + ".YItemUnit"] = getPropertyFromString("unit", itemPersist, props["Track0.Curve" + itemCounter + "YItem.Unit"], delimiter);
                props["Track0.Curve" + itemCounter + ".YAxis.IsLogarithmic"] = getPropertyFromString("isLogarithmic", itemPersist, props["Track0.Curve" + itemCounter + "YItem.IsLogarithmic"], delimiter);
                props["Track0.Curve" + itemCounter + ".YAxis.NumDecimals"] = getPropertyFromString("numDecimals", itemPersist, props["Track0.Curve" + itemCounter + "YAxis.NumDecimals"], delimiter);
            }
        }
        else {
            break;
        }
        itemCounter++;
    }
}