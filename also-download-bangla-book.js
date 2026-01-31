var numPosts = 6;  // Number of links

function showAlsoRead(data) {
  var entries = data.feed.entry;
  var ul = document.getElementById("also-read");

  // Shuffle posts randomly
  entries.sort(() => 0.5 - Math.random());

  // Pick only numPosts
  entries.slice(0, numPosts).forEach(entry => {
    // Replace | with - in post title
    var title = entry.title.$t.replace(/\|/g, " - ");
    var link = entry.link.find(l => l.rel === "alternate").href;
    var li = document.createElement("li");
    li.innerHTML = '<a href="' + link + '" target="_blank">' + title + '</a>';
    ul.appendChild(li);
  });
}

// Load blog feed dynamically
(function() {
  var script = document.createElement('script');
  script.src = "https://bangla.pustakalay.in/feeds/posts/default?alt=json-in-script&callback=showAlsoRead";
  document.body.appendChild(script);
})();
