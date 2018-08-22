 var globalSlidesArray = null;
 var globalRelateArray = null;
 var globalSlidesPageCurrent = 0;
 var globalResourcesArray = null;
 var globalSupplementsArray = null;
 var globalSlideMode = 1;
 var globalVideosArray = null;
 var globalSlideIndex = 0;

 var globalStandardSlideWidth = 0;
 var globalStandardSlideHeight = 0;

function moveToSlide(slideId, second, slideDivIndex) {
    normalDoSeek(slideId, second);

    $("#normalDIV .rightMenu .content .slide img").css("border-color", "#fff");
    $("#normalDIV .rightMenu .content .slide img#slide_" + slideDivIndex).css("border-color", "rgb(62, 190, 219)");
}


 function normalDoSeek(slideId, second) {
    myKdp.sendNotification("doSeek", convertHHMMSStoSeconds(second));
}

function normalOpenVideosGrid() {
    $("#normalDIV .videosGrid").toggle();
    $("#normalDIV .videosGridOverlay").toggle();
}

function hideShowNormalSlidesArrows() {
    if( globalSlideIndex == 0 )
        $("#btnUpSlides").hide();
    else 
        $("#btnUpSlides").show();
    if( globalSlideIndex + 3 >= globalSlidesArray.length )
        $("#btnDownSlides").hide();
    else 
        $("#btnDownSlides").show();
}

function normalSlidesDoUp() {
    if (globalSlidesArray == null)
        globalSlidesArray = readXMLCuepoints(globalXMLSlidesPath);

    if( globalSlideIndex <= 0)
        return;

    globalSlideIndex --;

    $("#normalDIV #slides").html("");
    for (i = globalSlideIndex; i < globalSlideIndex + 3; i++) 
        drawNormalSlide(i, globalSlidesArray[i].attributes[0].nodeValue, globalSlidesArray[i].attributes[1].nodeValue, globalSlidesArray[i].attributes[2].nodeValue);

    hideShowNormalSlidesArrows();
}

function normalSlidesDoDown() {

    if (globalSlidesArray == null)
        globalSlidesArray = readXMLCuepoints(globalXMLSlidesPath);

    if( globalSlideIndex + 3 > globalSlidesArray.length )
        return;

    $("#normalDIV #slides").html("");
    globalSlideIndex ++;
    for (i = globalSlideIndex; i < globalSlideIndex + 3; i++) 
        if( i < globalSlidesArray.length ) 
            drawNormalSlide(i, globalSlidesArray[i].attributes[0].nodeValue, globalSlidesArray[i].attributes[1].nodeValue, globalSlidesArray[i].attributes[2].nodeValue);

    hideShowNormalSlidesArrows();    
}

function normalChangeResoureTab(tab_index) {
    $("#normalDIV .rightMenu #tab_content_1").hide();
    $("#normalDIV .rightMenu #tab_content_2").hide();
    $("#normalDIV .rightMenu #tab_content_0").hide();
    $("#normalDIV .rightMenu #tab_content_" + tab_index).show();

    $("#normalDIV .rightMenu #tab_1").removeClass("active");
    $("#normalDIV .rightMenu #tab_2").removeClass("active");
    $("#normalDIV .rightMenu #tab_0").removeClass("active");
    $("#normalDIV .rightMenu #tab_" + tab_index).addClass("active");
}

function normalChangeSlideModeNext() {
    if( globalSlideMode == null)
        globalSlideMode = 1;

    if( globalSlideMode <= 3 )
        globalSlideMode = globalSlideMode + 3;
    else
        globalSlideMode = globalSlideMode - 3;

    globalSlideMode = globalSlideMode % 7;

    normalChangeSlideMode(globalSlideMode);


}

var normalModeB_Video_left = -1;
var normalModeB_Video_top = -1;
var normalModeB_Video_width = -1;
var normalModeB_Video_height = -1;
var normalModeB_Slide_left = -1;
var normalModeB_Slide_top = -1;
var normalModeB_Slide_width = -1;
var normalModeB_Slide_height = -1;

function normalChangeSlideMode_AB( mode ) {
    var if_slideCurrentSmall = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentSmall]');
    if_slideCurrentSmall.show();
    var iframe_video = $("#player_ifp").contents().find("body").find('div[class=videoDisplay]');

    var iframeBody = $("#player_ifp").contents().find("body");
    var iframeBodyMwPlayer = $("#player_ifp").contents().find("body").find('div[class*="videoHolder"]');
    iframeBodyMwPlayer.css('background-color', "#000");

    if( normalModeB_Video_width == -1) {
        var iframe_video_position = iframe_video.position();
        if( iframe_video_position != null ) {
            normalModeB_Video_left = iframe_video_position.left;
            normalModeB_Video_top = iframe_video_position.top;
            normalModeB_Video_width = iframe_video.width();
            normalModeB_Video_height = iframe_video.height();
        }

        var slide_position = if_slideCurrentSmall.position();
        if( slide_position != null ) {
            normalModeB_Slide_left = slide_position.left;
            normalModeB_Slide_top = slide_position.top;
            normalModeB_Slide_width = if_slideCurrentSmall.width();
            normalModeB_Slide_height = if_slideCurrentSmall.height();
        }
    }

    if_slideCurrentSmall.show();
    iframe_video.show();

    if( mode == 2) {
        if_slideCurrentSmall.css("left", normalModeB_Slide_left);
        if_slideCurrentSmall.css("top", normalModeB_Slide_top);
        if_slideCurrentSmall.css("width", normalModeB_Slide_width);
        if_slideCurrentSmall.css("height", normalModeB_Slide_height);

        iframe_video.css("left", normalModeB_Video_left );
        iframe_video.css("top", normalModeB_Video_top );
        iframe_video.css("width", normalModeB_Video_width );
        iframe_video.css("height","100%" );
        iframe_video.css("z-index", 0);
    }else
    if( mode == 5)
    {
        iframe_video.css("left", normalModeB_Slide_left);
        iframe_video.css("top", normalModeB_Slide_top);
        iframe_video.css("width", normalModeB_Slide_width);
        iframe_video.css("height", normalModeB_Slide_height);
        iframe_video.css("z-index", 100);
        if_slideCurrentSmall.css("top", 50 );
        if_slideCurrentSmall.css("height", 565 );

        var slideWidth = normalModeB_Video_width - 172;
        var slideLeft = normalModeB_Video_left + 172 / 2;
        if( globalStandardSlideWidth != null )
        if( globalStandardSlideWidth > 0 ) {
            slideWidth = globalStandardSlideWidth * ( 565 / globalStandardSlideHeight );
            slideLeft = slideLeft + ((normalModeB_Video_width - 172) - slideWidth) / 2;
        }
        if_slideCurrentSmall.css("left", slideLeft );
        if_slideCurrentSmall.css("width", slideWidth); 
        
        iframeBodyMwPlayer.css('background-color', "#EEE");

    }else
    if( mode == 1)
    {
        if_slideCurrentSmall.hide();
        iframe_video.css("left", normalModeB_Video_left );
        iframe_video.css("top", normalModeB_Video_top );
        iframe_video.css("width", normalModeB_Video_width );
        iframe_video.css("height", "100%" );
    }else
    if( mode == 4)
    {
        iframe_video.hide();
        
        if_slideCurrentSmall.css("top", 50 );
        if_slideCurrentSmall.css("height", 565 );
        
        var slideWidth = normalModeB_Video_width - 172;
        var slideLeft = normalModeB_Video_left + 172 / 2;
        if( globalStandardSlideWidth != null )
        if( globalStandardSlideWidth > 0 ) {
            slideWidth = globalStandardSlideWidth * ( 565 / globalStandardSlideHeight );
            slideLeft = slideLeft + ((normalModeB_Video_width - 172) - slideWidth) / 2;
        }
        if_slideCurrentSmall.css("left", slideLeft );
        if_slideCurrentSmall.css("width", slideWidth); 
        iframeBodyMwPlayer.css('background-color', "#EEE");

    }
}



function normalChangeSlideMode_C( mode ) {


    var iframe_video = $("#player_ifp").contents().find("body").find('div[class=videoDisplay]');
    var iframe_largeBtn = $("#player_ifp").contents().find("body").find('a[data-plugin-name=largePlayBtn]');

    var iframeBody = $("#player_ifp").contents().find("body");
    var iframeBodyMwPlayer = $("#player_ifp").contents().find("body").find('div[class*="videoHolder"]');
    iframeBodyMwPlayer.css('background-color', "#000");


    var split_height = 281; 
    var split_width = 375; 
    var split_left = (1024 - split_width) / 2;
    iframe_video.show();

    if( mode == 3 ) {
        iframe_video.css({
            "width": split_width + "px",
            "height": split_height + "px",
            "left": split_left + "px",
            "top": $(".topMenu").height() + "px"
        });

        var slideWidth = split_width;
        var slideLeft = split_left;
        if( globalStandardSlideWidth != null )
        if( globalStandardSlideWidth != 0) {
            slideWidth = globalStandardSlideWidth * ( split_height / globalStandardSlideHeight );
            slideLeft = slideLeft + (split_width - slideWidth) / 2;
        }

        var if_slideCurrentLarge = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentLarge]');
        if_slideCurrentLarge.css({
            "width": slideWidth + "px",
            "height": split_height + "px",
            "left": slideLeft + "px",
            "background-size": (slideWidth + "px " + split_height + "px")
        });
    }else 
    if( mode == 6 ){

        var slideWidth = split_width;
        var slideLeft = split_left;
        if( globalStandardSlideWidth != null )
        if( globalStandardSlideWidth != 0) {
            slideWidth = globalStandardSlideWidth * ( split_height / globalStandardSlideHeight );
            slideLeft = slideLeft + (split_width - slideWidth) / 2;
        }

        iframe_video.css({
            "width": slideWidth + "px",
            "height": split_height + "px",
            "left": slideLeft + "px",
            "top": $(".topMenu").height() + "px"
        });

        var if_slideCurrentLarge = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentLarge]');
        if_slideCurrentLarge.css({
            "width": split_width + "px",
            "height": split_height + "px",
            "left": split_left + "px",
            "background-size": (split_width + "px " + split_height + "px")
        });
    }

    if_slideCurrentLarge.show();

    iframe_largeBtn.css({
        "top": "25%"
    });

    if( mode == 3) {
        iframe_video.css("top", 50 );
        if_slideCurrentLarge.css("top", split_height + 55);        

    }else
    if( mode == 6) {
        iframe_video.css("top", split_height + 55 );
        if_slideCurrentLarge.css("top", 50);

    }



}
function normalChangeSlideModeMenu(mode) {
    if( globalSlideMode == 1 ) {
        switch (mode) {
            case 1: mode = 0;break;
            case 2: mode = 2;break;
            case 3: mode = 3;break;
        }
    }
    if( globalSlideMode == 2 ) {
        switch (mode) {
            case 1: mode = 1;break; 
            case 2: mode = 0;break;
            case 3: mode = 3;break;
        }
    }
    if( globalSlideMode == 3 ) {
        switch (mode) {
            case 1: mode = 1;break;
            case 2: mode = 2;break;
            case 3: mode = 0;break;
        }
    }
    if( globalSlideMode == 4 ) {
        switch (mode) {
            case 1: mode = 0;break;
            case 2: mode = 5;break;
            case 3: mode = 6;break;
        }
    }
    if( globalSlideMode == 5 ) {
        switch (mode) {
            case 1: mode = 4;break;
            case 2: mode = 0;break;
            case 3: mode = 6;break;
        }
    }
    if( globalSlideMode == 6 ) {
        switch (mode) {
            case 1: mode = 4;break;
            case 2: mode = 5;break;
            case 3: mode = 0;break;
        }
    }
    if( mode != 0)
        normalChangeSlideMode(mode);
}

function setSlideModeScreen( mode ) {
    var iframe_video = $("#player_ifp").contents().find("body").find('div[class=videoDisplay]');
    var iframe_largeBtn = $("#player_ifp").contents().find("body").find('a[data-plugin-name=largePlayBtn]');

    var if_slideCurrentLarge = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentLarge]');
    if_slideCurrentLarge.hide();
    
    var if_slideCurrentSmall = $("#player_ifp").contents().find("body").find('div[id=if_slideCurrentSmall]');
    if_slideCurrentSmall.hide();

    iframe_video.css({
        "width": "100%",
        "height": "100%",
        "left": "0"
    });
    iframe_largeBtn.css({
        "top": "50%"
    });

    if (mode == 1 || mode == 4 || mode == 2 || mode == 5) {
        normalChangeSlideMode_AB(mode);
    }
    if (mode == 3 || mode == 6) {
        normalChangeSlideMode_C(mode);
    }

    refreshSlides();
    createCookie("slidemode", mode, 1);
    createCookie("globalSlideMode", mode, 1);
}

function normalChangeSlideMode(mode) {

    globalSlideMode = mode;
    createCookie("globalSlideMode", mode, 1);

    $("#normalDIV #panelOption2 img").removeClass("active");

    $("#normalDIV #panelOption2 .img" + mode).addClass("active");
    $("#normalDIV .panel").hide();
    $("#normalDIV #panelOption2").hide();

    setSlideModeScreen( globalSlideMode );

}

function initWhenRealReady() {
    
    var iframe_controlBarContainer = $("#player_ifp").contents().find("body").find('div[class*=controlBarContainer]');
    iframe_controlBarContainer.css("margin-bottom", "114px");
    iframe_controlBarContainer.css("z-index", 101);

    var iframe_cc = $("#player_ifp").contents().find("body").find('div[data-plugin-name*=closedCaptions]');
    iframe_cc.css("margin-bottom", "114px");

    window.myKdp.sendNotification("changeVolume", globalCurrentVolume);
    fixUI_videoHolder();
    fixUI_captionOverlay();

    $("#loading").hide();    

    if(__fullscreenMode == true) {
        hideBottomBar();
    }
}


var countWaitToStopVideo = 0;

function waitToStopVideo(myKdp) {
        if( DEVICE_PLATFORM == "android" ) { 
            initWhenRealReady();            
            return;
        }

        myKdp.sendNotification("doPause");
        setTimeout(function () {
            initWhenRealReady();            
        }, 100);


    fixIpad_InitVideo();
    fixUI_controlBar();
    fixUI_caption();


    setTimeout(function () {
        fixUI_loopForever();
    }, 2000);
}




function InitToRun(myKdp) {

    setTimeout(function() {
        fixUI_StandardSlideSize();
    }, 300);

    if(DEVICE_PLATFORM == "iphone")  {
        return;
    }

    if( DEVICE_PLATFORM == "android" ) { 

        setTimeout(function () {                        
            initWhenRealReady();            
        }, 100);

        fixAndroid_InitVideo();

        setTimeout(function () {
            myKdp.sendNotification("doStop");  
        }, 2000);

        setTimeout(function () {
            fixUI_loopForever();
        }, 1800);

        return;
    }

    if( globalPlayingSecond <= 0 ) {       
        
        setTimeout(function () {
            myKdp.sendNotification("changeVolume", 0.01);

            setTimeout(function () {
                setTimeout(function () {
                    waitToStopVideo(myKdp);
                }, 100);
            }, 400);

        }, 200);
        
    }
    
}


$(function () {

    $("#normalDIV .miniPanel").click(function () {
        $("#normalDIV .panel").show();
    });

    $("#normalDIV .videoPanel").click(function () {
        $(".bottomBar").toggle();
        
    });

    $("#normalDIV .panel .title").click(function () {
        $("#normalDIV .panel").hide();
    });

    $("#normalDIV .btSlideMode .switchMode").click(function () {

        globalSlideMode = parseInt(readCookie("slidemode"));
        normalChangeSlideModeNext();
    });

    $("#normalDIV .btSlideMode .setting").click(function () {
        $("#normalDIV #panelOption2").toggle();
    });

    $("#normalDIV .videosGridOverlay").click(function () {
        $("#normalDIV .videosGrid").toggle();
        $("#normalDIV .videosGridOverlay").toggle();
    });

});