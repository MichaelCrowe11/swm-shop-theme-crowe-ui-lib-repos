/**
 * CROWE LOGIC AI RESEARCH STATION
 * Interactive Controls and Neural Activity Monitoring
 */

class CroweResearchStation {
  constructor() {
    this.isInitialized = false;
    this.neuralActivity = 0;
    this.activeMode = 'chat';
    this.parameters = {
      intelligence: 75,
      depth: 60,
      speed: 50,
      creativity: 80
    };
    this.processingOptions = {
      neural: false,
      deep: false,
      learn: false,
      save: false
    };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupStation());
    } else {
      this.setupStation();
    }
  }

  setupStation() {
    this.initializeKnobs();
    this.initializeModeButtons();
    this.initializeToggles();
    this.initializeVUMeter();
    this.initializeNeuralActivity();
    this.hideLoadingOverlay();
    this.isInitialized = true;

    console.log('🧠 Crowe Logic Research Station Initialized');
  }

  initializeKnobs() {
    const knobs = document.querySelectorAll('.knob-container');
    
    knobs.forEach(knob => {
      let isDragging = false;
      let startAngle = 0;
      let currentAngle = 0;
      const paramName = knob.dataset.param;
      
      if (!paramName) return;
      
      // Set initial value
      const initialValue = this.parameters[paramName] || 50;
      this.updateKnobRotation(knob, initialValue);
      this.updateKnobValue(knob, initialValue);

      // Mouse events
      knob.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = this.getAngleFromEvent(e, knob);
        knob.classList.add('dragging');
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const currentAngle = this.getAngleFromEvent(e, knob);
        const deltaAngle = currentAngle - startAngle;
        const newValue = Math.max(0, Math.min(100, 
          this.parameters[paramName] + (deltaAngle * 0.5)
        ));
        
        this.parameters[paramName] = newValue;
        this.updateKnobRotation(knob, newValue);
        this.updateKnobValue(knob, newValue);
        this.updateNeuralActivity();
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          knob.classList.remove('dragging');
          document.body.style.cursor = '';
        }
      });

      // Touch events for mobile
      knob.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startAngle = this.getAngleFromTouch(touch, knob);
        knob.classList.add('dragging');
        e.preventDefault();
      });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const currentAngle = this.getAngleFromTouch(touch, knob);
        const deltaAngle = currentAngle - startAngle;
        const newValue = Math.max(0, Math.min(100, 
          this.parameters[paramName] + (deltaAngle * 0.5)
        ));
        
        this.parameters[paramName] = newValue;
        this.updateKnobRotation(knob, newValue);
        this.updateKnobValue(knob, newValue);
        this.updateNeuralActivity();
        e.preventDefault();
      });

      document.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
          knob.classList.remove('dragging');
        }
      });

      // Keyboard accessibility
      knob.setAttribute('tabindex', '0');
      knob.setAttribute('role', 'slider');
      knob.setAttribute('aria-valuemin', '0');
      knob.setAttribute('aria-valuemax', '100');
      knob.setAttribute('aria-valuenow', initialValue);

      knob.addEventListener('keydown', (e) => {
        let delta = 0;
        
        switch(e.key) {
          case 'ArrowUp':
          case 'ArrowRight':
            delta = 5;
            break;
          case 'ArrowDown':
          case 'ArrowLeft':
            delta = -5;
            break;
          case 'PageUp':
            delta = 20;
            break;
          case 'PageDown':
            delta = -20;
            break;
          default:
            return;
        }
        
        e.preventDefault();
        const newValue = Math.max(0, Math.min(100, 
          this.parameters[paramName] + delta
        ));
        
        this.parameters[paramName] = newValue;
        this.updateKnobRotation(knob, newValue);
        this.updateKnobValue(knob, newValue);
        knob.setAttribute('aria-valuenow', newValue);
        this.updateNeuralActivity();
      });
    });
  }

  getAngleFromEvent(event, knob) {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(event.clientY - centerY, event.clientX - centerX);
  }

  getAngleFromTouch(touch, knob) {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
  }

  updateKnobRotation(knob, value) {
    const rotation = (value / 100) * 270 - 135; // -135 to 135 degrees
    const knobElement = knob.querySelector('.knob');
    if (knobElement) {
      knobElement.style.transform = `rotate(${rotation}deg)`;
    }
  }

  updateKnobValue(knob, value) {
    const valueElement = knob.parentElement.querySelector('.knob-value');
    if (valueElement) {
      valueElement.textContent = Math.round(value);
    }
  }

  initializeModeButtons() {
    const modeButtons = document.querySelectorAll('.mode-button');
    
    modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        modeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update active mode
        this.activeMode = button.dataset.mode || button.textContent.toLowerCase();
        
        // Trigger mode change effects
        this.onModeChange(this.activeMode);
      });
    });

    // Set initial active mode
    const defaultMode = document.querySelector('.mode-button[data-mode="chat"]') || 
                       modeButtons[0];
    if (defaultMode) {
      defaultMode.classList.add('active');
    }
  }

  onModeChange(mode) {
    console.log(`🔄 Research Station Mode: ${mode.toUpperCase()}`);
    
    // Update neural activity based on mode
    switch(mode) {
      case 'chat':
        this.neuralActivity = 0.3;
        break;
      case 'voice':
        this.neuralActivity = 0.6;
        break;
      case 'research':
        this.neuralActivity = 0.8;
        break;
      case 'analyze':
        this.neuralActivity = 0.9;
        break;
      case 'learn':
        this.neuralActivity = 0.7;
        break;
      case 'export':
        this.neuralActivity = 0.4;
        break;
      default:
        this.neuralActivity = 0.5;
    }
    
    this.animateVUMeter();
  }

  initializeToggles() {
    const toggles = document.querySelectorAll('.toggle-input');
    
    toggles.forEach(toggle => {
      const optionName = toggle.name || toggle.id?.replace('toggle-', '');
      
      if (optionName && this.processingOptions.hasOwnProperty(optionName)) {
        toggle.checked = this.processingOptions[optionName];
      }
      
      toggle.addEventListener('change', () => {
        if (optionName) {
          this.processingOptions[optionName] = toggle.checked;
          this.onToggleChange(optionName, toggle.checked);
        }
      });
    });
  }

  onToggleChange(option, enabled) {
    console.log(`⚙️ Processing Option ${option.toUpperCase()}: ${enabled ? 'ON' : 'OFF'}`);
    
    // Update neural activity based on active processing options
    const activeCount = Object.values(this.processingOptions).filter(Boolean).length;
    this.neuralActivity = Math.min(1.0, 0.2 + (activeCount * 0.2));
    
    this.animateVUMeter();
  }

  initializeVUMeter() {
    const vuBars = document.querySelectorAll('.vu-bar');
    
    // Set different heights for bars
    vuBars.forEach((bar, index) => {
      const baseHeight = 10 + (index * 4);
      bar.style.setProperty('--base-height', `${baseHeight}px`);
      bar.style.height = `${baseHeight}px`;
    });

    // Start VU meter animation
    this.startVUMeterAnimation();
  }

  startVUMeterAnimation() {
    setInterval(() => {
      this.animateVUMeter();
    }, 100);
  }

  animateVUMeter() {
    const vuBars = document.querySelectorAll('.vu-bar');
    const activityLevel = this.neuralActivity + (Math.random() * 0.3);
    
    vuBars.forEach((bar, index) => {
      const threshold = (index + 1) / vuBars.length;
      const shouldActivate = activityLevel > threshold;
      
      if (shouldActivate) {
        const height = Math.min(40, 10 + (activityLevel * 30) + (Math.random() * 10));
        bar.style.height = `${height}px`;
        bar.classList.add('active');
        
        // Color based on level
        if (threshold > 0.8) {
          bar.style.background = 'linear-gradient(180deg, rgba(255, 0, 0, 0.8) 0%, rgba(255, 255, 0, 0.8) 100%)';
        } else if (threshold > 0.5) {
          bar.style.background = 'linear-gradient(180deg, rgba(255, 255, 0, 0.8) 0%, rgba(0, 255, 0, 0.8) 100%)';
        } else {
          bar.style.background = 'rgba(0, 255, 0, 0.8)';
        }
      } else {
        bar.classList.remove('active');
        const baseHeight = 10 + (index * 2);
        bar.style.height = `${baseHeight}px`;
      }
    });
  }

  initializeNeuralActivity() {
    // Simulate neural network activity
    setInterval(() => {
      // Update status dots with random blinking
      const statusDots = document.querySelectorAll('.status-dot');
      statusDots.forEach(dot => {
        if (Math.random() < 0.3) {
          dot.style.animationDuration = `${0.5 + Math.random()}s`;
        }
      });

      // Randomly adjust neural activity
      if (Math.random() < 0.1) {
        this.neuralActivity = Math.max(0.1, Math.min(1.0, 
          this.neuralActivity + (Math.random() - 0.5) * 0.2
        ));
      }
    }, 200);
  }

  updateNeuralActivity() {
    // Calculate activity based on parameter settings
    const avgParameter = Object.values(this.parameters).reduce((a, b) => a + b, 0) / 4;
    const parameterActivity = avgParameter / 100;
    
    // Combine with processing options
    const activeProcessing = Object.values(this.processingOptions).filter(Boolean).length;
    const processingActivity = activeProcessing * 0.15;
    
    this.neuralActivity = Math.min(1.0, parameterActivity * 0.6 + processingActivity + 0.2);
  }

  hideLoadingOverlay() {
    // Hide loading overlay after initialization
    setTimeout(() => {
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
    }, 1500);
  }

  // Public API methods
  setParameter(name, value) {
    if (this.parameters.hasOwnProperty(name)) {
      this.parameters[name] = Math.max(0, Math.min(100, value));
      const knob = document.querySelector(`[data-param="${name}"]`);
      if (knob) {
        this.updateKnobRotation(knob, this.parameters[name]);
        this.updateKnobValue(knob, this.parameters[name]);
      }
      this.updateNeuralActivity();
    }
  }

  setMode(mode) {
    const modeButton = document.querySelector(`[data-mode="${mode}"]`);
    if (modeButton) {
      modeButton.click();
    }
  }

  setProcessingOption(option, enabled) {
    if (this.processingOptions.hasOwnProperty(option)) {
      this.processingOptions[option] = enabled;
      const toggle = document.querySelector(`#toggle-${option}`);
      if (toggle) {
        toggle.checked = enabled;
      }
      this.onToggleChange(option, enabled);
    }
  }

  getNeuralActivity() {
    return this.neuralActivity;
  }

  getParameters() {
    return { ...this.parameters };
  }

  getProcessingOptions() {
    return { ...this.processingOptions };
  }
}

// Auto-initialize when DOM is ready
let croweStation = null;

document.addEventListener('DOMContentLoaded', () => {
  const stationElement = document.querySelector('.crowe-research-station');
  if (stationElement && !croweStation) {
    croweStation = new CroweResearchStation();
    
    // Expose to global scope for external access
    window.CroweResearchStation = croweStation;
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CroweResearchStation;
}
