/**
 * The Pattern - Main JavaScript
 *
 * Custom JavaScript for interactive features and enhancements.
 * This file is loaded in the footer after Bootstrap JS.
 */

(function() {
    'use strict';

    /**
     * Initialize application when DOM is ready
     */
    function init() {
        console.log('The Pattern - Application Initialized');

        // Add your custom JavaScript here
        // Examples:
        // - Smooth scrolling
        // - Form validation
        // - Dynamic content loading
        // - Analytics tracking
        // - Interactive features
    }

    /**
     * Smooth scroll to anchor links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip empty anchors
                if (href === '#' || href === '#!') {
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Add active class to current nav link
     */
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href) && href !== '/') {
                link.classList.add('active');
            }
        });
    }

    /**
     * Add fade-in animation to elements as they enter viewport
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initSmoothScroll();

            // Wait a bit for header to load before highlighting
            setTimeout(highlightCurrentPage, 100);
        });
    } else {
        init();
        initSmoothScroll();
        setTimeout(highlightCurrentPage, 100);
    }

})();
