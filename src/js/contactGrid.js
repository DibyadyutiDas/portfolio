document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('contact-grid-container');
    const contactSection = document.getElementById('contact');
    
    if (!container || !contactSection) return;

    let gridSize = window.innerWidth <= 768 ? 40 : 60; // Must match CSS background-size
    const activeSquares = new Set();
    const maxSquares = window.innerWidth <= 768 ? 5 : 12; // Max number of blinking squares at once

    function createSquare() {
        // Calculate grid dimensions
        const rect = contactSection.getBoundingClientRect();
        const cols = Math.floor(rect.width / gridSize);
        const rows = Math.floor(rect.height / gridSize);

        if (cols <= 0 || rows <= 0) return;

        // Pick a random grid cell
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        const positionKey = `${col}-${row}`;

        // Don't create if already active at this position
        if (activeSquares.has(positionKey)) return;

        const square = document.createElement('div');
        square.className = 'blinking-square';
        square.style.left = `${col * gridSize + 1}px`;
        square.style.top = `${row * gridSize + 1}px`;
        
        container.appendChild(square);
        activeSquares.add(positionKey);

        // Fade in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                square.classList.add('active');
            });
        });

        // Remove after random duration
        const duration = 2000 + Math.random() * 4000; // 2s to 6s
        setTimeout(() => {
            square.classList.remove('active');
            
            // Wait for fade out transition (1.5s) before removing from DOM
            setTimeout(() => {
                if (container.contains(square)) {
                    container.removeChild(square);
                }
                activeSquares.delete(positionKey);
            }, 1500);
        }, duration);
    }

    // Continuously spawn squares
    function spawnSquares() {
        if (activeSquares.size < maxSquares && Math.random() > 0.3) {
            createSquare();
        }
        setTimeout(spawnSquares, 500 + Math.random() * 1000); // Check every 0.5s to 1.5s
    }

    // Handle resize
    window.addEventListener('resize', () => {
        container.innerHTML = '';
        activeSquares.clear();
        gridSize = window.innerWidth <= 768 ? 40 : 60;
    });

    // Start spawning
    setTimeout(spawnSquares, 1000);
});
