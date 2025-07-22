/* ===== QUANTUM THEME ENHANCEMENTS - PHASE 5 JAVASCRIPT ===== */
/* Immersive Reality: 3D Holographic Displays & Dynamic Environment Mapping */

// 3D Holographic Product Display System
class QuantumHolographicDisplay {
  constructor() {
    this.isMouseDown = false;
    this.startX = 0;
    this.startY = 0;
    this.rotationX = 5;
    this.rotationY = 0;
    this.products = [];
    this.init();
  }
  
  init() {
    this.enhanceProductCards();
    this.setupHolographicInteractions();
    this.createEnvironmentMapper();
    this.initEmotionalColorEngine();
  }
  
  enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card, .card');
    
    productCards.forEach((card, index) => {
      this.convertToHologram(card, index);
    });
  }
  
  convertToHologram(card, index) {
    // Add holographic classes
    card.classList.add('quantum-product-hologram');
    
    // Create hologram container
    const hologramContainer = document.createElement('div');
    hologramContainer.className = 'quantum-hologram-container';
    
    // Find product image
    const productImage = card.querySelector('img');
    if (productImage) {
      // Wrap image in holographic container
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'quantum-product-image';
      
      // Clone and wrap image
      const clonedImage = productImage.cloneNode(true);
      imageWrapper.appendChild(clonedImage);
      
      // Add holographic grid
      const grid = document.createElement('div');
      grid.className = 'quantum-hologram-grid';
      imageWrapper.appendChild(grid);
      
      // Add holographic info display
      const info = this.createHologramInfo(card);
      imageWrapper.appendChild(info);
      
      hologramContainer.appendChild(imageWrapper);
      
      // Replace original image with hologram
      productImage.parentNode.replaceChild(hologramContainer, productImage);
      
      // Setup 3D interactions
      this.setup3DInteractions(card, hologramContainer);
    }
    
    // Add holographic styling to card
    if (Math.random() > 0.5) { // 50% chance for variety
      card.classList.add('holographic');
    }
    
    // Add entrance animation delay
    setTimeout(() => {
      hologramContainer.classList.add('rotating');
    }, index * 200);
  }
  
  createHologramInfo(card) {
    const info = document.createElement('div');
    info.className = 'quantum-hologram-info';
    
    // Extract product info
    const title = card.querySelector('.card__heading, .product-card__title, h3');
    const price = card.querySelector('.price, .card__price');
    
    let infoText = 'QUANTUM PRODUCT';
    if (title) {
      infoText = title.textContent.trim().substring(0, 20);
    }
    if (price) {
      infoText += ` - ${price.textContent.trim()}`;
    }
    
    info.textContent = infoText.toUpperCase();
    
    // Add screen reader description
    const description = document.createElement('span');
    description.className = 'quantum-hologram-description';
    description.textContent = `3D holographic display of ${infoText}. Use mouse to rotate and explore.`;
    info.appendChild(description);
    
    return info;
  }
  
  setup3DInteractions(card, container) {
    let isRotating = false;
    let mouseX = 0;
    let mouseY = 0;
    
    card.addEventListener('mouseenter', () => {
      container.classList.remove('rotating');
    });
    
    card.addEventListener('mouseleave', () => {
      container.style.transform = 'rotateY(0deg) rotateX(5deg)';
      setTimeout(() => {
        container.classList.add('rotating');
      }, 500);
    });
    
    card.addEventListener('mousedown', (e) => {
      isRotating = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      card.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    card.addEventListener('mousemove', (e) => {
      if (!isRotating) {
        // Gentle hover rotation
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateY = (e.clientX - centerX) / 10;
        const rotateX = -(e.clientY - centerY) / 10;
        
        container.style.transform = `rotateY(${rotateX}deg) rotateX(${rotateY + 5}deg)`;
        return;
      }
      
      // Active rotation
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      
      this.rotationY += deltaX * 0.5;
      this.rotationX -= deltaY * 0.5;
      
      // Constrain X rotation
      this.rotationX = Math.max(-45, Math.min(45, this.rotationX));
      
      container.style.transform = `rotateY(${this.rotationY}deg) rotateX(${this.rotationX}deg)`;
      
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
      isRotating = false;
      card.style.cursor = 'grab';
    });
    
    // Touch support for mobile
    this.setupTouchInteractions(card, container);
  }
  
  setupTouchInteractions(card, container) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouch = false;
    
    card.addEventListener('touchstart', (e) => {
      isTouch = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      container.classList.remove('rotating');
    });
    
    card.addEventListener('touchmove', (e) => {
      if (!isTouch) return;
      
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      const deltaX = touchX - touchStartX;
      const deltaY = touchY - touchStartY;
      
      const rotateY = deltaX * 0.3;
      const rotateX = -deltaY * 0.3;
      
      container.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX + 5}deg)`;
      
      e.preventDefault();
    });
    
    card.addEventListener('touchend', () => {
      isTouch = false;
      setTimeout(() => {
        container.style.transform = 'rotateY(0deg) rotateX(5deg)';
        setTimeout(() => {
          container.classList.add('rotating');
        }, 500);
      }, 300);
    });
  }
  
  setupHolographicInteractions() {
    // Add holographic scan effect on click
    document.addEventListener('click', (e) => {
      const hologram = e.target.closest('.quantum-product-hologram');
      if (hologram) {
        this.triggerHologramScan(hologram);
      }
    });
  }
  
  triggerHologramScan(hologram) {
    const scanner = document.createElement('div');
    scanner.className = 'quantum-hologram-scanner';
    scanner.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%,
        rgba(0, 255, 255, 0.8) 50%,
        transparent 100%);
      pointer-events: none;
      z-index: 10;
      animation: quantum-scanner-sweep 0.8s ease-out;
    `;
    
    hologram.style.position = 'relative';
    hologram.appendChild(scanner);
    
    setTimeout(() => {
      scanner.remove();
    }, 800);
  }
}

// Dynamic Environment Mapping System
class QuantumEnvironmentMapper {
  constructor() {
    this.currentEnvironment = 'day';
    this.weatherAPI = null;
    this.geolocation = null;
    this.environmentLayers = [];
    this.particleCount = 0;
    this.maxParticles = window.innerWidth > 768 ? 50 : 20;
    this.init();
  }
  
  init() {
    this.createEnvironmentContainer();
    this.detectTimeOfDay();
    this.setupWeatherDetection();
    this.createEnvironmentParticles();
    this.startEnvironmentCycle();
  }
  
  createEnvironmentContainer() {
    const mapper = document.createElement('div');
    mapper.className = 'quantum-environment-mapper';
    
    // Create base environment layer
    const layer = document.createElement('div');
    layer.className = 'quantum-environment-layer day';
    mapper.appendChild(layer);
    
    // Create particle container
    const particles = document.createElement('div');
    particles.className = 'quantum-environment-particles';
    mapper.appendChild(particles);
    
    document.body.appendChild(mapper);
    this.environmentContainer = mapper;
    this.particleContainer = particles;
  }
  
  detectTimeOfDay() {
    const hour = new Date().getHours();
    let environment;
    
    if (hour >= 5 && hour < 8) {
      environment = 'sunrise';
    } else if (hour >= 8 && hour < 17) {
      environment = 'day';
    } else if (hour >= 17 && hour < 20) {
      environment = 'sunset';
    } else {
      environment = 'night';
    }
    
    this.setEnvironment(environment);
  }
  
  setEnvironment(type) {
    const layer = this.environmentContainer.querySelector('.quantum-environment-layer');
    
    // Remove existing environment classes
    layer.classList.remove('sunrise', 'day', 'sunset', 'night', 'storm');
    
    // Add new environment
    layer.classList.add(type);
    this.currentEnvironment = type;
    
    // Update particle effects
    this.updateParticleEffects(type);
    
    console.log(`🌍 Environment mapped to: ${type}`);
  }
  
  updateParticleEffects(environment) {
    // Clear existing particles
    this.particleContainer.innerHTML = '';
    this.particleCount = 0;
    
    switch (environment) {
      case 'storm':
        this.createRainParticles();
        break;
      case 'night':
        this.createStarParticles();
        break;
      case 'sunrise':
      case 'sunset':
        this.createLightParticles();
        break;
      default:
        this.createFloatingParticles();
    }
  }
  
  createRainParticles() {
    const rainCount = Math.min(this.maxParticles, 30);
    
    for (let i = 0; i < rainCount; i++) {
      setTimeout(() => {
        this.createRainDrop();
      }, i * 100);
    }
    
    // Continue creating rain
    this.rainInterval = setInterval(() => {
      if (this.currentEnvironment === 'storm') {
        this.createRainDrop();
      }
    }, 200);
  }
  
  createRainDrop() {
    if (this.particleCount >= this.maxParticles) return;
    
    const drop = document.createElement('div');
    drop.className = 'quantum-env-particle rain';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    
    this.particleContainer.appendChild(drop);
    this.particleCount++;
    
    setTimeout(() => {
      drop.remove();
      this.particleCount--;
    }, 1000);
  }
  
  createStarParticles() {
    const starCount = Math.min(this.maxParticles, 25);
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'quantum-env-particle star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 4 + 's';
      star.style.cssText += `
        background: #FFFFFF;
        width: ${1 + Math.random() * 3}px;
        height: ${1 + Math.random() * 3}px;
        animation: quantum-star-twinkle 4s ease-in-out infinite;
      `;
      
      this.particleContainer.appendChild(star);
    }
  }
  
  createLightParticles() {
    const lightCount = Math.min(this.maxParticles, 20);
    
    for (let i = 0; i < lightCount; i++) {
      const light = document.createElement('div');
      light.className = 'quantum-env-particle light';
      light.style.left = Math.random() * 100 + '%';
      light.style.top = Math.random() * 100 + '%';
      light.style.cssText += `
        background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
        width: ${5 + Math.random() * 10}px;
        height: ${5 + Math.random() * 10}px;
        animation: quantum-light-dance 6s ease-in-out infinite;
      `;
      
      this.particleContainer.appendChild(light);
    }
  }
  
  createFloatingParticles() {
    const particleCount = Math.min(this.maxParticles, 15);
    
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createFloatingParticle();
      }, i * 200);
    }
    
    // Continue creating particles
    this.floatInterval = setInterval(() => {
      if (['day', 'sunrise', 'sunset'].includes(this.currentEnvironment)) {
        this.createFloatingParticle();
      }
    }, 3000);
  }
  
  createFloatingParticle() {
    if (this.particleCount >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'quantum-env-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    this.particleContainer.appendChild(particle);
    this.particleCount++;
    
    setTimeout(() => {
      particle.remove();
      this.particleCount--;
    }, 20000);
  }
  
  setupWeatherDetection() {
    // Simulate weather detection (in production, use a weather API)
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of storm
        this.setEnvironment('storm');
        setTimeout(() => {
          this.detectTimeOfDay(); // Return to normal
        }, 30000); // Storm lasts 30 seconds
      }
    }, 120000); // Check every 2 minutes
  }
  
  startEnvironmentCycle() {
    // Update environment every hour
    setInterval(() => {
      this.detectTimeOfDay();
    }, 3600000);
    
    // Add random environmental changes
    setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance
        this.triggerEnvironmentShift();
      }
    }, 30000);
  }
  
  triggerEnvironmentShift() {
    const layer = this.environmentContainer.querySelector('.quantum-environment-layer');
    layer.style.filter += ' hue-rotate(15deg)';
    
    setTimeout(() => {
      layer.style.filter = layer.style.filter.replace(' hue-rotate(15deg)', '');
    }, 5000);
  }
  
  cleanup() {
    clearInterval(this.rainInterval);
    clearInterval(this.floatInterval);
  }
}

// Emotional Color Psychology Engine
class QuantumEmotionalColorEngine {
  constructor() {
    this.currentEmotion = 'calm';
    this.emotionHistory = [];
    this.colorMoodMap = {
      excited: { hue: 15, saturation: 1.3, brightness: 1.1 },
      calm: { hue: -15, saturation: 0.8, brightness: 0.9 },
      focused: { hue: 30, saturation: 1.1, brightness: 0.95 },
      energetic: { hue: -30, saturation: 1.4, brightness: 1.2 },
      contemplative: { hue: 45, saturation: 0.9, brightness: 0.85 }
    };
    this.init();
  }
  
  init() {
    this.setupEmotionDetection();
    this.setupEmotionDisplay();
    this.startEmotionCycle();
  }
  
  setupEmotionDetection() {
    // Track user behavior to determine emotional state
    let clickCount = 0;
    let rapidClicks = 0;
    let scrollSpeed = 0;
    let lastScrollTime = 0;
    
    // Click pattern analysis
    document.addEventListener('click', () => {
      clickCount++;
      const now = Date.now();
      
      if (now - lastScrollTime < 1000) {
        rapidClicks++;
      }
      
      // Analyze emotion based on click patterns
      if (rapidClicks > 3) {
        this.setEmotion('excited');
        rapidClicks = 0;
      }
    });
    
    // Scroll pattern analysis
    document.addEventListener('scroll', () => {
      const now = Date.now();
      const deltaTime = now - lastScrollTime;
      
      if (deltaTime > 0) {
        scrollSpeed = Math.abs(window.scrollY - (this.lastScrollY || 0)) / deltaTime;
        
        if (scrollSpeed > 2) {
          this.setEmotion('energetic');
        } else if (scrollSpeed < 0.5) {
          this.setEmotion('contemplative');
        }
      }
      
      this.lastScrollY = window.scrollY;
      lastScrollTime = now;
    });
    
    // Hover pattern analysis
    let hoverCount = 0;
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.product-card, .nav-link')) {
        hoverCount++;
        
        if (hoverCount > 10) {
          this.setEmotion('focused');
          hoverCount = 0;
        }
      }
    });
  }
  
  setEmotion(emotion) {
    if (this.currentEmotion === emotion) return;
    
    this.currentEmotion = emotion;
    this.emotionHistory.push({
      emotion,
      timestamp: Date.now()
    });
    
    // Keep only recent history
    if (this.emotionHistory.length > 10) {
      this.emotionHistory.shift();
    }
    
    this.applyEmotionalColoring(emotion);
    console.log(`🎨 Emotional state detected: ${emotion}`);
  }
  
  applyEmotionalColoring(emotion) {
    const body = document.body;
    const mood = this.colorMoodMap[emotion] || this.colorMoodMap.calm;
    
    // Remove existing emotion classes
    body.classList.remove('quantum-emotion-excited', 'quantum-emotion-calm', 
                        'quantum-emotion-focused', 'quantum-emotion-energetic',
                        'quantum-emotion-contemplative');
    
    // Add new emotion class
    body.classList.add(`quantum-emotion-${emotion}`);
    
    // Apply color psychology filters
    const environmentMapper = document.querySelector('.quantum-environment-mapper');
    if (environmentMapper) {
      environmentMapper.style.filter = `
        hue-rotate(${mood.hue}deg) 
        saturate(${mood.saturation}) 
        brightness(${mood.brightness})
      `;
    }
    
    // Add emotion pulse to interactive elements
    const interactiveElements = document.querySelectorAll('.quantum-product-hologram, .nav-link');
    interactiveElements.forEach(element => {
      element.classList.remove('quantum-emotion-pulse');
      setTimeout(() => {
        element.classList.add('quantum-emotion-pulse');
      }, 100);
    });
  }
  
  setupEmotionDisplay() {
    // Create emotion indicator (optional debug display)
    if (window.location.search.includes('debug')) {
      const indicator = document.createElement('div');
      indicator.className = 'quantum-emotion-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
      `;
      
      document.body.appendChild(indicator);
      
      // Update display
      setInterval(() => {
        indicator.textContent = `Emotion: ${this.currentEmotion}`;
      }, 1000);
    }
  }
  
  startEmotionCycle() {
    // Gradually return to calm state if no activity
    setInterval(() => {
      const lastActivity = this.emotionHistory[this.emotionHistory.length - 1];
      if (!lastActivity || Date.now() - lastActivity.timestamp > 30000) {
        this.setEmotion('calm');
      }
    }, 15000);
  }
}

// Advanced CSS Animation Injector
class QuantumAnimationInjector {
  constructor() {
    this.injectAdvancedAnimations();
  }
  
  injectAdvancedAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes quantum-scanner-sweep {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      @keyframes quantum-star-twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes quantum-light-dance {
        0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
        33% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.8; }
        66% { transform: translateY(-10px) translateX(-10px) scale(0.9); opacity: 0.7; }
      }
      
      .quantum-fade-in-hologram {
        animation: quantum-hologram-materialize 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        opacity: 0;
        transform: translateY(30px) scale(0.8);
      }
      
      @keyframes quantum-hologram-materialize {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.8) rotateX(45deg);
          filter: blur(10px);
        }
        50% {
          opacity: 0.5;
          filter: blur(5px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
          filter: blur(0px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize Phase 5 Systems
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all Phase 5 systems
  const holographicDisplay = new QuantumHolographicDisplay();
  const environmentMapper = new QuantumEnvironmentMapper();
  const emotionalEngine = new QuantumEmotionalColorEngine();
  const animationInjector = new QuantumAnimationInjector();
  
  // Add entrance animations to existing elements
  setTimeout(() => {
    const productCards = document.querySelectorAll('.quantum-product-hologram');
    productCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('quantum-fade-in-hologram');
      }, index * 150);
    });
  }, 1000);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    environmentMapper.cleanup();
  });
  
  console.log('🌟 Quantum Phase 5: Immersive Reality - ACTIVATED');
  console.log('✨ 3D Holographic Displays: Active');
  console.log('🌍 Dynamic Environment Mapping: Active');
  console.log('🎨 Emotional Color Psychology: Active');
});