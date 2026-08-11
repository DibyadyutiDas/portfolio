// Enhanced Portfolio Script with Fixed Fallback and Modern Features

// =============================================================================
// FALLBACK AND ERROR HANDLING
// =============================================================================

// Show fallback if site doesn't load within 8 seconds
const TIMEOUT = 8000;
const shouldSkipSplash = sessionStorage.getItem('skipSplash') === 'true';

// Safely get elements with null checks
const getFallbackElement = () => document.getElementById('fallback');
const getAppElement = () => document.getElementById('app');

// Enhanced fallback handler
const handleFallback = () => {
    const fallback = getFallbackElement();
    const app = getAppElement();
    
    if (!document.body.classList.contains('loaded')) {
        if (app) app.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
        console.warn('Site loading timeout - showing fallback');
    }
};

// Skip splash when redirected from auth
if (shouldSkipSplash) {
    sessionStorage.removeItem('skipSplash');
    const fallback = getFallbackElement();
    const app = getAppElement();
    if (fallback) {
        fallback.classList.add('hidden');
        fallback.style.display = 'none';
        if (window.__splashAnimFrame) {
            cancelAnimationFrame(window.__splashAnimFrame);
        }
    }
    if (app) app.style.display = '';
    document.body.classList.add('loaded');
}

// Set timeout for fallback
setTimeout(handleFallback, TIMEOUT);

// Enhanced window load handler
window.addEventListener('load', function () {
    if (typeof window.__markSplashComplete === 'function') {
        window.__markSplashComplete();
    } else {
        const fallback = getFallbackElement();
        const app = getAppElement();
        if (app) app.style.display = '';
        if (fallback) {
            fallback.classList.add('hidden');
            if (window.__splashAnimFrame) {
                cancelAnimationFrame(window.__splashAnimFrame);
            }
            setTimeout(() => {
                fallback.style.display = 'none';
            }, 500);
        }
        document.body.classList.add('loaded');
    }
});

// Function to handle 404 errors
function show404() {
    const app = getAppElement();
    const fallback = getFallbackElement();
    
    if (app) app.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
}

// =============================================================================
// CUSTOM CURSOR ANIMATION
// =============================================================================

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorVisible = false;
        this.init();
    }
    
    init() {
        if (!this.cursor || window.spidermanCursor) return;
        
        this.bindEvents();
        this.setupHoverEffects();
    }
    
    bindEvents() {
        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            if (!this.cursorVisible) {
                this.cursor.style.opacity = '1';
                this.cursorVisible = true;
            }
            this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorVisible = false;
        });
    }
    
    setupHoverEffects() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .web-card, .nav-links a, .social-icons a, [role="button"]'
        );
        
        interactiveElements.forEach(element => {
            element.classList.add('hover-trigger');
            
            element.addEventListener('mouseenter', (e) => {
                this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1.5)`;
            });

            element.addEventListener('mouseleave', (e) => {
                this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1)`;
            });
        });
    }
}

// =============================================================================
// NAVIGATION AND MENU LOGIC
// =============================================================================

class NavigationManager {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.hero = document.querySelector('.hero');
        this.lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
        this.accumulatedDelta = 0;
        
        this.init();
    }
    
    init() {
        const missing = [];
        if (!this.nav) missing.push('nav');
        if (!this.menuToggle) missing.push('menuToggle');
        if (!this.mobileMenu) missing.push('mobileMenu');
        if (missing.length) {
            console.warn(`Navigation elements not found: ${missing.join(', ')}`);
            return false;
        }

        this.bindScrollEvents();
        this.bindMenuEvents();
        this.bindSmoothScroll();
        this.handleScroll();
        return true;
    }

    bindScrollEvents() {
        let ticking = false;

        const onScrollOrResize = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.animateCards();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });
    }
    
    handleScroll() {
        const isMobile = window.innerWidth <= 768;
        const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
        
        const heroEl = this.hero || document.querySelector('.hero');
        const heroBottom = heroEl ? (heroEl.offsetTop + heroEl.offsetHeight) : 500;
        const navHeight = this.nav ? this.nav.offsetHeight : 60;
        
        // After hero section condition (past hero bottom minus navbar height)
        const isPastHero = currentScrollY > (heroBottom - navHeight - 10);

        if (!isPastHero) {
            // Inside hero section: transparent overlay navbar, never hide
            this.nav.classList.add('on-hero');
            this.nav.classList.remove('scrolled', 'hidden');
            this.accumulatedDelta = 0;
        } else {
            // Past hero section: apply glassmorphism styling
            this.nav.classList.remove('on-hero');
            this.nav.classList.add('scrolled');

            const diff = currentScrollY - this.lastScrollY;

            // Reset accumulated delta if scroll direction flipped
            if ((diff > 0 && this.accumulatedDelta < 0) || (diff < 0 && this.accumulatedDelta > 0)) {
                this.accumulatedDelta = 0;
            }
            this.accumulatedDelta += diff;

            // Scroll DOWN past hero section -> hide navbar to top
            if (this.accumulatedDelta > 15) {
                if (!this.mobileMenu || !this.mobileMenu.classList.contains('active')) {
                    this.nav.classList.add('hidden');
                }
            } 
            // Scroll UP -> reveal navbar
            else if (this.accumulatedDelta < -15) {
                this.nav.classList.remove('hidden');
            }
        }

        this.lastScrollY = currentScrollY;

        if (isMobile) {
            this.menuToggle.classList.add('visible');
        } else {
            this.menuToggle.classList.remove('visible');
            if (this.mobileMenu) this.mobileMenu.classList.remove('active');
        }

        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    animateCards() {
        const cards = document.querySelectorAll('.card, .project-card, .web-card');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.8) {
                card.classList.add('visible');
            }
        });
    }
    
    bindMenuEvents() {
        // Menu Toggle Click
        this.menuToggle.addEventListener('click', () => {
            const isActive = this.mobileMenu.classList.toggle('active');
            this.menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        // Keydown for accessibility
        this.menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isActive = this.mobileMenu.classList.toggle('active');
                this.menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    bindSmoothScroll() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// =============================================================================
// PERSONALIZATION MANAGEMENT (Theme & Layout)
// =============================================================================

class PersonalizationManager {
    constructor() {
        this.init();
    }
    
    init() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Default to light theme for new users
            this.setTheme('light');
        }
    }
    
    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        
        const nav = document.querySelector('nav');
        const footer = document.querySelector('footer');
        
        if (nav) nav.classList.toggle('dark', theme === 'dark');
        if (footer) footer.classList.toggle('dark', theme === 'dark');

        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
        
        localStorage.setItem('theme', theme);
    }
}

// =============================================================================
// CARD CAROUSEL FUNCTIONALITY
// =============================================================================

class CardCarousel {
    constructor() {
        this.cardContainer = document.querySelector('.card-container');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.cards = Array.from(document.querySelectorAll('.web-card'));
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.baseSetCount = this.cards.length % 3 === 0 ? this.cards.length / 3 : this.cards.length;
        this.maxIndex = Math.max(0, this.baseSetCount - this.cardsPerView);
        this.cardStride = 0;
        this.baseWidth = 0;
        this.loopable = this.cards.length >= this.baseSetCount * 3 && this.baseSetCount > 0;
        
        this.init();
    }
    
    init() {
        if (!this.cardContainer || this.cards.length === 0) return;
        
        this.computeMetrics();
        if (this.loopable && this.baseWidth > 0) {
            this.cardContainer.scrollLeft = this.baseWidth;
        }

        this.attachLoopGuard();
        this.bindEvents();
        this.setupDragScroll();
        this.setupWheelScroll();
        this.updateButtonVisibility();
    }

    computeMetrics() {
        const firstCard = this.cards[0];
        if (!firstCard) return;
        const style = window.getComputedStyle(firstCard);
        const marginX = parseFloat(style.marginLeft || '0') + parseFloat(style.marginRight || '0');
        this.cardStride = firstCard.getBoundingClientRect().width + marginX;

        // measure width of one logical set (first baseSetCount cards)
        this.baseWidth = 0;
        for (let i = 0; i < this.baseSetCount && i < this.cards.length; i += 1) {
            const card = this.cards[i];
            const cs = window.getComputedStyle(card);
            const gap = parseFloat(cs.marginLeft || '0') + parseFloat(cs.marginRight || '0');
            this.baseWidth += card.getBoundingClientRect().width + gap;
        }
    }
    
    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate(1));
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.maxIndex = Math.max(0, this.baseSetCount - this.cardsPerView);
                this.currentIndex = 0;
                this.computeMetrics();
                if (this.loopable && this.baseWidth > 0) {
                    this.cardContainer.scrollLeft = this.baseWidth;
                }
                this.scrollToIndex(0);
                this.updateButtonVisibility();
            }
        });
    }
    
    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex <= this.maxIndex) {
            this.currentIndex = newIndex;
            this.scrollToIndex(this.currentIndex);
        }
    }
    
    scrollToIndex(index) {
        const baseOffset = this.loopable ? this.baseWidth : 0;
        const target = baseOffset + index * this.cardStride;
        this.cardContainer.scrollTo({
            left: target,
            behavior: 'smooth'
        });
    }
    
    setupDragScroll() {
        let isDown = false;
        let startX;
        let scrollLeft;

        this.cardContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            this.cardContainer.classList.add('dragging');
            startX = e.pageX - this.cardContainer.offsetLeft;
            scrollLeft = this.cardContainer.scrollLeft;
        });

        this.cardContainer.addEventListener('mouseleave', () => {
            isDown = false;
            this.cardContainer.classList.remove('dragging');
        });

        this.cardContainer.addEventListener('mouseup', () => {
            isDown = false;
            this.cardContainer.classList.remove('dragging');
        });

        this.cardContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.cardContainer.offsetLeft;
            const walk = (x - startX) * 2;
            this.cardContainer.scrollLeft = scrollLeft - walk;
        });
    }

    setupWheelScroll() {
        if (!this.cardContainer) return;
        this.cardContainer.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
                e.preventDefault();
                this.cardContainer.scrollBy({
                    left: e.deltaY,
                    behavior: 'smooth'
                });
            }
        }, { passive: false });
    }

    attachLoopGuard() {
        if (!this.loopable || !this.cardContainer || this.baseWidth === 0) return;
        this.cardContainer.addEventListener('scroll', () => {
            if (this.cardContainer.scrollLeft >= this.baseWidth * 2) {
                this.cardContainer.scrollLeft -= this.baseWidth;
            } else if (this.cardContainer.scrollLeft <= 0) {
                this.cardContainer.scrollLeft += this.baseWidth;
            }
        });
    }
    
    updateButtonVisibility() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
        }
    }
}

// =============================================================================
// IMAGE CAROUSEL
// =============================================================================

class ImageCarousel {
    constructor() {
        this.images = document.querySelectorAll('.carousel img');
        this.index = 1;
        this.init();
    }
    
    init() {
        if (this.images.length === 0) return;
        
        this.rotateImages();
        setInterval(() => this.rotateImages(), 3000);
    }
    
    rotateImages() {
        this.images.forEach(img => img.className = '');
        
        const prevIndex = (this.index - 1 + this.images.length) % this.images.length;
        const nextIndex = (this.index + 1) % this.images.length;
        
        this.images[prevIndex].classList.add('left');
        this.images[this.index].classList.add('center');
        this.images[nextIndex].classList.add('right');
        
        this.index = (this.index + 1) % this.images.length;
    }
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS
// =============================================================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupReducedMotion();
        this.setupVisibilityChange();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-duration', '0ms');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            document.documentElement.style.setProperty(
                '--transition-duration', 
                e.matches ? '0ms' : '300ms'
            );
        });
    }
    
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Global theme toggle function (for backward compatibility)
function toggleTheme() {
    if (window.personalizationManager) {
        window.personalizationManager.toggleTheme();
    }
}

// Global menu toggle function (for backward compatibility)
function toggleMenu() {
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        navRight.classList.toggle('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Initialize all components
    window.customCursor = new CustomCursor();
    window.navigationManager = new NavigationManager();
    window.personalizationManager = new PersonalizationManager();
    window.cardCarousel = new CardCarousel();
    window.imageCarousel = new ImageCarousel();
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Contact Form & Interactive Features
    const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase) || localStorage.getItem('apiBase');
    
    // Project Type Chips selection
    const projectChips = document.querySelectorAll('#projectChips .chip-btn');
    const selectedProjectTypeInput = document.getElementById('selectedProjectType');
    
    if (projectChips.length > 0 && selectedProjectTypeInput) {
        projectChips.forEach(chip => {
            chip.addEventListener('click', () => {
                projectChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedProjectTypeInput.value = chip.getAttribute('data-value') || chip.textContent.trim();
            });
        });
    }

    // Quick Copy Email Button
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyTooltip = document.getElementById('copyTooltip');
    if (copyEmailBtn && copyTooltip) {
        copyEmailBtn.addEventListener('click', async () => {
            const emailToCopy = 'dibyadyutidas0@gmail.com';
            try {
                await navigator.clipboard.writeText(emailToCopy);
                copyTooltip.textContent = 'Copied! ✓';
                copyTooltip.style.color = '#10b981';
                setTimeout(() => {
                    copyTooltip.textContent = 'Copy';
                    copyTooltip.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
            }
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnTextSpan = submitBtn.querySelector('span:first-child');
            const originalText = btnTextSpan ? btnTextSpan.textContent : 'SEND MESSAGE';
            
            const nameInput = contactForm.querySelector('#contactName') || contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('#contactEmail') || contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('#contactMessage') || contactForm.querySelector('textarea');
            const projectTypeInput = contactForm.querySelector('#selectedProjectType');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            const projectType = projectTypeInput ? projectTypeInput.value : 'General Inquiry';

            if (btnTextSpan) btnTextSpan.textContent = 'SENDING...';
            submitBtn.disabled = true;

            try {
                if (!apiBase) {
                    const subject = encodeURIComponent(`[${projectType}] Portfolio message from ${name}`);
                    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`);
                    window.location.href = `mailto:dibyadyutidas0@gmail.com?subject=${subject}&body=${body}`;
                    if (btnTextSpan) btnTextSpan.textContent = 'OPENING EMAIL...';
                    setTimeout(() => {
                        if (btnTextSpan) btnTextSpan.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1800);
                    return;
                }

                const res = await fetch(`${apiBase}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, projectType, message })
                });

                const data = await res.json();
                
                if (res.ok && data.success) {
                    if (btnTextSpan) btnTextSpan.textContent = 'SENT SUCCESSFULLY!';
                    submitBtn.style.backgroundColor = '#10b981';
                    submitBtn.style.borderColor = '#10b981';
                    contactForm.reset();
                    
                    // Reset active chip
                    if (projectChips.length > 0) {
                        projectChips.forEach(c => c.classList.remove('active'));
                        projectChips[0].classList.add('active');
                        if (selectedProjectTypeInput) selectedProjectTypeInput.value = projectChips[0].getAttribute('data-value');
                    }

                    setTimeout(() => {
                        if (btnTextSpan) btnTextSpan.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Contact Form Error:', error);
                if (btnTextSpan) btnTextSpan.textContent = 'FAILED TO SEND';
                submitBtn.style.backgroundColor = '#ef4444';
                submitBtn.style.borderColor = '#ef4444';
                setTimeout(() => {
                    if (btnTextSpan) btnTextSpan.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    console.log('Portfolio initialized successfully');
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could implement error reporting here
});

// Export for external use
window.PortfolioComponents = {
    CustomCursor,
    NavigationManager,
    PersonalizationManager,
    CardCarousel,
    ImageCarousel,
    PerformanceOptimizer
};