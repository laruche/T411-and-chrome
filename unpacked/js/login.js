$( document ).ready(function() {
  $( "#loginForm" ).submit(function( event ) {
    event.preventDefault();
    var user = $('#inputEmail').val(),
        pass = $('#inputPassword').val();
    $.ajax({
        type: "POST",
        url: "https://api.t411.me/auth",
        data: {
          username : user,
          password : pass
        },
        dataType : 'json'
      }).done(function(data) {
        if(data.code == 101)
          $('#message').html('Le login n\'existe pas');
        else if(data.code == 107)
          $('#message').html('Verifier votre mot de passe');
        else
          {
            $('#message').html('Good... veuillez patienter');
            chrome.storage.sync.set({'tokenUsert411': data.token}, function() {});
            var bg = chrome.extension.getBackgroundPage();
            bg.getRatio();
            window.close();
          }
      });
  });
});