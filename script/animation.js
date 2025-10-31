/**
 * Aziz Husain Portfolio - Animation Logic
 * This script handles:
 * 1. Three.js scene initialization and animation.
 * 2. Parallax effects for project images on scroll.
 * 3. Scroll-reveal animations for content sections.
 */

// --- 1. GLOBAL ANIMATION VARIABLES ---
let scene, camera, renderer, mesh, canvas;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let projectItems = [];
let revealItems = [];

/**
 * Three.js Setup Function
 */
function initThreeJS() {
    // Check if the required library (Three.js) is loaded
    if (typeof THREE === 'undefined') {
        console.error("Three.js not loaded. Cannot initialize 3D scene.");
        return;
    }
    
    canvas = document.getElementById('main-3d-canvas');
    if (!canvas) return;

    // SCENE
    scene = new THREE.Scene();
    
    // CAMERA
    const fov = window.innerWidth > 768 ? 60 : 75;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // GEOMETRY
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    
    // MATERIAL
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF3B00,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); 
    scene.add(ambientLight);
    
    // EVENT LISTENERS
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

/**
 * Handle Window Resize for Responsiveness
 */
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera) {
        const fov = window.innerWidth > 768 ? 60 : 75;
        camera.fov = fov; 
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
 */
function animateThree() {
    if (!mesh || !renderer || !camera) return;

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.002;
    
    const targetRotationX = -mouseY * 0.5;
    const targetRotationY = -mouseX * 0.5;

    mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;

    renderer.render(scene, camera);
}

/**
 * Function to handle the parallax effect for project items.
 */
function updateProjectParallax() {
    projectItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        const center = rect.top + rect.height / 2;
        const distance = center - windowHalfY;
        const parallaxStrength = distance * 0.2; 
        
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = `translateY(${parallaxStrength}px) translateZ(0)`;
        }
    });
}

/**
 * Scroll Reveal Animation Logic
 */
function revealElementsOnScroll() {
    // Define the vertical range in the viewport where items should be visible.
    // Items entering this range will become visible, and items leaving it will hide.
    const revealThresholdTop = window.innerHeight * 0.15; // Hide when top is above 15% of viewport height
    const revealThresholdBottom = window.innerHeight * 0.85; // Reveal when top is below 85% of viewport height

    revealItems.forEach(item => {
        const rect = item.getBoundingClientRect();

        // Check if the element is within the visible portion of the viewport
        if (rect.top < revealThresholdBottom && rect.bottom > revealThresholdTop) {
            // Element is in view, add 'visible' class if it doesn't have it
            if (!item.classList.contains('visible')) {
                item.classList.add('visible');
            }
        } else {
            // Element is out of view, remove 'visible' class if it has it
            item.classList.remove('visible');
        }
    });
}

/**
 * Request Animation Frame (RAF) Loop for animations.
 * This is now started from the main script.js file.
 * @param {number} time - The current time provided by requestAnimationFrame.
 * @param {object} lenisInstance - The active Lenis instance.
 */
function raf(time, lenisInstance) {
    if (lenisInstance) {
        lenisInstance.raf(time);
    }
    
    if (renderer) {
        animateThree();
    }

    requestAnimationFrame((t) => raf(t, lenisInstance));
}