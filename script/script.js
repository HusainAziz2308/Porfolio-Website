document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const heroPanel = document.getElementById('hero');
    const heroBgImage = heroPanel.getAttribute('data-bg-image');
    if (heroPanel && heroBgImage) {
        // Set background image via CSS variable for smoother parallax/manipulation
        heroPanel.style.setProperty('--bg-img', `url('${heroBgImage}')`);
    }

    const fixedNav = document.querySelector('.fixed-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenuToggle = document.querySelector('.close-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-overlay a');
    
    // --- 1. Navigation & Scroll Effects ---
    
    // Parallax & Sticky Nav Scroll Handler
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        // Parallax Effect
        if (heroPanel) {
            // Adjust background position for the parallax effect
            heroPanel.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }

        // Add 'scrolled' class to fixed nav
        if (scrollPosition > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    closeMenuToggle.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 2. Project Modal (Pop-up) ---

    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn-custom');
    
    const modalImg = document.getElementById('modal-project-img');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalDescription = document.getElementById('modal-project-description');
    const modalLink = document.getElementById('modal-project-link');

    document.querySelectorAll('.work-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent default navigation for items that don't link to the detail page
            const isProjectPageLink = item.getAttribute('href') === 'pages/project-detail.html';
            
            // If it's a link to the detail page, let it navigate normally
            if (isProjectPageLink || item.classList.contains('video-item')) {
                 // For video items or direct page links, we prevent the modal and let the default action happen
                 return;
            }

            e.preventDefault();

            const title = item.getAttribute('data-title');
            const category = item.getAttribute('data-category');
            const imgSrc = item.querySelector('.work-img') ? item.querySelector('.work-img').src : '';
            const linkHref = item.querySelector('a') ? item.querySelector('a').href : '#';

            // Populate Modal Content
            modalTitle.textContent = title;
            modalCategory.textContent = category;
            
            if (imgSrc) {
                // IMPORTANT: Since the JS is now inside /script/, the image paths need to be handled
                // We trust the HTML data-attribute and img src property which are already correct.
                modalImg.src = imgSrc; 
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }

            modalDescription.textContent = "This is a detailed description placeholder for the " + title + " project. Replace this text with the challenge, solution, and key technologies used.";

            modalLink.href = linkHref;
            modalLink.textContent = 'VIEW PROJECT';
            

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Lock scroll on body
        });
    });

    // Close Modal Logic
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 3. Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // IMPORTANT: Replace the action URL with your actual Formspree endpoint (it's in the HTML)
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'SENDING...';
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = 'MESSAGE SENT! I will be in touch soon.';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'ERROR! Please try again or use social media.';
                }
            } catch (error) {
                formStatus.textContent = 'NETWORK ERROR! Please check your connection.';
            }
        });
    }

});