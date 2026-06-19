const numPosts = 6;

function showAlsoRead(json) {
  const container = document.getElementById("also-read");

  if (!container || !json.feed || !json.feed.entry) return;

  const entries = json.feed.entry.slice();

  // Randomize posts
  entries.sort(() => Math.random() - 0.5);

  container.innerHTML = "";

  entries.slice(0, numPosts).forEach(post => {
    const title = (post.title?.$t || "Untitled").replace(/\|/g, " - ");

    let link = "#";
    if (post.link) {
      const altLink = post.link.find(item => item.rel === "alternate");
      if (altLink) link = altLink.href;
    }

    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = link;
    a.textContent = title;
    a.title = title;
    a.rel = "noopener";

    li.appendChild(a);
    container.appendChild(li);
  });
}

(function () {
  const script = document.createElement("script");
  script.src = "https://holybooks.in/feeds/posts/default?alt=json-in-script&max-results=50&callback=showAlsoRead";
  document.body.appendChild(script);
})();
