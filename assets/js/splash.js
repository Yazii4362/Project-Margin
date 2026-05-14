gsap.fromTo(
  '.splash-blur',
  { opacity: 1 },
  { opacity: 0, duration: 2.8, ease: 'power2.out' }
);

gsap.from('#hero .hero-inner > *', {
  y: 24,
  opacity: 0,
  duration: 1.2,
  ease: 'power2.out',
  stagger: 0.08,
});

gsap.to('#hero', {
  opacity: 1,
  duration: 1.4,
  ease: 'power2.out',
});

if (window.ScrollSmoother && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollSmoother);
  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true,
    normalizeScroll: true,
    preventOverscroll: true,
  });
}

$(function () {
  // Hero screen only displays the initial greeting and envelope.
});
