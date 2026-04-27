// =============================================================================
// PORTFOLIO ANALYTICS — Comprehensive User Tracking
// All events are sent to GA4 via the existing gtag() function.
// Console logs are always on so you can verify events in DevTools.
// =============================================================================

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    function send(eventName, params) {
        console.log(`[Analytics] ${eventName}:`, params);
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    function getDeviceType() {
        const w = window.innerWidth;
        if (w <= 768) return 'mobile';
        if (w <= 1200) return 'tablet';
        return 'desktop';
    }

    function parseUA(ua) {
        let os = 'Unknown OS';
        if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
        else if (/Windows NT 6/.test(ua)) os = 'Windows Legacy';
        else if (/Mac OS X/.test(ua)) os = 'macOS';
        else if (/Android/.test(ua)) os = 'Android';
        else if (/iPhone|iPad/.test(ua)) os = 'iOS';
        else if (/Linux/.test(ua)) os = 'Linux';

        let browser = 'Unknown Browser';
        if (/Edg\//.test(ua)) browser = 'Edge';
        else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
        else if (/Chrome\//.test(ua)) browser = 'Chrome';
        else if (/Firefox\//.test(ua)) browser = 'Firefox';
        else if (/Safari\//.test(ua)) browser = 'Safari';

        return { os, browser };
    }

    // =========================================================================
    // 1. DEVICE INFO
    // =========================================================================

    function trackDeviceInfo() {
        const { os, browser } = parseUA(navigator.userAgent);
        send('device_info', {
            os,
            browser,
            device_type: getDeviceType(),
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
        });
    }

    // =========================================================================
    // 2. ENVIRONMENT INFO (dark mode, connection, language, timezone, battery)
    // =========================================================================

    function trackEnvironment() {
        const params = {
            prefers_dark_mode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            language: navigator.language || 'unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
            connection_speed: (navigator.connection && navigator.connection.effectiveType) || 'unknown',
        };

        // Battery (async — fires separately when available)
        if (navigator.getBattery) {
            navigator.getBattery().then(function (battery) {
                send('user_env', Object.assign({}, params, {
                    battery_level: Math.round(battery.level * 100),
                    battery_charging: battery.charging,
                }));
            }).catch(function () {
                send('user_env', params);
            });
        } else {
            send('user_env', params);
        }
    }

    // =========================================================================
    // 3. IP GEOLOCATION
    // =========================================================================

    function trackGeo() {
        fetch('https://ipapi.co/json/')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                send('user_geo', {
                    country: data.country_name || 'unknown',
                    country_code: data.country_code || 'unknown',
                    region: data.region || 'unknown',
                    city: data.city || 'unknown',
                    isp: data.org || 'unknown',
                    timezone: data.timezone || 'unknown',
                });
            })
            .catch(function () {
                console.warn('[Analytics] Geo lookup failed (offline or rate-limited)');
            });
    }

    // =========================================================================
    // 4. VISIT COUNTER (localStorage)
    // =========================================================================

    function trackVisit() {
        const now = new Date().toISOString();
        const visitCount = parseInt(localStorage.getItem('_p_visits') || '0') + 1;
        const firstVisit = localStorage.getItem('_p_first_visit') || now;
        const lastVisit = localStorage.getItem('_p_last_visit') || now;

        localStorage.setItem('_p_visits', visitCount);
        localStorage.setItem('_p_first_visit', firstVisit);
        localStorage.setItem('_p_last_visit', now);

        const referrer = document.referrer;
        let referrerSource = 'direct';
        if (referrer) {
            try {
                const r = new URL(referrer);
                referrerSource = r.hostname;
            } catch (e) {
                referrerSource = referrer;
            }
        }

        const entryHash = window.location.hash || '(top)';

        send('user_visit', {
            visit_number: visitCount,
            is_returning: visitCount > 1,
            first_visit_date: firstVisit,
            last_visit_date: lastVisit,
            referrer_source: referrerSource,
            entry_point: entryHash,
        });
    }

    // =========================================================================
    // 5. SCROLL DEPTH
    // =========================================================================

    function trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const reached = new Set();

        window.addEventListener('scroll', function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const pct = Math.round((scrollTop / docHeight) * 100);

            milestones.forEach(function (m) {
                if (pct >= m && !reached.has(m)) {
                    reached.add(m);
                    send('scroll_depth', { percent: m });
                }
            });
        }, { passive: true });
    }

    // =========================================================================
    // 6. SECTION DWELL TIME (IntersectionObserver)
    // =========================================================================

    function trackSectionDwell() {
        if (!('IntersectionObserver' in window)) return;

        const sections = document.querySelectorAll('section[id], section[data-aos]');
        const enterTimes = {};

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const id = entry.target.id || entry.target.className.split(' ')[0];
                if (entry.isIntersecting) {
                    enterTimes[id] = Date.now();
                } else if (enterTimes[id]) {
                    const dwell = Math.round((Date.now() - enterTimes[id]) / 1000);
                    if (dwell >= 1) {
                        send('section_dwell', { section: id, seconds: dwell });
                    }
                    delete enterTimes[id];
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(function (s) { observer.observe(s); });

        // Flush on page unload
        window.addEventListener('pagehide', function () {
            Object.keys(enterTimes).forEach(function (id) {
                const dwell = Math.round((Date.now() - enterTimes[id]) / 1000);
                if (dwell >= 1) {
                    send('section_dwell', { section: id, seconds: dwell });
                }
            });
        });
    }

    // =========================================================================
    // 7. NAV LINK CLICKS
    // =========================================================================

    function trackNavClicks() {
        document.querySelectorAll('nav a, .mobile-menu a').forEach(function (link) {
            link.addEventListener('click', function () {
                send('nav_click', {
                    label: link.textContent.trim(),
                    href: link.getAttribute('href') || '',
                });
            });
        });
    }

    // =========================================================================
    // 8. SOCIAL LINK CLICKS
    // =========================================================================

    function trackSocialClicks() {
        document.querySelectorAll('.social, .footer-meta a, [aria-label]').forEach(function (el) {
            const label = el.getAttribute('aria-label') || el.textContent.trim();
            if (!label) return;
            el.addEventListener('click', function () {
                send('social_click', {
                    platform: label,
                    href: el.getAttribute('href') || '',
                });
            });
        });
    }

    // =========================================================================
    // 9. PROJECT CARD CLICKS + HOVER DURATION
    // =========================================================================

    function trackProjectInteractions() {
        // Use event delegation on project-list (cards are rendered dynamically)
        const projectList = document.getElementById('project-list');
        if (projectList) {
            projectList.addEventListener('click', function (e) {
                const item = e.target.closest('[data-project], .project-item, li');
                if (item) {
                    send('project_click', {
                        label: item.dataset.project || item.textContent.trim().slice(0, 40),
                    });
                }
            });

            // Hover duration tracking
            let hoverStart = null;
            let hoverTarget = null;

            projectList.addEventListener('mouseover', function (e) {
                const item = e.target.closest('[data-project], .project-item, li');
                if (item && item !== hoverTarget) {
                    hoverTarget = item;
                    hoverStart = Date.now();
                }
            });

            projectList.addEventListener('mouseleave', function () {
                if (hoverTarget && hoverStart) {
                    const duration = Math.round((Date.now() - hoverStart) / 1000);
                    if (duration >= 1) {
                        send('project_hover', {
                            label: hoverTarget.dataset.project || hoverTarget.textContent.trim().slice(0, 40),
                            seconds: duration,
                        });
                    }
                }
                hoverTarget = null;
                hoverStart = null;
            });
        }
    }

    // =========================================================================
    // 10. CONTACT FORM — name, email capture + submit event
    // =========================================================================

    function trackContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            const nameEl = form.querySelector('input[type="text"]');
            const emailEl = form.querySelector('input[type="email"]');
            send('contact_submit', {
                user_name: nameEl ? nameEl.value.trim() : 'unknown',
                user_email: emailEl ? emailEl.value.trim() : 'unknown',
            });
        });
    }

    // =========================================================================
    // 11. COPY EVENT (e.g. copying email address)
    // =========================================================================

    function trackCopyEvents() {
        document.addEventListener('copy', function () {
            const selected = window.getSelection ? window.getSelection().toString().trim() : '';
            send('copy_event', {
                copied_text: selected.slice(0, 100), // cap at 100 chars
            });
        });
    }

    // =========================================================================
    // 12. EXIT INTENT (mouse moves toward top of browser)
    // =========================================================================

    function trackExitIntent() {
        let fired = false;
        document.addEventListener('mousemove', function (e) {
            if (!fired && e.clientY < 10) {
                fired = true;
                send('exit_intent', {
                    scroll_percent: Math.round(
                        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                    ),
                });
                // Allow re-trigger after 30s
                setTimeout(function () { fired = false; }, 30000);
            }
        });
    }

    // =========================================================================
    // INIT — run everything when DOM is ready
    // =========================================================================

    function init() {
        trackDeviceInfo();
        trackEnvironment();
        trackGeo();
        trackVisit();
        trackScrollDepth();
        trackSectionDwell();
        trackNavClicks();
        trackSocialClicks();
        trackProjectInteractions();
        trackContactForm();
        trackCopyEvents();
        trackExitIntent();

        console.log('[Analytics] All trackers initialized ✓');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
