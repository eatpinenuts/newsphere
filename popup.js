//<![CDATA[

var BGPage;
var debug;

window.onload = function() {
    
    BGPage = chrome.extension.getBackgroundPage();
    setFbStatus();
    appendAlternatives();
};

function setFbStatus(){
    
    if (BGPage.facebookIsLoggedIn) {
        console.log(BGPage.facebookData.userImageUrl);
        $('#fbImage').attr('src', BGPage.facebookData.userImageUrl);

        var fbLoginout = '<a id="log" href="#">Logout</a>';
        $('#facebookUrl').html(fbLoginout);

        document.getElementById('log').addEventListener(
                'click', fblogout);
    }
    else {
        var fbLink = '<a id="log" href="#">Login</a>';

        $('#facebookUrl').html(fbLink);  
        
        document.getElementById('log').addEventListener('click', fbLogin);
    }
}

function fbLogin() {

    chrome.windows.create({url:'https://sharpcode.biz/choosey', type:'popup'}, function (){
        
    });
    //BGPage.facebookUrl;
}//BGPage.facebookData.facebook_label;

function fblogout() {
    
    /*BGPage.facebookLogout(function(){
        setFbStatus();
    });*/
    chrome.windows.create({url:BGPage.facebookData.logoutUrl, type:'popup'}, function (){
        
    });
}

/*$(document).ready(function () {
 $('#facebookframe').load(function () {
 $(this).height($(this).contents().height());
 $(this).width($(this).contents().width());
 });
 });*/

//$('iframe').contents().find('body').css({"min-height": "100", "overflow" : "hidden"});
//setInterval( "$('iframe').height($('iframe').contents().find('body').height() + 20)", 1 );

function appendAlternatives() {
    // get list element.
    var listRoot = document.getElementById('alternatives');
    // clear all list items.
    listRoot.innerHTML = '';

    var alts = document.getElementById('alts');
    alts.innerHTML = '';

    // loop through articles.
    for (var key in BGPage.articles) {
        // create new list item.
        var div = document.createElement('li');
        // append new list item to list.
        listRoot.appendChild(div);
        // set inner html for list item to a link to alternative site.
        div.innerHTML = '<a href="http://' + BGPage.articles[key].url + '" target="_blank">' +
                BGPage.articles[key].url + '</a>';

        /*var desc = document.createElement('p');
         desc.innerHTML = BGPage.articles[key].description;
         
         listRoot.appendChild(desc);*/
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('altLink').addEventListener(
            'click', addAlternativeClicked);
});

function addLinkClicked(e) {
    //http://sharpcode.biz/unite/addalt.json?url=htt://sharpcode.biz&alt=www.test.com
    debug = e;

    var requestUrl = 'https://sharpcode.biz/unite/addalt.json?url=' + BGPage.url + '&alt=' + e.toElement.innerText;

    BGPage.requestUrlCode(requestUrl, callback);
}

function callback(response) {
    console.log(response);
    BGPage.getAlternativesRequest(function() {
        console.log('called back 3');
        appendAlternatives();
    });
}

function addAlternativeClicked(e) {

    chrome.tabs.getAllInWindow(null, function(tabs) {
        // TODO: only do if null
        var alts = document.getElementById('alts');
        // 
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.get(tabs[i].id, function(tab) {
                var li = document.createElement('li');
                alts.appendChild(li);
                // assuming elements contains string of html with your elements
                li.innerHTML = '<a href="#">' + BGPage.url_domain(tab.url) + '</a>';

                li.addEventListener(
                        'click', addLinkClicked);
            });
        }
    });
}

//]]>