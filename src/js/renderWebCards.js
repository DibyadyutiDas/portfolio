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

    webCardsData.forEach(card => {
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
      webCardsContainer.appendChild(cardDiv);
    });

    // Reset scroll position to start from the first card
    setTimeout(() => {
      webCardsContainer.scrollLeft = 0;
    }, 100);

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
