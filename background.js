// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var pageGlobals = {
    currentUrl: "",
    url: "http://sharpcode.biz/unite/result.json?url="
};
// Called when the url of a tab changes.
function checkForValidUrl(tabId, change, tab) { 
    pageGlobals.currentUrl = tab.url;
    requestUrlCode(tab);
}

function requestUrlCode(tab) { 
    var request = new XMLHttpRequest();
    if (request === null) {
        console.log("Unable to create request");
    } else {
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                LDResponse(request.responseText, tab);
            }
        };     
        request.open("GET", pageGlobals.url + tab.url, true);
        request.send(null);
    }
}

function LDResponse(response, tab) {
    // do stuff with the response
    // JSON.parse does not evaluate the attacker's scripts.
    try {
        var resp = JSON.parse(response);
        if (resp.result === true) {
            chrome.pageAction.setIcon({path:"icon-19.png", tabId: tab.id});
            chrome.pageAction.show(tab.id);
        }
    } catch (ex) {
        console.log(ex);
    }
}
// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
// listen for when page become active. Needed as new tabs arn't updating.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // check if page is in problem state (new tab).
        if (pageGlobals.currentUrl !== tab.url) {
            // it is, so operate! Set page url so event doesn't keep firing.
            pageGlobals.currentUrl = tab.url;
            // get page info for tab and update.
            requestUrlCode(tab);
        }
    });
});