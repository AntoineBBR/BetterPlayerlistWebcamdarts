// ==UserScript==
// @name         Custom script for webcamdarts
// @version      0.4
// @description  Custom script using "Better Userlist in Wabcamdarts-Lobby" and "Ultimate Webcamdarts Lobby"
// @author       Antoine Imbert
// @downloadURL  https://raw.githubusercontent.com/AntoineBBR/BetterPlayerlistWebcamdarts/main/script.js
// @updateURL    https://raw.githubusercontent.com/AntoineBBR/BetterPlayerlistWebcamdarts/main/script.js
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @match        https://www.webcamdarts.com/wda-games/tournaments/*
// @require      https://code.jquery.com/ui/1.10.4/jquery-ui.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// ==/UserScript==


/* --------- Add Button ---------*/

$('#current-user').append('<a class="Camtesting"href="https://game.webcamdarts.com/CamTest" target="_blank">Camtest</a>');
$( "<a class='deco' href='javascript:doLogout()'>Logout</a>" ).appendTo( ".logout" );

var recbutton = document.createElement("div");
recbutton.innerHTML = '<div id="recbutton" style="width:100%;height:25px; position:fixed; bottom:0px;font-size:smaller;margin-left:2px;white-space: nowrap;display: inline-block; " ><a href="https://chrome.google.com/webstore/detail/recordrtc/ndcljioonkecdnaaihodjgiliohngojp" target="_blank">Record your match (save & upload youtube) with RecordRTC</a> or <a href="https://chrome.google.com/webstore/detail/webrtc-desktop-sharing/nkemblooioekjnpfekmjhpgkackcajhg" target="_blank">Stream your match (max 10 friends) with WebRTC Sharing</a> Extension for Google Chrome</div>';

// Get the reference node
var referenceNode1 = document.querySelector('#textMessage');

// Insert the new node before the reference node
referenceNode1.after(recbutton);



/* --------- Custom css ---------*/

(function() {
  'use strict';


  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-users.k-pane.k-scrollable{font-size:13px;right:7px;min-width: 50%;max-width: 50%;}');
  addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-window-container.k-pane.k-scrollable { padding: 0px;min-width: 50%;max-width: 50%;}');
  addGlobalStyle('.info-handle {position: absolute; height: 0px;opacity: 0.7;top:unset;bottom:unset;width:0px; margin-bottom: unset;margin-left: unset;line-height: 20px;padding-top: 25%;transform: rotate(0turn);padding-bottom: unset;background: content-box;border: none;text-transform: uppercase;padding-left: unset;}');
  addGlobalStyle('.playercard {background:white;max-width:345px;min-width:345px;}');
  addGlobalStyle('button.custombutton {margin-bottom:20px !important;margin-top:3px !important;margin-left:3px !important;}');
  addGlobalStyle('.bighonkinglogoutbutton a {margin-left: 150px !important;}');
  addGlobalStyle('#current-user.busy {max-width: 235px !important;}');
  addGlobalStyle('div.cusermenu {margin-top: -15px;}');
  addGlobalStyle('div.logout {margin-top: 7px;}');
  addGlobalStyle('.chat-messagebar.k-pane {margin-top: 0px !important;}');
  addGlobalStyle('#recbutton {max-height: 18px !important;}');
  addGlobalStyle('div.playercard > div:nth-child(2) {max-width:270px;min-width:270px;font-size:medium;}');
  addGlobalStyle('div.playercard > div:nth-child(3) {font-size:small;}');

})();



/* --------- Load custom page ---------*/

(function() {
  'use strict';
 /* globals $ */
 
 function load() {
 
     GM.xmlHttpRequest({
         method: "GET",
         async: false,
         url: "https://wda.hhedl.de/userlist_generator.php?status=1&sort=1",
          onload : function(response) {
 
             if (this.readyState == 4 && this.status == 200) {
 
            setTimeout(() => {$( "#newplayerlist" ).html(response.responseText); }, 1000);
             }
         }
     });
 
 }
 
 $( '<div id="newplayerlist"  style="background-color: #302E2E;">Loading playerlist...</div>' ).css({
     position: "absolute",
     width: "98%",
     height: "50%",
     left: 5,
     top: 115,
     zIndex: 1
 }).appendTo($(".chat-users.k-pane.k-scrollable").css("position", "relative"));
 
 load();
})();






/* --------- FOR Friends ---------*/

(function() { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) { return; } // end execution if in a frame

  // setting User Preferences
  function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref(
  'keywordsfriends',
  'word 1,word 2,word 3',
  'Set Friends List',
  'Set keywordsfriends separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref(
  'highlightStyleFriends',
  'color: transparent; background-color: #ffebcd;',
  'Set Highlight Style',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f00; font-weight: bold; background-color: #ffe4b5;'
  );

  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb){
    var THmo_chgMon = new THmo_MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts = {childList: true, subtree: true};
    THmo_chgMon.observe(document.body, opts);
  }
  // Main workhorse routine
  function THmo_doHighlight(el){
    var keywordsfriends = GM_getValue('keywordsfriends');
    if(!keywordsfriends)  { return; }  // end execution if not found
    var highlightStyleFriends = GM_getValue('highlightStyleFriends');
    if (!highlightStyleFriends) highlightStyleFriends = "color:#00f; font-weight:bold; background-color: #0f0;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywordsfriends = "\\b" + keywordsfriends.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywordsfriends + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyleFriends + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }

    /* --------- FOR BLACK LIST ---------*/

    // first run
  THmo_doHighlight(document.body);



  // setting User Preferences
  function setUserPref2(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight2(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref2(
  'keywordsblack',
  'word 1,word 2,word 3',
  'Set Black List',
  'Set keywordsblack separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref2(
  'highlightStyleBlack',
  'color: #FFF; background-color: #000;',
  'Set Black List Style',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #000; font-weight: bold; background-color: #FFF;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb2 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb2){
    var THmo_chgMon2 = new THmo_MutOb2(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight2(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts2 = {childList: true, subtree: true};
    THmo_chgMon2.observe(document.body, opts2);
  }
  // Main workhorse routine
  function THmo_doHighlight2(el){
    var keywordsblack = GM_getValue('keywordsblack');
    if(!keywordsblack)  { return; }  // end execution if not found
    var highlightStyleBlack = GM_getValue('highlightStyleBlack');
    if (!highlightStyleBlack) highlightStyleBlack = "color:#fff; font-weight:bold; background-color: #000;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywordsblack = "\\b" + keywordsblack.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywordsblack + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyleBlack + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }


  // first run
  THmo_doHighlight2(document.body);
})(); // end of anonymous function

/* --------- FOR THIRD STYLE ---------*/

(function() { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) { return; } // end execution if in a frame

  // setting User Preferences
  function setUserPref3(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight3(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref3(
  'keywords3',
  'word 1,word 2,word 3',
  'Set Personal Style',
  'Set keywords separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref3(
  'highlightStyle3',
  'color: #f00; background-color: #ffebcd;',
  'Set Highlight Syle 01',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f01466; font-weight: bold; background-color: #dedede;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb3 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb3){
    var THmo_chgMon3 = new THmo_MutOb3(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight3(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts3 = {childList: true, subtree: true};
    THmo_chgMon3.observe(document.body, opts3);
  }
  // Main workhorse routine
  function THmo_doHighlight3(el){
    var keywords3 = GM_getValue('keywords3');
    if(!keywords3)  { return; }  // end execution if not found
    var highlightStyle3 = GM_getValue('highlightStyle3');
    if (!highlightStyle3) highlightStyle3 = "color:#f01466; font-weight:bold; background-color: #dedede;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywords3 = "\\b" + keywords3.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywords3 + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyle3 + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }
  // first run
  THmo_doHighlight3(document.body);
})(); // end of anonymous function
