/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 
 window.onload = function() {
    var BGPage = chrome.extension.getBackgroundPage();
    //BGPage.upload("Test");

    for(var key in BGPage.articles){
        console.log(BGPage.articles[key]);
        // somewhere in your code, preferably outside of global scope
        var div = document.createElement('li');
        div.id = 'alternative_item';
    
        document.getElementById('alternatives').appendChild(div);
        // assuming elements contains string of html with your elements
        div.innerHTML = '<a href="'+BGPage.articles[key].url+'">'+ 
                BGPage.articles[key].url +'</a>';
    }
}