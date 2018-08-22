var theSession = {
    module: "Module1",
    session: "Session1",
    part: "Part1",
    video: ""
}

var DEVICE_PLATFORM = "";
var lastButtonBarIndex = -1;

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (navigator.vendor != null && navigator.vendor.match(/Apple Computer, Inc./) && navigator.userAgent.match(/iPhone/i) || (navigator.userAgent.match(/iPod/i)))
    DEVICE_PLATFORM = "iphone";
else if (navigator.vendor != null && navigator.vendor.match(/Apple Computer, Inc./) && navigator.userAgent.match(/iPad/i))
    DEVICE_PLATFORM = "ipad";
else if (navigator.vendor != null && navigator.vendor.match(/Apple Computer, Inc./) && navigator.userAgent.indexOf('Safari') != -1)
    DEVICE_PLATFORM = "safari";
else if (navigator.vendor == null || navigator.vendor != null) {
    DEVICE_PLATFORM = "other";
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; 
    if (isAndroid) {
        DEVICE_PLATFORM = "android";
    }
}



function drawFullscreenSlide(index, node_id, node_time, node_image) {
    $("#fullscreenDIV #slides").append(
        '<div class="slide" id="' + node_id + '">' +
        '<div class="index">' + (index + 1) + '</div>' +
        '<a href="javascript:fullscreenDoSeek( \'' + node_id + '\',\'' + node_time + '\')"><img id="slide_' + index + '" src="Data/' + theSession["module"] + "/" + theSession["session"] + "/" + node_image + '"></a>' +
        '</div>'
    );
}

function drawNormalSlide(index, node_id, node_time, node_image) {


    $("#normalDIV #slides").append(
        '<div class="slide" id="' + node_id + '">' +
        '<div class="index">' + (index + 1) + '</div>' +
        '<a href="javascript:moveToSlide( \'' + node_id + '\',\'' + node_time + '\',' + index + ')"><img id="slide_' + index + '" src="Data/' + theSession["module"] + "/" + theSession["session"] + "/" + node_image + '"></a>' +
        '</div>'
    );
}

var globalOtherResourcePoint = 0;

function drawOtherResources(videosArray, indexSelected) {

    globalResourcesArray = videosArray[indexSelected].getElementsByTagName("resource");

    $("#fullscreenDIV #otherResources").html("");
    $("#normalDIV #otherResources").html("");

    for (i = globalOtherResourcePoint; i < globalOtherResourcePoint + 5; i++) {
        if (globalResourcesArray[i] != null)
            if (i < globalResourcesArray.length)
                drawOtherResourcesItem(i, globalResourcesArray[i].attributes[0].nodeValue, globalResourcesArray[i].attributes[1].nodeValue, globalResourcesArray[i].attributes[2].nodeValue);
    }

    if (globalResourcesArray.length > 0) {
        $(".btnUpResource").show();
        $(".btnDownResource").show();
        if (globalOtherResourcePoint == 0)
            $(".btnUpResource").hide();

        if (globalOtherResourcePoint + 5 == globalResourcesArray.length)
            $(".btnDownResource").hide();

    } else {
        $(".btnUpResource").hide();
        $(".btnDownResource").hide();
    }

    if (globalResourcesArray.length <= 5) {
        $(".btnUpResource").hide();
        $(".btnDownResource").hide();
    }

}

function drawOtherResourcesItem(index, node_id, node_name, node_src) {

    var extension = node_src.substring(node_src.length - 3, node_src.length);
    var img = 'KalturaPlayer/images/doc.png';
    if (extension.toUpperCase() == "PDF")
        img = 'KalturaPlayer/images/pdf.png';
    if (extension.toUpperCase() == "DOC" || extension.toUpperCase() == "OCX")
        img = 'KalturaPlayer/images/docx.png';
    if (extension.toUpperCase() == "VID")
        img = 'KalturaPlayer/images/video.png';
    if (extension.toUpperCase() == "PNG" || extension.toUpperCase() == "JPG" || extension.toUpperCase() == "GIF")
        img = 'KalturaPlayer/images/slide.png';

    var node_full_name = node_name;
    node_name = my_substring(node_name, 75);

    var html = '<div class="resource_item" id="' + node_id + '">' +
        '<img src="' + img + '">' +
        '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" target=_blank href="Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '">' + node_name + '</a>' +
        '</div>';

    if (extension.toUpperCase() == "VID") {
        var video_id = node_src.substring(0, node_src.length - 4);
        var active = "";
        if (video_id == theSession.video)
            active = " active";
        html = '<div class="resource_item ' + active + '" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:changeVideo(\'' + theSession.module + '/' + theSession.session + '/' + theSession.part + '/' + video_id + '\')">' + node_name + '</a>' +
            '</div>';
    }

    if (extension.toUpperCase() == "PDF") {
        html = '<div class="resource_item" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:showPDF(\'Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '\')">' + node_name + '</a>' +
            '</div>';
    }

    if (extension.toUpperCase() == "PNG" || extension.toUpperCase() == "JPG" || extension.toUpperCase() == "GIF") {
        html = '<div class="resource_item" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:showPNG(\'Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '\')">' + node_name + '</a>' +
            '</div>';
    }


    $("#normalDIV #otherResources").append(html);
    $("#fullscreenDIV #otherResources").append(html);
}


function normalResourcesDoUp() {
    if (globalOtherResourcePoint > 0) {
        globalOtherResourcePoint--;
        drawOtherResources(globalVideosArray, 0);
    }
}

function normalResourcesDoDown() {
    if (globalOtherResourcePoint + 5 < globalResourcesArray.length) {
        globalOtherResourcePoint++;
        drawOtherResources(globalVideosArray, 0);
    }
}

var globalSupplementsPoint = 0;

function drawSupplements(videosArray, indexSelected) {

    globalSupplementsArray = videosArray[indexSelected].getElementsByTagName("supplement");

    $("#fullscreenDIV #Supplements").html("");
    $("#normalDIV #Supplements").html("");

    for (i = globalSupplementsPoint; i < globalSupplementsPoint + 5; i++) {
        if (globalSupplementsArray[i] != null)
            if (i < globalSupplementsArray.length)
                drawOtherSupplementsItem(i, globalSupplementsArray[i].attributes[0].nodeValue, globalSupplementsArray[i].attributes[1].nodeValue, globalSupplementsArray[i].attributes[2].nodeValue);
    }

    if (globalSupplementsArray.length > 0) {
        $(".btnUpSupplements").show();
        $(".btnDownSupplements").show();
        if (globalSupplementsPoint == 0)
            $(".btnUpSupplements").hide();

        if (globalSupplementsPoint + 5 == globalSupplementsArray.length)
            $(".btnDownSupplements").hide();

    } else {
        $(".btnUpSupplements").hide();
        $(".btnDownSupplements").hide();
    }


    if (globalSupplementsArray.length <= 5) {
        $(".btnUpSupplements").hide();
        $(".btnDownSupplements").hide();
    }

}

function normalSupplementsDoUp() {
    if (globalSupplementsPoint > 0) {
        globalSupplementsPoint--;
        drawSupplements(globalVideosArray, 0);
    }
}

function normalSupplementsDoDown() {

    if (globalSupplementsPoint + 5 < globalSupplementsArray.length) {
        globalSupplementsPoint++;
        drawSupplements(globalVideosArray, 0);
    }
}


function drawOtherSupplementsItem(index, node_id, node_name, node_src) {

    var extension = node_src.substring(node_src.length - 3, node_src.length);
    var img = 'KalturaPlayer/images/doc.png';
    if (extension.toUpperCase() == "PDF")
        img = 'KalturaPlayer/images/pdf.png';
    if (extension.toUpperCase() == "DOC" || extension.toUpperCase() == "OCX")
        img = 'KalturaPlayer/images/docx.png';
    if (extension.toUpperCase() == "VID")
        img = 'KalturaPlayer/images/video.png';
    if (extension.toUpperCase() == "PNG" || extension.toUpperCase() == "JPG" || extension.toUpperCase() == "GIF")
        img = 'KalturaPlayer/images/slide.png';

    var node_full_name = node_name;
    node_name = my_substring(node_name, 75);
    var html = '<div class="resource_item" id="' + node_id + '">' +
        '<img src="' + img + '">' +
        '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" target=_blank href="Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '">' + node_name + '</a>' +
        '</div>';

    if (extension.toUpperCase() == "VID") {
        var video_id = node_src.substring(0, node_src.length - 4);
        var active = "";
        if (video_id == theSession.video)
            active = " active";
        html = '<div class="resource_item ' + active + '" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:changeVideo(\'' + theSession.module + '/' + theSession.session + '/' + theSession.part + '/' + video_id + '\')">' + node_name + '</a>' +
            '</div>';
    }

    if (extension.toUpperCase() == "PDF") {
        html = '<div class="resource_item" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:showPDF(\'Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '\')">' + node_name + '</a>' +
            '</div>';
    }

    if (extension.toUpperCase() == "PNG" || extension.toUpperCase() == "JPG" || extension.toUpperCase() == "GIF") {
        html = '<div class="resource_item" id="' + node_id + '">' +
            '<img src="' + img + '">' +
            '<a class="tooltip5" data-show-tooltip="true" title="' + node_full_name + '" href="javascript:showPNG(\'Data/' + theSession.module + '/' + theSession.session + "/" + node_src + '\')">' + node_name + '</a>' +
            '</div>';
    }


    $("#normalDIV #Supplements").append(html);
    $("#fullscreenDIV #Supplements").append(html);
}

function drawGridVideos(index, node_id, node_name, node_src, node_link, is_active) {

    var html_active = "";
    var html_active_check = "";
    if (is_active == true) {
        html_active = " active active_border";
        html_active_check = '<div class="check"><img src="KalturaPlayer/images/check.png"></div>';
    }

    if (readCookie(node_id) == "1" && (!is_active)) {
        html_active = " active ";
    }

    var imgSrc = 'Data/' + theSession.module + "/" + theSession.session + "/" + node_src;
    if (node_src.length > 4)
        if (node_src.substring(0, 4) == "http")
            imgSrc = node_src;


    var link = 'index.html?' + theSession.module + "/" + theSession.session + "/" + theSession.part + "/" + node_id;
    var html = '<div class="video_item ' + html_active + '">' +
        '<a href="' + link + '"><img style="width:135px;height:85px" src="' + imgSrc + '"></a>' +
        '<p><a title="' + node_name + '" href="' + link + '">' +
        my_substring(node_name, 60) +
        '</a></p>' +
        html_active_check +
        '</div>';


    var htmlNormal = findAndReplace(link, 'javascript:changeVideo(\'' + link + '\')', html);
    htmlNormal = findAndReplace('index.html?', '', htmlNormal);
    $("#normalDIV .videosGrid .video_items").append(htmlNormal);

    var htmlFullScreen = findAndReplace(link, 'javascript:exitFullscreenAndMove(\'' + link + '\')', html);
    $("#fullscreenDIV .videosGrid .video_items").append(htmlFullScreen);
}



$(window).load(function () {
    parseUrl(theSession);
});



function bottomBarOnLeft() {
    bottomBarContent(-1);
}

function bottomBarOnRight() {
    bottomBarContent(+1);
}

function bottomShowHideLeftButton(isShow) {
    var iframe = $("#player_ifp").contents().find("body").find('div[id=fullscreenDIV]');
    var iframe_bottomLeftButton = iframe.find('a[id=bottomLeftButton]');

    if (isShow == true) {
        $("#normalDIV .bottomBar .back .button").show();
        $("#fullscreenDIV .bottomBar .back .button").show();
        iframe_bottomLeftButton.show();
    } else {
        $("#normalDIV .bottomBar .back .button").hide();
        $("#fullscreenDIV .bottomBar .back .button").hide();
        iframe_bottomLeftButton.hide();
    }
}

function bottomShowHideRightButton(isShow) {
    var iframe = $("#player_ifp").contents().find("body").find('div[id=fullscreenDIV]');
    var iframe_bottomRightButton = iframe.find('a[id=bottomRightButton]');

    if (isShow == true) {
        $("#normalDIV .bottomBar .next .button").show();
        $("#fullscreenDIV .bottomBar .next .button").show();
        iframe_bottomRightButton.show();
    } else {
        $("#normalDIV .bottomBar .next .button").hide();
        $("#fullscreenDIV .bottomBar .next .button").hide();
        iframe_bottomRightButton.hide();
    }
}

function SimplyRelateArray(globalRelateArray) {
    var clone = new Array();
    var i = 0;
    var isHadGrid = false;
    while (i < globalRelateArray.length) {
        if (globalRelateArray[i].attributes[4] != null) {
            if (isHadGrid == false) {
                isHadGrid = true;
                clone[clone.length] = globalRelateArray[i];
            }
        } else
            clone[clone.length] = globalRelateArray[i];
        i++;
    }

    return clone;
}

function bottomBarContent(index) {

    var paggingIndex = 0;
    if (readCookie("paggingIndex") != null)
        paggingIndex = parseInt(readCookie("paggingIndex"));

    index = paggingIndex + index;

    var XMLSlidesPath = $("#fullscreenDIV #XMLSlidesPath").text();
    globalRelateArray = readRelatedVideo(XMLSlidesPath);

    if (globalRelateArray == null)
        return;
    if (globalRelateArray.length == 0)
        return;
    if (index < 0)
        return;
    if (index >= globalRelateArray.length)
        return;

    lastButtonBarIndex = index;


    if (index == 0)
        bottomShowHideLeftButton(false);
    else
        bottomShowHideLeftButton(true);

    var html_content = "";
    var pos = 0;

    createCookie("paggingIndex", index, 1);

    var simplyRelateArray = SimplyRelateArray(globalRelateArray);
    var bottomBarCount = 0;
    for (var i = index; i < simplyRelateArray.length; i++) {
        if (simplyRelateArray[i].attributes[4] != null) {
            var html = '<a href="javascript:normalOpenVideosGrid()"><img src="KalturaPlayer/images/bt_menu.png"></a> \
                                        <p>Select a <br>Video</p>';

            html_content += '<div class="item item_grid">' + html + '</div>';
            pos++;
        } else {
            var nextUrl = 'index.html?' + theSession.module + "/" + theSession.session + "/" + theSession.part + "/" + simplyRelateArray[i].attributes[0].nodeValue;
            var imgSrc = 'Data/' + theSession.module + "/" + theSession.session + "/" + simplyRelateArray[i].attributes[2].nodeValue;

            if (simplyRelateArray[i].attributes[2].nodeValue == "" || simplyRelateArray[i].attributes[2].nodeValue == null || simplyRelateArray[i].attributes[2].nodeValue == "#")
                imgSrc = "https://cdnsecakmi.kaltura.com/p/243342/sp/24334200/thumbnail/entry_id/" + simplyRelateArray[i].attributes[0].nodeValue + "/version/100003/width/145";

            var styleActive = "";
            var imgActive = "";
            if (simplyRelateArray[i].attributes[0].nodeValue == theSession.video) {
                styleActive = ' active';
                imgActive = '<div class="imgActive"><img src="KalturaPlayer/images/check.png"></div>';
            }

            var styleRead = "";
            if (simplyRelateArray[i].attributes[0].nodeValue != theSession.video)
                if (readCookie(simplyRelateArray[i].attributes[0].nodeValue) == "1")
                    styleRead = " read ";

            bottomBarCount++;
            var htmlNormal = 'javascript:changeVideoBottomBar(\'' + theSession.module + '/' + theSession.session + '/' + theSession.part + '/' + simplyRelateArray[i].attributes[0].nodeValue + '\', ' + bottomBarCount + ')';

            var html = '<a href="' + htmlNormal + '"><img style="width:135px;height:85px" src="' + imgSrc + '"></a>' +
                '<p><a title="' + simplyRelateArray[i].attributes[1].nodeValue + '" href="' + htmlNormal + '">' /* +'Video ' + (i + 1) + ":<br>" */ +
                my_substring(simplyRelateArray[i].attributes[1].nodeValue, 60) + '</a>' +
                '</p>';

            html_content += '<div class="item' + styleActive + styleRead + '">' + html + imgActive + '</div>';
            pos++;
        }
        if (pos >= 3)
            break;
    }
    $("#normalDIV .bottomBar .content").html(html_content);

    var fullscreen_html_content = findAndReplace("normalOpenVideosGrid", "fullscreenOpenVideosGrid", html_content);
    $("#fullscreenDIV .bottomBar .content").html(fullscreen_html_content);

    if (simplyRelateArray.length <= 1)
        bottomShowHideRightButton(false);

    if (i >= simplyRelateArray.length - 1)
        bottomShowHideRightButton(false);
    else
        bottomShowHideRightButton(true);

}

function getBottomBarIndex() {
    if (isBottomBarOne == true) {
        if (lastVideoBottomBarIndex != -1) {
            return lastButtonBarIndex;
        }
    }
    lastButtonBarIndex = -1;
    lastVideoBottomBarIndex = -1;
    isBottomBarOne = false;
    return 0;
}

function redrawBottomBar() {

    var html_content_normal = '<div class="inner"> \
                                <div class="back"> \
                                    <p> Videos: </p> \
                                    <a class="button" href="javascript:bottomBarOnLeft()" id="bottomLeftButton"><img src="KalturaPlayer/images/bt_bottom_left.png"></a> \
                                </div> \
                                <div class="content"></div> \
                                <div class="next"> \
                                    <p>&nbsp; </p> \
                                    <a class="button" href="javascript:bottomBarOnRight()" id="bottomRightButton"><img src="KalturaPlayer/images/bt_bottom_right.png"></a> \
                                </div> \
                                <div style="clear:both"></div> \
                            </div>';

    var html_content_fullscreen = '<a href="javascript:fcCloseGridOverlay()">\
                                    <div class="videosGridOverlay">&nbsp;</div>\
                                   </a>\
                                    <div class="videosGrid"><div class="video_items"></div></div>\
                            <div class="inner"> \
                                <div class="back"> \
                                    <p> Videos: </p> \
                                    <a class="button" href="javascript:bottomBarOnLeft()" id="bottomLeftButton"><img src="KalturaPlayer/images/bt_bottom_left.png"></a> \
                                </div> \
                                <div class="content"></div> \
                                <div class="next"> \
                                    <p>&nbsp; </p> \
                                    <a class="button" href="javascript:bottomBarOnRight()" id="bottomRightButton"><img src="KalturaPlayer/images/bt_bottom_right.png"></a> \
                                </div> \
                                <div style="clear:both"></div> \
                            </div>';


    $("#fullscreenDIV .bottomBar").html(html_content_fullscreen);
    $("#normalDIV .bottomBar").html(html_content_normal);


    bottomBarContent(getBottomBarIndex());
}

function redrawVideosGrid() {

    $("#fullscreenDIV .videosGrid .video_items").html("");
    $("#normalDIV .videosGrid .video_items").html("");

    if (globalRelateArray == null)
        return;
    if (globalRelateArray.length == 0)
        return;
    for (var i = 0; i < globalRelateArray.length; i++) {
        if (globalRelateArray[i].attributes[4] != null) {
            var is_active = false;
            if (globalRelateArray[i].attributes[0].nodeValue == theSession["video"])
                is_active = true;
            var imgSrc = globalRelateArray[i].attributes[2].nodeValue;
            if (imgSrc == "" || imgSrc == null || imgSrc == "#")
                imgSrc = "https://cdnsecakmi.kaltura.com/p/243342/sp/24334200/thumbnail/entry_id/" + globalRelateArray[i].attributes[0].nodeValue + "/version/100003/width/145";

            drawGridVideos(i, globalRelateArray[i].attributes[0].nodeValue, globalRelateArray[i].attributes[1].nodeValue, imgSrc, globalRelateArray[i].attributes[3].nodeValue, is_active);
            $("#normalDIV .videosGrid").css("margin-top", -115 * globalVideosArray.length / 4);
            $("#fullscreenDIV .videosGrid").css("margin-top", -115 * globalVideosArray.length / 4);
        }
    }

}

function drawBottomMenu(videosArray, indexSelected) {

    var imgSrc = "Data/" + theSession.module + "/" + theSession.session + "/" + videosArray[indexSelected].attributes[2].nodeValue;
    if (videosArray[indexSelected].attributes[2].nodeValue.length > 4)
        if (videosArray[indexSelected].attributes[2].nodeValue.substring(0, 4) == "http")
            imgSrc = videosArray[indexSelected].attributes[2].nodeValue;

    var html = '<img style="width:135px;height:85px" src="' + imgSrc + '">' +
        '<p>' +
        my_substring(videosArray[indexSelected].attributes[1].nodeValue, 60) +
        '</p>';
    $("#normalDIV #videoCurrent").html(html);
    $("#fullscreenDIV #videoCurrent").html(html);

    var backUrl = "#";
    if (indexSelected > 0)
        backUrl = 'index.html?' + theSession.module + "/" + theSession.session + "/" + theSession.part + "/" + videosArray[indexSelected - 1].attributes[0].nodeValue;
    html = '<p>Videos:</p>';
    if (backUrl != "#")
        html += '<a href="' + backUrl + '"><img src="KalturaPlayer/images/bt_bottom_left.png"></a>';
    $("#normalDIV #videoBack").html(html);
    $("#fullscreenDIV #videoBack").html(html);


    var nextUrl = "#";
    if (indexSelected < videosArray.length - 1) {

        imgSrc = "Data/" + theSession.module + "/" + theSession.session + "/" + videosArray[indexSelected + 1].attributes[2].nodeValue;
        if (videosArray[indexSelected + 1].attributes[2].nodeValue.length > 4)
            if (videosArray[indexSelected + 1].attributes[2].nodeValue.substring(0, 4) == "http")
                imgSrc = videosArray[indexSelected + 1].attributes[2].nodeValue;

        nextUrl = 'index.html?' + theSession.module + "/" + theSession.session + "/" + theSession.part + "/" + videosArray[indexSelected + 1].attributes[0].nodeValue;
        html = '<a href="' + nextUrl + '"><img style="width:135px;height:85px" src="' + imgSrc + '"></a>' +
            '<p><a href="' + nextUrl + '">Video ' + (indexSelected + 2) + ":<br>" +
            videosArray[indexSelected + 1].attributes[1].nodeValue + '</a>' +
            '</p>';
        $("#normalDIV #videoNext").html(html);

        html = '<a href="javascript:exitFullscreenAndMove(\'' + nextUrl + '\')"><img style="width:135px;height:85px" src="' + imgSrc + '"></a>' +
            '<p><a href="javascript:exitFullscreenAndMove(\'' + nextUrl + '\')">Video ' + (indexSelected + 2) + ":<br>" +
            videosArray[indexSelected + 1].attributes[1].nodeValue + '</a>' +
            '</p>';
        $("#fullscreenDIV #videoNext").html(html);

        html = '<p>&nbsp;</p><a href="' + nextUrl + '"><img src="KalturaPlayer/images/bt_bottom_right.png"></a>'
        $("#normalDIV #videoNextBt").html(html);

        html = '<p>&nbsp;</p><a href="javascript:exitFullscreenAndMove(\'' + nextUrl + '\')"><img src="KalturaPlayer/images/bt_bottom_right.png"></a>'
        $("#fullscreenDIV #videoNextBt").html(html);


    } else {
        $("#normalDIV #videoNext").hide();
        $("#fullscreenDIV #videoNext").hide();
        $("#normalDIV #videoNextBt").hide();
        $("#fullscreenDIV #videoNextBt").hide();

    }

}

function exitFullscreenAndMove(url) {
    window.parent.myKdp.sendNotification('closeFullScreen');
    setTimeout(function () {
        url = url.replace("index.html?", "");
        window.parent.myKdp.sendNotification('exitFullscreenAndMove', url);
    }, 200);
}

function drawVideoContent(video_content) {
    var contentFile = "Data/" + theSession.module + "/" + theSession.session + "/" + video_content;

    if (video_content == "" || video_content == "#" || video_content == null) {
        $("#videoContent").html("");
        return;
    }

    $.get(contentFile, function (data) {
        $("#videoContent").html(data);
    });

}

function drawModulesMenu(index, node_name, node_link, parts) {

    var pageTitle = "";
    var isSelected = false;
    var tSession = node_name;
    if (node_link == theSession["session"]) {
        pageTitle = tSession;
        tSession = "<b style='color:#fff68f'>" + tSession + "</b>";
        isSelected = true;
    }
    var link_session = 'index.html?' + theSession.module + "/" + node_link;
    var html = '<li><a href="' + link_session + '">' + tSession + '</a>';

    var curSession = theSession.session;
    curSession = curSession.replace('Session', "");

    if (parts.length > 0) {
        html += '<ul>';
        for (var j = 0; j < parts.length; j++) {
            html += "<li>";
            var thePart = parts[j].attributes[0].nodeValue;
            if (isSelected) {
                if (parts[j].attributes[1].nodeValue == theSession["part"]) {

                    pageTitle += ": " + parts[j].attributes[2].nodeValue;
                    pageTitle = substringEx(pageTitle, 125);
                    var currentPart = curSession + "-" + (j + 1);
                    pageTitle = pageTitle.replace(node_name, currentPart);

                    $("#normalDIV #pageTitle").html(pageTitle);
                    $("#fullscreenDIV #pageTitle").html(pageTitle);

                    var backPartLink = "#";
                    var backPartText = curSession + "-" + j;
                    if (j > 0)
                        backPartLink = 'index.html?' + theSession.module + "/" + node_link + "/" + parts[j - 1].attributes[1].nodeValue;

                    var nextPartLink = "#";
                    var nextPartText = curSession + "-" + (j + 2);

                    if (j < parts.length - 1)
                        nextPartLink = 'index.html?' + theSession.module + "/" + node_link + "/" + parts[j + 1].attributes[1].nodeValue;


                    var backNextMenuHTML = "";
                    if (j <= 0) {
                        backPartText = "&nbsp;&nbsp;&nbsp;";
                        backNextMenuHTML += '<a href="' + backPartLink + '"><img src="KalturaPlayer/images/homefix.png"></a>';
                    } else
                        backNextMenuHTML += '<a href="' + backPartLink + '"><img src="KalturaPlayer/images/back.png"></a>';

                    if (j + 1 >= parts.length) {
                        nextPartText = "&nbsp;&nbsp;&nbsp;";
                        backNextMenuHTML += '<a href="' + nextPartLink + '"><img src="KalturaPlayer/images/homefix.png" style="padding-left: 50px"></a>';
                    } else
                        backNextMenuHTML += '<a href="' + nextPartLink + '"><img src="KalturaPlayer/images/next.png" style="padding-left: 50px"></a>';


                    backNextMenuHTML += '<div class="info1"><a href="' + backPartLink + '"> ' + backPartText + '</a></div>';
                    backNextMenuHTML += '<div class="info2"><a href="' + nextPartLink + '"> ' + nextPartText + '</a></div>';
                    $("#normalDIV #backNextMenu").html(backNextMenuHTML);


                    var htmlFullScreen = findAndReplace(backPartLink, 'javascript:exitFullscreenAndMove(\'' + backPartLink + '\')', backNextMenuHTML);
                    htmlFullScreen = findAndReplace(nextPartLink, 'javascript:exitFullscreenAndMove(\'' + nextPartLink + '\')', htmlFullScreen);
                    $("#fullscreenDIV #backNextMenu").html(htmlFullScreen);

                    thePart = "<b style='color:#fff68f'>" + thePart + "</b>";
                }
            }
            html += '<a href="index.html?' + theSession.module + "/" + node_link + "/" + parts[j].attributes[1].nodeValue + '">' + thePart + '</a>';
            html += "</li>";
        }
        html += '</ul>';
    }
    html += '</li>';

    var htmlObj = $(html);

    $("#normalDIV #mnMenu .sessions").append(html);
    $("#fullscreenDIV #mnMenu .sessions").append(html);
}



function getFullscreenElm() {
    if (deploy_env == "ctools")
        return window.parent.document.getElementsByClassName(ctool_iframe_class)[0];
    if (deploy_env == "test")
        return window.parent.document.getElementsByClassName(test_iframe_class)[0];
    if (deploy_env == "") {
        return document;
    }
}

function getFullscreenElm2levels() {
    if (deploy_env == "ctools")
        return window.parent.parent.document.getElementsByClassName(ctool_iframe_class)[0];
    else
        return "";
}

function getExitFullscreenElm() {
    if (deploy_env == "ctools")
        return parent.document;
    if (deploy_env == "test")
        return parent.document;
    if (deploy_env == "") {
        return document;
    }
}

function getExitFullscreenElm2levels() {
    if (deploy_env == "ctools")
        return parent.parent.document;
    else
        return "";

}


