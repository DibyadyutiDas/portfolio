const projectCardsData = [
    {
      img: 'leetcode.png',
      tag: 'code',
      title: 'Leetcode',
      desc: 'Optimized DSA solutions with in-depth complexity analysis.',
      codeLink: 'https://github.com',
      viewLink: 'https://leetcode.com/u/Dibyadyuti_Das/',
      buttonText: 'View Site'
    },
    {
      img: 'github.png',
      tag: 'Open Source',
      title: 'GitHub Profile README',
      desc: 'A custom README that highlights key repositories, languages used, and achievements on GitHub.',
      codeLink: 'https://github.com/username',
      viewLink: 'https://github.com/DibyadyutiDas',
      buttonText: 'View Profile'
    },
    {
      img: 'opensource.png',
      tag: 'Open Source',
      title: 'Open Source',
      desc: 'Contributions to open-source projects on GitHub. Includes bug fixes, new feature, and more.',
      codeLink: 'https://github.com/username?tab=repositories',
      viewLink: 'https://github.com/username?tab=repositories',
      buttonText: 'Contributions'
    },
    {
      img: 'bulk-buying.png',
      tag: 'E-Commerce',
      title: 'Bulk-Buying Platform',
      desc: 'A platform where users collaborate to buy in bulk and collectively save more together.',
      codeLink: 'https://github.com/username/bulkybuy-platform',
      viewLink: 'https://bulkybuy-platform.com',
      buttonText: 'View Site'
    },
    {
      img: 'text-handwriting_converter.png',
      tag: 'Machine Learning',
      title: 'Custom Handwriting',
      desc: 'Users can select from different handwriting or even match your unique handwriting.',
      codeLink: 'https://github.com/username/handwriting-converter',
      viewLink: 'https://handwriting-converter.com',
      buttonText: 'View Demo'
    },
    {
      img: 'food-finder.png',
      tag: 'Web App',
      title: 'Food Finder',
      desc: 'A web app that helps users discover pure vegetarian food options in different locations.',
      codeLink: 'https://github.com/dibyadyutidas/FoodFinder',
      viewLink: 'https://your-food-finder-demo.com',
      buttonText: 'View Site'
    }
  ];
  
  const projectCardsContainer = document.getElementById('projectCardsContainer');
  
  projectCardsData.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="image-container">
        <div class="image-inner">
          <div class="image-front">
            <img src="${project.img}" alt="${project.title}">
          </div>
        </div>
        <span class="category-tag">${project.tag}</span>
      </div>
      <div class="card-content">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <div class="card-links">
          <a href="${project.codeLink}" target="_blank" rel="noopener noreferrer" class="link">
            <i class="fab fa-github-alt"></i>
            Code
          </a>
          <a href="${project.viewLink}" target="_blank" rel="noopener noreferrer" class="link">
            <button>${project.buttonText}</button>
          </a>
        </div>
      </div>
    `;
    projectCardsContainer.appendChild(card);
  });
  