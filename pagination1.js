var nopage, type, postnumber, lblname1, searchquery, archivepath;

function pagination(a) {
    var e = "";
    leftnum = parseInt(numshowpage / 2);
    if (leftnum == numshowpage - leftnum) numshowpage = 2 * leftnum + 1;

    start = postnumber - leftnum;
    if (start < 1) start = 1;

    maximum = parseInt(a / postperpage) + 1;
    if (maximum - 1 == a / postperpage) maximum -= 1;

    end = start + numshowpage - 1;
    if (end > maximum) end = maximum;

    e += "<span class='totalpages'>Page " + postnumber + " of " + maximum + "</span>";

    var s = parseInt(postnumber) - 1;

    // Previous button
    if (postnumber > 1) {
        if (type == "page") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectpage(' + s + ');return false">' + prevpage + "</a></span>";
        } else if (type == "label") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + s + ');return false">' + prevpage + "</a></span>";
        } else if (type == "search") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectsearch(' + s + ');return false">' + prevpage + "</a></span>";
        } else if (type == "archive") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectarchive(' + s + ');return false">' + prevpage + "</a></span>";
        }
    }

    // Numbers
    for (var r = start; r <= end; r++) {
        if (postnumber == r) {
            e += '<span class="current">' + r + "</span>";
        } else {
            if (type == "page") {
                e += '<span class="pagenumber"><a href="#" onclick="redirectpage(' + r + ');return false">' + r + "</a></span>";
            } else if (type == "label") {
                e += '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + r + ');return false">' + r + "</a></span>";
            } else if (type == "search") {
                e += '<span class="pagenumber"><a href="#" onclick="redirectsearch(' + r + ');return false">' + r + "</a></span>";
            } else if (type == "archive") {
                e += '<span class="pagenumber"><a href="#" onclick="redirectarchive(' + r + ');return false">' + r + "</a></span>";
            }
        }
    }

    // Next button
    var n = parseInt(postnumber) + 1;
    if (postnumber < maximum) {
        if (type == "page") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectpage(' + n + ');return false">' + nextpage + "</a></span>";
        } else if (type == "label") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + n + ');return false">' + nextpage + "</a></span>";
        } else if (type == "search") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectsearch(' + n + ');return false">' + nextpage + "</a></span>";
        } else if (type == "archive") {
            e += '<span class="pagenumber"><a href="#" onclick="redirectarchive(' + n + ');return false">' + nextpage + "</a></span>";
        }
    }

    var t = document.getElementsByName("pageArea"),
        l = document.getElementById("blog-pager");
    for (var p = 0; p < t.length; p++) t[p].innerHTML = e;
    if (t && t.length > 0) e = "";
    if (l) l.innerHTML = e;
}

function paginationall(a) {
    var e = a.feed,
        s = parseInt(e.openSearch$totalResults.$t, 10);
    pagination(s);
}

function bloggerpage() {
    var a = urlactivepage;

    if (a.indexOf("?q=") != -1) {
        type = "search";
        searchquery = decodeURIComponent(a.substring(a.indexOf("?q=") + 3));
        postnumber = a.indexOf("#PageNo=") != -1 ? a.substring(a.indexOf("#PageNo=") + 8) : 1;
        document.write('<script src="' + home_page + 'feeds/posts/summary?q=' + searchquery + '&max-results=1&alt=json-in-script&callback=paginationall"></script>');
    } 
    else if (a.indexOf("/search/label/") != -1) {
        type = "label";
        lblname1 = a.indexOf("?updated-max") != -1 ? a.substring(a.indexOf("/search/label/") + 14, a.indexOf("?updated-max")) : a.substring(a.indexOf("/search/label/") + 14, a.indexOf("?&max"));
        if (a.indexOf("&max-results=") == -1) postperpage = 20;
        postnumber = a.indexOf("#PageNo=") != -1 ? a.substring(a.indexOf("#PageNo=") + 8) : 1;
        document.write('<script src="' + home_page + "feeds/posts/summary/-/" + lblname1 + '?alt=json-in-script&callback=paginationall&max-results=1"></script>');
    } 
    else if (a.match(/\/\d{4}\/\d{2}\//)) { 
        type = "archive";
        archivepath = a.match(/\/\d{4}\/\d{2}\//)[0];
        postnumber = a.indexOf("#PageNo=") != -1 ? a.substring(a.indexOf("#PageNo=") + 8) : 1;
        document.write('<script src="' + home_page + "feeds/posts/summary" + archivepath + '?alt=json-in-script&callback=paginationall&max-results=1"></script>');
    } 
    else {
        type = "page";
        postnumber = a.indexOf("#PageNo=") != -1 ? a.substring(a.indexOf("#PageNo=") + 8) : 1;
        document.write('<script src="' + home_page + 'feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"></script>');
    }
}

function redirectpage(a) {
    jsonstart = (a - 1) * postperpage; nopage = a;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = home_page + "feeds/posts/summary?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
    document.getElementsByTagName("head")[0].appendChild(s);
}

function redirectlabel(a) {
    jsonstart = (a - 1) * postperpage; nopage = a;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = home_page + "feeds/posts/summary/-/" + lblname1 + "?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
    document.getElementsByTagName("head")[0].appendChild(s);
}

function redirectsearch(a) {
    jsonstart = (a - 1) * postperpage; nopage = a;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = home_page + "feeds/posts/summary?q=" + searchquery + "&start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
    document.getElementsByTagName("head")[0].appendChild(s);
}

function redirectarchive(a) {
    jsonstart = (a - 1) * postperpage; nopage = a;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = home_page + "feeds/posts/summary" + archivepath + "?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
    document.getElementsByTagName("head")[0].appendChild(s);
}

function finddatepost(a) {
    post = a.feed.entry[0];
    var e = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29),
        s = encodeURIComponent(e);
    var r;
    if (type == "page") {
        r = "/search?updated-max=" + s + "&max-results=" + postperpage + "#PageNo=" + nopage;
    } else if (type == "label") {
        r = "/search/label/" + lblname1 + "?updated-max=" + s + "&max-results=" + postperpage + "#PageNo=" + nopage;
    } else if (type == "search") {
        r = "/search?q=" + searchquery + "&updated-max=" + s + "&max-results=" + postperpage + "#PageNo=" + nopage;
    } else if (type == "archive") {
        r = archivepath + "?updated-max=" + s + "&max-results=" + postperpage + "#PageNo=" + nopage;
    }
    location.href = r;
}

bloggerpage();
