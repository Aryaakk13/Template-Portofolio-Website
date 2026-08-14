/* ============================================
   typing.js
   Efek Mengetik (Typing Effect)
   ============================================ */

/**
 * Inisialisasi efek mengetik pada hero section.
 * Membaca kata-kata dari data kata yang tersedia.
 */
function initTyping() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  // Kata-kata yang akan diketik (judul/profesi)
const words = [
    'Web Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'Software Engineer'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  /**
   * Loop utama efek mengetik.
   * Mengatur kecepatan mengetik dan menghapus.
   */
  const type = () => {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);

    typingElement.textContent = currentText;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      // Selesai mengetik kata, tunggu sebentar
      isWaiting = true;
      typeSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      // Selesai menghapus, lanjut ke kata berikutnya
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      isWaiting = false;
      typeSpeed = 400;
    }

    if (!isWaiting) {
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
    }

    if (isWaiting) {
      isDeleting = true;
      isWaiting = false;
      typeSpeed = 800;
    }

    setTimeout(type, typeSpeed);
  };

  type();
}
