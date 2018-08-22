var isBottomBarOne = false;

function findAndReplace(searchText, replacement, searchNode) {
    return searchNode.split(searchText).join(replacement);
}

function readXMLCuepoints(slideshowXML) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", slideshowXML, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    var cuepoints = null;
    if (xmlDoc.getElementsByTagName("video") != null) {

        if (theSession["video"] == "")
            theSession["video"] = xmlDoc.getElementsByTagName("video")[0]["id"];

        for (var i = 0; i < xmlDoc.getElementsByTagName("video").length; i++) {
            if (theSession["video"] == xmlDoc.getElementsByTagName("video")[i]["id"]) {
                var video = xmlDoc.getElementsByTagName("video");
                var cuepoints = video[i].getElementsByTagName("cuepoints");
                if (cuepoints[0] != null)
                    cuepoints = cuepoints[0].getElementsByTagName("cuepoint");
                break;
            }
        }
    }

    return cuepoints;

}

function readRelatedVideo(slideshowXML) {
    if (globalRelateArray != null)
        return globalRelateArray;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", slideshowXML, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    var relatedvideos = null;
    if (xmlDoc != null)
        if (xmlDoc.getElementsByTagName("video") != null) {

            if (theSession["video"] == "")
                theSession["video"] = xmlDoc.getElementsByTagName("video")[0]["id"];

            for (var i = 0; i < xmlDoc.getElementsByTagName("video").length; i++) {
                if (theSession["video"] == xmlDoc.getElementsByTagName("video")[i]["id"]) {
                    var video = xmlDoc.getElementsByTagName("video");

                    relatedvideos = video[i].getElementsByTagName("relatedvideos");
                    if (relatedvideos[0] != null)
                        relatedvideos = relatedvideos[0].getElementsByTagName("relate");
                    break;
                }
            }
        }

    if (relatedvideos.length == 0) {
        {
            var video = xmlDoc.getElementsByTagName("video");
            isBottomBarOne = true;
        }

        relatedvideos = video[0].getElementsByTagName("relatedvideos");
        if (relatedvideos[0] != null)
            relatedvideos = relatedvideos[0].getElementsByTagName("relate");
    }


    return relatedvideos;

}

function readXMLResources(slideshowXML) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", slideshowXML, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    var resources = null;
    if (xmlDoc.getElementsByTagName("resources") != null) {
        resources = xmlDoc.getElementsByTagName("resources")[0].getElementsByTagName("resource");
    }

    return resources;

}

function readXMLVideos(slideshowXML) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", slideshowXML, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    var videos = null;
    if (xmlDoc.getElementsByTagName("data") != null) {
        videos = xmlDoc.getElementsByTagName("data")[0].getElementsByTagName("video");
        for (i = 0; i < videos.length; i++) {
            if (videos[i].attributes[2].nodeValue == "" || videos[i].attributes[2].nodeValue == null || videos[i].attributes[2].nodeValue == "#") {
                videos[i].attributes[2].nodeValue = "https://cdnsecakmi.kaltura.com/p/243342/sp/24334200/thumbnail/entry_id/" + videos[i].attributes[0].nodeValue + "/version/100003/width/145";
            }

        }
    }

    return videos;
}

function readXMLSessions(slideshowXML) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", slideshowXML, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    var sessions = null;
    if (xmlDoc.getElementsByTagName("sessions") != null) {
        sessions = xmlDoc.getElementsByTagName("sessions")[0].getElementsByTagName("session");
    }
    return sessions;
}
