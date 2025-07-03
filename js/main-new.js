/**
 * SHRIMP TECH Website - Main JavaScript Entry Point
 * Khởi tạo tất cả components và chức năng chính
 */

// Performance timing start
const perfStart = performance.now();
window.perfStart = perfStart;

// Function để khởi tạo chatbot (được gọi từ chatbot-loader)
window.initChatbot = function() {
    const chatbotWidget = document.getElementById('chatbot-widget');
    
    if (chatbotWidget) {
        new Chatbot();
        console.log('✅ Chatbot initialized successfully');
    } else {
        console.warn('⚠️ Chatbot widget not found in DOM');
    }
};

// Initialize chatbot if widget already exists (fallback)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatbot-widget')) {
        new Chatbot();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ButtonAnimations();
    new LoadingAnimations();
    new FormHandler();
    new ScrollAnimations();
    new PerformanceMonitor();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content is available, show update notification
                                    console.log('New content is available; please refresh.');
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Handle page visibility changes (for F5 optimization)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, check for updates
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'CHECK_UPDATE'
                });
            }
        }
    });
    
    // Add CSS for animations and styles
    addDynamicStyles();
});

// Function to add dynamic CSS styles
function addDynamicStyles() {
    if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }
            
            .error-message {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
            
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            /* F5 Refresh Optimization */
            body.fast-reload * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) */
            html[style*="visibility: hidden"] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            
            html[style*="visibility: visible"] {
                opacity: 1;
            }
            
            /* Team Grid Responsive Layout */
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .team-member {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .team-member:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .member-avatar {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #0066cc, #3385d6);
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .team-member h4 {
                color: #0066cc;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .team-member p {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .team-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .team-member {
                    padding: 1rem;
                }
                
                .member-avatar {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
            
            /* Hero Section Responsive Improvements */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.2rem !important;
                    line-height: 1.2 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-break {
                    display: block !important;
                }
                
                .hero-description {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin-bottom: 1.5rem !important;
                }
                
                .hero-stats {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    margin-bottom: 2rem !important;
                }
                
                .hero-stat {
                    text-align: center !important;
                    min-width: auto !important;
                }
                
                .hero-buttons {
                    flex-direction: column !important;
                    gap: 1rem !important;
                    width: 100% !important;
                }
                
                .hero-buttons .btn {
                    width: 100% !important;
                    justify-content: center !important;
                    padding: 12px 20px !important;
                }
                
                .hero-container {
                    grid-template-columns: 1fr !important;
                    gap: 2rem !important;
                    text-align: center !important;
                }
                
                .hero-visual {
                    order: -1 !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 280px !important;
                    height: auto !important;
                }
            }
            
            @media (max-width: 480px) {
                .hero {
                    padding: 80px 0 40px !important;
                }
                
                .hero-title {
                    font-size: 1.8rem !important;
                    margin-bottom: 0.8rem !important;
                }
                
                .hero-description {
                    font-size: 0.9rem !important;
                    margin-bottom: 1.2rem !important;
                }
                
                .hero-badge {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                    margin-bottom: 1rem !important;
                }
                
                .hero-image img {
                    max-width: 240px !important;
                }
                
                .feature-pill {
                    font-size: 0.8rem !important;
                    padding: 6px 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for use in other scripts
window.ShrimpTech = {
    Navigation,
    ButtonAnimations,
    LoadingAnimations,
    FormHandler,
    Utils,
    ScrollAnimations,
    PerformanceMonitor,
    Chatbot
};
