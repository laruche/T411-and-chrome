var bouclePage = function() {
  if(jQuery("#right .episode").length > 0) {
    jQuery("#right .episode").each(function( index ) {
      var seq = $(this).find('.titreep a').text();
      var x = 0;
      var elem = this;      

      makeSearch(seq, function(data) {
        makeDLBox(seq, data, function(dlBox, idBox) {
          if(data.torrents.length > 0) {
            $(elem).append(dlBox + '  <div class="dl"><a class="dl_img dl_torrent" href="#'+idBox+'" rel="modal:open" title="Télécharger depuis Torrent411">&nbsp;&nbsp;<img src="//t411.s3.amazonaws.com/12.png"></a></div>').find('.dl_torrent').parent().css('margin-right', '4px');
            $(elem).find('a.dlLinkst411').bind('click', function(e) {    
              e.preventDefault();
              chrome.runtime.sendMessage({method: "makeDL", message: $(this).attr('rel')}, function(response) {});
            });
          }
        });      
      });
    });
  } else {
    setTimeout(bouclePage(),1000);
  }
  
};

bouclePage();
