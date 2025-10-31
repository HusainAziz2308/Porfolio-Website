/**
 * Aziz Husain Portfolio - Custom JavaScript & Lenis Scroll Setup
 * This script initializes the Lenis smooth scrolling library, the
 * Request Animation Frame (RAF) loop, and the Three.js 3D hero visualization.
 */

// --- 1. GLOBAL THREE.JS VARIABLES ---
let scene, camera, renderer, mesh, canvas;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
// Store project items globally so they can be accessed by the parallax function
let projectItems = []; 

// --- 2. LENIS SMOOTH SCROLL INITIALIZATION ---

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
 * Three.js Setup Function
 */
function initThreeJS() {
    canvas = document.getElementById('main-3d-canvas');
    if (!canvas) return;

    // SCENE
    scene = new THREE.Scene();
    
    // CAMERA
    // Adjust FOV based on screen size for better perspective
    const fov = window.innerWidth > 768 ? 60 : 75;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true // Important: makes background transparent to see CSS
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // GEOMETRY (Icosahedron: a complex, aesthetically pleasing shape)
    const geometry = new THREE.IcosahedronGeometry(2, 0); // Radius 2, detail 0
    
    // MATERIAL (Wireframe for the technical/programmer look)
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF3B00, // Using the accent color for the wireframe
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // LIGHTS (Minimal, since the material is MeshBasicMaterial)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); 
    scene.add(ambientLight);
    
    // EVENT LISTENERS
    window.addEventListener('resize', onWindowResize, false);
    // Mouse movement for subtle camera/mesh rotation
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

/**
 * Handle Window Resize for Responsiveness
 */
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

/**
 * Handle Mouse Movement for Parallax/Rotation
 */
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.005;
    mouseY = (event.clientY - windowHalfY) * 0.005;
}


/**
 * Three.js Animation/Render Loop
 * Updates the mesh position, rotation, and renders the scene.
 */
function animateThree() {
    if (!mesh || !renderer || !camera) return;

    // 1. Mesh Rotation/Update
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.002;
    
    // 2. Mouse Parallax Effect (subtle rotation based on mouse position)
    const targetRotationX = -mouseY * 0.5;
    const targetRotationY = -mouseX * 0.5;

    mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;

    // 3. Render the Scene
    renderer.render(scene, camera);
}


/**
 * Function to handle the parallax effect for project items.
 * Uses getBoundingClientRect to determine the item's position relative to the viewport.
 */
function updateProjectParallax() {
    projectItems.forEach(item => {
        // Only run for items currently in or near the viewport for performance
        const rect = item.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        // Calculate the center position of the item relative to the viewport
        const center = rect.top + rect.height / 2;
        
        // Calculate the distance from the viewport center
        const distance = center - window.innerHeight / 2;
        
        // Parallax strength factor (0.2 is subtle)
        // We use a positive factor so the image moves opposite to the scroll direction
        const parallaxStrength = distance * 0.2; 
        
        const img = item.querySelector('img');
        if (img) {
            // Apply parallax translation. Using translate3d for GPU acceleration.
            img.style.transform = `translateY(${parallaxStrength}px) translateZ(0)`;
        }
    });
}


/**
 * Request Animation Frame (RAF) Loop (Single, Unified Loop)
 * This loop updates BOTH Lenis and the Three.js scene every frame.
 */
function raf(time) {
    lenis.raf(time);
    
    // Integrate Three.js animation here
    if (renderer) {
        animateThree();
    }

    // Since Lenis controls scroll, this is where we call the image parallax
    updateProjectParallax();

    requestAnimationFrame(raf);
}

// Start the RAF loop immediately
requestAnimationFrame(raf);


// --- 3. CORE LOGIC (Runs after DOM is ready) ---

document.addEventListener('DOMContentLoaded', () => {
    // Start Lenis listening for scroll inputs.
    lenis.start();
    
    // Initialize the 3D scene
    initThreeJS();

    // Cache project items for parallax function
    projectItems = document.querySelectorAll('.project-item');

    // 3.1. Element References (Cached for efficient access)
    const currentYearEl = document.getElementById('current-year-main');
    const heroTitle = document.getElementById('hero-title');
    const scrollPrompt = document.querySelector('.scroll-down-prompt');
    
    // Mobile Menu Elements
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const menuCloseBtn = document.querySelector('.close-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = mobileNavOverlay.querySelectorAll('a');
    
    // Set Footer Year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // --- Mobile Menu Toggle Logic ---
    function toggleMobileMenu(isOpen) {
        if (isOpen) {
            mobileNavOverlay.classList.add('open');
            lenis.stop(); // Stop Lenis from scrolling the background
        } else {
            mobileNavOverlay.classList.remove('open');
            lenis.start(); // Resume background scrolling
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
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    toggleMobileMenu(false);
                    // Use Lenis to scroll to the section
                    lenis.scrollTo(targetElement, { offset: -80, duration: 1 });
                }
            } else {
                // For links like "../index.html#section", just navigate
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
});
