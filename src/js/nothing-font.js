// Nothing Font - Dot Matrix Generator
class NothingFont {
    constructor() {
        // 5 vertical (columns), 7 horizontal (rows), 7th row is always empty for spacing
        this.dotPatterns = {
            'A': [
            '  █  ',
            ' █ █ ',
            '█   █',
            '█   █',
            '█████',
            '█   █',
            '█   █'
            ],
            'B': [
            '████ ',
            '█   █',
            '█   █',
            '████ ',
            '█   █',
            '█   █',
            '████ '
            ],
            'C': [
            ' ███ ',
            '█   █',
            '█    ',
            '█    ',
            '█    ',
            '█   █',
            ' ███ '
            ],
            'D': [
            '████ ',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '████ '
            ],
            'E': [
            '█████',
            '█    ',
            '█    ',
            '████ ',
            '█    ',
            '█    ',
            '█████'
            ],
            'F': [
            '█████',
            '█    ',
            '█    ',
            '████ ',
            '█    ',
            '█    ',
            '█    '
            ],
            'G': [
            ' ███ ',
            '█   █',
            '█    ',
            '█  ██',
            '█   █',
            '█   █',
            ' ███ '
            ],
            'H': [
            '█   █',
            '█   █',
            '█   █',
            '█████',
            '█   █',
            '█   █',
            '█   █'
            ],
            'I': [
            '█████',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '█████'
            ],
            'J': [
            ' ████',
            '   █ ',
            '   █ ',
            '   █ ',
            '   █ ',
            '█  █ ',
            ' ██  '
            ],
            'K': [
            '█   █',
            '█  █ ',
            '█ █  ',
            '██   ',
            '█ █  ',
            '█  █ ',
            '█   █'
            ],
            'L': [
            '█    ',
            '█    ',
            '█    ',
            '█    ',
            '█    ',
            '█    ',
            '█████'
            ],
            'M': [
            '█   █',
            '██ ██',
            '█ █ █',
            '█ █ █',
            '█   █',
            '█   █',
            '█   █'
            ],
            'N': [
            '█   █',
            '█   █',
            '██  █',
            '█ █ █',
            '█  ██',
            '█   █',
            '█   █'
            ],
            'O': [
            ' ███ ',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            ' ███ '
            ],
            'P': [
            '████ ',
            '█   █',
            '█   █',
            '████ ',
            '█    ',
            '█    ',
            '█    '
            ],
            'Q': [
            ' ███ ',
            '█   █',
            '█   █',
            '█   █',
            '█ █ █',
            '█  █ ',
            ' ██ █'
            ],
            'R': [
            '████ ',
            '█   █',
            '█   █',
            '████ ',
            '█ █  ',
            '█  █ ',
            '█   █'
            ],
            'S': [
            ' ███ ',
            '█   █',
            '█    ',
            ' ███ ',
            '    █',
            '█   █',
            ' ███ '
            ],
            'T': [
            '█████',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  '
            ],
            'U': [
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            ' ███ '
            ],
            'V': [
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            '█   █',
            ' █ █ ',
            '  █  '
            ],
            'W': [
            '█   █',
            '█   █',
            '█   █',
            '█ █ █',
            '█ █ █',
            '██ ██',
            '█   █'
            ],
            'X': [
            '█   █',
            '█   █',
            ' █ █ ',
            '  █  ',
            ' █ █ ',
            '█   █',
            '█   █'
            ],
            'Y': [
            '█   █',
            '█   █',
            ' █ █ ',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  '
            ],
            'Z': [
            '█████',
            '    █',
            '   █ ',
            '  █  ',
            ' █   ',
            '█    ',
            '█████'
            ],
            ' ': [
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '     '
            ],
            '0': [
            ' ███ ',
            '█  ██',
            '█ █ █',
            '█ █ █',
            '█ █ █',
            '██  █',
            ' ███ '
            ],
            '1': [
            '  █  ',
            ' ██  ',
            '█ █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '█████'
            ],
            '2': [
            ' ███ ',
            '█   █',
            '█   █',
            '   █ ',
            '  █  ',
            ' █   ',
            '█████'
            ],
            '3': [
            ' ███ ',
            '█   █',
            '█   █',
            '   ██',
            '    █',
            '█   █',
            ' ███ '
            ],
            '4': [
            '   ██',
            '  █ █',
            ' █  █',
            '█████',
            '    █',
            '    █',
            '    █'
            ],
            '5': [
            '█████',
            '█    ',
            '█    ',
            ' ███ ',
            '    █',
            '█   █',
            ' ███ '
            ],
            '6': [
            ' ███ ',
            '█    ',
            '█    ',
            '████ ',
            '█   █',
            '█   █',
            ' ███ '
            ],
            '7': [
            '█████',
            '    █',
            '   █ ',
            '  █  ',
            ' █   ',
            '█    ',
            '     '
            ],
            '8': [
            ' ███ ',
            '█   █',
            '█   █',
            ' ███ ',
            '█   █',
            '█   █',
            ' ███ '
            ],
            '9': [
            ' ███ ',
            '█   █',
            '█   █',
            ' ████',
            '    █',
            '    █',
            ' ███ '
            ],
            '?': [
            ' ███ ',
            '█   █',
            '   █ ',
            '  █  ',
            '  █  ',
            '     ',
            '  █  '
            ],
            '!': [
            '     ',
            '  █  ',
            '  █  ',
            '  █  ',
            '  █  ',
            '     ',
            '  █  '
            ],
            '.': [
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '  █  '
            ],
            ',': [
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '  █  ',
            ' █   '
            ],
            ':': [
            '     ',
            '     ',
            '  █  ',
            '     ',
            '  █  ',
            '     ',
            '     '
            ],
            ';': [
            '     ',
            '  █  ',
            '     ',
            '     ',
            '  █  ',
            ' █   ',
            '     '
            ],
            '-': [
            '     ',
            '     ',
            '     ',
            '█████',
            '     ',
            '     ',
            '     '
            ],
            '_': [
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '     ',
            '█████'
            ],
            '(': [
            '   █ ',
            '  █  ',
            ' █   ',
            ' █   ',
            ' █   ',
            '  █  ',
            '   █ '
            ],
            ')': [
            ' █   ',
            '  █  ',
            '   █ ',
            '   █ ',
            '   █ ',
            '  █  ',
            ' █   '
            ]
        };
        
        this.isInitialized = false;
        this.processedElements = new Set();
    }
    
    init() {
        if (this.isInitialized) return;

        console.log('Initializing Nothing Font...');

        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processElements());
        } else {
            this.processElements();
        }

        // Add resize listener to re-render on viewport changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('Viewport resized, re-rendering Nothing Font...');
                this.reinitialize();
            }, 300);
        });

        this.isInitialized = true;
    }
    
    processElements() {
        // Find all elements with nothing-font class
        const elements = document.querySelectorAll('.nothing-font');
        console.log('Found nothing-font elements:', elements.length);
        
        elements.forEach((element, index) => {
            // Skip if already processed
            if (this.processedElements.has(element)) {
                console.log(`Element ${index} already processed, skipping`);
                return;
            }
            
            const originalText = element.textContent.trim();
            console.log(`Converting element ${index}: "${originalText}"`);
            
            if (originalText) {
                this.convertToMatrix(element, originalText);
                this.processedElements.add(element);
            }
        });
    }
    
    convertToMatrix(element, text) {
        const upperText = text.toUpperCase();
        console.log('Converting text to matrix:', upperText);

        // Store original text for accessibility
        const originalTextSpan = document.createElement('span');
        originalTextSpan.className = 'original-text';
        originalTextSpan.textContent = text;
        originalTextSpan.setAttribute('aria-hidden', 'true');

        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column';
        mainContainer.style.gap = '10px';
        mainContainer.style.alignItems = 'center';

        // Split text into words and handle wrapping
        const words = upperText.split(' ');

        // Calculate maximum characters per line based on viewport width
        let maxCharsPerLine;
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 360) {
            maxCharsPerLine = 8;  // Extra small screens
        } else if (viewportWidth <= 480) {
            maxCharsPerLine = 10; // Mobile phones
        } else if (viewportWidth <= 768) {
            maxCharsPerLine = 15; // Tablets
        } else if (viewportWidth <= 1024) {
            maxCharsPerLine = 18; // Small laptops
        } else {
            maxCharsPerLine = 20; // Desktop and larger
        }

        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine ? currentLine + ' ' + word : word;

            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        // Create a matrix for each line
        lines.forEach((line, lineIndex) => {
            const matrixContainer = document.createElement('div');
            matrixContainer.className = 'dot-matrix';
            matrixContainer.setAttribute('aria-label', line);

            // Create 7 rows (height of each character)
            for (let row = 0; row < 7; row++) {
                const rowElement = document.createElement('div');
                rowElement.className = 'dot-row';

                // Process each character
                for (let charIndex = 0; charIndex < line.length; charIndex++) {
                    const char = line[charIndex];
                    const pattern = this.dotPatterns[char] || this.dotPatterns[' '];
                    const rowPattern = pattern[row];

                    // Create dots for this character's row
                    for (let dotIndex = 0; dotIndex < rowPattern.length; dotIndex++) {
                        const dot = document.createElement('span');
                        dot.className = rowPattern[dotIndex] === '█' ? 'dot' : 'dot empty';

                        rowElement.appendChild(dot);
                    }

                    // Add space between characters (except last one)
                    if (charIndex < line.length - 1) {
                        for (let i = 0; i < 2; i++) {
                            const spaceDot = document.createElement('span');
                            spaceDot.className = 'dot empty';
                            rowElement.appendChild(spaceDot);
                        }
                    }
                }

                matrixContainer.appendChild(rowElement);
            }

            mainContainer.appendChild(matrixContainer);
        });

        // Clear element and add new content
        element.innerHTML = '';
        element.appendChild(originalTextSpan);
        element.appendChild(mainContainer);

        console.log('Matrix conversion completed for:', text);
    }
    
    // Method to update text dynamically
    updateText(element, newText) {
        // Remove from processed set to allow re-processing
        this.processedElements.delete(element);
        
        // Set new text content
        element.textContent = newText;
        
        // Convert to matrix
        this.convertToMatrix(element, newText);
        
        // Add back to processed set
        this.processedElements.add(element);
    }
    
    // Method to reinitialize all elements
    reinitialize() {
        this.processedElements.clear();
        this.processElements();
    }
}

// Initialize when DOM is ready
function initializeNothingFont() {
    console.log('Initializing Nothing Font...');
    
    if (!window.nothingFont) {
        window.nothingFont = new NothingFont();
    }
    
    window.nothingFont.init();
    
    // Force process elements after a short delay
    setTimeout(() => {
        if (window.nothingFont) {
            window.nothingFont.processElements();
        }
    }, 500);
}

// Multiple initialization strategies to ensure it works
setTimeout(() => {
    document.addEventListener('DOMContentLoaded', initializeNothingFont);
    
    // Fallback for when DOMContentLoaded has already fired
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNothingFont);
    } else {
        // DOM is already ready
        setTimeout(initializeNothingFont, 100);
    }
    
    // Additional fallback on window load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!window.nothingFont || !window.nothingFont.isInitialized) {
                console.log('Fallback: Initializing Nothing Font on window load');
                initializeNothingFont();
            }
        }, 200);
    });
}, 100);

// Export for external use
window.NothingFont = NothingFont;

// Manual trigger function for debugging
window.initNothingFont = initializeNothingFont;

// Force re-initialization function
window.reinitNothingFont = function() {
    console.log('Force reinitializing Nothing Font...');
    if (window.nothingFont) {
        window.nothingFont.reinitialize();
    } else {
        initializeNothingFont();
    }
};

// Auto-retry mechanism
let retryCount = 0;
const maxRetries = 3;

function retryInitialization() {
    if (retryCount >= maxRetries) return;
    
    setTimeout(() => {
        const nothingFontElements = document.querySelectorAll('.nothing-font');
        const hasMatrixContent = Array.from(nothingFontElements).some(el => 
            el.querySelector('.dot-matrix')
        );
        
        if (nothingFontElements.length > 0 && !hasMatrixContent) {
            console.log(`Retry ${retryCount + 1}: Nothing Font elements found but not converted`);
            initializeNothingFont();
            retryCount++;
            retryInitialization();
        }
    }, 1000 * (retryCount + 1));
}

// Start retry mechanism
retryInitialization();