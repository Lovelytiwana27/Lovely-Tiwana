document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    document.getElementById('dynamicProjectContainer').innerHTML = '<h2 style="text-align:center; padding:10rem 0;">Project Not Found</h2>';
    return;
  }

  try {
    let data;
    const saved = localStorage.getItem('lt_portfolio_data_v15');
    if (saved) {
      data = JSON.parse(saved);
    } else {
      const resp = await fetch('projects.json');
      data = await resp.json();
    }

    const project = data.projects.find(p => p.id === projectId);
    if (!project) {
      document.getElementById('dynamicProjectContainer').innerHTML = '<h2 style="text-align:center; padding:10rem 0;">Project Not Found</h2>';
      return;
    }

    // Render Project
    renderProjectPage(project);

  } catch (err) {
    console.error('Error loading project:', err);
    document.getElementById('dynamicProjectContainer').innerHTML = '<h2 style="text-align:center; padding:10rem 0;">Error loading project data.</h2>';
  }
});

function renderProjectPage(proj) {
  document.title = `${proj.title} | Lovely Tiwana Films`;

  const rolesHtml = (proj.roles || []).map(r => `<span class="meta-chip">${r}</span>`).join('');
  const noteBadge = proj.note ? `<span class="meta-chip highlight">${proj.note}</span>` : '';
  const isVertical = proj.aspectRatio === '9:16' || proj.genre === 'OTT Vertical Web Series';
  
  // Create video button or coming soon text
  let ctaHtml = '';
  if (proj.videoUrl) {
    ctaHtml = `
      <a href="${proj.videoUrl}" target="_blank" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5v14l11-7z"/></svg>
        Watch Now
      </a>
    `;
  } else {
    ctaHtml = `
      <a href="#notify" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Get Notified
      </a>
    `;
  }

  // Format Credits for display
  const creditsListHtml = (proj.credits || '').split('\n').map(line => `<p>${line}</p>`).join('');

  const html = `
    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero-bg">
        <img src="${proj.poster || 'assets/posters/showreel_cover.jpg'}" alt="${proj.title}">
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-scanline"></div>

      <div class="hero-content">
        <div class="hero-production-tag">${proj.brand || 'Lovely Tiwana Films'} presents</div>
        <h1 class="hero-title">${proj.title.split('—')[0] || proj.title}</h1>
        <p class="hero-subtitle">${proj.title.includes('—') ? proj.title.split('—')[1] : proj.genre}</p>

        <div class="hero-meta-row">
          ${isVertical ? '<span class="meta-chip highlight">9:16 Vertical</span>' : '<span class="meta-chip">16:9 Cinematic</span>'}
          <span class="meta-chip">${proj.genre || ''}</span>
          <span class="meta-chip">${proj.year || ''}</span>
          ${rolesHtml}
          ${noteBadge}
        </div>

        <div class="hero-cta-group">
          ${ctaHtml}
        </div>
      </div>

      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- PROJECT INFO -->
    <section class="poster-section" id="poster">
      <div class="container">
        <div class="poster-display reveal visible">
          <div class="poster-frame">
            <img src="${proj.poster || 'assets/posters/showreel_cover.jpg'}" alt="Official Poster">
            <span class="poster-frame-badge">Official Poster</span>
          </div>

          <div class="poster-info">
            <span class="poster-info-tag">Project Details</span>
            <h2>${proj.title}</h2>
            <div style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem;">
              ${creditsListHtml}
            </div>

            <div class="info-spec-grid">
              <div class="spec-item">
                <div class="spec-label">Format</div>
                <div class="spec-value">${isVertical ? '9:16 Vertical Series' : '16:9 Widescreen'}</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Genre</div>
                <div class="spec-value">${proj.genre}</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Brand / Client</div>
                <div class="spec-value">${proj.brand}</div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Year</div>
                <div class="spec-value">${proj.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${proj.videoUrl ? `
    <!-- PROJECT VIDEO -->
    <section class="video-section" id="video" style="padding: 5rem 0; background-color: var(--bg-secondary);">
      <div class="container" style="max-width: 1000px; margin: 0 auto;">
        <h3 style="text-align: center; color: var(--accent-gold); margin-bottom: 2rem; font-family: 'Playfair Display', serif; font-size: 2rem;">PROJECT VIDEO</h3>
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <iframe 
            src="${proj.videoUrl.includes('youtube') ? proj.videoUrl.replace('watch?v=', 'embed/') : proj.videoUrl.replace('vimeo.com', 'player.vimeo.com/video')}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
            allowfullscreen 
            allow="autoplay; encrypted-media; picture-in-picture">
          </iframe>
        </div>
      </div>
    </section>
    ` : ''}
  `;

  document.getElementById('dynamicProjectContainer').innerHTML = html;
    // Dynamically update hardcoded header/footer elements from project.html
  const prodBadge = document.querySelector('.prod-badge');
  if (prodBadge) {
    prodBadge.textContent = proj.genre || 'Project';
  }

  const statusPillText = document.querySelector('.status-pill span:last-child');
  const statusPill = document.querySelector('.status-pill');
  if (statusPill && statusPillText) {
    if (proj.videoUrl) {
      // Hide coming soon if video is out
      statusPill.style.display = 'none';
    } else {
      statusPillText.textContent = 'Coming Soon';
      statusPill.style.display = 'inline-flex';
    }
  }
  
  const formatTag = document.querySelector('.format-tag');
  if (formatTag) {
    formatTag.innerHTML = isVertical ? 
      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="2" width="12" height="20" rx="2"/></svg> 9:16 Vertical` : 
      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="6" width="20" height="12" rx="2"/></svg> 16:9 Cinematic`;
  }

  const footerBrand = document.querySelector('.footer-brand');
  if (footerBrand) {
    // Make first word normal, rest wrapped in span for styling if possible, or just text
    const words = proj.title.split(' ');
    if (words.length > 1) {
      const first = words.shift();
      footerBrand.innerHTML = `${first} <span>${words.join(' ')}</span>`;
    } else {
      footerBrand.textContent = proj.title;
    }
  }
}
