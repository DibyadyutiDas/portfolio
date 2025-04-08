        // Custom cursor animation
        const cursor = document.querySelector('.custom-cursor');
        // const cursorText = document.querySelector('.cursor-text');
        let cursorVisible = false;

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorVisible = false;
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .web-card, .nav-links a, .social-icons a');
        
        interactiveElements.forEach(element => {
            element.classList.add('hover-trigger');
            
            element.addEventListener('mouseenter', (e) => {
                cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1.5)`;
                cursorText.style.transform = `translate(${e.clientX + 15}px, ${e.clientY - 15}px)`;
                cursorText.classList.add('visible');
            });

            element.addEventListener('mouseleave', (e) => {
                cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(1)`;
                cursorText.classList.remove('visible');
            });
        });

        // Navigation and Menu Toggle Logic
        const nav = document.getElementById('mainNav');
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const hero = document.querySelector('.hero');

        // Scroll Logic
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const heroBottom = hero.offsetTop + hero.offsetHeight;

            // Hide navbar and show menu toggle after hero section
            if (scrollPos > heroBottom - 100) {
                nav.classList.add('hidden');
                menuToggle.classList.add('visible');
            } else {
                nav.classList.remove('hidden');
                menuToggle.classList.remove('visible');
                mobileMenu.classList.remove('active');
            }

            // Card animations on scroll
            document.querySelectorAll('.card').forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (cardTop < windowHeight * 0.8) {
                    card.classList.add('visible');
                }
            });
        });

        // Menu Toggle
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });

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

        
        AOS.init();

        function toggleMenu() {
            document.querySelector('.nav-right').classList.toggle('active');
        }

        function toggleTheme() {
            document.body.classList.toggle('dark');
            document.querySelector('nav').classList.toggle('dark');
            document.querySelector('footer').classList.toggle('dark');

            const themeIcon = document.querySelector('.theme-toggle i');
            if (document.body.classList.contains('dark')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }

// website

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.web-card');
    
    let currentIndex = 0;
    const cardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    
    
    function scrollToIndex(index) {
        const cardWidth = cardContainer.offsetWidth / cardsPerView;
        cardContainer.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex(currentIndex);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            scrollToIndex(currentIndex);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
        if (newCardsPerView !== cardsPerView) {
            currentIndex = 0;
            scrollToIndex(0);
            updateButtonVisibility();
        }
    });
    
    // Initial setup
    updateButtonVisibility();
});












const images = document.querySelectorAll('.carousel img');
        let index = 1;

        function rotateImages() {
            images.forEach(img => img.className = '');
            images[(index - 1 + images.length) % images.length].classList.add('left');
            images[index].classList.add('center');
            images[(index + 1) % images.length].classList.add('right');
            index = (index + 1) % images.length;
        }

        setInterval(rotateImages, 3000);





// Drag to scroll

const scrollContainer = document.querySelector('.card-container');
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  scrollContainer.classList.add('dragging');
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener('mouseleave', () => {
  isDown = false;
  scrollContainer.classList.remove('dragging');
});

scrollContainer.addEventListener('mouseup', () => {
  isDown = false;
  scrollContainer.classList.remove('dragging');
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2;
  scrollContainer.scrollLeft = scrollLeft - walk;
});







document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("card-container");
  
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
  });


