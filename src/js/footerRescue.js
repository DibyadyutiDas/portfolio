/**
 * Save MJ / Gwen Footer Rescue Scene (Interactive Button Triggered)
 * Features:
 * - Button click ("Save MJ") triggers MJ to start falling from the top of the footer.
 * - Spider-Man zips to the top of the footer.
 * - Touching falling MJ with mouse pointer causes Spider-Man to leap down, shoot web, catch MJ mid-air, and land on footer ground.
 * - Displays character message: "YOU SAVED MJ! 🕷️❤️".
 * - Spider-Man smoothly zips back to the mouse pointer after completing the save!
 */

class FooterRescueScene {
    constructor() {
        this.container = document.getElementById('footer-rescue-container');
        this.canvas = document.getElementById('footer-rescue-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.triggerBtn = document.getElementById('trigger-save-mj-btn');

        // Load Spider-Man & Gwen transparent image assets
        this.spidermanImg = new Image();
        this.spidermanImg.src = 'photo/spiderman.png';
        this.imgLoaded = false;
        this.spidermanImg.onload = () => {
            this.imgLoaded = true;
        };

        this.gwenRescueImg = new Image();
        this.gwenRescueImg.src = 'photo/gwen_rescue.png';
        this.gwenRescueLoaded = false;
        this.gwenRescueImg.onload = () => {
            this.gwenRescueLoaded = true;
        };

        this.gwenFallingImg = new Image();
        this.gwenFallingImg.src = 'photo/gwen_falling.png';
        this.gwenFallingLoaded = false;
        this.gwenFallingImg.onload = () => {
            this.gwenFallingLoaded = true;
        };

        // State Machine
        // States: 'idle', 'falling', 'rescuing', 'saved', 'returning'
        this.state = 'idle';

        // Positions relative to footer canvas
        this.mjX = 0;
        this.mjY = 0;
        this.mjFallSpeed = 1.1;
        this.mjAngle = 0;

        // Spider-Man rescue coordinates & physics
        this.spidermanX = -100;
        this.spidermanY = -100;
        this.spidermanVx = 0;
        this.spidermanVy = 0;
        this.spidermanAngle = 0;
        this.spidermanScale = 0.85;

        // Mouse pointer relative to footer canvas
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.isPointerNearMJ = false;

        // Web line & shockwave effects
        this.webAnchorX = 0;
        this.webAnchorY = 0;
        this.webAlpha = 0;
        this.particles = [];
        this.shockwaveRadius = 0;
        this.shockwaveAlpha = 0;
        this.returnTimer = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Track mouse position over canvas
        document.addEventListener('mousemove', (e) => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Trigger Button Listener
        if (this.triggerBtn) {
            this.triggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startFallingSequence();
            });
        }

        this.animate();
    }

    resize() {
        if (!this.canvas || !this.container) return;
        this.dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
    }

    startFallingSequence() {
        if (this.state === 'falling' || this.state === 'rescuing') return;

        this.state = 'falling';
        this.hasUpdatedText = false;
        if (this.returnTimer) clearTimeout(this.returnTimer);

        // Always reset button text to starting state
        if (this.triggerBtn) {
            this.triggerBtn.innerHTML = '<span>SAVE MJ / GWEN</span> <span class="btn-arrow">→</span>';
        }

        // Reset MJ & Spider-Man variables completely
        this.mjX = Math.max(120, this.width - 160);
        this.mjY = 15;
        this.mjFallSpeed = 1.1;
        this.mjAngle = 0;

        this.spidermanVx = 0;
        this.spidermanVy = 0;
        this.spidermanAngle = 0;

        this.shockwaveRadius = 0;
        this.shockwaveAlpha = 0;

        // Web anchor at top of footer
        this.webAnchorX = this.mjX - 20;
        this.webAnchorY = 0;

        // Get Spider-Man starting position from cursor or center
        if (window.spidermanCursor) {
            window.spidermanCursor.isVisible = false;
            const rect = this.canvas.getBoundingClientRect();
            this.spidermanX = window.spidermanCursor.x - rect.left;
            this.spidermanY = window.spidermanCursor.y - rect.top;
        } else {
            this.spidermanX = this.width / 2;
            this.spidermanY = this.height / 2;
        }

        this.webAlpha = 0;
        this.particles = [];
    }

    triggerRescue() {
        if (this.state !== 'falling') return;
        this.state = 'rescuing';
        this.webAlpha = 1;

        // Position Spider-Man at top of footer to leap down
        this.spidermanX = this.webAnchorX;
        this.spidermanY = 10;

        this.createSparkles(this.spidermanX, this.spidermanY);
    }

    createSparkles(x, y) {
        for (let i = 0; i < 16; i++) {
            const a = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                alpha: 1,
                size: 1.5 + Math.random() * 2,
                color: Math.random() > 0.4 ? '#ffffff' : '#eb1e25',
                maxLife: 25,
                life: 0
            });
        }
    }

    update() {
        // --- 1. FALLING STATE ---
        if (this.state === 'falling') {
            this.mjY += this.mjFallSpeed;
            this.mjFallSpeed = Math.min(2.8, this.mjFallSpeed + 0.02);
            this.mjAngle = Math.sin(this.mjY * 0.05) * 0.15;

            // Spider-Man zips up to top of footer to prepare jump
            const prepX = this.webAnchorX;
            const prepY = 15;
            this.spidermanX += (prepX - this.spidermanX) * 0.15;
            this.spidermanY += (prepY - this.spidermanY) * 0.15;

            // Check if pointer touches/hovers MJ
            const distToPointer = Math.hypot(this.mouseX - this.mjX, this.mouseY - this.mjY);
            this.isPointerNearMJ = distToPointer < 55;

            if (this.isPointerNearMJ) {
                this.triggerRescue();
            }

            // Ground limit reset if missed
            const groundY = this.height - 45;
            if (this.mjY >= groundY) {
                this.mjY = groundY;
                this.state = 'saved';
                if (this.triggerBtn) this.triggerBtn.innerHTML = '<span>MJ WAS DROPPED...</span>';

                // Return back to pointer after delay
                this.returnTimer = setTimeout(() => {
                    this.state = 'idle';
                    this.webAlpha = 0;
                    if (this.triggerBtn) this.triggerBtn.innerHTML = '<span>SAVE MJ / GWEN</span> <span class="btn-arrow">→</span>';
                    if (window.spidermanCursor) window.spidermanCursor.isVisible = true;
                }, 2500);
            }
        }

        // --- 2. RESCUING STATE (Spider-Man dives down, catches MJ, lands on floor) ---
        else if (this.state === 'rescuing') {
            const targetX = this.mjX - 10;
            const targetY = this.mjY - 12;

            const dx = targetX - this.spidermanX;
            const dy = targetY - this.spidermanY;

            this.spidermanVx = (this.spidermanVx + dx * 0.14) * 0.78;
            this.spidermanVy = (this.spidermanVy + dy * 0.14) * 0.78;

            this.spidermanX += this.spidermanVx;
            this.spidermanY += this.spidermanVy;
            this.spidermanAngle = Math.atan2(dy, dx);

            const catchDist = Math.hypot(dx, dy);
            if (catchDist < 25) {
                // Update button text IMMEDIATELY upon mid-air catch!
                if (this.triggerBtn && !this.hasUpdatedText) {
                    this.hasUpdatedText = true;
                    this.triggerBtn.innerHTML = '<span style="color: #eb1e25;">YOU SAVED GWEN! 🕷️❤️</span>';
                }

                // Carry MJ with Spider-Man
                this.mjX = this.spidermanX + 6;
                this.mjY = this.spidermanY + 10;

                // Move together toward safe landing on footer floor
                const groundY = this.height - 50;
                const landDx = (this.webAnchorX - 40) - this.spidermanX;
                const landDy = groundY - this.spidermanY;

                this.spidermanX += landDx * 0.12;
                this.spidermanY += landDy * 0.12;

                if (Math.abs(landDy) < 14 || this.spidermanY >= groundY - 10) {
                    this.state = 'saved';
                    this.shockwaveRadius = 5;
                    this.shockwaveAlpha = 1;
                    this.createSparkles(this.spidermanX, groundY);

                    // Schedule Spider-Man disappearing and returning to pointer
                    this.returnTimer = setTimeout(() => {
                        this.state = 'idle';
                        this.webAlpha = 0;
                        this.hasUpdatedText = false;
                        if (this.triggerBtn) {
                            this.triggerBtn.innerHTML = '<span>SAVE MJ / GWEN</span> <span class="btn-arrow">→</span>';
                        }
                        if (window.spidermanCursor) window.spidermanCursor.isVisible = true;
                    }, 2500);
                }
            }
        }

        // --- SHOCKWAVE & PARTICLES DECAY ---
        if (this.shockwaveAlpha > 0) {
            this.shockwaveRadius += 3.2;
            this.shockwaveAlpha *= 0.90;
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.92;
            p.vy *= 0.92;
            p.life++;
            p.alpha = 1 - (p.life / p.maxLife);

            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawGwenStacy(x, y, angle) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        if (this.gwenFallingLoaded) {
            const renderHeight = 70;
            const renderWidth = renderHeight * (123 / 179);
            this.ctx.drawImage(
                this.gwenFallingImg,
                -renderWidth / 2,
                -renderHeight / 2,
                renderWidth,
                renderHeight
            );
        }

        this.ctx.restore();
    }

    drawWebRescueLine() {
        if ((this.state !== 'rescuing' && this.state !== 'saved') || this.webAlpha <= 0.01) return;

        this.ctx.save();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * this.webAlpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = `rgba(255, 255, 255, ${0.8 * this.webAlpha})`;
        this.ctx.shadowBlur = 5;

        // Top web line: top anchor down to Spider-Man
        this.ctx.beginPath();
        this.ctx.moveTo(this.webAnchorX, this.webAnchorY);
        this.ctx.lineTo(this.spidermanX, this.spidermanY);
        this.ctx.stroke();

        // Catch web line: Spider-Man down to Gwen Stacy's waist (matching reference image!)
        this.ctx.beginPath();
        this.ctx.moveTo(this.spidermanX, this.spidermanY);
        this.ctx.lineTo(this.mjX, this.mjY - 2);
        this.ctx.stroke();

        // Web fan-out lines wrapping around Gwen's waist
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.spidermanX, this.spidermanY);
        this.ctx.lineTo(this.mjX - 6, this.mjY);
        this.ctx.moveTo(this.spidermanX, this.spidermanY);
        this.ctx.lineTo(this.mjX + 6, this.mjY);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawSpidermanRescue() {
        if (this.state === 'idle') return;

        this.ctx.save();
        this.ctx.translate(this.spidermanX, this.spidermanY);
        this.ctx.rotate(this.spidermanAngle);

        if (this.imgLoaded) {
            const renderWidth = 38;
            const renderHeight = 43;

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

    drawShockwave() {
        if (this.shockwaveAlpha <= 0.01) return;

        this.ctx.save();
        this.ctx.strokeStyle = `rgba(235, 30, 37, ${this.shockwaveAlpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = 'rgba(235, 30, 37, 0.8)';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(this.spidermanX, this.height - 50, this.shockwaveRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 4;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state !== 'idle') {
            this.update();

            if ((this.state === 'rescuing' || this.state === 'saved') && this.gwenRescueLoaded) {
                // Render the exact reference artwork image sprite!
                this.ctx.save();
                const spriteHeight = Math.min(this.height - 20, 240);
                const spriteWidth = spriteHeight * (123 / 571);

                const drawX = this.spidermanX - spriteWidth / 2;
                const drawY = Math.max(0, this.spidermanY - 70);

                this.ctx.drawImage(
                    this.gwenRescueImg,
                    drawX,
                    drawY,
                    spriteWidth,
                    spriteHeight
                );
                this.ctx.restore();
            } else {
                this.drawWebRescueLine();
                if (this.state === 'falling') {
                    this.drawGwenStacy(this.mjX, this.mjY, this.mjAngle);
                    this.drawSpidermanRescue();
                }
            }

            this.drawShockwave();
            this.drawParticles();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Auto initialize on DOM Content Loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.footerRescueScene = new FooterRescueScene();
    });
} else {
    window.footerRescueScene = new FooterRescueScene();
}
