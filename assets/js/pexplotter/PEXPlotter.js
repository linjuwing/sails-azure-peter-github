// Object PEXPlotter 
//
// Description: A PEXPlotter object 
// is added to the document object of the HTML application.
//---------------------------------------------------------

function PEXPlotter(ControlID, SubscriptionElements) {
    this.elm = ControlID;

    this.subscriptionElements = SubscriptionElements;

    this.appletLoaded = false;
    this.applet = null;
    this.languageContent = '';

    this.valueArray = new Array(SubscriptionElements.length);
    for (var i = 0; i < this.valueArray.length; i++) {
        this.valueArray[i] = new Array();
    }
}

PEXPlotter.prototype.notifyAppletLoaded = function () {
    var applet = document.getElementById(this.elm.id + "_Applet");
    if (applet != null) {
        for (var i = 0; i < applet.childNodes.length; i++) {
            if (applet.childNodes[i].id == "Applet") {
                var actualApplet = applet.childNodes[i];

                this.applet = actualApplet;
                this.applet.setName(this.elm.id);
                this.updateValues(new Array(), true);
                this.appletLoaded = true;

                if (this.languageContent != null) {
                    this.updateLanguage(this.languageContent);
                    this.languageContent = null;
                }

                return true;
            }
        }
    }
    return false;
}

PEXPlotter.prototype.updateHistoryRaw = function (valueString) {
    this.applet.updateHistory(valueString);
}

PEXPlotter.prototype.updateLanguage = function (valueString) {
    if (valueString != null && valueString.length > 0) {
        if (this.applet != null && this.appletLoaded) {

            this.applet.updateLanguage(valueString);
        }
        else {
            this.languageContent = valueString;
        }
    }
}

PEXPlotter.prototype.daUpdate = function (items) {
    this.updateValues(items, false);
}

PEXPlotter.prototype.updateValues = function (items, appLoaded) {
    var commonTimeStamp = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var index = parseInt(item.index, 10);
        var parsedVal = item.value;

        if (item.property.toString().indexOf("__", 0) == -1) {
            parsedVal = this.parseValue(item.value, this.subscriptionElements[index]);
        }

        var valueArr = new Array(4);
        valueArr[0] = item.property; // Property that the applet uses as an ID of the item.
        valueArr[1] = parsedVal;
        valueArr[2] = item.quality;
        valueArr[3] = item.timestamp;
        commonTimeStamp = item.timestamp;

        this.valueArray[index].push(valueArr);
    }

    if ((this.appletLoaded || appLoaded) && this.applet != null) {

        this.applet.startUpdate();
        for (var i = 0; i < this.valueArray.length; i++) {
            var itemArray = this.valueArray[i];
            this.applet.updateItem(itemArray + ",");
            this.valueArray[i] = new Array();
        }
        this.applet.endUpdate(commonTimeStamp, "true");
    }
}

PEXPlotter.prototype.updateNoChange = function (computedUpdateTimeInterval) {
    if (this.applet != null && this.appletLoaded) {
        this.applet.startUpdate();
        this.applet.endUpdate(computedUpdateTimeInterval, "false");
    }
}

PEXPlotter.prototype.parseValue = function (value, subscriptionElement) {
    if (subscriptionElement) {
        var expression = subscriptionElement.valExp;
        if (expression) {
            var valArray = value.split(";");
            value = "";
            for (var k = 0; k < valArray.length; k++) {
                var val = parseFloat(valArray[k]);
                if (!isNaN(val)) {
                    eval(expression);
                    if (k == (valArray.length - 1))
                        value += val;
                    else
                        value += val + ";";
                }
            }
        }
    }
    return value;
}

PEXPlotter.prototype.changeEngUnit = function (itemID, newUnitID) {
    var selector = document.getElementById(this.elm.id + "_" + itemID);
    if (selector != null) {
        var i = 0;
        for (; i < selector.options.length; i++) {
            if (selector.options[i].value == parseInt(newUnitID)) {
                selector.selectedIndex = i;
                break;
            }
        }
        if (i < selector.options.length)
            __doPostBack(this.elm.id + "_" + itemID, '');
    }
}

PEXPlotter.prototype.persistState = function (persistence) {
    if (persistence != null) {
        var persistenceTextBox = document.getElementById(this.elm.id + "_Persistence");
        persistenceTextBox.value = persistence;
        __doPostBack(this.elm.id + "_Persistence", '');
    }
}

PEXPlotter.prototype.showExportData = function (data) {
    //alert("showExportData");
    data = data.replace(/\+/g, ' ');
    var d = window.open("", "Data");
    d.document.open("text/plain");
    d.document.write(unescape(data));
}

///////////////////////////////////////////////////////
/////////////////////JqPlotter////////////////////////
//////////////////////////////////////////////////////
//constructor
function JqPlotter(ControlID, SubscriptionElements) {
    JqPlotter_Main.initializeJqPlotter(ControlID, SubscriptionElements, this);
}

//update no change data
JqPlotter.prototype.updateNoChange = function (computedUpdateTimeInterval) {
}

//update real-time data
JqPlotter.prototype.daUpdate = function (allItems) {
    JqPlotter_Main.daUpdate(allItems, this);
}

//get historical data from HDA
JqPlotter.prototype.updateHistoryRaw = function (valueString) {
    JqPlotter_Main.updateHistoryRaw(valueString, this);
}