import "./style.css";

// Signals that JS is running: reveal styles apply only under .js so the
// page never hides content when scripts are unavailable.
document.documentElement.classList.add("js");

const header = document.querySelector<HTMLElement>(".site-header");
const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");

if (header && toggle) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the mobile menu when a section link is chosen.
  header.querySelectorAll(".site-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }),
  );
}

const revealed = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealed.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll("[data-reveal]").forEach((el) => revealed.observe(el));
