/**
 * COURAGE REPS V2 - Sticky Navigation
 * Hides on scroll down, shows on scroll up
 */

(function() {
    'use strict';

    let lastScrollTop = 0;
    let ticking = false;
    const nav = document.getElementById('sticky-nav');
    const threshold = 50; // Minimum scroll before hiding

    if (!nav) return;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < threshold) {
            // Always show near top
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        } else if (scrollTop > lastScrollTop) {
            // Scrolling down
            nav.classList.remove('nav-visible');
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });

    // Initialize
    nav.classList.add('nav-visible');
})();
