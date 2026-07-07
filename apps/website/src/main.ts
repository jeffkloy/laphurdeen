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

// The hero photos start on a random shore: pull the whole rotation back by
// a random slot, +2s so the first paint lands inside a slot's full-opacity
// window instead of mid-crossfade. Without JS the offset stays 0 (photo 1).
const photos = document.querySelector<HTMLElement>(".hero-photos");
if (photos) {
  const slot = Math.floor(Math.random() * photos.children.length);
  photos.style.setProperty("--turn-offset", `${-(slot * 8 + 2)}s`);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    (photos.children[slot] as HTMLElement).style.opacity = "1";
  }
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
