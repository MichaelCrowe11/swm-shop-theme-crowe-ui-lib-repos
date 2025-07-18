/**
 * Clipboard Permissions Handler
 * Gracefully handles clipboard access violations
 */

(function() {
  'use strict';

  // Override console.warn for clipboard-write violations to reduce noise
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Filter out clipboard-write permission warnings
    if (message.includes('clipboard-write is not allowed') || 
        message.includes('Potential permissions policy violation: clipboard-write')) {
      // Silently handle clipboard permission warnings
      return;
    }
    
    // Allow all other warnings through
    originalWarn.apply(console, args);
  };

  // Provide fallback clipboard functionality
  window.safeClipboardWrite = async function(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Clipboard access denied, use fallback
      console.log('Clipboard access not available, using fallback');
    }
    
    // Fallback: Create temporary textarea for copying
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      console.log('Clipboard operation failed:', fallbackError);
      return false;
    }
  };

  // Provide safe clipboard read functionality
  window.safeClipboardRead = async function() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
    } catch (error) {
      console.log('Clipboard read access not available');
    }
    return null;
  };

  // Monitor for clipboard permission requests and handle gracefully
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'clipboard-write' }).then(function(result) {
      if (result.state === 'denied') {
        console.log('Clipboard write permission denied, using fallback methods');
      }
    }).catch(function(error) {
      // Permission query not supported, continue silently
    });
  }

})();
