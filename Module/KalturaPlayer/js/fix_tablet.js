function fixIpad_RemoveVideoBG() {

    if (DEVICE_PLATFORM == "ipad") {
        var iframe_video = $("#player_ifp").contents().find("body").find('div[id=player]');
        iframe_video.css("background-image", "initial");
    }
}

function fixIpad_InitVideo() {

    if (DEVICE_PLATFORM == "ipad") {
        setTimeout(function () {

            var iframe_controlBarContainer = $("#player_ifp").contents().find("body").find('div[class*=controlBarContainer]');
            iframe_controlBarContainer.css("margin-bottom", "114px");

            var thumbSlicesUrl = "https://cdnsecakmi.kaltura.com/p/243342/sp/24334200/thumbnail/entry_id/" + theSession.video + "/version/100003/width/800";

            var iframe_video = $("#player_ifp").contents().find("body").find('div[id=player]');
            iframe_video.css("background-image", "url('" + thumbSlicesUrl + "')");
            iframe_video.css("background-size", iframe_video.width() + "px auto ");
            iframe_video.css("background-position", "center center");
            iframe_video.css("background-repeat", "no-repeat");

            $("#loading").hide();
        }, 1000);
    }

}

function fixAndroid_InitVideo() {
    if (DEVICE_PLATFORM == "android") {
        setTimeout(function () {
            fixUI_controlBar();
            fixUI_caption();
        }, 1000);
    }

}