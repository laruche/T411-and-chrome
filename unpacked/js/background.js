/// infos


var getToken = function(cb) {
  var searchValue = 'tokenUsert411';
  chrome.storage.sync.get(searchValue,function(object){
    if(typeof(object[searchValue]) == 'undefined')
    {
      cb(null, null);
    } else {
      var token = object[searchValue],
          user = token.split(':')
      cb(user[0], token);
    }
  });
}


var getRatio = function() {
  getToken(function(user, token) {
    if(user != null) {
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
          if(ratio < 0.75)
            chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
          else
            chrome.browserAction.setBadgeBackgroundColor({color:[7, 149, 0, 255]}); 
          ratio = Math.round(ratio*100)/100;
          if(ratio > 100)
            ratio = '∞';
        }

        
        ratio = ratio.toString().replace('.', ',').substr(0,4);
        chrome.browserAction.setBadgeText({text: ratio});
        chrome.browserAction.setPopup({popup : 'html/userStats.html'})
      });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({color:[254, 51, 0, 255]}); 
      chrome.browserAction.setBadgeText({text: '?'});
      chrome.browserAction.setPopup({popup : 'html/popupLogin.html'})
    }
  });
  
};


var getSeriesOnSite = function(tab) {
  if(tab.status == "complete") 
    if(tab.url.substr(0,25) == "http://www.betaseries.com") {
      getSeriesOnBTS(tab);
    } else if(tab.url.substr(0,22) == "http://www.allocine.fr") {
      getFilmOnAllocine(tab);
    }
};

var getFilmOnAllocine = function(tab) {
  // check page
  var url = tab.url.split('/');
  if((url[3] == "film" && url[4].substr(0,9) == 'fichefilm')) {
    // page ÉPISODES NON-VUS DE LARUCHE
    chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
      chrome.tabs.insertCSS(tab.id, { file: "css/jquery-modal.css" }, function() {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-modal.js" }, function() {
          chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
            chrome.tabs.executeScript(tab.id, { file: "js/analyse/allocine.js" });
          });
        });
      });
    });
    //chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-episodes.js" });
  } else {
    // page d'analyse
    console.log('page a ne pas analyser')    

  }


}

var getSeriesOnBTS = function(tab) {
  // check page
  var url = tab.url.split('/');
  if((url[3] == "membre" && url[5] == "episodes") || (url[3] == "membre" && url[5] == "episodes#")) {
    // page ÉPISODES NON-VUS DE LARUCHE
    chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
      chrome.tabs.insertCSS(tab.id, { file: "css/jquery-modal.css" }, function() {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-modal.js" }, function() {
          chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
            chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-episodes.js" });
          });
        });
      });
    });
    //chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-episodes.js" });
  } else if (url[3] == "episode") {
    // page d'un episode
    chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
      chrome.tabs.insertCSS(tab.id, { file: "css/jquery-modal.css" }, function() {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-modal.js" }, function() {
          chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
            chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-episode.js" });
          });
        });
      });
    });

  } else if (url[3] == "film") {
    //page d'un FILM
    chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
      chrome.tabs.insertCSS(tab.id, { file: "css/jquery-modal.css" }, function() {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-modal.js" }, function() {
          chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
            chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-film.js" });
          });
        });
      });
    });

  } else if((url[3] == "membre" && url[5] == "films") || (url[3] == "membre" && url[5] == "films#")) {
    // page ÉPISODES NON-VUS DE LARUCHE
    chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
      chrome.tabs.insertCSS(tab.id, { file: "css/jquery-modal.css" }, function() {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-modal.js" }, function() {
          chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
            chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-films.js" });
          });
        });
      });
    });
    //chrome.tabs.executeScript(tab.id, { file: "js/analyse/BTS-episodes.js" });
  }


}

var makeDL = function(id) {
  //console.log('DL');
  var searchValue = 'tokenUsert411';
  chrome.storage.sync.get(searchValue,function(object){
    if(typeof(object[searchValue]) != 'undefined')
    {  
      var token = object[searchValue];          
        chrome.downloads.download(
          {
            filename : id+'.torrent',
            url : 'https://api.t411.me/torrents/download/' + id,
            headers : [ {
              name : "Authorization",
              value : token
            } ]
          });
    }
  });
};

getRatio();
chrome.browserAction.setBadgeText({text: "???"});
chrome.browserAction.setBadgeBackgroundColor({color:[7, 149, 0, 255]});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  getRatio();
  getSeriesOnSite(tab);
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {         
   getRatio();
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(request);
  // console.log(sender);
    if (request.method == "makeDL")
      makeDL(request.message);
    else
      sendResponse({}); // snub them.
});