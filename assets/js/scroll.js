/* ============================================
   scroll.js
   Animasi Scroll
   ============================================ */

/**
 * Inisialisasi animasi scroll:
 * - Reveal element saat masuk viewport
 * - Skill bar mengisi saat terlihat
 * - Counter berjalan saat terlihat
 */
function initScrollAnimation() {
  // Reveal animation dengan IntersectionObserver
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-zoom'
  );

  // Fallback: jika IntersectionObserver tidak didukung,
  // langsung tampilkan semua elemen
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Skill bar animation
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  if (!('IntersectionObserver' in window)) {
    skillBars.forEach((bar) => {
      const width = bar.getAttribute('data-progress') || '0';
      bar.style.width = width + '%';
    });
  } else {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-progress') || '0';
            entry.target.style.width = width + '%';
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  }
}

/**
 * Inisialisasi animasi counter statistik.
 * Angka akan berjalan naik saat terlihat.
 */
function initCounter() {
  const counterElements = document.querySelectorAll('[data-counter]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-counter'), 10);
          const duration = 2000;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current.toLocaleString('id-ID');

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              element.textContent = target.toLocaleString('id-ID');
            }
          };

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(element);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}
