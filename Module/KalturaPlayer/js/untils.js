function deleteAllCookies() {
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function parseUrl(theSession) {

    var params_string = window.location.search;
    if (params_string.charAt(0) != "?")
        return;

    params_string = params_string.replace('?', '');
    var params = params_string.split("/");

    if (typeof params[0] != 'undefined')
        if (params[0] != "")
            theSession["module"] = params[0];
    if (typeof params[1] != 'undefined')
        if (params[1] != "")
            theSession["session"] = params[1];
    if (typeof params[2] != 'undefined')
        if (params[2] != "")
            theSession["part"] = params[2];
    if (typeof params[3] != 'undefined') {
        if (params[3] != "")
            theSession["video"] = params[3];
    }

    createCookie(theSession["video"], "1", 1);

}


function substringEx(input, length) {
    var output = input.substring(0, length);
    if (output.length != input.length)
        output += "...";
    return output;
}


function convertHHMMSStoSeconds(hms) {
    var a = hms.split(':'); 
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds;
}

function checkExistFile(fileUrl) {
    $.ajax({
        url: fileUrl,
        type: 'HEAD',
        error: function () {
            alert('Error! File not found: ' + fileUrl);
            window.history.back();
        },
        success: function () {
        }
    });
}

function showPDF( url ) {
    PopupCenterInnerPDF(url, "PDF Viewer", 0, 0);
}

function showPNG( url ) {
    PopupCenterInnerPNG(url, "Slide Viewer", 0, 0);
}

function PopupCenterInnerPNG(url, title, w, h) {
    $("#myModal .modal-body .content-iframe").attr('src', url);
    $("#myModal").modal();
}

function PopupCenterInnerPDF(url, title, w, h) {
    $("#myModalPDF .modal-body .content-iframe").attr('src', url);
    $("#myModalPDF").modal();
}

function my_substring( str, len ) {
    str = str.trim();
    var out = str.substring(0, len );
    if( out.length < str.length ) {

        while ( out[out.length - 1] != " " ) {
            out = out.substring( 0, out.length -1 );
            if( out.length == 0 )
                return;
        }
        out += "..";
    }
    return out;
}

(function ($) {
    $.fn.getStyleObject = function () {
        var dom = this.get(0);
        var style;
        var returns = {};
        if (window.getComputedStyle) {
            var camelize = function (a, b) {
                return b.toUpperCase();
            };
            style = window.getComputedStyle(dom, null);
            for (var i = 0, l = style.length; i < l; i++) {
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            ;
            return returns;
        }
        ;
        if (style = dom.currentStyle) {
            for (var prop in style) {
                returns[prop] = style[prop];
            }
            ;
            return returns;
        }
        ;
        return this.css();
    }
})(jQuery);

$.fn.copyCSS = function (source) {
    var styles = $(source).getStyleObject();
    this.css(styles);
}


