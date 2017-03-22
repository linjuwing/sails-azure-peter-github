var JqPlotter_PropertiesFactory = (function () {
    var my = {};

    //page property, set some common properties
    my.createPageProperty = function (props) {
        var canvas = document.createElement("canvas");
        canvas.className = "HelperCanvas";
        canvas.id = "HelperCanvas1";
        document.body.appendChild(canvas);

        var ee = new EventEmitter();

        var pageProperty = {
            badSymbolImageUrl: props["BadSymbolImageUrl"],
            menuSelectedImageUrl: props["MenuSelectedImageUrl"],
            languageFileUrl: props["LanguageFileUrl"],
            numeralFileUrl: props["NumeralFileUrl"],
            lastMenu: null,
            helperCanvas: document.getElementById("HelperCanvas1"),
            eventEmitter: ee,
            jqPlotter: null,
            elementIdArray: []
        };
        return pageProperty;
    }

    //create common property
    my.createCommonProperty = function (props, id) {
        var bBadSymbols = false;
        var sBadSymbols = props["BadSymbols"];
        if (sBadSymbols == "On")
            bBadSymbols = true;
        var HDATimespan = parseInt(props["HDATimeSpan"]) / 10000;
        var fontSize = getFontSize(props['FontSize'].toString());
        var fontString = getFontString(props['FontFile'].toString(), props['Bold'].toString(), props['Italic'].toString(), fontSize);

        function byteStringTofloat(byteString) {
            var byteStrings = byteString.split('-');
            var arrayBuffer = new ArrayBuffer(4);
            var int8Array = new Int8Array(arrayBuffer);
            for (var i = 0; i < 4; i++) {
                int8Array[i] = parseInt(byteStrings[i], 16);
            }
            var float32Array = new Float32Array(arrayBuffer);

            return float32Array[0];
        }
        var fractionOfTimeSpan = byteStringTofloat(props['FractionOfTimespan']);//parseFloat(props['FractionOfTimespan']);

        var hasborder = props['Border'].toString().toLowerCase() != "false";
        var borderFill = 'gray';
        if (!hasborder)
            borderFill = 'transparent';

        var labelAxisLocationX = "bottom";
        if (props["Track0.Curve" + '0' + ".XAxis.AxisLocation"] != null
            && props["Track0.Curve" + '0' + ".XAxis.AxisLocation"].toString().toLowerCase() == 'north')
            labelAxisLocationX = "top";

        var mergeAxesBlackX = false;
        if (props["Track0.MergeAxesColorX"] == "Default")
            mergeAxesBlackX = true;
        var mergeAxesBlackY = false;
        if (props["Track0.MergeAxesColorY"] == "Default")
            mergeAxesBlackY = true;

        var commonProperty = {
            backgroundcolor: colorToColorString(props["BackgroundColor"]),
            foregroundcolor: colorToColorString(props["ForegroundColor"]),
            borderFill: borderFill,
            fontSize: fontSize,
            fontString: fontString,
            fractionOfTimeSpan: fractionOfTimeSpan,
            inforbarElements: {
                endTimestamp: getBoolean(props["Track0.showDateTime"], true),
                timespan: getBoolean(props["Track0.showTimespan"], true),
                resolution: getBoolean(props["Track0.showResolution"], true),
                timezone: getBoolean(props["Track0.showTimezone"], true),
            },
            legendPosition: props["Track0.LegendPosition"],
            legendVisibleRows: parseInt(props["Track0.NumVisibleRowsInLegend"]),
            legendElements: {
                deleteButton: getBoolean(props["Track0.showButton"], true),
                curveType: getBoolean(props["Track0.showCurveType"], true),
                itemName: getBoolean(props["Track0.showName"], true),
                value: getBoolean(props["Track0.showValue"], true),
                unit: getBoolean(props["Track0.showUnit"], true),
                quality: getBoolean(props["Track0.showQuality"], true),
                description: getBoolean(props["Track0.showDescription"], true),
            },
            legendTextColorLikeItem: {
                itemName: getBoolean(props["Track0.ItemNameColorAsItem"], false),
                value: getBoolean(props["Track0.ValueColorAsItem"], false),
                unit: getBoolean(props["Track0.UnitColorAsItem"], false),
                quality: getBoolean(props["Track0.QualityColorAsItem"], false),
                description: getBoolean(props["Track0.DescriptionColorAsItem"], false),
            },
            gridcolor: colorToColorString(props["GridColor"]),
            gridXMinor: parseInt(props["Track0.XAxis.MinorGrid"]),
            gridXMajor: parseInt(props["Track0.XAxis.MajorGrid"]),
            gridYMinor: parseInt(props["Track0.YAxis.MinorGrid"]),
            gridYMajor: parseInt(props["Track0.YAxis.MajorGrid"]),
            gridXVisible: props["Track0.XGridVisible"].toString().toLowerCase() == "true",
            gridYVisible: props["Track0.YGridVisible"].toString().toLowerCase() == "true",
            scrollbarEndPosAutoPan: true, //props["Track0.ScrollbarEndPosAutoPan"].toString().toLowerCase() == "true",
            HDATimespan: HDATimespan,
            visibleDataPointCount: parseInt(props["VisibleDataPointCount"]),
            ringBufferSize: parseInt(props["Track0.RingBufferSize"]),
            initialTimespan: parseInt(props["Timespan"]),
            bufferRemoveProperty: {
                bufferRemoveStrategy: props["Track0.BufferRemoveStrategy"],
                bufferRemovePeriod: parseInt(props["Track0.BufferRemovePeriod"]),
                bufferRemoveSumTime: 0,
            },
            datetimeFormat: 'longTime',
            mergeAxesBlackX: mergeAxesBlackX,
            mergeAxesBlackY: mergeAxesBlackY,
            mergeXAxisColor: 'black',
            mergeYAxisColor: 'black',
            mergeAllAxesX: props["Track0.XAxis.MergeAllAxes"].toString().toLowerCase() == "true",
            mergeAllAxesY: props["Track0.YAxis.MergeAllAxes"].toString().toLowerCase() == "true",
            hideAxisX: props["Track0.XAxis.HideAxes"].toString().toLowerCase() == "true",
            hideAxisY: props["Track0.YAxis.HideAxes"].toString().toLowerCase() == "true",
            badSymbols: bBadSymbols,
            timezone: "",
            timeOffset: 0,
            axisXTimeId: "time0",
            timeReferenceMarkTime: {
                markTimeOn: getBoolean(props["TimeReferenceMarkTime.MarkTimeOn"], false),
                color: colorToColorString(props["TimeReferenceMarkTime.Color"]),
                curveType: props["TimeReferenceMarkTime.CurveType"],
                penSize: props["TimeReferenceMarkTime.PenSize"],
            },
            userInteraction: !getBoolean(props["Track0.DisableAllUserInteraction"], false),     //if allow user interaction, then true  
            userInteractionUnitChange: getBoolean(props["Track0.userInteractionUnitChange"], false),
            userInteractionAxisScaling: getBoolean(props["Track0.userInteractionAxisScaling"], false),
            unitEditable: getBoolean(props["UnitEditable"], false),
            firstUpdatedData: false,
            useScientificNotation: props["Track0.UseScientificNotation"].toString().toLowerCase() == "true",
            chartMinimized: props['Track0.Minimized'].toString().toLowerCase() == "true",
            disableRemoveButton: getBoolean(props['DisableRemoveButton'], false),
            visibleAxesCountY: 0,
            visibleAxesCountX: 0,
            elementId: id,
            controlId: id + "_chartdiv",
            axesYStatus: {
                selectedNum: 0,
                selectedAxes: new Array(),
            },
            axesXStatus: {
                selectedNum: 0,
                selectedAxes: new Array(),
            },
            connectorName: props["ConnectorName"],
            controlIndex: props["ControlIndex"],
            pexPlotterHeight: $("#" + id + "_chartdiv").height(),
            pexPlotterWidth: $("#" + id + "_chartdiv").width(),
            rulerOn: false,
            oneVectorOnly: getBoolean(props["OneVectorOnly"], false),
            isZooming: false,
            isXYPlot: false,
            showXItemInLegend: getBoolean(props['Track0.ShowXItemInLegend'], true),
            qualityVisulizationProp: parsePropQualityVisiualization(props),
            mouseWheelZoomStep: 0.0007,
            labelAxisLocationX: labelAxisLocationX,
            logArrayY: [],
            logArrayX: [],
            showAllData: false,
        }

        getTimeOffset(props, commonProperty);
        return commonProperty;
    }

    //parse subscription elements, and return itemproperties and curveproperties
    my.parseSubscriptionElements = function (SubscriptionElements, props, commonProperty) {
        var itemTypes = CONSTANT.jqPlotterItemTypes;

        var curveProperties = [];
        var itemProperties = [];
        var timeReferenceItemIndex = -1;
        var timeReferenceItemPropertyArray = [];

        for (var i = 0; i < SubscriptionElements.length; i++) {
            var itemProperty = createItemProperty(SubscriptionElements[i], i);

            switch (itemProperty.itemType) {
                case itemTypes.itemAttribute:
                    break;
                case itemTypes.curve:
                    var curveProperty = getCurvePropertyByCurveIndex(itemProperty.curveIndex, curveProperties);
                    if (!curveProperty) {     //there is no curveProperty existed, create new curveProperty      
                        curveProperty = createCurveProperty(itemProperty, props, commonProperty);
                        if (curveProperty != null) {
                            curveProperties.push(curveProperty);
                        }
                    } else {        //means there is already one curveProperty for curve, it is xyplot
                        curveProperty.isXYPlot = true;
                        commonProperty.isXYPlot = true;
                    }
                    setItemToCurveProperty(curveProperty, itemProperty);
                    break;
                case itemTypes.rangeLoY:
                    break;
                case itemTypes.rangeHiY:
                    break;
                case itemTypes.timeReference:
                    timeReferenceItemIndex = itemProperty.itemIndex;
                    break;
                case itemTypes.timeReferenceArray:
                    timeReferenceItemPropertyArray.push(itemProperty);
                    break;
                case itemTypes.resetBuffer:
                    break;
                case itemTypes.visibleDataPoint:
                    break;
                default:
                    break;
            }

            itemProperties.push(itemProperty);
        }

        setXAxesMergeStrategy(commonProperty, curveProperties);

        parseTimeUpdateIdentifierAndTimeReference(curveProperties, timeReferenceItemIndex, timeReferenceItemPropertyArray);
        return [itemProperties, curveProperties];
    }

    //based on curveProperty's timeUpdateIdentifier and followTimeRef, set timeUpdateItems group
    function parseTimeUpdateIdentifierAndTimeReference(curveProperties, timeReferenceItemIndex, timeReferenceItemPropertyArray) {
        for (var i = 0; i < curveProperties.length; i++) {
            var curveProperty = curveProperties[i];
            if (curveProperty.followTimeRef && timeReferenceItemIndex > -1) {      //if curveProperty not configured timeUpdateIdentifier
                if (!isElementInArray(timeReferenceItemIndex, curveProperty.timeUpdateItemIndexes))
                    curveProperty.timeUpdateItemIndexes.push(timeReferenceItemIndex);
            } else if (curveProperty.timeUpdateIdentifier > -1) {          //if curveProperty configured timeUpdateIdentifier
                var hasRefer = false;
                timeReferenceItemPropertyArray.forEach(function (itemProperty) {
                    if (itemProperty.timeUpdateIdentifier == curveProperty.timeUpdateIdentifier && curveProperty.followTimeRef) {
                        hasRefer = true;
                        curveProperty.timeUpdateItemIndexes.push(itemProperty.itemIndex);
                        return;
                    }
                });

                if (!hasRefer && !curveProperty.followTimeRef) {            //if followTimeRef is false, and there is no timeReferenceItems for timeUpdateIdentifier
                    for (var j = i + 1; j < curveProperties.length; j++) {
                        var secondCurveProperty = curveProperties[j];
                        if ((secondCurveProperty.timeUpdateIdentifier == curveProperty.timeUpdateIdentifier)
                            && !secondCurveProperty.followTimeRef) {
                            curveProperty.timeUpdateItemIndexes.push(secondCurveProperty.itemIndex);
                            secondCurveProperty.timeUpdateItemIndexes.push(curveProperty.itemIndex);
                        }
                    }
                }
            }
        }
    }

    function setXAxesMergeStrategy(commonProperty, curveProperties) {
        if (!commonProperty.isXYPlot) {
            commonProperty.mergeAllAxesX = true;
            curveProperties.forEach(function (curveProperty) {
                curveProperty.mergeIdentifierX = 1;
            });
        }
    }

    function setItemToCurveProperty(curveProperty, itemProperty) {
        if (!itemProperty || !curveProperty)
            return;

        if (itemProperty.itemXorY == 'X') {
            curveProperty.itemTagX = itemProperty.itemTag;
            curveProperty.itemIndexX = itemProperty.itemIndex;
            curveProperty.itemIdX = itemProperty.itemId;
        }
        else {
            curveProperty.itemTagY = itemProperty.itemTag;
            curveProperty.itemIndexY = itemProperty.itemIndex;
            curveProperty.itemIdY = itemProperty.itemId;
        }
    }

    //create item property, to handle subscription items
    var createItemProperty = function (subscriptionElement, i) {
        var itemTypes = CONSTANT.jqPlotterItemTypes;
        var itemPropertyType = -1;
        var curveIndex = -1;
        var itemXorY = "";
        var updateIdentifier = -1;
        var matches;

        if (subscriptionElement.property == "TimeReferenceItem") {
            itemPropertyType = itemTypes.timeReference;
        }
        else if (subscriptionElement.property.indexOf("TimeReferenceItem") >= 0) {
            itemPropertyType = itemTypes.timeReferenceArray;
            if (matches = subscriptionElement.property.match(/\d+$/)) {
                updateIdentifier = parseInt(matches[0]);
            }
        }
        else if (subscriptionElement.property == "VisibleDataPointItem") {
            itemPropertyType = itemTypes.visibleDataPoint;
        }
        else if (subscriptionElement.property.indexOf("ResetBuffersItem") >= 0) {
            itemPropertyType = itemTypes.resetBuffer;
        }
        else if (subscriptionElement.property.indexOf("XLoRangeItem") >= 0) {
            itemPropertyType = itemTypes.rangeLoX;
            curveIndex = getCurveIndex(subscriptionElement.property);
        }
        else if (subscriptionElement.property.indexOf("XHiRangeItem") >= 0) {
            itemPropertyType = itemTypes.rangeHiX;
            curveIndex = getCurveIndex(subscriptionElement.property);
        }
        else if (subscriptionElement.property.indexOf("YLoRangeItem") >= 0) {
            itemPropertyType = itemTypes.rangeLoY;
            curveIndex = getCurveIndex(subscriptionElement.property);
        }
        else if (subscriptionElement.property.indexOf("YHiRangeItem") >= 0) {
            itemPropertyType = itemTypes.rangeHiY;
            curveIndex = getCurveIndex(subscriptionElement.property);
        }
        if (subscriptionElement.property.indexOf("OrientationItem") >= 0) {
            itemPropertyType = itemTypes.orientation;
            curveIndex = getCurveIndex(subscriptionElement.property);
        }
        else if (matches = subscriptionElement.property.match(/(\d+\.\d+\.Y)__(\d+)/)) {
            itemPropertyType = itemTypes.itemAttribute;
            var refItem = matches[1];
            var itemAttrIndex = parseInt(matches[2]);
        }
        else if (subscriptionElement.property.indexOf("X") == subscriptionElement.property.length - 1
            || subscriptionElement.property.indexOf("Y") == subscriptionElement.property.length - 1) {
            itemPropertyType = itemTypes.curve;
            curveIndex = getCurveIndex(subscriptionElement.property);
            if (subscriptionElement.property.indexOf("X") >= 0) {
                itemXorY = "X";
            } else {
                itemXorY = "Y";
            }
        }

        var itemProperty = {
            itemIndex: i,
            itemId: subscriptionElement.itemId,
            itemTag: subscriptionElement.property,
            itemType: itemPropertyType,
            itemXorY: itemXorY,
            curveIndex: curveIndex,
            latestItemValue: null,
            valExpression: subscriptionElement.valExp,
            // Item proproty of the curve that this item attribute belongs to
            itemAttributeRefItemProperty: refItem,
            // if there are more that one attributes, itemAttributeIndex is used to identify eath attribute
            itemAttributeIndex: itemAttrIndex,
            itemNumDecimals: subscriptionElement.numdecimals,
            timeUpdateIdentifier: updateIdentifier,
            enabled: true,
        }

        return itemProperty;
    }

    //create curve property for each curve, based on props
    var createCurveProperty = function (itemProperty, props, commonProperty) {
        var curveIndex = itemProperty.curveIndex;
        if (!isValidObject(curveIndex))
            return null;

        var curveColor = null;
        var color = props["Track0.Curve" + curveIndex + ".Color"];
        if (!isValidObject(color))        //if there is no curve's property, then remove curve
            return null;
        curveColor = colorToColorString(color);

        var curvePenSize = parseInt(props["Track0.Curve" + curveIndex + ".PenSize"]);
        if (curvePenSize > 7)
            curvePenSize = 7;
        if (curvePenSize < 1)
            curvePenSize = 1;

        var bBadSymbols = false;
        var sBadSymbols = props["Track0.Curve" + curveIndex + ".BadSymbols"];
        if (sBadSymbols == 'On')
            bBadSymbols = true;
        else if (sBadSymbols == "Off")
            bBadSymbols = false;
        else if (sBadSymbols == "Default") {
            if (commonProperty.badSymbols)
                bBadSymbols = true;
        }

        var unitY = props["Track0.Curve" + curveIndex + ".YItem_CurrentUnitName"];
        if (!isValidObject(unitY))
            unitY = props["Track0.Curve" + curveIndex + ".YItemUnit"];
        if (!isValidObject(unitY))
            unitY = "";

        var unitX = props["Track0.Curve" + curveIndex + ".XItem_CurrentUnitName"];
        if (!isValidObject(unitX))
            unitX = props["Track0.Curve" + curveIndex + ".XItemUnit"];
        if (!isValidObject(unitX))
            unitX = "";

        var getValuesForKeyLike = function (keyword, object) {
            var regex = new RegExp(keyword, 'i');
            return Object.keys(object)
            .filter(function (key) {
                return key.match(regex);
            })
            .sort(function (a, b) {
                var a_id = parseInt(a.match(/(\d+)$/)[1]);
                var b_id = parseInt(b.match(/(\d+)$/)[1]);

                return a_id - b_id;
            })
            .map(function (key) {
                return object[key];
            })
        }

        // to support secondary unit
        var unitIdsX = getValuesForKeyLike("Track0.Curve" + curveIndex + ".XItem_UnitID", props);
        var unitNamesX = getValuesForKeyLike("Track0.Curve" + curveIndex + ".XItem_UnitName", props);
        var unitIdsY = getValuesForKeyLike("Track0.Curve" + curveIndex + ".YItem_UnitID", props);
        var unitNamesY = getValuesForKeyLike("Track0.Curve" + curveIndex + ".YItem_UnitName", props);

        var axisLocationX = "bottom";
        if (props["Track0.Curve" + curveIndex + ".XAxis.AxisLocation"].toString().toLowerCase() == 'north')
            axisLocationX = "top";

        var axisLocationY = "left";
        if (props["Track0.Curve" + curveIndex + ".YAxis.AxisLocation"].toString().toLowerCase() == 'east')
            axisLocationY = "right";

        var decimalsAxisX = parseInt(props["Track0.Curve" + curveIndex + ".XAxis.NumDecimals"]);
        var decimalsAxisY = parseInt(props["Track0.Curve" + curveIndex + ".YAxis.NumDecimals"]);
        isNumDecimalsDefaultAxisX = decimalsAxisX == -1 ? true : false;
        isNumDecimalsDefaultAxisY = decimalsAxisY == -1 ? true : false;
        decimalsAxisX = decimalsAxisX == -1 ? 1 : decimalsAxisX;
        decimalsAxisY = decimalsAxisY == -1 ? 1 : decimalsAxisY;

        var numDecimals = parseInt(props["Track0.Curve" + curveIndex + ".NumDecimals"]);
        var isNumDecimalsDefaultLegend = true;
        if (!isValidNumber(numDecimals) || numDecimals < 0) {           //while curve have set NumDecimals, use curve's numdecimal as legend Decimal. If not, use decimals of axis. default value is 1
            numDecimalsLegendX = decimalsAxisX + 1;
            numDecimalsLegendY = decimalsAxisY + 1;
            isNumDecimalsDefaultLegend = true;
        } else {
            numDecimalsLegendX = numDecimals;
            numDecimalsLegendY = numDecimals;
            isNumDecimalsDefaultLegend = false;
        }

        var mergeIdentifierX = parseInt(props["Track0.Curve" + curveIndex + ".XAxis.MergeIdentifier"]);
        var mergeIdentifierY = parseInt(props["Track0.Curve" + curveIndex + ".YAxis.MergeIdentifier"]);
        if (commonProperty.mergeAllAxesX)
            mergeIdentifierX = 1;
        if (commonProperty.mergeAllAxesY)
            mergeIdentifierY = 1;

        var axisRangeLoY = parseFloat(props["Track0.Curve" + curveIndex + ".YItemRangeLo"]);
        var axisRangeHiY = parseFloat(props["Track0.Curve" + curveIndex + ".YItemRangeHi"]);
        var axisRangeLoX = parseFloat(props["Track0.Curve" + curveIndex + ".XItemRangeLo"]);
        var axisRangeHiX = parseFloat(props["Track0.Curve" + curveIndex + ".XItemRangeHi"]);

        var axisVisibleRangeX = parseFloat(props["Track0.Curve" + curveIndex + ".XAxis.VisibleRange"]);
        var axisVisibleRangeY = parseFloat(props["Track0.Curve" + curveIndex + ".YAxis.VisibleRange"]);

        var staticLinesArray = getStaticLinePropertiesFromCurveProps(props, curveIndex);
        var itemAttributes = getItemAttributesFromCurveProps(props, curveIndex);

        curveProperty = {
            itemId: itemProperty.itemId,
            itemIdX: null,
            itemIdY: null,
            itemTag: itemProperty.itemTag,
            itemTagX: null,
            itemTagY: null,
            itemIndex: itemProperty.itemIndex,
            itemIndexX: null,
            itemIndexY: null,
            isXYPlot: false,
            curveIndex: curveIndex,
            curveVisible: !getBoolean(props["Track0.Curve" + curveIndex + ".ItemHidden"], false),
            curveColor: curveColor,
            curvePensize: curvePenSize,
            curveLineType: props["Track0.Curve" + curveIndex + ".CurveType"],
            curvePlotType: props["Track0.Curve" + curveIndex + ".PlotType"],
            badSymbols: bBadSymbols,
            unitX: unitX,
            unitY: unitY,
            unitIdsX: unitIdsX,
            unitNamesX: unitNamesX,
            unitIdsY: unitIdsY,
            unitNamesY: unitNamesY,
            descriptionX: props["Track0.Curve" + curveIndex + ".XItemDesc"],
            descriptionY: props["Track0.Curve" + curveIndex + ".YItemDesc"],
            numDecimals: numDecimals,
            numDecimalsLegendX: numDecimalsLegendX,
            numDecimalsLegendY: numDecimalsLegendY,
            isNumDecimalsDefaultLegend: isNumDecimalsDefaultLegend,
            numDecimalsAxisX: decimalsAxisX,
            numDecimalsAxisY: decimalsAxisY,
            isNumDecimalsDefaultAxisX: isNumDecimalsDefaultAxisX,
            isNumDecimalsDefaultAxisY: isNumDecimalsDefaultAxisY,
            axisRangeLoY: (isValidNumber(axisRangeHiY) && isValidNumber(axisRangeLoY)) ? axisRangeLoY : null,           //only if hi lo existed
            axisRangeHiY: (isValidNumber(axisRangeHiY) && isValidNumber(axisRangeLoY)) ? axisRangeHiY : null,
            axisRangeLoX: (isValidNumber(axisRangeHiX) && isValidNumber(axisRangeLoX)) ? axisRangeLoX : null,
            axisRangeHiX: (isValidNumber(axisRangeHiX) && isValidNumber(axisRangeLoX)) ? axisRangeHiX : null,
            axisVisibleRangeY: isValidNumber(axisVisibleRangeY) ? axisVisibleRangeY : null,
            axisVisibleRangeX: isValidNumber(axisVisibleRangeX) ? axisVisibleRangeX : null,
            axisInvertedX: getBoolean(props["Track0.Curve" + curveIndex + ".XAxis.Inverted"], false),
            axisInvertedY: getBoolean(props["Track0.Curve" + curveIndex + ".YAxis.Inverted"], false),
            mergeIdentifierX: mergeIdentifierX,
            mergeIdentifierY: mergeIdentifierY,
            signalIdX: props["Track0.Curve" + curveIndex + ".XItemID"],
            signalIdY: props["Track0.Curve" + curveIndex + ".YItemID"],
            axisLocationX: axisLocationX,
            axisLocationY: axisLocationY,
            timeUpdateIdentifier: parseInt(props["Track0.Curve" + curveIndex + ".TimeUpdateIdentifier"]),
            followTimeRef: getBoolean(props["Track0.Curve" + curveIndex + ".FollowTimeref"], true),
            timeUpdateItemIndexes: [],             //used to store update item index group
            staticLinesX: staticLinesArray[0],
            staticLinesY: staticLinesArray[1],
            itemAttributesX: itemAttributes[0],
            itemAttributesY: itemAttributes[1],
            markCurrentPoint: getBoolean(props["Track0.Curve" + curveIndex + ".MarkCurrentPoint"], false),
            symbolsOnlyOnChange: getBoolean(props["Track0.Curve" + curveIndex + ".SymbolsOnlyOnChange"], false),
        };

        return curveProperty;
    }

    function getStaticLinePropertiesFromCurveProps(props, curveIndex) {
        var staticLinesX = [];
        var staticLinesY = [];

        var staticLinesCountX = parseInt(props[('Track0.Curve') + curveIndex + '.' + 'XItem.StaticLines.Count']);
        for (var i = 0; i < staticLinesCountX; i++) {
            staticLinesX.push({
                index: i,
                penSize: props["Track0.Curve" + curveIndex + "." + "XItem.StaticLine" + i + ".PenSize"],
                curveType: props["Track0.Curve" + curveIndex + "." + "XItem.StaticLine" + i + ".CurveType"],
                value: props["Track0.Curve" + curveIndex + "." + "XItem.StaticLine" + i + ".Value"],
            });
        }

        var staticLinesCountY = parseInt(props[('Track0.Curve') + curveIndex + '.' + 'YItem.StaticLines.Count']);
        for (var i = 0; i < staticLinesCountY; i++) {
            staticLinesY.push({
                index: i,
                penSize: props["Track0.Curve" + curveIndex + "." + "YItem.StaticLine" + i + ".PenSize"],
                curveType: props["Track0.Curve" + curveIndex + "." + "YItem.StaticLine" + i + ".CurveType"],
                value: props["Track0.Curve" + curveIndex + "." + "YItem.StaticLine" + i + ".Value"],
            });
        }

        return [staticLinesX, staticLinesY];
    }

    my.getStaticLinesProperty = function (curveIndex, isXItem, jqPlotter) {
        var curveProperty = getCurvePropertyByCurveIndex(curveIndex, jqPlotter.curveProperties);
        if (isXItem)
            return curveProperty.staticLinesX;
        else
            return curveProperty.staticLinesY;
    }

    my.setStaticLinesProperty = function (staticLines, curveIndex, isXItem, jqPlotter) {
        var curveProperty = getCurvePropertyByCurveIndex(curveIndex, jqPlotter.curveProperties);
        if (isXItem)
            curveProperty.staticLinesX = staticLines;
        else
            curveProperty.staticLinesY = staticLines;
    }

    function getItemAttributesFromCurveProps(props, curveIndex) {
        var attributesX = [];
        var attributesY = [];
        function Attribute() {
            this.AreaPlotItemIndex = null;
            this.BadSymbols = null;
            this.Color = null;
            this.CurveType = null;
            this.Name = null;
            this.PenSize = null;
            this.PlotType = null;
            this.UnitConversion = null;
            this.Value = null;
            this.ItemReference = null;
        };
        var countX = props[('Track0.Curve') + curveIndex + '.' + 'XItem.Property.Count'] || 0;
        var countY = props[('Track0.Curve') + curveIndex + '.' + 'YItem.Property.Count'] || 0;

        // get X attribute 
        for (var i = 0; i < countX; i++) {
            var attribute = new Attribute();
            for (var key in attribute) {
                var actualKey = ('Track0.Curve') + curveIndex + '.' + 'XItem.Property.' + key + '.' + i;
                attribute[key] = props[actualKey] || null;

                if (key.toLowerCase() == 'color') {
                    attribute[key] = colorToColorString(attribute[key]);
                }
            }

            attributesX.push(attribute);
        }

        // get Y attribute 
        for (var i = 0; i < countY; i++) {
            var attribute = new Attribute();
            for (var key in attribute) {
                var actualKey = ('Track0.Curve') + curveIndex + '.' + 'YItem.Property.' + key + '.' + i;
                attribute[key] = props[actualKey] || null;
                if (key.toLowerCase() == 'color') {
                    attribute[key] = colorToColorString(attribute[key]);
                }
            }

            attributesY.push(attribute);
        }

        return [attributesX, attributesY];
    }

    return my;
}());

//get curve property by curve index
function getCurvePropertyByCurveIndex(curveIndex, curveProperties) {
    for (var i = 0; i < curveProperties.length; i++) {
        if (curveProperties[i].curveIndex == curveIndex)
            return curveProperties[i];
    }
    return null;
}

function QualityVisualizationProp(mask, bitpattern, equalcondition, hidden, imgurl) {
    this.mask = mask;
    this.bitpattern = bitpattern;
    this.equalcondition = equalcondition;
    this.hidden = hidden;
    this.imgurl = imgurl;
}

function parsePropQualityVisiualization(prop) {
    var i = 0;
    var qvpArr = new Array();
    while (true) {
        var strQV = "Track0.QualityVisualization" + i.toString();
        if (prop[strQV] == undefined || prop[strQV] == null)
            break;
        var propString = prop[strQV];
        //name, settings, defaultValue, delimiter
        var mask = parseInt(getPropertyFromString("mask", propString, "4294901760", "#"));
        var bitpattern = parseInt(getPropertyFromString("bitpattern", propString, "0", "#"));
        var equalcondition = getPropertyFromString("equalcondition", propString, "True", "#");
        var delimiter = '¤';
        var index0 = propString.indexOf(delimiter);
        var index1 = propString.indexOf(delimiter, index0 + 1);
        var hidden = false;
        if (index0 + 1 < index1) {
            hidden = propString.substring(index0 + 1, index1).toLowerCase() == "true";
        }

        index0 = index1;
        index1 = propString.indexOf(delimiter, index0 + 1);
        var imgUrl;
        if (index0 + 1 < index1) {
            imgUrl = propString.substring(index0 + 1, index1);
        }
        else {
            imgUrl = "";
        }
        var qvProp = new QualityVisualizationProp(mask, bitpattern, equalcondition, hidden, imgUrl);
        qvpArr[i] = qvProp;
        i++;
    }
    return qvpArr;
}
