/**
 * Interactive 3D Lanyard ID Card (Physics & Tilt Engine)
 * Dibyadyuti Das Portfolio
 */

class IDCardPhysics {
  constructor() {
    this.stage = document.getElementById('id-card-stage');
    this.card = document.getElementById('id-card-3d');
    this.strap = document.getElementById('lanyard-strap');
    this.clipFront = document.getElementById('lanyard-clip-front');
    this.clipBack = document.getElementById('lanyard-clip-back');
    this.sheen = document.getElementById('id-card-sheen');

    if (!this.stage || !this.card) return;

    // Physics States
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.targetRotX = 0;
    this.targetRotY = 0;
    this.targetRotZ = 0;

    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    // Store latest mouse delta for sheen — updated in mousemove, applied in animate()
    this._sheenDX = 0;
    this._sheenDY = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    // Mouse hover tracking
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Dragging physics
    this.stage.addEventListener('mousedown', (e) => this.onDragStart(e));
    window.addEventListener('mousemove', (e) => this.onDragMove(e));
    window.addEventListener('mouseup', () => this.onDragEnd());

    // Touch events for mobile
    this.stage.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    window.addEventListener('touchend', () => this.onDragEnd());

    // Reset when cursor leaves window
    document.addEventListener('mouseleave', () => {
      if (!this.isDragging) {
        this.targetRotX = 0;
        this.targetRotY = 0;
        this.targetRotZ = 0;
      }
    });
  }

  onMouseMove(e) {
    if (this.isDragging) return;

    const rect = this.stage.getBoundingClientRect();
    const isHoveringStage = (
      e.clientX >= rect.left - 100 &&
      e.clientX <= rect.right + 100 &&
      e.clientY >= rect.top - 100 &&
      e.clientY <= rect.bottom + 100
    );

    if (isHoveringStage) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top - 120; // Pivot at top of lanyard tape

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      this.targetRotY = deltaX * 28;
      this.targetRotX = -deltaY * 22;
      this.targetRotZ = deltaX * 8;

      // Store for use in animate() — avoids triggering paint in event handler
      this._sheenDX = deltaX;
      this._sheenDY = deltaY;
    } else {
      this.targetRotX = 0;
      this.targetRotY = 0;
      this.targetRotZ = 0;
      this._sheenDX = 0;
      this._sheenDY = 0;
    }
  }

  onDragStart(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  onDragMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    this.targetRotY = Math.max(-45, Math.min(45, deltaX * 0.4));
    this.targetRotX = Math.max(-35, Math.min(35, -deltaY * 0.4));
    this.targetRotZ = Math.max(-20, Math.min(20, deltaX * 0.15));
  }

  onTouchStart(e) {
    if (e.touches.length > 0) {
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    }
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length === 0) return;

    const deltaX = e.touches[0].clientX - this.startX;
    const deltaY = e.touches[0].clientY - this.startY;

    this.targetRotY = Math.max(-40, Math.min(40, deltaX * 0.4));
    this.targetRotX = Math.max(-30, Math.min(30, -deltaY * 0.4));
    this.targetRotZ = Math.max(-18, Math.min(18, deltaX * 0.15));
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    // Apply impulse for natural swing-back
    this.velY = -this.targetRotY * 0.15;
    this.velX = -this.targetRotX * 0.15;

    this.targetRotX = 0;
    this.targetRotY = 0;
    this.targetRotZ = 0;
  }

  animate() {
    // Spring physics (Harmonic Oscillator)
    const springStiffness = 0.08;
    const damping = 0.84;

    const forceX = (this.targetRotX - this.rotX) * springStiffness;
    const forceY = (this.targetRotY - this.rotY) * springStiffness;
    const forceZ = (this.targetRotZ - this.rotZ) * springStiffness;

    this.velX = (this.velX + forceX) * damping;
    this.velY = (this.velY + forceY) * damping;
    this.velZ = (this.velZ + forceZ) * damping;

    this.rotX += this.velX;
    this.rotY += this.velY;
    this.rotZ += this.velZ;

    // Apply transform — only property changed each frame (GPU composited, no repaint)
    if (this.card) {
      this.card.style.transform =
        `rotateX(${this.rotX.toFixed(2)}deg) rotateY(${this.rotY.toFixed(2)}deg) rotateZ(${this.rotZ.toFixed(2)}deg)`;
    }

    // Update sheen inside rAF loop (not in the event handler) to avoid mid-event repaints
    if (this.sheen) {
      const dx = this._sheenDX;
      const dy = this._sheenDY;
      const angle = (135 + dx * 30).toFixed(1);
      const stop = Math.min(Math.max(20 + dy * 30, 10), 60).toFixed(1);
      this.sheen.style.background =
        `linear-gradient(${angle}deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) ${stop}%, transparent 68%)`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new IDCardPhysics();
});
