/* ============================================
   particles.js
   Background Partikel Interaktif
   ============================================ */

/**
 * Membuat background partikel interaktif yang
 * merespons gerakan mouse (partikel tertarik /
 * menjauh) menggunakan HTML5 Canvas.
 */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Kurangi partikel jika user memilih reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  // Resize canvas sesuai ukuran hero
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Konfigurasi partikel
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 35 : 80;
  const particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  // Warna partikel mengikuti tema
  const getParticleColor = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? '#fafafa' : '#18181b';
  };

  // Buat partikel awal
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.5 + 0.25
    });
  }

  // Lacak posisi mouse
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Animasi partikel
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = getParticleColor();

    particles.forEach((particle) => {
      // Jarak ke mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Tolak partikel menjauh dari mouse
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.6;
          particle.vy += Math.sin(angle) * force * 0.6;
        }
      }

      // Pergerakan partikel
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Redam kecepatan agar stabil
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Pantulan di tepi
      if (particle.x < 0) { particle.x = canvas.width; }
      if (particle.x > canvas.width) { particle.x = 0; }
      if (particle.y < 0) { particle.y = canvas.height; }
      if (particle.y > canvas.height) { particle.y = 0; }

      // Gambar partikel
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });

    // Gambar garis antar partikel terdekat
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.35 * (1 - distance / 130);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  };

  animate();
}
