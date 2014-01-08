var bouclePage = function() {
  console.log('analyse en cours');
  var seq = jQuery('#title').find('meta').attr('content');
  makeSearch(seq, function(data) {
    var dlLinks = '<h1>Choisissez votre fichier à télécharger sur T411.me</h1>',
        re = new RegExp(' ', 'g'),
        re2 = new RegExp('\\(.+?\\)', 'g'),
        re3 = new RegExp('', 'g'),
        idBox = 't4114'+seq.replace(re, '_').replace(re2, '').substr(0,seq.length-1);
    jQuery.each(data.torrents, function( index, value ) {
      dlLinks = dlLinks + '<a href="#" class="dlLinkst411" rel="'+value.id+'"> telecharger '+value.name+'</a><br/>'
    });
    var elem = '#title';
    $(elem).append('<div id="'+idBox+'" class="box" style="display:none">'+dlLinks+'</div>' 
      + '<span class="jsu" style="display: inline;"><span class="btn-rounded btn-social e_over margin_5l j_w">' 
      + '<a href="#'+idBox+'" rel="modal:open" title="Télécharger depuis Torrent411"><img src="//t411.s3.amazonaws.com/16.png" /></a>'      
      + '</span>'
      + '</span>').find('.dl_torrent').parent().css('margin-right', '4px');
    $(elem).find('a.dlLinkst411').bind('click', function(e) {    
      e.preventDefault();
      chrome.runtime.sendMessage({method: "makeDL", message: $(this).attr('rel')}, function(response) {});
    });
  });
  
};

bouclePage();
