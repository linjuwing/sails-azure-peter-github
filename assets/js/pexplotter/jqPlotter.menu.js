(function ($, undefined) {

    var selectedJqPlotter,
        initialized = false;
    var commonProperty;
    var $win = $(window);

    $.contextMenu = function (options) {
        var o = $.extend(true, {}, defaults, options || {});
        var $document = $(document);
        if (!o.selector)
            throw new error('No selector specified');
        if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
            throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
        }
        if (!o.items || $.isEmptyObject(o.items)) {
            throw new Error('No Items specified');
        }
        if (!initialized) {
            $document.on({
                'contextmenu:hide.contextMenu': handle.hideMenu,
                'contextmenu.contextMenu': handle.abortevent,
            }, '.context-menu-list')
            .on({
                'click.contextMenu': handle.itemClick,
                'contextmenu.contextMenu': handle.abortevent,
                'mouseenter.contextMenu': handle.itemMouseenter,
                'mouseleave.contextMenu': handle.itemMouseleave
            }, '.context-menu-item');
        }
        initialized = true;
        $document.on('contextmenu', o.selector, o, handle.contextmenu);
        op.create(o);
        return this;
    }

    $.fn.contextMenu = function (operation) {
        var gg = this.first();
        if (operation === undefined) {
            this.first().trigger('contextmenu');
        }
        else if (operation.x && operation.y) {
            this.first().trigger($.Event("contextmenu", { pageX: operation.x, pageY: operation.y }));
        }
    }

    var defaults = {
        selector: null,
        appendTo: null,
        trigger: "right",
        zIndex: 1,
        position: function (opt, x, y) {
            var $this = this,
                offset;
            // determine contextMenu position
            if (!x && !y) {
                opt.determinePosition.call(this, opt.$menu);
                return;
            } else {
                // x and y are given (by mouse event)
                offset = { top: y, left: x };
            }

            var bottom = $win.scrollTop() + $win.height(),
                right = $win.scrollLeft() + $win.width(),
                height = opt.$menu.height(),
                width = opt.$menu.width();

            if (offset.top + height > bottom) {
                offset.top -= height;
            }

            if (offset.left + width > right) {
                offset.left -= width;
            }

            opt.$menu.css(offset);
        },
        positionSubmenu: function ($menu) {
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "left top",
                    at: "right top",
                    of: this,
                    collision: "flipfit fit"
                }).css('display', '');
            } else {
                // determine contextMenu position
                var offset = {
                    top: 0,
                    left: this.outerWidth()
                };
                $menu.css(offset);
            }
        },

    };

    var zindex = function ($t) {
        var zin = 0,
            $tt = $t;

        while (true) {
            var df = $tt.css('z-index');
            var fdf = $tt.length;
            var ddf = $tt.prop('nodeName')
            var fdfg = "html body".indexOf($tt.prop('nodeName').toLowerCase());

            zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
            $tt = $tt.parent();
            if (!$tt || !$tt.length || "html body".indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                break;
            }
        }

        return zin;
    };

    var op = {
        create: function (opt, root) {
            if (root === undefined) {
                root = opt;
            }


            $.each(['callbacks', 'commands'], function (i, k) {
                opt[k] = {};
                if (!root[k]) {
                    root[k] = {};
                }
            });


            opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || "").data({
                'contextMenu': opt,
                'contextMenuRoot': root
            });

            $.each(opt.items, function (key, item) {
                var $t = $('<li id=' + key + ' class="context-menu-item"></li>').addClass(item.className || "");

                item.$node = $t.data({
                    'contextMenu': opt,
                    'contextMenuRoot': root,
                    'contextMenuKey': key
                });

                if (typeof item == "string") {
                    $t.addClass('context-menu-separator not-selectable');
                }
                else {
                    if (item.items) {
                        item.type = 'sub';
                    }
                    switch (item.type) {
                        case 'sub':
                            $('<span></span>').html(item._name || item.name).appendTo($t);
                            item.appendTo = item.$node;
                            op.create(item, root);
                            $t.data('contextMenu', item).addClass('context-menu-submenu');
                            item.callback = null;
                            break;
                        default:
                            $.each([opt, root], function (i, k) {
                                k.commands[key] = item;
                                if ($.isFunction(item.callback)) {
                                    k.callbacks[key] = item.callback;
                                }
                            });
                            $('<span></span>').html(item._name || item.name || "").appendTo($t);
                            break;
                    }

                    if (item.icon) {
                        $t.addClass("icon");
                    }
                    if (item.show_icon) {
                        $t.addClass("icon-" + item.icon);
                    }
                }
                $t.appendTo(opt.$menu);
            });
            if (!opt.$node) {
                opt.$menu.css('display', 'none').addClass('context-menu-root');
            }
            opt.$menu.appendTo(opt.appendTo || document.body);
        },

        show: function (opt, x, y) {
            var $trigger = $(this),
                offset,
                css = {};

            // hide any open menus
            $('#context-menu-layer').trigger('mousedown');

            // backreference for callbacks
            opt.$trigger = $trigger;

            op.update.call($trigger, opt, x, y);
            // position menu
            opt.position.call($trigger, opt, x, y);

            // make sure we're in front
            if (opt.zIndex) {
                css.zIndex = zindex($trigger) + opt.zIndex;
            }

            // add layer
            op.layer.call(opt.$menu, opt, css.zIndex);

            // adjust sub-menu zIndexes
            opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

            // position and show context menu
            opt.$menu.css(css).show(10);
            // make options available and set state
            $trigger
                .data('contextMenu', opt)
                .addClass("context-menu-active");

        },

        update: function (opt, x, y) {
            if (opt.selector == ".context-menu-axisX") {
                var axis = opt.$trigger.data('parentAxis');
                var timezoneName = commonProperty.timezone;
                var timeFormats = getTimeFormats(timezoneName);
                var date = new Date();
                date = getDateTimeByTimeOffset(date.getTime(), commonProperty.timeOffset)
                var timeIndex = commonProperty.axisXTimeId;
                opt.$menu.find('.icon-checked').removeClass('icon-checked');
                opt.$menu.find('#' + timeIndex).addClass('icon-checked');
                $.each(opt.$menu.find('.icon'), function (index, timeItem) {
                    if (index != 0)
                        timeItem.innerHTML = $.jqChartDateFormatter(date, timeFormats['time' + index]);
                });
                if (!commonProperty.userInteraction) {
                    opt.$menu.find('.context-menu-item').addClass('disabled');
                    opt.$menu.find('#fetchMoreData').removeClass('disabled');
                    opt.$menu.find('.context-menu-separator').removeClass('disabled');
                }
                opt.$menu.find("#moveAxis").html(axis.location == 'top' ? '<span>Move Axis South</span>' : '<span>Move Axis North</span>');
            }
            else if (opt.selector == ".context-menu-axis-value") {
                axis = opt.$trigger.data('parentAxis');
                if (axis.logarithmic) {
                    opt.$menu.find("#logarithmic").addClass('icon-checked');
                    opt.$menu.find("#autoScaling").css('display', "none");
                    opt.$menu.find("#manualScaling").css('display', "none");
                    opt.$menu.find("#visibleRange").css('display', "none");
                }
                else {
                    opt.$menu.find("#logarithmic").removeClass('icon-checked');
                    opt.$menu.find("#autoScaling").css('display', function () {
                        var axisRanged = false;
                        if (axis.isMerged)
                            axisRanged = isValidNumber(axis.rangeLoMerged) && isValidNumber(axis.rangeHiMerged);
                        else
                            axisRanged = isValidNumber(axis.rangeLo) && isValidNumber(axis.rangeHi);
                        return axisRanged || axis.rangeLoItem || axis.rangeHiItem ? "block" : "none";
                    });
                    opt.$menu.find("#manualScaling").css('display', "block");
                    opt.$menu.find("#visibleRange").css('display', "block");
                }
                if (!commonProperty.userInteractionAxisScaling) {
                    opt.$menu.find("#autoScaling").css('display', "none");
                    opt.$menu.find("#manualScaling").css('display', "none");
                    opt.$menu.find("#visibleRange").css('display', "none");
                }
                if (axis.reversed)
                    opt.$menu.find("#inverse").addClass('icon-checked');
                else
                    opt.$menu.find("#inverse").removeClass('icon-checked');

                var name = axis.name;
                var f = name.substring(name.length - 1);
                if (name.substring(name.length - 1) == 'Y') {
                    var df = opt.$trigger.data();
                    var fdf = opt.$menu.find('#mergeAxes');
                    var children = $(axis.div).parent().children();
                    opt.$menu.find('#mergeAxes').css('display', function () {
                        return axis.isSelected && commonProperty.axesYStatus.selectedNum > 1 ? "block" : "none";
                    });
                    opt.$menu.find("#mergeAllAxes").css('display', function () {
                        return commonProperty.visibleAxesCountY == 1 ? "none" : "block";
                    });
                    opt.$menu.find("#forkAxes").css('display', function () {
                        return axis.isMerged ? "block" : "none";
                    });
                    var ddf = opt.$menu.find("#moveAxis").html(axis.location == 'left' ? '<span>Move Axis East</span>' : '<span>Move Axis West</span>');
                    opt.$menu.find("#moveAllAxes").html(axis.location == 'left' ? '<span>Move Axes East</span>' : '<span>Move Axes West</span>');

                    for (var j = 0, visibleAxesNum = 0; j < children.length; j++) {
                        var axis = $(children[j]).data('parentAxis');
                        if (axis.visible)
                            visibleAxesNum++;
                    }
                    if (visibleAxesNum > 1) {
                        opt.$menu.find("#moveAllAxes").css('display', 'block')
                       .html(axis.location == 'left' ? '<span>Move Axes East</span>' : '<span>Move Axes West</span>');
                    }
                    else
                        opt.$menu.find("#moveAllAxes").css('display', 'none');
                }
                else {
                    var df = opt.$trigger.data();
                    var fdf = opt.$menu.find('#mergeAxes');
                    var children = $(axis.div).parent().children();
                    opt.$menu.find('#markTime').css('display', 'none');
                    opt.$menu.find('#mergeAxes').css('display', function () {
                        return axis.isSelected && commonProperty.axesXStatus.selectedNum > 1 ? "block" : "none";
                    });
                    opt.$menu.find("#mergeAllAxes").css('display', function () {
                        return commonProperty.visibleAxesCountX == 1 ? "none" : "block";
                    });
                    opt.$menu.find("#forkAxes").css('display', function () {
                        return axis.isMerged ? "block" : "none";
                    });
                    opt.$menu.find("#moveAxis").html(axis.location == 'top' ? '<span>Move Axis South</span>' : '<span>Move Axis North</span>');

                    for (var j = 0, visibleAxesNum = 0; j < children.length; j++) {
                        var axis = $(children[j]).data('parentAxis');
                        if (axis.visible)
                            visibleAxesNum++;
                    }
                    if (visibleAxesNum > 1) {
                        opt.$menu.find("#moveAllAxes").css('display', 'block')
                       .html(axis.location == 'top' ? '<span>Move Axes South</span>' : '<span>Move Axes North</span>');
                    }
                    else
                        opt.$menu.find("#moveAllAxes").css('display', 'none');

                }
            }
            else if (opt.selector == ".context-menu-legend") {
                if (!commonProperty.isXYPlot) {
                    opt.$menu.find('#XItems').css('display', 'none');
                }
                else {
                    opt.$menu.find('#XItems').html(commonProperty.showXItemInLegend ? 'Hide X items' : 'Show x items');
                }
                if (commonProperty.disableRemoveButton) {
                    opt.$menu.find('#deleteButton').addClass('disabled');
                }
                if (!commonProperty.userInteraction) {
                    opt.$menu.find('#changeCurvetype').css('display', 'none');
                    opt.$menu.find('#addStaticLines').css('display', 'none');
                }
                var target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                var content = target.innerText;
                opt.$menu.find('.context-menu-separator').css('display', 'none');
                opt.$menu.find('#decimals').css('display', 'none');
                if ($(target).hasClass("jqPlotter-legend-table-div"))
                    opt.$menu.find('#copy').css('display', 'none');
                else {
                    var td = $(target).is('td') ? $(target) : $(target).parents('td');
                    if (td.hasClass(commonProperty.elementId + '_legend_curveType') || td.hasClass(commonProperty.elementId + '_legend_button')
                        || !content) {
                        opt.$menu.find('#copy').css('display', 'none');
                    }
                    else {
                        opt.$menu.find('#copy').html('Copy ' + content);
                        opt.$menu.find('#copy').css('display', 'block');
                        opt.copyString = content;
                    }
                    if (td.hasClass(commonProperty.elementId + '_legend_value')) {
                        opt.$menu.find('.context-menu-separator').css('display', 'block');
                        opt.$menu.find('#decimals').css('display', 'block');
                    }
                    opt.menuElement = $(target);
                }
            } else if (opt.selector == ".context-menu-embedded-legend") {
                var target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                opt.menuElement = $(target);
            }
            else if (opt.selector == ".context-menu-inforBar") {
                var target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                if ($(target).hasClass("jqPlotter-inforBar-textbox")) {
                    var content = target.innerText;
                    opt.copyString = content;
                    opt.menuElement = $(target);
                }
            }
            else if (opt.selector == ".context-menu-plotArea") {
                opt.$menu.find('#noZoom').css('display', function () {
                    return !commonProperty.isZooming ? "none" : "block";
                });

                if (opt.$selectTimespan)
                    opt.$selectTimespan.removeClass('icon-checked');
                //handle timespan selection
                if (commonProperty.showAllData) {
                    opt.$selectTimespan = opt.$menu.find('#All');
                }
                else if (commonProperty.visibleDataPointCount > 0) {
                    opt.$selectTimespan = opt.$menu.find('#DataPointCount');
                } else {
                    var foundTimespan = false;
                    for (var obj in timespanArray) {
                        if (commonProperty.initialTimespan == parseInt(timespanArray[obj]) * 1000) {
                            opt.$selectTimespan = opt.$menu.find('#' + obj);
                            foundTimespan = true;
                        }
                    }
                    if (!foundTimespan)
                        opt.$selectTimespan = opt.$menu.find('#CustomTimespan');
                }
                opt.$selectTimespan.addClass('icon-checked');

                //handle xy grid selection
                opt.$menu.find('#gridOn').removeClass('icon-checked');
                opt.$menu.find('#xGridOn').removeClass('icon-checked');
                opt.$menu.find('#yGridOn').removeClass('icon-checked');
                if (commonProperty.gridXVisible) {
                    opt.$menu.find('#xGridOn').addClass('icon-checked');
                    opt.$menu.find('#gridOn').addClass('icon-checked');
                }
                if (commonProperty.gridYVisible) {
                    opt.$menu.find('#yGridOn').addClass('icon-checked');
                    opt.$menu.find('#gridOn').addClass('icon-checked');
                }
            }
        },

        layer: function (opt, zIndex) {
            // add transparent layer for click area
            // filter and background for Internet Explorer, Issue #23
            var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; filter: alpha(opacity=0); background-color: transparent;"></div>')
                .css({ height: document.body.scrollHeight, width: document.body.scrollWidth, display: 'block' })
                .data('contextMenuRoot', opt)
                .insertBefore(this)
                .on('contextmenu', handle.abortevent)
                .on('mousedown', handle.layerClick);

            // IE6 doesn't know position:fixed;
            if (!$.support.fixedPosition) {
                $layer.css({
                    'position': 'absolute',
                    'height': $(document).height()
                });
            }

            return $layer;
        },

        hide: function (opt, force) {
            var $trigger = $(this);
            if (!opt) {
                opt = $trigger.data('contextMenu') || {};
            }
            // remove options and revert state
            $trigger
                .removeData('contextMenu')
                .removeClass("context-menu-active");

            if (opt.$layer) {
                // keep layer for a bit so the contextmenu event can be aborted properly by opera
                setTimeout((function ($layer) {
                    var p = $layer;
                    return function () {
                        $layer.remove();
                    };
                })(opt.$layer), 10);

                try {
                    delete opt.$layer;
                } catch (e) {
                    opt.$layer = null;
                }
            }

            // remove handle
            $currentTrigger = null;
            // remove selected
            //opt.$menu.find('.hover').trigger('contextmenu:blur');

            // hide menu
            opt.$menu && opt.$menu.hide();

            setTimeout(function () {
                $trigger.trigger('contextmenu:hidden');
            }, 50);

        },

    }

    var handle = {

        itemClick: function (e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot,
                key = data.contextMenuKey,
                callback;

            // abort if the key is unknown or disabled or is a menu
            if (!opt.items[key] || $this.is('.disabled, .context-menu-submenu, .context-menu-separator, .not-selectable')) {
                return;
            }
            opt.$selected = $this;
            e.preventDefault();
            e.stopImmediatePropagation();

            if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
                // item-specific callback
                callback = root.callbacks[key];
            } else if ($.isFunction(root.callback)) {
                // default callback
                callback = root.callback;
            } else {
                // no callback, no action
                //return;
                root.$menu.trigger('contextmenu:hide');
                return;
            }

            if (callback.call(root.$trigger, key, root, selectedJqPlotter, e) !== false) {
                root.$menu.trigger('contextmenu:hide');
            }
        },

        abortevent: function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        },

        contextmenu: function (e) {
            var $this = $(this);

            e.preventDefault();
            e.stopImmediatePropagation();

            //abort event if menu is visible for this trigger
            if ($this.hasClass('context-menu-active')) {
                return;
            }

            if (!$this.hasClass('context-menu-disabled')) {
                // show menu               
                selectedJqPlotter = $this.data('jqPlotter') ? $this.data('jqPlotter') : $this.parent().data('jqPlotter');
                commonProperty = selectedJqPlotter.commonProperty;
                op.show.call($this, e.data, e.pageX, e.pageY);
            }
        },

        layerClick: function (e) {
            var $this = $(this),
                root = $this.data('contextMenuRoot'),
                mouseup = false,
                button = e.button,
                x = e.pageX,
                y = e.pageY,
                target,
                offset,
                selectors;

            e.preventDefault();
            e.stopImmediatePropagation();

            setTimeout(function () {
                var $window, hideshow, possibleTarget;
                var triggerAction = ((root.trigger == 'left' && button === 0) || (root.trigger == 'right' && button === 2));

                // find the element that would've been clicked, wasn't the layer in the way
                if (document.elementFromPoint) {
                    root.$layer.hide();
                    target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                    root.$layer.show();
                }

                if (root.reposition && triggerAction) {
                    if (document.elementFromPoint) {
                        if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                            root.position.call(root.$trigger, root, x, y);
                            return;
                        }
                    } else {
                        offset = root.$trigger.offset();
                        $window = $(window);
                        // while this looks kinda awful, it's the best way to avoid
                        // unnecessarily calculating any positions
                        offset.top += $window.scrollTop();
                        if (offset.top <= e.pageY) {
                            offset.left += $window.scrollLeft();
                            if (offset.left <= e.pageX) {
                                offset.bottom = offset.top + root.$trigger.outerHeight();
                                if (offset.bottom >= e.pageY) {
                                    offset.right = offset.left + root.$trigger.outerWidth();
                                    if (offset.right >= e.pageX) {
                                        // reposition
                                        root.position.call(root.$trigger, root, x, y);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }

                if (target && triggerAction) {
                    root.$trigger.one('contextmenu:hidden', function () {
                        $(target).contextMenu({ x: x, y: y });
                    });
                }

                root.$menu.trigger('contextmenu:hide');
            }, 50);
        },

        hideMenu: function (e, data) {
            var root = $(this).data('contextMenuRoot');
            op.hide.call(root.$trigger, root, data && data.force);
        },

        itemMouseenter: function (e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;
            // abort if we're re-entering
            if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            if (!$(this).hasClass('not-selectable'))
                $(this).addClass('hover');

            if (opt.$node) {
                root.positionSubmenu.call(opt.$node, opt.$menu);
            }
        },

        itemMouseleave: function (e) {
            $(this).removeClass('hover');
        },
    }

})(jQuery)

function drawCurveType(canvas, mark, stroke, color) {
    var context = canvas.getContext('2d');
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1;
    context.translate(0.5, 0.5);

    if (mark == 1) {
        // circle
        context.beginPath();
        context.arc(4, 10, 3, 0, 360, false);
        context.stroke();
        context.closePath();
        context.fill();

        context.beginPath();
        context.arc(36, 10, 3, 0, 360, false);
        context.stroke();
        context.closePath();
        context.fill();
    } else if (mark == 2) {
        // cross
        context.beginPath();
        context.moveTo(4 - 2, 10 - 2);
        context.lineTo(4 + 2, 10 + 2);
        context.moveTo(4 + 2, 10 - 2);
        context.lineTo(4 - 2, 10 + 2);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(36 - 2, 10 - 2);
        context.lineTo(36 + 2, 10 + 2);
        context.moveTo(36 + 2, 10 - 2);
        context.lineTo(36 - 2, 10 + 2);
        context.stroke();
        context.closePath();
    } else if (mark == 3) {
        // star
        context.beginPath();
        context.moveTo(4 - 3, 10);
        context.lineTo(4, 10 - 4);
        context.lineTo(4 + 3, 10);
        context.lineTo(4, 10 + 4);
        context.closePath();
        context.stroke();
        context.fill();


        context.beginPath();
        context.moveTo(36 - 3, 10);
        context.lineTo(36, 10 - 4);
        context.lineTo(36 + 3, 10);
        context.lineTo(36, 10 + 4);
        context.closePath();
        context.stroke();
        context.fill();
    }

    if (stroke == 0) {
        context.beginPath();
        context.moveTo(4, 10);
        context.lineTo(36, 10);
        context.stroke();
        context.closePath();
    } else if (stroke == 1) {
        context.beginPath();
        context.moveTo(4, 10);
        context.lineTo(20, 10);
        context.stroke();
        context.closePath();
    } else if (stroke == 2) {
        context.beginPath();
        context.moveTo(4, 10);
        context.lineTo(20, 10);
        context.moveTo(26, 10);
        context.lineTo(36, 10);
        context.stroke();
        context.closePath();
    } else if (stroke == 3) {
        context.beginPath();
        context.moveTo(4, 10);
        context.lineTo(8, 10);
        context.moveTo(29, 10);
        context.lineTo(33, 10);
        context.stroke();
        context.closePath();
    }

    context.restore();
}

function showColorPickerDialog(e, colorSelected) {
    var colors = [
         ["FFFFFF",
         "330000",
         "333300",
         "336600",
         "339900",
         "33CC00",
         "33FF00",
         "66FF00",
         "66CC00",
         "669900",
         "666600",
         "663300",
         "660000",
         "FF0000",
         "FF3300",
         "FF6600",
         "FF9900",
         "FFCC00",
         "FFFF00", ],

         ["CCCCCC",
         "330033",
         "333333",
         "336633",
         "339933",
         "33CC33",
         "33FF33",
         "66FF33",
         "66CC33",
         "669933",
         "666633",
         "663333",
         "660033",
         "FF0033",
         "FF3333",
         "FF6633",
         "FF9933",
         "FFCC33",
         "FFFF33", ],

         ["999999",
         "330066",
         "333366",
         "336666",
         "339966",
         "33CC66",
         "33FF66",
         "66FF66",
         "66CC66",
         "669966",
         "666666",
         "663366",
         "660066",
         "FF0066",
         "FF3366",
         "FF6666",
         "FF9966",
         "FFCC66",
         "FFFF66", ],

         ["666666",
         "330099",
         "333399",
         "336699",
         "339999",
         "33CC99",
         "33FF99",
         "66FF99",
         "66CC99",
         "669999",
         "666699",
         "663399",
         "660099",
         "FF0099",
         "FF3399",
         "FF6699",
         "FF9999",
         "FFCC99",
         "FFFF99", ],

         ["333333",
         "3300CC",
         "3333CC",
         "3366CC",
         "3399CC",
         "33CCCC",
         "33FFCC",
         "66FFCC",
         "66CCCC",
         "6699CC",
         "6666CC",
         "6633CC",
         "6600CC",
         "FF00CC",
         "FF33CC",
         "FF66CC",
         "FF99CC",
         "FFCCCC",
         "FFFFCC", ],

         ["000001",
         "3300FF",
         "3333FF",
         "3366FF",
         "3399FF",
         "33CCFF",
         "33FFFF",
         "66FFFF",
         "66CCFF",
         "6699FF",
         "6666FF",
         "6633FF",
         "6600FF",
         "FF00FF",
         "FF33FF",
         "FF66FF",
         "FF99FF",
         "FFCCFF",
         "FFFDFF", ],

         ["000002",
         "0000FF",
         "0033FF",
         "0066FF",
         "0099FF",
         "00CCFF",
         "00FFFF",
         "99FFFF",
         "99CCFF",
         "9999FF",
         "9966FF",
         "9933FF",
         "9900FF",
         "CC00FF",
         "CC33FF",
         "CC66FF",
         "CC99FF",
         "CCCCFF",
         "CCFFFF", ],

         ["000003",
         "0000CC",
         "0033CC",
         "0066CC",
         "0099CC",
         "00CCCC",
         "00FFCC",
         "99FFCC",
         "99CCCC",
         "9999CC",
         "9966CC",
         "9933CC",
         "9900CC",
         "CC00CC",
         "CC33CC",
         "CC66CC",
         "CC99CC",
         "CCCCCC",
         "CCFFCC", ],

         ["000004",
         "000099",
         "003399",
         "006699",
         "009999",
         "00CC99",
         "00FF99",
         "99FF99",
         "99CC99",
         "999999",
         "996699",
         "993399",
         "990099",
         "CC0099",
         "CC3399",
         "CC6699",
         "CC9999",
         "CCCC99",
         "CCFF99", ],

         ["000005",
         "000066",
         "003366",
         "006666",
         "009966",
         "00CC66",
         "00FF66",
         "99FF66",
         "99CC66",
         "999966",
         "996666",
         "993366",
         "990066",
         "CC0066",
         "CC3366",
         "CC6666",
         "CC9966",
         "CCCC66",
         "CCFF66", ],

         ["000006",
         "000033",
         "003333",
         "006633",
         "009933",
         "00CC33",
         "00FF33",
         "99FF33",
         "99CC33",
         "999933",
         "996633",
         "993333",
         "990033",
         "CC0033",
         "CC3333",
         "CC6633",
         "CC9933",
         "CCCC33",
         "CCFF33", ],

         ["000007",
         "000000",
         "003300",
         "006600",
         "009900",
         "00CC00",
         "00FF00",
         "99FF00",
         "99CC00",
         "999900",
         "996600",
         "993300",
         "990000",
         "CC0000",
         "CC3300",
         "CC6600",
         "CC9900",
         "CCCC00",
         "CCFF00", ]];


    var colorTable = '<table class="color-table">';
    for (var i = 0; i < colors.length; i++) {
        colorTable += '<tr>';
        for (var j = 0; j < colors[i].length; j++) {
            colorTable += '<td class="color-table-cell" style="background-color:' + '#' + colors[i][j] + '"></td>'
        }
        colorTable += '</tr>';
    }
    colorTable += '</table>';
    var dialogContent = $('<div>' + colorTable + '</div>');

    $(document.body).append(dialogContent);

    var cells = $('.color-table-cell');
    cells.click(function () {
        cells.removeClass('selected');
        $(this).addClass('selected');
    });

    dialogContent.dialog({
        title: 'Color picker',
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        position: { my: "center center", of: e, collision: "fit" },
        buttons: {
            "Ok": function () {
                if ($.isFunction(colorSelected)) {
                    colorSelected($('.color-table-cell.selected').css('background-color'));
                }
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            dialogContent.remove();
        }
    });
}

(function ($) {

    $.fn.colorpicker = function (colorSelected) {
        return this.each(function () {
            $(this).click(function (e) {
                showColorPickerDialog(e, colorSelected);
            });
        });
    };

}(jQuery));

function showChangeCurvetypeDialog(appearanceProperty, hasPreviousSeries, hasNextSeries, isXYPlot, e, selected) {

    var penWidthInput = '<label for="penWidthSelect" class="dialog-label">Pen width:</label><select name="penWidth" class="dialog-input" id="penWidthSelect">' +
        '<option value ="1">1</option>' +
        '<option value ="2">2</option>' +
        '<option value ="3">3</option>' +
        '<option value ="4">4</option>' +
        '<option value ="5">5</option>' +
        '<option value ="6">6</option>' +
        '<option value ="7">7</option>' +
        '</select>';


    var plotTypeInput = '<label for="plotTypeSelect" class="dialog-label">Plot type:</label><select name="plotType" class="dialog-input" id="plotTypeSelect">' +
        '<option value ="Line">Line</option>' +
        '<option value ="Area">Area</option>' +
        '<option value ="Line_Stepped">Line_Stepped</option>' +
        '<option value ="Area_Stepped">Area_Stepped</option>';

    if (!isXYPlot) {
        if (hasPreviousSeries)
            plotTypeInput += '<option value ="Area_Previous_Curve">Area_Previous_Curve</option>';
        if (hasNextSeries)
            plotTypeInput += '<option value ="Area_Next_Curve">Area_Next_Curve</option>';
    }

    plotTypeInput += '</select>';

    var colorInput = '<label for="colorInput" class="dialog-label">Color:</label>' + '<button id="colorInput" type="button" class="dialog-input">Change</button>';

    var markCurrentPointInput = '<input type="checkbox" name="markCurrentPoint" id="markCurrentPointInput">' + '<label for="markCurrentPointInput">Mark current point</label>';

    var symbolsOnlyOnChangeInput = '<input type="checkbox" name="symbolsOnlyOnChange" id="symbolsOnlyOnChangeInput">' + '<label for="symbolsOnlyOnChangeInput">Symbols only on change</label>';

    var sizeAndColorSettings = '<div>' + penWidthInput + '<br/>' + plotTypeInput + '<br/>' + colorInput + '<br/>' + markCurrentPointInput + '<br/>' + symbolsOnlyOnChangeInput + '</div>';

    var curveTypes = [['DEFAULT_CURVE', 'EVEN_DASHED_CURVE', 'LONG_SHORT_DASHED_CURVE', 'SHORT_LONG_DASHED_CURVE', ''],
        ['DEFAULT_CIRCLE_CURVE', 'EVEN_DASHED_CIRCLE_CURVE', 'LONG_SHORT_DASHED_CIRCLE_CURVE', 'SHORT_LONG_DASHED_CIRCLE_CURVE', 'CIRCLE_NO_CURVE'],
        ['DEFAULT_XMARK_CURVE', 'EVEN_DASHED_XMARK_CURVE', 'LONG_SHORT_DASHED_XMARK_CURVE', 'SHORT_LONG_DASHED_XMARK_CURVE', 'XMARK_NO_CURVE'],
        ['DEFAULT_STAR_CURVE', 'EVEN_DASHED_STAR_CURVE', 'LONG_SHORT_DASHED_STAR_CURVE', 'SHORT_LONG_DASHED_STAR_CURVE', 'STAR_NO_CURVE']];

    var curveTypesTable = '<table id="curveTypeTable">';
    for (var i = 0; i < 4; i++) {
        curveTypesTable += '<tr>';
        for (var j = 0; j < 5; j++) {
            curveTypesTable += '<td class="curvetype-cell" curvetype="' + curveTypes[i][j] + '"><canvas width="40px" height="20px"/></td>';
        }
        curveTypesTable += '</tr>';
    }
    curveTypesTable += '</table>';

    var dialogContent = $('<div><fieldset style="float:left"><legend>Size and color</legend><div class="curvetype-dialog-container">' + sizeAndColorSettings + '</div></fieldset>' +
        '<fieldset style="float:left"><legend>Curve types</legend><div class="curvetype-dialog-container">' + curveTypesTable + '</div></fieldset></div>');

    $(document.body).append(dialogContent);

    $('#colorInput').colorpicker(function (color) {
        $('#colorInput').css('border-color', color);
        var curveTypesTable = $('#curveTypeTable');
        for (var i = 0; i < 4; i++) {
            var tr = curveTypesTable.find('tr').eq(i);
            for (var j = 0; j < 5; j++) {
                var canvas = tr.find('canvas').eq(j);
                drawCurveType(canvas.get(0), i, j, color);
            }
        }
    });

    var curveTypesTable = $('#curveTypeTable');
    for (var i = 0; i < 4; i++) {
        var tr = curveTypesTable.find('tr').eq(i);
        for (var j = 0; j < 5; j++) {
            var canvas = tr.find('canvas').eq(j);
            drawCurveType(canvas.get(0), i, j, appearanceProperty.color);
        }
    }

    var cells = curveTypesTable.find('td');
    cells.click(function () {
        cells.removeClass('curvetype-cell-selected');
        $(this).addClass('curvetype-cell-selected');
    });

    if (appearanceProperty.penSize != undefined) {
        $("#penWidthSelect").val(appearanceProperty.penSize);
    }
    $("#plotTypeSelect").val(appearanceProperty.plotType);
    $("#colorInput").css({ "border-color": appearanceProperty.color, "border-width": '2px' });
    $("#markCurrentPointInput").prop('checked', appearanceProperty.markCurrentPoint);
    $("#symbolsOnlyOnChangeInput").prop('checked', appearanceProperty.symbolsOnlyOnChange);
    $("#curveTypeTable").find('td[curvetype="' + appearanceProperty.curveType + '"]').addClass('curvetype-cell-selected');

    function setCurveType() {
        if ($.isFunction(selected)) {
            // for ie, border-color is "", so use border-top-color instead
            var curveColor = ($("#colorInput").css("border-color") != "") ? $("#colorInput").css("border-color") : $("#colorInput").css("border-top-color");
            selected({
                penSize: parseInt($("#penWidthSelect").val()),
                plotType: $("#plotTypeSelect").val(),
                color: rgbToHex(curveColor),
                markCurrentPoint: $("#markCurrentPointInput").prop('checked'),
                symbolsOnlyOnChange: $("#symbolsOnlyOnChangeInput").prop('checked'),
                curveType: $("#curveTypeTable").find('.curvetype-cell-selected').attr('curvetype')
            });
        }
    }
    dialogContent.dialog({
        title: 'Curve types',
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        position: { my: "center center", of: e, collision: "fit" },
        buttons: {
            "Ok": function () {
                setCurveType();

                $(this).dialog("close");
            },
            "Apply": function () {
                setCurveType();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            dialogContent.remove();
        }
    });
}

function showAddStaticLinesDialog(staticLinesProperty, e, f) {
    var table = '<table id="staticLineTable">';
    table += '<tr><th>#</th><th>Value</th><th>Curve type</th><th>Pen size</th><th>Remove</th></tr>';
    table += '</table>'

    var dialogContent = $('<div>' + table + '</div>');
    $(document.body).append(dialogContent);

    var curveTypes = ['DEFAULT_CURVE', 'EVEN_DASHED_CURVE', 'LONG_SHORT_DASHED_CURVE', 'SHORT_LONG_DASHED_CURVE'];
    function addNewStaticLine(o) {

        var curveTypeInput = '<select class="curveTypeSelect">' +
                '<option value="0"></option>' +
                '<option value="1"></option>' +
                '<option value="2"></option>' +
                '<option value="3"></option>' +
                '</select>';

        var curveTypesToValue = {
            'DEFAULT_CURVE': 0,
            'EVEN_DASHED_CURVE': 1,
            'LONG_SHORT_DASHED_CURVE': 2,
            'SHORT_LONG_DASHED_CURVE': 3
        };

        //CurveTypes: "EVEN_DASHED", "LONG_SHORT", "SHORT_LONG"

        var penWidthInput = '<select class="penWidthSelect">' +
                '<option value ="1">1</option>' +
                '<option value ="2">2</option>' +
                '<option value ="3">3</option>' +
                '<option value ="4">4</option>' +
                '<option value ="5">5</option>' +
                '<option value ="6">6</option>' +
                '<option value ="7">7</option>' +
                '</select>';

        $('#staticLineTable tbody').append('<tr><td>' + o.index + '</td><td>' +
            '<input type="number" class="valueInput"/>' + '</td><td class="curvetype-td">' + curveTypeInput + '</td><td>' + penWidthInput + '</td><td class="remove-cell">' + '<input type="checkbox" class="removeCheckbox"/>' + '</td></tr>');

        var r = $('#staticLineTable tbody tr').filter(":last");

        $.widget("custom.curveTypeSelect", $.ui.selectmenu, {
            _renderItem: function (ul, item) {
                var li = $('<li><canvas width="40px" height="20px"/></li>');

                li.appendTo(ul);
                drawCurveType(li.children('canvas').get(0), 0, item.value, '#000000');

                return li;
            },
            _renderButtonItem: function (item) {

                var canvas = $('<canvas width="40px" height="20px"/>');

                drawCurveType(canvas.get(0), 0, item.value, '#000000');

                return canvas;
            }
        });

        r.find('.curveTypeSelect').val(curveTypesToValue[o.curveType]);
        r.find('.penWidthSelect').val(o.penSize);
        r.find('.valueInput').val(o.value);
        r.find('.curveTypeSelect').curveTypeSelect();
    }

    dialogContent.dialog({
        title: 'Edit static lines',
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        position: { my: "center center", of: e, collision: "fit" },
        buttons: {
            "Ok": function () {
                if ($.isFunction(f)) {
                    var staticLines = [];
                    $('#staticLineTable tbody').children('tr').each(function (i) {
                        if ($(this).find('.removeCheckbox').length > 0 && $(this).find('.removeCheckbox').prop('checked') == false) {
                            staticLines.push({
                                index: staticLines.length,
                                curveType: curveTypes[$(this).find('.curveTypeSelect').val()],
                                penSize: $(this).find('.penWidthSelect').val(),
                                value: $(this).find('.valueInput').val()
                            });
                        }
                    });

                    f(staticLines);
                }
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            },
            "Add": function () {
                var count = $('#staticLineTable tbody').children('tr').length - 1;
                addNewStaticLine({
                    index: count,
                    penSize: 1,
                    curveType: 'DEFAULT_CURVE',
                    value: 0
                });

            }
        },
        close: function (event, ui) {
            dialogContent.remove();
        }
    });

    for (var i = 0; i < staticLinesProperty.length; i++) {
        addNewStaticLine(staticLinesProperty[i]);
    }
}

var contextmenuHandler = {
    //deal with axisX menu click event
    axisXHandler: {
        updateAxisX: function (key, options, selectedJqPlotter) {
            var timezoneName = selectedJqPlotter.commonProperty.timezone;
            var timeFormats = getTimeFormats(timezoneName);
            var axis = this.data('axisX');
            var index = key.substr(key.length - 1, 1);
            if (axis.type == "dateTime") {
                axis.labels.stringFormat = timeFormats['time' + index];
            }
            selectedJqPlotter.commonProperty.axisXTimeId = key;
            //options.$menu.find('.icon')
            //  .siblings('.icon-checked').removeClass('icon-checked');
            //options.$selected.addClass('icon-checked');

            $('#' + selectedJqPlotter.commonProperty.controlId).jqChart('update');
        },

        fetchMoreData: function (key, options, selectedJqPlotter) {
            if (selectedJqPlotter) {
                //TODO: now we just use one axis, in next step we need axes X
                var axisX = selectedJqPlotter.allAxesX[0];
                if (axisX)
                    HistoricalAccess.requestHistoricalDataInTimespan(axisX, selectedJqPlotter.curveProperties, selectedJqPlotter.commonProperty);
            }
        },

        moveAxis: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            var div = axis.div;
            var containerTop = selectedJqPlotter.axesXDivContainer[0];
            var containerBottom = selectedJqPlotter.axesXDivContainer[1];
            if (axis.location == 'top') {
                axis.location = 'bottom';

                $(div).toggleClass('jqplotter-axis-div-top jqplotter-axis-div-bottom');
                insertDiv(containerBottom, $(div), true);
            }
            else {
                axis.location = 'top';
                //$(div).css('float', 'left');
                $(div).toggleClass('jqplotter-axis-div-top jqplotter-axis-div-bottom');
                insertDiv(containerTop, $(div));
            }
            $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
            updateGridAreaPosition(selectedJqPlotter.elm.id);
        },

        moveAllAxes: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            var containerTop = selectedJqPlotter.axesXDivContainer[0];
            var containerBottom = selectedJqPlotter.axesXDivContainer[1];
            var children = $(axis.div).parent().children();
            if (axis.location == 'top') {
                for (var i = 0; i < children.length; i++) {
                    var axis = $(children[i]).data('parentAxis');
                    var div = children[i];
                    axis.location = 'bottom';
                    $(div).toggleClass('jqplotter-axis-div-top jqplotter-axis-div-bottom');
                    insertDiv(containerBottom, $(div), true);
                }
            }
            else {
                for (var i = 0; i < children.length; i++) {
                    var axis = $(children[i]).data('parentAxis');
                    var div = children[i];
                    axis.location = 'top';
                    $(div).toggleClass('jqplotter-axis-div-top jqplotter-axis-div-bottom');
                    insertDiv(containerTop, $(div));
                }
            }
            $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
            updateGridAreaPosition(selectedJqPlotter.elm.id);
        },

    },

    //deal with axisY menu click event
    axisYHandler: {
        mergeAxes: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            var axisName = axis.name;
            var curveProperties = selectedJqPlotter.curveProperties;
            var commonProperty = selectedJqPlotter.commonProperty;
            if (!isValidObject(selectedJqPlotter))
                return;

            var xorY = axisName.substring(axisName.length - 1);
            //merge selected axes or All
            mergeAll = key.indexOf('All') > -1 ? true : false;

            var allAxes = selectedJqPlotter['allAxes' + xorY];
            var axesStatusName = 'axes' + xorY + 'Status';
            var existedAxes = getVisibleAxes(allAxes).sort(sortAxes);
            var selectedAxes = commonProperty[axesStatusName].selectedAxes.sort(sortAxes);
            var axestoMerge = mergeAll ? existedAxes : selectedAxes;
            var axestoMerge2 = axestoMerge.concat();
            //updateAxisMergedDataLimit(baseAxis, axesYtoMerge2);

            var baseAxis = mergeSeveralAxes(axestoMerge, curveProperties, commonProperty['mergeAxesBlack' + xorY]);
            if (baseAxis) {
                updateAxisMergedDataLimit(baseAxis, axestoMerge2);
                if (baseAxis.logarithmic) {
                    var gridAxis = xorY == 'Y' ? selectedJqPlotter.gridLineAxes[1] : selectedJqPlotter.gridLineAxes[0];
                    updateAllWhenSetAxisLog(baseAxis, allAxes, commonProperty, gridAxis);
                }

                while (selectedAxis = selectedAxes.shift()) {
                    //$(selectedAxis.div).trigger('mouseup');
                    setAxisStatus(selectedAxis, commonProperty.axesYStatus);
                }
                commonProperty['visibleAxesCount' + xorY] = getVisibleAxes(allAxes).length;
            }
            $("#" + commonProperty.elementId + "_chartdiv").jqChart('update');
            updateGridAreaPosition(commonProperty.elementId);
        },

        forkAxes: function (key, options, selectedJqPlotter) {
            var baseAxis = options.$trigger.data('parentAxis');
            var axisName = baseAxis.name;
            var axisIndex = axisName.substr(axisName.indexOf('_') + 1, 1);
            var curveProperties = selectedJqPlotter.curveProperties;
            var commonProperty = selectedJqPlotter.commonProperty;
            if (!isValidObject(selectedJqPlotter))
                return;
            var xorY = axisName.substring(axisName.length - 1);

            var gridAxis = xorY == 'Y' ? selectedJqPlotter.gridLineAxes[1] : selectedJqPlotter.gridLineAxes[0];
            var allAxes = selectedJqPlotter['allAxes' + xorY];

            if (baseAxis.logarithmic) {
                updateAllAxesWhenFork(baseAxis, allAxes, commonProperty, gridAxis);
            }
            forkAxis(baseAxis, allAxes, curveProperties);
            commonProperty['visibleAxesCount' + xorY] = getVisibleAxes(allAxes).length;
            if (baseAxis.isSelected)
                $(baseAxis.div).trigger('mouseup');
            $("#" + selectedJqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
            updateGridAreaPosition(selectedJqPlotter.elm.id);
        },


        inverse: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            axis.reversed = !axis.reversed;
            $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
        },

        autoScaling: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            var btn = options.$trigger.find('.jqplotter-axis-div-button');
            if (axis.rangLoItem || axis.rangeHiItem)
                return;
            if (axis.isMerged) {
                axis.rangeLoMerged = null;
                axis.rangeHiMerged = null;
                setValueAxisMinMax(axis, axis.automaticMinimumMerged, axis.automaticMaximumMerged);
            }
            else {
                axis.rangeLo = null;
                axis.rangeHi = null;
                setValueAxisMinMax(axis, axis.automaticMinimum, axis.automaticMaximum);
            }         
           
            if (!axis.isAxisX)
                updateAxisButton(btn, true);
            $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
        },

        manualScaling: function (key, options, selectedJqPlotter, e) {
            var axis = options.$trigger.data('parentAxis');
            var btn = options.$trigger.find('.jqplotter-axis-div-button')[0];
            showManualRangeDialog.call(btn, axis, $("#" + selectedJqPlotter.elm.id + "_chartdiv"), e);
        },

        visibleRange: function (key, options, selectedJqPlotter, e) {
            var axis = options.$trigger.data('parentAxis');

            var dialogContent = $('<div>' + '<input id="visibleRangeCheckbox" type="checkbox" name="visibleRange">' + '<label for="visibleRangeInput">Visible range:</label>' +
                '<input id="visibleRangeInput" type="number"/>' + '</div>');
            $(document.body).append(dialogContent);

            $("#visibleRangeCheckbox").prop("checked", false);
            $("#visibleRangeInput").attr("disabled", true);
            $("#visibleRangeInput").val(0);

            if (axis.visibleRange > 0) {
                $("#visibleRangeCheckbox").prop("checked", true);
                $("#visibleRangeInput").val(axis.visibleRange);
                $("#visibleRangeInput").attr("disabled", false);
            }

            $("#visibleRangeCheckbox").click(function () {
                if (!this.checked) {
                    $("#visibleRangeInput").val(0);
                }
                $("#visibleRangeInput").attr("disabled", !this.checked);
            });

            dialogContent.dialog({
                title: 'Visible range',
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                position: { my: "center center", of: e, collision: "fit" },
                buttons: {
                    "Ok": function () {
                        if (visibleRange < 0) {
                            alert("Impossible to set visible range less than 0");
                        } else {
                            JqPlotter_AxesFactory.setValueAxisVisibleRangeManually(axis, parseInt($("#visibleRangeInput").val()), selectedJqPlotter);
                            $(this).dialog("close");
                        }
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    dialogContent.remove();
                }
            });
        },

        moveAxis: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            if (!axis.isAxisX) {
                var div = axis.div;
                var containerLeft = selectedJqPlotter.axesYDivContainer[0];
                var containerRight = selectedJqPlotter.axesYDivContainer[1];
                if (axis.location == 'left') {
                    axis.location = 'right';
                    $(div).toggleClass('jqplotter-axis-div-left jqplotter-axis-div-right');
                    insertDiv(containerRight, $(div));
                }
                else {
                    axis.location = 'left';
                    $(div).toggleClass('jqplotter-axis-div-left jqplotter-axis-div-right');
                    insertDiv(containerLeft, $(div));
                }
                $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
                updateGridAreaPosition(selectedJqPlotter.elm.id);
            }
            else {
                contextmenuHandler.axisXHandler.moveAxis(key, options, selectedJqPlotter);
            }
        },

        moveAllAxis: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            if (!axis.isAxisX) {
                var containerLeft = selectedJqPlotter.axesYDivContainer[0];
                var containerRight = selectedJqPlotter.axesYDivContainer[1];
                var children = $(axis.div).parent().children();
                if (axis.location == 'left') {
                    for (var i = 0; i < children.length; i++) {
                        var axis = $(children[i]).data('parentAxis');
                        var div = children[i];
                        axis.location = 'right';
                        $(div).toggleClass('jqplotter-axis-div-left jqplotter-axis-div-right');
                        insertDiv(containerRight, $(div));
                    }
                }
                else {
                    for (var i = 0; i < children.length; i++) {
                        var axis = $(children[i]).data('parentAxis');
                        var div = children[i];
                        axis.location = 'left';
                        $(div).toggleClass('jqplotter-axis-div-left jqplotter-axis-div-right');
                        insertDiv(containerLeft, $(div));
                    }
                }
                $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
                updateGridAreaPosition(selectedJqPlotter.elm.id);
            }
            else {
                contextmenuHandler.axisXHandler.moveAllAxes(key, options, selectedJqPlotter);
            }
        },

        decimals: function (key, options, selectedJqPlotter, e) {
            var axis = options.$trigger.data('parentAxis');

            var dialogContent = $('<div>' + '<input id="decimalsCheckbox" type="checkbox" name="auto">' + '<label for="decimalsCheckbox">Auto</label>' +
                '<input id="decimalsInput" type="number"/>' + '</div>');
            $(document.body).append(dialogContent);

            $("#decimalsCheckbox").attr("checked", true);
            $("#decimalsInput").val(1);
            $("#decimalsInput").attr("disabled", true);

            if (!axis.labels.isNumDecimalsDefault) {
                $("#decimalsCheckbox").attr("checked", false);
                $("#decimalsInput").val(axis.labels.numDecimals);
                $("#decimalsInput").attr("disabled", false);
            }

            $("#decimalsCheckbox").click(function () {
                if (this.checked) {
                    $("#decimalsInput").val(1);
                }
                $("#decimalsInput").attr("disabled", this.checked);
            });

            dialogContent.dialog({
                title: 'Number of decimals',
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                position: { my: "center center", of: e, collision: "fit" },
                buttons: {
                    "Ok": function () {
                        var decimals = parseInt($("#decimalsInput").val());
                        var isDecimalsDefault = $("#decimalsCheckbox").is(':checked');
                        if (decimals > 20 || decimals < 0) {
                            alert("Impossible to set decimals larger than 20 or less than 0");
                        } else {
                            JqPlotter_AxesFactory.setValueAxisDecimalsManually(axis, decimals, isDecimalsDefault, selectedJqPlotter);
                            $(this).dialog("close");
                        }
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    dialogContent.remove();
                }
            });
        },

        logarithmic: function (key, options, selectedJqPlotter) {
            var axis = options.$trigger.data('parentAxis');
            var axisName = axis.name;
            var commonProperty = selectedJqPlotter.commonProperty;
            var allAxesX = selectedJqPlotter.allAxesX;
            var allAxesY = selectedJqPlotter.allAxesY;
            var allAxes;
            var gridAxis;
            var div = axis.div;

            if (axisName.substring(axisName.length - 1) == 'Y') {
                allAxes = allAxesY;
                logArray = commonProperty.logArrayY;
                gridAxis = selectedJqPlotter.gridLineAxes[1];
            }
            else {
                allAxes = allAxesX;
                logArray = commonProperty.logArrayX;
                gridAxis = selectedJqPlotter.gridLineAxes[0];
            }

            //set axis logarithmic
            if (!axis.logarithmic) {
                // axis status set logarithmic ,default logBase is 10
                axis.logarithmic = true;
                $(div).css('cursor', 'default');
                axis.mouseWheelZoomStep = 0;
                if (axis.isMerged) {
                    //changed merged axis log status and update logArray
                    updateMergedAxesStatus(axis, allAxes, logArray);
                }
                // update axis merged datamin/datamax for logarithmic
                updateAllWhenSetAxisLog(axis, allAxes, commonProperty, gridAxis);
            }
                //set axis  normal
            else {
                axis.logarithmic = false;
                $(div).css('cursor', 'pointer');
                axis.mouseWheelZoomStep = commonProperty.mouseWheelZoomStep;
                if (axis.isMerged) {
                    //changed merged axis log status and update logArray
                    updateMergedAxesStatus(axis, allAxes, logArray, commonProperty.mouseWheelZoomStep);
                }
                updateALLWhenSetAxisNonLog(axis, allAxes, commonProperty, gridAxis)
            }
            $("#" + selectedJqPlotter.elm.id + "_chartdiv").jqChart('update');
            updateGridAreaPosition(selectedJqPlotter.elm.id);
        },

    },

    //deal with inforBar menu click event
    inforBarHandler: {
        toggleVisiblity: function (key, options, selectedJqPlotter) {
            options.$trigger.find('.' + selectedJqPlotter.elm.id + '_inforBar_' + key)
           .toggleClass('jqPlotter-cell-hide');
            options.$selected.toggleClass('icon-checked');
        },
        copyString: function (key, options, selectedJqPlotter) {
            copyToClipboard(options.copyString, options.menuElement);
        }

    },

    //deal with plotArea menu click event
    plotAreaHandler: {
        saveToFile: function (key, options, selectedJqPlotter) {
            chartID = selectedJqPlotter.commonProperty.controlId;
            saveChartToFile($('#' + chartID));
        },
        printToPaper: function (key, options, selectedJqPlotter) {
            chartID = selectedJqPlotter.commonProperty.controlId;
            printChart($('#' + chartID));
        },
        exportData: function (key, options, selectedJqPlotter) {
            exportData(selectedJqPlotter);
        },
        viewInProcessExplorer: function (key, options, selectedJqPlotter) {
            viewInProcessExplorer(selectedJqPlotter);
        },
        toggleRulerOrientation: function (key, options, selectedJqPlotter, e) {
            selectedJqPlotter.rulerStatus.isVertical = !selectedJqPlotter.rulerStatus.isVertical; //toggle ruler orientation
            JqPlotter_Ruler.setPlotterLineProp(selectedJqPlotter.commonProperty, selectedJqPlotter.rulerStatus.isVertical);
            JqPlotter_Ruler.dealingWithToggle(selectedJqPlotter, e);
        },
        backgroundColor: function (key, options, selectedJqPlotter, e) {
            showColorPickerDialog(e, function (color) {
                var colorString = rgbToHex(color);
                JqPlotter_Main.setChartAreaBackground(colorString, selectedJqPlotter);
            });
        },
        gridOn: function (key, options, selectedJqPlotter) {
            var menuItem = options.$menu.find('#' + key);
            menuItem.toggleClass('icon-checked');
            var on = menuItem.hasClass('icon-checked');
            var xOn = null;
            var yOn = null;

            if (key == "gridOn") {
                xOn = on;
                yOn = on;
            } else if (key == "xGridOn") {
                xOn = on;
            } else if (key == "yGridOn") {
                yOn = on;
            }
            JqPlotter_AxesFactory.setGridLineVisible(xOn, yOn, selectedJqPlotter);
        },
        selectTimespan: function (key, options, selectedJqPlotter) {
            var timespan = -1;
            var timespan = parseInt(timespanArray[key]) * 1000;
            if (timespan >= 0)
                JqPlotter_AxesFactory.setTimespanManually(timespan, selectedJqPlotter);
            options.$selectTimespan.removeClass('icon-checked');
        },
        customTimespan: function (key, options, selectedJqPlotter, e) {
            var dialogContent = $('<div>' + '<label for="customTimespanInput">hours:minutes:seconds </label>' +
                '<input type="text" id="customTimespanInput" name="timespan"/>' + '</div>');
            $(document.body).append(dialogContent);
            var strTimespan = formatTimespan(selectedJqPlotter.commonProperty.initialTimespan);
            $('#customTimespanInput').val(strTimespan);

            dialogContent.dialog({
                title: 'Custom timespan',
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                position: { my: "center center", of: e, collision: "fit" },
                buttons: {
                    "Ok": function () {
                        var timespan = getTimespan($('#customTimespanInput').val());
                        if (timespan <= 0)
                            alert("Timespan must be larger than 0!");
                        else {
                            timespan = timespan * 1000;
                            JqPlotter_AxesFactory.setTimespanManually(timespan, selectedJqPlotter);
                            $(this).dialog("close");
                        }
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    dialogContent.remove();
                }
            });
        },
        dataPointCount: function (key, options, selectedJqPlotter, e) {
            var dialogContent = $('<div>' + '<label for="visibleDataPointCountInput">Visible datapoint count</label>' +
                '<input type="number" id="visibleDataPointCountInput" name="visibleDatapointCount"/>' + '</div>');
            $(document.body).append(dialogContent);
            $("#visibleDataPointCountInput").val(selectedJqPlotter.commonProperty.visibleDataPointCount);

            dialogContent.dialog({
                title: 'Data point count',
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                position: { my: "center center", of: e, collision: "fit" },
                buttons: {
                    "Ok": function () {
                        var count = parseInt($("#visibleDataPointCountInput").val());
                        if (count <= 0)
                            alert("Visible datapoint count must be larger than 0");
                        else {
                            JqPlotter_AxesFactory.setVisibleDataPointManually(count, selectedJqPlotter);
                            $(this).dialog("close");
                        }
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    dialogContent.remove();
                }
            });
        },
        noZoom: function (key, options, selectedJqPlotter) {
            var commonProperty = selectedJqPlotter.commonProperty;
            var ee = window.pageProperty.eventEmitter;
            var eventName = commonProperty.elementId + CONSTANT.STRING.eventResetZoom;
            ee.emitEvent(eventName, []);
        },
        saveConfiguration: function (key, options, selectedJqPlotter) {
            persistence = getConfigurationPersistance(selectedJqPlotter);
            persistState(selectedJqPlotter.elm.id, persistence);
        },
    },

    //deal with legend menu click event
    legendHandler: {
        toggleVisiblity: function (key, options, selectedJqPlotter) {
            var legendTable = $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable');
            legendTable.colResizable({
                disable: true,
            });

            options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_' + key)
                .toggleClass('jqPlotter-cell-hide');
            options.$selected.toggleClass('icon-checked');
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legend-draggable').find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_' + key)
                .toggleClass('jqPlotter-cell-hide');

            var ignoreCols = caculateEachRow(options, selectedJqPlotter);

            legendTable.colResizable({
                disabledColumns: ignoreCols,
                disable: false,
            });
            legendTable.resize();
        },
        copyString: function (key, options, selectedJqPlotter) {
            copyToClipboard(options.copyString, options.menuElement);
        },
        hideAll: function (key, options, selectedJqPlotter) {
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable').find('td').addClass('jqPlotter-cell-hide');
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legend-draggable').find('td').addClass('jqPlotter-cell-hide');
            options.$menu.find('.icon').removeClass('icon-checked');
        },
        showAll: function (key, options, selectedJqPlotter) {
            var legendTable = $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable');
            legendTable.colResizable({
                disable: true,
            });

            $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable').find('td').removeClass('jqPlotter-cell-hide');
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legend-draggable').find('td').removeClass('jqPlotter-cell-hide');
            options.$menu.find('.icon').addClass('icon-checked');

            var ignoreCols = caculateEachRow(options, selectedJqPlotter);

            legendTable.colResizable({
                disabledColumns: ignoreCols,
                disable: false,
            });
            legendTable.resize();
        },
        handleXItems: function (key, options, selectedJqPlotter) {
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable').find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_' + key).toggleClass('jqPlotter-cell-hide');
            $('#' + selectedJqPlotter.commonProperty.elementId + '_legend-draggable').find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_' + key).toggleClass('jqPlotter-cell-hide');
            selectedJqPlotter.commonProperty.showXItemInLegend = !selectedJqPlotter.commonProperty.showXItemInLegend;
        },

        changeCurvetype: changeCurveType,

        addStaticLines: editStaticLine,

        decimals: function (key, options, selectedJqPlotter, e) {
            var textDiv = options.menuElement;
            var valueCellData = textDiv.data('legendValueCell');
            if (!valueCellData)
                return;

            var dialogContent = $('<div>' + '<input id="decimalsCheckbox" type="checkbox" name="auto">' + '<label for="decimalsInput">Auto</label>' +
                '<input id="decimalsInput" type="number"/>' + '</div>');
            $(document.body).append(dialogContent);

            $("#decimalsCheckbox").attr("checked", true);
            $("#decimalsInput").val(1);
            $("#decimalsInput").attr("disabled", true);

            if (!valueCellData.isDecimalsDefault) {
                $("#decimalsCheckbox").attr("checked", false);
                $("#decimalsInput").val(valueCellData.decimals);
                $("#decimalsInput").attr("disabled", false);
            }

            $("#decimalsCheckbox").click(function () {
                if (this.checked) {
                    $("#decimalsInput").val(1);
                }
                $("#decimalsInput").attr("disabled", this.checked);
            });

            dialogContent.dialog({
                title: 'Number of decimals',
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                position: { my: "center center", of: e, collision: "fit" },
                buttons: {
                    "Ok": function () {
                        var decimals = parseInt($("#decimalsInput").val());
                        var isDecimalsDefault = $("#decimalsCheckbox").is(':checked');
                        if (decimals > 20 || decimals < 0) {
                            alert("Impossible to set decimals larger than 20 or less than 0");
                        } else {
                            valueCellData.decimals = decimals;
                            valueCellData.isDecimalsDefault = isDecimalsDefault;
                            textDiv.data('legendValueCell', valueCellData);
                            JqPlotter_Legend.setLegendDecimals(valueCellData, selectedJqPlotter);
                            $(this).dialog("close");
                        }
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    dialogContent.remove();
                }
            });
        },
    },

    embeddedLegendHandler: {
        changeCurvetype: changeCurveType,
        addStaticLines: editStaticLine,
    },
}

function editStaticLine(key, options, selectedJqPlotter, e) {
    var trs = options.menuElement.parents('tr');
    var rowData = trs.data('legendRowData');
    if (!rowData)
        return;
    var curveProperty = getCurvePropertyByCurveIndex(rowData.curveIndex, selectedJqPlotter.curveProperties);
    var staticLinesProperty;
    if (rowData.isXItem)
        staticLinesProperty = curveProperty.staticLinesX;
    else
        staticLinesProperty = curveProperty.staticLinesY;

    showAddStaticLinesDialog(staticLinesProperty, e, function (o) {
        //after update
        var axis = getAxisByCurveIndex(rowData.curveIndex, rowData.isXItem, selectedJqPlotter.chart.axes);
        JqPlotter_AxesFactory.setStaticLinesManually(axis, o);
        if (rowData.isXItem)
            curveProperty.staticLinesX = o;
        else
            curveProperty.staticLinesY = o;
        $("#" + selectedJqPlotter.commonProperty.elementId + "_chartdiv").jqChart('update');
    });
}

function changeCurveType(key, options, selectedJqPlotter, e) {
    var trs = options.menuElement.parents('tr');
    var rowData = trs.data('legendRowData');
    if (!rowData)
        return;

    var series;
    var hasPreviousSeries = true;
    var hasNextSeries = true;
    if (selectedJqPlotter.visibleSeries.length == 1) {
        series = selectedJqPlotter.visibleSeries[0];
        hasPreviousSeries = false;
        hasNextSeries = false;
    } else {
        for (var i = 0; i < selectedJqPlotter.visibleSeries.length; i++) {
            if (selectedJqPlotter.visibleSeries[i].curveIndex == rowData.curveIndex
                && selectedJqPlotter.visibleSeries[i].attributeIndex == rowData.attributeIndex) {
                series = selectedJqPlotter.visibleSeries[i];
                if (i == 0)
                    hasPreviousSeries = false;
                if (i == selectedJqPlotter.visibleSeries.length - 1)
                    hasNextSeries = false;
                break;
            }
        }
    }
    if (!series)
        return;

    var appearanceProperty = series.appearanceProperty;
    showChangeCurvetypeDialog(appearanceProperty, hasPreviousSeries, hasNextSeries, selectedJqPlotter.commonProperty.isXYPlot, e, function (op) {
        appearanceProperty.penSize = op.penSize;
        appearanceProperty.plotType = op.plotType
        appearanceProperty.color = op.color;
        appearanceProperty.markCurrentPoint = op.markCurrentPoint;
        appearanceProperty.symbolsOnlyOnChange = op.symbolsOnlyOnChange;
        appearanceProperty.curveType = op.curveType;

        JqPlotter_Legend.sendRowAppearanceEvent(rowData.curveIndex, rowData.attributeIndex, appearanceProperty, selectedJqPlotter.commonProperty.elementId);
        JqPlotter_SeriesFactory.setAppearanceToSeries(series, appearanceProperty);

        //var axis = getAxisByCurveIndex(rowData.curveIndex, rowData.isXItem, selectedJqPlotter.chart.axes);
        //JqPlotter_AxesFactory.setStaticLinesManually(axis, axis.staticLineProperties);

        // series.type is already updated by JqPlotter_Legend.sendRowAppearanceEvent
        if ((!!series.data) && series.type == 'range') {
            // add rangeTo data to each data item in the series
            series.data = recalculateRangeData(series, selectedJqPlotter);
        }

        $("#" + selectedJqPlotter.commonProperty.elementId + "_chartdiv").jqChart(selectedJqPlotter.chart);
    });
}

function caculateEachRow(options, selectedJqPlotter) {
    //calculate each cols
    var width = $('#' + selectedJqPlotter.commonProperty.elementId + '_legendTable').width();
    var ignoreCols = [];
    var visibleLength = options.$menu.find('.icon-checked').length;
    var deleteButtonTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_deleteButton');
    if (!deleteButtonTds.hasClass('jqPlotter-cell-hide')) {
        deleteButtonTds.width('16px');
        width -= 16;
        visibleLength -= 1;
        ignoreCols.push(0);
    }
    var curveTypeTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_curveType');
    if (!curveTypeTds.hasClass('jqPlotter-cell-hide')) {
        curveTypeTds.width('40px');
        width -= 40;
        visibleLength -= 1;
        if (deleteButtonTds.hasClass('jqPlotter-cell-hide'))
            ignoreCols.push(0);
        else
            ignoreCols.push(1);
    }

    var eachWidth = width / visibleLength;

    var itemNameTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_itemName');
    if (!itemNameTds.hasClass('jqPlotter-cell-hide'))
        itemNameTds.width(eachWidth);
    var valueTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_value');
    if (!valueTds.hasClass('jqPlotter-cell-hide'))
        valueTds.width(eachWidth);
    var qualityTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_quality');
    if (!qualityTds.hasClass('jqPlotter-cell-hide'))
        qualityTds.width(eachWidth);
    var unitTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_unit');
    if (!unitTds.hasClass('jqPlotter-cell-hide'))
        unitTds.width(eachWidth);
    var descriptionTds = options.$trigger.find('.' + selectedJqPlotter.commonProperty.elementId + '_legend_description');
    if (!descriptionTds.hasClass('jqPlotter-cell-hide'))
        descriptionTds.width(eachWidth);

    return ignoreCols;
}

function copyToClipboard(txt, menuElement) {
    if (typeof txt == 'undefined')
        return;

    var copyFrom = $('<textarea/>');
    copyFrom.text(txt);
    menuElement.append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}

function viewInProcessExplorer(jqPlotter) {
    var peURL = jqPlotter.props.ProcessExplorerURL || "http://localhost/PE";
    var defaultURL = peURL + "/Default.aspx?LoadURLWorkspace=;WSVersion;1;hdaSourceSpecified;false;";

    var oneVectorOnly = jqPlotter.commonProperty.oneVectorOnly;
    var isXYPlot = jqPlotter.commonProperty.isXYPlot;
    var unitEditable = getBoolean(jqPlotter.props.UnitEditable, false);

    var ws = "TVActive;" + ((oneVectorOnly || isXYPlot) ? "false" : "true");
    var numItems = jqPlotter.curveProperties.length;
    numItems = (oneVectorOnly || isXYPlot) ? numItems * 2 : numItems;
    ws += ";numItems;" + numItems;

    if (oneVectorOnly || isXYPlot) {
        var typeCodeY = oneVectorOnly ? "vectory" : "xyy";
        var typeCodeX = oneVectorOnly ? "vectorx" : "xyx";

        ws = jqPlotter.curveProperties.reduce(function (curveStrs, curve) {
            var database = jqPlotter.props["Database" + curve.itemTagY];

            // Y
            var secondaryEUY = unitEditable ? jqPlotter.props["Track0.Curve" + curve.itemIndexY + ".YItem_CurrentUnitID"] : "-1";
            var curveStrY = ";" + database + "." + curve.itemIdY + ";" + typeCodeY + ";" + secondaryEUY;

            // X
            var secondaryEUX = unitEditable ? jqPlotter.props["Track0.Curve" + curve.itemIndexX + ".XItem_CurrentUnitID"] : "-1";
            var curveStrX = ";" + database + "." + curve.itemIdX + ";" + typeCodeX + ";" + secondaryEUX;

            curveStrs += curveStrY;
            curveStrs += curveStrX;

            return curveStrs;
        }, ws);
    } else {
        ws = jqPlotter.curveProperties.reduce(function (curveStrs, curve) {
            var database = jqPlotter.props["Database" + curve.itemTagY];
            var secondaryEUY = unitEditable ? jqPlotter.props["Track0.Curve" + curve.curveIndex + ".YItem_CurrentUnitID"] : "-1";
            var curveStr = ";" + database + "." + curve.itemIdY + ";trend;" + secondaryEUY;

            // append attributes
            curveStr = curve.itemAttributesY.reduce(function (accu, attribute) {
                var attributeStr = ";" + database + "." + attribute.Name + ";trend;" + secondaryEUY;
                accu += attributeStr;

                return accu;
            }, curveStr)

            curveStrs += curveStr;
            return curveStrs;
        }, ws);
    }

    window.open(defaultURL + ws);
}

//get time format for menu
function getTimeFormats(timezoneName) {
    longDateWithLT = $.jqChartDateFormat.masks.longDateWithLT;
    longDateWithLTTZ = longDateWithLT + " '" + timezoneName + "'";
    return {
        time0: "longTime",
        time1: "shortTime",
        time2: "longTime",
        time3: "longTimeWithMs",
        time4: "shortDateWithST",
        time5: "longDate",
        time6: "longDateWithLT",
        time7: longDateWithLTTZ
    };
}

function createMenus(commonProperty) {
    $.contextMenu({
        selector: '.context-menu-axis-value',
        items: {
            "autoScaling": { name: "Auto Scaling", callback: contextmenuHandler.axisYHandler.autoScaling },
            "manualScaling": { name: "Manual Scaling", callback: contextmenuHandler.axisYHandler.manualScaling },
            "visibleRange": { name: "Visible Range", callback: contextmenuHandler.axisYHandler.visibleRange },
            "logarithmic": { name: "Logarithmic", icon: "checked", show_icon: false, callback: contextmenuHandler.axisYHandler.logarithmic },
            "inverse": { name: "Inverse", icon: "checked", show_icon: false, callback: contextmenuHandler.axisYHandler.inverse },
            "splitLine1": 'separator',
            "forkAxes": { name: "Fork Axes", callback: contextmenuHandler.axisYHandler.forkAxes },
            "mergeAxes": { name: "Merge Axes", callback: contextmenuHandler.axisYHandler.mergeAxes },
            "mergeAllAxes": { name: "Merge All Axes", callback: contextmenuHandler.axisYHandler.mergeAxes, },
            "moveAxis": { name: "Move Axis East", callback: contextmenuHandler.axisYHandler.moveAxis },
            "moveAllAxes": { name: "Move Axes East", callback: contextmenuHandler.axisYHandler.moveAllAxis, },
            "splitLine2": 'separator',
            "Decimals": { name: "Decimals", callback: contextmenuHandler.axisYHandler.decimals, },
        }
    });

    $.contextMenu({
        selector: '.context-menu-axisX',
        items: {
            time0: { name: "Auto Format", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time1: { name: "time1", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time2: { name: "time2", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time3: { name: "time3", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time4: { name: "time4", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time5: { name: "time5", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time6: { name: "time6", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            time7: { name: "time7", icon: "checked", callback: contextmenuHandler.axisXHandler.updateAxisX },
            fetchMoreData: { name: "Fetch More Data", callback: contextmenuHandler.axisXHandler.fetchMoreData },
            splitLine3: "separator",
            moveAxis: { name: "Move Axis North", callback: contextmenuHandler.axisXHandler.moveAxis },
        }
    });

    $.contextMenu({
        selector: '.context-menu-inforBar',
        items: {
            endTimestamp: { name: "End Timestamp", icon: "checked", show_icon: commonProperty.inforbarElements.endTimestamp, callback: contextmenuHandler.inforBarHandler.toggleVisiblity },
            timespan: { name: "Timespan", icon: "checked", show_icon: commonProperty.inforbarElements.timespan, callback: contextmenuHandler.inforBarHandler.toggleVisiblity },
            resolution: { name: "Resolution", icon: "checked", show_icon: commonProperty.inforbarElements.resolution, callback: contextmenuHandler.inforBarHandler.toggleVisiblity },
            timezone: { name: "Timezone", icon: "checked", show_icon: commonProperty.inforbarElements.timezone, callback: contextmenuHandler.inforBarHandler.toggleVisiblity },
            copy: { name: "Copy", callback: contextmenuHandler.inforBarHandler.copyString },
        }
    });

    $.contextMenu({
        selector: '.context-menu-legend',
        items: {
            copy: { name: "Copy", callback: contextmenuHandler.legendHandler.copyString },
            deleteButton: { name: "Button", icon: "checked", show_icon: commonProperty.legendElements.deleteButton, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            curveType: { name: "Curve type", icon: "checked", show_icon: commonProperty.legendElements.curveType, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            itemName: { name: "ItemID", icon: "checked", show_icon: commonProperty.legendElements.itemName, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            value: { name: "Value", icon: "checked", show_icon: commonProperty.legendElements.value, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            unit: { name: "Unit", icon: "checked", show_icon: commonProperty.legendElements.unit, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            quality: { name: "Quality", icon: "checked", show_icon: commonProperty.legendElements.quality, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            description: { name: "Description", icon: "checked", show_icon: commonProperty.legendElements.description, callback: contextmenuHandler.legendHandler.toggleVisiblity },
            hideAll: { name: "Hide All", callback: contextmenuHandler.legendHandler.hideAll },
            showAll: { name: "Show All", callback: contextmenuHandler.legendHandler.showAll },
            XItems: { name: "Hide X items", callback: contextmenuHandler.legendHandler.handleXItems },
            changeCurvetype: { name: "Change Curvetype", callback: contextmenuHandler.legendHandler.changeCurvetype },
            addStaticLines: { name: "Add static lines", callback: contextmenuHandler.legendHandler.addStaticLines },
            splitLine4: "separator",
            decimals: { name: "Decimals", callback: contextmenuHandler.legendHandler.decimals, },
        }
    });

    $.contextMenu({
        selector: '.context-menu-embedded-legend',
        items: {
            "changeCurvetype": { name: "Change Curvetype", callback: contextmenuHandler.embeddedLegendHandler.changeCurvetype },
            "addStaticLines": { name: "Add static lines", callback: contextmenuHandler.embeddedLegendHandler.addStaticLines },
        }
    });

    $.contextMenu({
        selector: '.context-menu-plotArea',
        items: {
            "noZoom": { name: "No zoom", callback: contextmenuHandler.plotAreaHandler.noZoom },
            "printToPaper": { name: "Print To Paper", callback: contextmenuHandler.plotAreaHandler.printToPaper },
            "saveToFile": { name: "Save To File", callback: contextmenuHandler.plotAreaHandler.saveToFile, },
            "timespan": {
                name: "Timespan",
                "items": {
                    'All': { "name": "All", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Min1": { "name": "1 Min", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Mins5": { "name": "5 Mins", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Mins10": { "name": "10 Mins", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Mins20": { "name": "20 Mins", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Mins30": { "name": "30 Mins", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Hour1": { "name": "1 Hour", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Hours2": { "name": "2 Hours", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Hours5": { "name": "5 Hours", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Hours12": { "name": "12 Hours", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Hours24": { "name": "24 Hours", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Days2": { "name": "2 Days", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Days4": { "name": "4 Days", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Week1": { "name": "1 Week", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Weeks2": { "name": "2 Weeks", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Month1": { "name": "1 Month", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Months2": { "name": "2 Months", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Months6": { "name": "6 Months", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Year1": { "name": "1 Year", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Years2": { "name": "2 Years", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Years5": { "name": "5 Years", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "Years10": { "name": "10 Years", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.selectTimespan },
                    "CustomTimespan": { "name": "Custom", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.customTimespan },
                    "DataPointCount": { "name": "Data Point Count", icon: "checked", show_icon: false, callback: contextmenuHandler.plotAreaHandler.dataPointCount },
                }
            },
            "grid": {
                name: "Grid",
                "items": {
                    //"floating": { "name": "floating" },
                    "gridOn": { "name": "Grid on", icon: "checked", show_icon: true, callback: contextmenuHandler.plotAreaHandler.gridOn },
                    "xGridOn": { "name": "XGrid on", icon: "checked", show_icon: true, callback: contextmenuHandler.plotAreaHandler.gridOn },
                    "yGridOn": { "name": "YGrid on", icon: "checked", show_icon: true, callback: contextmenuHandler.plotAreaHandler.gridOn },
                }
            },
            "toggleRulerOrientation": { name: "Toggle Ruler Orientation", callback: contextmenuHandler.plotAreaHandler.toggleRulerOrientation },
            "backgroundColor": { name: "Background Color", callback: contextmenuHandler.plotAreaHandler.backgroundColor },
            'splitLine5': "separator",
            "exportData": { name: "Export data", callback: contextmenuHandler.plotAreaHandler.exportData },
            "saveConfiguration": { name: "Save Configuration", callback: contextmenuHandler.plotAreaHandler.saveConfiguration },
            "viewInProcessExplorer": { name: "View In Process Explorer", callback: contextmenuHandler.plotAreaHandler.viewInProcessExplorer },
            "viewHelp": { name: "View Help", },
        }
    });
}

var timespanArray = {
    All: 0,
    Min1: 60,
    Mins5: 300,
    Mins10: 600,
    Mins20: 1200,
    Mins30: 1800,
    Hour1: 3600,
    Hours2: 7200,
    Hours5: 5 * 3600,
    Hours12: 12 * 3600,
    Hours24: 24 * 3600,
    Days2: 2 * 24 * 3600,
    Days4: 4 * 24 * 3600,
    Week1: 7 * 24 * 3600,
    Weeks2: 2 * 7 * 24 * 3600,
    Month1: 30 * 24 * 3600,
    Months2: 60 * 24 * 3600,
    Months6: 180 * 24 * 3600,
    Year1: 365 * 24 * 3600,
    Years2: 2 * 365 * 24 * 3600,
    Years5: 5 * 365 * 24 * 3600,
    Years10: 10 * 365 * 24 * 3600,
}


function showManualRangeDialog(axis, $selectedJqPlotter, e) {
    var maxInput = '<label for="maxInput" class="dialog-label">Max. value:</label>' + '<input id="maxInput" name="max" type="number" class="dialog-input"/>';
    var minInput = '<label for="minInput" class="dialog-label">Min. value:</label>' + '<input id="minInput" name="min" type="number" class="dialog-input"/>';

    if (!$selectedJqPlotter) {
        var id = axis.name.substring(0, axis.name.indexOf("_"));
        $selectedJqPlotter = $("#" + id + "_chartdiv");
    }

    var dialogContent = $('<div>' + maxInput + '<br/>' + minInput + '</div>');
    $(document.body).append(dialogContent);
    var that = this;
    $("#maxInput").val(axis.maximum);
    $("#minInput").val(axis.minimum);

    dialogContent.dialog({
        title: 'Manual scaling',
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        position: { my: "center center", of: e, collision: "fit" },
        buttons: {
            "Ok": function () {
                var minN = $("#minInput").val();
                var maxN = $("#maxInput").val();
                $(this).dialog("close");
                setAxisPro_RangeLoHi(axis, minN, maxN);
                setValueAxisMinMax(axis, minN, maxN);
                if (!axis.isAxisX)
                    updateAxisButton($(that), false);
                $selectedJqPlotter.jqChart('update');
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            dialogContent.remove();
        }
    });
}

function setAxisPro_RangeLoHi(axis, minNew, maxNew) {
    if (axis.isMerged) {
        axis.rangeLoMerged = minNew;
        axis.rangeHiMerged = maxNew;
    }
    else {
        axis.rangeLo = minNew;
        axis.rangeHi = maxNew;
    }
}