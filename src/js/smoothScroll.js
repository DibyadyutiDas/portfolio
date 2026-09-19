/**
 * Slow, Luxurious Smooth Scrolling powered by Lenis
 * Provides smooth, slower inertial scroll speed for the whole page.
 */
(function () {
    if (typeof Lenis === 'undefined') return;

    // Respect reduced motion accessibility preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const lenis = new Lenis({
        duration: 1.8,          // Slower duration for graceful, silky scroll glides (default is ~1.2)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.65,  // Slower scroll velocity per wheel tick (default is 1.0)
        touchMultiplier: 1.2,
        infinite: false,
        autoResize: true
    });

    window.lenis = lenis;

    // Frame update loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Refresh AOS (Animate On Scroll) on Lenis scroll if present
    lenis.on('scroll', () => {
        if (window.AOS && typeof window.AOS.refresh === 'function') {
            window.AOS.refresh();
        }
    });
})();
