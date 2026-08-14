/* ============================================
   theme.js
   Dark/Light Mode
   ============================================ */

/**
 * Inisialisasi fitur dark/light mode.
 * Menyimpan preferensi pengguna di localStorage.
 */
function initTheme() {
  const toggleButton = document.querySelector('.navbar-toggle-theme');
  const themeIcon = toggleButton ? toggleButton.querySelector('i') : null;

  // Ambil tema tersimpan atau default
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Terapkan tema awal
  applyTheme(initialTheme);

// Toggle tema saat tombol diklik
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Update ikon jika berubah
  const syncThemeIcon = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('.navbar-toggle-theme i').forEach((icon) => {
      icon.classList.toggle('bi-moon-stars', theme !== 'dark');
      icon.classList.toggle('bi-sun', theme === 'dark');
    });
  };

  syncThemeIcon();

  // Dengarkan event kustom 'themechange' untuk sinkronisasi ikon
  document.addEventListener('themechange', syncThemeIcon);
}

/**
 * Menerapkan tema ke seluruh dokumen.
 * @param {string} theme - 'light' atau 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Umumkan perubahan tema agar ikon & elemen lain tersinkronisasi
  document.dispatchEvent(new CustomEvent('themechange'));
}
