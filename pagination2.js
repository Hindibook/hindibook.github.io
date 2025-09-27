/*<![CDATA[*/
    var postperpage = 9;   // Posts per page
    var numshowpage = 3;   // How many middle numbers to show
    var upPageWord = '« Previous Page';
    var downPageWord = 'Next Page »';
    var urlactivepage = location.href;
    var home_page = "/";

    var nopage, jenis, nomerhal, lblname1, searchQuery, totalPages;

    function loophalaman(banyakdata) {
      var html = '';
      nomerkiri = parseInt(numshowpage / 2);
      if (nomerkiri == numshowpage - nomerkiri) { numshowpage = nomerkiri * 2 + 1 }
      mulai = nomerhal - nomerkiri;
      if (mulai < 1) mulai = 1;
      maksimal = parseInt(banyakdata / postperpage) + 1;
      if (maksimal - 1 == banyakdata / postperpage) maksimal = maksimal - 1;
      akhir = mulai + numshowpage - 1;
      if (akhir > maksimal) akhir = maksimal;
      totalPages = maksimal;

      // Prev button
      if (nomerhal > 1) {
        html += pageLink(nomerhal - 1, upPageWord);
      }

      // Always show first page
      if (mulai > 1) {
        html += pageLink(1, "1");
        if (mulai > 2) html += " ... ";
      }

      // Middle pages
      for (var jj = mulai; jj <= akhir; jj++) {
        if (nomerhal == jj) {
          html += '<span class="showpagePoint">' + jj + '</span>';
        } else {
          html += pageLink(jj, jj);
        }
      }

      // Always show last page
      if (akhir < maksimal - 1) html += " ... ";
      if (akhir < maksimal) {
        html += pageLink(maksimal, maksimal);
      }

      // Next button
      if (nomerhal < maksimal) {
        html += pageLink(nomerhal + 1, downPageWord);
      }

      var pageArea = document.getElementById("blog-pager");
      if (pageArea) { pageArea.innerHTML = html }
    }

    function pageLink(pageNo, text) {
      if (jenis == "page") {
        if (pageNo == 1) return '<span class="showpageNum"><a href="' + home_page + '">' + text + '</a></span>';
        return '<span class="showpageNum"><a href="#" onclick="redirectpage(' + pageNo + ');return false">' + text + '</a></span>';
      } else if (jenis == "label") {
        if (pageNo == 1) return '<span class="showpageNum"><a href="/search/label/' + lblname1 + '?&max-results=' + postperpage + '">' + text + '</a></span>';
        return '<span class="showpageNum"><a href="#" onclick="redirectlabel(' + pageNo + ');return false">' + text + '</a></span>';
      } else if (jenis == "search") {
        if (pageNo == 1) return '<span class="showpageNum"><a href="/search?q=' + searchQuery + '&max-results=' + postperpage + '">' + text + '</a></span>';
        return '<span class="showpageNum"><a href="#" onclick="redirectsearch(' + pageNo + ');return false">' + text + '</a></span>';
      }
      return "";
    }

    function hitungtotaldata(root) {
      var feed = root.feed;
      var totaldata = parseInt(feed.openSearch$totalResults.$t, 10);
      loophalaman(totaldata);
    }

    function halamanblogger() {
      var thisUrl = urlactivepage;
      if (thisUrl.indexOf("/search/label/") != -1) {
        jenis = "label";
        lblname1 = thisUrl.split("/search/label/")[1].split("?")[0];
      } else if (thisUrl.indexOf("/search?q=") != -1) {
        jenis = "search";
        searchQuery = decodeURIComponent(thisUrl.split("/search?q=")[1].split("&")[0]);
      } else {
        jenis = "page";
      }

      if (urlactivepage.indexOf("#PageNo=") != -1) {
        nomerhal = parseInt(urlactivepage.substring(urlactivepage.indexOf("#PageNo=") + 8));
      } else {
        nomerhal = 1;
      }

      var feedUrl = home_page + "feeds/posts/summary?max-results=1&alt=json-in-script&callback=hitungtotaldata";
      if (jenis == "label") feedUrl = home_page + "feeds/posts/summary/-/" + lblname1 + "?alt=json-in-script&callback=hitungtotaldata&max-results=1";
      else if (jenis == "search") feedUrl = home_page + "feeds/posts/summary?q=" + encodeURIComponent(searchQuery) + "&alt=json-in-script&callback=hitungtotaldata&max-results=1";

      var script = document.createElement("script");
      script.src = feedUrl;
      document.body.appendChild(script);
    }

    function redirectpage(numberpage) {
      jsonstart = (numberpage - 1) * postperpage;
      nopage = numberpage;
      var newInclude = document.createElement('script');
      newInclude.type = 'text/javascript';
      newInclude.src = home_page + "feeds/posts/summary?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
      document.getElementsByTagName('head')[0].appendChild(newInclude);
    }

    function redirectlabel(numberpage) {
      jsonstart = (numberpage - 1) * postperpage;
      nopage = numberpage;
      var newInclude = document.createElement('script');
      newInclude.type = 'text/javascript';
      newInclude.src = home_page + "feeds/posts/summary/-/" + lblname1 + "?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
      document.getElementsByTagName('head')[0].appendChild(newInclude);
    }

    function redirectsearch(numberpage) {
      jsonstart = (numberpage - 1) * postperpage;
      nopage = numberpage;
      var newInclude = document.createElement('script');
      newInclude.type = 'text/javascript';
      newInclude.src = home_page + "feeds/posts/summary?q=" + encodeURIComponent(searchQuery) + "&start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
      document.getElementsByTagName('head')[0].appendChild(newInclude);
    }

    function finddatepost(root) {
      post = root.feed.entry[0];
      var timestamp1 = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
      var timestamp = encodeURIComponent(timestamp1);
      var alamat = "";
      if (jenis == "page") alamat = "/search?updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
      else if (jenis == "label") alamat = "/search/label/" + lblname1 + "?updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
      else if (jenis == "search") alamat = "/search?q=" + searchQuery + "&updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
      location.href = alamat;
    }

    // Run on page load
    halamanblogger();
    /*]]>*/
