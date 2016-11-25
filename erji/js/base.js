/*search box act*/
(function($, global, undefined){
    global.channelID = (function(domain, pathname, search, refer){
      if((domain == 'co.hao123.com' && pathname.match(/^\/[\w\-\.]+\/([\w\-\.]+)/)) ||
              (domain == 'www.hao123.com' && pathname.match(/^\/co\/[\w\-\.]+\/([\w\-\.]+)/)))
      {
        return RegExp.$1;
      }else if(pathname.match(/^\/hezuo\/([\w\-\.]+)/)){
        return RegExp.$1;
      }else if(search.match(/(?:[\?&]|^)src=([\w\-\.]+)/)){
        return RegExp.$1;
      }else if(refer.match(/^(?:https?|wsp):\/\/([\w\-\.]+)\//i)){
        var referhost = RegExp.$1;
        if(!referhost.match(/[\w\-\.]*\.(hao123|baidu)\.com$/)) return referhost;
      }
      return false;
    })(global.document.domain, global.location.pathname, global.location.search, global.document.referrer);
    var search = {
        "tieba":{
            "act":"http://tieba.baidu.com/f",
            "sug":"http://tieba.baidu.com/sug?query={$WORD}&callback={$CALLBACK}&sc=hao123",
            "query":"kw",
            "callback":"tieba_sug",
            "datakey":"msg",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="sc" value="hao123" />'
        },
        "image":{
            "act":"http://image.baidu.com/i",
            "sug":"http://nssug.baidu.com/su?wd={$WORD}&prod=image&sc=hao123",
            "query":"word",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="tn" value="baiduimage"><input type="hidden" name="ct" value="201326592"><input type="hidden" name="cl" value="2"><input type="hidden" name="lm" value="-1"><input type="hidden" name="fm" value="hao123">'
        },
        "zhidao":{
            "act":"http://zhidao.baidu.com/q",
            "sug":"http://nssug.baidu.com/su?wd={$WORD}&prod=zhidao&sc=hao123",
            "query":"word",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="tn" value="ikaslist"><input type="hidden" name="ct" value="17"><input type="hidden" name="sc" value="hao123"><input type="hidden" name="rn" value="20">'
        },
        "web":{
            "act":"http://www.baidu.com/s",
            "sug":"http://suggestion.baidu.com/su?wd={$WORD}&sc=hao123",
            "query":"word",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="tn" value="' + (global.channelID?'divencheng_pg':'divencheng_pg') + '">'
        },
        "music":{
            "act":"http://music.baidu.com/search",
            "sug":"http://nssug.baidu.com/su?wd={$WORD}&prod=mp3&sc=hao123",
            "query":"key",
            "submit":function(){
              $(this).find('[name=ct]').val(parseInt((+new Date())/1000));
            },
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="ct" value="134217728"/><input type="hidden" name="fr" value="hao123">'
        },
        "news":{
            "act":"http://news.baidu.com/ns",
            "sug":"http://nssug.baidu.com/su?wd={$WORD}&prod=news&sc=hao123",
            "query":"word",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="tn" value="news"><input type="hidden" name="sc" value="hao123">'
        },
        "video":{
            "act":"http://video.baidu.com/v",
            "sug":"http://nssug.baidu.com/su?wd={$WORD}&prod=video&sc=hao123",
            "query":"word",
            "utf8":'<input type="hidden" name="ie" value="utf-8"/>',
            "fields":'<input type="hidden" name="sc" value="hao123"><input type="hidden" name="ct" value="301989888"><input type="hidden" name="fbl" value="800"/>'
        },
        "sjrj":{
            "key":"sjrj",
            "query":"word",
            "act":"http://m.baidu.com/s",
            "sug":"http://nssug.baidu.com/su?ie=utf-8&prod=wiseapp&wd={$WORD}",
            "sugCharset":"utf-8",
            "target":"_self",
            "fields":{
              "tn":"webmkt",
              "st":"10a001",
              "pre":"web_am_index",
              "f":"web_am_header",
              "hao":"1"
            }
        }
    };

    $(function(){
        if($.browser.msie && $.browser.version < 9){
            $(".search-box form #search-input-word").val('');
        }
    });

    var baidu = global.baidu;
    var sug;
    if($("#search-input").length){
      sug = global.G && G.sug && G.sug("search-input", {classNameQuery: "sug-query",classNameQueryNull: "sug-querynull",charset: "gbk", requestQuery: "wd",url: 'http://suggestion.baidu.com/su', callbackFn: "baidu.sug",callbackDataKey: "s"});
    }
    var touched = false;

    function changeSearch(key){
      if(search[key]){
        var target = search[key].target || "_blank";
        var sugCharset = search[key].sugCharset || "gbk";
        var cb = search[key].callback || "baidu.sug";
        var cbdk = search[key].datakey || "s";
        sug && sug.reset({
          charset: sugCharset,
          customUrl:function(rnd){
            var url = search[key].sug;
            if(url && typeof(url)=="string"){
              url = url.replace(/\{\$WORD\}/g, encodeURIComponent(this.q)).replace(/\{\$CALLBACK\}/g, cb) + "&" + rnd;
              return url;
            }
          },
          callbackFn:cb,
          callbackDataKey:cbdk
        });
        if(typeof search[key].fields != 'string'){
          var fieldstring = "";
          for(var f in search[key].fields){
            if(search[key].fields.hasOwnProperty(f)){
              fieldstring += '<input type="hidden" name="' + f + '" value="' + search[key].fields[f] + '"/>';
            }
          }
          search[key].fields = fieldstring;
        };
        $("[script-role=search-form]").attr("action", search[key].act).attr("target",target).each(function(idx,elem){
            elem.onsubmit = search[key].submit || null;
        });
        $("[script-role=hiddens]").html(search[key].fields+(/utf-?8/i.test(document.charset)?search[key].utf8:""));
        $("#search-input").attr("name", search[key].query || "word");
      };
    }
    $("[script-role=services]").on("click", "label", function(){
        if(!touched){
            var $this = $(this);
            $this.parent().addClass("cur").siblings(".cur").removeClass("cur");
            changeSearch($("#"+$this.attr("for")).val());
        }
    }).on("touchstart", "label", function(){
        touched = true;
        var $this = $(this);
        $this.parent().addClass("cur").siblings(".cur").removeClass("cur");
        changeSearch($("#"+$this.attr("for")).val());
    });
    $("[script-role=services] [name=service]").each(function(idx, elem){
        elem.name = "";
        elem.removeAttribute("name");
        if(elem.checked){
          $(elem).parent().children("label").trigger("click");
        }
    });


    $("#page-header .top-bar .list .item.more").mouseenter(function(){
      touched || $("#page-header .top-bar .list .sites-as-type-layer").show();
    }).on("keypress",function(e){
      if(e.keyCode == 13){
        $("#page-header .top-bar .list .sites-as-type-layer").show().children(".more").attr("tabindex","1").focus();
      }
    }).on("touchstart", function(e){
      touched = true;
      $("#page-header .top-bar .list .sites-as-type-layer").show();
    });

    $(".more.exp").on("touchstart", function(e){
      touched = true;
      $("#page-header .top-bar .list .sites-as-type-layer").hide();
    });

    $("#page-header .top-bar .list .sites-as-type-layer").mouseleave(function(){
      touched || $(this).hide();   
    }).on("keydown",function(e){
      if(e.keyCode == 27){
        $(this).hide();
      }
    }).on("keypress", ".more", function(e){
      if(e.keyCode == 13){
        $("#page-header .top-bar .list .sites-as-type-layer").hide();
      }
    });
    $("[action=page-header-sethome]").each(
      function(idx,elem){
        indexSetHome.bind(elem, "http://www.hao123.com");
      }                   
    );                    
})(this.jQuery || this.baidu, this);

/*random layers*/
false && this.baidu && (function RandomLayers($, cookie, global, undefined){
  var nomobilekey = "MOBILE_CLOSED";
  var nomobile = cookie.get(nomobilekey);
  var toshow = null;
  if(nomobile == "true"){
    toshow = "desktop";
  } else {
    var r = +new Date % 1;
    toshow = ["desktop","mobile"][r];

  }
  var layer = $("#page-header .top-bar ." + toshow + "-layer").show();
  if(toshow == "desktop"){
    setTimeout(function(){
      layer.fadeOut();
    },5000);
  }
  $("#page-header .top-bar .mobile-layer b").on("click",function(){
    cookie.set(nomobilekey, "true", {"path":'/', expires:3e13, domain:'hao123.com'});
    layer.fadeOut();
  });

})(this.jQuery || this.baidu, this.baidu && this.baidu.cookie, this);

/**/
(function TrackData($, global, undefined){
  global._TRACK_IMAGES_ = global._TRACK_IMAGES_ || [];
  if(typeof Object.keys !== "function"){
    Object.keys = function(obj){
      var keys = [];
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          keys.push(key);
        }
      }
      return keys;
    };
  }
  var track = global.tracker = {
    url:"http://www.hao123.com/images/trackk.gif",
    param:function(obj){
      if(typeof obj == "string"){
        return obj;
      } else {
        var keys = Object.keys(obj);
        var arr = [];
        for(var i = 0; i < keys.length; i++){
          arr.push(encodeURIComponent(keys[i])+"="+encodeURIComponent(obj[keys[i]]));
        }
        return arr.join("&");
      }
    },
    send:function(obj){
      var c = global._TRACK_IMAGES_.length;
      var img = global._TRACK_IMAGES_[c] = new Image();
      img.onload = img.onerror = function(){
        c = img = global._TRACK_IMAGES_[c] = null;
      };
      img.src=this.url+"?"+this.param(obj)+"&r="+(+new Date());
    }
  }
  $("[track-selector]").each(
    function(idx, elem){
      $(elem).on("mousedown", this.getAttribute("track-selector"), function(){
        track.send({page:global.pageId, level:'2', type:'link-click', area:elem.getAttribute("key")||elem.id, url:this.href, title:this.title||this.innerText||this.textContent||''});
      });
    }
  );
  if(global.channelID){
    $(function(){
      track.send({page:global.pageId, level:'2', type:'channel-refer', channel:global.channelID});
    });
  }
  setTimeout(function(){
    track.send({page:global.pageId, type:'navigator-version', appVersion:navigator.appVersion.replace(/\.NET[^;\)]*(;|(?!<\)))\s*/g, '').replace(/Windows NT/,'WIN').replace(/\s[\)@][^;]+;/g, '')});
  }, 5000);
})(this.jQuery || this.baidu, this);


















;;;(function($, global, undefined){ 
  $("[script-role=tab]").each(function(idx, elem){
    var lastSwitch = 0;
    var $el = $(elem),
        switcher = $el.attr("tab-switcher")||"click",
        interval=parseInt($el.attr("tab-interval"))||0,
        total = $el.find(".pages>.item").length,
        mousein = false;
    function switchTab(key){
      $el.attr("tab-cur",key);
      $el.find(".pages .item[key='" + key + "']").addClass("cur").css({opacity:0}).animate({opacity:1},function(){
        $(this).css({opacity:""});
      }).siblings(".cur").removeClass("cur");
      $el.find(".controler .item[key='" + key + "']").addClass("cur").siblings(".cur").removeClass("cur");
    };
    switchTab(0);
    $el.find(".controler").on(switcher, ".item", function(){
      key = $(this).attr("key");
      switchTab(key);
    });
    if(interval > 0){
      setInterval(function(){
        var t = new Date();
        if(t - lastSwitch < interval) return;
        lastSwitch = t;
        if(!mousein){
          var cur = parseInt($el.attr("tab-cur")) || 0;
          switchTab((cur + 1) % total);
        }
      }, interval);
    }
    $el.on("mouseenter",function(){
      mousein = true;
    }).on("mouseleave",function(){
      mousein = false;
    });
    $el.find(".controler .prev").on("click", function(){
        var cur = parseInt($el.attr("tab-cur")) || 0;
        if(cur > 0) switchTab(cur - 1);
    });
    $el.find(".controler .next").on("click", function(){
        var cur = parseInt($el.attr("tab-cur")) || 0;
        if(cur < total - 1) switchTab(cur + 1);
    });
  });
  $("[script-role=page-slider]").each(function(idx, elem){
    var $el = $(elem),
        total = $el.find(".pages>.page").length,
        mousein = false;
    function switchPage(key){
      $el.attr("cur", key);
      $el.find(".pages>.page[key="+key+"]").fadeIn("fast",function(){$(this).css({display:''})}).addClass("cur").siblings(".cur").removeClass("cur");
      if(key > 0) $el.find(".controler .prev").removeClass("inactive").removeClass("prev-inactive"); else $el.find(".controler .prev").addClass("inactive").addClass("prev-inactive");
      if(key < total - 1) $el.find(".controler .next").removeClass("inactive").removeClass("next-inactive"); else $el.find(".controler .next").addClass("inactive").addClass("next-inactive");
    }
    $el.find(".controler .prev").on("click", function(){
        var cur = parseInt($el.attr("cur")) || 0;
        if(cur > 0) switchPage(cur - 1);
    });
    $el.find(".controler .next").on("click", function(){
        var cur = parseInt($el.attr("cur")) || 0;
        if(cur < total - 1) switchPage(cur + 1);
    });
    switchPage(0);
  });
  if(global.navigator.userAgent.match(/MSIE\s+[0-6]/)){
    $("[ie6-fix=hover]").on("mouseenter", function(e){
        $(this).addClass("hover");
    }).on("mouseleave", function(e){
        $(this).removeClass("hover");
    });
  }
})(this.jQuery||this.baidu, this);
