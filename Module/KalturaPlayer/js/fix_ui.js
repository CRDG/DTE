var title = $("#pageTitle").text();

if( title.length <= 55 ) {
    $("#pageTitle").css("padding-top", "18px");
}

var iframe_icon_cog = null;

function fixUI_captionOverlay() {
    var iframe_captionsOverlay = $("#player_ifp").contents().find("body").find('div[class*=captionsOverlay]');

    if( iframe_captionsOverlay.height() != 120 ) {
        iframe_captionsOverlay.css("bottom", "40px");
        iframe_captionsOverlay.css("margin", "20px");        
        iframe_captionsOverlay.css("z-index", "100000");
    }
}


function fixUI_controlBar() {

    var iframe_controlBarContainer = $("#player_ifp").contents().find("body").find('div[class*=controlBarContainer]');
    iframe_controlBarContainer.css("margin-bottom", "114px");

	var iframe_sourceSelector = $("#player_ifp").contents().find("body").find('div[class*=sourceSelector]');
    iframe_sourceSelector.css("margin-right", "110px");

    var iframe_body = $("#player_ifp").contents().find("body");
    iframe_body.append('<style type="text/css"> .icon-cog:before { content: url(KalturaPlayer/images/resolution-fix.png) !important; }; </style>');


    fixUI_captionOverlay();

}

function fixUI_caption() {
    myKdp.sendNotification( 'hideClosedCaptions' );
    myKdp.sendNotification( 'showClosedCaptions' );
}

function fixUI_videoHolder() {
    var iframe_videoHolder = $("#player_ifp").contents().find("body").find('div[class*=videoHolder]');
        iframe_videoHolder.css("height", "90%");        

    if( globalSlideMode == 1 || globalSlideMode == 2 ) {
        var iframe_videoHolder = $("#player_ifp").contents().find("body").find('div[class*=videoDisplay]');
        if( iframe_videoHolder.height() != "100%" ) { 
            iframe_videoHolder.css("height", "100%");        
        }
    }


}


function fixUI_loopForever() {
    fixUI_videoHolder();
    fixUI_captionOverlay();

    setTimeout(function () {
        fixUI_loopForever();
    }, 200);
}

function fixUI_StandardSlideSize() {
    if( globalStandardSlideWidth == 0 ) {
        if( globalSlidesArray.length > 0 ) {
            getStandardSlideMeta( "Data/" + theSession["module"] + "/" + theSession["session"] + "/" + globalSlidesArray[0].attributes[2].nodeValue);
        }
    }
}

function getStandardSlideMeta(url){
    $("<img/>",{
        load : function(){ globalStandardSlideWidth = this.width; globalStandardSlideHeight = this.height; },
        src  : url
    });
}
