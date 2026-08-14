/* ============================================
   cursor.js
   Custom Cursor
   ============================================ */

/**
 * Membuat custom cursor yang mengikuti
 * gerakan mouse pengguna dengan efek dot follower.
 */
function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  if (!cursor) return;

  // Hanya aktif di perangkat dengan mouse (bukan layar sentuh)
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    return;
  }

  // Pastikan cursor tampil dan cursor native disembunyikan
  // sejak awal (tidak menunggu event mouseenter/mousemove).
  cursor.style.opacity = '1';
  if (cursorDot) cursorDot.style.opacity = '1';
document.documentElement.classList.add('custom-cursor-active');

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  let initialized = false;
  let hovering = false;
  let targetScale = 1;
  let currentScale = 1;

  // Update posisi target mouse.
  // 'initialized' memastikan cursor mulai dari posisi mouse
  // (tidak diam di pojok kiri-atas saat pertama kali muncul).
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Jika cursor pernah "terjebak" di pojok kiri-atas (mis. karena
    // re-render saat ganti kategori), sinkronkan posisi langsung ke mouse
    // agar segera kembali mengikuti kursor.
    if (!initialized || (cursorX === 0 && cursorY === 0)) {
      cursorX = mouseX;
      cursorY = mouseY;
      dotX = mouseX;
      dotY = mouseY;
      initialized = true;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      if (cursorDot) {
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
      }
    }

    // Deteksi kecepatan mouse untuk efek skala dinamis:
    // gerakan cepat -> cursor sedikit membesar & lebih responsif.
    const speed = Math.hypot(e.movementX || 0, e.movementY || 0);
    targetScale = Math.min(1 + speed / 400, 1.35);
  });

  /**
   * Loop animasi: cursor utama mengikuti lebih cepat,
   * dot follower mengikuti lebih lambat (efek trailing).
   * Skala di-lerp untuk transisi halus.
   */
  const animate = () => {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    dotX += (mouseX - dotX) * 0.14;
    dotY += (mouseY - dotY) * 0.14;

    currentScale += (targetScale - currentScale) * 0.15;
    const scale = hovering ? 1 : currentScale;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;
    if (cursorDot) {
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
    }

    requestAnimationFrame(animate);
  };

  // Mulai loop animasi
  requestAnimationFrame(animate);

  // Update status hover pada elemen interaktif.
  // Menggunakan event delegation di 'document' agar tetap
  // berfungsi untuk elemen yang muncul setelah render
  // (mis. hasil filter portfolio, menu mobile, modal, dll).
  const interactiveElements = 'a, button, .filter-btn, .portfolio-card, .card, input, textarea, select, .navbar-toggle, .service-card, .certificate-card, .tool-item, .skill-item, .contact-item, .navbar-brand, .footer-social-icons a';

  const isInteractiveElement = (target) => {
    // Cek elemen interaktif atau elemen dengan teks yang dapat diklik
    return Boolean(target.closest(interactiveElements)) ||
           (target.closest('[data-link]'));
  };

  // Optimasi: gunakan mouseover + mouseout dengan penguncian
  // agar tidak ada flicker saat melewati child elemen.
  document.addEventListener('mouseover', (e) => {
    const isInteractive = isInteractiveElement(e.target);
    hovering = isInteractive;
    cursor.classList.toggle('hovering', isInteractive);
    if (cursorDot) cursorDot.classList.toggle('hovering', isInteractive);
  }, { passive: true });

  // Sembunyikan cursor saat meninggalkan window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    if (cursorDot) cursorDot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    if (cursorDot) cursorDot.style.opacity = '1';
  });

  // Deteksi mousedown (klik) untuk efek "press" yang lebih kecil
  document.addEventListener('mousedown', () => {
    cursor.classList.add('pressing');
    if (cursorDot) cursorDot.classList.add('pressing');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('pressing');
    if (cursorDot) cursorDot.classList.remove('pressing');
  });

  // Sembunyikan cursor native agar tidak terlihat dobel
  document.documentElement.classList.add('custom-cursor-active');
}
