var globalPlayingSecond = 0;
var globalCurrentVolume = 1;

createCookie("globalIsFisrtRunning", "0", 1);

var HTML5VideoPlayer = function (playerId, kWidget) {

    this.playerId = playerId;
    this.kWidget = kWidget;

    this.mediaProxy = {
        'entry': {
            'id': "my_entry_key",
            'name': "My ToolKit Video",
            "description": "Kaltura Player toolkit Description."
        },
        "contextData": {
            'isCountryRestricted': false
        },
        'entryMetadata': {
            'thumbSlicesUrl': 'https://cdnsecakmi.kaltura.com/p/1038472/sp/103847200/thumbnail/entry_id/1_l9kx0z80/version/100003/width/100/vid_slices/100'
        },
        'sources': []
    }

    this.jsonConfig = {
        "plugins": {
            "topBarContainer": {},
            "titleLabel": {},
            "controlBarContainer": {
                "hover": false
            },
            "largePlayBtn": {},
            "scrubber": {
                'thumbSlicesUrl': '{mediaProxy.entryMetadata.thumbSlicesUrl}'
            },
            "vast": {
                "trackCuePoints": "true",
                "timeout": 4
            },
            'skipBtn': {
                'label': 'Skip Ad'
            },
            'noticeMessage': {
                'text': 'Advertisment {sequenceProxy.timeRemaining|timeFormat}'
            },

            "playPauseBtn": {},
            "volumeControl": {},
            "fullScreenBtn": {},
            "durationLabel": {},
            "currentTimeLabel": {},
            "sourceSelector": {},
            "logo": {"visible": false},
            "infoScreen": {},
            "share": {},
            'statistics': {'plugin': false},
        },
        "uiVars": [{
                "key": "autoPlay",
                "value": false,
                "overrideFlashvar": false
            }],
        "layout": {
            "skin": "kdark",
            "cssFiles": []
        }
    };
};


HTML5VideoPlayer.prototype.setEntryId = function (entry_id) {
    this.mediaProxy.sources = [
        {
            "src": "https://cdnsecakmi.kaltura.com/p/1038472/sp/35960161/playManifest/entryId/" + entry_id + "/format/url/protocol/http/a.mp4",
            "width": "640",
            "height": "360",
            "bandwidth": "1101824",
            "type": "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2",
        }, {
            "src": "https://cdnsecakmi.kaltura.com/p/1038472/sp/35960161/playManifest/entryId/" + entry_id + "/format/url/protocol/http/a.mp4",
            "width": "1280",
            "height": "720",
            "bandwidth": "24117248",
            "type": "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2",
        },
        {
            "src": "https://cdnsecakmi.kaltura.com/p/1038472/sp/35960161/playManifest/entryId/" + entry_id + "/format/applehttp/protocol/http/a.m3u8",
            "type": "application/vnd.apple.mpegurl",
        }
    ];

    this.kWidget.uiconf_id = entry_id;

    this.mediaProxy.entryMetadata.thumbSlicesUrl = "https://cdnsecakmi.kaltura.com/p/1038472/sp/35960161/thumbnail/entry_id/" + entry_id + "/version/100003/width/100/vid_slices/100";
    this.mediaProxy.entry.thumbnailUrl = "https://cdnsecakmi.kaltura.com/p/1038472/sp/35960161/thumbnail/entry_id/" + entry_id + "/version/100003/width/640"
};


var globalXMLSlidesPath = "";

HTML5VideoPlayer.prototype.fillData = function (theSession) {
    var XMLSlidesPath = "Data/" + theSession.module + "/" + theSession.session + "/" + theSession.part + ".xml";
    var ModulePath = "Data/" + theSession.module + "/module_data.xml";

    checkExistFile(ModulePath);
    checkExistFile(XMLSlidesPath);

    globalSlidesArray = readXMLCuepoints(XMLSlidesPath);

    globalRelateArray = readRelatedVideo(XMLSlidesPath);

    $("#fullscreenDIV #slides").html("");
    $("#normalDIV #slides").html("");
    if (globalSlidesArray != null)
        for (i = 0; i < 3; i++) {
            if (globalSlidesArray[i] != null) {
                drawFullscreenSlide(i, globalSlidesArray[i].attributes[0].nodeValue, globalSlidesArray[i].attributes[1].nodeValue, globalSlidesArray[i].attributes[2].nodeValue);
                drawNormalSlide(i, globalSlidesArray[i].attributes[0].nodeValue, globalSlidesArray[i].attributes[1].nodeValue, globalSlidesArray[i].attributes[2].nodeValue);
            }

            if (i >= globalSlidesArray.length)
                break;
        }

    $("#fullscreenDIV").append(
            '<var id="XMLSlidesPath">' + XMLSlidesPath + '</var>'
            );
    globalXMLSlidesPath = XMLSlidesPath;

    globalVideosArray = readXMLVideos(XMLSlidesPath);

    $("#fullscreenDIV .videosGrid .video_items").html("");
    $("#normalDIV .videosGrid .video_items").html("");

    for (i = 0; i < globalVideosArray.length; i++) {
        var is_active = false;
        if (globalVideosArray[i].attributes[0].nodeValue == theSession["video"])
            is_active = true;

        drawGridVideos(i, globalVideosArray[i].attributes[0].nodeValue, globalVideosArray[i].attributes[1].nodeValue, globalVideosArray[i].attributes[2].nodeValue, globalVideosArray[i].attributes[3].nodeValue, is_active);
        $("#normalDIV .videosGrid").css("margin-top", -115 * globalVideosArray.length / 4);
        $("#fullscreenDIV .videosGrid").css("margin-top", -115 * globalVideosArray.length / 4);

        if (is_active) {
            drawBottomMenu(globalVideosArray, i);
            drawVideoContent(globalVideosArray[i].attributes[3].nodeValue);
            drawOtherResources(globalVideosArray, i);
            drawSupplements(globalVideosArray, i);
        }
    }

    globalSessionsArray = readXMLSessions(ModulePath);
    $("#fullscreenDIV #mnMenu .sessions").html("");
    $("#normalDIV #mnMenu .sessions").html("");
    for (var i = 0; i < globalSessionsArray.length; i++) {
        drawModulesMenu(i, globalSessionsArray[i].attributes[0].nodeValue, globalSessionsArray[i].attributes[1].nodeValue, globalSessionsArray[i].getElementsByTagName("part"));
    }

    redrawBottomBar();
    redrawVideosGrid();
}

var mwPlayerContainer_html = "";
var iframeBodyMwPlayer_html = "";
var isVideoRunning = false;

HTML5VideoPlayer.prototype.initPlayer = function () {

    this.kWidget.featureConfig({
        'targetId': this.playerId,
        'wid': '_1038472', 
        'uiconf_id': '35960161',
        'entry_id': theSession["video"], 

        'flashvars': {
            'autoPlay': false,
            'mediaProxy': this.mediaProxy,
            'jsonConfig': this.jsonConfig,
            'EmbedPlayer.EnableFullscreen': false,
            'Kaltura.UseAppleAdaptive': false,
            'disableTrackElement': true,
            'IframeCustomPluginCss1': 'KalturaPlayer/css/kaltura_styles.css',
            'myPlugin': {
                'plugin': true,
                'iframeHTML5Js': 'KalturaPlayer/js/helper_libs.js',
                'iframeHTML5Js1': 'KalturaPlayer/js/helper_data.js',
                'iframeHTML5Js2': 'KalturaPlayer/libs/jquery.poshytip.min.js',
                "iframeHTML5Css": "KalturaPlayer/css/kaltura_styles.css" 
            },
            'closedCaptions': {
                'plugin': true,
                'whiteListLanguagesCodes': 'en',
                'useCookie': true,
                'defaultLanguageKey': 'en',
                'fontsize': 18,
                'bg' : '0x335544',
                'fontFamily' : 'Tahoma',
                'fontColor' : '0xFFFFFF',
                'useGlow' : 'false',
                'glowBlur': 4,
                'glowColor': '0x133693',
                'hideWhenEmpty':true,
                'layout': 'ontop',

            },
            'sourceSelector': {
                "plugin": true,
                "switchOnResize": false,
                "simpleFormat": true,
                'displayMode' : 'sizebitrate'
            },

        },
        'readyCallback': function (playerId) {

            window.myKdp = document.getElementById(playerId);

            var iframeBody = $("#player_ifp").contents().find("body");

            var seekToEndVideo;

            var iframeBodyMwPlayer = $("#player_ifp").contents().find("body").find('div[class*="mwPlayerContainer"]');

            iframeBodyMwPlayer.append($('#fullscreenDIV'));

            mwPlayerContainer_html = $('#fullscreenDIV');

            iframeBody.prepend(
                    '<div id="if_slideCurrentLarge" style="display:none;position: fixed;bottom: 151px;left: 25%;height: 366px;width: 512px;z-index: 1;background-color: transparent;background-size: 512px 366px;"></div>'
                    );
            iframeBody.prepend(
                    '<div id="if_slideCurrentSmall" style="display:none;position: fixed;bottom: 170px;right: 20px;height: 244px;width: 336px;z-index: 1;background-color: transparent;background-size: 336px 244px"></div>'
                    );

            myKdp.kBind('openFullScreen', function () {

                return 0;
            });

            myKdp.kBind('closeFullScreen', function () {
                return 0;

            });

            myKdp.kBind('doSeek', function () {

                if( isVideoRunning == false ) {
                    fixSeekPlay();
                }
            })

            myKdp.kBind('exitFullscreenAndMove', function (url) {
                changeVideo(url);
            });

            myKdp.kBind("playerUpdatePlayhead.myPluginName", function (data, id) {
                bindPlayerRunning(data, id);
            });
            
            

            myKdp.kBind('ccDataLoaded', function () {
            });
            myKdp.kBind('newClosedCaptionsData', function () {
            });
            myKdp.kBind('changedClosedCaptions', function (event) {
            });
            myKdp.kBind('closedCaptionsHidden', function () {
            });
            myKdp.kBind('ccDisplayed', function (event) {
            });

            myKdp.kBind('volumeChanged', function (e) {
                var newVolume = parseFloat(e.newVolume);
                if( newVolume != 0.01 ) {
                    globalCurrentVolume = newVolume;
                }
                
            });


            myKdp.kBind('doPlay', function () {
                isVideoRunning = true;

                if (seekToEndVideo) {
                    seekToEndVideo = false;
                    if (myKdp.evaluate("{video.player.currentTime}") >= myKdp.evaluate("{duration}")) {
                        myKdp.sendNotification("doSeek", 0);
                    }
                }

                if( globalSlideMode != 1 )
                    normalChangeSlideModeMenu( globalSlideMode );

                 fixIpad_RemoveVideoBG();   
            });

            myKdp.kBind('doPause', function () {
                isVideoRunning = false;
            });

            myKdp.kBind('doStop', function () {
                isVideoRunning = false;
                if (seekToEndVideo == false) {
                    seekToEndVideo = true;
                    myKdp.sendNotification("doSeek", myKdp.evaluate("{duration}"));
                }
            });

            myKdp.kBind('playerPlayEnd', function () {
                myKdp.sendNotification("doPause");
                seekToEndVideo = false;
                isVideoRunning = false;
            });


            initFullscreenMode();
            hideShowNormalSlidesArrows();

            InitToRun(myKdp);
        }
    });
};

function fixSeekPlay() { 
    return;
    if( isVideoRunning == false ) {
        setTimeout(function () {
            fixSeekPlay();            
        }, 500);
    }else {
        setTimeout(function () {
            myKdp.sendNotification("doPause");
        }, 600);    
    }

}
function initFullscreenMode() {
    if ($("#fullscreenDIV") == null) {
        setTimeout(function () {
            initFullscreenMode();
        }, 500);
    } else {
        if(DEVICE_PLATFORM == "iphone"){
            $(".full2").hide();

        }
    }

}

var currentSlide = 0;
var currentSlideUrl = "";
var duration_second = 0;

function drawSlidePointsDuration() {
    if (duration_second != 0)
        return;

    $("#slidePointsDuration").text("");

    var duration_item = $("#player_ifp").contents().find("body").find('div[class*="durationLabel"]');
    var duration_str = duration_item[0].innerText.replace("/", "").trim();
    var duration_array = duration_str.split(":");

    if (duration_array.length <= 2)
        duration_second = parseInt(duration_array[0]) * 60 + parseInt(duration_array[1]);
    else
        duration_second = parseInt(duration_array[0]) * 60 * 60 + parseInt(duration_array[1]) * 60 + parseInt(duration_array[2]);

    if (duration_second != 0) {
        for (var i = 0; i < globalSlidesArray.length; i++) {
            var point = convertHHMMSStoSeconds(globalSlidesArray[i].attributes[1].nodeValue);
            $("#slidePointsDuration").append("<a title='Move to slide' href=\"javascript:moveToSlide( '','" + globalSlidesArray[i].attributes[1].nodeValue + "',"+ i +")\"><div style='background: #ffdd83;position: absolute;left: " + Math.floor(1024 * point / duration_second) + "px; bottom: -33px;width: 2px;height: 9px;z-index:0'></div></a>");
        }



    }
}

function bindPlayerRunning(data, id) {
    isVideoRunning = true;

    globalPlayingSecond = data;

    var globalIsFisrtRunning = readCookie("globalIsFisrtRunning");
    if (globalIsFisrtRunning == "0") 
        createCookie("globalIsFisrtRunning", "1", 1);

    drawSlidePointsDuration();

    for (i = 0; i < globalSlidesArray.length; i++) {
        var timeLeft = convertHHMMSStoSeconds(globalSlidesArray[i].attributes[1].nodeValue);
        var timeRight = 1000000; 
        if( (globalSlidesArray.length > 1) && (i + 1 < globalSlidesArray.length) ) 
            timeRight = convertHHMMSStoSeconds(globalSlidesArray[i + 1].attributes[1].nodeValue);

        var slide_ok = false;
        if( globalSlidesArray.length > 1 )
            if (data >= timeLeft && data <= timeRight)
                slide_ok = true;
        if( globalSlidesArray.length == 1 )
            if( timeLeft == 0 )    
                slide_ok = true;
            else {
                timeRight = 1000000;
                if (data >= timeLeft && data <= timeRight)
                    slide_ok = true;
            }

        if (slide_ok == true) {
            currentSlide = i;
            currentSlideUrl = "Data" + "/" + theSession.module + "/" + theSession.session + "/" + globalSlidesArray[i].attributes[2].nodeValue;
            break;
        }
    }

    refreshSlides();
}

function refreshSlides() {
    var iframe = $("#player_ifp").contents().find("body").find('div[id=fullscreenDIV]');
    var iframe_slides = iframe.contents().find('div[id=slides]');
    iframe_slides.find("img").css("border-color", "#FFF");
    iframe_slides.find("img[id=slide_" + currentSlide + "]").css("border-color", "#3EBEDB");

    $("#normalDIV #slides img").css("border-color", "#FFF");
    $("#normalDIV #slides img#slide_" + currentSlide).css("border-color", "#3EBEDB");

    iframe.find('div[id=slideCurrentSmall]').css({
        "background": "url('" + currentSlideUrl + "')",
        "background-size": iframe.find('div[id=slideCurrentSmall]').width() + "px " + iframe.find('div[id=slideCurrentSmall]').height() + "px"
    });

    iframe.find('div[id=slideCurrentLarge]').css({
        "background": "url('" + currentSlideUrl + "')",
        "background-size": iframe.find('div[id=slideCurrentLarge]').width() + "px " + iframe.find('div[id=slideCurrentLarge]').height() + "px"
    });

    var if_slideCurrentLarge = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentLarge]');
    if_slideCurrentLarge.css({
        "background": "url('" + currentSlideUrl + "')",
        "background-size": if_slideCurrentLarge.width() + "px " + if_slideCurrentLarge.height() + "px"
    });

    var if_slideCurrentSmall = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentSmall]');
    if_slideCurrentSmall.css({
        "background": "url('" + currentSlideUrl + "')",
        "background-size": if_slideCurrentSmall.width() + "px " + if_slideCurrentSmall.height() + "px"
    });
}

function bindOnFullscreen(action) {
    var iframe = $("#player_ifp").contents().find("body").find('div[id=fullscreenDIV]');

    var iframe_video = $("#player_ifp").contents().find("body").find('div[class=videoDisplay]');
    iframe_video.css({
        "width": "90%",
        "height": "90%",
        "left": "5%"
    });

    var slideMode = readCookie("slidemode");

    if (action == "open") {
        iframe.css("display", "inline");
        createCookie("fullscreen", "true", 1);

        if (slideMode != null)
            setTimeout(function () {
            }, 300);
    } else
    if (action == "close") {
        iframe.css("display", "none");
        createCookie("fullscreen", "false", 1);
        if (slideMode != null) {
            setTimeout(function () {
                $(".fullscreen .videoDisplay #player").show();
                normalChangeSlideMode(slideMode);
            }, 500);
        }
    }
    bottomBarContent(0);
}



