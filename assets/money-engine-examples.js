/**
 * Crowe Money-Making Engine Usage Examples
 * Demonstrates advanced e-commerce conversion techniques
 */

// Example usage and testing functions for the money-making engine
window.CroweMoneyEngineExamples = {
  
  // Simulate various conversion scenarios for testing
  demoScenarios: {
    
    // Test cart abandonment prevention
    triggerAbandonmentPrevention() {
      if (window.croweMoneyEngine) {
        // Add items to cart first
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 'demo-variant-id', quantity: 1 })
        }).then(() => {
          // Trigger abandonment after a delay
          setTimeout(() => {
            window.croweMoneyEngine.showAbandonmentPrevention();
          }, 1000);
        });
      }
    },

    // Test email capture incentive
    triggerEmailCapture() {
      if (window.croweMoneyEngine) {
        window.croweMoneyEngine.showEmailCapture();
      }
    },

    // Test urgency triggers
    triggerUrgencyMessages() {
      if (window.croweMoneyEngine) {
        const urgencyTypes = [
          { type: 'low-stock', icon: '📦', message: 'Only 2 left! Limited stock alert.' },
          { type: 'flash-sale', icon: '⚡', message: 'Flash Sale: 30% off for next 2 hours!' },
          { type: 'trending', icon: '🔥', message: '89 people are viewing this collection right now.' }
        ];
        
        urgencyTypes.forEach((trigger, index) => {
          setTimeout(() => {
            window.croweMoneyEngine.showUrgencyTrigger(trigger);
          }, index * 3000);
        });
      }
    },

    // Test live activity feed
    triggerLiveActivity() {
      if (window.croweMoneyEngine) {
        const activities = [
          { customer: "Demo User A", action: "purchased", product: "Test Product 1", location: "Test City" },
          { customer: "Demo User B", action: "added to cart", product: "Test Product 2", location: "Test City" },
          { customer: "Demo User C", action: "is viewing", product: "Test Product 3", location: "Test City" }
        ];
        
        activities.forEach((activity, index) => {
          setTimeout(() => {
            window.croweMoneyEngine.addActivityItem(activity);
          }, index * 2000);
        });
      }
    },

    // Test shipping progress
    updateShippingDemo() {
      if (window.croweMoneyEngine) {
        // Simulate cart with different values
        const testValues = [1500, 3000, 5000, 7500]; // $15, $30, $50, $75
        
        testValues.forEach((value, index) => {
          setTimeout(() => {
            window.croweMoneyEngine.cartData.total_price = value;
            window.croweMoneyEngine.updateShippingProgress();
          }, index * 2000);
        });
      }
    }
  },

  // Analytics and conversion tracking examples
  analytics: {
    
    // Track custom conversion events
    trackConversion(eventName, value, data = {}) {
      if (window.croweMoneyEngine) {
        window.croweMoneyEngine.trackActivity(`conversion_${eventName}`, {
          value,
          ...data,
          timestamp: Date.now()
        });
      }
    },

    // Get conversion analytics summary
    getAnalyticsSummary() {
      const analytics = JSON.parse(localStorage.getItem('crowe_analytics') || '[]');
      const summary = {
        totalEvents: analytics.length,
        conversionEvents: analytics.filter(e => e.event.startsWith('conversion_')),
        cartEvents: analytics.filter(e => e.event.includes('cart')),
        engagementEvents: analytics.filter(e => e.event.includes('click') || e.event.includes('view')),
        recentActivity: analytics.slice(-10)
      };
      
      console.table(summary);
      return summary;
    },

    // Export analytics data
    exportAnalytics() {
      const analytics = JSON.parse(localStorage.getItem('crowe_analytics') || '[]');
      const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crowe-analytics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  // A/B testing framework
  abTesting: {
    
    // Test different email capture messages
    testEmailCaptureVariants() {
      const variants = [
        { title: "Get 15% Off Your First Order!", icon: "🎁" },
        { title: "Exclusive 20% Discount Inside!", icon: "💎" },
        { title: "Join & Save Big on Premium Mushrooms!", icon: "🍄" },
        { title: "Unlock VIP Pricing - Save 25%!", icon: "⭐" }
      ];
      
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      
      if (window.croweMoneyEngine) {
        const captureTitle = document.querySelector('.capture-title');
        const captureIcon = document.querySelector('.capture-icon');
        
        if (captureTitle && captureIcon) {
          captureTitle.textContent = randomVariant.title;
          captureIcon.textContent = randomVariant.icon;
          
          // Track which variant was shown
          window.croweMoneyEngine.trackActivity('ab_test_email_capture', {
            variant: randomVariant.title,
            variantIndex: variants.indexOf(randomVariant)
          });
        }
      }
    },

    // Test different urgency message styles
    testUrgencyVariants() {
      const urgencyVariants = [
        { style: 'scarcity', messages: ['Only X left in stock!', 'Limited quantity available!'] },
        { style: 'social_proof', messages: ['X people viewing this now!', 'Popular choice - trending!'] },
        { style: 'time_sensitive', messages: ['Sale ends in X hours!', 'Limited time offer!'] }
      ];
      
      const randomStyle = urgencyVariants[Math.floor(Math.random() * urgencyVariants.length)];
      const randomMessage = randomStyle.messages[Math.floor(Math.random() * randomStyle.messages.length)];
      
      if (window.croweMoneyEngine) {
        window.croweMoneyEngine.showUrgencyTrigger({
          type: randomStyle.style,
          icon: '⚡',
          message: randomMessage.replace('X', Math.floor(Math.random() * 50) + 1)
        });
        
        // Track variant performance
        window.croweMoneyEngine.trackActivity('ab_test_urgency', {
          style: randomStyle.style,
          message: randomMessage
        });
      }
    }
  },

  // Performance optimization examples
  performance: {
    
    // Measure sidebar rendering performance
    measureRenderingPerformance() {
      const startTime = performance.now();
      
      // Re-render recommendations
      if (window.croweMoneyEngine) {
        window.croweMoneyEngine.initializeRecommendations().then(() => {
          const endTime = performance.now();
          const renderTime = endTime - startTime;
          
          console.log(`Recommendations rendered in ${renderTime}ms`);
          
          // Track performance
          window.croweMoneyEngine.trackActivity('performance_measurement', {
            renderTime,
            component: 'recommendations'
          });
        });
      }
    },

    // Optimize image loading
    optimizeImageLoading() {
      const images = document.querySelectorAll('.sidebar-money-engine img');
      images.forEach(img => {
        // Add lazy loading
        img.loading = 'lazy';
        
        // Add intersection observer for advanced lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                observer.unobserve(img);
              }
            }
          });
        });
        
        observer.observe(img);
      });
    }
  },

  // Revenue optimization strategies
  revenueOptimization: {
    
    // Calculate potential revenue impact
    calculateRevenueImpact() {
      const analytics = JSON.parse(localStorage.getItem('crowe_analytics') || '[]');
      const conversionEvents = analytics.filter(e => e.event.includes('conversion') || e.event.includes('cart'));
      
      const impact = {
        totalInteractions: analytics.length,
        conversionRate: (conversionEvents.length / analytics.length * 100).toFixed(2) + '%',
        estimatedLift: '15-25%', // Based on industry benchmarks
        projectedRevenue: 'Varies by traffic',
        keyMetrics: {
          emailCaptures: analytics.filter(e => e.event === 'email_captured').length,
          quickAdds: analytics.filter(e => e.event === 'quick_add_success').length,
          abandonmentPrevention: analytics.filter(e => e.event === 'abandonment_cta_clicked').length,
          recommendationClicks: analytics.filter(e => e.event === 'recommendation_clicked').length
        }
      };
      
      console.table(impact);
      return impact;
    },

    // Suggest optimization strategies
    getOptimizationSuggestions() {
      const suggestions = [
        {
          strategy: "Personalization Enhancement",
          description: "Use customer browsing history to improve product recommendations",
          expectedLift: "20-30%",
          difficulty: "Medium"
        },
        {
          strategy: "Dynamic Pricing",
          description: "Implement time-based or demand-based pricing adjustments",
          expectedLift: "10-15%",
          difficulty: "High"
        },
        {
          strategy: "Advanced Segmentation",
          description: "Create customer segments for targeted messaging",
          expectedLift: "15-25%",
          difficulty: "Medium"
        },
        {
          strategy: "Social Proof Integration",
          description: "Display real customer reviews and ratings in sidebar",
          expectedLift: "8-12%",
          difficulty: "Low"
        },
        {
          strategy: "Gamification Elements",
          description: "Add loyalty points, badges, or achievement systems",
          expectedLift: "25-40%",
          difficulty: "High"
        }
      ];
      
      console.table(suggestions);
      return suggestions;
    }
  },

  // Integration examples with existing systems
  integrations: {
    
    // Integrate with Google Analytics
    setupGoogleAnalytics(trackingId) {
      // Create GA integration
      window.gtag = window.gtag || function() { dataLayer.push(arguments); };
      window.dataLayer = window.dataLayer || [];
      
      gtag('config', trackingId, {
        custom_map: {
          'custom_parameter': 'crowe_event_data'
        }
      });
      
      // Hook into money engine events
      document.addEventListener('crowe:money-engine:initialized', () => {
        gtag('event', 'money_engine_initialized', {
          event_category: 'crowe_engagement',
          event_label: 'sidebar_loaded'
        });
      });
    },

    // Integrate with Klaviyo for email marketing
    setupKlaviyoIntegration(publicKey) {
      window._learnq = window._learnq || [];
      
      // Hook into email capture
      document.addEventListener('email_captured', (event) => {
        _learnq.push(['identify', {
          '$email': event.detail.email,
          'source': 'crowe_sidebar_capture',
          'signup_date': new Date().toISOString()
        }]);
      });
    },

    // Integrate with Shopify Customer API
    setupShopifyIntegration() {
      // Enhanced customer data collection
      if (window.Shopify && window.Shopify.analytics) {
        const originalPush = window.Shopify.analytics.push;
        window.Shopify.analytics.push = function(...args) {
          // Intercept Shopify analytics events
          if (window.croweMoneyEngine) {
            window.croweMoneyEngine.trackActivity('shopify_analytics', { data: args });
          }
          return originalPush.apply(this, args);
        };
      }
    }
  },

  // Testing and debugging utilities
  debug: {
    
    // Enable debug mode
    enableDebugMode() {
      localStorage.setItem('crowe_debug_mode', 'true');
      console.log('🐛 Crowe Money Engine Debug Mode Enabled');
      
      // Add visual debug indicators
      const style = document.createElement('style');
      style.textContent = `
        .sidebar-money-engine > div {
          position: relative;
        }
        .sidebar-money-engine > div::before {
          content: attr(id);
          position: absolute;
          top: -10px;
          left: 5px;
          background: #ff4757;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          z-index: 1000;
        }
      `;
      document.head.appendChild(style);
    },

    // Disable debug mode
    disableDebugMode() {
      localStorage.removeItem('crowe_debug_mode');
      console.log('🐛 Crowe Money Engine Debug Mode Disabled');
    },

    // Reset all data
    resetAllData() {
      const confirmReset = confirm('This will reset all Crowe Money Engine data. Continue?');
      if (confirmReset) {
        localStorage.removeItem('crowe_analytics');
        localStorage.removeItem('crowe_recently_viewed');
        localStorage.removeItem('crowe_email_captured');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('crowe_')) {
            localStorage.removeItem(key);
          }
        });
        console.log('✅ All Crowe Money Engine data reset');
        location.reload();
      }
    },

    // Validate implementation
    validateImplementation() {
      const checks = {
        'Money Engine Initialized': !!window.croweMoneyEngine,
        'CSS Loaded': !!document.querySelector('link[href*="crowe-money-engine.css"]'),
        'JS Loaded': !!document.querySelector('script[src*="crowe-money-engine.js"]'),
        'Utils Available': !!window.ThemeUtils,
        'Sidebar Present': !!document.getElementById('crowe-sidebar'),
        'Money Engine Section': !!document.querySelector('.sidebar-money-engine'),
        'Recommendations Section': !!document.getElementById('smart-recommendations'),
        'Activity Feed Section': !!document.getElementById('live-activity'),
        'Shipping Progress Section': !!document.getElementById('shipping-progress')
      };
      
      console.table(checks);
      
      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      
      console.log(`✅ Implementation Status: ${passedChecks}/${totalChecks} checks passed`);
      
      if (passedChecks === totalChecks) {
        console.log('🎉 Perfect! All systems are operational.');
      } else {
        console.warn('⚠️ Some issues detected. Check the table above for details.');
      }
      
      return checks;
    }
  }
};

// Auto-enable debug mode in development
if (window.location.hostname === 'localhost' || window.location.hostname.includes('shopify')) {
  console.log('🚀 Crowe Money Engine Examples loaded!');
  console.log('📚 Available methods:', Object.keys(window.CroweMoneyEngineExamples));
  console.log('🧪 Try: CroweMoneyEngineExamples.debug.validateImplementation()');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.CroweMoneyEngineExamples;
}