$(document).ready(function() {
  var bg = chrome.extension.getBackgroundPage();
  bg.showSearch(function(DLBox, idBox) {
    console.log(DLBox);
    $('.searchList').html(DLBox);
    $('.searchList').find('a.dlLinkst411').bind('click', function(e) {    
      e.preventDefault();
      chrome.runtime.sendMessage({method: "makeDL", message: $(this).attr('rel')}, function(response) {});
    });
  });
});