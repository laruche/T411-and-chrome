var bouclePage = function() {
  
  var seq = $('#right h1:first').text(),
      x = 0,
      elem = $('#right h1:first');


  makeSearch(seq, function(data) {
    makeDLBox(seq, data, function(dlBox, idBox) {
      if(data.torrents.length > 0) {
        $(elem).prepend(dlBox + '<div class="dl"><a class="dl_img dl_torrent" href="#'+idBox+'" rel="modal:open" title="Télécharger depuis Torrent411"><img src="//t411.s3.amazonaws.com/12.png"></a></div>').find('.dl_torrent').parent().css('margin-right', '4px');
        $(elem).find('a.dlLinkst411').bind('click', function(e) {    
          e.preventDefault();
          chrome.runtime.sendMessage({method: "makeDL", message: $(this).attr('rel')}, function(response) {});
        });
      }
    });      
  });
    
};

bouclePage();
