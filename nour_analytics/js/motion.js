// Page motion: frosted header after scrolling and soft reveals as sections enter the screen.
// Nothing here runs for visitors who ask for reduced motion.
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (!calm && "IntersectionObserver" in window) {
  const targets = [
    ".split-head", ".promises article", ".section-head", ".board", ".list-title", ".offer",
    ".assistant", ".mentors article", ".timeline li", ".apply-grid > div", "#apply-form"
  ];
  const seen = new Map();
  const items = [];
  // The offer cards are drawn by js/app.js; wait a tick so they exist.
  requestAnimationFrame(() => {
    for (const sel of targets) {
      document.querySelectorAll(sel).forEach((el) => {
        const i = seen.get(el.parentElement) || 0;
        seen.set(el.parentElement, i + 1);
        el.style.setProperty("--d", `${Math.min(i, 4) * 0.1}s`);
        el.classList.add("reveal");
        items.push(el);
      });
    }
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    items.forEach((el) => io.observe(el));
  });
}
