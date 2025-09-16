// Get the current year and display it in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// New: Hamburger menu functionality and mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    // Toggle the mobile navigation menu on click
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close the menu and navigate when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Make the entire list item clickable for navigation
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Check if the click target is the list item itself
            if (event.target.tagName === 'LI') {
                const link = item.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Existing: Script for active navigation link
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.sticky-nav nav a');

    const removeActiveLinks = () => {
        navLinksList.forEach(link => {
            link.parentElement.classList.remove('active-nav');
        });
    };

    const setActiveLink = (current) => {
        removeActiveLinks();
        const activeLink = document.querySelector(`.sticky-nav nav a[data-section="${current}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active-nav');
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                setActiveLink(sectionId);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: "-50px 0px -50px 0px"
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Existing: Script for dynamic parallax background scroll effect
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    
    if (scrolled < hero.offsetHeight) {
        const translateY = scrolled * 0.4;
        hero.style.backgroundPositionY = `${-translateY}px`;
    }
});