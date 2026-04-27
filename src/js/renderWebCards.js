async function loadWebCards() {
  try {
    const response = await fetch('src/data/webCards.json');
    const webCardsData = await response.json();

    const container = document.getElementById('card-container');
    if (!container) {
      console.error("Container with ID 'card-container' not found.");
      return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create cards — single set, manually scrollable
    webCardsData.forEach((card) => {
      const cardDiv = document.createElement('a');
      cardDiv.className = 'web-card';
      cardDiv.href = card.url;
      cardDiv.target = '_blank';
      cardDiv.rel = 'noopener noreferrer';
      cardDiv.innerHTML = `
        <img class="card-image" src="${card.image}" alt="${card.title}" />
        <div class="card-content">
          <span class="card-number">${card.number}</span>
          <h3>${card.title}</h3>
        </div>
      `;
      container.appendChild(cardDiv);
    });

    // Setup dots if container exists
    const dotsContainer = document.getElementById('card-dots');
    if (dotsContainer && webCardsData.length > 0) {
      dotsContainer.innerHTML = '';
      webCardsData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        
        // Make dots clickable
        dot.addEventListener('click', () => {
          const cards = Array.from(container.children);
          if (cards[index]) {
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
        dotsContainer.appendChild(dot);
      });

      // Update active dot on scroll
      container.addEventListener('scroll', () => {
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;
        let activeIndex = 0;
        let minDistance = Infinity;

        Array.from(container.children).forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(containerCenter - cardCenter);
          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = index;
          }
        });

        Array.from(dotsContainer.children).forEach((dot, index) => {
          if (index === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      });
    }  } catch (error) {
    console.error("Error loading web cards:", error);
  }
}

// Call the function on DOM load
document.addEventListener("DOMContentLoaded", loadWebCards);

// Also try to call it immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  // Document still loading, DOMContentLoaded will handle it
} else {
  // Document already loaded, call immediately
  loadWebCards();
}
