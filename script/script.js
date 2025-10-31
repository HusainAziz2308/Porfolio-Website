/**
 * Aziz Husain Portfolio - Custom JavaScript & Lenis Scroll Setup
 * This script initializes the Lenis smooth scrolling library and the
 * Request Animation Frame (RAF) loop needed for all scroll-driven animations.
 * Aziz Husain Portfolio - Main JavaScript File
 * This script handles:
 * 1. Lenis smooth scroll initialization for the entire site.
 * 2. Mobile navigation menu toggle functionality.
 * 3. Scroll-driven animations and effects.
 */

// --- 1. LENIS SMOOTH SCROLL INITIALIZATION ---

// Initialize Lenis with smooth, high-performance settings
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

/**
 * Request Animation Frame (RAF) Loop
 * This loop updates Lenis every frame, synchronizing it with the browser's render cycle.
 */
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

// Start the RAF loop immediately
requestAnimationFrame(raf);

// --- 2. CORE LOGIC (Runs after DOM is ready) ---

document.addEventListener('DOMContentLoaded', () => {
    // Explicitly start Lenis listening for scroll inputs.
    lenis.start();

    // 2.1. Element References (Cached for efficient access)
    // --- 1. ELEMENT REFERENCES (Cached for efficiency) ---
    const currentYearEl = document.getElementById('current-year-main');
    const currentYearDetailEl = document.getElementById('current-year-detail');
    const heroTitle = document.getElementById('hero-title');
    const scrollPrompt = document.querySelector('.scroll-down-prompt');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenuToggle = document.querySelector('.close-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-overlay a');
    
    // Set Footer Year
    // --- 2. INITIALIZATION & SETUP ---

    // Set Footer Year (works on any page)
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    if (currentYearDetailEl) {
        currentYearDetailEl.textContent = new Date().getFullYear();
    }
    
    // 2.2. Scroll Event Listener (Handles parallax and effects)
    lenis.on('scroll', ({ scroll, limit }) => {
        
        // Parallax Effect: Fade out Hero Title (Optimized for speed)
        if (heroTitle) {
            // Fades out the title over the first 300 pixels of scroll
            const opacity = 1 - (scroll / 300); 
            heroTitle.style.opacity = Math.max(0, opacity);
        }

        // Parallax Effect: Fade out Scroll Prompt
        if (scrollPrompt) {
            // Fades out the scroll prompt quickly over the first 100 pixels
            const opacity = 1 - (scroll / 100); 
            scrollPrompt.style.opacity = Math.max(0, opacity);
        }
    });

    // 2.3. Smooth Anchor Links
    // --- 3. EVENT LISTENERS ---
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="pages/"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Handle hash links (internal jumps) using Lenis
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Use Lenis to scroll smoothly to the target element's position
                    lenis.scrollTo(targetElement, { offset: -80, duration: 1 }); // -80 offset for the fixed header
                }
            } 
            // External HTML links will be handled by a page transition function later
        });
    });

    // --- 3. THREE.JS INITIALIZATION (To be implemented next) ---
    // Mobile Menu Toggle Logic
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });
    }

    if (closeMenuToggle && mobileNav) {
        closeMenuToggle.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    }

    // Close mobile menu when a link is clicked
    if (mobileNavLinks && mobileNav) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
            });
        });
    }
    
    // The main 3D visualization setup will go here, using the canvas element.
    // const canvas = document.getElementById('main-3d-canvas');
    // initThreeJS(canvas); 
    // Future Three.js initialization can go here
});
