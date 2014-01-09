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
    } else {
      getFilmByMeta(tab);
    }
};

var getFilmByMeta = function(tab) {
  chrome.tabs.executeScript(tab.id, { file: "js/jquery.min.js" }, function() {
    chrome.tabs.executeScript(tab.id, { file: "js/request.js" }, function() {
      chrome.tabs.executeScript(tab.id, { file: "js/analyse/ogMeta.js" });
    });
  });
}

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
var animedInterval = '';
window.lastSearch = '';

var makeAnim = function(data) {
  if(data.torrents.length > 0) {
    window.lastSearch = data;
    var i = 0;
    chrome.browserAction.setPopup({popup : 'html/userDL.html'})
    animedInterval = window.setInterval(function() {
      if(Odd(i))
        chrome.browserAction.setIcon({path : '../img/38.png'});
      else
        chrome.browserAction.setIcon({path : '../icon.png'});
      i++;    
    }, 300);

    window.setTimeout(function() {
      clearInterval(animedInterval);
      chrome.browserAction.setPopup({popup : 'html/userStats.html'})
      chrome.browserAction.setIcon({path: '../icon.png'});
    }, 15000)
  }
};

var killAnim = function() {
  clearInterval(animedInterval);
  chrome.browserAction.setPopup({popup : 'html/userStats.html'})
  chrome.browserAction.setIcon({path: '../icon.png'});
};


var showSearch = function(cb) {
  var data =  window.lastSearch;
  var seq = data.query;
  var dlLinks = '<h1>Choisissez votre fichier à télécharger sur T411.me</h1>',
      re = new RegExp(' ', 'g'),
      re2 = new RegExp('\\(.+?\\)', 'g'),
      re3 = new RegExp('', 'g'),
      idBox = seq.replace(re, '_').replace(re2, '').substr(0,seq.length-1);
  jQuery.each(data.torrents, function( index, value ) {
    dlLinks = dlLinks + '<a href="#" class="dlLinkst411" rel="'+value.id+'">'+value.name+'</a> <br/>(S:'+value.seeders+' / L:'+value.leechers+' / '+convertSizeName(value.size)+') <br/>'
  });
  var DLBox = '<div id="'+idBox+'" class="box boxDLT411andMe" >'+dlLinks+'</div>';
  cb(DLBox, idBox);
}

var Odd = function (value) {
  return (value & 1)==1;
};

getRatio();
chrome.browserAction.setBadgeText({text: "???"});
chrome.browserAction.setBadgeBackgroundColor({color:[7, 149, 0, 255]});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  clearInterval(animedInterval);
  chrome.browserAction.setPopup({popup : 'html/userStats.html'})
  chrome.browserAction.setIcon({path: '../icon.png'});
  getRatio();
  getSeriesOnSite(tab);
});

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
  clearInterval(animedInterval);
  chrome.browserAction.setPopup({popup : 'html/userStats.html'})
  chrome.browserAction.setIcon({path: '../icon.png'});
  chrome.tabs.executeScript(tabId, { file: "js/jquery.min.js" }, function() {
    chrome.tabs.executeScript(tabId, { file: "js/request.js" }, function() {
      chrome.tabs.executeScript(tabId, { file: "js/analyse/ogMeta.js" });
    });
  });
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {         
  clearInterval(animedInterval);
  getRatio();
});




function draw(starty, startx) {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(0,200,0,255)";
  context.fillRect(startx % 19, starty % 19, 8, 8);
  context.fillStyle = "rgba(0,0,200,255)";
  context.fillRect((startx + 5) % 19, (starty + 5) % 19, 8, 8);
  context.fillStyle = "rgba(200,0,0,255)";
  context.fillRect((startx + 10) % 19, (starty + 10) % 19, 8, 8);
  return context.getImageData(0, 0, 19, 19);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(request);
  // console.log(sender);
    if (request.method == "makeDL")
      makeDL(request.message);
    if (request.method == "makeAnim") {
      makeAnim(request.message);
    } else
      sendResponse({}); // snub them.
});


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