class PrecisionClock {
    constructor() {
        this.digitalTimeElement = document.getElementById('digital-time');
        this.digitalDateElement = document.getElementById('digital-date');
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        this.secondHand = document.getElementById('second-hand');
        this.clockNumbersContainer = document.getElementById('clock-numbers');

        if (!this.digitalTimeElement || !this.digitalDateElement || !this.clockNumbersContainer) return;

        this.dimensions = this.getClockDimensions();
        this.init();
    }

    init() {
        this.createClockNumbers();
        this.updateClock();
        this.startClock();
    }

    getClockDimensions() {
        const clockContainer = document.querySelector('.clock-container');
        const containerWidth = clockContainer ? (clockContainer.offsetWidth || 300) : 300;
        const radius = containerWidth / 2;

        return {
            radius: radius,
            numberRadius: radius * 0.78,
            hourHandLength: radius * 0.48,
            minuteHandLength: radius * 0.68,
            secondHandLength: radius * 0.78
        };
    }

    createClockNumbers() {
        const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.clockNumbersContainer.innerHTML = '';

        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.className = 'clock-number';
            numberElement.textContent = number;

            const position = this.getNumberPosition(number, this.dimensions.numberRadius);
            numberElement.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;

            this.clockNumbersContainer.appendChild(numberElement);
        });
    }

    getNumberPosition(number, radius) {
        const angle = ((number === 12 ? 0 : number) * 30 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { x, y };
    }

    getTimeAngles(time) {
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();

        return {
            hourAngle: (hours * 30) + (minutes * 0.5),
            minuteAngle: minutes * 6 + (seconds * 0.1),
            secondAngle: seconds * 6 + (milliseconds * 0.006)
        };
    }

    formatTime(time) {
        return time.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(time) {
        return time.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    updateClock() {
        const now = new Date();
        const angles = this.getTimeAngles(now);

        this.digitalTimeElement.textContent = this.formatTime(now);
        this.digitalDateElement.textContent = this.formatDate(now);

        this.hourHand.style.height = `${this.dimensions.hourHandLength}px`;
        this.hourHand.style.transform = `translate(-50%, -100%) rotate(${angles.hourAngle}deg)`;

        this.minuteHand.style.height = `${this.dimensions.minuteHandLength}px`;
        this.minuteHand.style.transform = `translate(-50%, -100%) rotate(${angles.minuteAngle}deg)`;

        this.secondHand.style.height = `${this.dimensions.secondHandLength}px`;
        this.secondHand.style.transform = `translate(-50%, -100%) rotate(${angles.secondAngle}deg)`;
    }

    startClock() {
        this.updateClock();
        this.interval = setInterval(() => this.updateClock(), 16); // ~60 FPS for smooth seconds
    }

    handleResize() {
        this.dimensions = this.getClockDimensions();
        this.createClockNumbers();
        this.updateClock();
    }

    stopClock() {
        clearInterval(this.interval);
    }
}

let clock;

document.addEventListener('DOMContentLoaded', () => {
    clock = new PrecisionClock();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            clock.handleResize();
        }, 250);
    });
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && clock) {
        clock.updateClock();
    }
});