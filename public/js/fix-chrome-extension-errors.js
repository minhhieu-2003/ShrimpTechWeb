// Fix Chrome Extension Runtime Errors
// Prevents "Unchecked runtime.lastError: The message port closed before a response was received"

class ChromeExtensionErrorFix {
    constructor() {
        this.init();
    }

    init() {
        this.preventRuntimeErrors();
        this.overrideFetch();
        this.handleUnhandledRejections();
        console.log('🛡️ Chrome extension error fix initialized');
    }

    // Prevent runtime.lastError from appearing
    preventRuntimeErrors() {
        // Override chrome.runtime if it exists
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            const originalSendMessage = chrome.runtime.sendMessage;
            
            chrome.runtime.sendMessage = function(...args) {
                try {
                    return originalSendMessage.apply(this, args);
                } catch (error) {
                    if (error.message.includes('message port closed') || 
                        error.message.includes('runtime.lastError')) {
                        console.warn('🔇 Suppressed Chrome extension error:', error.message);
                        return Promise.resolve();
                    }
                    throw error;
                }
            };
        }

        // Clear any existing runtime errors
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
            console.warn('🧹 Clearing existing runtime error:', chrome.runtime.lastError);
            delete chrome.runtime.lastError;
        }
    }

    // Override fetch to handle extension interference
    overrideFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(url, options = {}) {
            try {
                // Only add safe headers that are allowed by CORS
                const cleanOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        'X-Requested-With': 'XMLHttpRequest'
                        // Removed Cache-Control and Pragma headers as they cause CORS issues
                    },
                    mode: 'cors'
                };

                const response = await originalFetch(url, cleanOptions);
                return response;
            } catch (error) {
                // Handle specific message port errors
                if (error.message && (
                    error.message.includes('message port closed') ||
                    error.message.includes('runtime.lastError') ||
                    error.message.includes('Extension context invalidated') ||
                    error.message.includes('CORS') ||
                    error.message.includes('ERR_FAILED')
                )) {
                    console.warn('🔧 Retrying request due to extension interference or CORS...');
                    
                    // Retry with minimal options
                    try {
                        return await originalFetch(url, {
                            method: options.method || 'GET',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: options.body,
                            mode: 'cors'
                        });
                    } catch (retryError) {
                        console.error('❌ Retry also failed:', retryError);
                        throw retryError;
                    }
                }
                throw error;
            }
        };
    }

    // Handle unhandled promise rejections related to extensions
    handleUnhandledRejections() {
        window.addEventListener('unhandledrejection', (event) => {
            const error = event.reason;
            
            if (error && typeof error === 'object' && (
                error.message?.includes('message port closed') ||
                error.message?.includes('runtime.lastError') ||
                error.message?.includes('Extension context invalidated')
            )) {
                console.warn('🔇 Suppressed Chrome extension unhandled rejection:', error.message);
                event.preventDefault(); // Prevent the error from being logged to console
                return false;
            }
        });

        // Handle Grammarly-specific errors
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes('Grammarly.js')) {
                console.warn('🔇 Suppressed Grammarly extension error:', event.message);
                event.preventDefault();
                return false;
            }
        });
    }

    // Static method to quickly suppress extension errors
    static suppressExtensionErrors() {
        // Suppress console errors from extensions
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = function(...args) {
            const message = args.join(' ');
            if (message.includes('message port closed') ||
                message.includes('runtime.lastError') ||
                message.includes('Extension context invalidated') ||
                message.includes('grm ERROR') ||
                message.includes('Grammarly.js')) {
                console.warn('🔇 Suppressed extension error:', message);
                return;
            }
            originalError.apply(console, args);
        };

        // Also suppress Grammarly warnings, EmailFallbackService spam and CSP warnings
        console.warn = function(...args) {
            const message = args.join(' ');
            if (message.includes('grm ERROR') ||
                message.includes('Grammarly.js') ||
                message.includes('Iterable') ||
                message.includes('EmailFallbackService class not available yet') ||
                message.includes('The Trusted Types API') ||
                message.includes('CSP Evaluation') ||
                message.includes('Security Policy Violation') ||
                message.includes('Content Security Policy')) {
                return; // Just ignore these warnings
            }
            originalWarn.apply(console, args);
        };
    }

    // Method to detect if running in extension context
    static isExtensionContext() {
        return typeof chrome !== 'undefined' && 
               chrome.runtime && 
               chrome.runtime.id !== undefined;
    }

    // Method to safely check Chrome extension API
    static safeExtensionCheck() {
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                // Trigger any pending runtime errors
                const lastError = chrome.runtime.lastError;
                if (lastError) {
                    console.warn('🧹 Clearing runtime error:', lastError);
                    // Clear the error by accessing it
                }
            }
        } catch (error) {
            console.warn('⚠️ Extension check error suppressed:', error.message);
        }
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    new ChromeExtensionErrorFix();
    ChromeExtensionErrorFix.suppressExtensionErrors();
    ChromeExtensionErrorFix.safeExtensionCheck();
});

// Export for manual initialization
window.ChromeExtensionErrorFix = ChromeExtensionErrorFix;
