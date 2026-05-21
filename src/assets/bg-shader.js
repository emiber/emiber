/**
 * Site background — Matrix digital rain
 * Canvas 2D, katakana + digits, ~20 fps for the authentic slow-rain feel.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Classic Matrix charset: katakana + digits
  const CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    '0123456789';

  const COL_W = 16; // px per column
  let cols, drops, speeds;

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / COL_W);
    drops = Float32Array.from({ length: cols }, () => Math.random() * -(canvas.height / COL_W));
    speeds = Float32Array.from({ length: cols }, () => 0.4 + Math.random() * 0.8);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  init();
  window.addEventListener('resize', init);

  const FPS = 10; // lower fps = more "chunky" digital look
  let last = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (now - last < 1000 / FPS) return;
    last = now;

    // Semi-transparent black overlay creates the fading trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${COL_W}px monospace`;

    for (let i = 0; i < cols; i++) {
      const y = drops[i] * COL_W;

      if (y >= -COL_W && y < canvas.height) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const g = 100 + Math.floor(Math.random() * 156); // 100–255
        const rb = Math.floor(g * 0.35);                 // grey–green blend
        ctx.fillStyle = `rgb(${rb},${g},${rb})`;
        ctx.fillText(char, i * COL_W, y);
      }

      drops[i] += speeds[i];

      // Reset column after going off-screen, with random stagger
      if (drops[i] * COL_W > canvas.height && Math.random() > 0.92) {
        drops[i] = -Math.floor(Math.random() * 20);
      }
    }
  }

  requestAnimationFrame(frame);
})();

