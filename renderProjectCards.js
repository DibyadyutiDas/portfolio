// renderProjectCards.js

// Array of project data
const projects = [
  {
      title: "Leetcode",
      description: "Optimized DSA solutions with in-depth complexity analysis.",
      image: "photo/leetcode.png",
      category: "code",
      codeLink: "https://github.com",
      siteLink: "https://leetcode.com/u/Dibyadyuti_Das/"
  },
  {
      title: "GitHub Profile README",
      description: "A custom README that highlights key repositories, languages used, and achievements on GitHub.",
      image: "photo/github.png",
      category: "Open Source",
      codeLink: "https://github.com/username",
      siteLink: "https://github.com/DibyadyutiDas"
  },
  {
      title: "Open Source",
      description: "Contributions to open-source projects on GitHub. Includes bug fixes, new feature, and more.",
      image: "photo/opensource.png",
      category: "Open Source",
      codeLink: "https://github.com/username?tab=repositories",
      siteLink: "https://github.com/username?tab=repositories"
  },
  {
      title: "Bulk-Buying Platform",
      description: "A platform where users collaborate to buy in bulk and collectively save more together.",
      image: "photo/bulk-buying.png",
      category: "E-Commerce",
      codeLink: "https://github.com/username/bulkybuy-platform",
      siteLink: "https://bulkybuy-platform.com"
  },
  {
      title: "Custom Handwriting",
      description: "Users can select from different handwriting or even match your unique handwriting.",
      image: "photo/text-handwriting_converter.png",
      category: "Machine Learning",
      codeLink: "https://github.com/username/handwriting-converter",
      siteLink: "https://handwriting-converter.com"
  },
  {
      title: "Food Finder",
      description: "A web app that helps users discover pure vegetarian food options in different locations.",
      image: "photo/food-finder.png",
      category: "Web App",
      codeLink: "https://github.com/dibyadyutidas/FoodFinder",
      siteLink: "https://your-food-finder-demo.com"
  }
];

// Function to render project cards
function renderProjectCards() {
  const projectsContainer = document.getElementById('projects-container');

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

// Call the function to render the project cards
document.addEventListener('DOMContentLoaded', renderProjectCards);