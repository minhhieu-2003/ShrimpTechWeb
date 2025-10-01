/**
 * Emergency Service Worker Cleaner
 * Run this once to clear problematic service worker on production
 * Add this temporarily to contact.html header
 */

(function() {
    'use strict';
    
    // Only run on production domains
    if (window.location.hostname.includes('shrimptech') || 
        window.location.hostname.includes('web.app') ||
        window.location.hostname.includes('firebaseapp.com')) {
        
        console.log('🚨 Emergency SW Cleaner: Production detected, clearing old service workers...');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                let cleared = 0;
                registrations.forEach(function(registration) {
                    registration.unregister().then(function(success) {
                        if (success) {
                            cleared++;
                            console.log('🗑️ Cleared service worker:', registration.scope);
                        }
                    });
                });
                
                if (cleared > 0) {
                    console.log(`✅ Cleared ${cleared} service worker(s)`);
                    // Set a flag so this only runs once
                    sessionStorage.setItem('sw-emergency-cleared', 'true');
                }
            }).catch(function(error) {
                console.error('❌ Error clearing service workers:', error);
            });
        }
        
        // Clear problematic caches
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    // Clear old caches that might cause issues
                    if (cacheName.includes('shrimptech') || cacheName.includes('emergency')) {
                        caches.delete(cacheName).then(function(success) {
                            if (success) {
                                console.log('🗑️ Cleared cache:', cacheName);
                            }
                        });
                    }
                });
            });
        }
    }
})();