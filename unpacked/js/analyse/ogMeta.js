// array of possible type
var arr = ['video.movie', 'video.episode'],
    seq = '';

if(jQuery.inArray( $('meta[property="og:type"]').attr('content'), arr ) != '-1') {
  seq = $('meta[property="og:title"]').attr('content');
  makeSearch(seq, function(data) {
    chrome.runtime.sendMessage({method: "makeAnim", message: data}, function(response) {});     
  });
};