/**
 * Created by peter on 22/03/2017.
 */
// Object SubscriptionElement
//
// Description: A ClientAction object
// contains all information that is needed in a for an item
//---------------------------------------------------------

function ClientAction(pEventDispatcherName, pEventName, pActionName, pCssClass)
{
	this.EventDispatcherName = pEventDispatcherName;
	this.EventName = pEventName;
	this.ActionName = pActionName;
	this.CssClass = pCssClass;
}

// End Object ClientAction
//--------------------------------------

function PrediktorControls_Navigate(url, navigateType, height, width, resizable)
{
	if (url != null && url.length > 0)
	{
		if (navigateType != null)
		{
			if (navigateType == "redirect")
			{
				window.location = url;
			}
			else if (navigateType == "redirectparent")
			{
				if (parent != null)
				{
					parent.window.location = url;
				}
				else
				{
					window.location = url;
				}
			}
			else
			{
				var dialogFeatures = "'dialogHeight: " + (height != null ? height : 400)
					+ "px; dialogWidth: " + (width != null ? width : 500) + "px;"
					+ "resizable: " + (resizable ? "yes" : "no") + "'";

				var windowsFeatures = "'height=" + (height != null ? height : 400)
					+ ", width=" + (width != null ? width : 500)
					+ ", resizable=" + (resizable ? "1" : "0")
					+ "'";

				var dialogWindowFeatures = "'height=" + (height != null ? height : 400)
					+ ", width=" + (width != null ? width : 500)
					+ ", resizable=" + (resizable ? "1" : "0")
					+ ", toolbar=0, directories=0, status=0, menubar=0, scrollbars=0, ";

				var modalWindowFeatures = dialogWindowFeatures + "modal=yes'";
				var modelessWindowFeatures = dialogWindowFeatures + "modal=no'";

				if (navigateType == "newpage")
				{
					var newwindow = window.open(url ,'_blank', windowsFeatures);
					if (newwindow != null)
						newwindow.focus();
				}
				else if (navigateType == "dialog")
				{
					if (window.showModelessDialog)
					{
						var newwindow = window.showModelessDialog(url, '', dialogFeatures);
						if (newwindow != null)
							newwindow.focus();
					}
					else
					{
						var newwindow = window.open(url, '_blank', modelessWindowFeatures);
						if (newwindow != null)
							newwindow.focus();
					}
				}
				else if (navigateType == "modaldialog")
				{
					if (window.showModalDialog)
					{
						var newwindow = window.showModalDialog(url, '', dialogFeatures);
						if (newwindow != null)
							newwindow.focus();
					}
					else
					{
						var newwindow = window.open(url, '_blank', modalWindowFeatures);
						if (newwindow != null)
							newwindow.focus();
					}
				}
			}
		}
		else
		{
			window.open(url, '_self');
		}
	}
}

function WebForm_PostBackOptions(eventTarget, eventArgument, validation, validationGroup, actionUrl, trackFocus, clientSubmit) {
	this.eventTarget = eventTarget;
	this.eventArgument = eventArgument;
	this.validation = validation;
	this.validationGroup = validationGroup;
	this.actionUrl = actionUrl;
	this.trackFocus = trackFocus;
	this.clientSubmit = clientSubmit;
}
function WebForm_DoPostBackWithOptions(options) {
	var validationResult = true;
	if (options.validation) {
		if (typeof(Page_ClientValidate) == 'function') {
			validationResult = Page_ClientValidate(options.validationGroup);
		}
	}
	if (validationResult) {
		if ((typeof(options.actionUrl) != "undefined") && (options.actionUrl != null) && (options.actionUrl.length > 0)) {
			theForm.action = options.actionUrl;
		}
		if (options.trackFocus) {
			var lastFocus = theForm.elements["__LASTFOCUS"];
			if ((typeof(lastFocus) != "undefined") && (lastFocus != null)) {
				if (typeof(document.activeElement) == "undefined") {
					lastFocus.value = options.eventTarget;
				}
				else {
					var active = document.activeElement;
					if ((typeof(active) != "undefined") && (active != null)) {
						if ((typeof(active.id) != "undefined") && (active.id != null) && (active.id.length > 0)) {
							lastFocus.value = active.id;
						}
						else if (typeof(active.name) != "undefined") {
							lastFocus.value = active.name;
						}
					}
				}
			}
		}
	}
	if (options.clientSubmit) {
		__doPostBack(options.eventTarget, options.eventArgument);
	}
}
var __pendingCallbacks = new Array();
var __synchronousCallBackIndex = -1;
function WebForm_DoCallback(eventTarget, eventArgument, eventCallback, context, errorCallback, useAsync) {
	var postData = __theFormPostData +
		"__CALLBACKID=" + WebForm_EncodeCallback(eventTarget) +
		"&__CALLBACKPARAM=" + WebForm_EncodeCallback(eventArgument);
	if (theForm["__EVENTVALIDATION"]) {
		postData += "&__EVENTVALIDATION=" + WebForm_EncodeCallback(theForm["__EVENTVALIDATION"].value);
	}
	var xmlRequest,e;
	try {
		xmlRequest = new XMLHttpRequest();
	}
	catch(e) {
		try {
			xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e) {
		}
	}
	var setRequestHeaderMethodExists = true;
	try {
		setRequestHeaderMethodExists = (xmlRequest && xmlRequest.setRequestHeader);
	}
	catch(e) {}
	var callback = new Object();
	callback.eventCallback = eventCallback;
	callback.context = context;
	callback.errorCallback = errorCallback;
	callback.async = useAsync;
	var callbackIndex = WebForm_FillFirstAvailableSlot(__pendingCallbacks, callback);
	if (!useAsync) {
		if (__synchronousCallBackIndex != -1) {
			__pendingCallbacks[__synchronousCallBackIndex] = null;
		}
		__synchronousCallBackIndex = callbackIndex;
	}
	if (setRequestHeaderMethodExists) {
		xmlRequest.onreadystatechange = WebForm_CallbackComplete;
		callback.xmlRequest = xmlRequest;
		// e.g. http:
		var action = theForm.action || document.location.pathname, fragmentIndex = action.indexOf('#');
		if (fragmentIndex !== -1) {
			action = action.substr(0, fragmentIndex);
		}
		if (!__nonMSDOMBrowser) {
			var domain = "";
			var path = action;
			var query = "";
			var queryIndex = action.indexOf('?');
			if (queryIndex !== -1) {
				query = action.substr(queryIndex);
				path = action.substr(0, queryIndex);
			}
			if (path.indexOf("%") === -1) {
				// domain may or may not be present (e.g. action of "foo.aspx" vs "http:
				if (/^https?\:\/\/.*$/gi.test(path)) {
					var domainPartIndex = path.indexOf("\/\/") + 2;
					var slashAfterDomain = path.indexOf("/", domainPartIndex);
					if (slashAfterDomain === -1) {
						// entire url is the domain (e.g. "http:
						domain = path;
						path = "";
					}
					else {
						domain = path.substr(0, slashAfterDomain);
						path = path.substr(slashAfterDomain);
					}
				}
				action = domain + encodeURI(path) + query;
			}
		}
		xmlRequest.open("POST", action, true);
		xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		xmlRequest.send(postData);
		return;
	}
	callback.xmlRequest = new Object();
	var callbackFrameID = "__CALLBACKFRAME" + callbackIndex;
	var xmlRequestFrame = document.frames[callbackFrameID];
	if (!xmlRequestFrame) {
		xmlRequestFrame = document.createElement("IFRAME");
		xmlRequestFrame.width = "1";
		xmlRequestFrame.height = "1";
		xmlRequestFrame.frameBorder = "0";
		xmlRequestFrame.id = callbackFrameID;
		xmlRequestFrame.name = callbackFrameID;
		xmlRequestFrame.style.position = "absolute";
		xmlRequestFrame.style.top = "-100px"
		xmlRequestFrame.style.left = "-100px";
		try {
			if (callBackFrameUrl) {
				xmlRequestFrame.src = callBackFrameUrl;
			}
		}
		catch(e) {}
		document.body.appendChild(xmlRequestFrame);
	}
	var interval = window.setInterval(function() {
		xmlRequestFrame = document.frames[callbackFrameID];
		if (xmlRequestFrame && xmlRequestFrame.document) {
			window.clearInterval(interval);
			xmlRequestFrame.document.write("");
			xmlRequestFrame.document.close();
			xmlRequestFrame.document.write('<html><body><form method="post"><input type="hidden" name="__CALLBACKLOADSCRIPT" value="t"></form></body></html>');
			xmlRequestFrame.document.close();
			xmlRequestFrame.document.forms[0].action = theForm.action;
			var count = __theFormPostCollection.length;
			var element;
			for (var i = 0; i < count; i++) {
				element = __theFormPostCollection[i];
				if (element) {
					var fieldElement = xmlRequestFrame.document.createElement("INPUT");
					fieldElement.type = "hidden";
					fieldElement.name = element.name;
					fieldElement.value = element.value;
					xmlRequestFrame.document.forms[0].appendChild(fieldElement);
				}
			}
			var callbackIdFieldElement = xmlRequestFrame.document.createElement("INPUT");
			callbackIdFieldElement.type = "hidden";
			callbackIdFieldElement.name = "__CALLBACKID";
			callbackIdFieldElement.value = eventTarget;
			xmlRequestFrame.document.forms[0].appendChild(callbackIdFieldElement);
			var callbackParamFieldElement = xmlRequestFrame.document.createElement("INPUT");
			callbackParamFieldElement.type = "hidden";
			callbackParamFieldElement.name = "__CALLBACKPARAM";
			callbackParamFieldElement.value = eventArgument;
			xmlRequestFrame.document.forms[0].appendChild(callbackParamFieldElement);
			if (theForm["__EVENTVALIDATION"]) {
				var callbackValidationFieldElement = xmlRequestFrame.document.createElement("INPUT");
				callbackValidationFieldElement.type = "hidden";
				callbackValidationFieldElement.name = "__EVENTVALIDATION";
				callbackValidationFieldElement.value = theForm["__EVENTVALIDATION"].value;
				xmlRequestFrame.document.forms[0].appendChild(callbackValidationFieldElement);
			}
			var callbackIndexFieldElement = xmlRequestFrame.document.createElement("INPUT");
			callbackIndexFieldElement.type = "hidden";
			callbackIndexFieldElement.name = "__CALLBACKINDEX";
			callbackIndexFieldElement.value = callbackIndex;
			xmlRequestFrame.document.forms[0].appendChild(callbackIndexFieldElement);
			xmlRequestFrame.document.forms[0].submit();
		}
	}, 10);
}
function WebForm_CallbackComplete() {
	for (var i = 0; i < __pendingCallbacks.length; i++) {
		callbackObject = __pendingCallbacks[i];
		if (callbackObject && callbackObject.xmlRequest && (callbackObject.xmlRequest.readyState == 4)) {
			if (!__pendingCallbacks[i].async) {
				__synchronousCallBackIndex = -1;
			}
			__pendingCallbacks[i] = null;
			var callbackFrameID = "__CALLBACKFRAME" + i;
			var xmlRequestFrame = document.getElementById(callbackFrameID);
			if (xmlRequestFrame) {
				xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
			}
			WebForm_ExecuteCallback(callbackObject);
		}
	}
}
function WebForm_ExecuteCallback(callbackObject) {
	var response = callbackObject.xmlRequest.responseText;
	if (response.charAt(0) == "s") {
		if ((typeof(callbackObject.eventCallback) != "undefined") && (callbackObject.eventCallback != null)) {
			callbackObject.eventCallback(response.substring(1), callbackObject.context);
		}
	}
	else if (response.charAt(0) == "e") {
		if ((typeof(callbackObject.errorCallback) != "undefined") && (callbackObject.errorCallback != null)) {
			callbackObject.errorCallback(response.substring(1), callbackObject.context);
		}
	}
	else {
		var separatorIndex = response.indexOf("|");
		if (separatorIndex != -1) {
			var validationFieldLength = parseInt(response.substring(0, separatorIndex));
			if (!isNaN(validationFieldLength)) {
				var validationField = response.substring(separatorIndex + 1, separatorIndex + validationFieldLength + 1);
				if (validationField != "") {
					var validationFieldElement = theForm["__EVENTVALIDATION"];
					if (!validationFieldElement) {
						validationFieldElement = document.createElement("INPUT");
						validationFieldElement.type = "hidden";
						validationFieldElement.name = "__EVENTVALIDATION";
						theForm.appendChild(validationFieldElement);
					}
					validationFieldElement.value = validationField;
				}
				if ((typeof(callbackObject.eventCallback) != "undefined") && (callbackObject.eventCallback != null)) {
					callbackObject.eventCallback(response.substring(separatorIndex + validationFieldLength + 1), callbackObject.context);
				}
			}
		}
	}
}
function WebForm_FillFirstAvailableSlot(array, element) {
	var i;
	for (i = 0; i < array.length; i++) {
		if (!array[i]) break;
	}
	array[i] = element;
	return i;
}
var __nonMSDOMBrowser = (window.navigator.appName.toLowerCase().indexOf('explorer') == -1);
var __theFormPostData = "";
var __theFormPostCollection = new Array();
var __callbackTextTypes = /^(text|password|hidden|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i;
function WebForm_InitCallback() {
	var formElements = theForm.elements,
		count = formElements.length,
		element;
	for (var i = 0; i < count; i++) {
		element = formElements[i];
		var tagName = element.tagName.toLowerCase();
		if (tagName == "input") {
			var type = element.type;
			if ((__callbackTextTypes.test(type) || ((type == "checkbox" || type == "radio") && element.checked))
				&& (element.id != "__EVENTVALIDATION")) {
				WebForm_InitCallbackAddField(element.name, element.value);
			}
		}
		else if (tagName == "select") {
			var selectCount = element.options.length;
			for (var j = 0; j < selectCount; j++) {
				var selectChild = element.options[j];
				if (selectChild.selected == true) {
					WebForm_InitCallbackAddField(element.name, element.value);
				}
			}
		}
		else if (tagName == "textarea") {
			WebForm_InitCallbackAddField(element.name, element.value);
		}
	}
}
function WebForm_InitCallbackAddField(name, value) {
	var nameValue = new Object();
	nameValue.name = name;
	nameValue.value = value;
	__theFormPostCollection[__theFormPostCollection.length] = nameValue;
	__theFormPostData += WebForm_EncodeCallback(name) + "=" + WebForm_EncodeCallback(value) + "&";
}
function WebForm_EncodeCallback(parameter) {
	if (encodeURIComponent) {
		return encodeURIComponent(parameter);
	}
	else {
		return escape(parameter);
	}
}
var __disabledControlArray = new Array();
function WebForm_ReEnableControls() {
	if (typeof(__enabledControlArray) == 'undefined') {
		return false;
	}
	var disabledIndex = 0;
	for (var i = 0; i < __enabledControlArray.length; i++) {
		var c;
		if (__nonMSDOMBrowser) {
			c = document.getElementById(__enabledControlArray[i]);
		}
		else {
			c = document.all[__enabledControlArray[i]];
		}
		if ((typeof(c) != "undefined") && (c != null) && (c.disabled == true)) {
			c.disabled = false;
			__disabledControlArray[disabledIndex++] = c;
		}
	}
	setTimeout("WebForm_ReDisableControls()", 0);
	return true;
}
function WebForm_ReDisableControls() {
	for (var i = 0; i < __disabledControlArray.length; i++) {
		__disabledControlArray[i].disabled = true;
	}
}
function WebForm_SimulateClick(element, event) {
	var clickEvent;
	if (element) {
		if (element.click) {
			element.click();
		} else {
			clickEvent = document.createEvent("MouseEvents");
			clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			if (!element.dispatchEvent(clickEvent)) {
				return true;
			}
		}
		event.cancelBubble = true;
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		return false;
	}
	return true;
}
function WebForm_FireDefaultButton(event, target) {
	if (event.keyCode == 13) {
		var src = event.srcElement || event.target;
		if (src &&
			((src.tagName.toLowerCase() == "input") &&
			(src.type.toLowerCase() == "submit" || src.type.toLowerCase() == "button")) ||
			((src.tagName.toLowerCase() == "a") &&
			(src.href != null) && (src.href != "")) ||
			(src.tagName.toLowerCase() == "textarea")) {
			return true;
		}
		var defaultButton;
		if (__nonMSDOMBrowser) {
			defaultButton = document.getElementById(target);
		}
		else {
			defaultButton = document.all[target];
		}
		if (defaultButton) {
			return WebForm_SimulateClick(defaultButton, event);
		}
	}
	return true;
}
function WebForm_GetScrollX() {
	if (__nonMSDOMBrowser) {
		return window.pageXOffset;
	}
	else {
		if (document.documentElement && document.documentElement.scrollLeft) {
			return document.documentElement.scrollLeft;
		}
		else if (document.body) {
			return document.body.scrollLeft;
		}
	}
	return 0;
}
function WebForm_GetScrollY() {
	if (__nonMSDOMBrowser) {
		return window.pageYOffset;
	}
	else {
		if (document.documentElement && document.documentElement.scrollTop) {
			return document.documentElement.scrollTop;
		}
		else if (document.body) {
			return document.body.scrollTop;
		}
	}
	return 0;
}
function WebForm_SaveScrollPositionSubmit() {
	if (__nonMSDOMBrowser) {
		theForm.elements['__SCROLLPOSITIONY'].value = window.pageYOffset;
		theForm.elements['__SCROLLPOSITIONX'].value = window.pageXOffset;
	}
	else {
		theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
		theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
	}
	if ((typeof(this.oldSubmit) != "undefined") && (this.oldSubmit != null)) {
		return this.oldSubmit();
	}
	return true;
}
function WebForm_SaveScrollPositionOnSubmit() {
	theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
	theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
	if ((typeof(this.oldOnSubmit) != "undefined") && (this.oldOnSubmit != null)) {
		return this.oldOnSubmit();
	}
	return true;
}
function WebForm_RestoreScrollPosition() {
	if (__nonMSDOMBrowser) {
		window.scrollTo(theForm.elements['__SCROLLPOSITIONX'].value, theForm.elements['__SCROLLPOSITIONY'].value);
	}
	else {
		window.scrollTo(theForm.__SCROLLPOSITIONX.value, theForm.__SCROLLPOSITIONY.value);
	}
	if ((typeof(theForm.oldOnLoad) != "undefined") && (theForm.oldOnLoad != null)) {
		return theForm.oldOnLoad();
	}
	return true;
}
function WebForm_TextBoxKeyHandler(event) {
	if (event.keyCode == 13) {
		var target;
		if (__nonMSDOMBrowser) {
			target = event.target;
		}
		else {
			target = event.srcElement;
		}
		if ((typeof(target) != "undefined") && (target != null)) {
			if (typeof(target.onchange) != "undefined") {
				target.onchange();
				event.cancelBubble = true;
				if (event.stopPropagation) event.stopPropagation();
				return false;
			}
		}
	}
	return true;
}
function WebForm_TrimString(value) {
	return value.replace(/^\s+|\s+$/g, '')
}
function WebForm_AppendToClassName(element, className) {
	var currentClassName = ' ' + WebForm_TrimString(element.className) + ' ';
	className = WebForm_TrimString(className);
	var index = currentClassName.indexOf(' ' + className + ' ');
	if (index === -1) {
		element.className = (element.className === '') ? className : element.className + ' ' + className;
	}
}
function WebForm_RemoveClassName(element, className) {
	var currentClassName = ' ' + WebForm_TrimString(element.className) + ' ';
	className = WebForm_TrimString(className);
	var index = currentClassName.indexOf(' ' + className + ' ');
	if (index >= 0) {
		element.className = WebForm_TrimString(currentClassName.substring(0, index) + ' ' +
			currentClassName.substring(index + className.length + 1, currentClassName.length));
	}
}
function WebForm_GetElementById(elementId) {
	if (document.getElementById) {
		return document.getElementById(elementId);
	}
	else if (document.all) {
		return document.all[elementId];
	}
	else return null;
}
function WebForm_GetElementByTagName(element, tagName) {
	var elements = WebForm_GetElementsByTagName(element, tagName);
	if (elements && elements.length > 0) {
		return elements[0];
	}
	else return null;
}
function WebForm_GetElementsByTagName(element, tagName) {
	if (element && tagName) {
		if (element.getElementsByTagName) {
			return element.getElementsByTagName(tagName);
		}
		if (element.all && element.all.tags) {
			return element.all.tags(tagName);
		}
	}
	return null;
}
function WebForm_GetElementDir(element) {
	if (element) {
		if (element.dir) {
			return element.dir;
		}
		return WebForm_GetElementDir(element.parentNode);
	}
	return "ltr";
}
function WebForm_GetElementPosition(element) {
	var result = new Object();
	result.x = 0;
	result.y = 0;
	result.width = 0;
	result.height = 0;
	if (element.offsetParent) {
		result.x = element.offsetLeft;
		result.y = element.offsetTop;
		var parent = element.offsetParent;
		while (parent) {
			result.x += parent.offsetLeft;
			result.y += parent.offsetTop;
			var parentTagName = parent.tagName.toLowerCase();
			if (parentTagName != "table" &&
				parentTagName != "body" &&
				parentTagName != "html" &&
				parentTagName != "div" &&
				parent.clientTop &&
				parent.clientLeft) {
				result.x += parent.clientLeft;
				result.y += parent.clientTop;
			}
			parent = parent.offsetParent;
		}
	}
	else if (element.left && element.top) {
		result.x = element.left;
		result.y = element.top;
	}
	else {
		if (element.x) {
			result.x = element.x;
		}
		if (element.y) {
			result.y = element.y;
		}
	}
	if (element.offsetWidth && element.offsetHeight) {
		result.width = element.offsetWidth;
		result.height = element.offsetHeight;
	}
	else if (element.style && element.style.pixelWidth && element.style.pixelHeight) {
		result.width = element.style.pixelWidth;
		result.height = element.style.pixelHeight;
	}
	return result;
}
function WebForm_GetParentByTagName(element, tagName) {
	var parent = element.parentNode;
	var upperTagName = tagName.toUpperCase();
	while (parent && (parent.tagName.toUpperCase() != upperTagName)) {
		parent = parent.parentNode ? parent.parentNode : parent.parentElement;
	}
	return parent;
}
function WebForm_SetElementHeight(element, height) {
	if (element && element.style) {
		element.style.height = height + "px";
	}
}
function WebForm_SetElementWidth(element, width) {
	if (element && element.style) {
		element.style.width = width + "px";
	}
}
function WebForm_SetElementX(element, x) {
	if (element && element.style) {
		element.style.left = x + "px";
	}
}
function WebForm_SetElementY(element, y) {
	if (element && element.style) {
		element.style.top = y + "px";
	}
}

// Object Connector
//
// Description: An Connector object
// is added to the document object of the HTML application.
//---------------------------------------------------------

var DAItemSize = 7;
var OPC_QUALITY_GOOD = 192;

function DAConnector(connector, connectorName, updRate, updateTime, initialValueId)
{
	this.connector = connector;
	this.initialValueId = initialValueId;

	var connectedImageId = this.connector != null ? this.connector.getAttribute("ConnectedImageID") : null;
	this.connectedImage = connectedImageId != null ? document.getElementById(connectedImageId) : null;

	var disconnectedImageId = this.connector != null ? this.connector.getAttribute("DisconnectedImageID") : null;
	this.disconnectedImage = disconnectedImageId != null ? document.getElementById(disconnectedImageId) : null;

	this.name = connectorName;
	this.controlList = new Array();
	this.updateList = new Array();
	this.updateRate = parseInt(updRate, 10);
	this.accumulatedUpdateTimeInterval = 0;
	this.lastTimeUpdated = updateTime;
	this.connected = true;

	var messagePanelID = this.connector.getAttribute("MessagePanelID");
	if (messagePanelID != null) {
		this.messagePanel = document.getElementById(messagePanelID);
	}

	var diagnosticsModeAtt = this.connector.getAttribute("DiagnosticsMode");
	this.diagnosticsMode = (diagnosticsModeAtt != null && diagnosticsModeAtt == "True");
}

DAConnector.prototype.report = function(message) {
	if (this.messagePanel != null)
		this.messagePanel.innerHTML += message + "\n";
}

DAConnector.prototype.submit = function(controlIndex, parameters)
{
	var array = this.controlList[controlIndex].submit(parameters);
	if (array != null)
	{
		var strArray = new Array();
		for (var i = 0; i < array.length; i++)
		{
			strArray.push(array[i].value);
			strArray.push(array[i].property);
			strArray.push(array[i].attribute);
		}
		return strArray;
	}
	return null;
}

DAConnector.prototype.addControl = function (control)
{
	this.controlList.push(control);
	this.updateList.push(false);
	if (control != null && control.setToolTip != null && control.getCurrentToolTip != null)
	{
		control.setToolTip(control.getCurrentToolTip(this.connected));
	}
}

DAConnector.prototype.initializeControl = function(controlIndex, values)
{
	if (controlIndex >= 0 && controlIndex < this.controlList.length)
	{
		var control = this.controlList[controlIndex];
		if (control != null)
		{
			var itemCount = values.length / DAItemSize;
			var itemsColl = new Array(itemCount);
			for (var i = 0; i < itemCount; i++)
			{
				itemsColl[i] = new OpcDaItem(values[i * DAItemSize + 3],
					values[i * DAItemSize],
					values[i * DAItemSize + 4],
					values[i * DAItemSize + 1],
					values[i * DAItemSize + 2],
					values[i * DAItemSize + 6],
					values[i * DAItemSize + 5]);
			}
			control.daUpdate(itemsColl);
		}
	}
}

DAConnector.prototype.update = function(stringColl, application)
{
	if (stringColl != null)
	{
		var offset = 0;
		this.lastTimeUpdated = stringColl[offset++];
		while(offset < stringColl.length)
		{
			var controlLength = parseInt(stringColl[offset++], 10);
			var controlIndex = parseInt(stringColl[offset++], 10);
			var itemCount = parseInt((controlLength - 1) / DAItemSize);
			var itemsColl = new Array(itemCount);
			for (var i = 0; i < itemCount; i++)
			{
				itemsColl[i] = new OpcDaItem(stringColl[offset + i * DAItemSize + 3],
					stringColl[offset + i * DAItemSize],
					stringColl[offset + i * DAItemSize + 4],
					stringColl[offset + i * DAItemSize + 1],
					stringColl[offset + i * DAItemSize + 2],
					stringColl[offset + i * DAItemSize + 6],
					stringColl[offset + i * DAItemSize + 5]);
			}

			if (controlIndex < 0 || controlIndex >= this.controlList.Length)
				application.reportError("Unexpected controlIndex " + controlIndex + " in UpdateDAConnector() for connector " + this.name + ", with the following itemsColl: " + itemsColl.toString());
			else if (this.controlList[controlIndex] != null)
			{
				var control = this.controlList[controlIndex];
				control.daUpdate(itemsColl, application);

				// Need to refresh tool tip everytime the html elements have been touched
				if (control.setToolTip != null && control.getCurrentToolTip != null)
					control.setToolTip(control.getCurrentToolTip(this.connected));

				this.updateList[controlIndex] = true;
			}
			offset = offset + controlLength - 1;
		}
	}
}


DAConnector.prototype.setConnectionState = function (state)
{
	this.connected = state;
	if (this.connected)
	{
		if (this.disconnectedImage != null)
		{
			this.disconnectedImage.style.width = "0%";
			this.disconnectedImage.style.height = "0%";
		}
		if (this.connectedImage != null)
		{
			this.connectedImage.style.width = "100%";
			this.connectedImage.style.height = this.diagnosticsMode ? "50%" : "100%";
		}
	}
	else
	{
		if (this.disconnectedImage != null)
		{
			this.disconnectedImage.style.width = "100%";
			this.disconnectedImage.style.height = this.diagnosticsMode ? "50%" : "100%";
		}
		if (this.connectedImage != null)
		{
			this.connectedImage.style.width = "0%";
			this.connectedImage.style.height = "0%";
		}
	}
	for (var i = 0; i < this.controlList.length; i++)
	{
		var control = this.controlList[i];
		if (control != null)
		{
			if (control.setConnectionState != null)
				control.setConnectionState(state);

			if (control.setToolTip != null && control.getCurrentToolTip != null)
			{
				control.setToolTip(control.getCurrentToolTip(state));
			}
		}
	}
}

DAConnector.prototype.updateNoChange = function (computedUpdateTimeInterval)
{
	var bSomeWasUpdated = false;

	for (var i = 0; i < this.controlList.length; i++)
	{
		if (this.controlList[i] != null && this.updateList[i])
		{
			bSomeWasUpdated = true;
			break;
		}
	}

	this.accumulatedUpdateTimeInterval += computedUpdateTimeInterval;
	var bDoUpdateNoChange = (bSomeWasUpdated || (this.accumulatedUpdateTimeInterval > (this.updateRate - computedUpdateTimeInterval/2)));

	if (bDoUpdateNoChange)
		this.accumulatedUpdateTimeInterval = 0;

	for (var i = 0; i < this.controlList.length; i++)
	{
		if (this.controlList[i] != null)
		{
			if (this.updateList[i])
			{
				this.updateList[i] = false;
			}
			else if (bDoUpdateNoChange && this.controlList[i].updateNoChange != null)
			{
				this.controlList[i].updateNoChange(computedUpdateTimeInterval);
			}
		}
	}
}


// End Object Connector
//--------------------------------------

function OpcDaItem(_Property, _Value, _Attribute, _Quality, _Timestamp, _QualityCode, _Index)
{
	this.property = _Property;
	this.value = _Value;
	this.quality = _Quality;
	this.timestamp = _Timestamp;
	this.qualityCode = _QualityCode;
	if (_Attribute == null)
		this.attribute = "1";
	else
		this.attribute = _Attribute;
	this.index = _Index;
}

//result.Add(sValue); 0
//result.Add((QualityEncode == QualityEncodeDefinition.IntegerCode) ? quality.GetCode().ToString() : quality.ToString()); 1
//result.Add(SubscriptionElement.EncodeTime(timestamp, TimeEncode)); 2
//result.Add(Property); 3
//result.Add(Attribute.ToString()); 4
//result.Add(SubscriptionListIndex.ToString()); 5
//result.Add(quality.GetCode().ToString()); 6

// Object SubscriptionElement
//
// Description: An SubscriptionElement object
// contains all information that is needed in a for an item
//---------------------------------------------------------

function SubscriptionElement(iProperty, iNumdecimals, sValExpression, sFormat, subscriptionFailed, itemId, separator)
{
	this.property = iProperty;
	this.numdecimals = iNumdecimals;
	if (sValExpression != null && sValExpression != "")
		this.valExp = sValExpression;
	else
		this.valExp = null;
	this.format = (sFormat != null && sFormat != "") ? sFormat : null;
	this.subscriptionFailed = subscriptionFailed;
	this.itemId = itemId;
	this.separator = separator;
}

//function

// End Object SubscriptionElement
//--------------------------------------

// Object SubscriptionElement
//
// Description: An SubscriptionElement object
// contains all information that is needed in a for an item
//---------------------------------------------------------

function ClientEvent(pEventDispatcher, pEventName, pEventReceiverList)
{
	this.EventDispatcher = pEventDispatcher;
	this.EventName = pEventName;
	this.EventReceiverList = pEventReceiverList;
}

//function

// End Object SubscriptionElement
//--------------------------------------


var AEConnector_Index_EVENTTYPE = 0;
var AEConnector_Index_EVENTCATEGORY = 1;
var AEConnector_Index_MESSAGE = 2;
var AEConnector_Index_SEVERITY = 3;
var AEConnector_Index_TIME = 4;
var AEConnector_Index_SOURCE = 5;
var AEConnector_Index_ACTORID = 6;
var AEConnector_Index_CONDITIONNAME = 7;
var AEConnector_Index_SUBCONDITIONNAME = 8;
var AEConnector_Index_CHANGEMASK = 9;
var AEConnector_Index_NEWSTATE = 10;
var AEConnector_Index_QUALITY = 11;
var AEConnector_Index_ACKREQUIRED = 12;
var AEConnector_Index_ACTIVETIME = 13;
var AEConnector_Index_ACTIVETIMETICKS = 14;
var AEConnector_Index_COOKIE = 15;
var AEConnector_Index_HIGHCHANGETIME = 16;
var AEConnector_Index_LOWCHANGETIME = 17;
var AEConnector_MESSAGESIZE = 18;

var OPC_CONDITION_ENABLED = 1;
var OPC_CONDITION_ACTIVE = 2;
var OPC_CONDITION_ACKED = 4;

var OPC_CHANGE_ACTIVE_STATE = 1;
var OPC_CHANGE_ACK_STATE = 2;
var OPC_CHANGE_ENABLE_STATE = 4;
var OPC_CHANGE_QUALITY = 8;
var OPC_CHANGE_SEVERITY = 16;
var OPC_CHANGE_SUBCONDITION = 32;
var OPC_CHANGE_MESSAGE = 64;
var OPC_CHANGE_ATTRIBUTE = 128;

function getXmlHttp()
{
	var xmlhttp = false;
	try
	{
		xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
	}
	catch (e)
	{
		try
		{
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch (E)
		{
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		}
		catch (e)
		{
			xmlhttp=false;
		}
	}
	return xmlhttp;
}

function CreateDancerControlMap(application)
{
	if (application != null) {

		//var d = new Date();
		//application.dancerControlMap = new Object();
		TreeTraverseDancerApplication(application, document);
	}
}

function TreeTraverseDancerApplication(application, vNode) {
	var testChildren = true;
	if (vNode != null) {
		if (typeof (vNode.getAttribute) != 'undefined') {
			var att = vNode.getAttribute("dancercontrol");
			if (att != null) {
				application.insertDancerHtmlElement(vNode.getAttribute("id"), vNode);
				testChildren = false;
			}
		}

		if (testChildren && vNode.childNodes != null) {
			for (var i = 0; i < vNode.childNodes.length; i++) {
				TreeTraverseDancerApplication(application, vNode.childNodes[i]);
			}
		}
	}
}

function startDancer()
{
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		var version = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		if (version < 10) {
			document.body.insertAdjacentHTML('afterbegin', '<p>The browser version IE ' + version + ' is not supported. Use version 10 or higer.</p>');
			return;
		}
	}

	window.status = "Loading Page Connecting...";
	if (document == null || document.body == null)
	{
		window.setTimeout("startDancer()", 200);
	}
	else if (document.app == null)
	{
		document.app = new objApplication();
		CreateDancerControls(document.app);
		//window.setTimeout("startDancer()", 200);
	}

	if (!document.app.init())
	{
		window.setTimeout("startDancer()", 200);
	}
	else
	{
		//document.app = g_Application;
		//document.app.init();
		document.app.timer();
		if (!document.app.xmlhttp)
			document.forms[0].onsubmit = onRegularsubmit;


		if (typeof(window.onbeforeunload) != "undefined")
		{
//			if (window.onbeforeunload != stopDancer)
//			{
//				if (window.onbeforeunload != null)
//					this.stopOveriddenCmd = window.onbeforeunload;
//				window.onbeforeunload = stopDancer;
//			}
		}
		else if (window.onunload != stopDancer)
		{
			if (window.onunload != null)
				this.stopOveriddenCmd = window.onunload;
			window.onunload = stopDancer;
		}

		window.status = "";
	}
}

function mainDancerTimer()
{
	if (document != null && document.app != null)
		document.app.timer();
}


function dancerValidate(connectorID, controlIndex) {
	if (document.app != null)
	{
		return document.app.validate(connectorID, controlIndex);
	}
	return false;
}

function dancerSubmit(connectorID, controlIndex, parameters)
{
	if (document.app != null)
	{
		document.app.submit(connectorID, controlIndex, parameters);
	}
}

function regularSubmit()
{

	var eSource = (document != null && document.app != null) ? document.app.eventsource : null;
	if (eSource != null && eSource.fireEvent("onsubmit"))
	{
		eSource.submit();
		if (document != null && document.app != null)
			document.app.eventsource  = null;
	}
}

function onRegularsubmit()
{
	//wait for submit
	if (document.app != null)
	{
		window.clearTimeout(document.app.idUpdateTimer);
		document.app.oneStep(false);
		if (document.app.readInProgress || document.app.writeInProcess)
		{
			document.app.eventsource = window.event.srcElement;
			window.setTimeout("regularSubmit()", 50);
			return false;
		}
	}
	return true;
}

function stopDancer()
{

	var appObj = document.app;


	unloaded = true;
	if (document != null)
	{

		if (appObj)
		{
			//if (appObj.idUpdateTimer)
			window.clearTimeout(appObj.idUpdateTimer);
			//appObj.frmRead = null;
			//appObj.frmWrite = null;

			if (appObj.stopOveriddenCmd)
			{
				appObj.stopOveriddenCmd();
			}

			delete appObj;
			appObj = null;
		}
		document.app = null;
	}
	window.status = "Not connected";
}

function DancerApplicationRenderApplet(applet)
{
	document.write(applet);
}


//**************************************
// Object definitions
//**************************************


// Object Application
//
// Description: An Application object
// is added to the document object of the HTML application.
//---------------------------------------------------------

function objApplication()
{
	this.eventsource = null;
	//this.initialRead = true;
	this.intervalUpdateTimer = -1;
	this.pageSubscriptionSessionID = -1;
	this.readAndWriteXmlHttpPage = '';
	this.connectorList = new Array();
	this.readInProgress = false;
	this.writeInProgress = false;
	this.missedReads = 0;
	//this.totalMissedReads = 0;

	this.idUpdateTimer = 0;
	this.updateTime = null;

	this.frmWrite = null;
	this.frmRead = null;
	this.readFormAction = null;

	this.writeCache = new Array();

	this.isInitialized = false;
	this.stopOveriddenCmd = null;
	this.errorMessage = "";
	this.xmlhttp = false;
	this.dancerControlMap = new Object();
	this.controlList = new Object();
	this.callBackCount = 0;
}

objApplication.prototype.insertDancerHtmlElement = function(id, vObject) {
	this.dancerControlMap[id] = vObject;
}

objApplication.prototype.getDancerHtmlElement = function(id) {
	return this.dancerControlMap[id];
}

objApplication.prototype.submit = function(connectorID, controlIndex, parameters)
{
	var connector = this.findConnector(connectorID);
	if (connector != null)
	{
		if (controlIndex < 0 || controlIndex >= connector.controlList.length)
			this.reportError("Unexpected controlIndex " + controlIndex + " in SubmitApplication() for connector: " + connector.name);
		//else if ()
		//this.reportError("Null control at controlIndex " + controlIndex + " in SubmitApplication() for connector: " + connector.name);
		else if (connector.controlList[controlIndex] != null && connector.controlList[controlIndex].submit != null)
		{

			var control = connector.controlList[controlIndex];

			if (this.validate(connectorID, controlIndex))
			{
				var submitArray = connector.submit(controlIndex, parameters);
				//var submitArray = connector.controlList[controlIndex].submit(parameters);
				if (submitArray != null && submitArray.length > 0)
				{
					var connectorArray = new Array();
					connectorArray.push(connectorID);
					connectorArray.push(submitArray.length + 1);
					connectorArray.push(controlIndex);
					connectorArray = connectorArray.concat(submitArray);
					this.writeCache.push(connectorArray);
					window.clearTimeout(this.idUpdateTimer);
					this.timer();
					/*
					 document.app.oneStep(false);
					 if (document.app.readInProgress || document.app.writeInProcess)
					 */
				}
			}
		}
	}
}

objApplication.prototype.validate = function(connectorID, controlIndex)
{
	var connector = this.findConnector(connectorID);
	if (connector != null)
	{
		if (controlIndex < 0 || controlIndex >= connector.controlList.length)
			this.reportError("Unexpected controlIndex " + controlIndex + " in SubmitApplication() for connector: " + connector.name);
		else if (connector.controlList[controlIndex] != null && connector.controlList[controlIndex].submit != null)
		{
			var control = connector.controlList[controlIndex];
			// Test validators
			// Find validator(s) which is connected to this control
			// The control must have an id field
			var submitValidation = ((typeof (control.validate) == 'undefined') || (typeof (control.validate) != 'undefined') && control.validate());

			for (var i = 0; window.Page_Validators != null && submitValidation && i < window.Page_Validators.length; i++)
			{
				if (control.id != null && window.Page_Validators[i].controltovalidate == control.id)
				{
					ValidatorValidate(window.Page_Validators[i]);
					submitValidation = window.Page_Validators[i].isvalid;
				}
			}
			return submitValidation;
		}
	}
	return false;
}

objApplication.prototype.findConnector = function(connectorName)
{
	var i;
	for (i = 0; i < this.connectorList.length; i++)
	{
		if (this.connectorList[i].name == connectorName)
		{
			return this.connectorList[i];
		}
	}
	return null;
}

objApplication.prototype.addControl = function(controlId, control)
{
	this.controlList[controlId] = control;
	var htmlElement = this.getDancerHtmlElement(controlId);
	if (htmlElement != null && control != null)
	{
		var clientActionsAttribute = htmlElement.getAttribute("clientActions");
		if (clientActionsAttribute != null)
		{
			control.clientActions = eval(clientActionsAttribute);
		}
		var clientEventsAttribute = htmlElement.getAttribute("clientEvents");
		if (clientEventsAttribute != null)
		{
			control.clientEvents = eval(clientEventsAttribute);
		}
		if (control.initializationDone != null)
		{
			control.initializationDone();
		}
	}
}

objApplication.prototype.addConnector = function(connectorName, connector)
{
	this.connectorList.push(connector);
	if ((connector.updateRate != null) && ((connector.updateRate < this.intervalUpdateTimer) || (this.intervalUpdateTimer < 0)))
	{
		this.intervalUpdateTimer = connector.updateRate;
	}
}

objApplication.prototype.attachControl = function(connectorName, controlId)
{
	var connector = this.findConnector(connectorName);
	var control = this.controlList[controlId];
	if (connector != null)
		connector.addControl(control);
}

objApplication.prototype.report = function(message) {
	for (var k = 0; k < this.connectorList.length; k++) {
		if (this.connectorList[k].report != 'undefined') {
			this.connectorList[k].report(message);
		}
	}
}

objApplication.prototype.initializeConnectors = function()
{
	for (var k = 0; k < this.connectorList.length; k++)
	{
		if (this.connectorList[k].initialValueId != null && this.connectorList[k].initializeControl != 'undefined')
		{
			var initialValueElement = document.getElementById(this.connectorList[k].initialValueId);
			if (initialValueElement != null)
			{
				var valueArray = initialValueElement.value.split("\t");
				var offset = 0;
				while (offset < valueArray.length)
				{
					var controlLength = valueArray[offset++];
					var controlIndex = valueArray[offset++];
					var denormalize = (valueArray[offset++] == "True");
					if (controlIndex >= 0 && controlIndex < this.connectorList[k].controlList.length)
					{
						var controlValueCollection = new Array();
						for (var i = 1; i < controlLength; i++)
						{
							controlValueCollection.push(denormalize ? DenormalizeDancerApplication(valueArray[offset++]) : valueArray[offset++]);
						}
						this.connectorList[k].initializeControl(controlIndex, controlValueCollection);
					}
				}
			}
		}
	}
}


objApplication.prototype.dispatchEvent = function(eventDispatcherId, eventName, args)
{
	var dispatcherControl = this.controlList[eventDispatcherId];
	if (dispatcherControl != null && dispatcherControl.clientEvents != null && dispatcherControl.clientEvents.length > 0)
	{
		for (var k = 0; k < dispatcherControl.clientEvents.length; k++)
		{
			if (dispatcherControl.clientEvents[k].EventName == eventName && dispatcherControl.clientEvents[k].EventReceiverList != null && dispatcherControl.clientEvents[k].EventReceiverList.length > 0)
			{
				for (var j = 0; j < dispatcherControl.clientEvents[k].EventReceiverList.length; j++)
				{
					var control = this.controlList[dispatcherControl.clientEvents[k].EventReceiverList[j]];
					if (control != null && control.clientActions != null && control.clientActions.length > 0)
					{
						for (var i = 0; i < control.clientActions.length; i++)
						{
							if (control.clientActions[i].EventDispatcherName == eventDispatcherId && control.clientActions[i].EventName == eventName)
							{
								eval("control." + control.clientActions[i].ActionName + "Action('" + eventDispatcherId + "', '" + eventName + "', '" + control.clientActions[i].CssClass + "'," + args + ");");
							}
						}
					}
				}
			}
		}
	}
}

objApplication.prototype.findControl = function (connector, controlindex)
{
	var connector = this.findConnector(connector);
	if (connector != null && connector.controlList != null && connector.controlList.length > controlindex)
	{
		return connector.controlList[controlindex];
	}
	return null;
}

objApplication.prototype.invokeControlMethod = function (connector, controlindex, method, args)
{
	var control = this.findControl(connector, controlindex);
	if (control != null && method != null)
	{
		try
		{
			return eval("control." + method + "(" + (args != null ? args : "") + ");");
		}
		catch (e)
		{
			// Report error.
		}
		return false;
	}
	return false;
}


objApplication.prototype.init = function()
{
	if (!this.xmlhttp)
	{
		this.frmRead = document.getElementsByName("ReadFrame")[0];
		this.frmWrite = document.getElementsByName("WriteFrame")[0];
		if (this.frmRead != null && this.frmRead.contentWindow != null
			&& this.frmRead.contentWindow.document != null
			&& this.frmRead.contentWindow.document.forms != null
			&& this.frmRead.contentWindow.document.forms[0] != null)
		{
			this.isInitialized = true;
			return true;
		}
		return false;
	}
	else
	{
		this.isInitialized = true;
		return true;
	}
}

objApplication.prototype.oneStep = function (newRead)
{
	this.errorMessage = "";
	try
	{
		if (!this.xmlhttp)
		{
			if (this.readInProgress)
			{
				this.readDone();
			}
			else if (this.writeInProgress)
			{
				this.writeDone();
			}

			if (!this.readInProgress && !this.writeInProgress && newRead)
			{
				if (this.writeCache.length > 0)
				{
					this.write();
				}
				else
				{
					this.read();
				}
			}
		}
		else
		{
			this.readAndWriteXmlHttp();
		}
		//window.status = "Missed reads: " + this.missedReads + " , Total MissedReads: " + this.totalMissedReads;
	}
	catch (e)
	{
		this.reportError("Exception caught: " +
			((e != null && e.name != null && e.message != null)
				? ("Name: " + e.name + " Message: " + e.message) : e));
	}
	if (this.errorMessage != "")
		window.status = this.errorMessage;
}

function InitialTimerApplication()
{
	this.oneStep(true);
}

objApplication.prototype.timer = function ()
{
	this.oneStep(true);
	if (this.intervalUpdateTimer > 0)
	{
		/*if (this.initialRead)
		 {
		 this.idUpdateTimer = window.setTimeout("document.app.timer()", 100); // Fast initial update.
		 }
		 else */if (this.writeCache.length > 0)
	{
		this.idUpdateTimer = window.setTimeout("mainDancerTimer()", 100); // Fast write update.
	}
	else
	{
		this.idUpdateTimer = window.setTimeout("mainDancerTimer()", this.intervalUpdateTimer); // Normal read update
	}
	}
}

objApplication.prototype.readAndWriteXmlHttp = function() {
	//
	if (!this.readInProgress || this.missedReads > 100) {
		this.missedReads = 0;
		this.readInProgress = true;
		var url = this.readAndWriteXmlHttpPage; // + "?PageSubscriptionSessionID=" + this.pageSubscriptionSessionID;
		this.xmlhttp.open("POST", url, true);

		this.xmlhttp.onreadystatechange = function() {
			var dancerApplication = document.app;
			if (dancerApplication != null && dancerApplication.isInitialized && dancerApplication.xmlhttp != null && dancerApplication.xmlhttp.readyState == 4) {
				if (dancerApplication.xmlhttp.responseXML != null && dancerApplication.xmlhttp.responseXML.documentElement != null) {
					dancerApplication.callBackCount++;

					if (typeof(dancerApplication.xmlhttp.responseXML.normalize) != 'undefined') {
						dancerApplication.xmlhttp.responseXML.normalize();
					}

					var response = dancerApplication.xmlhttp.responseXML.documentElement;
					var connDataNormalized = response.getElementsByTagName('ConnectorDataNormalized');
					var connData = response.getElementsByTagName('ConnectorData');
					var errorData = response.getElementsByTagName('DancerError');
					if (connData != null) {
						var normalized = true;
						if (connDataNormalized.length > 0 && connDataNormalized[0].firstChild != null && connDataNormalized[0].firstChild.data != null) {
							normalized = (connDataNormalized[0].firstChild.data == "true");
						}

						if (connData.length > 0 && connData[0].firstChild != null && connData[0].firstChild.data != null) {
							dancerApplication.updateConnectors(normalized ? DenormalizeDancerApplication(connData[0].firstChild.data) : connData[0].firstChild.data);
						}
						else if (errorData != null && errorData.length > 0) {
							window.status = "[ERROR] " + DenormalizeDancerApplication(errorData[0].firstChild.data);
							location.reload(true);
						}
						dancerApplication.updateConnectorsNoChange();
					}
					else {
						window.status = "[ERROR] Received no Dancer-data in responseXML from Web-server";
					}
				}
				else {
					window.status = "[ERROR] Received no Dancer-data from Web-server";
				}
				//dancerApplication.xmlhttp = getXmlHttp();
				dancerApplication.readInProgress = false;

			}
		}

		var writeValues = "<DancerData>";
		writeValues += "<PageSubscriptionId>";
		writeValues += this.pageSubscriptionSessionID;
		writeValues += "</PageSubscriptionId>";
		writeValues += "<LastUpdateTimes>";
		writeValues += this.getLastTimesUpdated();
		writeValues += "</LastUpdateTimes>";
		writeValues += "<LastConnectionStateIds>";
		writeValues += this.getConnectionStateIds();
		writeValues += "</LastConnectionStateIds>";

		writeValues += "<Values>"
		writeValues += encodeClientStringDancerApplication(this.getSubmitString(true));
		writeValues += "</Values>";

		writeValues += "</DancerData>";
		this.xmlhttp.send(writeValues)
	}
	else {
		this.missedReads++;
		//this.totalMissedReads++
	}
}

objApplication.prototype.updateConnectors = function (valueString)
{
	var stringColl = valueString.split("\t");
	if (stringColl.length > 0)
	{
		var connectorCount = stringColl[0];
		var c = 0;
		var offset = 1;
		for (c = 0; c < connectorCount; c++)
		{
			var connectorID = stringColl[offset++];
			var connectionStateChanged = (stringColl[offset++] == "true");
			var connected = (stringColl[offset++] == "true");
			var connectionStateId = stringColl[offset++];
			var connectorLength = parseInt(stringColl[offset++], 10);

			var connector = this.findConnector(connectorID);
			if (connector == null)
			{
				//alert('connector: ' + stringColl[connectorIndex] + ' could not be found');
				break;
			}

			if (connectionStateChanged && connector.setConnectionState != null)
			{
				connector.setConnectionState(connected);
			}
			connector.connectionStateId = connectionStateId;

			//var controlColl = stringColl.slice(offset, offset + connectorLength);

			var controlColl = new Array(connectorLength);
			for (var i = 0; i < connectorLength; i++)
			{
				controlColl[i] = stringColl[offset + i];
			}

			connector.update(controlColl, this);
			offset = offset + connectorLength;
		}
	}
}

objApplication.prototype.updateConnectorsNoChange = function ()
{
	var newUpdateTime = (new Date()).getTime();
	var computedUpdateTimeInterval;
	if (this.updateTime == null)
		computedUpdateTimeInterval = 0;
	else
		computedUpdateTimeInterval = newUpdateTime - this.updateTime;

	this.updateTime = newUpdateTime;

	// update no change notifications
	for(i = 0; i < this.connectorList.length; i++)
	{
		this.connectorList[i].updateNoChange(computedUpdateTimeInterval);
	}
}

objApplication.prototype.readDone = function ()
{

	if (this.frmRead != null && this.frmRead.contentWindow != null
		&& this.frmRead.contentWindow.document != null
		&& this.frmRead.contentWindow.document.forms != null
		&& this.frmRead.contentWindow.document.forms[0] != null)
	{

		var myForm = this.frmRead.contentWindow.document.forms[0];
		if ((myForm != null) && (myForm.childNodes != null) && (myForm.childNodes.length > 1))
		{
			this.readInProgress = false;
			this.missedReads = 0;
			//this.initialRead = false;
			var i;
			for (i = 0; i < myForm.childNodes.length; i++)
			{
				if ((myForm.childNodes[i] != null) && (myForm.childNodes[i].id != null))
				{
					if (myForm.childNodes[i].id == "Values")
					{
						this.updateConnectors(myForm.childNodes[i].value);
					}
				}
			}

			this.updateConnectorsNoChange();
		}
		else
		{
			this.missedReads++;
			//this.totalMissedReads++
		}
	}
}


objApplication.prototype.read = function ()
{
	if ((!this.readInProgress) && (this.connectorList.length > 0) && this.frmRead != null)
	{
		var myForm = this.frmRead.contentWindow.document.forms[0];
		if ((myForm != null) && (myForm.childNodes != null))
		{
			this.readInProgress = true;

			var elmUpdateTime = null;
			var elmConnectionStateIds = null;

			// Removes everything from form. When there is something in the form, the read has finished.
			while(myForm.childNodes.length > 0)
			{
				if (myForm.childNodes[0].id == "UpdateTimes")
					elmUpdateTime = myForm.childNodes[0];
				else if (myForm.childNodes[0].id == "ConnectionStateIds")
					elmConnectionStateIds = myForm.childNodes[0];
				myForm.removeChild(myForm.childNodes[0]);
			}

			if (this.readFormAction == null)
				this.readFormAction = myForm.action;

			myForm.action = this.readFormAction;

			if (elmUpdateTime != null)
			{
				elmUpdateTime.value = this.getLastTimesUpdated();
				myForm.appendChild(elmUpdateTime);
			}

			if (elmConnectionStateIds != null)
			{
				elmConnectionStateIds.value = this.getConnectionStateIds();
				myForm.appendChild(elmConnectionStateIds);
			}

			myForm.submit();
		}
	}
}

objApplication.prototype.writeDone = function ()
{
	if (this.frmWrite != null && this.frmWrite.contentWindow != null
		&& this.frmWrite.contentWindow.document != null
		&& this.frmWrite.contentWindow.document.forms != null
		&& this.frmWrite.contentWindow.document.forms[0] != null)
	{

		var myForm = this.frmWrite.contentWindow.document.forms[0];
		if ((myForm != null) && (myForm.childNodes != null) && (myForm.childNodes.length > 0))
		{
			for (var i = 0; i < myForm.childNodes.length; i++)
			{

				if (myForm.childNodes[i].id == "Result")
				{
					if (myForm.childNodes[i].value == "True")
					{
						this.writeInProgress = false;
						myForm.childNodes[i].value = false;
					}
					break;
				}
			}
		}
	}
}

objApplication.prototype.write = function ()
{
	// read queue.
	if ((this.writeCache.length > 0) && (this.frmWrite != null))
	{
		var myForm = this.frmWrite.contentWindow.document.forms[0];
		if ((myForm != null) && (myForm.childNodes != null))
		{
			for (var k = 0; k < myForm.childNodes.length; k++)
			{
				if (myForm.childNodes[k].name == "Values")
				{
					myForm.childNodes[k].value = this.getSubmitString(true);
					myForm.submit();
					this.writeInProgress = true;
					break;
				}
			}
		}
	}
}

objApplication.prototype.getSubmitString = function (reset)
{
	var submitstring = "";
	if (this.writeCache.length > 0)
	{
		submitstring += this.writeCache.length;
		for(var i = 0; i < this.writeCache.length; i++)
		{
			var submitArray = this.writeCache[i];
			if (submitArray.length > 0)
			{
				submitstring += "\t" + submitArray.length;
				for (var j = 0; j < submitArray.length; j++)
				{
					submitstring = submitstring + "\t" + submitArray[j];
				}
			}
		}
		if (reset)
			this.writeCache = new Array();
	}
	return submitstring;
}

objApplication.prototype.getLastTimesUpdated = function ()
{
	var lastTimes = "";
	for (var i = 0; i < this.connectorList.length; i++)
	{
		var lt = this.connectorList[i].lastTimeUpdated;
		if (lt != null)
		{
			if (lastTimes.length > 0)
				lastTimes += "\t";
			lastTimes += this.connectorList[i].name + "\t" + lt;
		}
	}
	return lastTimes;
}

objApplication.prototype.getConnectionStateIds = function ()
{
	var connectionStateIds = "";
	for (var i = 0; i < this.connectorList.length; i++)
	{
		var lt = this.connectorList[i].connectionStateId;
		if (lt != null)
		{
			if (connectionStateIds.length > 0)
				connectionStateIds += "\t";
			connectionStateIds += this.connectorList[i].name + "\t" + lt;
		}
	}
	return connectionStateIds;
}

objApplication.prototype.reportError = function (message)
{
	this.errorMessage = message;
}





function OnStopErrorApplication(strMessage)
{
	window.alert(strMessage);
}

function OnWriteErrorApplication(strMessage)
{
	window.alert(strMessage);
}


// End Object Application
//--------------------------------------


function GetInitialValues(parentElement, clientid) {
	var initValElement = null;
	for (var i = 0; i < parentElement.childNodes.length; i++)
	{
		if (parentElement.childNodes[i].getAttribute("id") == clientid)
			initValElement = parentElement.childNodes[i];
	}

	//var initValElement = document.getElementById(clientid);
	if (initValElement != null && initValElement.value != null && initValElement.value.length > 0)
	{
		return initValElement.value.split("\t");
	}
	return new Array();
}

// Util functions.
function CreateDecodedArray(strMessage)
{
	var v = decodeServerStringDancerApplication(strMessage);
	return (v != null && v.length > 0) ? v.split("\t") : new Array();
}

function setEnabledDancerApplication(htmlElement, enable)
{
	if (htmlElement != null && htmlElement.disabled != null)
	{
		htmlElement.disabled = !enable;
		for (var i = 0; i < htmlElement.children.length; i++)
		{
			setEnabledDancerApplication(htmlElement.children[i], enable);
		}
	}
}

function DenormalizeDancerApplication(str)
{
	if (str != null && str.length > 0)
	{
		var lt = new RegExp("&lt;", "g");
		var gt = new RegExp("&gt;", "g");
		var amp = new RegExp("&amp;", "g");
		var quot = new RegExp("&quot;", "g");
		var apos = new RegExp("&apos;", "g");

		return str.replace(lt, "<").replace(gt,">").replace(amp, "&").replace(quot, "\"").replace(apos, "'");
	}
	return str;
}

function decodeServerStringDancerApplication(strMessage)
{
	return decodeURIComponent(strMessage.replace(/\+/g," "));
}

function encodeClientStringDancerApplication(strMessage)
{
	return encodeURIComponent(strMessage);
}


function fmtDecimals(val, decCount)
{
	if (decCount > 0 && !isNaN(val))
	{
		return val.toFixed(decCount);
	}
	return val;
}

// HDA Link stuff.

function Prediktor_Dancer_DA_HDALinkConnector(connectorId, controls)
{
	this.connectorId = connectorId;
	this.controls = controls;
}

function Prediktor_Dancer_DA_HDALinkControl(controlIndex, items)
{
	this.controlIndex = controlIndex;
	this.items = items;
}

function Prediktor_Dancer_DA_HDALinkItem(name, startTime, endTime, resampleInterval)
{
	this.name = name;
	this.startTime = startTime;
	this.endTime = endTime;
	this.resampleInterval = resampleInterval;
}


function Prediktor_Dancer_DA_HDALink(HDACallBackObject)
{
	this.xmlhttp = this.getXmlHttp();
	this.hdaCallBackObject = HDACallBackObject;
	this.queryId = 0;
}

Prediktor_Dancer_DA_HDALink.prototype.getXmlHttp = function ()
{
	var xmlhttp = null;
	if (typeof XMLHttpRequest=='undefined')
	{
		try
		{
			xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch (e)
		{
			try
			{
				xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			}
			catch (E)
			{
				xmlhttp = null;
			}
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		}
		catch (e)
		{
			xmlhttp = null;
		}
	}
	return xmlhttp;
}


Prediktor_Dancer_DA_HDALink.prototype.callback = function()
{
	if (this.xmlhttp.readyState==4)
	{
		if (this.xmlhttp.responseXML != null && this.xmlhttp.responseXML.documentElement != null)
		{
			if (document.app != null)
			{
				var response = this.xmlhttp.responseXML.documentElement;
				var hdaDancerData = this.xmlhttp.responseXML.getElementsByTagName('HDADancerData');
				for (var i = 0; i < hdaDancerData.length; i++)
				{
					var pageSubscriptionId = hdaDancerData[i].getAttribute('pageSubscriptionId');
					var queryId = hdaDancerData[i].getAttribute('queryId');
					var queryTime = parseInt(hdaDancerData[i].getAttribute('queryTime'));

					var connectorData = hdaDancerData[i].getElementsByTagName('ConnectorData');
					for (var j = 0; j < connectorData.length; j++)
					{
						var connectorId = connectorData[j].getAttribute('connectorId');
						var controlData = connectorData[j].getElementsByTagName('ControlData');
						for (var k = 0; k < controlData.length; k++)
						{
							var controlIndex = controlData[k].getAttribute('controlIndex');
							var valueCount = controlData[k].getAttribute('valueCount');
							var control = document.app.findControl(connectorId, controlIndex);
							if (control != null)
							{
								if (control.updateHistoryRaw != null && typeof control.updateHistoryRaw != 'undefined')
								{
									var valueString = "";
									var itemData = controlData[k].getElementsByTagName('ItemData');
									for (var l = 0; l < itemData.length; l++)
									{
										var itemName = itemData[l].getAttribute('name');
										var itemValueCount = itemData[l].getAttribute('valueCount');
										if (l > 0)
											valueString += "\t";
										valueString += itemValueCount;
										valueString += "\t";
										valueString += typeof (itemData[l].textContent) != 'undefined' ? itemData[l].textContent : itemData[l].text;
									}
									control.updateHistoryRaw(valueString);
								}
							}
						}
					}
				}
			}
		}
	}
}


Prediktor_Dancer_DA_HDALink.prototype.getHistoricalData = function (connectors)
{
	if (this.xmlhttp != null)
	{
		var url = document.app.hdaReaderPage;
		//alert("hda url: " + url);
		this.xmlhttp.open("POST", url, true);
		var xmlHttpOwner = this; // This is just a trick so that it is possible to use this inside the function.
		this.xmlhttp.onreadystatechange = function() {
			xmlHttpOwner.callback();
		}

		var date = new Date();
		var writeValues = "<HDADancerData pageSubscriptionId ='" + document.app.pageSubscriptionSessionID + "' queryId='" + (this.queryId++) + "' queryTime='" + date.getTime() + "'>";
		for (var i = 0; i < connectors.length; i++)
		{
			if (connectors[i].controls.length > 0)
			{
				writeValues += "<ConnectorData connectorId='" + connectors[i].connectorId + "'>";
				for (var j = 0; j < connectors[i].controls.length; j++)
				{
					if (connectors[i].controls[j].items.length > 0)
					{
						writeValues += "<ControlData controlIndex='" + connectors[i].controls[j].controlIndex + "'>";
						for (var k = 0; k < connectors[i].controls[j].items.length; k++)
						{
							var item = connectors[i].controls[j].items[k];

							writeValues += "<ItemData name='" + item.name + "' "
								+ "startTime='" + item.startTime.getTime() + "' "
								+ "endTime='" + item.endTime.getTime() + "'";

							if (typeof item.resampleInterval != 'undefined') // optional
							{
								writeValues += " resampleInterval='" + item.resampleInterval + "'";
							}
							writeValues += "/>";
						}
						writeValues += "</ControlData>";
					}
				}
				writeValues += "</ConnectorData>";
			}
		}
		writeValues += "</HDADancerData>";
		this.xmlhttp.send(writeValues)
	}
}


Prediktor_Dancer_DA_HDALink.prototype.denormalize = function (str)
{
	if (str != null && str.length > 0)
	{
		var lt = new RegExp("&lt;", "g");
		var gt = new RegExp("&gt;", "g");
		var amp = new RegExp("&amp;", "g");
		var quot = new RegExp("&quot;", "g");
		var apos = new RegExp("&apos;", "g");

		return str.replace(lt, "<").replace(gt,">").replace(amp, "&").replace(quot, "\"").replace(apos, "'");
	}
	return str;
}

function Prediktor_Dancer_DA_LanguageLink(connectorId, controlIndex) {

	this.connectorId = connectorId;
	this.controlIndex = controlIndex;
	this.xmlhttp = this.getXmlHttp();
	this.queryId = 0;
}

Prediktor_Dancer_DA_LanguageLink.prototype.getXmlHttp = function () {
	var xmlhttp = null;
	if (typeof XMLHttpRequest == 'undefined') {
		try {
			xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch (e) {
			try {
				xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
			}
			catch (E) {
				xmlhttp = null;
			}
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
		try {
			xmlhttp = new XMLHttpRequest();
		}
		catch (e) {
			xmlhttp = null;
		}
	}
	return xmlhttp;
}


Prediktor_Dancer_DA_LanguageLink.prototype.callback = function () {
	if (this.xmlhttp.readyState == 4) {

		if (this.xmlhttp.responseXML != null && this.xmlhttp.responseXML.documentElement != null) {
			if (document.app != null) {

				var languageData = this.xmlhttp.responseXML.getElementsByTagName('LanguageData');

				if (languageData.length > 0) {
					var control = document.app.findControl(this.connectorId, this.controlIndex);
					var content = typeof (languageData[0].text) != 'undefined' ? languageData[0].text : languageData[0].textContent;
					control.updateLanguage(content);
				}
			}
		}
	}
}


Prediktor_Dancer_DA_LanguageLink.prototype.getLanguageData = function () {

	if (this.xmlhttp != null && document.app != null) {
		var url = document.app.languageReaderPage;
		this.xmlhttp.open("POST", url, true);
		var xmlHttpOwner = this; // This is just a trick so that it is possible to use this inside the function.
		this.xmlhttp.onreadystatechange = function () {
			xmlHttpOwner.callback();
		}

		var date = new Date();
		var writeValues = "<LanguageData pageSubscriptionId ='" + document.app.pageSubscriptionSessionID + "' queryId='" + (this.queryId++) + "' queryTime='" + date.getTime() + "'>";
		writeValues += "</LanguageData>";
		this.xmlhttp.send(writeValues)
	}
}
