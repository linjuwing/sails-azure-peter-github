var JqPlotter_Legend = (function () {
    var my = {};

    //set legend visible
    function setLegendVisible(elemId, visible) {
        var legendDiv = $("#" + elemId + "_legenddiv");
        if (visible)
            legendDiv.css("display", "none");
        else
            legendDiv.css("display", "block");
    }

    function setLegendInitialHeight(visibleRowsNumber, totalRowsNumber, pexPlotterHeight, legendDiv, legendTableDiv, chartDiv) {
        if (visibleRowsNumber > totalRowsNumber)
            visibleRowsNumber = totalRowsNumber;
        if (visibleRowsNumber == 0)
            var legendHeight = visibleRowsNumber * (CONSTANT.legendAppearance.trHeight + CONSTANT.legendAppearance.tdBorderWidth) + CONSTANT.legendAppearance.tableBorderWidth;
        else
            var legendHeight = visibleRowsNumber * (CONSTANT.legendAppearance.trHeight + CONSTANT.legendAppearance.tdBorderWidth) + CONSTANT.legendAppearance.tableBorderWidth * 2;
        var chartHeight = pexPlotterHeight - (legendHeight + CONSTANT.legendAppearance.marginBottom);

        legendDiv.height(legendHeight);
        legendTableDiv.height(legendDiv.height());
        chartDiv.height(chartHeight);

        chartDiv.jqChart('update');
    }

    function getLegendRowId(curveIndex, attributeIndex) {
        var rowId = curveIndex.toString();
        if (attributeIndex >= 0)
            rowId += '_' + attributeIndex.toString();
        return rowId;
    }
    my.getLegendRowId = getLegendRowId;

    function createRow(commonProperty, options) {
        var legendRow = $('<tr />', {});

        var elementCells = [];

        if (!options.draggable) {       //if it is top legend
            var deleteButtonCell = createDeleteButtonCell(commonProperty, options, legendRow);
            deleteButtonCell.td.appendTo(legendRow);
            elementCells.push(deleteButtonCell);
        }
        var curveTypeCell = createCurveTypeCell(commonProperty, options, legendRow);
        var itemNameCell = createItemNameCell(commonProperty, options, legendRow);
        var valueCell = createValueCell(commonProperty, options, legendRow);
        var unitCell = createUnitCell(commonProperty, options, legendRow);
        var qualityCell = createQualityCell(commonProperty, options, legendRow);
        var descriptionCell = createDescriptionCell(commonProperty, options, legendRow);

        elementCells.push(curveTypeCell);
        elementCells.push(itemNameCell);
        elementCells.push(valueCell);
        elementCells.push(unitCell);
        elementCells.push(qualityCell);
        elementCells.push(descriptionCell);

        var row = {
            curveIndex: options.curveIndex,
            attributeIndex: options.attributeIndex,
            isXItem: options.isXItem,
            itemTag: options.itemTag,
            tr: legendRow,
            elementCells: elementCells,
        };

        legendRow.data("legendRowData", row);

        // listen to row event
        var ee = window.pageProperty.eventEmitter;
        var rowId = getLegendRowId(options.curveIndex, options.attributeIndex);
        var curveTypeChangedEventName = commonProperty.elementId + "_" + rowId + "_curveTypeChanged";
        ee.addListener(curveTypeChangedEventName, function (appearanceProperty) {
            setRowAppearance(legendRow, appearanceProperty, commonProperty);
        });

        return row;
    }

    function removeRowFromLegend(curveIndex, attributeIndex, legendProperty) {
        for (var i = 0; i < legendProperty.rows.length; i++) {
            if (attributeIndex < 0) {       //remove curve
                if (legendProperty.rows[i].curveIndex == curveIndex) {
                    legendProperty.rows[i].tr.remove();
                    legendProperty.rows.splice(i, 1);
                    i--;
                }
            } else {       //remove attribute
                if (legendProperty.rows[i].curveIndex == curveIndex
                    && legendProperty.rows[i].attributeIndex == attributeIndex) {
                    legendProperty.rows[i].tr.remove();
                    legendProperty.rows.splice(i, 1);
                    break;
                }
            }
        }
    }

    function addCurveRowsToTable(legendTable, commonProperty, curveProperties, draggable) {
        var legendProperty = { rows: [] };

        for (var i = 0; i < curveProperties.length; i++) {
            var curveProperty = curveProperties[i];

            var optionsY = {
                itemName: curveProperty.itemIdY,
                unit: curveProperty.unitY,
                unitIds: curveProperty.unitIdsY,
                unitNames: curveProperty.unitNamesY,
                description: curveProperty.descriptionY,
                numDecimals: curveProperty.numDecimalsLegendY,
                isNumDecimalsDefault: curveProperty.isNumDecimalsDefaultLegend,

                curveType: curveProperty.curveLineType,
                plotType: curveProperty.curvePlotType,
                penSize: curveProperty.curvePensize,
                color: curveProperty.curveColor, //curveProperty.series.fillStyle,

                itemTag: curveProperty.itemTagY,
                curveIndex: curveProperty.curveIndex,
                attributeIndex: -1,
                isXItem: false,

                markCurrentPoint: curveProperty.markCurrentPoint,
                symbolsOnlyOnChange: curveProperty.symbolsOnlyOnChange,
                draggable: draggable,
            }

            var row = createRow(commonProperty, optionsY);
            row.tr.appendTo(legendTable);
            legendProperty.rows.push(row);

            if (curveProperty.isXYPlot) {
                var optionsX = {
                    itemName: curveProperty.itemIdX,
                    unit: curveProperty.unitX,
                    unitIds: curveProperty.unitIdsX,
                    unitNames: curveProperty.unitNamesX,
                    description: curveProperty.descriptionX,
                    numDecimals: curveProperty.numDecimalsLegendX,
                    isNumDecimalsDefault: curveProperty.isNumDecimalsDefaultLegend,

                    curveType: curveProperty.curveLineType,
                    plotType: curveProperty.curvePlotType,
                    penSize: curveProperty.curvePensize,
                    color: curveProperty.curveColor,

                    itemTag: curveProperty.itemTagX,
                    curveIndex: curveProperty.curveIndex,
                    attributeIndex: -1,
                    isXItem: true,

                    markCurrentPoint: curveProperty.markCurrentPoint,
                    symbolsOnlyOnChange: curveProperty.symbolsOnlyOnChange,
                    draggable: draggable
                }

                var row = createRow(commonProperty, optionsX);
                row.tr.addClass(commonProperty.elementId + '_legend_XItems');            //xItem Row for remove
                if (!commonProperty.showXItemInLegend)
                    row.tr.addClass('jqPlotter-cell-hide');
                row.tr.appendTo(legendTable);
                legendProperty.rows.push(row);
            }

            // create legend rows for item attributes
            if (curveProperty.itemAttrSeries) {
                curveProperty.itemAttrSeries.forEach(function (series) {
                    var options = {
                        itemName: series.name,
                        unit: curveProperty.unitY,
                        unitIds: curveProperty.unitIdsY,
                        unitNames: curveProperty.unitNamesY,
                        description: curveProperty.descriptionY,
                        numDecimals: curveProperty.numDecimalsLegendY,
                        isNumDecimalsDefault: curveProperty.isNumDecimalsDefaultLegend,

                        curveType: series.attribute.CurveType,
                        plotType: series.attribute.PlotType,
                        penSize: parseInt(series.attribute.PenSize),
                        color: series.attribute.Color,

                        itemTag: series.itemTag,
                        curveIndex: curveProperty.curveIndex,
                        attributeIndex: series.attributeIndex,
                        isXItem: false,

                        markCurrentPoint: curveProperty.markCurrentPoint,
                        symbolsOnlyOnChange: curveProperty.symbolsOnlyOnChange,
                        draggable: draggable,
                    }

                    var row = createRow(commonProperty, options);
                    row.tr.appendTo(legendTable);
                    legendProperty.rows.push(row);
                });
            }
        }

        return legendProperty;
    }

    function createTopLegend(commonProperty, curveProperties) {
        var id = commonProperty.elementId + "_legenddiv";
        var div_class = 'jqPlotter-legend-div';
        var chartDiv = $("#" + commonProperty.elementId + "_chartdiv");

        var legendDiv = $('<div/>', {
            id: id,
            class: div_class
        }).addClass('context-menu-legend noselect').data('jqPlotter', chartDiv[0].jqPlotter);
        legendDiv.insertBefore(chartDiv);

        // set max-width so resizing works in multiple plotter
        legendDiv.css("max-width", legendDiv.parent().width());
        chartDiv.css("max-width", chartDiv.parent().width());
        legendDiv.css("background-color", commonProperty.backgroundcolor);

        var legendTableId = commonProperty.elementId + "_legendTable";
        var legendTableDiv = $('<div />', { class: 'jqPlotter-legend-table-div' }).appendTo(legendDiv);     //add a div to contain table;
        var legendTableClass = 'jqPlotter-legend-table';
        var legendTable = $('<table />', {
            id: legendTableId,
            class: legendTableClass,
        }).appendTo(legendTableDiv);
        legendTable.css("font", commonProperty.fontString);       //reuse fontstring
        legendTable.css("background-color", commonProperty.backgroundcolor);      //reuse background color

        var legendProperty = addCurveRowsToTable(legendTable, commonProperty, curveProperties, false);

        var rowsNumber = legendTable[0].rows.length;
        if (commonProperty.isXYPlot && !commonProperty.showXItemInLegend)
            rowsNumber = rowsNumber / 2;
        setLegendInitialHeight(commonProperty.legendVisibleRows,
            rowsNumber,
            commonProperty.pexPlotterHeight,
            legendDiv,
            legendTableDiv,
            chartDiv
            );

        var ignoreCols = [];
        if (commonProperty.legendElements.deleteButton)
            ignoreCols.push(0);
        if (commonProperty.legendElements.curveType) {
            if (commonProperty.legendElements.deleteButton)
                ignoreCols.push(1);
            else
                ignoreCols.push(0);
        }
        // make legend table resizable
        legendTable.colResizable({
            disabledColumns: ignoreCols,  // ignore delete button, curve type and description
            liveDrag: true,
            draggingClass: '',  // dont show a helper class to outline the resizing frame
        });

        var ee = window.pageProperty.eventEmitter;
        var legendDivHeight = legendDiv.height();
        ee.addListener(commonProperty.elementId + "HideLegend", function () {
            legendDivHeight = legendDiv.height();
            legendDiv.height(0);
            legendTableDiv.height(legendDiv.height());
            chartDiv.height(commonProperty.pexPlotterHeight - legendDiv.outerHeight());
            chartDiv.jqChart('update');
        });
        ee.addListener(commonProperty.elementId + "ShowLegend", function () {
            legendDiv.height(legendDivHeight);
            legendTableDiv.height(legendDiv.height());
            chartDiv.height(commonProperty.pexPlotterHeight - legendDiv.outerHeight());
            chartDiv.jqChart('update');
        });

        var eventName = commonProperty.elementId + CONSTANT.STRING.eventRemoveSeries;
        ee.addListener(eventName, function (curveIndex, attributeIndex) {
            legendTable.colResizable({ disable: true });
            //remove rows in table
            removeRowFromLegend(curveIndex, attributeIndex, legendProperty);

            if (legendDiv.height() > legendTable.outerHeight())
                legendDiv.height(legendTable.outerHeight());
            legendDiv.resize();

            legendTable.colResizable({ disable: false });
        });

        // make legend div resizable
        legendDiv.resizable({
            // s == south, only resizable on the buttom
            handles: 's',
            // to outline the resizing frame, defined in jqplotter.css
            helper: 'jqPlotter-legend-resizable-vertical',
            stop: function (event, ui) {
                legendTableDiv.height(legendDiv.height());

                var delta = ui.size.height - ui.originalSize.height;
                chartDiv.height(chartDiv.height() - delta);
                chartDiv.jqChart('update');

                legendTable.resize();
                updateGridAreaPosition(commonProperty.elementId);
            },
            maxHeight: $("#" + commonProperty.elementId).height() - 100,
            minHeight: 2,
        });

        return legendDiv;
    }

    function createEmbeddedLegend(commonProperty, curveProperties) {
        var id = commonProperty.elementId + "_legenddiv-draggable";
        var div_class = 'jqPlotter-legend-div-draggable';
        var chartDiv = $("#" + commonProperty.elementId + "_chartdiv");

        var legendDiv = $('<div/>', {
            id: id,
            class: div_class
        });

        legendDiv.css("background-color", commonProperty.backgroundcolor);
        legendDiv.addClass('context-menu-embedded-legend');

        var legendTableId = commonProperty.elementId + "_legend-draggable";
        var legendTableClass = 'jqPlotter-legend-table-draggable';
        var legendTable = $('<table />', {
            id: legendTableId,
            class: legendTableClass,
        }).appendTo(legendDiv);
        legendTable.css("font", commonProperty.fontString);       //reuse fontstring
        legendTable.css("background-color", commonProperty.backgroundcolor);      //reuse background color

        var legendProperty = addCurveRowsToTable(legendTable, commonProperty, curveProperties, true);

        var ee = window.pageProperty.eventEmitter;
        var putAtMiddle = once(function () {
            // put it at the middle of gridAreaContainer by default
            var container = $("#" + commonProperty.elementId + "_gridAreaContainer");
            legendDiv.css('left', container.width() / 2 - legendDiv.width() / 2);
        });
        ee.addListener(commonProperty.elementId + "HideLegend", function () {
            putAtMiddle();
            legendDiv.show();
        });
        ee.addListener(commonProperty.elementId + "ShowLegend", function () {
            legendDiv.hide();
        });

        var eventName = commonProperty.elementId + CONSTANT.STRING.eventRemoveSeries;
        ee.addListener(eventName, function (curveIndex, attributeIndex) {
            //remove rows in table
            removeRowFromLegend(curveIndex, attributeIndex, legendProperty);
        });

        var container = $("#" + commonProperty.elementId + "_gridAreaContainer");
        legendDiv.draggable({
            containment: container,
        });

        return legendDiv;
    }

    my.createLegend = function (commonProperty, curveProperties, draggable) {
        if (draggable) {
            return createEmbeddedLegend(commonProperty, curveProperties);
        } else {
            return createTopLegend(commonProperty, curveProperties);
        }
    }

    function createDeleteButtonCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.deleteButton;
        var td = $('<td />', { width: '16px' }).appendTo(tr).addClass(commonProperty.elementId + '_legend_deleteButton');
        if (!options.isXItem) {
            var buttonDiv = $('<div/>', { class: 'jqPlotter-legend-deletebutton-div' });
            buttonDiv.css("background-color", options.color);
            buttonDiv.text('X');
            buttonDiv.appendTo(td);

            if (!commonProperty.disableRemoveButton) {
                buttonDiv.click(function () {
                    // send remove series event
                    var ee = window.pageProperty.eventEmitter;
                    var eventName = commonProperty.elementId + CONSTANT.STRING.eventRemoveSeries;
                    ee.emitEvent(eventName, [options.curveIndex, options.attributeIndex]);
                });
            }
        }

        if (!visible)
            td.addClass('jqPlotter-cell-hide');
        return { legendElementType: CONSTANT.legendElementTypes.deleteButton, visible: visible, td: td };
    }

    function createCurveTypeCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.curveType;
        var td = $('<td />', { width: '40px' }).appendTo(tr).addClass(commonProperty.elementId + '_legend_curveType');
        if (!options.isXItem) {
            var div = createCurveTypeDiv(options);
            div.appendTo(td);
        }
        if (!visible)
            td.addClass('jqPlotter-cell-hide');
        return { legendElementType: CONSTANT.legendElementTypes.curveType, visible: visible, td: td };
    }

    //analysis the curvetype string, and show different sign in div
    function createCurveTypeDiv(options) {
        var div = $('<div />');
        div.css('position', 'relative');

        if (options.curveType.indexOf("LONG_SHORT") > -1) {
            var line1div = $('<div/>', { class: 'jqPlotter-legend-curvetype-long-dash-left-div' });
            line1div.css('border-top-color', options.color);
            line1div.css('border-top-width', options.penSize);
            line1div.appendTo(div);

            var line2div = $('<div/>', { class: 'jqPlotter-legend-curvetype-long-dash-right-div' });
            line2div.css('border-top-color', options.color);
            line2div.css('border-top-width', options.penSize);
            line2div.appendTo(div);

            line1div.css('margin-top', parseInt(4 - options.penSize / 2));
            line2div.css('margin-top', parseInt(4 - options.penSize / 2));
        }
        else if (options.curveType.indexOf("SHORT_LONG") > -1) {
            var line1div = $('<div/>', { class: 'jqPlotter-legend-curvetype-short-dash-left-div' });
            line1div.css('border-top-color', options.color);
            line1div.css('border-top-width', options.penSize);
            line1div.appendTo(div);

            var line2div = $('<div/>', { class: 'jqPlotter-legend-curvetype-short-dash-right-div' });
            line2div.css('border-top-color', options.color);
            line2div.css('border-top-width', options.penSize);
            line2div.appendTo(div);

            line1div.css('margin-top', parseInt(4 - options.penSize / 2));
            line2div.css('margin-top', parseInt(4 - options.penSize / 2));
        }
        else if (options.curveType.indexOf("EVEN") > -1) {
            var line1div = $('<div/>', { class: 'jqPlotter-legend-curvetype-even-dash-left-div' });
            line1div.css('border-top-color', options.color);
            line1div.css('border-top-width', options.penSize);
            line1div.appendTo(div);

            line1div.css('margin-top', parseInt(4 - options.penSize / 2));
        }
        else if (options.curveType.indexOf("NO_CURVE") > -1) {
            var linediv = $('<div/>', { class: 'jqPlotter-legend-curvetype-no-curve-div' });

            linediv.appendTo(div);
        }
        else {
            var linediv = $('<div/>', { class: 'jqPlotter-legend-curvetype-line-div' });
            linediv.css('border-top-color', options.color);
            linediv.css('border-top-width', options.penSize);
            linediv.appendTo(div);

            linediv.css('margin-top', parseInt(4 - options.penSize / 2));
        }

        if (options.curveType.indexOf("CIRCLE") > -1) {
            var signdiv = $('<div/>', { class: 'jqPlotter-legend-curvetype-circle-div' });
            signdiv.css('color', options.color);
            signdiv.html("&bull;&nbsp;&nbsp;&nbsp;&bull;");
            signdiv.appendTo(div);
        }
        else if (options.curveType.indexOf("XMARK") > -1) {
            var signdiv = $('<div/>', { class: 'jqPlotter-legend-curvetype-xmark-div' });
            signdiv.css('color', options.color);
            signdiv.html("X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X");
            signdiv.appendTo(div);
        }
        else if (options.curveType.indexOf("STAR") > -1) {
            var signdiv = $('<div/>', { class: 'jqPlotter-legend-curvetype-star-div' });
            signdiv.css('color', options.color);
            signdiv.html("&diams;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&diams;");
            signdiv.appendTo(div);
        }

        return div;
    }

    function createItemNameCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.itemName;
        var td = $('<td />').appendTo(tr).addClass(commonProperty.elementId + '_legend_itemName');
        td.text(options.itemName.toString());
        if (commonProperty.legendTextColorLikeItem.itemName)
            td.css('color', options.color);
        if (!visible)
            td.addClass('jqPlotter-cell-hide');

        if (options.draggable) {
            td.css("background-color", "#F0F0F0");
        }

        return { legendElementType: CONSTANT.legendElementTypes.itemName, visible: visible, td: td };
    }

    function createValueCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.value;
        var tdValueClass = commonProperty.elementId + '_legend_value';
        var td = $('<td />', { class: tdValueClass, }).appendTo(tr);
        var textDiv = $('<div/>', { class: 'text-div' }).appendTo(td);
        textDiv.css('text-align', 'right');
        textDiv.text('0');

        if (commonProperty.legendTextColorLikeItem.value)
            td.css('color', options.color);
        if (!visible)
            td.addClass('jqPlotter-cell-hide');

        var valueCellData = {
            itemTag: options.itemTag,
            curveIndex: options.curveIndex,
            attributeIndex: options.attributeIndex,
            isXItem: options.isXItem,

            decimals: options.numDecimals,
            isDecimalsDefault: options.isNumDecimalsDefault,
        }
        textDiv.data("legendValueCell", valueCellData);

        // listen to decimals changing
        var ee = window.pageProperty.eventEmitter;
        var legendDecimalsChangedEventName = commonProperty.elementId + "_" + options.itemTag + "_decimals";
        ee.addListener(legendDecimalsChangedEventName, function (decimals, isDecimalsDefault) {
            options.numDecimals = decimals;
            options.isNumDecimalsDefault = isDecimalsDefault;

            var actValue = parseFloat(textDiv.data("actValue"));
            var formattedValue = CommonFunction.formatItemValue(actValue,
                                    false,
                                    options.numDecimals);
            textDiv.text(formattedValue.toString());
        });
        // listen to axis decimals changing
        var axisDecimalsChangedEventName = commonProperty.elementId + "_" + options.curveIndex + "_" + (options.isXItem ? "X" : "Y") + "_axisDecimals";
        ee.addListener(axisDecimalsChangedEventName, function (decimals) {
            if (options.isNumDecimalsDefault)
                options.numDecimals = decimals + 1;

            var actValue = parseFloat(textDiv.data("actValue"));
            var formattedValue = CommonFunction.formatItemValue(actValue,
                                    false,
                                    options.numDecimals);
            textDiv.text(formattedValue.toString());
        });
        // listen to item NewValue event to update td.text in realtime
        var itemChangedEventName = commonProperty.elementId + "_" + options.itemTag + "_NewValue";
        ee.addListener(itemChangedEventName, function (value, quality) {
            if (commonProperty.rulerOn)
                return;
            var formattedValue = CommonFunction.formatItemValue(value,
                                    false,
                                    options.numDecimals);
            textDiv.text(formattedValue.toString());
            textDiv.data("actValue", value);
        });
        var valueOnRulerEvent = commonProperty.elementId + "_" + options.itemTag + "_ValueOnRuler";
        ee.addListener(valueOnRulerEvent, function (valueOnRuler) {
            //if (!commonProperty.rulerOn) //slider could use this branch also, so delete this condition and test if there's bug
            //    return;
            var formattedValue = CommonFunction.formatItemValue(valueOnRuler[1],
                                    false,
                                    options.numDecimals);
            //td.text(formattedValue.toString());
            textDiv.text(formattedValue.toString());
        });

        if (options.draggable) {
            td.css("background-color", "#F0F0F0");
        }

        return { legendElementType: CONSTANT.legendElementTypes.value, visible: visible, td: td };
    }

    function createUnitCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.unit;
        var td = $('<td />').appendTo(tr).addClass(commonProperty.elementId + '_legend_unit');

        var unitControls = $(".stdtogglebutton").get(0);
        if (unitControls
            && commonProperty.unitEditable
            && commonProperty.userInteractionUnitChange
            && !options.draggable) {
            // create the unit select instead of regular text

            var id = commonProperty.elementId + "_" + options.itemTag;
            var name = commonProperty.elementId + "$" + options.itemTag;
            var select = $("<select id =\"" + id + "\" name=\"" + name + "\" />");
            options.unitIds.forEach(function (unitId, index) {
                var selectOption = $("<option value=\"" + unitId + "\">" + options.unitNames[index] + "</option>");
                if (options.unitNames[index] == options.unit) {
                    selectOption.attr("selected", "selected");
                }
                selectOption.appendTo(select);
            })
            select.bind('change', function () {
                setTimeout(__doPostBack(name), 0);
            })

            var css = {
                visibility: 'visible',
                width: '100%',
                'background-color': 'inherit',
            }
            select.css(css).appendTo(td);
        } else {
            td.text(options.unit.toString());
            if (commonProperty.legendTextColorLikeItem.unit)
                td.css('color', options.color);
            if (!visible)
                td.addClass('jqPlotter-cell-hide');

            if (options.draggable) {
                td.css("background-color", "#F0F0F0");
            }
        }

        return { legendElementType: CONSTANT.legendElementTypes.unit, visible: visible, td: td };
    }

    function createQualityCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.quality;
        var tdQualityClass = commonProperty.elementId + '_legend_quality';
        var td = $('<td />', { class: tdQualityClass }).appendTo(tr);
        if (commonProperty.legendTextColorLikeItem.quality)
            td.css('color', options.color);
        if (!visible)
            td.addClass('jqPlotter-cell-hide');

        // listen to item NewValue event to update td.text in realtime
        var ee = window.pageProperty.eventEmitter;
        if (!options.isXItem) {
            var itemChangedEventName = commonProperty.elementId + "_" + options.itemTag + "_NewValue";
            ee.addListener(itemChangedEventName, function (value, quality) {
                if (commonProperty.rulerOn)
                    return;
                var qualityStrings = QualityParser.decodeOPCQuality(parseInt(quality));
                var qualityText = qualityStrings.join(":");
                td.text(qualityText);
                if (qualityStrings[1] == "good") {
                    if (options.draggable)
                        td.css("background-color", "#F0F0F0");
                    else
                        td.css("background-color", commonProperty.backgroundcolor);
                }
                else {
                    td.css("background-color", "#ff0000");
                }
            });
            var valueOnRulerEvent = commonProperty.elementId + "_" + options.itemTag + "_ValueOnRuler";
            ee.addListener(valueOnRulerEvent, function (valueOnRuler) {

                var qualityStrings = QualityParser.decodeOPCQuality(valueOnRuler[2]);       //valueOnRuler[2]
                var quality = qualityStrings.join(":");

                td.text(quality);
                if (qualityStrings[1] == "good") {
                    if (options.draggable)
                        td.css("background-color", "#F0F0F0");
                    else
                        td.css("background-color", commonProperty.backgroundcolor);
                }
                else {
                    td.css("background-color", "#ff0000");
                }
            });
        }

        return { legendElementType: CONSTANT.legendElementTypes.quality, visible: visible, td: td };
    }

    function createDescriptionCell(commonProperty, options, tr) {
        var visible = commonProperty.legendElements.description;
        var td = $('<td />').appendTo(tr).addClass(commonProperty.elementId + '_legend_description');
        td.text(options.description.toString());
        if (commonProperty.legendTextColorLikeItem.itemName)
            td.css('color', options.color);
        if (!visible)
            td.addClass('jqPlotter-cell-hide');

        if (options.draggable) {
            td.css("background-color", "#F0F0F0");
        }

        return { legendElementType: CONSTANT.legendElementTypes.description, visible: visible, td: td };
    }

    my.setLegendDecimals = function (valueCellData, jqPlotter) {
        var decimals = valueCellData.decimals;
        var axis = getAxisByCurveIndex(valueCellData.curveIndex, valueCellData.isXItem, jqPlotter.chart.axes);
        //getAxisByItemTag(valueCellData.itemTag, jqPlotter.chart.axes);
        if (valueCellData.isDecimalsDefault)
            decimals = axis.labels.numDecimals + 1;

        //set numDecimals to series
        var series = getSeriesByCurveIndexAndAttributeIndex(valueCellData.curveIndex, valueCellData.attributeIndex, jqPlotter.visibleSeries);
        if (valueCellData.isXItem)
            series.numDecimalsX = decimals;
        else
            series.numDecimalsY = decimals;

        var ee = window.pageProperty.eventEmitter;
        var legendDecimalsChangedEventName = jqPlotter.commonProperty.elementId + "_" + valueCellData.itemTag + "_decimals";
        ee.emitEvent(legendDecimalsChangedEventName, [decimals, valueCellData.isDecimalsDefault]);
    }

    my.sendRowAppearanceEvent = function (curveIndex, attributeIndex, seriesAppearance, elementId) {
        var ee = window.pageProperty.eventEmitter;
        var rowId = getLegendRowId(curveIndex, attributeIndex);
        var curveTypeChangedEventName = elementId + "_" + rowId + "_curveTypeChanged";
        ee.emitEvent(curveTypeChangedEventName, [seriesAppearance]);

    }

    function setRowAppearance(row, seriesAppearance, commonProperty) {
        //set data
        var rowData = row.data('legendRowData');

        //removeButton
        if (!rowData.isXItem) {
            var deleteButtonTd = row.children("." + commonProperty.elementId + '_legend_deleteButton');
            deleteButtonTd.children().css("background-color", seriesAppearance.color);

            //curve type td
            var curveTypeTd = row.children("." + commonProperty.elementId + "_legend_curveType");
            curveTypeTd.empty();
            var curveTypeDiv = createCurveTypeDiv(seriesAppearance);
            curveTypeDiv.appendTo(curveTypeTd);
        }

        //itemName
        if (commonProperty.legendTextColorLikeItem.itemName)
            row.children("." + commonProperty.elementId + '_legend_itemName').css('color', seriesAppearance.color);

        if (commonProperty.legendTextColorLikeItem.value)
            row.children("." + commonProperty.elementId + '_legend_value').css('color', seriesAppearance.color);

        if (commonProperty.legendTextColorLikeItem.unit)
            row.children("." + commonProperty.elementId + '_legend_unit').css('color', seriesAppearance.color);

        if (commonProperty.legendTextColorLikeItem.quality)
            row.children("." + commonProperty.elementId + '_legend_quality').css('color', seriesAppearance.color);

        if (commonProperty.legendTextColorLikeItem.description)
            row.children("." + commonProperty.elementId + '_legend_description').css('color', seriesAppearance.color);
    }

    return my;
}());

var JqPlotter_InfoBar = (function () {
    var my = {};

    my.updateTimespanOnInfoBar = function (timespan, commonProperty) {
        $('#' + commonProperty.elementId + '_inforBar_timespan').trigger('timespanChanged', timespan);
    }

    my.updateEndTimestamp = function (endTimestamp, commonProperty) {
        if (!commonProperty.rulerOn && endTimestamp > 1079104496414)
            $('#' + commonProperty.elementId + '_inforBar_endTimestamp').trigger('endTimestampChanged', endTimestamp);
    }

    my.updateTimestampOnInfoBar = function (timestamp, commonProperty) {
        $('#' + commonProperty.elementId + '_inforBar_endTimestamp').trigger('endTimestampChanged', timestamp);
    }

    my.createInforBar = function (commonProperty) {
        var elemID = commonProperty.elementId;
        var $chartDiv = $('#' + elemID + '_chartdiv');
        var jqPlotter = $chartDiv[0].jqPlotter;

        var inforBar = $('<div id="' + elemID + '_inforBar" class="jqPlotter-inforBar"></div>').data('jqPlotter', jqPlotter)
            .appendTo($('#' + elemID + '_chartdiv')).css("font", commonProperty.fontString).addClass('context-menu-inforBar');

        if (!commonProperty.userInteraction)
            inforBar.addClass('context-menu-disabled');

        var inforBarHandler = {
            //will be called when daupdate,zoomin/out,ruler moving
            endTimestampChanged: function (event, timestamp) {
                var endTimestamp = getDateTimeByTimeOffset(timestamp, commonProperty.timeOffset);
                var endtime = $.jqChartDateFormatter(endTimestamp, 'inforbartime');
                this.innerText = endtime;
            },
            //will be called when zoomin/out,right click plot area
            timespanChanged: function (event, timespan) {
                timespanNew = formatTimespan(timespan);
                this.innerText = timespanNew;
            },
            //will be called when change the signal period(updatetimeaxis),ruler moving
            resolutionChanged: function (event, resolution) {
                this.innerText = resolution;
            },
            timezoneChanged: function (event, timezone) {
                this.innerText = timezone;
            },
            mousedown: function () {
                $(this).addClass('clicked');
            },
            mouseout: function () {
                $(this).removeClass('clicked');
            },
            btnLegendMouseup: function () {
                $(this).removeClass('clicked');
                var ee = window.pageProperty.eventEmitter;
                if (this.innerText == '↑') {
                    this.innerText = '↓';
                    ee.emitEvent(elemID + "ShowLegend");
                }
                else {
                    this.innerText = '↑';
                    ee.emitEvent(elemID + "HideLegend");
                }
                updateGridAreaPosition(elemID);
            },
            btnZoomMouseup: function () {
                var ee = window.pageProperty.eventEmitter;
                var eventName = commonProperty.elementId + CONSTANT.STRING.eventResetZoom;
                ee.emitEvent(eventName, []);
            }
        }
        var inforbarElements = commonProperty.inforbarElements;
        var arr = ['endTimestamp', 'separater', 'timespan', 'separater',
            'resolution', 'separater', 'timezone', 'separater', 'btnLegend', 'btnZoom'];        //, 'btnZoom'
        var o;
        $.each(arr, function (i, value) {

            if (value == 'separater') {
                var $separater = $('<div></div>').appendTo(inforBar).addClass('jqPlotter-inforBar-separater').addClass(o);
                if (!inforbarElements[arr[i - 1]])
                    $separater.addClass('jqPlotter-cell-hide');
            }
            else if (value.indexOf("btn") == -1) {
                o = elemID + '_inforBar_' + value;
                var $textbox = $('<div id=' + elemID + '_inforBar_' + value + '>fdadf</div>')
                    .appendTo(inforBar)
                    .addClass('jqPlotter-inforBar-textbox')
                    .on(value + 'Changed', inforBarHandler[value + 'Changed'])
                    .addClass(o);
                if (!inforbarElements[value])
                    $textbox.addClass('jqPlotter-cell-hide');
            }
            else {
                var mouseupEvent = value + 'Mouseup';
                var $btn = $('<div ></div>').appendTo(inforBar)
                    .addClass('jqPlotter-inforBar-button')
                .on({
                    'mousedown': inforBarHandler.mousedown,
                    'mouseout': inforBarHandler.mouseout,
                    'mouseup': inforBarHandler[mouseupEvent]
                })
                if (value == 'btnLegend') {
                    if (!commonProperty.userInteraction)
                        $btn.css('visibility', 'hidden');
                    if (commonProperty.legendPosition.toLowerCase() == 'embedded')
                        $btn[0].innerText = '↑';
                    else
                        $btn[0].innerText = '↓';
                }
                else if (value == 'btnZoom') {
                    //var ddd = $('#' + elemID + '_inforBar_btnZoom');
                    $btn.addClass('jqPlotter-inforBar-zoom');
                    $btn.css("display", "none");
                    var ee = window.pageProperty.eventEmitter;
                    var zoomStatusChangedEventName = elemID + CONSTANT.STRING.eventZoomStatusChanged;
                    ee.addListener(zoomStatusChangedEventName, function (isZooming) {
                        if (isZooming) {
                            $btn.css("display", "block");
                        } else {
                            $btn.css("display", "none");
                        }
                    });
                }
            }
        })

        JqPlotter_InfoBar.updateTimespanOnInfoBar(commonProperty.initialTimespan, commonProperty);

        $('#' + elemID + '_inforBar_timezone').trigger('timezoneChanged', commonProperty.timezone);

        // update position and size when jqChart's chart.gridArea changed
        var ee = window.pageProperty.eventEmitter;
        var gridAreaChangedEventName = elemID + CONSTANT.STRING.eventGridAreaChanged;
        ee.addListener(gridAreaChangedEventName, function () {
            inforBar.css('left', commonProperty.gridAreaPosition.gridOffsetX);
            inforBar.width(commonProperty.gridAreaPosition.gridWidth);
            inforBar.css('top', commonProperty.gridAreaPosition.gridOffsetY - 20);
        });

        return inforBar;
    }

    my.updateResolution = function (minResolution, commonProperty) {
        if (minResolution == null)
            return;
        if (minResolution < 1000)
            minResolution = minResolution + 'ms';
        else {
            var o = Math.round(minResolution / 1000);
            minResolution = o < 10 ? '0' + o : o;
        }
        if (minResolution != commonProperty.minResolution) {
            $('#' + commonProperty.elementId + '_inforBar_resolution').trigger('resolutionChanged', minResolution);
            commonProperty.minResolution = minResolution;
        }
    }

    return my;
}());