const webCardsData = [
  {
    number: '001',
    icon: '🙂',
    title: 'Portfolio Website',
    description: 'Showcase your projects and skills in a visually appealing way.'
  },
  {
    number: '002',
    icon: '🏋️',
    title: 'Calisthenics Website',
    description: 'Welcome to Calisthenics: Elevate Your Strength Naturally.'
  },
  {
    number: '003',
    icon: '📷',
    title: 'PhotoEdit Website',
    description: 'Make your photos shine with our expert editing services.'
  },
  {
    number: '004',
    icon: '🎵',
    title: 'Music Website',
    description: 'Feel the vibe of music.'
  },
  {
    number: '005',
    icon: '💻',
    title: 'Code Website',
    description: 'Share your thoughts and ideas with the world.'
  }
];

const webCardsContainer = document.getElementById('webCardsContainer');

webCardsData.forEach(card => {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'web-card';
  cardDiv.innerHTML = `
    <span class="card-number">${card.number}</span>
    <div class="card-icon">${card.icon}</div>
    <h3>${card.title}</h3>
    <p>${card.description}</p>
  `;
  webCardsContainer.appendChild(cardDiv);
});
