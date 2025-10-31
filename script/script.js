/**
 * Aziz Husain Portfolio - Custom JavaScript & Lenis Scroll Setup
 * This script initializes the Lenis smooth scrolling library, the
 * Request Animation Frame (RAF) loop, and the Three.js 3D hero visualization.
 * * FIX: Moved updateProjectParallax from the global RAF loop to the Lenis scroll
 * event listener to prevent forced layout calculations on every frame.
 */

// --- LOADER CONTROL FUNCTIONS ---

/**
 * Displays the loading overlay with a fade-in effect.
 */
function showLoader() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // Use a short timeout to allow the display property to apply before starting the transition
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

/**
 * Hides the loading overlay with a fade-out effect.
 */
function hideLoader() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        // Hide the element completely after the transition finishes
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300); // This duration should match the CSS transition duration
    }
}

// Show the loader as soon as the script begins executing
showLoader();

// --- HIDE THE LOADER ---
// The loader is hidden once all page assets (images, scripts, etc.) have fully loaded.
// This provides a much smoother user experience than hiding it on DOMContentLoaded.
window.addEventListener('load', () => {
    hideLoader();
});
// Initialize Lenis with smooth, high-performance settings
// Loading external library: https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.45/dist/lenis.min.js
const lenis = new Lenis({
    duration: 1.2,
    wrapper: document.querySelector('#lenis-wrapper'), // Let Lenis know about the wrapper
    content: document.querySelector('#lenis-content'), // ...and the content
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Start the RAF loop immediately
// The `raf` function is now in animation.js and will be started below.

// --- 3. CORE LOGIC (Runs after DOM is ready) ---

document.addEventListener('DOMContentLoaded', () => {
    // Start Lenis listening for scroll inputs.
    lenis.start();
    
    // Initialize the 3D scene. This needs the external three.min.js library loaded.
    initThreeJS();

    // Start the unified Request Animation Frame loop, passing the Lenis instance.
    requestAnimationFrame((t) => raf(t, lenis));

    // Cache items for animation functions (defined in animation.js)
    // Note: `projectItems` and `revealItems` are global variables in animation.js
    projectItems = document.querySelectorAll('.project-item, .media-item');
    revealItems = document.querySelectorAll('.scroll-reveal');
    
    windowHalfY = window.innerHeight / 2; // This is used by animation functions

    // 3.1. Element References (Cached for efficient access)
    const currentYearEl = document.getElementById('current-year-main');
    const heroTitle = document.getElementById('hero-title');
    const scrollPrompt = document.querySelector('.scroll-down-prompt');
    
    // Mobile Menu Elements
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const menuCloseBtn = document.querySelector('.close-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = mobileNavOverlay ? mobileNavOverlay.querySelectorAll('a') : [];
    
    // Set Footer Year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // --- Mobile Menu Toggle Logic ---
    function toggleMobileMenu(isOpen) {
        if (mobileNavOverlay) {
            if (isOpen) {
                mobileNavOverlay.classList.add('open');
                lenis.stop(); // Stop Lenis from scrolling the background
            } else {
                mobileNavOverlay.classList.remove('open');
                lenis.start(); // Resume background scrolling
            }
        }
    }

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close menu and scroll on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            // Check if the link is an internal anchor link (starts with #)
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    toggleMobileMenu(false);
                    // Use Lenis to scroll to the section
                    lenis.scrollTo(targetElement, { offset: -80, duration: 1 });
                }
            } else if (targetId) {
                // For external or relative links, just navigate
                toggleMobileMenu(false);
                window.location.href = targetId;
            }
        });
    });
    // --- End Mobile Menu Toggle Logic ---


    // 3.2. Scroll Event Listener (Handles parallax and effects)
    lenis.on('scroll', ({ scroll, limit }) => {
        
        // Parallax Effect: Fade out Hero Title 
        if (heroTitle) {
            const opacity = 1 - (scroll / 300); 
            heroTitle.style.opacity = Math.max(0, opacity);
            // Translate the title slightly up for a smooth entry/exit
            heroTitle.style.transform = `translateY(${scroll * 0.3}px)`;
        }

        // Parallax Effect: Fade out Scroll Prompt
        if (scrollPrompt) {
            const opacity = 1 - (scroll / 100); 
            scrollPrompt.style.opacity = Math.max(0, opacity);
        }
        
        // Update parallax for project images
        updateProjectParallax();
        
        // Trigger scroll-reveal animations
        revealElementsOnScroll();
        // 3.3. Three.js Scroll Parallax (Move the 3D shape opposite to scroll)
        if (mesh) {
            // Apply a slight vertical shift to the mesh as the user scrolls
            mesh.position.y = -scroll * 0.001; 
        }
    });

    // 3.4. Smooth Anchor Links (Desktop/General)
    const desktopLinks = document.querySelectorAll('nav.desktop-links a[href^="#"]');
    
    desktopLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -80, duration: 1 });
            }
        });
    });

    // Run an initial check for any elements that are already in the viewport on load
    revealElementsOnScroll();
});
