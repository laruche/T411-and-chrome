var makeSearch = function(search, cb) {
  var searchValue = 'tokenUsert411';
  chrome.storage.sync.get(searchValue,function(object){
    if(typeof(object[searchValue]) != 'undefined')
    {
      var token = object[searchValue];
      jQuery.ajax({
        url: "https://api.t411.me/torrents/search/"+ search,
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", token);
        },
        dataType : 'json'
      }).done(function(data) {
        cb(data)
      });
    }
  });
};

var convertSizeName = function(octet) {
    var unite = [' octet',' Ko',' Mo',' Go'];
 
    if (octet < 1000) {
        return octet + unite[0];
    } else {
        if (octet < 1000000) {
            var ko = Math.round((octet/1024)*100)/100;
            return  ko + unite[1];
        } else {
            if (octet < 1000000000) {
                var mo = Math.round((octet/(1024*1024))*100)/100;
                return mo + unite[2];
            } else {
                var go = Math.round((octet/(1024*1024*1024))*100)/100;
                return go + unite[3];
            }
        }
    }
}

var makeDLBox = function(seq, data, cb) {
  var dlLinks = '<h1>Choisissez votre fichier à télécharger sur T411.me</h1>',
      re = new RegExp(' ', 'g'),
      re2 = new RegExp('\\(.+?\\)', 'g'),
      re3 = new RegExp('', 'g'),
      idBox = seq.replace(re, '_').replace(re2, '').substr(0,seq.length-1);
  jQuery.each(data.torrents, function( index, value ) {
    dlLinks = dlLinks + '<a href="#" class="dlLinkst411" rel="'+value.id+'">'+value.name+'</a> (S:'+value.seeders+' / L:'+value.leechers+' / '+convertSizeName(value.size)+') <br/>'
  });
  var DLBox = '<div id="'+idBox+'" class="box boxDLT411andMe" style="display:none">'+dlLinks+'</div>';

  cb(DLBox, idBox);

}
