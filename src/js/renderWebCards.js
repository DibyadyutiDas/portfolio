async function loadWebCards() {
  try {
    const response = await fetch('src/data/webCards.json');
    const webCardsData = await response.json();

    const webCardsContainer = document.getElementById('card-container');
    if (!webCardsContainer) {
      console.error("Container with ID 'card-container' not found.");
      return;
    }

    // Clear any existing content
    webCardsContainer.innerHTML = '';

    const createCard = (card) => {
      const cardDiv = document.createElement('a');
      cardDiv.className = 'web-card';
      cardDiv.href = card.url;
      cardDiv.target = '_blank';
      cardDiv.innerHTML = `
        <img class="card-image" src="${card.image}" alt="${card.title}" />
        <div class="card-content">
          <span class="card-number">${card.number}</span>
          <h3>${card.title}</h3>
        </div>
      `;
      return cardDiv;
    };

    // Render three sets to enable seamless looping
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 3; i += 1) {
      webCardsData.forEach(card => {
        fragment.appendChild(createCard(card));
      });
    }
    webCardsContainer.appendChild(fragment);

    // Measure the width of a single set (first N cards)
    const measureSingleSetWidth = () => {
      let width = 0;
      for (let i = 0; i < webCardsData.length; i += 1) {
        const el = webCardsContainer.children[i];
        if (!el) break;
        const style = window.getComputedStyle(el);
        width += el.offsetWidth + parseFloat(style.marginLeft || '0') + parseFloat(style.marginRight || '0');
      }
      return width;
    };

    const singleSetWidth = measureSingleSetWidth();

    // Start in the middle set so we can scroll both directions
    webCardsContainer.scrollLeft = singleSetWidth;

    // Keep scrolling infinite by snapping back when reaching the edges
    const handleLoop = () => {
      if (webCardsContainer.scrollLeft >= singleSetWidth * 2) {
        webCardsContainer.scrollLeft -= singleSetWidth;
      } else if (webCardsContainer.scrollLeft <= 0) {
        webCardsContainer.scrollLeft += singleSetWidth;
      }
    };

    webCardsContainer.addEventListener('scroll', handleLoop, { passive: true });

  } catch (error) {
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
