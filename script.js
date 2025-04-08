// script.js
// renderProjectCards is now available globally from renderProjectCards.js

window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    if (loadingScreen && content) {
        loadingScreen.style.display = 'none';
        content.style.display = 'block';
    }
});

// Custom cursor animation
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .web-card, .nav-links a, .social-icons a');
    interactiveElements.forEach(element => {
        element.classList.add('hover-trigger');
        element.addEventListener('mouseenter', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1.5)`;
        });
        element.addEventListener('mouseleave', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1)`;
        });
    });
}

// Navigation and Menu Toggle Logic
const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const hero = document.querySelector('.hero');

if (nav && menuToggle && mobileMenu && hero) {
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const heroBottom = hero.offsetTop + hero.offsetHeight;

        if (scrollPos > heroBottom - 100) {
            nav.classList.add('hidden');
            menuToggle.classList.add('visible');
        } else {
            nav.classList.remove('hidden');
            menuToggle.classList.remove('visible');
            mobileMenu.classList.remove('active');
        }
    });

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Performance optimization - lazy load heavy elements
window.addEventListener('load', () => {
    const lazyElements = document.querySelectorAll('.lazy-load');
    lazyElements.forEach(el => {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
    });
});

// Enhanced smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - document.querySelector('nav').offsetHeight,
                behavior: 'smooth'
            });
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark');
    document.querySelector('nav')?.classList.toggle('dark');
    document.querySelector('footer')?.classList.toggle('dark');

    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        if (document.body.classList.contains('dark')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// Carousel animation functionality
function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('img');
    let currentIndex = 1; // Start with center image
    
    function rotateCarousel() {
        // Remove all position classes
        images.forEach(img => {
            img.classList.remove('left', 'center', 'right');
        });

        // Update indices
        currentIndex = (currentIndex + 1) % images.length;
        const leftIndex = (currentIndex - 1 + images.length) % images.length;
        const rightIndex = (currentIndex + 1) % images.length;

        // Apply new positions
        images[leftIndex].classList.add('left');
        images[currentIndex].classList.add('center');
        images[rightIndex].classList.add('right');
    }

    // Initialize positions
    images[0].classList.add('left');
    images[1].classList.add('center');
    images[2].classList.add('right');

    // Auto-rotate every 3 seconds
    setInterval(rotateCarousel, 3000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize carousel
    initCarousel();
    // Render project cards
    const container = document.getElementById("card-container");
    if (container && typeof cardsData !== 'undefined') {
        cardsData.forEach(card => {
            const div = document.createElement("div");
            div.className = "web-card";
            div.innerHTML = `
                <a href="${card.url}" target="_blank" class="card-link">
                    <span class="card-number">${card.number}</span>
                    <div class="card-icon">
                        <img src="${card.image}" alt="${card.title}">
                    </div>
                    <h3>${card.title}</h3>
                </a>
            `;
            container.appendChild(div);
        });
    }
    
    // Check if projects is already defined before using it
    if (typeof projects !== 'undefined') {
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <div class="image-container">
                        <div class="image-inner">
                            <div class="image-front">
                                <img src="${project.image}" alt="${project.title}">
                            </div>
                        </div>
                        <span class="category-tag">${project.category}</span>
                    </div>
                    <div class="card-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="card-links">
                            <a href="${project.codeLink}" target="_blank" rel="noopener noreferrer" class="link">
                                <i class="fab fa-github-alt"></i>
                                Code
                            </a>
                            <a href="${project.siteLink}" target="_blank" rel="noopener noreferrer" class="link">
                                <button>View Site</button>
                            </a>
                        </div>
                    </div>
                `;
                projectsContainer.appendChild(projectCard);
            });
        }
    }
});
