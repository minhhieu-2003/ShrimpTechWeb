/**
 * Loading Animations Component
 * Xử lý animations khi scroll và load trang
 */
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initial animations
        this.animateOnLoad();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.overview-card, .feature-item, .stat-item, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateOnLoad() {
        // Animate hero content
        setTimeout(() => {
            document.querySelector('.hero-content')?.classList.add('animate-in');
        }, 300);
        
        setTimeout(() => {
            document.querySelector('.hero-visual')?.classList.add('animate-in');
        }, 600);
    }
}

// Export for use in other modules
window.LoadingAnimations = LoadingAnimations;
