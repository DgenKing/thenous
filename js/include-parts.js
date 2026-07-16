/**
 * Include Parts - Dynamic HTML Partial Loader
 *
 * This script dynamically loads HTML partials (header, footer, etc.)
 * into elements with the data-include attribute.
 *
 * Features:
 * - Automatic loading on DOM ready
 * - localStorage caching for performance
 * - Error handling and graceful degradation
 * - Cache versioning support
 *
 * Usage:
 * <div data-include="/partials/header.html"></div>
 */

(function() {
    'use strict';

    // Configuration
    const CACHE_VERSION = '1.0';
    const CACHE_PREFIX = 'include_';
    const CACHE_DURATION = 3600000; // 1 hour in milliseconds

    /**
     * Get cached HTML content from localStorage
     * @param {string} url - The URL of the partial to retrieve
     * @returns {string|null} - Cached HTML or null if not found/expired
     */
    function getCachedContent(url) {
        try {
            const cacheKey = CACHE_PREFIX + url;
            const cached = localStorage.getItem(cacheKey);

            if (!cached) {
                return null;
            }

            const data = JSON.parse(cached);

            // Check if cache is expired or version mismatch
            const now = new Date().getTime();
            if (data.version !== CACHE_VERSION || (now - data.timestamp) > CACHE_DURATION) {
                localStorage.removeItem(cacheKey);
                return null;
            }

            return data.content;
        } catch (error) {
            console.warn('Error reading from cache:', error);
            return null;
        }
    }

    /**
     * Save HTML content to localStorage cache
     * @param {string} url - The URL of the partial
     * @param {string} content - The HTML content to cache
     */
    function setCachedContent(url, content) {
        try {
            const cacheKey = CACHE_PREFIX + url;
            const data = {
                version: CACHE_VERSION,
                timestamp: new Date().getTime(),
                content: content
            };

            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
            // localStorage might be full or disabled
            console.warn('Error writing to cache:', error);
        }
    }

    /**
     * Fetch HTML partial from server
     * @param {string} url - The URL of the partial to fetch
     * @returns {Promise<string>} - Promise resolving to HTML content
     */
    async function fetchPartial(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();
            return content;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    /**
     * Load a single partial into an element
     * @param {HTMLElement} element - The element with data-include attribute
     */
    async function loadPartial(element) {
        const url = element.getAttribute('data-include');

        if (!url) {
            console.warn('Element has data-include attribute but no URL specified:', element);
            return;
        }

        try {
            // Try to get from cache first
            let content = getCachedContent(url);

            if (content) {
                // Use cached content
                element.innerHTML = content;
                element.removeAttribute('data-include'); // Mark as loaded
            } else {
                // Fetch from server
                content = await fetchPartial(url);

                // Insert content
                element.innerHTML = content;
                element.removeAttribute('data-include'); // Mark as loaded

                // Cache for future use
                setCachedContent(url, content);
            }
        } catch (error) {
            console.error(`Error loading partial ${url}:`, error);
            element.innerHTML = `<!-- Failed to load ${url} -->`;
            element.removeAttribute('data-include');
        }
    }

    /**
     * Load all partials on the page
     */
    async function loadAllPartials() {
        const elements = document.querySelectorAll('[data-include]');

        if (elements.length === 0) {
            return;
        }

        // Load all partials in parallel
        const promises = Array.from(elements).map(element => loadPartial(element));

        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error loading partials:', error);
        }
    }

    /**
     * Clear all cached partials (useful for debugging)
     */
    function clearCache() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('Cache cleared successfully');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    // Expose clearCache function globally for debugging
    window.clearIncludeCache = clearCache;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllPartials);
    } else {
        // DOM already loaded
        loadAllPartials();
    }

})();
