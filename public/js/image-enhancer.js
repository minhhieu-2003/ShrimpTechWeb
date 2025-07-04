/**
 * Image Quality Enhancement Script
 * Tối ưu hóa chất lượng hình ảnh và lazy loading
 */
class ImageQualityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Chờ DOM loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupImageOptimization());
        } else {
            this.setupImageOptimization();
        }
    }
    
    setupImageOptimization() {
        // Thiết lập lazy loading cho hình ảnh
        this.setupLazyLoading();
        
        // Tối ưu hóa hình ảnh chất lượng cao
        this.enhanceImageQuality();
        
        // Xử lý responsive images
        this.handleResponsiveImages();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback cho browsers cũ
            images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        if (img.src && img.complete) {
            img.classList.add('loaded');
            return;
        }
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            this.applyImageEnhancements(img);
        }, { once: true });
        
        img.addEventListener('error', () => {
            console.warn('Failed to load image:', img.src);
            img.classList.add('error');
        }, { once: true });
    }
    
    applyImageEnhancements(img) {
        // Kiểm tra nếu là màn hình retina
        if (window.devicePixelRatio > 1) {
            img.style.imageRendering = '-webkit-optimize-contrast';
        }
        
        // Thêm hiệu ứng fade-in
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '1';
    }
    
    enhanceImageQuality() {
        const galleryImages = document.querySelectorAll('.ahtp-image-card img, .hero-image img');
        
        galleryImages.forEach(img => {
            // Thiết lập kích thước tối ưu
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.addEventListener('load', () => {
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    if (aspectRatio > 1) {
                        img.style.objectPosition = 'center center';
                    }
                }, { once: true });
            }
            
            // Tối ưu cho màn hình retina
            if (window.devicePixelRatio > 1.5) {
                this.setupRetinaOptimization(img);
            }
        });
    }
    
    setupRetinaOptimization(img) {
        const src = img.src;
        
        // Tạo version 2x nếu có thể
        if (src.includes('.jpg') || src.includes('.png')) {
            const highResSrc = src.replace(/\.(jpg|png)$/i, '@2x.$1');
            
            // Kiểm tra xem file @2x có tồn tại không
            const testImg = new Image();
            testImg.addEventListener('load', () => {
                img.src = highResSrc;
                img.srcset = `${src} 1x, ${highResSrc} 2x`;
            }, { once: true });
            
            testImg.addEventListener('error', () => {
                // Nếu không có @2x, sử dụng CSS để tối ưu
                img.style.imageRendering = 'crisp-edges';
            }, { once: true });
            
            testImg.src = highResSrc;
        }
    }
    
    handleResponsiveImages() {
        const images = document.querySelectorAll('.ahtp-image-card img');
        
        const updateImageSizes = () => {
            images.forEach(img => {
                const container = img.closest('.ahtp-image-card');
                if (container) {
                    const containerWidth = container.offsetWidth;
                    
                    // Điều chỉnh kích thước hình ảnh dựa trên container
                    if (containerWidth < 300) {
                        img.style.height = '200px';
                    } else if (containerWidth < 400) {
                        img.style.height = '225px';
                    } else {
                        img.style.height = '250px';
                    }
                }
            });
        };
        
        // Cập nhật khi resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateImageSizes, 150);
        });
        
        // Cập nhật lần đầu
        updateImageSizes();
    }
}

// Khởi tạo image enhancer
const imageEnhancer = new ImageQualityEnhancer();

// Export để sử dụng ở nơi khác
window.ImageQualityEnhancer = ImageQualityEnhancer;
