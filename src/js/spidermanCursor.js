/**
 * Interactive Spider-Man Web-Slinging Cursor
 * Uses user-provided Spider-Man comic artwork with background removed (photo/spiderman.png).
 * Features:
 * - Normal, smooth web-slinging speed (fluid physics).
 * - Adaptive Web Color: Dark web on light background, White web on dark background.
 * - Small Pointer: Pointer becomes small after Spider-Man arrives at pointer, with zero circular animations.
 */

class SpidermanCursor {
    constructor() {
        this.canvas = document.getElementById('spiderman-cursor-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'spiderman-cursor-canvas';
            document.body.prepend(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Load Spider-Man transparent image asset
        this.spidermanImg = new Image();
        this.spidermanImg.src = 'photo/spiderman.png';
        this.imgLoaded = false;
        this.spidermanImg.onload = () => {
            this.imgLoaded = true;
        };

        // Mouse cursor position
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        
        // Active web target anchor position (where web is currently attached)
        this.webAnchorX = this.mouseX;
        this.webAnchorY = this.mouseY;
        
        // Spider-Man body position
        this.x = this.mouseX - 50;
        this.y = this.mouseY - 50;
        
        // Velocity for physics
        this.vx = 0;
        this.vy = 0;
        
        // Orientation & animation states
        this.angle = 0;
        this.animTime = 0;
        this.isVisible = true;
        this.isHovering = false;
        this.isMouseDown = false;
        this.scale = 0.85;
        this.targetScale = 0.85;
        
        // Adaptive Theme (Light vs Dark background detection)
        this.isLightBg = false;
        this.lastThemeCheck = 0;
        
        // Web Shooting Delay & State Machine
        this.webState = 'idle';
        this.webAlpha = 0;
        this.webProgress = 0; // Smooth web extension progress
        this.webTension = 0; // Wave curve intensity
        this.shootDelayMs = 100; // Natural delay before web fires
        this.pendingTargetX = this.mouseX;
        this.pendingTargetY = this.mouseY;
        this.shootTimer = null;
        
        // Visual effects & particles
        this.particles = [];

        this.init();
    }

    init() {
        document.body.classList.add('has-spiderman-cursor');
        this.resize();
        this.bindEvents();
        this.setupHoverTriggers();
        this.animate();
    }

    resize() {
        this.dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            if (!this.isVisible) {
                this.x = this.mouseX - 40;
                this.y = this.mouseY - 40;
                this.webAnchorX = this.mouseX;
                this.webAnchorY = this.mouseY;
                this.isVisible = true;
            }

            this.onMouseMove();
        });

        document.addEventListener('mouseleave', () => {
            this.isVisible = false;
        });

        document.addEventListener('mouseenter', () => {
            this.isVisible = true;
        });

        document.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.targetScale = 1.1;
            this.fireWeb(e.clientX, e.clientY, true);
            this.createWebBurst(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.targetScale = this.isHovering ? 1.0 : 0.85;
        });
    }

    onMouseMove() {
        const distFromAnchor = Math.hypot(this.mouseX - this.webAnchorX, this.mouseY - this.webAnchorY);

        // If mouse moved far enough from current web anchor, schedule a web shot after slight delay
        if (distFromAnchor > 30) {
            this.pendingTargetX = this.mouseX;
            this.pendingTargetY = this.mouseY;

            if (this.shootTimer) clearTimeout(this.shootTimer);

            // Web shoot delay: creates realistic "lock target -> THWIP!" cadence
            this.shootTimer = setTimeout(() => {
                this.fireWeb(this.pendingTargetX, this.pendingTargetY, false);
            }, this.shootDelayMs);
        }
    }

    fireWeb(targetX, targetY, forceImmediate = false) {
        this.webAnchorX = targetX;
        this.webAnchorY = targetY;
        this.webState = 'firing';
        this.webAlpha = 1;
        this.webProgress = 0;
        this.webTension = 1; // High tension wave initially

        this.createThwipSparkles();
    }

    setupHoverTriggers() {
        const interactiveSelector = 'a, button, .project-card, .web-card, .nav-links a, .social-icons a, input, textarea, [role="button"]';
        
        const updateHoverState = () => {
            const elements = document.querySelectorAll(interactiveSelector);
            elements.forEach(el => {
                if (el.dataset.spidermanHoverBound) return;
                el.dataset.spidermanHoverBound = 'true';

                el.addEventListener('mouseenter', () => {
                    this.isHovering = true;
                    this.targetScale = 1.0;
                });

                el.addEventListener('mouseleave', () => {
                    this.isHovering = false;
                    this.targetScale = 0.85;
                });
            });
        };

        updateHoverState();
        setInterval(updateHoverState, 2000);
    }

    /**
     * Detects if the element beneath current mouse position has a light or dark background
     */
    checkBackgroundTheme() {
        const now = Date.now();
        if (now - this.lastThemeCheck < 80) return;
        this.lastThemeCheck = now;

        this.canvas.style.display = 'none';
        const el = document.elementFromPoint(this.mouseX, this.mouseY);
        this.canvas.style.display = 'block';

        if (!el) return;

        let current = el;
        let bg = '';
        while (current && current !== document.body && current !== document.documentElement) {
            const comp = window.getComputedStyle(current);
            const col = comp.backgroundColor;
            if (col && col !== 'rgba(0, 0, 0, 0)' && col !== 'transparent') {
                bg = col;
                break;
            }
            current = current.parentElement;
        }

        if (!bg) {
            bg = window.getComputedStyle(document.body).backgroundColor || 'rgb(15, 23, 42)';
        }

        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0], 10);
            const g = parseInt(rgb[1], 10);
            const b = parseInt(rgb[2], 10);
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            this.isLightBg = lum > 150;
        }
    }

    createThwipSparkles() {
        const wristOffset = 22 * this.scale;
        const wx = this.x + Math.cos(this.angle + 0.3) * wristOffset;
        const wy = this.y + Math.sin(this.angle + 0.3) * wristOffset;

        const pColor = this.isLightBg ? '#111111' : '#ffffff';

        for (let i = 0; i < 5; i++) {
            const spreadAngle = this.angle + (Math.random() - 0.5) * 0.8;
            const speed = 1.5 + Math.random() * 3;
            this.particles.push({
                x: wx,
                y: wy,
                vx: Math.cos(spreadAngle) * speed,
                vy: Math.sin(spreadAngle) * speed,
                alpha: 1,
                size: 1.2 + Math.random() * 1.5,
                maxLife: 12 + Math.random() * 8,
                life: 0,
                color: pColor
            });
        }
    }

    createWebBurst(x, y) {
        const count = 14;
        const mainColor = this.isLightBg ? '#111111' : '#ffffff';
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.15);
            const speed = 2.5 + Math.random() * 4.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                size: 1.8 + Math.random() * 2,
                maxLife: 24 + Math.random() * 12,
                life: 0,
                color: Math.random() > 0.3 ? mainColor : '#eb1e25'
            });
        }
    }

    updatePhysics() {
        this.checkBackgroundTheme();

        // Smoothly extend web shooting progress
        this.webProgress += (1 - this.webProgress) * 0.20;

        // Distance to active web anchor
        const dx = this.webAnchorX - this.x;
        const dy = this.webAnchorY - this.y;
        const distToAnchor = Math.hypot(dx, dy);

        // Distance to actual live mouse
        const mouseDx = this.mouseX - this.x;
        const mouseDy = this.mouseY - this.y;
        const distToMouse = Math.hypot(mouseDx, mouseDy);

        // Ultra-smooth physics (fluid spring acceleration & soft deceleration)
        const stiffness = 0.052; // Smooth fluid acceleration
        const damping = 0.84;    // Soft deceleration

        this.vx = (this.vx + dx * stiffness) * damping;
        this.vy = (this.vy + dy * stiffness) * damping;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth rotation to face direction of web anchor
        const movementSpeed = Math.hypot(this.vx, this.vy);

        let targetAngle = this.angle;
        if (distToAnchor > 10) {
            targetAngle = Math.atan2(dy, dx);
        } else if (distToMouse > 5) {
            targetAngle = Math.atan2(mouseDy, mouseDx);
        }

        if (movementSpeed > 0.4 || distToAnchor > 10) {
            let diff = targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.angle += diff * 0.18; // Ultra-smooth rotation
        }

        // Web tension decay (wave flattens as Spider-Man gets pulled closer)
        this.webTension *= 0.90;

        // If close to anchor, gradually fade out web line until next shot
        if (distToAnchor < 16) {
            this.webAlpha *= 0.86;
            if (this.webAlpha < 0.05) {
                this.webAlpha = 0;
                this.webState = 'idle';
            }
        }

        // Animation time
        this.animTime += movementSpeed * 0.08 + 0.02;

        // Scale lerp
        this.scale += (this.targetScale - this.scale) * 0.15;
    }

    /**
     * Draws pointer reticle:
     * - When Spider-Man arrives: small clean pointer dot with zero circular animations.
     * - While Spider-Man is traveling: small target reticle.
     */
    drawPointer(x, y, isArrived) {
        this.ctx.save();
        this.ctx.translate(x, y);

        const fgColor = this.isLightBg ? '#111111' : '#ffffff';
        const accentColor = '#eb1e25';

        if (isArrived) {
            // Small pointer when Spider-Man arrives (NO circular animation)
            const dotRadius = this.isHovering ? 4 : 3;

            // Small glowing center dot
            this.ctx.fillStyle = fgColor;
            this.ctx.shadowColor = accentColor;
            this.ctx.shadowBlur = 4;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, dotRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Subtle tiny crosshair lines (no circular rings)
            this.ctx.strokeStyle = fgColor;
            this.ctx.lineWidth = 1;
            this.ctx.shadowBlur = 0;
            const tickLen = 3;
            const gap = dotRadius + 2;

            this.ctx.beginPath();
            this.ctx.moveTo(0, -gap); this.ctx.lineTo(0, -gap - tickLen);
            this.ctx.moveTo(0, gap); this.ctx.lineTo(0, gap + tickLen);
            this.ctx.moveTo(-gap, 0); this.ctx.lineTo(-gap - tickLen, 0);
            this.ctx.moveTo(gap, 0); this.ctx.lineTo(gap + tickLen, 0);
            this.ctx.stroke();
        } else {
            // Target reticle while traveling (clean straight spokes, no circular animation)
            const radius = (this.isHovering ? 9 : 7);
            this.ctx.strokeStyle = fgColor;
            this.ctx.lineWidth = 1.2;
            this.ctx.shadowColor = fgColor;
            this.ctx.shadowBlur = 4;

            const spokes = 4;
            for (let i = 0; i < spokes; i++) {
                const a = (Math.PI / 2) * i;
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
                this.ctx.stroke();
            }

            // Center spider dot
            this.ctx.fillStyle = accentColor;
            this.ctx.shadowColor = accentColor;
            this.ctx.shadowBlur = 6;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    /**
     * Adaptive Web Strand:
     * - Dark web line over light backgrounds
     * - White web line over dark backgrounds
     */
    drawWebStrand() {
        if (this.webAlpha <= 0.01) return;

        const dx = this.webAnchorX - this.x;
        const dy = this.webAnchorY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 10) return;

        this.ctx.save();

        // Adaptive Web Color (Dark in light bg, White in dark bg)
        const webMainColor = this.isLightBg 
            ? `rgba(18, 18, 18, ${0.95 * this.webAlpha})` 
            : `rgba(255, 255, 255, ${0.95 * this.webAlpha})`;
        
        const webGlowColor = this.isLightBg 
            ? `rgba(0, 0, 0, ${0.15 * this.webAlpha})` 
            : `rgba(255, 255, 255, ${0.3 * this.webAlpha})`;

        // Web line styling (clean, crisp, minimal glow)
        this.ctx.strokeStyle = webMainColor;
        this.ctx.lineWidth = 1.8;
        this.ctx.shadowColor = webGlowColor;
        this.ctx.shadowBlur = 1.5;

        // Wrist origin position (extended web shooter hand)
        const wristOffset = 16 * this.scale;
        const startX = this.x + Math.cos(this.angle + 0.3) * wristOffset;
        const startY = this.y + Math.sin(this.angle + 0.3) * wristOffset;

        // Calculate end tip position based on web extension progress
        const targetTipX = startX + (this.webAnchorX - startX) * this.webProgress;
        const targetTipY = startY + (this.webAnchorY - startY) * this.webProgress;

        // Elastic tension wave curve
        const tensionOffset = Math.sin(this.animTime * 3) * 8 * this.webTension;
        const perpX = (-dy / dist) * tensionOffset;
        const perpY = (dx / dist) * tensionOffset;
        const midX = (startX + targetTipX) / 2 + perpX;
        const midY = (startY + targetTipY) / 2 + perpY;

        // Main Web Strand
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(midX, midY, targetTipX, targetTipY);
        this.ctx.stroke();

        // Web nodes along strand
        if (dist > 35) {
            const nodeColor = this.isLightBg 
                ? `rgba(18, 18, 18, ${0.45 * this.webAlpha})` 
                : `rgba(255, 255, 255, ${0.45 * this.webAlpha})`;
            this.ctx.strokeStyle = nodeColor;
            this.ctx.lineWidth = 0.9;
            const nodeCount = Math.min(3, Math.floor(dist / 40));
            for (let i = 1; i <= nodeCount; i++) {
                const t = i / (nodeCount + 1);
                const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * this.webAnchorX;
                const py = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * this.webAnchorY;
                
                this.ctx.beginPath();
                this.ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    /**
     * Renders User-Provided Spider-Man Comic Illustration (photo/spiderman.png)
     */
    drawSpiderman() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.scale(this.scale, this.scale);

        if (this.imgLoaded) {
            const renderWidth = 60;
            const renderHeight = 70;

            // Draw transparent Spider-Man comic illustration
            this.ctx.drawImage(
                this.spidermanImg,
                -renderWidth / 2,
                -renderHeight / 2,
                renderWidth,
                renderHeight
            );
        }

        this.ctx.restore();
    }

    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.91;
            p.vy *= 0.91;
            p.life++;

            const progress = p.life / p.maxLife;
            p.alpha = 1 - progress;

            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            const pCol = p.color;
            this.ctx.fillStyle = pCol === '#ffffff' ? `rgba(255, 255, 255, ${p.alpha})` : (pCol === '#111111' ? `rgba(17, 17, 17, ${p.alpha})` : `rgba(235, 30, 37, ${p.alpha})`);
            this.ctx.shadowColor = pCol === '#ffffff' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(235, 30, 37, 0.9)';
            this.ctx.shadowBlur = 4;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.isVisible) {
            this.updatePhysics();
            this.drawWebStrand();
            
            const distAnchor = Math.hypot(this.x - this.webAnchorX, this.y - this.webAnchorY);
            const isArrived = distAnchor <= 18;
            
            this.drawPointer(this.mouseX, this.mouseY, isArrived);

            this.drawSpiderman();
            this.drawParticles();
        } else {
            // Keep physics updated so Spider-Man stays near mouse while hidden
            this.updatePhysics();
            // ALWAYS draw the pointer dot so the user can still see where their mouse is!
            this.drawPointer(this.mouseX, this.mouseY, true);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Auto initialize on DOM Content Loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.spidermanCursor = new SpidermanCursor();
    });
} else {
    window.spidermanCursor = new SpidermanCursor();
}
