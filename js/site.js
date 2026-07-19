// site.js -- assembles the sidebar from org-export markup and handles
// the mobile toggle. No dependencies. Without this script the page
// renders as a plain single column.

(function () {
  var title = document.querySelector("h1.title");
  var toc = document.getElementById("table-of-contents");
  var social = document.querySelector(".social-icons");
  if (!title || !toc) return;

  var sidebar = document.createElement("nav");
  sidebar.className = "sidebar";
  sidebar.setAttribute("aria-label", "Site navigation");

  var toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Toggle navigation");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 4h12M2 8h12M2 12h12"/></svg>';
  toggle.addEventListener("click", function () {
    var open = sidebar.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  sidebar.appendChild(title);
  sidebar.appendChild(toggle);
  sidebar.appendChild(toc);
  if (social) {
    // strip the export's wrapping <p>, if any
    var wrapper = social.parentElement;
    sidebar.appendChild(social);
    if (wrapper && wrapper.tagName === "P" && wrapper.textContent.trim() === "") {
      wrapper.remove();
    }
  }
  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.classList.add("has-sidebar");

  // close the mobile panel when a nav link is chosen
  sidebar.addEventListener("click", function (e) {
    if (e.target.closest("a")) sidebar.classList.remove("open");
  });

  // highlight the section currently in view
  var links = toc.querySelectorAll('a[href^="#"]');
  var map = {};
  links.forEach(function (a) {
    var sec = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    var container = sec && sec.closest("div[class^=outline-]");
    if (container) map[container.id || sec.id] = a;
  });
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var a = map[entry.target.id];
          if (!a) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("active"); });
            a.classList.add("active");
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
