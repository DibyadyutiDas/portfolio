// Nothing Font - Dot Matrix Generator
class NothingFont {
    constructor() {
        this.dotPatterns = {
            'A': [
                '  ██  ',
                ' █  █ ',
                '█    █',
                '██████',
                '█    █',
                '█    █',
                '      '
            ],
            'B': [
                '█████ ',
                '█    █',
                '█████ ',
                '█    █',
                '█████ ',
                '      '
            ],
            'C': [
                ' █████',
                '█     ',
                '█     ',
                '█     ',
                '█     ',
                ' █████',
                '      '
            ],
            'D': [
                '█████ ',
                '█    █',
                '█    █',
                '█    █',
                '█    █',
                '█████ ',
                '      '
            ],
            'E': [
                '██████',
                '█     ',
                '█████ ',
                '█     ',
                '██████',
                '      '
            ],
            'F': [
                '██████',
                '█     ',
                '█████ ',
                '█     ',
                '█     ',
                '      '
            ],
            'G': [
                ' █████',
                '█     ',
                '█  ███',
                '█    █',
                '█    █',
                ' █████',
                '      '
            ],
            'H': [
                '█    █',
                '█    █',
                '██████',
                '█    █',
                '█    █',
                '      '
            ],
            'I': [
                '██████',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '██████',
                '      '
            ],
            'J': [
                '██████',
                '    █ ',
                '    █ ',
                '    █ ',
                '█   █ ',
                ' ███  ',
                '      '
            ],
            'K': [
                '█   █ ',
                '█  █  ',
                '███   ',
                '███   ',
                '█  █  ',
                '█   █ ',
                '      '
            ],
            'L': [
                '█     ',
                '█     ',
                '█     ',
                '█     ',
                '█     ',
                '██████',
                '      '
            ],
            'M': [
                '█    █',
                '██  ██',
                '█ ██ █',
                '█    █',
                '█    █',
                '█    █',
                '      '
            ],
            'N': [
                '█    █',
                '██   █',
                '█ █  █',
                '█  █ █',
                '█   ██',
                '█    █',
                '      '
            ],
            'O': [
                ' ████ ',
                '█    █',
                '█    █',
                '█    █',
                '█    █',
                ' ████ ',
                '      '
            ],
            'P': [
                '█████ ',
                '█    █',
                '█████ ',
                '█     ',
                '█     ',
                '█     ',
                '      '
            ],
            'Q': [
                ' ████ ',
                '█    █',
                '█    █',
                '█  █ █',
                '█   █ ',
                ' ███ █',
                '      '
            ],
            'R': [
                '█████ ',
                '█    █',
                '█████ ',
                '█  █  ',
                '█   █ ',
                '█    █',
                '      '
            ],
            'S': [
                ' █████',
                '█     ',
                ' ████ ',
                '     █',
                '     █',
                '█████ ',
                '      '
            ],
            'T': [
                '█████ ',
                '  █   ',
                '  █   ',
                '  █   ',
                '  █   ',
                '  █   ',
                '      '
            ],
            'U': [
                '█    █',
                '█    █',
                '█    █',
                '█    █',
                '█    █',
                ' ████ ',
                '      '
            ],
            'V': [
                '█    █',
                '█    █',
                '█    █',
                ' █  █ ',
                '  ██  ',
                '  ██  ',
                '      '
            ],
            'W': [
                '█    █',
                '█    █',
                '█    █',
                '█ ██ █',
                '██  ██',
                '█    █',
                '      '
            ],
            'X': [
                '█    █',
                ' █  █ ',
                '  ██  ',
                ' █  █ ',
                '█    █',
                '      '
            ],
            'Y': [
                '█   █ ',
                ' █ █  ',
                '  █   ',
                '  █   ',
                '  █   ',
                '  █   ',
                '      '
            ],
            'Z': [
                '██████',
                '    █ ',
                '   █  ',
                '  █   ',
                ' █    ',
                '██████',
                '      '
            ],
            ' ': [
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '      '
            ],
            '?': [
                ' ████ ',
                '█    █',
                '   ██ ',
                '  ██  ',
                '  ██  ',
                '      ',
                '  ██  '
            ],
            '!': [
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '      ',
                '  ██  '
            ],
            '.': [
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '  ██  '
            ],
            ',': [
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '  ██  ',
                ' ██   '
            ],
            ':': [
                '      ',
                '  ██  ',
                '  ██  ',
                '      ',
                '  ██  ',
                '  ██  ',
                '      '
            ]
        };
        
        this.init();
    }
    
    init() {
        // Find all elements with nothing-font class
        const elements = document.querySelectorAll('.nothing-font');
        console.log('Found nothing-font elements:', elements.length);
        console.log('Elements found:', elements);
        elements.forEach((element, index) => {
            console.log(`Converting element ${index}:`, element.textContent);
            this.convertToMatrix(element);
        });
    }
    
    convertToMatrix(element) {
        const text = element.textContent.toUpperCase();
        console.log('Converting text:', text);
        
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'dot-matrix';
        
        // Create 7 rows (height of each character)
        for (let row = 0; row < 7; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'dot-row';
            
            // Process each character
            for (let charIndex = 0; charIndex < text.length; charIndex++) {
                const char = text[charIndex];
                const pattern = this.dotPatterns[char] || this.dotPatterns[' '];
                const rowPattern = pattern[row];
                
                // Create dots for this character's row
                for (let dotIndex = 0; dotIndex < rowPattern.length; dotIndex++) {
                    const dot = document.createElement('span');
                    dot.className = rowPattern[dotIndex] === '█' ? 'dot' : 'dot empty';
                    
                    // Add animation delay for cool effect
                    dot.style.animationDelay = `${(charIndex * 50) + (row * 10) + (dotIndex * 2)}ms`;
                    
                    rowElement.appendChild(dot);
                }
                
                // Add space between characters (except last one)
                if (charIndex < text.length - 1) {
                    const spaceDot = document.createElement('span');
                    spaceDot.className = 'dot empty';
                    rowElement.appendChild(spaceDot);
                }
            }
            
            matrixContainer.appendChild(rowElement);
        }
        
        // Hide original text and show matrix
        console.log('Before:', element.innerHTML);
        element.innerHTML = '';
        element.appendChild(matrixContainer);
        console.log('After:', element.innerHTML);
    }
    
    // Method to update text dynamically
    updateText(element, newText) {
        element.textContent = newText;
        this.convertToMatrix(element);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Nothing Font script loaded');
    
    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        window.nothingFont = new NothingFont();
        console.log('Nothing Font initialized');
    }, 100);
});

// Also initialize on window load as a fallback
window.addEventListener('load', () => {
    if (!window.nothingFont) {
        console.log('Fallback: Nothing Font initialization on window load');
        window.nothingFont = new NothingFont();
    }
});

// Export for external use
window.NothingFont = NothingFont;

// Manual trigger function for testing
window.initNothingFont = function() {
    console.log('Manual nothing font initialization');
    window.nothingFont = new NothingFont();
};