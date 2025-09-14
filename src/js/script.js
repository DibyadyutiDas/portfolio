// Enhanced Portfolio Script with Fixed Fallback and Modern Features

// =============================================================================
// FALLBACK AND ERROR HANDLING
// =============================================================================

// Show fallback if site doesn't load within 8 seconds
const TIMEOUT = 8000;

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

// Set timeout for fallback
setTimeout(handleFallback, TIMEOUT);

// Enhanced window load handler
window.addEventListener('load', function () {
    const fallback = getFallbackElement();
    
    if (fallback) {
        fallback.classList.add('hidden');
        setTimeout(() => {
            fallback.style.display = 'none';
        }, 500);
    }
    
    // Mark body as loaded
    document.body.classList.add('loaded');
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
        if (!this.cursor) return;
        
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
        return true;
    }

    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.animateCards();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollPos = window.scrollY;
        const heroBottom = this.hero ? this.hero.offsetTop + this.hero.offsetHeight : 0;

        // Hide navbar and show menu toggle after hero section
        if (scrollPos > heroBottom - 100) {
            this.nav.classList.add('hidden');
            this.menuToggle.classList.add('visible');
        } else {
            this.nav.classList.remove('hidden');
            this.menuToggle.classList.remove('visible');
            this.mobileMenu.classList.remove('active');
        }
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
        // Menu Toggle
        this.menuToggle.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
            });
        });
    }
    
    bindSmoothScroll() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
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
// THEME MANAGEMENT
// =============================================================================

class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (prefersDark) {
            this.setTheme('dark');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
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
        this.cards = document.querySelectorAll('.web-card');
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        this.init();
    }
    
    init() {
        if (!this.cardContainer || this.cards.length === 0) return;
        
        this.bindEvents();
        this.setupDragScroll();
        this.updateButtonVisibility();
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
                this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
                this.currentIndex = 0;
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
        const cardWidth = this.cardContainer.offsetWidth / this.cardsPerView;
        this.cardContainer.scrollTo({
            left: index * cardWidth,
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
    if (window.themeManager) {
        window.themeManager.toggleTheme();
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
    window.themeManager = new ThemeManager();
    window.cardCarousel = new CardCarousel();
    window.imageCarousel = new ImageCarousel();
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Mark as loaded
    document.body.classList.add('loaded');
    
    console.log('Portfolio initialized successfully');
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could implement error reporting here
});

// Export for external use
window.PortfolioComponents = {
    CustomCursor,
    NavigationManager,
    ThemeManager,
    CardCarousel,
    ImageCarousel,
    PerformanceOptimizer
};