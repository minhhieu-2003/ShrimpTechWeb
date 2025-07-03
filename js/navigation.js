/**
 * Navigation Component
 * Xử lý menu navigation, scroll effects và mobile menu
 */
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navbarCollapse = document.querySelector('.navbar-collapse');
        this.navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        // Scroll effect
        this.handleScroll();
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
        
        // Mobile menu
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Smooth scroll for anchor links
        this.setupSmoothScroll();
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navbarCollapse.classList.toggle('show', this.isMenuOpen);
        this.mobileMenuToggle.classList.toggle('active', this.isMenuOpen);
        document.body.classList.toggle('menu-open', this.isMenuOpen);
        
        // Update aria attributes
        this.mobileMenuToggle.setAttribute('aria-expanded', this.isMenuOpen);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navbarCollapse.classList.remove('show');
        this.mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    }
}

// Export for use in other modules
window.Navigation = Navigation;
