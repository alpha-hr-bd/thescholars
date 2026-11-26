
// ==========================================
// THE SCHOLARS BD
// Main JavaScript
// Development & Modification by Alpha.HR
// ==========================================


// NAVIGATION ITEMS
const navItems = [
    ['Home', 'index.html', 'home'],
    ['About', 'about.html', 'about'],
    ['Programs', 'courses.html', 'courses'],
    ['Admission', 'admission.html', 'admission'],
    ['Notices', 'notices.html', 'notices'],
    ['Gallery', 'gallery.html', 'gallery'],
    ['Contact', 'contact.html', 'contact']
];

const page = document.body.dataset.page || '';


// ==========================================
// HEADER
// ==========================================

const header = document.getElementById('site-header');

if (header) {
    header.innerHTML = `
        <header class="site-header">
            <div class="container nav-wrap">

                <a class="brand" href="index.html">
                    <span class="brand-mark">S</span>

                    <span>
                        THE SCHOLARS
                        <small>LEARN • GROW • ACHIEVE</small>
                    </span>
                </a>

                <nav class="nav-links" id="nav-links">

                    ${navItems.map(([name, url, key]) => `
                        <a
                            class="${page === key ? 'active' : ''}"
                            href="${url}"
                        >
                            ${name}
                        </a>
                    `).join('')}

                    <a href="student-login.html">Student</a>

                </nav>

                <div class="nav-actions">

                    <button
                        class="sound-btn"
                        id="sound-toggle"
                        aria-pressed="false"
                    >
                        ♪ Sound: Off
                    </button>

                    <a class="btn primary" href="admission.html">
                        Apply ↗
                    </a>

                    <button
                        class="menu-btn"
                        id="menu-toggle"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>

                </div>

            </div>
        </header>
    `;
}


// ==========================================
// FOOTER
// ==========================================

const footer = document.getElementById('site-footer');

if (footer) {
    footer.innerHTML = `
        <footer class="site-footer">

            <div class="container">

                <div class="footer-grid">

                    <div>
                        <div class="footer-brand">
                            THE SCHOLARS BD
                        </div>

                        <p>
                            A modern educational website concept.
                            <br>
                            Replace demo details with verified official information.
                        </p>
                    </div>

                    <div>
                        <h4>EXPLORE</h4>

                        <div class="footer-links">
                            <a href="about.html">About</a>
                            <a href="courses.html">Programs</a>
                            <a href="notices.html">Notices</a>
                            <a href="gallery.html">Gallery</a>
                        </div>
                    </div>

                    <div>
                        <h4>QUICK LINKS</h4>

                        <div class="footer-links">
                            <a href="admission.html">Admission</a>
                            <a href="student-login.html">Student portal</a>
                            <a href="contact.html">Contact</a>
                        </div>
                    </div>

                </div>

                <div class="footer-bottom">

                    <span>
                        © <span id="year"></span>
                        The Scholars BD · Demo website
                    </span>

                    <span>
                        Development & Modification by
                        <b>Alpha.HR</b>
                    </span>

                </div>

            </div>

        </footer>
    `;

    document.getElementById('year').textContent =
        new Date().getFullYear();
}


// ==========================================
// MOBILE MENU
// ==========================================

const menu = document.getElementById('menu-toggle');

if (menu) {
    menu.addEventListener('click', () => {
        document
            .getElementById('nav-links')
            .classList.toggle('open');
    });
}


// ==========================================
// SOUND EFFECT SYSTEM
// ==========================================

let soundOn = false;
let audioCtx = null;

function tone(freq = 620, duration = 0.055) {

    if (!soundOn) return;

    try {

        audioCtx = audioCtx ||
            new (window.AudioContext || window.webkitAudioContext)();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(
            0.035,
            audioCtx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + duration
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);

    } catch (error) {
        console.warn('Audio unavailable:', error);
    }
}


// SOUND TOGGLE BUTTON

const soundBtn = document.getElementById('sound-toggle');

if (soundBtn) {

    soundBtn.addEventListener('click', () => {

        soundOn = !soundOn;

        soundBtn.textContent =
            `♪ Sound: ${soundOn ? 'On' : 'Off'}`;

        soundBtn.setAttribute(
            'aria-pressed',
            String(soundOn)
        );

        if (soundOn) {
            tone(740, 0.1);
        }

    });

}


// CLICK SOUND

document.addEventListener('click', (event) => {

    if (event.target.closest('a, button')) {
        tone(520, 0.045);
    }

});


// ==========================================
// 3D TILT EFFECT
// ==========================================

document.querySelectorAll('.tilt').forEach(card => {

    card.addEventListener('pointermove', event => {

        if (window.innerWidth < 800) return;

        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
            perspective(700px)
            rotateX(${-y * 5}deg)
            rotateY(${x * 6}deg)
            translateY(-4px)
        `;

    });

    card.addEventListener('pointerleave', () => {
        card.style.transform = '';
    });

});


// ==========================================
// COURSE SEARCH & FILTER
// ==========================================

const search = document.getElementById('course-search');
const filter = document.getElementById('course-filter');

function filterCourses() {

    if (!search || !filter) return;

    let count = 0;

    document.querySelectorAll('.course-card').forEach(card => {

        const matchesSearch =
            card.textContent
                .toLowerCase()
                .includes(search.value.toLowerCase());

        const matchesCategory =
            filter.value === 'all' ||
            card.dataset.category === filter.value;

        const visible = matchesSearch && matchesCategory;

        card.hidden = !visible;

        if (visible) count++;

    });

    const noCourses = document.getElementById('no-courses');

    if (noCourses) {
        noCourses.hidden = count > 0;
    }

}

if (search) {
    search.addEventListener('input', filterCourses);
}

if (filter) {
    filter.addEventListener('change', filterCourses);
}


// ==========================================
// LOCAL FORM STORAGE
// ==========================================

function saveLocalForm(form, key) {

    form.addEventListener('submit', event => {

        event.preventDefault();

        const data = Object.fromEntries(
            new FormData(form).entries()
        );

        const arr = JSON.parse(
            localStorage.getItem(key) || '[]'
        );

        arr.push({
            ...data,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            key,
            JSON.stringify(arr)
        );

        const status = form.querySelector('.form-status');

        if (status) {
            status.textContent =
                'Saved on this device. This is not sent to the institution.';
        }

        form.reset();

        tone(800, 0.1);

    });

}


// ADMISSION FORM

const admission = document.getElementById('admission-form');

if (admission) {
    saveLocalForm(
        admission,
        'scholars_demo_admission'
    );
}


// CONTACT FORM

const contact = document.getElementById('contact-form');

if (contact) {
    saveLocalForm(
        contact,
        'scholars_demo_messages'
    );
}


// ==========================================
// DEMO STUDENT LOGIN
// ==========================================

const login = document.getElementById('demo-login');

if (login) {

    login.addEventListener('submit', event => {

        event.preventDefault();

        const id = new FormData(login).get('studentId');

        sessionStorage.setItem(
            'scholars_demo_student',
            id
        );

        location.href = 'student-dashboard.html';

    });

}


// ==========================================
// STUDENT DASHBOARD
// ==========================================

const dash = document.getElementById('dash-student');

if (dash) {

    dash.textContent =
        sessionStorage.getItem('scholars_demo_student') ||
        'Demo Student';

}
