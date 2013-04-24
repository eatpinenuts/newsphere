/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function() {
    var BGPage = chrome.extension.getBackgroundPage();
    //BGPage.upload("Test");

    var listRoot = document.getElementById('alternatives');

    for (var key in BGPage.articles) {
        console.log(BGPage.articles[key]);
        // somewhere in your code, preferably outside of global scope
        var div = document.createElement('li');
        div.id = 'alternative_item';

        listRoot.appendChild(div);
        // assuming elements contains string of html with your elements
        div.innerHTML = '<a href="' + BGPage.articles[key].url + '" target="_blank">' +
                BGPage.articles[key].url + '</a>';

        var desc = document.createElement('p');
        desc.innerHTML = BGPage.articles[key].description;

        listRoot.appendChild(desc);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('altLink').addEventListener(
            'click', addAlternativeClicked);
});

function addAlternativeClicked(e) {
    console.log('got here');

    chrome.tabs.getAllInWindow(null, function(tabs) {
        // TODO: only do if null
        var alts = document.getElementById('alts');
        // 
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.get(tabs[i].id, function(tab) {
                // check if page is in problem state (new tab).
                //alert(tab.url);
                
                var li = document.createElement('li');
                alts.appendChild(li);
                // assuming elements contains string of html with your elements
                li.innerHTML = '<a href="#">' + tab.url + '</a>';   
            });
        }
    });
}
