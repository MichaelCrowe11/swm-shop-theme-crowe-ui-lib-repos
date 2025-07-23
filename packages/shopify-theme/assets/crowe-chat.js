// Crowe AI Chat Component
class CroweChat {
  constructor() {
    // Get settings from window object (set by Liquid template)
    this.apiKey = window.croweSettings?.apiKey || '';
    this.apiEndpoint = 'https://api.x.ai/v1/chat/completions';
    this.messages = [];
    this.isTyping = false;
    this.chatContainer = null;
    this.messagesContainer = null;
    this.inputField = null;
    this.sendButton = null;
    this.currentModel = window.croweSettings?.model || 'grok-beta';
    this.systemPrompt = window.croweSettings?.systemPrompt || '';
    this.chatHeight = window.croweSettings?.chatHeight || 400;
    
    // Feature flags from settings
    this.features = {
      chatEnabled: window.croweSettings?.chatEnabled !== false,
      imageGeneration: window.croweSettings?.imageGeneration === true,
      documentGeneration: window.croweSettings?.documentGeneration !== false,
      productSearch: window.croweSettings?.productSearch !== false,
      voiceInput: window.croweSettings?.voiceInput !== false,
      codeExecution: window.croweSettings?.codeExecution === true
    };
    
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupChat());
    } else {
      this.setupChat();
    }
  }
  
  setupChat() {
    // Check if chat is enabled
    if (!this.features.chatEnabled) {
      console.log('Crowe Chat is disabled in theme settings');
      return;
    }
    
    this.chatContainer = document.getElementById('crowe-chat-container');
    if (!this.chatContainer) return;
    
    // Apply custom height from settings
    const style = document.createElement('style');
    style.textContent = `
      .crowe-chat-container.chat-expanded {
        height: ${this.chatHeight}px !important;
      }
    `;
    document.head.appendChild(style);
    
    this.messagesContainer = this.chatContainer.querySelector('.chat-messages');
    this.inputField = this.chatContainer.querySelector('.chat-input');
    this.sendButton = this.chatContainer.querySelector('.chat-send-btn');
    
    // Check if API key is configured
    if (!this.apiKey) {
      this.showError('API key not configured. Please add your xAI API key in theme settings.');
      return;
    }
    
    // Add event listeners
    this.sendButton?.addEventListener('click', () => this.sendMessage());
    this.inputField?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Add voice input button if supported and enabled
    if (this.features.voiceInput && 'webkitSpeechRecognition' in window) {
      this.setupVoiceInput();
    }
    
    // Show welcome message
    this.showWelcomeMessage();
  }
  
  showWelcomeMessage() {
    const welcome = `
      <div class="chat-welcome">
        <h4>Welcome to Crowe Logic AI</h4>
        <p>I can help you with:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>🔍 Product recommendations</li>
          <li>🎨 Image generation</li>
          <li>📄 Document creation</li>
          <li>💡 Research assistance</li>
          <li>🛒 Shopping guidance</li>
        </ul>
        <p>How can I assist you today?</p>
      </div>
    `;
    this.messagesContainer.innerHTML = welcome;
  }
  
  async sendMessage() {
    const message = this.inputField.value.trim();
    if (!message) return;
    
    // Check for special commands
    if (message.startsWith('/')) {
      return this.handleCommand(message);
    }
    
    // Add user message to chat
    this.addMessage(message, 'user');
    this.inputField.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Send to xAI API
      const response = await this.callXAI(message);
      this.hideTypingIndicator();
      
      // Add AI response
      this.addMessage(response, 'ai');
      
    } catch (error) {
      this.hideTypingIndicator();
      this.showError('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    }
  }
  
  async handleCommand(command) {
    const [cmd, ...args] = command.split(' ');
    const query = args.join(' ');
    
    switch (cmd) {
      case '/image':
        await this.generateImage(query);
        break;
      case '/document':
        await this.generateDocument(query);
        break;
      case '/search':
        await this.searchProducts(query);
        break;
      case '/code':
        await this.executeCode(query);
        break;
      case '/help':
        this.showHelp();
        break;
      default:
        this.addMessage(`Unknown command: ${cmd}. Type /help for available commands.`, 'ai');
    }
    
    this.inputField.value = '';
  }
  
  async generateImage(prompt) {
    this.addMessage(`/image ${prompt}`, 'user');
    this.showTypingIndicator();
    
    try {
      // For demo purposes, using a placeholder
      // In production, integrate with DALL-E, Stable Diffusion, or other image generation API
      const imageUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt)}`;
      
      this.hideTypingIndicator();
      this.addMessage(`
        <div class="generated-image">
          <p>Generated image for: "${prompt}"</p>
          <img src="${imageUrl}" alt="${prompt}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
          <div class="image-actions" style="margin-top: 10px;">
            <button class="action-btn" onclick="window.open('${imageUrl}', '_blank')">🔍 View Full Size</button>
            <button class="action-btn" onclick="navigator.clipboard.writeText('${imageUrl}')">📋 Copy URL</button>
          </div>
        </div>
      `, 'ai', true);
      
    } catch (error) {
      this.hideTypingIndicator();
      this.showError('Failed to generate image.');
    }
  }
  
  async generateDocument(prompt) {
    this.addMessage(`/document ${prompt}`, 'user');
    this.showTypingIndicator();
    
    try {
      // Generate document content using AI
      const documentContent = await this.callXAI(`Generate a document about: ${prompt}`);
      
      this.hideTypingIndicator();
      this.addMessage(`
        <div class="generated-document">
          <p>Generated document: "${prompt}"</p>
          <div class="document-preview" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${documentContent.substring(0, 200)}...
          </div>
          <div class="document-actions" style="margin-top: 10px;">
            <button class="action-btn" onclick="croweChat.downloadDocument('${prompt}', \`${documentContent}\`)">📥 Download</button>
            <button class="action-btn" onclick="croweChat.copyToClipboard(\`${documentContent}\`)">📋 Copy</button>
            <button class="action-btn" onclick="croweChat.emailDocument('${prompt}', \`${documentContent}\`)">✉️ Email</button>
          </div>
        </div>
      `, 'ai', true);
      
    } catch (error) {
      this.hideTypingIndicator();
      this.showError('Failed to generate document.');
    }
  }
  
  async searchProducts(query) {
    this.addMessage(`/search ${query}`, 'user');
    this.showTypingIndicator();
    
    try {
      // Search Shopify products
      const searchUrl = `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&limit=5`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      this.hideTypingIndicator();
      
      if (data.resources.results.products && data.resources.results.products.length > 0) {
        let productsHtml = '<div class="product-results"><p>Found these products:</p>';
        
        data.resources.results.products.forEach(product => {
          productsHtml += `
            <div class="product-item" style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
              <a href="${product.url}" style="color: #8b4513; text-decoration: none;">
                <strong>${product.title}</strong>
              </a>
              <p style="margin: 5px 0; font-size: 12px;">${product.price}</p>
              <button class="action-btn" onclick="window.location.href='${product.url}'">View Product</button>
            </div>
          `;
        });
        
        productsHtml += '</div>';
        this.addMessage(productsHtml, 'ai', true);
      } else {
        this.addMessage(`No products found for "${query}". Try a different search term.`, 'ai');
      }
      
    } catch (error) {
      this.hideTypingIndicator();
      this.showError('Failed to search products.');
    }
  }
  
  async executeCode(code) {
    this.addMessage(`/code ${code}`, 'user');
    this.showTypingIndicator();
    
    try {
      // For security, only allow safe operations
      const result = this.safeEval(code);
      
      this.hideTypingIndicator();
      this.addMessage(`
        <div class="code-result">
          <pre style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; overflow-x: auto;">
            <code>${code}</code>
          </pre>
          <p>Result: <strong>${result}</strong></p>
        </div>
      `, 'ai', true);
      
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(`Error executing code: ${error.message}`, 'ai');
    }
  }
  
  safeEval(code) {
    // Very limited safe eval for demo purposes
    // In production, use a proper sandboxed environment
    
    // Simple math expressions only
    if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(code)) {
      return eval(code);
    }
    
    throw new Error('Only simple math expressions are allowed');
  }
  
  showHelp() {
    const helpMessage = `
      <div class="chat-help">
        <h4>Available Commands:</h4>
        <ul style="text-align: left;">
          <li><strong>/image [prompt]</strong> - Generate an image</li>
          <li><strong>/document [topic]</strong> - Create a document</li>
          <li><strong>/search [query]</strong> - Search products</li>
          <li><strong>/code [expression]</strong> - Execute simple code</li>
          <li><strong>/help</strong> - Show this help message</li>
        </ul>
        <p>Or just chat normally for AI assistance!</p>
      </div>
    `;
    this.addMessage(helpMessage, 'ai', true);
  }
  
  setupVoiceInput() {
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'voice-input-btn';
    voiceBtn.innerHTML = '🎤';
    voiceBtn.title = 'Voice input';
    
    const inputContainer = this.inputField.parentElement;
    inputContainer.insertBefore(voiceBtn, this.sendButton);
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', () => {
      recognition.start();
      voiceBtn.classList.add('recording');
    });
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.inputField.value = transcript;
      voiceBtn.classList.remove('recording');
    };
    
    recognition.onerror = () => {
      voiceBtn.classList.remove('recording');
      this.showError('Voice input failed. Please try again.');
    };
  }
  
  async callXAI(message) {
    // Add context about being a shopping assistant
    const systemPrompt = `You are Crowe Logic AI, a helpful shopping and research assistant for Southwest Mushrooms. 
    You help customers find products, answer questions about mushrooms, and provide research assistance.
    Be concise, friendly, and helpful. Format responses with markdown when appropriate.`;
    
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.messages,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  addMessage(content, sender, isHtml = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message message-${sender}`;
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <span class="message-content">${isHtml ? content : this.escapeHtml(content)}</span>
        <span class="message-avatar">👤</span>
      `;
    } else {
      messageDiv.innerHTML = `
        <span class="message-avatar"><img src="{{ 'crowe-avatar.png' | asset_url }}" alt="Crowe AI"></span>
        <span class="message-content">${isHtml ? content : this.parseMarkdown(content)}</span>
      `;
    }
    
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    // Store message in history (excluding HTML messages)
    if (!isHtml) {
      this.messages.push({ role: sender === 'user' ? 'user' : 'assistant', content });
    }
  }
  
  parseMarkdown(text) {
    // Simple markdown parser
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showTypingIndicator() {
    this.isTyping = true;
    const indicator = document.createElement('div');
    indicator.className = 'chat-message message-ai typing-message';
    indicator.innerHTML = `
      <span class="message-avatar"><img src="{{ 'crowelogo.png' | asset_url }}" alt="AI"></span>
      <div class="typing-indicator active">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = this.messagesContainer.querySelector('.typing-message');
    if (indicator) {
      indicator.remove();
    }
  }
  
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chat-error';
    errorDiv.textContent = message;
    this.messagesContainer.appendChild(errorDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    setTimeout(() => errorDiv.remove(), 5000);
  }
  
  // Utility functions for document handling
  downloadDocument(title, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.addMessage('Content copied to clipboard!', 'ai');
    });
  }
  
  emailDocument(subject, content) {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    window.open(mailtoLink);
  }
}

// Initialize chat when DOM is ready
const croweChat = new CroweChat();