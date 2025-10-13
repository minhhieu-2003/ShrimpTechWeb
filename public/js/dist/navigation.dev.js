"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Navigation Component
 * Xử lý menu navigation, scroll effects và mobile menu
 */
var Navigation =
/*#__PURE__*/
function () {
  function Navigation() {
    _classCallCheck(this, Navigation);

    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    this.init();
  }

  _createClass(Navigation, [{
    key: "init",
    value: function init() {
      var _this = this;

      if (!this.navbar) return; // Scroll effect

      this.handleScroll();
      window.addEventListener('scroll', Utils.throttle(function () {
        return _this.handleScroll();
      }, 100)); // Mobile menu

      if (this.hamburger) {
        this.hamburger.addEventListener('click', function () {
          return _this.toggleMobileMenu();
        });
      } // Close menu when clicking nav links


      this.navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          if (_this.isMenuOpen) {
            _this.closeMobileMenu();
          }
        });
      }); // Close menu when clicking outside

      document.addEventListener('click', function (e) {
        if (_this.isMenuOpen && !_this.navbar.contains(e.target)) {
          _this.closeMobileMenu();
        }
      }); // Close menu when pressing Escape

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _this.isMenuOpen) {
          _this.closeMobileMenu();
        }
      }); // Smooth scroll for anchor links

      this.setupSmoothScroll(); // Handle navigation for links pointing to subpages

      this.setupSubpageNavigation(); // Set active nav state based on current page

      this.setActiveNavState();
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      var scrolled = window.scrollY > 50;
      this.navbar.classList.toggle('scrolled', scrolled);
    }
  }, {
    key: "toggleMobileMenu",
    value: function toggleMobileMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.navMenu.classList.toggle('active', this.isMenuOpen);
      this.hamburger.classList.toggle('active', this.isMenuOpen);
      document.body.classList.toggle('menu-open', this.isMenuOpen); // Update aria attributes

      this.hamburger.setAttribute('aria-expanded', this.isMenuOpen);
    }
  }, {
    key: "closeMobileMenu",
    value: function closeMobileMenu() {
      this.isMenuOpen = false;
      this.navMenu.classList.remove('active');
      this.hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
      this.hamburger.setAttribute('aria-expanded', 'false');
    }
  }, {
    key: "setupSmoothScroll",
    value: function setupSmoothScroll() {
      this.navLinks.forEach(function (link) {
        if (link.getAttribute('href').startsWith('#')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = link.getAttribute('href');
            var targetElement = document.querySelector(targetId);

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
  }, {
    key: "setupSubpageNavigation",
    value: function setupSubpageNavigation() {
      var _this2 = this;

      this.navLinks.forEach(function (link) {
        var href = link.getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          link.addEventListener('click', function (e) {
            // Cho phép navigation bình thường, không preventDefault
            // Thêm loading state
            _this2.addLoadingState(link); // Đóng mobile menu trước khi navigate


            _this2.closeMobileMenu();
          });
        }
      });
    }
  }, {
    key: "addLoadingState",
    value: function addLoadingState(linkElement) {
      // Thêm class loading cho visual feedback
      linkElement.classList.add('nav-loading'); // Tạo spinner nhỏ

      var spinner = document.createElement('i');
      spinner.className = 'fas fa-spinner fa-spin nav-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      linkElement.appendChild(spinner); // Xóa loading state sau 2 giây (fallback)

      setTimeout(function () {
        linkElement.classList.remove('nav-loading');
        var existingSpinner = linkElement.querySelector('.nav-spinner');

        if (existingSpinner) {
          existingSpinner.remove();
        }
      }, 2000);
    }
  }, {
    key: "setActiveNavState",
    value: function setActiveNavState() {
      var currentPath = window.location.pathname;
      var currentPage = currentPath.split('/').pop() || 'index.html'; // Xóa tất cả active states

      this.navLinks.forEach(function (link) {
        return link.classList.remove('active');
      }); // Set active state dựa trên current page

      this.navLinks.forEach(function (link) {
        var href = link.getAttribute('href');

        if (href) {
          // Check for exact match hoặc partial match
          if (href.includes(currentPage) || currentPage === 'index.html' && href.startsWith('#home') || currentPath === '/' && href.startsWith('#home')) {
            link.classList.add('active');
          }
        }
      });
    }
  }]);

  return Navigation;
}(); // Export for use in other modules


window.Navigation = Navigation;