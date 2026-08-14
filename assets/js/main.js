/* ============================================
   main.js
   Inisialisasi Utama Website
   ============================================ */

// Menunggu semua elemen siap sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
  initializeWebsite();
});

/**
 * Fungsi utama yang menginisialisasi seluruh
 * komponen website secara terstruktur.
 */
function initializeWebsite() {
  // Urutan inisialisasi sesuai struktur JavaScript.
  // Beberapa fungsi hanya ada di halaman tertentu (mis. initTyping &
  // initParticles hanya dimuat di index.html). Cek ketersediaannya agar
  // error tidak menghentikan inisialisasi fungsi lain (mis. initCursor).
  initLoading();
  initNavbar();
  if (typeof initTyping === 'function') initTyping();
  initScrollAnimation();
  if (typeof initParticles === 'function') initParticles();
  initCounter();
  initTheme();
  initContactForm();
  initBackToTop();
  initCursor();
  initOnLoad();
}

/**
 * Inisialisasi semua inventory setelah halaman dimuat.
 * Fungsi ini dipanggil setelah semua resource siap.
 */
function initOnLoad() {
  // Set data dinamis dari data JSON
  initPortfolioFilter();
  initTestimonials();
  initDynamicData();
}

/* ============================================
   Loading Screen
   ============================================ */

/**
 * Menampilkan loading screen lalu
 * menyembunyikannya setelah halaman siap.
 */
function initLoading() {
  const loading = document.getElementById('loading');
  if (!loading) return;

  // Cegah scroll selama loading
  document.body.style.overflow = 'hidden';

  // Fungsi untuk menyembunyikan loading screen
  const hideLoading = () => {
    loading.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Sembunyikan setelah halaman dimuat (dengan batas waktu)
  window.addEventListener('load', () => {
    setTimeout(hideLoading, 500);
  });

  // JARING PENGAMAN: sembunyikan loading setelah 1.5 detik
  // sebagai fallback jika event 'load' tertunda (mis. CDN lambat)
  setTimeout(hideLoading, 1500);
}

/* ============================================
   Back To Top
   ============================================ */

/**
 * Menampilkan tombol back-to-top saat
 * halaman di-scroll ke bawah.
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   Contact Form
   ============================================ */

/**
 * Konfigurasi EmailJS.
 * Isi Service ID, Template ID, dan Public Key Anda
 * dari dashboard EmailJS (https://dashboard.emailjs.com).
 * Service dan template dapat dibuat gratis.
 */
const EMAIL_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',   // Ganti: Service ID dari EmailJS
  templateId: 'YOUR_TEMPLATE_ID', // Ganti: Template ID dari EmailJS
  publicKey: 'YOUR_PUBLIC_KEY',   // Ganti: Public Key dari EmailJS
  recipient: 'arya@email.com'     // Email tujuan penerima pesan
};

/**
 * Menghasilkan soal CAPTCHA matematika sederhana
 * dan menyimpan jawabannya di hidden input.
 */
function generateCaptcha() {
  const questionEl = document.getElementById('captcha-question');
  const answerEl = document.getElementById('captcha-answer');
  if (!questionEl || !answerEl) return;

  const a = Math.floor(Math.random() * 9) + 1;   // 1-9
  const b = Math.floor(Math.random() * 9) + 1;   // 1-9

  questionEl.textContent = `${a} + ${b} = ?`;
  answerEl.value = String(a + b);

  // Kosongkan input CAPTCHA
  const input = document.getElementById('captcha');
  if (input) input.value = '';
}

/**
 * Menangani submit form kontak.
 * Mengirim pesan ke email menggunakan EmailJS dan
 * menampilkan status pengiriman.
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const formStatus = form.querySelector('.form-status');

  // Buat soal CAPTCHA saat halaman dimuat
  generateCaptcha();

  // Tombol refresh untuk mengganti soal CAPTCHA
  const refreshBtn = document.getElementById('captcha-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', generateCaptcha);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim() || 'Pesan dari Hubungi Saya';
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showFormStatus(formStatus, 'Mohon isi semua kolom terlebih dahulu.', 'error');
      return;
    }

    // Validasi format email sederhana
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus(formStatus, 'Mohon masukkan alamat email yang valid.', 'error');
      return;
    }

    // Validasi CAPTCHA
    const captchaInput = form.querySelector('#captcha');
    const captchaAnswer = form.querySelector('#captcha-answer');
    if (!captchaInput || !captchaAnswer || captchaInput.value.trim() !== captchaAnswer.value) {
      showFormStatus(formStatus, 'Jawaban verifikasi salah. Silakan coba lagi.', 'error');
      generateCaptcha();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Mengirim...';
    submitBtn.disabled = true;

    // Jika EmailJS belum dikonfigurasi, gunakan fallback mailto
    if (
      typeof emailjs === 'undefined' ||
      EMAIL_CONFIG.serviceId === 'YOUR_SERVICE_ID' ||
      EMAIL_CONFIG.templateId === 'YOUR_TEMPLATE_ID' ||
      EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY'
    ) {
      sendViaMailTo(form, name, email, subject, message, submitBtn, originalText, formStatus);
      return;
    }

    emailjs
      .send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId,
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          reply_to: email,
          to_email: EMAIL_CONFIG.recipient
        },
        { publicKey: EMAIL_CONFIG.publicKey }
      )
      .then(() => {
        showFormStatus(
          formStatus,
          'Terima kasih! Pesan Anda berhasil terkirim ke email saya. Saya akan segera menghubungi Anda kembali.',
          'success'
        );
        form.reset();
      })
      .catch(() => {
        showFormStatus(
          formStatus,
          'Maaf, pesan gagal terkirim. Silakan coba lagi atau hubungi saya langsung melalui email.',
          'error'
        );
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Sembunyikan status setelah beberapa detik
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      });
  });
}

/**
 * Fallback: membuka aplikasi email pengunjung
 * dengan isian yang sudah lengkap (mailto).
 */
function sendViaMailTo(form, name, email, subject, message, submitBtn, originalText, formStatus) {
  const subjectLine = `[Kontak] ${subject} - dari ${name}`;
  const body = `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;
  const mailtoLink = `mailto:${EMAIL_CONFIG.recipient}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

  // Buka aplikasi email pengunjung
  window.location.href = mailtoLink;

  showFormStatus(
    formStatus,
    'Membuka aplikasi email Anda... Pastikan pesan terkirim dari aplikasi email Anda.',
    'success'
  );
  form.reset();
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;

  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 6000);
}

/**
 * Menampilkan status pada form kontak.
 * @param {HTMLElement} element - Elemen status
 * @param {string} message - Pesan yang ditampilkan
 * @param {string} type - Tipe status ('success' | 'error')
 */
function showFormStatus(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('success', 'error');
  element.classList.add(type);
  element.style.display = 'block';
}

/* ============================================
   Portfolio Filter
   ============================================ */

/**
 * Menambahkan fungsionalitas filter pada grid portfolio.
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      // Reset sisa transform tilt agar tidak memicu
      // glitch compositing pada custom cursor.
      if (typeof resetCardTransforms === 'function') {
        resetCardTransforms();
      }

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.classList.add('reveal-zoom', 'active');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   Testimonials Slider
   ============================================ */

/**
 * Membuat slider sederhana untuk testimonial.
 */
function initTestimonials() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const cards = slider.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  if (cards.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  // Tampilkan hanya card pertama
  cards.forEach((card, index) => {
    if (index !== 0) card.style.display = 'none';
  });

  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.style.display = i === index ? 'block' : 'none';
    });
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      showCard(currentIndex);
    });
  }
}

/* ============================================
   Dynamic Data (JSON)
   ============================================ */

/**
 * Memuat dan menampilkan data dari file JSON.
 * Handle error jika data tidak dapat dimuat.
 */
function initDynamicData() {
  // Data portfolio
  loadJSON('data/projects.json', (data) => {
    if (data && data.projects) {
      // Render portfolio items dinamis
      // (Implementasi sesuai kebutuhan)
    }
  });

  // Data keterampilan
  loadJSON('data/skills.json', (data) => {
    if (data && data.skills) {
      // Render data skills dinamis
    }
  });
}

/**
 * Memuat file JSON.
 * @param {string} url - URL file JSON
 * @param {Function} callback - Fungsi callback dengan data
 */
function loadJSON(url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load: ' + url);
      return response.json();
    })
    .then((data) => callback(data))
    .catch((error) => {
      // Fallback: gunakan data statis dari HTML
      // console.warn(error);
    });
}
