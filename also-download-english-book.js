var numPosts = 6;

function showAlsoRead(data) {
  var ul = document.getElementById("also-read");

  if (!ul) return;
  if (!data || !data.feed || !data.feed.entry) {
    ul.innerHTML = "<li>No posts found.</li>";
    return;
  }

  var entries = data.feed.entry.slice();

  entries.sort(function() {
    return Math.random() - 0.5;
  });

  var html = "";

  for (var i = 0; i < Math.min(numPosts, entries.length); i++) {
    var entry = entries[i];
    var title = entry.title.$t.replace(/\|/g, " - ");
    var link = "#";

    for (var j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel === "alternate") {
        link = entry.link[j].href;
        break;
      }
    }

    html += '<li><a href="' + link + '">' + title + '</a></li>';
  }

  ul.innerHTML = html;
}

(function() {
  var script = document.createElement("script");
  script.src = "https://www.holybooks.in/feeds/posts/default?alt=json-in-script&callback=showAlsoRead&max-results=50";
  document.body.appendChild(script);
})();
