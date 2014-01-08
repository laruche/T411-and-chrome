$(document).ready(function() {
  var searchValue = 'tokenUsert411';
  chrome.storage.sync.get(searchValue,function(object){
    if(typeof(object[searchValue]) != 'undefined')
    {
      var token = object[searchValue],
          user = token.split(':');
          user = user[0];

      jQuery.ajax({
        url: "https://api.t411.me/users/profile/" + user,
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", token);
        },
        context: document.body
      }).done(function(data) {
        var user = JSON.parse(data),
            ratio = '∞';

        if (user.downloaded > 0) {
          ratio = user.uploaded / user.downloaded;
          ratio = Math.round(ratio*100)/100;
        }

        if(ratio > 100)
          ratio = '∞';

        ratio = ratio.toString().replace('.', ',').substr(0,4);
        
        $('#dlStats').html(Math.round(((user.downloaded / 1073741824)*100)/100).toString().replace('.', ',') + ' Go');
        $('#upStats').html((Math.round((user.uploaded / 1073741824)*100)/100).toString().replace('.', ',') + ' Go');
        $('#ratio').html(ratio);
        

      });
    }
  });
});