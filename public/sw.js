/**
 * Service Worker for SHRIMPTECH
 * Caches static assets, provides offline functionality, and enforces security headers
 */

const CACHE_NAME = 'shrimptech-v1.0.3-clear-emergency';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/pages/contact.html',
    '/pages/team.html',
    '/pages/solutions.html',
    '/pages/products.html',
    '/pages/partners.html',
    '/styles.css',
    '/js/main.js',
    '/js/navigation.js',
    '/js/scroll-animations.js',
    '/js/security-config.js',
    '/js/input-validator.js',
    '/assets/Logo.jpg',
    '/assets/hero-dashboard.svg'
];

// Security headers to add to all responses
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
};

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('❌ Service Worker: Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('✅ Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network-first strategy for better sync between F5 and Ctrl+Shift+R
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and API calls
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
        return;
    }

    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network-first strategy for better cache synchronization
    event.respondWith(
        fetch(event.request)
            .then(response => {
                console.log('🌐 Service Worker: Fresh from network:', event.request.url);
                
                // Don't cache error responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return addSecurityHeaders(response);
                }

                // Cache successful responses but with shorter TTL
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                
                return addSecurityHeaders(response);
            })
            .catch(error => {
                console.warn('⚠️ Service Worker: Network failed, trying cache:', error.message);
                
                // Fallback to cache only when network fails
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            console.log('📋 Service Worker: Serving from cache (offline):', event.request.url);
                            return addSecurityHeaders(response);
                        }
                        
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html') || createOfflineResponse();
                        }
                        
                        throw error;
                    });
            })
    );
});

// Function to add security headers to response
function addSecurityHeaders(response) {
    if (!response) return response;
    
    const newHeaders = new Headers(response.headers);
    
    // Add security headers
    Object.entries(SECURITY_HEADERS).forEach(([name, value]) => {
        newHeaders.set(name, value);
    });
    
    // Add cache control for better F5/Ctrl+Shift+R sync
    if (response.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
        // Shorter cache for static assets to improve F5 refresh behavior
        newHeaders.set('Cache-Control', 'public, max-age=3600, must-revalidate'); // 1 hour with revalidation
    } else {
        // HTML files should always check for updates
        newHeaders.set('Cache-Control', 'no-cache, must-revalidate');
    }
    
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}

// Create offline response with security headers
function createOfflineResponse() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - SHRIMPTECH</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: #f5f5f5; 
                }
                .offline-container { 
                    max-width: 500px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                }
                .icon { font-size: 64px; margin-bottom: 20px; }
                h1 { color: #333; margin-bottom: 20px; }
                p { color: #666; line-height: 1.5; }
                .retry-btn { 
                    background: #0066cc; 
                    color: white; 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    margin-top: 20px; 
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="icon">🌐</div>
                <h1>Bạn đang offline</h1>
                <p>Không thể kết nối đến SHRIMPTECH. Vui lòng kiểm tra kết nối internet và thử lại.</p>
                <button class="retry-btn" onclick="window.location.reload()">Thử lại</button>
            </div>
        </body>
        </html>
    `;
    
    const headers = new Headers({
        'Content-Type': 'text/html',
        ...SECURITY_HEADERS
    });
    
    return new Response(offlineHTML, { headers });
}

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Handle security policy violations
self.addEventListener('securitypolicyviolation', event => {
    console.error('🔒 CSP Violation in Service Worker:', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        documentURI: event.documentURI
    });
    
    // Report violation to server in production
    if (self.location.hostname !== 'localhost') {
        fetch('/api/security/csp-violation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                violatedDirective: event.violatedDirective,
                blockedURI: event.blockedURI,
                documentURI: event.documentURI,
                timestamp: new Date().toISOString(),
                userAgent: self.navigator.userAgent
            })
        }).catch(err => {
            console.error('Failed to report CSP violation:', err);
        });
    }
});

console.log('🚀 Service Worker: Registered successfully with security enhancements');