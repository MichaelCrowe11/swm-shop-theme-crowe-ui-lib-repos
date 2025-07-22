/**
 * Shopify Theme Utilities
 * Centralized utility functions to reduce code duplication across the theme
 */

/**
 * DOM Parsing Utilities
 */
class DOMUtils {
  /**
   * Extracts innerHTML from a section within HTML string
   * @param {string} html - HTML string to parse
   * @param {string} selector - CSS selector for the section (default: '.shopify-section')
   * @returns {string} Inner HTML of the selected section
   */
  static getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  /**
   * Safely extracts element content from HTML string
   * @param {string} html - HTML string to parse
   * @param {string} selector - CSS selector for the element
   * @returns {HTMLElement|null} The selected element or null if not found
   */
  static getElementFromHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  /**
   * Updates multiple DOM elements from parsed HTML sections
   * @param {Object} sections - Object containing section HTML
   * @param {Array} sectionsToRender - Array of section configurations
   */
  static updateSectionsFromHTML(sections, sectionsToRender) {
    sectionsToRender.forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement || !sections[section.id]) return;
      
      sectionElement.innerHTML = DOMUtils.getSectionInnerHTML(
        sections[section.id], 
        section.selector
      );
    });
  }
}

/**
 * Section Rendering Utilities
 */
class SectionRenderer {
  /**
   * Standard sections configuration for cart-related components
   * @returns {Array} Array of section configuration objects
   */
  static getCartSections() {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-footer',
        section: 'main-cart-footer',
        selector: '.js-contents',
      },
    ];
  }

  /**
   * Standard sections configuration for cart drawer
   * @returns {Array} Array of section configuration objects
   */
  static getCartDrawerSections() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }

  /**
   * Standard sections configuration for quick order list
   * @returns {Array} Array of section configuration objects
   */
  static getQuickOrderSections() {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
    ];
  }

  /**
   * Creates a custom sections configuration
   * @param {Array} customSections - Array of custom section objects
   * @returns {Array} Merged sections configuration
   */
  static createSectionsConfig(customSections = []) {
    const baseSections = SectionRenderer.getCartSections();
    return [...baseSections, ...customSections];
  }
}

/**
 * Quantity Validation Utilities
 */
class QuantityValidator {
  /**
   * Validates quantity input and returns validation result
   * @param {HTMLInputElement} input - The quantity input element
   * @returns {Object} Validation result with isValid and message properties
   */
  static validateQuantity(input) {
    const inputValue = parseInt(input.value);
    const min = parseInt(input.dataset.min || input.min);
    const max = parseInt(input.max);
    const step = parseInt(input.step || 1);

    if (inputValue < min) {
      return {
        isValid: false,
        message: window.quickOrderListStrings?.min_error?.replace('[min]', min) || `Minimum quantity is ${min}`,
      };
    }

    if (max && inputValue > max) {
      return {
        isValid: false,
        message: window.quickOrderListStrings?.max_error?.replace('[max]', max) || `Maximum quantity is ${max}`,
      };
    }

    if (inputValue % step !== 0) {
      return {
        isValid: false,
        message: window.quickOrderListStrings?.step_error?.replace('[step]', step) || `Quantity must be in increments of ${step}`,
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Sets custom validity on input and handles validation display
   * @param {Event} event - The input event
   * @param {string} index - The input index for reset functionality
   * @param {string} message - The validation message
   * @param {Function} resetCallback - Optional callback to reset input value
   */
  static setValidityState(event, index, message, resetCallback = null) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    
    if (resetCallback && typeof resetCallback === 'function') {
      resetCallback(index);
    }
    
    event.target.select();
  }

  /**
   * Resets quantity input to its original value
   * @param {HTMLElement} container - Container element to search within
   * @param {string} id - The input ID suffix
   */
  static resetQuantityInput(container, id) {
    const input = container.querySelector(`#Quantity-${id}`);
    if (input) {
      input.value = input.getAttribute('value');
    }
  }

  /**
   * Complete quantity validation with automatic error handling
   * @param {Event} event - The input event
   * @param {HTMLElement} container - Container element for input reset
   * @returns {boolean} True if validation passes
   */
  static validateAndHandle(event, container = null) {
    const validation = QuantityValidator.validateQuantity(event.target);
    
    if (!validation.isValid) {
      const index = event.target.dataset.index;
      const resetFn = container 
        ? (id) => QuantityValidator.resetQuantityInput(container, id)
        : null;
      
      QuantityValidator.setValidityState(event, index, validation.message, resetFn);
      return false;
    }

    event.target.setCustomValidity('');
    event.target.reportValidity();
    return true;
  }
}

/**
 * Loading State Management Utilities
 */
class LoadingStateManager {
  /**
   * Sets loading state on an element
   * @param {HTMLElement} element - Element to set loading state on
   * @param {boolean} isLoading - Whether element should be in loading state
   */
  static setLoadingState(element, isLoading = true) {
    if (!element) return;

    const spinner = element.querySelector('.loading__spinner');
    
    if (isLoading) {
      element.classList.add('loading');
      element.setAttribute('aria-disabled', 'true');
      if (spinner) spinner.classList.remove('hidden');
    } else {
      element.classList.remove('loading');
      element.removeAttribute('aria-disabled');
      if (spinner) spinner.classList.add('hidden');
    }
  }

  /**
   * Sets loading state on multiple elements
   * @param {NodeList|Array} elements - Elements to set loading state on
   * @param {boolean} isLoading - Whether elements should be in loading state
   */
  static setLoadingStateMultiple(elements, isLoading = true) {
    elements.forEach(element => LoadingStateManager.setLoadingState(element, isLoading));
  }

  /**
   * Creates a loading state manager for a specific element
   * @param {HTMLElement} element - Element to manage
   * @returns {Object} Object with show() and hide() methods
   */
  static createManager(element) {
    return {
      show: () => LoadingStateManager.setLoadingState(element, true),
      hide: () => LoadingStateManager.setLoadingState(element, false),
    };
  }
}

/**
 * Cart Update Utilities
 */
class CartUpdateUtils {
  /**
   * Fetches and updates cart drawer content
   * @param {Array} selectors - Array of selectors to update (default: ['cart-drawer-items', '.cart-drawer__footer'])
   * @returns {Promise} Promise that resolves when update is complete
   */
  static async updateCartDrawer(selectors = ['cart-drawer-items', '.cart-drawer__footer']) {
    const response = await fetch(`${routes.cart_url}?section_id=cart-drawer`);
    const responseText = await response.text();
    const html = new DOMParser().parseFromString(responseText, 'text/html');
    
    selectors.forEach(selector => {
      const targetElement = document.querySelector(selector);
      const sourceElement = html.querySelector(selector);
      if (targetElement && sourceElement) {
        targetElement.innerHTML = sourceElement.innerHTML;
      }
    });
  }

  /**
   * Updates cart sections with new content
   * @param {Object} parsedState - Parsed response containing sections
   * @param {Array} sectionsConfig - Configuration for sections to update
   */
  static updateCartSections(parsedState, sectionsConfig) {
    DOMUtils.updateSectionsFromHTML(parsedState.sections, sectionsConfig);
  }
}

/**
 * Form Utilities
 */
class FormUtils {
  /**
   * Creates standard fetch configuration for form submissions
   * @param {string} type - Response type (default: 'json')
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Object} Fetch configuration object
   */
  static createFetchConfig(type = 'json', additionalHeaders = {}) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/${type}`,
        ...additionalHeaders,
      },
    };
  }

  /**
   * Serializes form data to JSON
   * @param {FormData} formData - Form data to serialize
   * @returns {string} JSON string of form data
   */
  static serializeFormData(formData) {
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return JSON.stringify(object);
  }
}

/**
 * Error Handling Utilities
 */
class ErrorHandler {
  /**
   * Displays error message to user
   * @param {string} message - Error message to display
   * @param {HTMLElement} container - Container to display error in (optional)
   */
  static displayError(message, container = null) {
    if (container) {
      const errorElement = container.querySelector('.error-message') || document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      if (!container.querySelector('.error-message')) {
        container.appendChild(errorElement);
      }
    } else {
      console.error('Theme Error:', message);
    }
  }

  /**
   * Clears error messages from container
   * @param {HTMLElement} container - Container to clear errors from
   */
  static clearErrors(container) {
    const errors = container.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
  }

  /**
   * Handles cart-related errors with standard formatting
   * @param {Object} error - Error object from cart operations
   * @param {HTMLElement} container - Container to display error in
   */
  static handleCartError(error, container = null) {
    const message = error.message || error.description || 'An error occurred';
    ErrorHandler.displayError(message, container);
  }
}

/**
 * Theme Event Utilities
 */
class ThemeEvents {
  /**
   * Dispatches a custom theme event
   * @param {string} eventName - Name of the event
   * @param {Object} detail - Event detail data
   * @param {HTMLElement} target - Target element (default: document)
   */
  static dispatch(eventName, detail = {}, target = document) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true,
    });
    target.dispatchEvent(event);
  }

  /**
   * Creates a debounced event handler
   * @param {Function} handler - Event handler function
   * @param {number} delay - Debounce delay in milliseconds
   * @returns {Function} Debounced handler function
   */
  static createDebouncedHandler(handler, delay = ON_CHANGE_DEBOUNCE_TIMER) {
    return debounce(handler, delay);
  }
}

// Export utilities for use in other modules
if (typeof window !== 'undefined') {
  window.ThemeUtils = {
    DOMUtils,
    SectionRenderer,
    QuantityValidator,
    LoadingStateManager,
    CartUpdateUtils,
    FormUtils,
    ErrorHandler,
    ThemeEvents,
  };
}

// Also export individual classes for direct import
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DOMUtils,
    SectionRenderer,
    QuantityValidator,
    LoadingStateManager,
    CartUpdateUtils,
    FormUtils,
    ErrorHandler,
    ThemeEvents,
  };
}