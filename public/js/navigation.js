/**
 * Navigation Component
 * Xử lý menu navigation, scroll effects và mobile menu
 */
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        // Scroll effect
        this.handleScroll();
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
        
        // Mobile menu
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
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
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Smooth scroll for anchor links
        this.setupSmoothScroll();

        // Handle navigation for links pointing to subpages
        this.setupSubpageNavigation();
        
        // Set active nav state based on current page
        this.setActiveNavState();
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navMenu.classList.toggle('active', this.isMenuOpen);
        this.hamburger.classList.toggle('active', this.isMenuOpen);
        document.body.classList.toggle('menu-open', this.isMenuOpen);
        
        // Update aria attributes
        this.hamburger.setAttribute('aria-expanded', this.isMenuOpen);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.hamburger.setAttribute('aria-expanded', 'false');
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

    setupSubpageNavigation() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    // Cho phép navigation bình thường, không preventDefault
                    // Thêm loading state
                    this.addLoadingState(link);
                    
                    // Đóng mobile menu trước khi navigate
                    this.closeMobileMenu();
                });
            }
        });
    }

    addLoadingState(linkElement) {
        // Thêm class loading cho visual feedback
        linkElement.classList.add('nav-loading');
        
        // Tạo spinner nhỏ
        const spinner = document.createElement('i');
        spinner.className = 'fas fa-spinner fa-spin nav-spinner';
        spinner.setAttribute('aria-hidden', 'true');
        linkElement.appendChild(spinner);
        
        // Xóa loading state sau 2 giây (fallback)
        setTimeout(() => {
            linkElement.classList.remove('nav-loading');
            const existingSpinner = linkElement.querySelector('.nav-spinner');
            if (existingSpinner) {
                existingSpinner.remove();
            }
        }, 2000);
    }

    setActiveNavState() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Xóa tất cả active states
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Set active state dựa trên current page
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Check for exact match hoặc partial match
                if (href.includes(currentPage) || 
                    (currentPage === 'index.html' && href.startsWith('#home')) ||
                    (currentPath === '/' && href.startsWith('#home'))) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// Export for use in other modules
window.Navigation = Navigation;
