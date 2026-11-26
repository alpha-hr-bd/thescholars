
/* =========================================
   SOUND SYSTEM (Web Audio API)
========================================= */

let on = true;
let ac;

const A = () =>
    ac || (ac = new (window.AudioContext || window.webkitAudioContext)());

function beep(f, d = 0.12, t = 'sine', v = 0.07) {
    if (!on) return;

    try {
        const c = A();
        const o = c.createOscillator();
        const g = c.createGain();

        o.type = t;
        o.frequency.value = f;

        g.gain.value = v;
        g.gain.exponentialRampToValueAtTime(
            0.001,
            c.currentTime + d
        );

        o.connect(g);
        g.connect(c.destination);

        o.start();
        o.stop(c.currentTime + d);

    } catch (e) {}
}


/* =========================================
   HOVER SOUND EFFECT
========================================= */

document.addEventListener('mouseover', e => {
    if (e.target.closest('a, .btn, .card, button')) {
        beep(880, 0.06, 'triangle', 0.03);
    }
});


/* =========================================
   CLICK SOUND EFFECT
========================================= */

document.addEventListener('click', e => {
    if (e.target.closest('a, .btn, button')) {
        beep(520, 0.1, 'square', 0.04);

        setTimeout(() => {
            beep(990, 0.15, 'sine', 0.05);
        }, 70);
    }
});


/* =========================================
   SOUND ON / OFF BUTTON
========================================= */

const s = document.getElementById('snd');

if (s) {
    s.onclick = () => {
        on = !on;

        s.textContent = on
            ? '🔊 Sound ON'
            : '🔇 Sound OFF';

        beep(700);
    };
}


/* =========================================
   3D CARD TILT EFFECT
========================================= */

document.querySelectorAll('.card').forEach(c => {

    c.addEventListener('mousemove', e => {

        const r = c.getBoundingClientRect();

        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;

        c.style.transform = `
            rotateY(${x * 18}deg)
            rotateX(${-y * 18}deg)
            scale(1.03)
        `;
    });

    c.addEventListener('mouseleave', () => {
        c.style.transform = '';
    });

});


/* =========================================
   NEON PARTICLE BACKGROUND
========================================= */

const cv = document.getElementById('fx');
const x = cv.getContext('2d');

let W, H, P = [];


/* Canvas Resize */

function rs() {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
}

rs();

addEventListener('resize', rs);


/* Create Particles */

for (let i = 0; i < 70; i++) {

    P.push({
        x: Math.random() * 2e3,
        y: Math.random() * 2e3,
        r: Math.random() * 2 + 0.5,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,

        c: [
            '#ffc83d',
            '#00e5ff',
            '#1e6bff'
        ][i % 3]
    });

}


/* Particle Animation */

(function d() {

    x.clearRect(0, 0, W, H);

    P.forEach(p => {

        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;

        x.fillStyle = p.c;
        x.shadowColor = p.c;
        x.shadowBlur = 12;

        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, 7);
        x.fill();

    });

    requestAnimationFrame(d);

})();


/* =========================================
   ANIMATED COUNTERS
========================================= */

document.querySelectorAll('[data-n]').forEach(e => {

    let n = +e.dataset.n;
    let i = 0;

    const t = setInterval(() => {

        i += Math.ceil(n / 60);

        if (i >= n) {
            i = n;
            clearInterval(t);
        }

        e.textContent = i + (e.dataset.s || '');

    }, 25);

});


/* =========================================
   ADMISSION FORM
========================================= */

const f = document.getElementById('adm');

if (f) {

    f.onsubmit = e => {

        e.preventDefault();

        beep(1200, 0.3);

        alert(
            '✅ Application received! (Demo – connect a backend/Formspree to receive data)'
        );

        f.reset();

    };

}
