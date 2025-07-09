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
        
        // Smooth scroll for anchor links
        this.setupSmoothScroll();

        // Handle navigation for links pointing to subpages
        this.setupSubpageNavigation();
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navMenu.classList.toggle('active', this.isMenuOpen);
        this.navMenu.classList.toggle('open', this.isMenuOpen); // Thêm toggle class 'open'
        this.hamburger.classList.toggle('active', this.isMenuOpen);
        document.body.classList.toggle('menu-open', this.isMenuOpen);
        
        // Update aria attributes
        this.hamburger.setAttribute('aria-expanded', this.isMenuOpen);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.navMenu.classList.remove('open'); // Đảm bảo xóa class 'open' khi đóng
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
            // Chỉ ngăn chặn mặc định với anchor nội bộ (#), không can thiệp link trang con
            if (href && href.startsWith('#')) {
                // Đã xử lý ở setupSmoothScroll
                return;
            }
            // Nếu là link ngoài (http/https), không can thiệp
            if (href && href.startsWith('http')) {
                return;
            }
            // Không ngăn chặn mặc định với link trang con, để trình duyệt chuyển trang
        });
    }
}

// Export for use in other modules
window.mobile = window.mobile || {};
window.mobile.Navigation = new Navigation();

