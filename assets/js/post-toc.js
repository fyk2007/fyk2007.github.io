(function () {
  var article = document.querySelector(".post-body");
  var toc = document.getElementById("post-toc");

  if (!article || !toc) {
    return;
  }

  var headings = article.querySelectorAll("h2, h3");

  if (!headings.length) {
    toc.innerHTML = "<p class=\"toc-empty\">本文暂无章节标题</p>";
    return;
  }

  var slugCounts = {};

  function slugify(text) {
    var base = text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!base) {
      base = "section";
    }

    if (!slugCounts[base]) {
      slugCounts[base] = 0;
    }

    slugCounts[base] += 1;
    return slugCounts[base] > 1 ? base + "-" + slugCounts[base] : base;
  }

  var list = document.createElement("ul");

  headings.forEach(function (heading) {
    if (!heading.id) {
      heading.id = slugify(heading.textContent || "");
    }

    var item = document.createElement("li");
    item.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";

    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + heading.id);
    });

    item.appendChild(link);
    list.appendChild(item);
  });

  toc.innerHTML = "";
  toc.appendChild(list);

  var links = toc.querySelectorAll("a");

  function updateActiveLink() {
    var activeId = "";

    headings.forEach(function (heading) {
      var rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        activeId = heading.id;
      }
    });

    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
})();
