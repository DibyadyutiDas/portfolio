function createBarcodeSvg() {
  const pattern = [
    2,1,1,3, 1,2,3,1, 2,1,1,4, 1,3,2,1, 3,1,1,2, 1,4,2,1,
    2,3,1,1, 1,2,4,1, 3,1,2,1, 1,3,1,2, 4,1,1,2, 2,1,3,1,
    1,4,2,1, 2,3,1,2, 1,1,4,2, 3,1,2,1, 1,2,1,3, 4,2,1,1,
    2,1,3,2, 1,4,1,1, 3,2,1,2, 1,1,3,4, 2,3,1,1, 1,2,1,4
  ];
  let x = 4;
  let rects = '';
  pattern.forEach((width, index) => {
    if (index % 2 === 0) {
      rects += `<rect x="${x}" y="0" width="${width}" height="32" fill="currentColor"/>`;
    }
    x += width;
  });
  return `<svg viewBox="0 0 ${x + 4} 32" class="card-barcode-lines" preserveAspectRatio="none">${rects}</svg>`;
}

function getDisplayUrl(card) {
  if (card.url && card.url !== 'https://') {
    return card.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
  return `${card.title.toLowerCase()}.dibyadyuti.me`;
}

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
      const hasValidUrl = card.url && card.url !== 'https://';
      cardDiv.href = hasValidUrl ? card.url : '#';
      if (hasValidUrl) {
        cardDiv.target = '_blank';
        cardDiv.rel = 'noopener noreferrer';
      } else {
        cardDiv.addEventListener('click', (e) => e.preventDefault());
      }

      const targetUrl = hasValidUrl ? card.url : 'https://dibyadyuti.me';
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(targetUrl)}`;
      const displayUrl = getDisplayUrl(card);

      cardDiv.innerHTML = `
        <div class="card-top-bar">
          <span class="card-number">NO. ${card.number}</span>
          <div class="card-qr-box" title="Scan QR Code to visit ${card.title}">
            <img class="card-qr-img" src="${qrApiUrl}" alt="QR" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
            <svg class="card-qr-fallback" viewBox="0 0 24 24" style="display:none;" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v2h-2v-2zm4 4h4v2h-4v-2zm-4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-2h2v4h-2v-4zm6-6h2v2h-2V8zm-2 2h2v2h-2v-2zm0-4h2v2h-2V6zm-2 2h2v2h-2V8z"/>
            </svg>
          </div>
        </div>

        <div class="card-main">
          <img class="card-image" src="${card.image}" alt="${card.title}" />
          <div class="card-content">
            <h3>${card.title}</h3>
          </div>
        </div>

        <div class="card-barcode-box">
          <div class="barcode-lines-wrapper">
            ${createBarcodeSvg()}
          </div>
          <div class="barcode-url-text">${displayUrl}</div>
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

function updatePhoneTime() {
  const timeEl = document.querySelector('.phone-time');
  if (timeEl) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }
}

// Call the function on DOM load
document.addEventListener("DOMContentLoaded", () => {
  loadWebCards();
  updatePhoneTime();
  setInterval(updatePhoneTime, 30000);
});

// Also try to call it immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  // Document still loading, DOMContentLoaded will handle it
} else {
  // Document already loaded, call immediately
  loadWebCards();
  updatePhoneTime();
}
