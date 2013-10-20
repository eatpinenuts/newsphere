var articles = null;

var url = null;

var pageGlobals = {
    tab: null,
    url: "https://sharpcode.biz/unite/result.json?url="
};

var icons = ["white-19.png", "black-19.png", "green-19.png", "red-19.png"];

function getUrl(tab) {
    return pageGlobals.url + url_domain(tab.url);
}

function getAlternativesRequest(callback) {
    requestUrlCode(getUrl(pageGlobals.tab), 
        function(response){
            LDResponse(response, callback);
        }
    );
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, change, tab) {
    if (url_domain(tab.url) !== 'devtools') {
        pageGlobals.tab = tab;
        
        getAlternativesRequest(function(){console.log('called back 1');});
    }
}

function requestUrlCode(url, callback) {
    var request = new XMLHttpRequest();
    
    if (request === null) {
        console.log("Unable to create request");
    } else {
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                callback(request.responseText);
                //LDResponse(request.responseText, tab);
            }
        };
        
        request.open("GET", url, true);
        request.send(null);
    }
}

function LDResponse(response, callback) {
    // do stuff with the response
    // JSON.parse does not evaluate the attacker's scripts.
    try {
        var resp = JSON.parse(response);
        chrome.pageAction.setIcon({path: icons[resp.result], tabId: pageGlobals.tab.id}, function() {
            //if (resp.isValid === true) {
            // check articles are available.
            if (typeof(resp['articles']) !== 'undefined') {
                // extract articles from server response.
                //extractAltarticles(resp.articles);
                articles = resp.articles;
            }else {
                articles = null;
            }
            if (typeof(resp['url']) !== 'undefined') {

                url = resp['url'];
                console.log('url: ' + url);
            }

            chrome.pageAction.show(pageGlobals.tab.id);
            
            callback();
        });
    } catch (ex) {
        console.log(ex);
    }
}

function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname;
}

// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
// listen for when page become active. Needed as new tabs arn't updating.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab) {

        if (url_domain(tab.url) !== 'devtools') {
            pageGlobals.tab = tab;
            
            getAlternativesRequest(function(){console.log('called back 2');});
        }
    });
});
