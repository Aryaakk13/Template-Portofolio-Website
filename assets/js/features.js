/* ============================================
   features.js
   Fitur Tambahan yang Berguna & Menarik
   ============================================ */

/**
 * Membuat progress bar baca (reading progress)
 * di bagian atas halaman yang mengisi sesuai
 * sejauh mana pengguna menggulir halaman.
 */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Update saat halaman dimuat
  document.addEventListener('DOMContentLoaded', update);
  update();
}

/**
 * Menambahkan efek "card tilt" halus pada kartu
 * saat mouse berada di atasnya (interaktif & menarik).
 */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.portfolio-card, .service-card, .certificate-card, .skills-category');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Mereset transform tilt pada kartu. Dipanggil saat grid
 * di-filter ulang (mis. berpindah kategori portfolio) agar
 * tidak ada transform GPU yang tertinggal dan memicu
 * glitch compositing pada custom cursor.
 */
function resetCardTransforms() {
  document.querySelectorAll('.portfolio-card, .service-card, .certificate-card, .skills-category')
    .forEach((card) => {
      card.style.transform = '';
    });
}

/**
 * Menampilkan tombol "back to top" dengan
 * perhitungan posisi dan memastikan elemen
 * tetap berfungsi di semua halaman.
 */
function initEnhancedBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Menambahkan animasi "wave" pada tombol sosial
 * dan ikon saat hover (menambah kesan hidup).
 */
function initSocialHover() {
  const icons = document.querySelectorAll('.hero-socials a, .footer-social-icons a');
  icons.forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      icon.classList.add('social-hover');
    });
    icon.addEventListener('mouseleave', () => {
      icon.classList.remove('social-hover');
    });
  });
}

/**
 * Inisialisasi semua fitur tambahan.
 */
function initFeatures() {
  initReadingProgress();
  initCardTilt();
  initEnhancedBackToTop();
  initSocialHover();
}
