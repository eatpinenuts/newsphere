var articles = null;

var facebookUrl = "";
var facebookIsLoggedIn = false;
var facebookData = null;

var url = null;

var pageGlobals = {
    tab: null,
    url: "http://sharpcode.biz/unite/result.json?url="
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
        getFacebookStuff(function(){
            getAlternativesRequest(function(){console.log('called back 1');});
        });
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
            }
        };
        
        request.open("GET", url, true);
        request.send(null);
    }
}

function LDResponse(response, callback) {
    try {
        var resp = JSON.parse(response);
        chrome.pageAction.setIcon({path: icons[resp.result], tabId: pageGlobals.tab.id}, function() {
            if (typeof(resp['articles']) !== 'undefined') {
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
            
            getFacebookStuff(function(){
                getAlternativesRequest(function(){console.log('called back 2');});
            });       
        }
    });
});

function getFacebookStuff(callback){
    var request = new XMLHttpRequest();
    
    if (request === null) {
        console.log("Unable to create request");
    } else {
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                var data = JSON.parse(request.responseText);
                console.log(data);
                facebookUrl = data.result.facebook_link;
                facebookIsLoggedIn = data.loggedIn;
                facebookData = data.result;   
            }
            callback();
        };
        
        request.open("GET", 'http://sharpcode.biz/chooseyr.json', true);
        request.send(null);
    }
}

function facebookLogout(callback){
    console.log('facebookLogout');
    var request = new XMLHttpRequest();
    
    if (request === null) {
        console.log("Unable to create request");
    } else {
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                
                console.log(request.responseText);
                
                var data = JSON.parse(request.responseText);
                
                facebookUrl = data.result.facebook_link;
                facebookIsLoggedIn = data.loggedIn;
                facebookData = data.result;
                
                callback();
            }
        };
        
        request.open("GET", 'http://sharpcode.biz/choosey/logout', true);//'http://sharpcode.biz/chooseyr/logout.json', true);
        request.send(null);
    }
}







var successURL = 'http://sharpcode.biz/chooseyr.json?code=';

function onFacebookLogin(){
  //if (!localStorage.getItem('accessToken')) {
    chrome.tabs.query({}, function(tabs) { // get all tabs from every window
      for (var i = 0; i < tabs.length; i++) {
          console.log(tabs[i].url);
        if (tabs[i].url.indexOf(successURL) !== -1) {
          console.log('found login tab');
          // below you get string like this: access_token=...&expires_in=...
          var params = tabs[i].url.split('code=')[1];
          // in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
          var accessToken = params.split('&')[0];
          //accessToken = accessToken.split('=')[1];

          localStorage.setItem('accessToken', accessToken);
          chrome.tabs.remove(tabs[i].id);
          
          //chrome.pageAction.show(pageGlobals.tab.id);
        }
      }
    });
  /*}else{
      console.log(localStorage.getItem('accessToken'));
  }*/
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);

//removeListener
