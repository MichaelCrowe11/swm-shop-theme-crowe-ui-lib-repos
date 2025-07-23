/**
 * Living Mycelium Network Interactive System
 * Creates dynamic canvas-based mycelium networks that respond to user interactions
 * Part of the Southwest Mushrooms quantum theme enhancement
 */

class LivingMyceliumNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.spores = [];
    this.mousePos = { x: 0, y: 0 };
    this.isInteracting = false;
    
    this.config = {
      nodeCount: 15,
      sporeCount: 25,
      maxDistance: 150,
      interactionRadius: 200,
      colors: {
        primary: 'rgba(139, 69, 19, 0.8)',    // Saddle Brown
        secondary: 'rgba(85, 107, 47, 0.6)',  // Dark Olive Green
        accent: 'rgba(255, 215, 0, 0.9)',     // Gold
        glow: 'rgba(212, 175, 55, 0.7)',      // Darker Gold
        earth: 'rgba(47, 79, 79, 0.5)'        // Dark Slate Gray
      }
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createNodes();
    this.createSpores();
    this.bindEvents();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 8 + 4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        connections: []
      });
    }
  }
  
  createSpores() {
    this.spores = [];
    for (let i = 0; i < this.config.sporeCount; i++) {
      this.spores.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 3 + 1,
        life: Math.random(),
        lifeSpeed: Math.random() * 0.005 + 0.002,
        glow: Math.random() * 20 + 10
      });
    }
  }
  
  updateNodes() {
    this.nodes.forEach(node => {
      // Gentle movement
      node.x += node.vx;
      node.y += node.vy;
      
      // Boundary wrapping
      if (node.x < 0) node.x = this.canvas.width;
      if (node.x > this.canvas.width) node.x = 0;
      if (node.y < 0) node.y = this.canvas.height;
      if (node.y > this.canvas.height) node.y = 0;
      
      // Pulse animation
      node.pulse += node.pulseSpeed;
      
      // Mouse interaction
      const dx = this.mousePos.x - node.x;
      const dy = this.mousePos.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.interactionRadius && this.isInteracting) {
        const force = (this.config.interactionRadius - distance) / this.config.interactionRadius;
        node.vx += (dx / distance) * force * 0.01;
        node.vy += (dy / distance) * force * 0.01;
      }
      
      // Velocity damping
      node.vx *= 0.99;
      node.vy *= 0.99;
    });
  }
  
  updateSpores() {
    this.spores.forEach(spore => {
      spore.x += spore.vx;
      spore.y += spore.vy;
      
      // Boundary wrapping
      if (spore.x < 0) spore.x = this.canvas.width;
      if (spore.x > this.canvas.width) spore.x = 0;
      if (spore.y < 0) spore.y = this.canvas.height;
      if (spore.y > this.canvas.height) spore.y = 0;
      
      // Life cycle
      spore.life += spore.lifeSpeed;
      if (spore.life > 1) spore.life = 0;
      
      // Mouse attraction
      if (this.isInteracting) {
        const dx = this.mousePos.x - spore.x;
        const dy = this.mousePos.y - spore.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.interactionRadius) {
          const force = (this.config.interactionRadius - distance) / this.config.interactionRadius;
          spore.vx += (dx / distance) * force * 0.005;
          spore.vy += (dy / distance) * force * 0.005;
        }
      }
      
      // Velocity damping
      spore.vx *= 0.98;
      spore.vy *= 0.98;
    });
  }
  
  findConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.maxDistance) {
          const strength = 1 - (distance / this.config.maxDistance);
          this.connections.push({
            nodeA: this.nodes[i],
            nodeB: this.nodes[j],
            distance,
            strength
          });
        }
      }
    }
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render connections (mycelium threads)
    this.connections.forEach(connection => {
      const gradient = this.ctx.createLinearGradient(
        connection.nodeA.x, connection.nodeA.y,
        connection.nodeB.x, connection.nodeB.y
      );
      
      const alpha = connection.strength * 0.7;
      gradient.addColorStop(0, this.config.colors.primary.replace('0.8', alpha));
      gradient.addColorStop(0.5, this.config.colors.glow.replace('0.7', alpha * 1.2));
      gradient.addColorStop(1, this.config.colors.secondary.replace('0.6', alpha));
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = connection.strength * 3 + 1;
      this.ctx.lineCap = 'round';
      
      this.ctx.beginPath();
      this.ctx.moveTo(connection.nodeA.x, connection.nodeA.y);
      
      // Create organic curve
      const midX = (connection.nodeA.x + connection.nodeB.x) / 2 + Math.sin(Date.now() * 0.001) * 10;
      const midY = (connection.nodeA.y + connection.nodeB.y) / 2 + Math.cos(Date.now() * 0.0015) * 10;
      
      this.ctx.quadraticCurveTo(midX, midY, connection.nodeB.x, connection.nodeB.y);
      this.ctx.stroke();
      
      // Add glow effect for strong connections
      if (connection.strength > 0.7) {
        this.ctx.strokeStyle = this.config.colors.accent.replace('0.9', '0.3');
        this.ctx.lineWidth = connection.strength * 6;
        this.ctx.stroke();
      }
    });
    
    // Render nodes (mushroom clusters)
    this.nodes.forEach(node => {
      const pulseSize = Math.sin(node.pulse) * 3 + node.radius;
      
      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, pulseSize + 10
      );
      gradient.addColorStop(0, this.config.colors.accent);
      gradient.addColorStop(0.7, this.config.colors.glow.replace('0.7', '0.2'));
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseSize + 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Main node
      const nodeGradient = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, pulseSize
      );
      nodeGradient.addColorStop(0, this.config.colors.accent);
      nodeGradient.addColorStop(0.6, this.config.colors.primary);
      nodeGradient.addColorStop(1, this.config.colors.earth);
      
      this.ctx.fillStyle = nodeGradient;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Render spores
    this.spores.forEach(spore => {
      const alpha = Math.sin(spore.life * Math.PI) * 0.8 + 0.2;
      const size = spore.radius * (0.5 + Math.sin(spore.life * Math.PI) * 0.5);
      
      // Spore glow
      const sporeGradient = this.ctx.createRadialGradient(
        spore.x, spore.y, 0,
        spore.x, spore.y, spore.glow
      );
      sporeGradient.addColorStop(0, this.config.colors.accent.replace('0.9', alpha));
      sporeGradient.addColorStop(0.5, this.config.colors.glow.replace('0.7', alpha * 0.3));
      sporeGradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = sporeGradient;
      this.ctx.beginPath();
      this.ctx.arc(spore.x, spore.y, spore.glow, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Spore core
      this.ctx.fillStyle = this.config.colors.accent.replace('0.9', alpha);
      this.ctx.beginPath();
      this.ctx.arc(spore.x, spore.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  animate() {
    this.updateNodes();
    this.updateSpores();
    this.findConnections();
    this.render();
    requestAnimationFrame(() => this.animate());
  }
  
  bindEvents() {
    // Mouse/touch interaction
    const updateMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = (e.clientX || e.touches[0].clientX) - rect.left;
      this.mousePos.y = (e.clientY || e.touches[0].clientY) - rect.top;
    };
    
    this.canvas.addEventListener('mousemove', updateMousePos);
    this.canvas.addEventListener('touchmove', updateMousePos);
    
    this.canvas.addEventListener('mouseenter', () => {
      this.isInteracting = true;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isInteracting = false;
    });
    
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isInteracting = true;
      updateMousePos(e);
    });
    
    this.canvas.addEventListener('touchend', () => {
      this.isInteracting = false;
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.resize();
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const myceliumCanvas = document.getElementById('myceliumCanvas');
  if (myceliumCanvas) {
    const network = new LivingMyceliumNetwork('myceliumCanvas');
    console.log('Living Mycelium Network initialized successfully! 🍄');
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LivingMyceliumNetwork;
}
