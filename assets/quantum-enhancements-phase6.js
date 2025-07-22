/* ===== QUANTUM THEME ENHANCEMENTS - PHASE 6 JAVASCRIPT ===== */
/* Hyper-Intelligence: Real-time AI Recommendations & Sentiment Analysis */

// Real-time AI Product Recommendation Engine
class QuantumAIRecommendationEngine {
  constructor() {
    this.recommendations = [];
    this.userProfile = this.loadUserProfile();
    this.behaviorPattern = [];
    this.isVisible = false;
    this.updateInterval = null;
    this.productDatabase = [];
    this.init();
  }
  
  init() {
    this.createRecommendationPanel();
    this.createTriggerButton();
    this.scanProductCatalog();
    this.startBehaviorTracking();
    this.startRecommendationEngine();
    this.setupEventListeners();
  }
  
  loadUserProfile() {
    const saved = localStorage.getItem('quantumUserProfile');
    return saved ? JSON.parse(saved) : {
      preferences: [],
      viewHistory: [],
      purchaseHistory: [],
      categories: {},
      priceRange: { min: 0, max: 1000 },
      lastVisit: Date.now()
    };
  }
  
  saveUserProfile() {
    localStorage.setItem('quantumUserProfile', JSON.stringify(this.userProfile));
  }
  
  scanProductCatalog() {
    // Scan all product elements on the page
    const products = document.querySelectorAll('.product-card, .card');
    
    products.forEach(product => {
      const productData = this.extractProductData(product);
      if (productData) {
        this.productDatabase.push(productData);
      }
    });
    
    console.log(`🤖 Scanned ${this.productDatabase.length} products for AI analysis`);
  }
  
  extractProductData(element) {
    const title = element.querySelector('.card__heading, .product-card__title, h3');
    const price = element.querySelector('.price, .card__price');
    const image = element.querySelector('img');
    const link = element.querySelector('a');
    
    if (!title) return null;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: title.textContent.trim(),
      price: price ? this.extractPrice(price.textContent) : 0,
      priceText: price ? price.textContent.trim() : 'Price unavailable',
      image: image ? image.src : null,
      link: link ? link.href : null,
      element: element,
      category: this.inferCategory(title.textContent),
      popularity: Math.random() * 100, // Simulated popularity score
      trending: Math.random() > 0.7,
      lastViewed: null
    };
  }
  
  extractPrice(priceText) {
    const match = priceText.match(/\$?(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  inferCategory(title) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('mushroom') || lowerTitle.includes('fungi')) return 'mushrooms';
    if (lowerTitle.includes('supplement') || lowerTitle.includes('capsule')) return 'supplements';
    if (lowerTitle.includes('tea') || lowerTitle.includes('powder')) return 'beverages';
    if (lowerTitle.includes('kit') || lowerTitle.includes('growing')) return 'equipment';
    return 'other';
  }
  
  startBehaviorTracking() {
    // Track product views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const productData = this.productDatabase.find(p => p.element === entry.target);
          if (productData) {
            this.trackProductView(productData);
          }
        }
      });
    }, { threshold: 0.5 });
    
    this.productDatabase.forEach(product => {
      observer.observe(product.element);
    });
    
    // Track clicks
    document.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card, .card');
      if (productCard) {
        const productData = this.productDatabase.find(p => p.element === productCard);
        if (productData) {
          this.trackProductInteraction(productData, 'click');
        }
      }
    });
    
    // Track hovers
    document.addEventListener('mouseover', (e) => {
      const productCard = e.target.closest('.product-card, .card');
      if (productCard) {
        const productData = this.productDatabase.find(p => p.element === productCard);
        if (productData) {
          this.trackProductInteraction(productData, 'hover');
        }
      }
    });
  }
  
  trackProductView(product) {
    product.lastViewed = Date.now();
    
    if (!this.userProfile.viewHistory.find(v => v.id === product.id)) {
      this.userProfile.viewHistory.push({
        id: product.id,
        title: product.title,
        category: product.category,
        timestamp: Date.now()
      });
      
      // Update category preferences
      this.userProfile.categories[product.category] = 
        (this.userProfile.categories[product.category] || 0) + 1;
    }
    
    // Limit history size
    if (this.userProfile.viewHistory.length > 50) {
      this.userProfile.viewHistory.shift();
    }
    
    this.saveUserProfile();
  }
  
  trackProductInteraction(product, type) {
    this.behaviorPattern.push({
      productId: product.id,
      type: type,
      category: product.category,
      timestamp: Date.now()
    });
    
    // Limit pattern history
    if (this.behaviorPattern.length > 100) {
      this.behaviorPattern.shift();
    }
    
    // Trigger recommendation update
    this.updateRecommendations();
  }
  
  startRecommendationEngine() {
    // Initial recommendations
    this.generateRecommendations();
    
    // Update recommendations periodically
    this.updateInterval = setInterval(() => {
      this.generateRecommendations();
    }, 30000); // Every 30 seconds
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    // Category-based recommendations
    const topCategories = Object.entries(this.userProfile.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
    
    topCategories.forEach(([category, score]) => {
      const categoryProducts = this.productDatabase
        .filter(p => p.category === category)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 2);
      
      categoryProducts.forEach(product => {
        recommendations.push({
          ...product,
          reason: `Based on your interest in ${category}`,
          type: 'personalized',
          score: score * product.popularity
        });
      });
    });
    
    // Trending products
    const trendingProducts = this.productDatabase
      .filter(p => p.trending)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
    
    trendingProducts.forEach(product => {
      recommendations.push({
        ...product,
        reason: 'Trending now',
        type: 'trending',
        score: product.popularity * 1.2
      });
    });
    
    // Popular products
    const popularProducts = this.productDatabase
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 2);
    
    popularProducts.forEach(product => {
      recommendations.push({
        ...product,
        reason: 'Popular choice',
        type: 'popular',
        score: product.popularity
      });
    });
    
    // AI pick (highest scoring)
    const aiPick = this.productDatabase
      .sort((a, b) => b.popularity - a.popularity)[0];
    
    if (aiPick) {
      recommendations.push({
        ...aiPick,
        reason: 'AI Recommended',
        type: 'ai-pick',
        score: 100
      });
    }
    
    // Remove duplicates and sort by score
    const uniqueRecommendations = recommendations
      .filter((item, index, arr) => arr.findIndex(t => t.id === item.id) === index)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    
    this.recommendations = uniqueRecommendations;
    this.updateRecommendationDisplay();
  }
  
  createRecommendationPanel() {
    const panel = document.createElement('div');
    panel.className = 'quantum-ai-recommendations';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <div class="quantum-ai-header">
        <div class="quantum-ai-avatar">AI</div>
        <div>
          <h3 class="quantum-ai-title">Smart Recommendations</h3>
          <p class="quantum-ai-subtitle">Powered by Quantum AI</p>
        </div>
        <button class="quantum-ai-close" aria-label="Close recommendations">×</button>
      </div>
      <div class="quantum-ai-content">
        <div class="quantum-ai-loading">
          <p>Analyzing your preferences...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    this.panel = panel;
    
    // Setup close button
    panel.querySelector('.quantum-ai-close').addEventListener('click', () => {
      this.hideRecommendations();
    });
  }
  
  createTriggerButton() {
    const trigger = document.createElement('button');
    trigger.className = 'quantum-ai-trigger';
    trigger.setAttribute('aria-label', 'Show AI recommendations');
    trigger.innerHTML = `
      <svg class="quantum-ai-trigger-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
        <path d="M2 17L12 22L22 17"/>
        <path d="M2 12L12 17L22 12"/>
      </svg>
      <div class="quantum-ai-notification-badge" style="display: none;">!</div>
    `;
    
    document.body.appendChild(trigger);
    this.trigger = trigger;
    
    trigger.addEventListener('click', () => {
      this.toggleRecommendations();
    });
    
    // Show trigger after delay
    setTimeout(() => {
      trigger.classList.add('pulsing');
    }, 5000);
  }
  
  updateRecommendationDisplay() {
    if (!this.panel) return;
    
    const content = this.panel.querySelector('.quantum-ai-content');
    
    if (this.recommendations.length === 0) {
      content.innerHTML = '<p>No recommendations available yet. Browse some products to get started!</p>';
      return;
    }
    
    const html = this.recommendations.map(rec => `
      <div class="quantum-recommendation-item ${rec.type}" 
           onclick="window.location.href='${rec.link || '#'}'"
           tabindex="0"
           role="button"
           aria-label="View ${rec.title}">
        <div class="quantum-recommendation-image">
          <img src="${rec.image || '/assets/placeholder.jpg'}" alt="${rec.title}" loading="lazy">
        </div>
        <div class="quantum-recommendation-content">
          <h4 class="quantum-recommendation-title">${rec.title}</h4>
          <p class="quantum-recommendation-reason">${rec.reason}</p>
          <p class="quantum-recommendation-price">${rec.priceText}</p>
        </div>
        <div class="quantum-recommendation-badge ${rec.type}">${this.getBadgeText(rec.type)}</div>
      </div>
    `).join('');
    
    content.innerHTML = html;
    
    // Update notification badge
    const badge = this.trigger.querySelector('.quantum-ai-notification-badge');
    if (badge && this.recommendations.length > 0) {
      badge.style.display = 'flex';
      badge.textContent = this.recommendations.length;
    }
  }
  
  getBadgeText(type) {
    const badges = {
      trending: '🔥',
      popular: '⭐',
      'ai-pick': '🤖',
      personalized: '👤',
      urgent: '⚡'
    };
    return badges[type] || '✨';
  }
  
  toggleRecommendations() {
    if (this.isVisible) {
      this.hideRecommendations();
    } else {
      this.showRecommendations();
    }
  }
  
  showRecommendations() {
    this.panel.classList.add('show');
    this.panel.setAttribute('aria-hidden', 'false');
    this.isVisible = true;
    this.trigger.classList.remove('pulsing');
    
    // Hide notification badge
    const badge = this.trigger.querySelector('.quantum-ai-notification-badge');
    if (badge) badge.style.display = 'none';
  }
  
  hideRecommendations() {
    this.panel.classList.remove('show');
    this.panel.setAttribute('aria-hidden', 'true');
    this.isVisible = false;
  }
  
  updateRecommendations() {
    // Debounce updates
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.generateRecommendations();
    }, 2000);
  }
  
  setupEventListeners() {
    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hideRecommendations();
      }
    });
    
    // Auto-show recommendations after activity
    let activityCount = 0;
    document.addEventListener('click', () => {
      activityCount++;
      if (activityCount === 5 && !this.isVisible) {
        setTimeout(() => {
          this.trigger.classList.add('pulsing');
        }, 2000);
      }
    });
  }
  
  cleanup() {
    clearInterval(this.updateInterval);
    clearTimeout(this.updateTimeout);
  }
}

// Advanced Sentiment Analysis Engine
class QuantumSentimentAnalyzer {
  constructor() {
    this.currentSentiment = 'neutral';
    this.sentimentHistory = [];
    this.behaviorMetrics = {
      clickRate: 0,
      scrollSpeed: 0,
      hoverDuration: 0,
      timeOnPage: Date.now()
    };
    this.overlay = null;
    this.init();
  }
  
  init() {
    this.createSentimentOverlay();
    this.startSentimentTracking();
    this.setupSentimentAnalysis();
  }
  
  createSentimentOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'quantum-sentiment-overlay';
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }
  
  startSentimentTracking() {
    let lastInteraction = Date.now();
    let interactions = 0;
    let totalHoverTime = 0;
    let hoverStart = 0;
    
    // Track interactions
    document.addEventListener('click', () => {
      interactions++;
      lastInteraction = Date.now();
      this.analyzeSentiment();
    });
    
    // Track hover duration
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.product-card, .nav-link')) {
        hoverStart = Date.now();
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.product-card, .nav-link') && hoverStart) {
        totalHoverTime += Date.now() - hoverStart;
        this.behaviorMetrics.hoverDuration = totalHoverTime / interactions || 0;
        hoverStart = 0;
      }
    });
    
    // Track scroll behavior
    let lastScrollY = window.scrollY;
    let scrollEvents = 0;
    
    document.addEventListener('scroll', () => {
      scrollEvents++;
      const scrollDelta = Math.abs(window.scrollY - lastScrollY);
      this.behaviorMetrics.scrollSpeed = scrollDelta / scrollEvents;
      lastScrollY = window.scrollY;
      
      this.analyzeSentiment();
    });
    
    // Update click rate
    setInterval(() => {
      const timeElapsed = (Date.now() - this.behaviorMetrics.timeOnPage) / 1000;
      this.behaviorMetrics.clickRate = interactions / timeElapsed;
    }, 5000);
  }
  
  analyzeSentiment() {
    const { clickRate, scrollSpeed, hoverDuration } = this.behaviorMetrics;
    
    let sentiment = 'neutral';
    
    // High engagement = excited
    if (clickRate > 0.5 && scrollSpeed > 50) {
      sentiment = 'excited';
    }
    // Slow, deliberate browsing = focused
    else if (hoverDuration > 2000 && scrollSpeed < 20) {
      sentiment = 'focused';
    }
    // Happy engagement
    else if (clickRate > 0.2 && hoverDuration > 1000) {
      sentiment = 'positive';
    }
    // Calm browsing
    else if (scrollSpeed < 30 && clickRate < 0.1) {
      sentiment = 'relaxed';
    }
    
    this.updateSentiment(sentiment);
  }
  
  updateSentiment(sentiment) {
    if (this.currentSentiment === sentiment) return;
    
    this.currentSentiment = sentiment;
    this.sentimentHistory.push({
      sentiment,
      timestamp: Date.now()
    });
    
    // Keep recent history
    if (this.sentimentHistory.length > 20) {
      this.sentimentHistory.shift();
    }
    
    this.applySentimentVisualization(sentiment);
    console.log(`😊 Sentiment detected: ${sentiment}`);
  }
  
  applySentimentVisualization(sentiment) {
    // Remove existing sentiment classes
    this.overlay.classList.remove('positive', 'excited', 'focused', 'relaxed', 'neutral');
    
    // Apply new sentiment
    if (sentiment !== 'neutral') {
      this.overlay.classList.add(sentiment);
    }
    
    // Notify other systems
    document.body.setAttribute('data-sentiment', sentiment);
    
    // Trigger emotion-based effects
    this.triggerEmotionalEffects(sentiment);
  }
  
  triggerEmotionalEffects(sentiment) {
    // Apply sentiment to product cards
    const productCards = document.querySelectorAll('.product-card, .card');
    
    productCards.forEach(card => {
      card.classList.remove('sentiment-positive', 'sentiment-excited', 'sentiment-focused', 'sentiment-relaxed');
      
      if (sentiment !== 'neutral') {
        card.classList.add(`sentiment-${sentiment}`);
      }
    });
    
    // Adjust recommendation engine based on sentiment
    if (window.quantumRecommendationEngine) {
      window.quantumRecommendationEngine.adjustForSentiment(sentiment);
    }
  }
  
  setupSentimentAnalysis() {
    // Periodic sentiment analysis
    setInterval(() => {
      this.analyzeSentiment();
    }, 10000);
  }
}

// Dynamic Pricing Visualization System
class QuantumDynamicPricing {
  constructor() {
    this.priceElements = [];
    this.priceHistory = new Map();
    this.init();
  }
  
  init() {
    this.scanPriceElements();
    this.setupPriceMonitoring();
    this.simulateDynamicPricing();
  }
  
  scanPriceElements() {
    const prices = document.querySelectorAll('.price, .card__price, .product-price');
    
    prices.forEach(priceElement => {
      const container = this.createPriceContainer(priceElement);
      this.priceElements.push({
        element: priceElement,
        container: container,
        originalPrice: this.extractPrice(priceElement.textContent),
        currentPrice: this.extractPrice(priceElement.textContent),
        trend: 'stable'
      });
    });
  }
  
  createPriceContainer(priceElement) {
    const container = document.createElement('div');
    container.className = 'quantum-price-container';
    
    const visualization = document.createElement('div');
    visualization.className = 'quantum-price-visualization';
    
    const trend = document.createElement('div');
    trend.className = 'quantum-price-trend';
    trend.style.display = 'none';
    
    priceElement.parentNode.insertBefore(container, priceElement);
    visualization.appendChild(priceElement);
    visualization.appendChild(trend);
    container.appendChild(visualization);
    
    return { container, visualization, trend };
  }
  
  extractPrice(text) {
    const match = text.match(/\$?(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  setupPriceMonitoring() {
    // Monitor for price changes (in real apps, this would connect to APIs)
    setInterval(() => {
      this.checkPriceUpdates();
    }, 30000);
  }
  
  simulateDynamicPricing() {
    // Simulate dynamic pricing changes for demo
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of price change
        this.simulatePriceChange();
      }
    }, 45000);
  }
  
  simulatePriceChange() {
    if (this.priceElements.length === 0) return;
    
    const randomPrice = this.priceElements[Math.floor(Math.random() * this.priceElements.length)];
    const changePercent = (Math.random() - 0.5) * 0.2; // ±10% change
    const newPrice = randomPrice.currentPrice * (1 + changePercent);
    
    this.updatePrice(randomPrice, newPrice);
  }
  
  updatePrice(priceObj, newPrice) {
    const oldPrice = priceObj.currentPrice;
    priceObj.currentPrice = newPrice;
    
    // Determine trend
    let trend = 'stable';
    let trendIcon = '→';
    let visualizationClass = '';
    
    if (newPrice > oldPrice) {
      trend = 'up';
      trendIcon = '↗';
      visualizationClass = 'price-rise';
    } else if (newPrice < oldPrice) {
      trend = 'down';
      trendIcon = '↘';
      visualizationClass = 'price-drop';
    }
    
    // Update display
    priceObj.element.textContent = priceObj.element.textContent.replace(
      /\$?\d+\.?\d*/,
      `$${newPrice.toFixed(2)}`
    );
    
    // Add visualization effects
    priceObj.container.visualization.classList.remove('price-drop', 'price-rise', 'limited-time');
    if (visualizationClass) {
      priceObj.container.visualization.classList.add(visualizationClass);
    }
    
    // Update trend indicator
    priceObj.container.trend.textContent = trendIcon;
    priceObj.container.trend.className = `quantum-price-trend ${trend}`;
    priceObj.container.trend.style.display = 'flex';
    
    // Special effects for significant changes
    if (Math.abs(newPrice - oldPrice) / oldPrice > 0.15) {
      priceObj.container.visualization.classList.add('limited-time');
      priceObj.container.trend.classList.add('hot');
    }
    
    // Hide trend after animation
    setTimeout(() => {
      priceObj.container.trend.style.display = 'none';
      priceObj.container.visualization.classList.remove(visualizationClass, 'limited-time');
    }, 3000);
    
    console.log(`💰 Price updated: ${oldPrice.toFixed(2)} → ${newPrice.toFixed(2)} (${trend})`);
  }
  
  checkPriceUpdates() {
    // In a real implementation, this would check APIs for price updates
    this.priceElements.forEach(priceObj => {
      const currentText = priceObj.element.textContent;
      const currentPrice = this.extractPrice(currentText);
      
      if (currentPrice !== priceObj.currentPrice && currentPrice > 0) {
        this.updatePrice(priceObj, currentPrice);
      }
    });
  }
}

// Smart Product Highlighting System
class QuantumSmartHighlighter {
  constructor() {
    this.highlightedProducts = new Set();
    this.init();
  }
  
  init() {
    this.setupProductHighlighting();
    this.connectToRecommendationEngine();
  }
  
  setupProductHighlighting() {
    // Highlight products based on user behavior
    document.addEventListener('mouseover', (e) => {
      const productCard = e.target.closest('.product-card, .card');
      if (productCard && !this.highlightedProducts.has(productCard)) {
        this.considerHighlighting(productCard);
      }
    });
  }
  
  considerHighlighting(productCard) {
    // Simulate AI decision making
    const shouldHighlight = Math.random() > 0.7; // 30% chance
    
    if (shouldHighlight) {
      this.highlightProduct(productCard, this.getRandomHighlightType());
    }
  }
  
  getRandomHighlightType() {
    const types = ['recommended', 'trending', 'popular'];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  highlightProduct(productCard, type) {
    productCard.classList.add('quantum-smart-highlight', type);
    this.highlightedProducts.add(productCard);
    
    // Remove highlight after delay
    setTimeout(() => {
      productCard.classList.remove('quantum-smart-highlight', type);
      this.highlightedProducts.delete(productCard);
    }, 5000);
  }
  
  connectToRecommendationEngine() {
    // Connect to recommendation engine when available
    if (window.quantumRecommendationEngine) {
      this.highlightRecommendedProducts();
    }
  }
  
  highlightRecommendedProducts() {
    const engine = window.quantumRecommendationEngine;
    if (!engine || !engine.recommendations) return;
    
    engine.recommendations.forEach(rec => {
      if (rec.element && rec.score > 80) {
        this.highlightProduct(rec.element, rec.type);
      }
    });
  }
}

// Initialize Phase 6 Systems
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all Phase 6 systems
  const recommendationEngine = new QuantumAIRecommendationEngine();
  const sentimentAnalyzer = new QuantumSentimentAnalyzer();
  const dynamicPricing = new QuantumDynamicPricing();
  const smartHighlighter = new QuantumSmartHighlighter();
  
  // Make recommendation engine globally available
  window.quantumRecommendationEngine = recommendationEngine;
  window.quantumSentimentAnalyzer = sentimentAnalyzer;
  
  // Cross-system integration
  recommendationEngine.adjustForSentiment = function(sentiment) {
    // Adjust recommendation algorithm based on user sentiment
    const multipliers = {
      excited: 1.5,
      focused: 1.2,
      positive: 1.3,
      relaxed: 0.8,
      neutral: 1.0
    };
    
    const multiplier = multipliers[sentiment] || 1.0;
    this.recommendations.forEach(rec => {
      rec.score *= multiplier;
    });
    
    this.updateRecommendationDisplay();
  };
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    recommendationEngine.cleanup();
  });
  
  console.log('🧠 Quantum Phase 6: Hyper-Intelligence - ACTIVATED');
  console.log('🤖 AI Recommendation Engine: Active');
  console.log('😊 Sentiment Analysis: Active');
  console.log('💰 Dynamic Pricing: Active');
  console.log('✨ Smart Highlighting: Active');
});