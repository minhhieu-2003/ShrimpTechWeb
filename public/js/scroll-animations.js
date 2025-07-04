/**
 * Scroll Animations Component
 * Xử lý hiệu ứng khi scroll
 */
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }
    
    setupAnimations() {
        // Create intersection observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Handle stagger animation children
                    if (entry.target.classList.contains('stagger-animation')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 150); // Slightly longer delay for better effect
                        });
                    }
                    
                    // Ensure content cards are visible
                    if (entry.target.classList.contains('content-card')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger animation earlier
        });
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .stagger-animation, .content-card');
        console.log(`Found ${animatedElements.length} elements to animate`);
        animatedElements.forEach(el => {
            this.observer.observe(el);
            console.log(`Observing element:`, el.className);
        });
        
        // Also observe individual cards
        const allCards = document.querySelectorAll('.solution-card, .content-card, .product-card');
        allCards.forEach(card => {
            this.observer.observe(card);
        });
        
        this.setupSensorKitAnimations();
    }
    
    // Special handling for sensor kit section
    setupSensorKitAnimations() {
        const sensorSection = document.querySelector('.page-section[style*="background: #f8fafc"]');
        if (sensorSection) {
            const sensorCards = sensorSection.querySelectorAll('.content-card');
            const staggerContainer = sensorSection.querySelector('.stagger-animation');
            
            // Ensure immediate visibility for sensor cards
            sensorCards.forEach((card, index) => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.visibility = 'visible';
                card.classList.add('visible');
                
                // Add stagger effect manually
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                }, index * 100);
            });
            
            if (staggerContainer) {
                staggerContainer.style.opacity = '1';
                staggerContainer.style.visibility = 'visible';
                staggerContainer.classList.add('visible');
            }
            
            console.log('✅ Sensor kit animations initialized');
        }
    }
}

// Export for use in other modules
window.ScrollAnimations = ScrollAnimations;
