/**
 * Button Animations Component
 * Xử lý hiệu ứng ripple và button interactions
 */
class ButtonAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.addRippleEffect();
        this.addHoverEffects();
    }
    
    addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .quick-reply, .chatbot-send');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        ripple.classList.add('ripple');
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    addHoverEffects() {
        const hoverElements = document.querySelectorAll('.btn, .feature-item, .solution-card, .team-member');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }
}

// Export for use in other modules
window.ButtonAnimations = ButtonAnimations;
