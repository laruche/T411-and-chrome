var bouclePage = function() {
  if(jQuery("#episodes_container .episodes .item").length > 0) {
    jQuery("#episodes_container .episodes .item").each(function( index ) {
      var seq = '';
      var x = 0;
      var elem = this;
      $(this).find('.titre a').each(function() {
        var isSeq = true;

        if($(this).attr('href').substr(0,30) == "https://www.betaseries.com/srt" || $(this).attr('href').substr(0,24) == "javascript:srtInaccurate")
          isSeq = false;
        if($(this).text() == '')
          isSeq = false;

        if(isSeq) {
          if(x < 2)
            seq = seq + $(this).text() + ' ';
          x++;
        }
      });

      makeSearch(seq, function(data) {
        makeDLBox(seq, data, function(dlBox, idBox) {
          if(data.torrents.length > 0) {
            $(elem).find('.side').prepend(dlBox + '<div class="dl"><a class="dl_img dl_torrent" href="#'+idBox+'" rel="modal:open" title="Télécharger depuis Torrent411"><img src="//t411.s3.amazonaws.com/12.png"></a></div>').find('.dl_torrent').parent().css('margin-right', '4px');
            $(elem).find('a.dlLinkst411').bind('click', function(e) {    
              e.preventDefault();
              chrome.runtime.sendMessage({method: "makeDL", message: $(this).attr('rel')}, function(response) {});
            });
          }
        });      
      });
    });
  } else {
    setTimeout(bouclePage(),5000);
  }
  
};

bouclePage();
