/* ============================================
   navbar.js
   Fungsi Navbar
   ============================================ */

/**
 * Inisialisasi perilaku navbar:
 * - Background saat scroll
 * - Toggle menu mobile
 * - Active link berdasarkan halaman
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.navbar-mobile');

  // Ubah background navbar saat halaman di-scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Toggle menu mobile
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Tutup menu saat link diklik
    const mobileLinks = mobileMenu.querySelectorAll('.navbar-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link berdasarkan URL halaman saat ini
  setActiveNavLink();
}

/**
 * Menandai link navbar yang aktif berdasarkan
 * file halaman yang sedang dibuka.
 */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.navbar-link');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
