/* Small enhancements. The site still reads fine if this file fails to load. */
(function () {
  var root = document.documentElement;

  /* Day / night toggle */
  var themeBtn = document.getElementById("themeBtn");
  var themeLabel = document.getElementById("themeLabel");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.setAttribute("aria-pressed", t === "dark");
    themeLabel.textContent = t === "dark" ? "Day" : "Night";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0E0E0D" : "#F4F2EE");
  }
  applyTheme(root.getAttribute("data-theme") || "light");
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Mobile menu */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  /* Highlight current section in the nav, and gentle reveal */
  var links = nav.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); } });
    }, { threshold: 0.05 });
    document.querySelectorAll(".project, .timeline > li, .cred li, .fig-grid div").forEach(function (el) {
      el.classList.add("reveal"); rev.observe(el);
    });
  }

  /* Contact form (Formspree) with inline confirmation */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form && window.fetch) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "Sending…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) { form.reset(); status.textContent = "Thank you. Your message has been sent."; }
          else { status.textContent = "Sorry, that did not send. Please email me directly instead."; }
        })
        .catch(function () { status.textContent = "Sorry, that did not send. Please email me directly instead."; });
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
