/**
 * Crowe Sidebar Money-Making Engine
 * Advanced e-commerce conversion optimization system
 * Built on top of existing quantum enhancements and utils
 */

class CroweMoneyEngine {
  constructor() {
    this.initialized = false;
    this.cartData = { total_price: 0, item_count: 0, items: [] };
    this.customerData = this.getCustomerData();
    this.recentlyViewed = JSON.parse(localStorage.getItem('crowe_recently_viewed') || '[]');
    this.activityFeed = [];
    this.conversionSettings = {
      freeShippingThreshold: 7500, // $75 in cents
      urgencyUpdateInterval: 30000, // 30 seconds
      activityUpdateInterval: 15000, // 15 seconds
      emailCaptureDelay: 45000, // 45 seconds
      abandonmentDetectionTime: 60000, // 1 minute
    };
    
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing Crowe Money-Making Engine...');
    
    this.setupEventListeners();
    this.loadCartData();
    this.initializeRecommendations();
    this.startLiveActivityFeed();
    this.setupUrgencyTriggers();
    this.initializeAbandonmentPrevention();
    this.setupConversionTracking();
    this.scheduleEmailCapture();
    
    this.initialized = true;
    
    // Trigger custom event for other systems to hook into
    window.ThemeEvents?.dispatch('crowe:money-engine:initialized', {
      engine: this,
      timestamp: Date.now()
    });
    
    console.log('✅ Crowe Money-Making Engine initialized successfully!');
  }

  // =====================================================
  // CART MANAGEMENT & SHIPPING PROGRESS
  // =====================================================

  async loadCartData() {
    try {
      const response = await fetch('/cart.js');
      this.cartData = await response.json();
      this.updateCartDisplay();
      this.updateShippingProgress();
    } catch (error) {
      console.error('Failed to load cart data:', error);
    }
  }

  updateCartDisplay() {
    const countBubble = document.getElementById('cart-count-bubble');
    if (countBubble && this.cartData.item_count > 0) {
      countBubble.textContent = this.cartData.item_count;
      countBubble.style.display = 'flex';
    } else if (countBubble) {
      countBubble.style.display = 'none';
    }
  }

  updateShippingProgress() {
    const progressSection = document.getElementById('shipping-progress');
    const progressFill = document.getElementById('shipping-progress-fill');
    const progressText = document.getElementById('shipping-text');
    
    if (!progressSection || !progressFill || !progressText) return;

    const currentTotal = this.cartData.total_price;
    const threshold = this.conversionSettings.freeShippingThreshold;
    
    if (currentTotal > 0) {
      progressSection.style.display = 'block';
      
      if (currentTotal >= threshold) {
        progressFill.style.width = '100%';
        progressText.textContent = '🎉 You qualify for FREE shipping!';
        progressText.style.color = '#27ae60';
      } else {
        const percentage = (currentTotal / threshold) * 100;
        const remaining = (threshold - currentTotal) / 100;
        
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        progressText.textContent = `Add $${remaining.toFixed(2)} more for FREE shipping!`;
        progressText.style.color = '#D4AF37';
      }
    } else {
      progressSection.style.display = 'none';
    }
  }

  // =====================================================
  // SMART PRODUCT RECOMMENDATIONS
  // =====================================================

  async initializeRecommendations() {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    if (!recommendationsGrid) return;

    try {
      // Get current product if on product page
      const currentProductId = this.getCurrentProductId();
      
      // Get personalized recommendations
      const recommendations = await this.getSmartRecommendations(currentProductId);
      
      this.renderRecommendations(recommendations, recommendationsGrid);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      this.renderFallbackRecommendations(recommendationsGrid);
    }
  }

  async getSmartRecommendations(currentProductId = null) {
    // Try multiple recommendation strategies
    const strategies = [
      () => this.getRelatedProducts(currentProductId),
      () => this.getTrendingProducts(),
      () => this.getPersonalizedRecommendations(),
      () => this.getCartBasedRecommendations()
    ];

    for (const strategy of strategies) {
      try {
        const products = await strategy();
        if (products && products.length > 0) {
          return products.slice(0, 3); // Limit to 3 recommendations
        }
      } catch (error) {
        console.warn('Recommendation strategy failed:', error);
      }
    }

    return [];
  }

  async getRelatedProducts(productId) {
    if (!productId) return [];
    
    const response = await fetch(`/recommendations/products.json?product_id=${productId}&limit=6`);
    const data = await response.json();
    return data.products || [];
  }

  async getTrendingProducts() {
    // Get products from a trending collection
    const response = await fetch('/collections/trending/products.json?limit=6');
    const data = await response.json();
    return data.products || [];
  }

  getPersonalizedRecommendations() {
    // Use recently viewed and cart data for personalization
    const viewed = this.recentlyViewed.slice(0, 3);
    const cartCategories = this.getCartCategories();
    
    // Combine and deduplicate
    return this.combineRecommendations(viewed, cartCategories);
  }

  getCartBasedRecommendations() {
    // Get complementary products based on cart contents
    if (this.cartData.items.length === 0) return [];
    
    const cartProductIds = this.cartData.items.map(item => item.product_id);
    return this.getComplementaryProducts(cartProductIds);
  }

  renderRecommendations(products, container) {
    if (!products || products.length === 0) {
      this.renderFallbackRecommendations(container);
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="recommendation-item" onclick="croweMoneyEngine.trackRecommendationClick('${product.id}', '${product.handle}')">
        <img src="${product.featured_image || '/assets/placeholder.jpg'}" 
             alt="${product.title}" 
             class="recommendation-image"
             loading="lazy">
        <div class="recommendation-details">
          <div class="recommendation-title">${this.truncateText(product.title, 40)}</div>
          <div class="recommendation-price">
            ${this.formatMoney(product.price)}
            ${product.compare_at_price && product.compare_at_price > product.price ? 
              `<span class="recommendation-compare-price">${this.formatMoney(product.compare_at_price)}</span>` : ''
            }
          </div>
          <button class="recommendation-quick-add" 
                  onclick="event.stopPropagation(); croweMoneyEngine.quickAddProduct('${product.variants[0]?.id}', '${product.title}')">
            Quick Add
          </button>
        </div>
      </div>
    `).join('');
  }

  renderFallbackRecommendations(container) {
    container.innerHTML = `
      <div class="recommendation-item">
        <div class="recommendation-details">
          <div class="recommendation-title">Discovering amazing products for you...</div>
          <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 4px;">
            Check back soon for personalized recommendations!
          </div>
        </div>
      </div>
    `;
  }

  // =====================================================
  // LIVE ACTIVITY FEED
  // =====================================================

  startLiveActivityFeed() {
    this.generateInitialActivity();
    
    // Update activity feed regularly
    setInterval(() => {
      this.addRandomActivity();
    }, this.conversionSettings.activityUpdateInterval);
  }

  generateInitialActivity() {
    const activities = [
      { customer: "Sarah M.", action: "purchased", product: "Lion's Mane Mushroom", location: "Denver, CO" },
      { customer: "Mike R.", action: "added to cart", product: "Reishi Blend", location: "Austin, TX" },
      { customer: "Emma L.", action: "purchased", product: "Cordyceps Extract", location: "Seattle, WA" },
    ];

    activities.forEach((activity, index) => {
      setTimeout(() => {
        this.addActivityItem(activity);
      }, index * 2000);
    });
  }

  addRandomActivity() {
    const customers = ["Alex K.", "Jordan P.", "Casey W.", "Riley T.", "Morgan S."];
    const actions = ["purchased", "added to cart", "is viewing"];
    const products = ["Lion's Mane", "Reishi Blend", "Cordyceps", "Turkey Tail", "Shiitake Extract"];
    const locations = ["NYC", "LA", "Chicago", "Miami", "Boston", "Portland", "Denver"];

    const activity = {
      customer: customers[Math.floor(Math.random() * customers.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      product: products[Math.floor(Math.random() * products.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    };

    this.addActivityItem(activity);
  }

  addActivityItem(activity) {
    const container = document.getElementById('activity-items');
    if (!container) return;

    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    activityElement.innerHTML = `
      <span class="activity-customer">${activity.customer}</span> 
      ${activity.action} 
      <span class="activity-product">${activity.product}</span> 
      from <span class="activity-location">${activity.location}</span>
    `;

    container.insertBefore(activityElement, container.firstChild);

    // Keep only the latest 3 activities
    while (container.children.length > 3) {
      container.removeChild(container.lastChild);
    }

    // Track for analytics
    this.trackActivity('live_activity_generated', activity);
  }

  // =====================================================
  // URGENCY & SCARCITY TRIGGERS
  // =====================================================

  setupUrgencyTriggers() {
    this.showInitialUrgencyTriggers();
    
    // Update urgency triggers periodically
    setInterval(() => {
      this.updateUrgencyTriggers();
    }, this.conversionSettings.urgencyUpdateInterval);
  }

  showInitialUrgencyTriggers() {
    const triggers = [
      { type: 'flash-sale', icon: '⚡', message: 'Flash Sale: 20% off all mushroom extracts! Limited time only.' },
      { type: 'low-stock', icon: '📦', message: 'Only 3 left in stock! Lion\'s Mane is selling fast.' },
      { type: 'trending', icon: '🔥', message: 'Trending now: Reishi Blend - 127 people viewing this product.' }
    ];

    triggers.forEach((trigger, index) => {
      setTimeout(() => {
        this.showUrgencyTrigger(trigger);
      }, index * 5000);
    });
  }

  updateUrgencyTriggers() {
    // Rotate through different urgency messages
    const currentHour = new Date().getHours();
    
    if (currentHour >= 9 && currentHour <= 17) {
      // Business hours - show stock urgency
      this.showUrgencyTrigger({
        type: 'low-stock',
        icon: '📦',
        message: `Limited stock alert: Only ${Math.floor(Math.random() * 5) + 1} items left!`
      });
    } else {
      // Evening/night - show social proof
      this.showUrgencyTrigger({
        type: 'trending',
        icon: '👥',
        message: `${Math.floor(Math.random() * 50) + 20} people are shopping right now!`
      });
    }
  }

  showUrgencyTrigger(trigger) {
    const container = document.getElementById('urgency-triggers');
    if (!container) return;

    const triggerElement = document.createElement('div');
    triggerElement.className = `urgency-trigger ${trigger.type}`;
    triggerElement.innerHTML = `
      <span class="urgency-icon">${trigger.icon}</span>
      <span class="urgency-text">${trigger.message}</span>
    `;

    // Remove old triggers
    container.innerHTML = '';
    container.appendChild(triggerElement);

    // Auto-remove after 20 seconds
    setTimeout(() => {
      if (triggerElement.parentNode) {
        triggerElement.style.opacity = '0';
        setTimeout(() => {
          if (triggerElement.parentNode) {
            triggerElement.remove();
          }
        }, 500);
      }
    }, 20000);

    this.trackActivity('urgency_trigger_shown', trigger);
  }

  // =====================================================
  // CART ABANDONMENT PREVENTION
  // =====================================================

  initializeAbandonmentPrevention() {
    let abandonmentTimer;
    let userInteracted = false;

    // Track user interactions
    const trackInteraction = () => {
      userInteracted = true;
      clearTimeout(abandonmentTimer);
      
      // Reset timer if user has items in cart
      if (this.cartData.item_count > 0) {
        abandonmentTimer = setTimeout(() => {
          this.showAbandonmentPrevention();
        }, this.conversionSettings.abandonmentDetectionTime);
      }
    };

    // Track mouse movement, clicks, and scrolling
    document.addEventListener('mousemove', trackInteraction, { passive: true });
    document.addEventListener('click', trackInteraction);
    document.addEventListener('scroll', trackInteraction, { passive: true });

    // Track when user tries to leave
    document.addEventListener('mouseout', (e) => {
      if (e.clientY <= 0 && this.cartData.item_count > 0 && userInteracted) {
        this.showAbandonmentPrevention();
      }
    });

    // Listen for cart updates
    document.addEventListener('cart:updated', () => {
      this.loadCartData();
      if (this.cartData.item_count > 0) {
        trackInteraction();
      }
    });
  }

  showAbandonmentPrevention() {
    const abandonmentSection = document.getElementById('cart-abandonment');
    if (!abandonmentSection || this.cartData.item_count === 0) return;

    // Don't show if already visible or recently shown
    if (abandonmentSection.style.display === 'block' || 
        localStorage.getItem('crowe_abandonment_shown_' + Date.now().toString().slice(0, -5))) {
      return;
    }

    const messages = [
      "Complete your purchase and save 10% with code SAVE10",
      "Don't let these premium mushrooms slip away! Complete your order now.",
      "Your cart expires in 15 minutes. Secure your mushroom supplements today!",
      "Free shipping included! Complete your wellness journey now."
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('abandonment-message').textContent = message;
    
    abandonmentSection.style.display = 'block';
    
    // Track abandonment prevention show
    this.trackActivity('abandonment_prevention_shown', { 
      cartValue: this.cartData.total_price,
      itemCount: this.cartData.item_count 
    });

    // Mark as shown (expires in 1 hour)
    localStorage.setItem('crowe_abandonment_shown_' + Date.now().toString().slice(0, -5), 'true');
    setTimeout(() => {
      localStorage.removeItem('crowe_abandonment_shown_' + Date.now().toString().slice(0, -5));
    }, 3600000);

    // Auto-hide after 30 seconds
    setTimeout(() => {
      abandonmentSection.style.display = 'none';
    }, 30000);
  }

  // =====================================================
  // EMAIL CAPTURE WITH INCENTIVE
  // =====================================================

  scheduleEmailCapture() {
    // Don't show if user is already subscribed or has dismissed recently
    if (localStorage.getItem('crowe_email_captured') || 
        localStorage.getItem('crowe_email_dismissed_' + Date.now().toString().slice(0, -6))) {
      return;
    }

    setTimeout(() => {
      this.showEmailCapture();
    }, this.conversionSettings.emailCaptureDelay);
  }

  showEmailCapture() {
    const emailSection = document.getElementById('email-capture');
    if (!emailSection) return;

    // Show with animation
    emailSection.style.display = 'block';
    
    // Setup form submission
    const form = document.getElementById('newsletter-signup');
    if (form) {
      form.addEventListener('submit', (e) => {
        this.handleEmailCapture(e);
      });
    }

    this.trackActivity('email_capture_shown', { timestamp: Date.now() });
  }

  async handleEmailCapture(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const button = form.querySelector('.capture-btn');
    
    if (!email) return;

    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;

    try {
      // Submit to Shopify customer API or newsletter service
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'form_type': 'customer',
          'utf8': '✓',
          'customer[email]': email,
          'customer[accepts_marketing]': '1'
        })
      });

      if (response.ok) {
        // Success state
        button.textContent = 'Success! Check your email';
        button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        
        // Hide after success
        setTimeout(() => {
          document.getElementById('email-capture').style.display = 'none';
        }, 3000);

        // Mark as captured
        localStorage.setItem('crowe_email_captured', 'true');
        
        this.trackActivity('email_captured', { email });
        
        // Show discount code or redirect
        this.showDiscountCode();
        
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      // Error state
      button.textContent = 'Try Again';
      button.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.disabled = false;
      }, 3000);
      
      this.trackActivity('email_capture_failed', { error: error.message });
    }
  }

  showDiscountCode() {
    // Show discount code modal or update UI
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.95); padding: 30px; border-radius: 16px;
      color: #D4AF37; text-align: center; z-index: 10000;
      border: 2px solid #D4AF37; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    `;
    modal.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 24px;">🎉 Welcome Bonus!</h3>
      <p style="margin: 0 0 20px 0; font-size: 16px;">Use code <strong>WELCOME15</strong> for 15% off your first order!</p>
      <button onclick="this.parentNode.remove()" style="
        background: linear-gradient(135deg, #D4AF37, #B8943F); color: black;
        border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;
        font-weight: 600;
      ">Got it!</button>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 10000);
  }

  // =====================================================
  // RECENTLY VIEWED PRODUCTS
  // =====================================================

  trackProductView(productId, productData) {
    if (!productId) return;

    // Add to recently viewed
    const viewed = this.recentlyViewed.filter(item => item.id !== productId);
    viewed.unshift({
      id: productId,
      ...productData,
      viewedAt: Date.now()
    });

    // Keep only last 10 items
    this.recentlyViewed = viewed.slice(0, 10);
    localStorage.setItem('crowe_recently_viewed', JSON.stringify(this.recentlyViewed));

    this.updateRecentlyViewedDisplay();
  }

  updateRecentlyViewedDisplay() {
    const container = document.getElementById('recently-viewed-grid');
    const section = document.getElementById('recently-viewed');
    
    if (!container || !section) return;

    if (this.recentlyViewed.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    
    container.innerHTML = this.recentlyViewed.slice(0, 4).map(product => `
      <div class="recently-viewed-item" onclick="window.location.href='/products/${product.handle}'">
        <img src="${product.image || '/assets/placeholder.jpg'}" 
             alt="${product.title}" 
             class="recently-viewed-image"
             loading="lazy">
        <div class="recently-viewed-title">${this.truncateText(product.title, 25)}</div>
      </div>
    `).join('');
  }

  // =====================================================
  // INTERACTION HANDLERS
  // =====================================================

  async quickAddProduct(variantId, productTitle) {
    if (!variantId) return;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update cart data
        await this.loadCartData();
        
        // Dispatch cart update event
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
        
        // Show success feedback
        this.showQuickAddSuccess(productTitle);
        
        // Track conversion
        this.trackActivity('quick_add_success', { 
          variantId, 
          productTitle,
          source: 'sidebar_recommendation'
        });
        
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Quick add failed:', error);
      this.showQuickAddError();
      
      this.trackActivity('quick_add_failed', { 
        variantId, 
        productTitle, 
        error: error.message 
      });
    }
  }

  showQuickAddSuccess(productTitle) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white; padding: 15px 20px; border-radius: 12px;
      font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = `✅ ${this.truncateText(productTitle, 30)} added to cart!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showQuickAddError() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white; padding: 15px 20px; border-radius: 12px;
      font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = '❌ Failed to add to cart. Please try again.';
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  trackRecommendationClick(productId, productHandle) {
    this.trackActivity('recommendation_clicked', { productId, productHandle });
    
    // Navigate to product
    window.location.href = `/products/${productHandle}`;
  }

  // =====================================================
  // CONVERSION TRACKING & ANALYTICS
  // =====================================================

  setupConversionTracking() {
    // Track page views
    this.trackActivity('page_view', {
      url: window.location.href,
      timestamp: Date.now()
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.trackActivity('scroll_depth', { percent: maxScroll });
        }
      }
    }, { passive: true });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackActivity('time_on_page', { duration: timeOnPage });
    });
  }

  trackActivity(event, data = {}) {
    const activityData = {
      event,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: this.getSessionId(),
      customerId: this.customerData?.id || null
    };

    // Store in local analytics
    const analytics = JSON.parse(localStorage.getItem('crowe_analytics') || '[]');
    analytics.push(activityData);
    
    // Keep only last 100 events
    localStorage.setItem('crowe_analytics', JSON.stringify(analytics.slice(-100)));

    // Send to analytics service (if configured)
    this.sendToAnalytics(activityData);
    
    console.log('📊 Tracked:', event, data);
  }

  sendToAnalytics(data) {
    // Send to Google Analytics, Mixpanel, or custom analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', data.event, {
        custom_parameter: JSON.stringify(data.data),
        value: data.data.value || 1
      });
    }
    
    // Send to custom analytics endpoint
    if (window.CROWE_ANALYTICS_ENDPOINT) {
      fetch(window.CROWE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(console.warn);
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  getCustomerData() {
    // Try to get customer data from Shopify
    if (typeof window.customer !== 'undefined') {
      return window.customer;
    }
    
    // Try from meta tags
    const customerData = document.querySelector('meta[name="customer-data"]');
    if (customerData) {
      try {
        return JSON.parse(customerData.content);
      } catch (e) {
        console.warn('Failed to parse customer data');
      }
    }
    
    return null;
  }

  getCurrentProductId() {
    // Try to get from meta tags
    const productMeta = document.querySelector('meta[name="product-id"]');
    if (productMeta) return productMeta.content;
    
    // Try from URL
    const match = window.location.pathname.match(/\/products\/([^\/]+)/);
    if (match) return match[1];
    
    return null;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('crowe_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      sessionStorage.setItem('crowe_session_id', sessionId);
    }
    return sessionId;
  }

  formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getCartCategories() {
    return this.cartData.items.map(item => item.product_type).filter(Boolean);
  }

  combineRecommendations(source1, source2) {
    // Combine and deduplicate recommendations
    const combined = [...source1, ...source2];
    const unique = combined.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    return unique;
  }

  async getComplementaryProducts(productIds) {
    // Implementation would depend on your product recommendation logic
    // This is a placeholder that returns trending products
    return this.getTrendingProducts();
  }
}

// =====================================================
// INITIALIZATION AND EVENT HANDLERS
// =====================================================

// Initialize the money-making engine when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for utils to be available
  if (typeof window.ThemeUtils !== 'undefined') {
    window.croweMoneyEngine = new CroweMoneyEngine();
  } else {
    // Wait for utils to load
    const checkUtils = setInterval(() => {
      if (typeof window.ThemeUtils !== 'undefined') {
        clearInterval(checkUtils);
        window.croweMoneyEngine = new CroweMoneyEngine();
      }
    }, 100);
  }
});

// Handle complete purchase button
document.addEventListener('click', function(e) {
  if (e.target.id === 'complete-purchase-btn') {
    window.location.href = '/cart';
    window.croweMoneyEngine?.trackActivity('abandonment_cta_clicked', {
      cartValue: window.croweMoneyEngine?.cartData?.total_price || 0
    });
  }
});

// Track product views automatically
if (window.location.pathname.includes('/products/')) {
  const productHandle = window.location.pathname.split('/products/')[1];
  if (productHandle) {
    // Get product data and track view
    fetch(`/products/${productHandle}.js`)
      .then(response => response.json())
      .then(product => {
        setTimeout(() => {
          if (window.croweMoneyEngine) {
            window.croweMoneyEngine.trackProductView(product.id, {
              title: product.title,
              handle: product.handle,
              image: product.featured_image,
              price: product.price
            });
          }
        }, 1000);
      })
      .catch(console.warn);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('🎯 Crowe Money-Making Engine script loaded successfully!');