(function () {
  "use strict";

  // ---------- Mobile menu ----------
  var menuBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var menu = document.querySelector("[data-mobile-menu]");
  var menuLinks = menu ? menu.querySelectorAll("a") : [];

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  menuLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });

  // Close the mobile menu if the viewport grows past the mobile breakpoint.
  var mq = window.matchMedia("(max-width: 899px)");
  function handleBreakpointChange(e) {
    if (!e.matches) closeMenu();
  }
  if (mq.addEventListener) mq.addEventListener("change", handleBreakpointChange);
  else mq.addListener(handleBreakpointChange);

  // ---------- Hero pointer-follow glow ----------
  var hero = document.querySelector("[data-hero]");
  if (hero) {
    window.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      hero.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  // ---------- Scroll reveal ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if ("IntersectionObserver" in window) {
    revealEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s cubic-bezier(.2,.7,.3,1), transform .5s cubic-bezier(.2,.7,.3,1)";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var idx = Math.min(siblings.indexOf(el), 5);
        el.style.transitionDelay = (idx > 0 ? idx * 60 : 0) + "ms";
        el.style.opacity = "1";
        el.style.transform = "none";
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.style.opacity = "1"; });
  }
})();
