/* ============================================================
   HELPFUL PETS — interactions
   Vanilla JS, no dependencies
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Preloader
     ------------------------------------------------------------ */
  const preloader = $("#preloader");
  let preloaderHidden = false;
  const hidePreloader = () => {
    if (preloaderHidden || !preloader) return;
    preloaderHidden = true;
    preloader.classList.add("is-done");
    window.setTimeout(() => preloader.remove(), 800);
  };
  window.addEventListener("load", () => window.setTimeout(hidePreloader, 500));
  window.setTimeout(hidePreloader, 2600);

  /* ------------------------------------------------------------
     Header + scroll progress
     ------------------------------------------------------------ */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const onScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------ */
  const burger = $("#navToggle");
  const mobileMenu = $("#mobileMenu");
  const setMenu = (open) => {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  burger?.addEventListener("click", () => {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  $$("a", mobileMenu || document.createElement("div")).forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------ */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    const revealInView = () => {
      revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add("is-visible");
        }
      });
    };
    revealInView();
    window.addEventListener("load", revealInView, { once: true });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------
     Scroll spy for nav
     ------------------------------------------------------------ */
  const navLinks = $$(".nav__links a");
  const spySections = $$("main section[id]").filter((section) =>
    navLinks.some((link) => link.getAttribute("href") === `#${section.id}`)
  );

  if (navLinks.length && spySections.length) {
    let queued = false;
    const updateSpy = () => {
      queued = false;
      const line = window.innerHeight * 0.38;
      let activeId = null;
      for (const section of spySections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          activeId = section.id;
          break;
        }
      }
      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`)
      );
    };
    const queueSpy = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(updateSpy);
    };
    window.addEventListener("scroll", queueSpy, { passive: true });
    window.addEventListener("resize", queueSpy);
    updateSpy();
  }

  /* ------------------------------------------------------------
     Build progress — animate the bar into place
     ------------------------------------------------------------ */
  const buildBar = $(".build-bar span");
  if (buildBar && !reduceMotion) {
    buildBar.style.width = "0%";
    window.setTimeout(() => {
      buildBar.style.width = "72%";
    }, 650);
  }

  /* ------------------------------------------------------------
     Horizontal scrollers — drag, arrows, dots
     ------------------------------------------------------------ */
  function setupScroller(el, prevBtn, nextBtn, dotsEl) {
    if (!el) return;
    const cards = Array.from(el.children).filter((child) => child.nodeType === 1);
    if (!cards.length) return;

    const getGap = () => {
      const styles = getComputedStyle(el);
      return parseFloat(styles.columnGap || styles.gap || "0") || 0;
    };
    const step = () => cards[0].getBoundingClientRect().width + getGap();
    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

    let dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = "";
      cards.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.className = "is-active";
        dotsEl.appendChild(dot);
      });
      dots = Array.from(dotsEl.children);
    }

    const update = () => {
      const max = maxScroll();
      const index = Math.round(el.scrollLeft / step());
      if (dots.length) {
        const safe = Math.max(0, Math.min(index, dots.length - 1));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === safe));
      }
      if (prevBtn) prevBtn.disabled = el.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = el.scrollLeft >= max - 2;
    };

    prevBtn?.addEventListener("click", () =>
      el.scrollBy({ left: -step(), behavior: "smooth" })
    );
    nextBtn?.addEventListener("click", () =>
      el.scrollBy({ left: step(), behavior: "smooth" })
    );

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Pointer drag on desktop. Touch devices use native scrolling.
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    });
    const endDrag = () => {
      down = false;
      el.classList.remove("is-dragging");
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerleave", endDrag);
    el.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true
    );

    update();
    window.addEventListener("load", update, { once: true });
  }

  const petScroll = $("#petScroll");
  setupScroller(petScroll, $("#petPrev"), $("#petNext"), $("#petDots"));
  setupScroller($("#screensScroll"), null, null, null);
  setupScroller($("#careScroll"), null, null, null);

  /* ------------------------------------------------------------
     Footer year
     ------------------------------------------------------------ */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
