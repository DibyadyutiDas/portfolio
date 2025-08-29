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
                '██████',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '  ██  ',
                '  ██  ',
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
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.convertElements());
        } else {
            this.convertElements();
        }
    }
    
    convertElements() {
        const elements = document.querySelectorAll('.nothing-font');
        console.log('Converting nothing-font elements:', elements.length);
        
        elements.forEach((element, index) => {
            const originalText = element.textContent.trim();
            console.log(`Converting element ${index}: "${originalText}"`);
            
            if (originalText) {
                this.convertToMatrix(element, originalText);
            }
        });
    }
    
    convertToMatrix(element, text) {
        const upperText = text.toUpperCase();
        console.log('Converting to matrix:', upperText);
        
        // Store original text for accessibility
        const originalTextSpan = document.createElement('span');
        originalTextSpan.className = 'sr-only';
        originalTextSpan.textContent = text;
        
        // Create container for the dot matrix
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'dot-matrix';
        matrixContainer.setAttribute('aria-hidden', 'true');
        
        // Create 7 rows for the dot matrix
        for (let row = 0; row < 7; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'dot-row';
            
            // Process each character in the text
            for (let charIndex = 0; charIndex < upperText.length; charIndex++) {
                const char = upperText[charIndex];
                const pattern = this.dotPatterns[char] || this.dotPatterns[' '];
                
                if (pattern && pattern[row]) {
                    const rowPattern = pattern[row];
                    
                    // Create a letter container for this character
                    const letterElement = document.createElement('span');
                    letterElement.className = 'letter';
                    
                    // Create dots for this character's row
                    for (let dotIndex = 0; dotIndex < rowPattern.length; dotIndex++) {
                        const dot = document.createElement('span');
                        const isFilled = rowPattern[dotIndex] === '█';
                        dot.className = isFilled ? 'dot filled' : 'dot empty';
                        
                        // Add staggered animation delay
                        const delay = (charIndex * 30) + (row * 5) + (dotIndex * 2);
                        dot.style.animationDelay = `${delay}ms`;
                        
                        letterElement.appendChild(dot);
                    }
                    
                    rowElement.appendChild(letterElement);
                }
            }
            
            matrixContainer.appendChild(rowElement);
        }
        
        // Replace element content
        element.innerHTML = '';
        element.appendChild(originalTextSpan);
        element.appendChild(matrixContainer);
        
        // Set aria-label for accessibility
        element.setAttribute('aria-label', text);
        
        console.log('Matrix conversion complete for:', text);
    }
    
    // Method to update text dynamically
    updateText(element, newText) {
        this.convertToMatrix(element, newText);
    }
}

// Initialize the nothing font system
let nothingFontInstance = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Nothing Font...');
    nothingFontInstance = new NothingFont();
});

// Fallback initialization
window.addEventListener('load', () => {
    if (!nothingFontInstance) {
        console.log('Fallback: Initializing Nothing Font on window load');
        nothingFontInstance = new NothingFont();
    }
});

// Export for global access
window.NothingFont = NothingFont;
window.nothingFont = nothingFontInstance;

// Manual initialization function
window.initNothingFont = function() {
    console.log('Manual Nothing Font initialization');
    nothingFontInstance = new NothingFont();
    return nothingFontInstance;
};