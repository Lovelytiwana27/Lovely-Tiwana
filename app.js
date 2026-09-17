/* ═══════════════════════════════════════════════════════════
   LOVELY TIWANA FILMS — Portfolio Application Logic
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  // ── Load Data ────────────────────────────────────────────
  let data;
  try {
    const resp = await fetch('projects.json');
    data = await resp.json();
  } catch (err) {
    console.error('Failed to load projects data:', err);
    return;
  }

  const profile = data.profile;
  const showreel = data.showreel;
  const allProjects = data.projects.filter(p => p.poster);
  const allStills = data.stills || [];
  const brands = data.brands || [];

  // Separate by genre
  const verticalProjects = allProjects.filter(p =>
    p.aspectRatio === '9:16' || p.genre === 'OTT Vertical Web Series'
  );
  const musicVideos = allProjects.filter(p => !verticalProjects.includes(p));

  // Split music videos into main displayed and "more"
  const moreProjectIds = ['proj-life-power', 'proj-brethren'];
  const mainMusicVideos = musicVideos.filter(p => !moreProjectIds.includes(p.id));
  const moreMusicVideos = musicVideos.filter(p => moreProjectIds.includes(p.id));


  // ── Render Project Cards ─────────────────────────────────
  function createCardHTML(proj, index) {
    const delayClass = `reveal-delay-${(index % 5) + 1}`;
    const rolesHtml = (proj.roles || [])
      .map(r => `<span class="card__role">${r}</span>`)
      .join('');

    return `
      <a href="project.html?id=${proj.id}" class="card reveal ${delayClass}">
        <div class="card__thumb">
          <img src="${proj.poster}" alt="${proj.title}" loading="lazy">
          <div class="card__overlay"></div>
          ${proj.videoUrl ? `
          <div class="card__play">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21"/>
            </svg>
          </div>` : ''}
          ${proj.note ? `<div class="card__badge">${proj.note}</div>` : ''}
        </div>
        <div class="card__body">
          <h3 class="card__title">${proj.title}</h3>
          <div class="card__meta">
            <div class="card__roles">${rolesHtml}</div>
            <span class="card__year">${proj.year || ''}</span>
          </div>
        </div>
      </a>
    `;
  }

  // Music Videos Grid
  const musicGrid = document.getElementById('musicGrid');
  if (musicGrid) {
    let html = mainMusicVideos.map((p, i) => createCardHTML(p, i)).join('');

    // Add "More Projects" card if there are hidden ones
    if (moreMusicVideos.length > 0) {
      html += `
        <div class="card card--more reveal" onclick="openMoreModal()">
          <div class="card--more__inner">
            <div class="card--more__count">+${moreMusicVideos.length}</div>
            <div class="card--more__label">More Projects</div>
          </div>
        </div>
      `;
    }
    musicGrid.innerHTML = html;
  }

  // Web Series Grid
  const webGrid = document.getElementById('webSeriesGrid');
  if (webGrid) {
    webGrid.innerHTML = verticalProjects.map((p, i) => createCardHTML(p, i)).join('');
  }

  // More Modal Grid
  const moreGrid = document.getElementById('moreGrid');
  if (moreGrid) {
    moreGrid.innerHTML = moreMusicVideos.map((p, i) => createCardHTML(p, i)).join('');
  }


  // ── Render Stills Gallery ────────────────────────────────
  const stillsTrack = document.getElementById('stillsTrack');
  if (stillsTrack && allStills.length > 0) {
    const stillsHtml = allStills.map(s => `
      <div class="stills__item" onclick="openLightbox('${s.image}', '${(s.title || '').replace(/'/g, "\\'")}', '${(s.camera || '').replace(/'/g, "\\'")}')">
        <img src="${s.image}" alt="${s.title || 'Production Still'}" loading="lazy">
        <div class="stills__item-overlay">
          <div class="stills__item-title">${s.title || ''}</div>
          <div class="stills__item-camera">${s.camera || ''}</div>
        </div>
      </div>
    `).join('');
    stillsTrack.innerHTML = stillsHtml;

    // Drag to scroll
    initDragScroll(stillsTrack);
  }


  // ── Render About Section ─────────────────────────────────
  if (profile) {
    const bio1 = document.getElementById('aboutBio1');
    const bio2 = document.getElementById('aboutBio2');
    if (bio1 && profile.bio && profile.bio[0]) bio1.textContent = profile.bio[0];
    if (bio2 && profile.bio && profile.bio[1]) bio2.textContent = profile.bio[1];

    // Expertise cards
    const expertiseGrid = document.getElementById('expertiseGrid');
    if (expertiseGrid && profile.expertise) {
      expertiseGrid.innerHTML = profile.expertise.map(e => `
        <div class="expertise-card">
          <div class="expertise-card__title">${e.title}</div>
          <div class="expertise-card__roles">${e.roles}</div>
          <div class="expertise-card__desc">${e.desc}</div>
        </div>
      `).join('');
    }

    // Footer lead text
    const footerLead = document.getElementById('footerLead');
    if (footerLead && profile.contactLead) {
      footerLead.textContent = profile.contactLead;
    }
  }


  // ── Render Brands Strip ──────────────────────────────────
  const brandsTrack = document.getElementById('brandsTrack');
  if (brandsTrack && brands.length > 0) {
    // Duplicate for infinite scroll
    const allBrands = [...brands, ...brands, ...brands];
    brandsTrack.innerHTML = allBrands.map((b, i) => `
      <span class="brands__item">${b}</span>
      ${i < allBrands.length - 1 ? '<span class="brands__divider"></span>' : ''}
    `).join('');
  }


  // ── Showreel Click ───────────────────────────────────────
  const showreelVideo = document.getElementById('showreelVideo');
  if (showreelVideo && showreel && showreel.videoUrl) {
    showreelVideo.addEventListener('click', () => {
      const videoId = extractYouTubeId(showreel.videoUrl);
      if (videoId) {
        showreelVideo.innerHTML = `
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
            style="position:absolute;inset:0;width:100%;height:100%;border-radius:12px;"
          ></iframe>
        `;
        showreelVideo.style.cursor = 'default';
      }
    });
  }


  // ── Initialize Scroll Animations ─────────────────────────
  initScrollReveal();
  initNavScroll();
  initStatsCounter();


  // ── Year Auto-update ─────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});


/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════
   NAV SCROLL EFFECT
   ═══════════════════════════════════════════════════════════ */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}


/* ═══════════════════════════════════════════════════════════
   STATS COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════ */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stats__value[data-target]');
  if (!stats.length) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.dataset.target);
          const suffix = stat.textContent.replace(/[0-9]/g, '');
          animateCounter(stat, 0, target, 1500, suffix);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const section = document.getElementById('statsSection');
  if (section) observer.observe(section);
}

function animateCounter(el, start, end, duration, suffix) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}


/* ═══════════════════════════════════════════════════════════
   HAMBURGER MENU
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
});


/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
function openLightbox(src, title, subtitle) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const subEl = document.getElementById('lightboxSubtitle');

  if (!lb) return;

  img.src = src;
  titleEl.textContent = title || '';
  subEl.textContent = subtitle || '';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('lightboxClose');
  const lb = document.getElementById('lightbox');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMoreModal();
    }
  });
});


/* ═══════════════════════════════════════════════════════════
   MORE PROJECTS MODAL
   ═══════════════════════════════════════════════════════════ */
function openMoreModal() {
  const modal = document.getElementById('moreModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Re-trigger reveal animations inside modal
    modal.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
}

function closeMoreModal() {
  const modal = document.getElementById('moreModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('moreModalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeMoreModal);
});


/* ═══════════════════════════════════════════════════════════
   DRAG-TO-SCROLL (Stills Gallery)
   ═══════════════════════════════════════════════════════════ */
function initDragScroll(el) {
  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  el.addEventListener('mouseleave', () => {
    isDown = false;
    el.style.cursor = 'grab';
  });

  el.addEventListener('mouseup', () => {
    isDown = false;
    el.style.cursor = 'grab';
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  });
}


/* ═══════════════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════════════ */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return match ? match[1] : null;
}
