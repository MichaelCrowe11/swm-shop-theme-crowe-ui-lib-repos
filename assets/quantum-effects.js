/**
 * Crowe Quantum Visual Effects Library
 * Advanced interactive effects for profound lasting impact
 * Version: 2.0
 */

class QuantumEffects {
  constructor() {
    this.isInitialized = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.observers = new Map();
    this.activeAnimations = new Set();
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    this.setupIntersectionObservers();
    this.setupMouseTrailEffect();
    this.setupParticleSystem();
    this.setupMagneticElements();
    this.setupQuantumCursor();
    this.setupVisibilityAPI();
    
    this.isInitialized = true;
    console.log('🌟 Quantum Effects Library Initialized');
  }

  /**
   * Intersection Observer for scroll-triggered animations
   */
  setupIntersectionObservers() {
    const observerOptions = {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerElementAnimation(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with quantum effects
    document.querySelectorAll('[data-quantum-effect]').forEach(el => {
      observer.observe(el);
    });

    this.observers.set('intersection', observer);
  }

  /**
   * Trigger animations based on element's data attributes
   */
  triggerElementAnimation(element) {
    const effect = element.dataset.quantumEffect;
    const delay = parseInt(element.dataset.quantumDelay) || 0;

    setTimeout(() => {
      switch (effect) {
        case 'fade-in-up':
          this.fadeInUp(element);
          break;
        case 'slide-in-left':
          this.slideInLeft(element);
          break;
        case 'scale-in':
          this.scaleIn(element);
          break;
        case 'quantum-reveal':
          this.quantumReveal(element);
          break;
        case 'holographic-appear':
          this.holographicAppear(element);
          break;
        default:
          this.defaultAppear(element);
      }
    }, delay);
  }

  /**
   * Mouse trail effect with quantum particles
   */
  setupMouseTrailEffect() {
    if (this.reducedMotion) return;

    const particles = [];
    const maxParticles = 20;
    let isThrottled = false;

    document.addEventListener('mousemove', (e) => {
      if (isThrottled) return;
      
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 16); // 60fps throttle
      // Create particle
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, #D4AF37, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 3}px;
        top: ${e.clientY - 3}px;
        opacity: 0.8;
        transition: opacity 0.8s ease, transform 0.8s ease;
      `;

      document.body.appendChild(particle);

      // Animate particle
      setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0.5) translateY(-20px)';
      }, 50);

      // Remove particle with proper cleanup
      const removeParticle = () => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
          const index = particles.indexOf(particle);
          if (index > -1) particles.splice(index, 1);
        }
      };

      setTimeout(removeParticle, 800);

      // Limit particles
      particles.push(particle);
      if (particles.length > maxParticles) {
        const oldParticle = particles.shift();
        if (oldParticle && oldParticle.parentNode) {
          oldParticle.parentNode.removeChild(oldParticle);
        }
      }
    });
  }

  /**
   * Advanced particle system for backgrounds
   */
  setupParticleSystem() {
    const canvases = document.querySelectorAll('[data-quantum-particles]');
    
    canvases.forEach(canvas => {
      if (canvas.tagName !== 'CANVAS') return;
      
      const ctx = canvas.getContext('2d');
      const particleCount = parseInt(canvas.dataset.quantumParticles) || 50;
      const particles = [];

      // Resize canvas to match container
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Reinitialize particles on resize
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            hue: Math.random() * 60 + 30 // Gold hues
          });
        }
      };

      // Initialize canvas size
      resizeCanvas();
      
      // Add resize listener
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
      });

      // Animation loop
      const animate = () => {
        if (this.reducedMotion) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
          ctx.fill();

          // Draw connections
          particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${(1 - distance / 100) * 0.3})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Magnetic hover effects for interactive elements
   */
  setupMagneticElements() {
    const magneticElements = document.querySelectorAll('[data-quantum-magnetic]');

    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const strength = parseFloat(element.dataset.quantumMagnetic) || 0.3;
        
        element.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  /**
   * Custom quantum cursor effect
   */
  setupQuantumCursor() {
    if (this.reducedMotion || window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'quantum-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid #D4AF37;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    `;

    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    });

    // Cursor interactions
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1)';
    });

    // Hide default cursor on interactive elements
    document.querySelectorAll('a, button, [data-quantum-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = '#FFD700';
      });

      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#D4AF37';
      });
    });
  }

  /**
   * Animation methods
   */
  fadeInUp(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  slideInLeft(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    });
  }

  scaleIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  quantumReveal(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9) rotateY(30deg)';
    element.style.filter = 'blur(10px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) rotateY(0deg)';
      element.style.filter = 'blur(0px)';
    });
  }

  holographicAppear(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateZ(-50px)';
    element.style.filter = 'hue-rotate(180deg) brightness(1.5)';
    element.style.transition = 'all 1s ease';

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateZ(0)';
      element.style.filter = 'hue-rotate(0deg) brightness(1)';
    }, 100);
  }

  defaultAppear(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  /**
   * Performance optimizations
   */
  setupVisibilityAPI() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations when tab is not visible
        this.activeAnimations.forEach(animation => {
          animation.pause();
        });
      } else {
        // Resume animations when tab becomes visible
        this.activeAnimations.forEach(animation => {
          animation.play();
        });
      }
    });
  }

  /**
   * Utility methods
   */
  addGlowEffect(element, color = '#D4AF37') {
    element.style.boxShadow = `0 0 20px ${color}`;
    element.style.transition = 'box-shadow 0.3s ease';
  }

  removeGlowEffect(element) {
    element.style.boxShadow = '';
  }

  createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: quantum-ripple 0.6s ease-out;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * Public API methods
   */
  enableEffect(selector, effect) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.dataset.quantumEffect = effect;
      this.triggerElementAnimation(el);
    });
  }

  disableEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      delete el.dataset.quantumEffect;
      el.style.transition = '';
      el.style.transform = '';
      el.style.opacity = '';
    });
  }

  destroy() {
    // Clean up observers and effects
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Remove custom cursor
    const cursor = document.querySelector('.quantum-cursor');
    if (cursor) cursor.remove();

    // Clear active animations
    this.activeAnimations.clear();

    this.isInitialized = false;
    console.log('🌟 Quantum Effects Library Destroyed');
  }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes quantum-ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Auto-initialize when DOM is ready
let quantumFX;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    quantumFX = new QuantumEffects();
  });
} else {
  quantumFX = new QuantumEffects();
}

// Make available globally
window.QuantumEffects = QuantumEffects;
window.quantumFX = quantumFX;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumEffects;
}
