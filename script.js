"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinkItems
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navLinks.classList.remove("is-open");
    });
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = navLinkItems.find(
          (link) => link.getAttribute("href") === `#${entry.target.id}`,
        );
        if (!activeLink) return;
        navLinkItems.forEach((link) => link.classList.toggle("is-active", link === activeLink));
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  const revealGroups = [
    ".hero-copy > *",
    ".hero-visual",
    ".hero-index",
    ".tech-strip-inner > span",
    ".section-heading",
    ".about-body",
    ".expertise-intro > *",
    ".expertise-item",
    ".experience-heading > *",
    ".experience-entry",
    ".recognition-note",
    ".work-heading > *",
    ".project-feature",
    ".project-card",
    ".professional-project-card",
    ".work-note",
    ".skill-group",
    ".contact-main > *",
    ".contact-details > *",
  ];

  revealGroups.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    const siblingIndexes = new Map();

    elements.forEach((element) => {
      element.setAttribute("data-reveal", "");

      const parent = element.parentElement;
      const siblingIndex = siblingIndexes.get(parent) ?? 0;
      siblingIndexes.set(parent, siblingIndex + 1);
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 4) * 70}ms`);

      revealObserver.observe(element);
    });
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTopVisibility = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 400);
  };

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();
}
