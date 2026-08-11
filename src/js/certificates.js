/**
 * CRED-Style Pure 3D Certificate Showcase (Dibyadyuti Das)
 * Renders pure certificate cards like CRED credit card showcase with dynamic 3D tilt physics.
 */

const certificatesData = [
  {
    id: 'cert-meta-genai',
    title: 'GenAI in Data Analytics',
    issuer: 'Meta & Coursera',
    label: 'META & COURSERA',
    svg: `<svg viewBox="0 0 100 60" fill="currentColor"><path d="M72.7 12.3c-5.8 0-10.9 2.8-14.5 7.4-4-5.2-9.7-8.3-16.1-8.3-11.4 0-20.7 9.3-20.7 20.7 0 6.6 3.1 12.5 8 16.3l.1.1c4.8 3.8 11 6 17.7 6 6.3 0 12.1-2.4 16.5-6.5l.2-.2c3.5 4.1 8.6 6.7 14.3 6.7 10.5 0 19-8.5 19-19s-8.5-19-19-19zm-30.6 32c-7.3 0-13.3-6-13.3-13.3s6-13.3 13.3-13.3 13.3 6 13.3 13.3-6 13.3-13.3 13.3zm30.6 0c-6.2 0-11.3-5.1-11.3-11.3s5.1-11.3 11.3-11.3 11.3 5.1 11.3 11.3-5.1 11.3-11.3 11.3z"/></svg>`,
    image: 'photo/cert1.jpg',
    verificationUrl: 'https://coursera.org/verify/TOFXBHLPQ6GD'
  },
  {
    id: 'cert-github-foundations',
    title: 'GitHub Foundations',
    issuer: 'GitHub',
    label: 'GITHUB',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C22.4 0 0 22.4 0 50c0 22.1 14.3 40.8 34.2 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2-.1-5.2-.1-9.5-13.9 3-16.8-5.9-16.8-5.9-2.3-5.8-5.6-7.3-5.6-7.3-4.5-3.1.3-3 .3-3 5 .4 7.7 5.2 7.7 5.2 4.5 7.6 11.7 5.4 14.6 4.1.5-3.2 1.7-5.4 3.2-6.7-11.1-1.3-22.8-5.6-22.8-24.8 0-5.5 2-10 5.2-13.5-.5-1.3-2.3-6.4.5-13.3 0 0 4.2-1.4 13.8 5.1 4-1.1 8.3-1.7 12.6-1.7s8.6.6 12.6 1.7c9.6-6.6 13.8-5.1 13.8-5.1 2.8 6.9 1 12 .5 13.3 3.3 3.5 5.2 8 5.2 13.5 0 19.3-11.7 23.5-22.9 24.8 1.8 1.6 3.4 4.7 3.4 9.5 0 6.9-.1 12.4-.1 14.1 0 1.3.9 2.9 3.4 2.4C85.7 90.8 100 72.1 100 50 100 22.4 77.6 0 50 0z"/></svg>`,
    image: 'photo/cert2.jpg',
    verificationUrl: 'https://www.credly.com/go/cswaEJT8'
  },
  {
    id: 'cert-mongodb-dba',
    title: 'MongoDB Certified DBA',
    issuer: 'MongoDB, Inc.',
    label: 'MONGODB',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C46.5 15.5 37 28.5 29 41.5c-7.5 12.2-13 26-10 40.5 3.3 16 19.2 24 31 18 11.8 6 27.7-2 31-18 3-14.5-2.5-28.3-10-40.5C63 28.5 53.5 15.5 50 0zm0 15c2.5 12 10.5 22.5 17 33 6.2 10 10.5 21.5 8 33-2.5 11.5-14.5 17.5-25 13.5V15z"/></svg>`,
    image: 'photo/cert3.jpg',
    verificationUrl: 'https://www.linkedin.com/in/dibyadyutidas/'
  },
  {
    id: 'cert-microsoft-cybersecurity',
    title: 'Career Essentials in Cybersecurity',
    issuer: 'Microsoft & LinkedIn',
    label: 'MICROSOFT',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><rect x="5" y="5" width="42" height="42"/><rect x="53" y="5" width="42" height="42"/><rect x="5" y="53" width="42" height="42"/><rect x="53" y="53" width="42" height="42"/></svg>`,
    image: 'photo/cert4.jpg',
    verificationUrl: 'https://www.linkedin.com/in/dibyadyutidas/'
  },
  {
    id: 'cert-google-cloud',
    title: 'Google Cloud Data Engineer',
    issuer: 'Google Cloud',
    label: 'GOOGLE CLOUD',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M68 32c-3.5-11.6-14.3-20-27-20-13.8 0-25.3 9.9-27.7 23C5.7 36.9 0 44.8 0 54c0 11 9 20 20 20h47c11.6 0 21-9.4 21-21 0-10.4-7.6-19.1-17.8-20.8zM67 62H20c-4.4 0-8-3.6-8-8s3.6-8 8-8c.9 0 1.8.2 2.6.5l3.8 1.3 1.1-3.9C29.1 36.7 34.6 30 41 30c7.4 0 13.7 5.6 14.8 13l.7 4.7 4.7.6c5.2.7 9.8 4.9 9.8 10.7 0 6.1-4.9 11-11 11z"/></svg>`,
    image: 'photo/cert5.jpg',
    verificationUrl: 'https://www.credential.net/example-cert-5'
  },
  {
    id: 'cert-aws-solutions',
    title: "AWS Solutions Architect - Associate",
    issuer: 'Amazon Web Services',
    label: 'AMAZON WEB SERVICES',
    svg: `<svg viewBox="0 0 100 60" fill="currentColor"><path d="M22.5 35.8c-3.6 0-6.4-1.1-8.3-3.2-1.9-2.1-2.9-5-2.9-8.7 0-3.6 1.1-6.5 3.2-8.7 2.1-2.2 5.2-3.3 9.1-3.3 3.8 0 6.7 1 8.7 3 2 2 3 4.8 3 8.3 0 .4 0 .9-.1 1.4H17.8c.2 2.1.9 3.6 2.2 4.6 1.3 1 3 1.5 5.1 1.5 3.2 0 6-.9 8.3-2.7l3.1 4.5c-3.2 2.3-7.2 3.5-12 3.5zm-7.2-15h13.2c-.2-1.8-.8-3.1-1.8-4-1-1-2.4-1.5-4.2-1.5-1.7 0-3.1.5-4.2 1.4-1 1-1.7 2.3-3 4.1zm33.5 14.3l-7.2-22.3h6.8l4.4 15 4.5-15h6.4l4.5 15 4.4-15h6.6L79.1 35.1h-6.7l-4.7-15.1-4.7 15.1h-6.2zm41.4.9c-4.6 0-8.2-1.1-10.7-3.4l3.1-4.7c2.1 1.8 5 2.7 8.5 2.7 2.1 0 3.7-.4 4.7-1.1 1-.7 1.5-1.7 1.5-2.9 0-1.1-.4-1.9-1.3-2.5-.9-.6-2.5-1.2-4.9-1.8-3.4-.9-5.8-1.9-7.2-3.1-1.4-1.2-2.1-2.9-2.1-5.1 0-2.6 1.1-4.7 3.3-6.2 2.2-1.5 5.3-2.3 9.4-2.3 3.9 0 7.2.9 9.9 2.7l-2.9 4.8c-2.2-1.4-4.8-2.1-7.7-2.1-1.9 0-3.3.4-4.3 1.1-1 .7-1.4 1.6-1.4 2.7 0 1 .4 1.8 1.2 2.4.8.6 2.4 1.2 4.8 1.8 3.5.9 6 1.9 7.4 3.1 1.4 1.2 2.2 2.9 2.2 5.1 0 2.7-1.1 4.8-3.4 6.3-2.3 1.5-5.7 2.3-10.3 2.3z"/></svg>`,
    image: 'photo/cert6.jpg',
    verificationUrl: 'https://www.credly.com/badges/example-cert-6'
  }
];

class CertificatesManager {
  constructor() {
    this.grid = document.getElementById('certificates-grid');
    this.modal = document.getElementById('cert-modal');
    this.modalOverlay = document.getElementById('cert-modal-overlay');
    this.modalClose = document.getElementById('cert-modal-close');
    this.plaque = document.getElementById('cert-3d-card');

    this.init();
  }

  init() {
    if (!this.grid) return;

    this.renderCards(certificatesData);
    this.bindModalEvents();
    this.initSpinningText();
  }

  initSpinningText() {
    const spinningCircle = document.getElementById('cert-spinning-text');
    if (!spinningCircle) return;
    
    const text = "CERTIFICATES • AWARDS • CREDENTIALS • ";
    const chars = text.split('');
    const degreePerChar = 360 / chars.length;
    
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.innerText = char;
      // translateX(-50%) centers it horizontally, rotate(...) puts it in the circle
      span.style.transform = `translateX(-50%) rotate(${i * degreePerChar}deg)`;
      spinningCircle.appendChild(span);
    });
  }

  renderCards(items) {
    this.grid.innerHTML = '';

    items.forEach((cert) => {
      const tile = document.createElement('div');
      tile.className = 'emblem-tile';
      tile.setAttribute('data-id', cert.id);

      tile.innerHTML = `
        <div class="emblem-default-layer">
          <div class="emblem-icon-wrapper">
            ${cert.svg}
          </div>
          <div class="emblem-label">${cert.label}</div>
        </div>

        <div class="cert-hover-layer">
          <img src="${cert.image}" alt="${cert.title}" class="cert-hover-img" />
        </div>
      `;

      tile.addEventListener('click', () => {
        this.openModal(cert);
      });

      this.grid.appendChild(tile);
    });
  }

  bindTiltEffect(card) {
    // Disabled hover tilt effect for clean static B&W matrix grid
    return;
  }

  openModal(cert) {
    if (!this.modal || !this.plaque) return;

    this.plaque.innerHTML = `
      <div class="plaque-media-wrapper">
        <img src="${cert.image}" alt="${cert.title}" />
      </div>
    `;

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    this.setupPlaqueInteraction();
  }

  setupPlaqueInteraction() {
    let isDragging = false;
    let startX, startY;
    let currentRotX = 0, currentRotY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      currentRotY = deltaX * 0.4;
      currentRotX = -deltaY * 0.4;

      this.plaque.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      this.plaque.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      this.plaque.style.transform = 'rotateX(0deg) rotateY(0deg)';
      setTimeout(() => {
        this.plaque.style.transition = 'transform 0.1s ease-out';
      }, 600);
    };

    this.plaque.onmousedown = onMouseDown;
    window.onmousemove = onMouseMove;
    window.onmouseup = onMouseUp;
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bindModalEvents() {
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', () => this.closeModal());
    }

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.certificatesManager = new CertificatesManager();
});

