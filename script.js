// =========================================================
// Benjamin Cop — Portfolio Miroir (Script interactif)
// Simulation Photonique : Diode Laser, Faisceau & Impulsions Optiques
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initLaserDiodeSimulation();
  initCounters();
  initNavScroll();
});

// 1. Simulation dynamique de Diode Laser & Émission Photonique
function initLaserDiodeSimulation() {
  const canvas = document.querySelector('.laser-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let t = 0;

  // Tableau de photons / paquets d'onde voyageant dans le faisceau
  const photons = [];
  const maxPhotons = 45;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 160;
  }
  resize();
  window.addEventListener('resize', resize);

  // Initialisation des paquets de photons
  for (let i = 0; i < maxPhotons; i++) {
    photons.push({
      x: Math.random() * (canvas.width || 800),
      speed: 4 + Math.random() * 3,
      size: 2 + Math.random() * 2.5,
      alpha: 0.4 + Math.random() * 0.6,
      offsetY: (Math.random() - 0.5) * 8
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const centerY = h / 2;

    // --- A. FOND GRILLE TECHNIQUE / OPTIQUE ---
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Axe optique central
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // --- B. DIODE LASER / BOÎTIER ÉMETTEUR (À GAUCHE) ---
    const diodeWidth = 55;
    const diodeHeight = 60;
    const diodeX = 25;
    const diodeY = centerY - diodeHeight / 2;

    // Corps métallique du boîtier diode (TO-can / papillon)
    const diodeGrad = ctx.createLinearGradient(diodeX, diodeY, diodeX + diodeWidth, diodeY + diodeHeight);
    diodeGrad.addColorStop(0, '#133525');
    diodeGrad.addColorStop(1, '#061a12');
    ctx.fillStyle = diodeGrad;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(diodeX, diodeY, diodeWidth, diodeHeight, 6);
    ctx.fill();
    ctx.stroke();

    // Broches d'alimentation (Anode / Cathode)
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(diodeX, centerY - 15);
    ctx.lineTo(diodeX - 16, centerY - 15);
    ctx.moveTo(diodeX, centerY + 15);
    ctx.lineTo(diodeX - 16, centerY + 15);
    ctx.stroke();

    // Symbole Diode Laser au centre du boîtier
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    const symX = diodeX + 18;
    ctx.moveTo(symX, centerY - 12);
    ctx.lineTo(symX + 14, centerY);
    ctx.lineTo(symX, centerY + 12);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(symX + 15, centerY - 12);
    ctx.lineTo(symX + 15, centerY + 12);
    ctx.stroke();

    // Flèches d'émission lumineuse stimulée
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(symX + 18, centerY - 8);
    ctx.lineTo(symX + 26, centerY - 14);
    ctx.moveTo(symX + 22, centerY - 4);
    ctx.lineTo(symX + 30, centerY - 10);
    ctx.stroke();

    // Facette de sortie / Collimation
    const apertureX = diodeX + diodeWidth;
    ctx.fillStyle = '#34d399';
    ctx.fillRect(apertureX, centerY - 8, 4, 16);

    // --- C. FAISCEAU LASER & PROPAGATION OPTIQUE ---
    const beamStartX = apertureX + 4;
    const beamEndX = w - 190; // S'arrête avant le détecteur/spectromètre

    if (beamEndX > beamStartX) {
      // 1. Halo extérieur diffus (Glow gaussien)
      const haloGrad = ctx.createLinearGradient(beamStartX, centerY - 25, beamStartX, centerY + 25);
      haloGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      haloGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.22)');
      haloGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(beamStartX, centerY - 25, beamEndX - beamStartX, 50);

      // 2. Faisceau principal collimaté
      const beamGrad = ctx.createLinearGradient(beamStartX, centerY - 8, beamStartX, centerY + 8);
      beamGrad.addColorStop(0, 'rgba(52, 211, 153, 0.3)');
      beamGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.9)');
      beamGrad.addColorStop(1, 'rgba(52, 211, 153, 0.3)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(beamStartX, centerY - 8, beamEndX - beamStartX, 16);

      // 3. Coeur laser ultra-brillant (Ligne centrale)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(beamStartX, centerY);
      ctx.lineTo(beamEndX, centerY);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // 4. Flux de photons / paquets d'impulsions animés
      photons.forEach(p => {
        p.x += p.speed;
        if (p.x > beamEndX) {
          p.x = beamStartX;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, centerY + p.offsetY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // --- D. ÉCRAN SPECTROMÈTRE / PROFIL D'IMPULSION (À DROITE) ---
    const monitorX = Math.max(w - 180, beamEndX + 10);
    const monitorW = 160;
    const monitorH = 100;
    const monitorY = centerY - monitorH / 2;

    if (w > 560) {
      // Cadre du récepteur optique
      ctx.fillStyle = '#061f14';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(monitorX, monitorY, monitorW, monitorH, 8);
      ctx.fill();
      ctx.stroke();

      // Titre du moniteur
      ctx.fillStyle = 'rgba(247, 250, 248, 0.6)';
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillText('SPECTRE λ = 1064 nm', monitorX + 12, monitorY + 16);

      // Tracé gaussien du spectre laser (Pic spectral ultra-fin monomode)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const specCenter = monitorX + monitorW / 2;
      const specBaseY = monitorY + monitorH - 18;
      const peakHeight = 55;

      for (let sx = monitorX + 10; sx <= monitorX + monitorW - 10; sx += 2) {
        const dist = (sx - specCenter) / 10;
        // Fonction gaussienne du pic d'émission laser
        const val = Math.exp(-0.5 * dist * dist);
        const noise = (Math.sin(sx * 0.5 + t * 4) * 0.05);
        const sy = specBaseY - (val + noise) * peakHeight;

        if (sx === monitorX + 10) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Repère de pic
      ctx.fillStyle = '#34d399';
      ctx.font = '9px "Geist Mono", monospace';
      ctx.fillText('P_opt = 350 mW', monitorX + 12, monitorY + monitorH - 6);
      ctx.fillText('FWHM < 0.1 nm', monitorX + 85, monitorY + monitorH - 6);
    }

    t += 0.04;
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}

// 2. Compteurs numériques animés lors du scroll
function initCounters() {
  const statElements = document.querySelectorAll('[data-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 1200; // ms
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const currentVal = Math.floor(progress * target);
          entry.target.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = target;
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

// 3. Navigation fluide & mise à jour du lien actif
function initNavScroll() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// 4. Fonction globale pour déplier/replier les détails des contrats
function toggleContractDetails(detailsId, button) {
  const drawer = document.getElementById(detailsId);
  if (!drawer) return;

  const isOpen = drawer.classList.contains('open');
  const label = button.querySelector('.btn-label');

  if (isOpen) {
    drawer.classList.remove('open');
    button.classList.remove('active');
    if (label) label.textContent = 'Voir le détail des missions';
  } else {
    drawer.classList.add('open');
    button.classList.add('active');
    if (label) label.textContent = 'Masquer le détail';
  }
}
