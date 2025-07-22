/**
 * Utils.js Usage Examples
 * This file demonstrates how to use the refactored utilities
 * DO NOT include this file in production - it's for reference only
 */

// === DOM Utilities Examples ===

// OLD WAY (repeated everywhere):
function getSectionInnerHTML(html, selector = '.shopify-section') {
  return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
}

// NEW WAY:
const innerHTML = ThemeUtils.DOMUtils.getSectionInnerHTML(html, '.shopify-section');

// Updating multiple sections (replaces the repeated pattern):
ThemeUtils.DOMUtils.updateSectionsFromHTML(parsedState.sections, sectionsToRender);

// === Section Renderer Examples ===

// OLD WAY (repeated in cart, cart-drawer, etc.):
getSectionsToRender() {
  return [
    {
      id: 'cart-icon-bubble',
      section: 'cart-icon-bubble',
      selector: '.shopify-section',
    },
    // ... more sections
  ];
}

// NEW WAY - Use predefined configurations:
getSectionsToRender() {
  return ThemeUtils.SectionRenderer.getCartSections();
}

// Or create custom configurations:
getSectionsToRender() {
  const customSections = [
    {
      id: 'my-custom-section',
      section: 'my-section',
      selector: '.custom-selector',
    },
  ];
  return ThemeUtils.SectionRenderer.createSectionsConfig(customSections);
}

// === Quantity Validation Examples ===

// OLD WAY (repeated validation logic):
validateQuantity(event) {
  const inputValue = parseInt(event.target.value);
  const index = event.target.dataset.index;
  let message = '';

  if (inputValue < event.target.dataset.min) {
    message = window.quickOrderListStrings.min_error.replace('[min]', event.target.dataset.min);
  } else if (inputValue > parseInt(event.target.max)) {
    message = window.quickOrderListStrings.max_error.replace('[max]', event.target.max);
  } else if (inputValue % parseInt(event.target.step) !== 0) {
    message = window.quickOrderListStrings.step_error.replace('[step]', event.target.step);
  }

  if (message) {
    this.setValidity(event, index, message);
  } else {
    event.target.setCustomValidity('');
    event.target.reportValidity();
    // ... continue with valid input
  }
}

// NEW WAY - Simple validation:
validateQuantity(event) {
  if (ThemeUtils.QuantityValidator.validateAndHandle(event, this)) {
    const inputValue = parseInt(event.target.value);
    // ... continue with valid input
  }
}

// Or for custom validation:
validateQuantity(event) {
  const validation = ThemeUtils.QuantityValidator.validateQuantity(event.target);
  if (!validation.isValid) {
    ThemeUtils.QuantityValidator.setValidityState(event, index, validation.message, resetCallback);
    return false;
  }
  // ... continue with valid input
}

// === Loading State Management Examples ===

// OLD WAY (repeated loading logic):
enableLoading(element) {
  element.classList.add('loading');
  element.setAttribute('aria-disabled', 'true');
  const spinner = element.querySelector('.loading__spinner');
  if (spinner) spinner.classList.remove('hidden');
}

disableLoading(element) {
  element.classList.remove('loading');
  element.removeAttribute('aria-disabled');
  const spinner = element.querySelector('.loading__spinner');
  if (spinner) spinner.classList.add('hidden');
}

// NEW WAY:
ThemeUtils.LoadingStateManager.setLoadingState(element, true);  // enable loading
ThemeUtils.LoadingStateManager.setLoadingState(element, false); // disable loading

// For multiple elements:
ThemeUtils.LoadingStateManager.setLoadingStateMultiple(elements, true);

// Create a reusable manager:
const loadingManager = ThemeUtils.LoadingStateManager.createManager(element);
loadingManager.show();
loadingManager.hide();

// === Cart Update Utilities Examples ===

// OLD WAY (repeated cart drawer update):
fetch(`${routes.cart_url}?section_id=cart-drawer`)
  .then((response) => response.text())
  .then((responseText) => {
    const html = new DOMParser().parseFromString(responseText, 'text/html');
    const selectors = ['cart-drawer-items', '.cart-drawer__footer'];
    for (const selector of selectors) {
      const targetElement = document.querySelector(selector);
      const sourceElement = html.querySelector(selector);
      if (targetElement && sourceElement) {
        targetElement.innerHTML = sourceElement.innerHTML;
      }
    }
  });

// NEW WAY:
await ThemeUtils.CartUpdateUtils.updateCartDrawer();

// Update cart sections:
ThemeUtils.CartUpdateUtils.updateCartSections(parsedState, sectionsConfig);

// === Form Utilities Examples ===

// OLD WAY (repeated fetch config):
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(data)
});

// NEW WAY:
fetch(url, {
  ...ThemeUtils.FormUtils.createFetchConfig(),
  body: ThemeUtils.FormUtils.serializeFormData(formData)
});

// === Error Handling Examples ===

// Display errors consistently:
ThemeUtils.ErrorHandler.displayError('Something went wrong', container);

// Handle cart errors:
ThemeUtils.ErrorHandler.handleCartError(error, container);

// Clear errors:
ThemeUtils.ErrorHandler.clearErrors(container);

// === Theme Events Examples ===

// Dispatch custom events:
ThemeUtils.ThemeEvents.dispatch('custom:event', { data: 'value' });

// Create debounced handlers:
const debouncedHandler = ThemeUtils.ThemeEvents.createDebouncedHandler(handler, 300);

// === Real Implementation Examples ===

/**
 * Example: Refactored Cart Items Class
 */
class RefactoredCartItems extends HTMLElement {
  validateQuantity(event) {
    const index = event.target.dataset.index;
    
    if (ThemeUtils.QuantityValidator.validateAndHandle(event, this)) {
      const inputValue = parseInt(event.target.value);
      this.updateQuantity(index, inputValue, event);
    }
  }

  getSectionsToRender() {
    const customSections = [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
    ];
    return ThemeUtils.SectionRenderer.createSectionsConfig(customSections);
  }

  updateCartSections(parsedState) {
    ThemeUtils.CartUpdateUtils.updateCartSections(parsedState, this.getSectionsToRender());
  }

  enableLoading(line) {
    const elements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    ThemeUtils.LoadingStateManager.setLoadingStateMultiple(elements, true);
  }
}

/**
 * Example: Refactored Product Form Class
 */
class RefactoredProductForm extends HTMLElement {
  async submitForm(formData) {
    const loadingManager = ThemeUtils.LoadingStateManager.createManager(this.submitButton);
    
    try {
      loadingManager.show();
      
      const response = await fetch(routes.cart_add_url, {
        ...ThemeUtils.FormUtils.createFetchConfig(),
        body: ThemeUtils.FormUtils.serializeFormData(formData)
      });
      
      const result = await response.json();
      
      if (result.errors) {
        ThemeUtils.ErrorHandler.handleCartError(result.errors, this.errorContainer);
      } else {
        ThemeUtils.ThemeEvents.dispatch('cart:updated', { item: result });
      }
    } catch (error) {
      ThemeUtils.ErrorHandler.displayError('Network error occurred', this.errorContainer);
    } finally {
      loadingManager.hide();
    }
  }
}

/**
 * Benefits of the Refactored Approach:
 * 
 * 1. DRY (Don't Repeat Yourself) - Eliminates duplicate code
 * 2. Consistency - All components use the same utility methods
 * 3. Maintainability - Changes to utility logic only need to be made in one place
 * 4. Testability - Utilities can be tested independently
 * 5. Documentation - Clear API with consistent naming
 * 6. Performance - Shared utilities reduce bundle size
 * 7. Error Handling - Centralized error handling patterns
 * 8. Accessibility - Built-in accessibility considerations
 */