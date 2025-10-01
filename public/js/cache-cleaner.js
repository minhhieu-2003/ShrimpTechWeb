/**
 * Cache Cleaner Script
 * Force clear all browser caches and storage
 */

(function() {
    'use strict';
    
    console.log('🧹 Cache Cleaner Starting...');

    // Function to clear all caches
    async function clearAllCaches() {
        try {
            // Clear Service Worker caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                console.log('🗑️ Found caches:', cacheNames);
                
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log(`✅ Deleted cache: ${cacheName}`);
                }
            }

            // Clear localStorage
            if (typeof(Storage) !== "undefined") {
                localStorage.clear();
                console.log('✅ Cleared localStorage');
            }

            // Clear sessionStorage
            if (typeof(Storage) !== "undefined") {
                sessionStorage.clear();
                console.log('✅ Cleared sessionStorage');
            }

            // Clear IndexedDB
            if ('indexedDB' in window) {
                // Note: This is a simplified approach, full clearing would require knowing DB names
                console.log('ℹ️ IndexedDB clearing requires specific database names');
            }

            // Unregister Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    console.log('✅ Unregistered Service Worker');
                }
            }

            // Force reload to get fresh content (only in development)
            if (window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1') {
                
                console.log('🔄 Reloading page with fresh content...');
                
                // Add a flag to prevent infinite reload
                if (!sessionStorage.getItem('cache-cleared')) {
                    sessionStorage.setItem('cache-cleared', 'true');
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                } else {
                    console.log('🔄 Cache already cleared this session, skipping reload');
                }
            } else {
                console.log('🔄 Production mode - skipping auto reload');
            }

        } catch (error) {
            console.error('❌ Error clearing caches:', error);
        }
    }

    // Clear emergency widget specific cache/storage
    function clearEmergencyWidgetData() {
        // Remove any stored emergency widget data
        const keysToRemove = [
            'emergency-widget',
            'support-widget', 
            'shrimptech-emergency',
            'emergency-contact',
            'support-contact'
        ];

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        // Clear any emergency-related cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });

        console.log('✅ Cleared emergency widget data');
    }

    // Add meta tag to prevent caching
    function addNoCacheHeaders() {
        const meta1 = document.createElement('meta');
        meta1.httpEquiv = 'Cache-Control';
        meta1.content = 'no-cache, no-store, must-revalidate';
        document.head.appendChild(meta1);

        const meta2 = document.createElement('meta');
        meta2.httpEquiv = 'Pragma';
        meta2.content = 'no-cache';
        document.head.appendChild(meta2);

        const meta3 = document.createElement('meta');
        meta3.httpEquiv = 'Expires';
        meta3.content = '0';
        document.head.appendChild(meta3);

        console.log('✅ Added no-cache headers');
    }

    // Only run cache cleaner on localhost/development
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.includes('localhost')) {
        
        console.log('🧹 Cache Cleaner: Development mode detected, clearing caches...');
        
        // Execute clearing functions
        clearEmergencyWidgetData();
        addNoCacheHeaders();
        
        // Clear all caches after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', clearAllCaches);
        } else {
            clearAllCaches();
        }

        console.log('🧹 Cache Cleaner Activated - All caches will be cleared');
    } else {
        console.log('🧹 Cache Cleaner: Production mode - skipping auto cache clear');
    }
})();