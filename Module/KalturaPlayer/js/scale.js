var __fullscreenMode = false;

$.fn.scale = function (x) {
    $(this).data({
        'originalWidth': $(this).width(),
        'originalHeight': $(this).height()});


    if(isChrome || !__fullscreenMode)
        var left = (($(window).width() - 1024 * x) / 2) + 0;
    else
        var left = ((screen.width - 1024 * x) / 2) + 0;
    var top = 0;

    $(this).css({
        'transform': 'scale(' + x + ')',
        '-ms-transform': 'scale(' + x + ')',
        '-moz-transform': 'scale(' + x + ')',
        '-webkit-transform': 'scale(' + x + ')',
        'transform-origin': 'left top',
        '-ms-transform-origin': 'left top',
        '-moz-transform-origin': 'left top',
        '-webkit-transform-origin': 'left top',
        'position': 'absolute',
        'top': (top + 'px'),
        'left': (left + 'px'),
    });
    $(this).parent()
            .width($(this).data('originalWidth') * x)
            .height($(this).data('originalHeight') * x);
    return $(this);
};

document.cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;

function doExitFullscreen(docElm) {
    if (docElm.cancelFullScreen) {
        docElm.cancelFullScreen();
    } else if (docElm.mozCancelFullScreen) {
        docElm.mozCancelFullScreen();
    } else if (docElm.webkitCancelFullScreen) {
        docElm.webkitCancelFullScreen();
    }

}

var contextScaleRatio = screen.height / 768;
var lastPortletMainIframeHeight = 0;

if (deploy_env == "ctools") {
    lastPortletMainIframeHeight = window.parent.document.getElementsByClassName("portletMainIframe")[0].height;
}

function hideBottomBar() {
    $('#footer').hide();
    $('.bottomBar').hide();
    $('#videoContent').hide();    
    $('#normalDIV .videosButton').show();
    $(".btSlideMode").css("bottom", "6px");
    $(".bottomBar").css("bottom", "70px");
    $("#slidePointsDuration").css("top", "706px");

    var iframe_videoHolder = $("#player_ifp").contents().find("body").find('div[class*=videoHolder]');
    iframe_videoHolder.css("height", "100%");  

    var iframe_controlBarContainer = $("#player_ifp").contents().find("body").find('div[class*=controlBarContainer]');
    iframe_controlBarContainer.css("margin-bottom", "0px");
}

function showBottomBar() {
    $('#footer').show();
    $('.bottomBar').show();
    $(".bottomBar").css("bottom", "0px");
    $('#videoContent').show();    
    $('#normalDIV .videosButton').hide();
    $(".btSlideMode").css("bottom", "120px");
    $("#slidePointsDuration").css("top", "592px");
    $('#normalDIV .videosButton').css("right", "-4px");
    $('#normalDIV .rightMenu').css("right", "-4px");



    var iframe_videoHolder = $("#player_ifp").contents().find("body").find('div[class*=videoHolder]');
    iframe_videoHolder.css("height", "610px");  

    var iframe_controlBarContainer = $("#player_ifp").contents().find("body").find('div[class*=controlBarContainer]');
    iframe_controlBarContainer.css("margin-bottom", "114px");
}

function exitFullScreen() {

    var docElm = getExitFullscreenElm();
    try {
        doExitFullscreen(docElm);
    } catch (err) {
        console.log("error:" + err.message);
    }

    
    // TAM THOI
    try {
        var docElm2levels = getExitFullscreenElm2levels();
        if (docElm2levels != "")
            doExitFullscreen(docElm2levels);
    } catch (err) {
        console.log("error:" + err.message);
    } 

    showBottomBar();
    $("#wrap").scale(1);
    $("#wrap").css("background", "#FFF");

    $("#wrap").removeAttr('style');
    $(".scaleContainer").removeAttr('style');

    $("body").css("overflow", "initial");

    if (deploy_env == "ctools") {
        window.parent.document.getElementsByClassName("portletMainIframe")[0].contentWindow.document.body.style.background = "#FFF";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].height = lastPortletMainIframeHeight + "px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginTop = "0px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginLeft = "5px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginRight = "5px";
    }
    
}

function invertFullScreen() {
    if (__fullscreenMode == false) {
        fullScreen();
    } else {
        exitFullScreen();
    }
}


function doFullScreen(docElm) {
    var isInFullScreen = (docElm.fullScreenElement && docElm.fullScreenElement !== null) || 
            (docElm.mozFullScreen || docElm.webkitIsFullScreen);
    if( DEVICE_PLATFORM == "ipad") {        
        return;

    }

    if (!isInFullScreen) {

        if (deploy_env == "")
            docElm = docElm.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        $("body").css("overflow", "hidden");
    }
}

function scaleFullScreen() {
    if(isChrome) {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
    }
    else{
        var screenWidth = screen.width;
        var screenHeight = screen.height;

    }
    hideBottomBar();
    if (screenWidth > screenHeight) {
        $("#wrap").scale(screenHeight / ($("#wrap").height()));
        $('#normalDIV .videosButton').css("right", "-4px");

    }

    else {
        $("#wrap").scale(screenWidth /  ($("#wrap").width()));
        $("#wrap").css("top", "50%");
        $('#normalDIV .rightMenu').css("right", "5px");
        $('#normalDIV .videosButton').css("right", "5px");

    }
    $("#wrap").css("position", "absolute");
    $("#wrap").css("background", "#000");
}

function scaleVideoWrapper() {

    if (window.innerWidth > window.innerHeight) { 
        $("#wrap").scale(window.innerHeight / ($("#wrap").height()));

    }

    else {
        $("#wrap").scale(window.innerWidth /  ($("#wrap").width() + 8));
        $("#wrap").css("left", 0);
    }

}

function fullScreen() {

    var docElm = getFullscreenElm();

    try {
        doFullScreen(docElm);
    } catch (err) {
        console.log("error:" + err.message);
    }
        
        // TAM THOI
    try {
        var docElm2levels = getFullscreenElm2levels();
        if (docElm2levels != "")
            doFullScreen(docElm2levels);
    } catch (err) {
        console.log("error:" + err.message);
    }

    hideBottomBar();
    scaleFullScreen();

    if (deploy_env == "ctools") {
        window.parent.document.getElementsByClassName("portletMainIframe")[0].contentWindow.document.body.style.background = "#000";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].height = "1060px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginTop = "-19px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginLeft = "-7px";
        window.parent.document.getElementsByClassName("portletMainIframe")[0].style.marginRight = "-7px";
    }  
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        if (__fullscreenMode == true)
            exitFullScreen();
    }
});


if (deploy_env == "ctools") {
    var docElm2levels = window.parent.document;
    docElm2levels.addEventListener("keyup", function (e) {
        if (e.keyCode == 27) {
            exitFullScreen();
        }
    });
    

}


$(window.parent.window.parent.document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e)
{
    __fullscreenMode = !__fullscreenMode;
    if( __fullscreenMode == false )
        exitFullScreen();
    else
        scaleFullScreen();

   
});


$("#player_ifp").dblclick(function () {
    invertFullScreen();
});

$(".full2").click(function () {
    invertFullScreen();
});

