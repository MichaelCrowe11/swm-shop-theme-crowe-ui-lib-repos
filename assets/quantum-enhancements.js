/* ===== QUANTUM THEME ENHANCEMENTS - JAVASCRIPT ===== */

// Quantum Particle System
class QuantumParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.maxParticles = this.isMobile() ? 15 : 30;
    this.mouse = { x: 0, y: 0 };
    this.init();
  }
  
  isMobile() {
    return window.innerWidth <= 768;
  }
  
  init() {
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.createParticle();
    }
  }
  
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'quantum-particle';
    
    // Random size
    const sizes = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    if (size !== 'small') particle.classList.add(size);
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (8 + Math.random() * 4) + 's';
    
    this.container.appendChild(particle);
    this.particles.push(particle);
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateMouseFollower();
    });
    
    document.addEventListener('mouseenter', () => {
      this.container.classList.add('interactive');
    });
    
    document.addEventListener('mouseleave', () => {
      this.container.classList.remove('interactive');
    });
  }
  
  updateMouseFollower() {
    const follower = document.querySelector('.quantum-mouse-follower');
    if (follower) {
      follower.style.transform = `translate(${this.mouse.x - 10}px, ${this.mouse.y - 10}px)`;
      follower.classList.add('active');
    }
  }
  
  animate() {
    // Particle regeneration
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createParticle();
      }
    }, 2000);
  }
}

// Smart Color Adaptation
class QuantumColorAdaptation {
  constructor() {
    this.init();
  }
  
  init() {
    this.applyTimeBasedTheme();
    this.setupCategoryAdaptation();
    
    // Update theme every hour
    setInterval(() => {
      this.applyTimeBasedTheme();
    }, 3600000);
  }
  
  applyTimeBasedTheme() {
    const hour = new Date().getHours();
    let theme;
    
    if (hour >= 5 && hour < 8) {
      theme = 'theme-dawn';
    } else if (hour >= 8 && hour < 17) {
      theme = 'theme-day';
    } else if (hour >= 17 && hour < 20) {
      theme = 'theme-dusk';
    } else {
      theme = 'theme-night';
    }
    
    // Remove existing theme classes
    document.body.classList.remove('theme-dawn', 'theme-day', 'theme-dusk', 'theme-night');
    document.body.classList.add(theme);
  }
  
  setupCategoryAdaptation() {
    // Detect current page/category and apply theme
    const path = window.location.pathname;
    
    if (path.includes('mushroom')) {
      document.body.classList.add('category-mushrooms');
    } else if (path.includes('supplement')) {
      document.body.classList.add('category-supplements');
    } else if (path.includes('equipment')) {
      document.body.classList.add('category-equipment');
    }
  }
}

// Enhanced Interactions
class QuantumInteractions {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupRippleEffects();
    this.setupParallaxEffects();
    this.setupPredictiveLoading();
    this.setupSmartAnimations();
  }
  
  setupRippleEffects() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.quantum-clickable, .nav-link, .chat-header, .quantum-button');
      if (target && !target.classList.contains('no-ripple')) {
        this.createRipple(target, e);
      }
    });
  }
  
  createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: quantum-ripple-animation 0.6s linear;
      background-color: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  setupParallaxEffects() {
    if (window.innerWidth > 768) {
      document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.product-card, .card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          
          const deltaX = (e.clientX - cardCenterX) * 0.01;
          const deltaY = (e.clientY - cardCenterY) * 0.01;
          
          card.style.transform = `perspective(1000px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
        });
      });
    }
  }
  
  setupPredictiveLoading() {
    // Preload likely next pages
    const links = document.querySelectorAll('a[href^="/"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target;
          this.preloadPage(link.href);
        }
      });
    });
    
    links.forEach((link) => observer.observe(link));
  }
  
  preloadPage(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  
  setupSmartAnimations() {
    // Staggered animations for elements
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('quantum-animate-in');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.nav-item, .product-card, .card').forEach((el) => {
      observer.observe(el);
    });
  }
}

// Performance Monitor
class QuantumPerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.init();
  }
  
  init() {
    this.monitorPerformance();
    this.optimizeBasedOnDevice();
  }
  
  monitorPerformance() {
    const measureFPS = (currentTime) => {
      this.frameCount++;
      if (currentTime - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
        this.adjustAnimations();
      }
      requestAnimationFrame(measureFPS);
    };
    requestAnimationFrame(measureFPS);
  }
  
  adjustAnimations() {
    if (this.fps < 30) {
      // Reduce particle count and disable heavy effects
      document.body.classList.add('quantum-performance-mode');
      const particles = document.querySelectorAll('.quantum-particle');
      particles.forEach((particle, index) => {
        if (index % 2 === 0) particle.style.display = 'none';
      });
    }
  }
  
  optimizeBasedOnDevice() {
    if (this.isMobile() || this.isLowPowerDevice()) {
      document.body.classList.add('quantum-mobile-optimized');
    }
  }
  
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  isLowPowerDevice() {
    return navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  }
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', function() {
  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'quantum-particles';
  document.body.appendChild(particleContainer);
  
  // Create mouse follower
  const mouseFollower = document.createElement('div');
  mouseFollower.className = 'quantum-mouse-follower';
  document.body.appendChild(mouseFollower);
  
  // Create predictive loader
  const predictiveLoader = document.createElement('div');
  predictiveLoader.className = 'quantum-predictive-loader';
  document.body.appendChild(predictiveLoader);
  
  // Initialize systems
  new QuantumParticleSystem(particleContainer);
  new QuantumColorAdaptation();
  new QuantumInteractions();
  new QuantumPerformanceMonitor();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes quantum-ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .quantum-animate-in {
      animation: quantum-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .quantum-performance-mode .quantum-particle {
      animation-duration: 12s !important;
    }
    
    .quantum-mobile-optimized .quantum-parallax-bg,
    .quantum-mobile-optimized .quantum-parallax-mid {
      transform: none !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🌟 Quantum Theme Enhancement System Initialized');
});
