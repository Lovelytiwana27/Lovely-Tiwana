document.addEventListener('DOMContentLoaded', async () => {
  try {
    let data;
    const saved = localStorage.getItem('lt_portfolio_data_v14');
    if (saved) {
      data = JSON.parse(saved);
    } else {
      const resp = await fetch('projects.json');
      data = await resp.json();
    }
    
    // Separate real projects from stills (stills have an 'image' property instead of 'poster')
    const allProjects = data.projects.filter(p => p.poster);
    const stills = data.projects.filter(p => p.image);

    // Split projects into Landscape (Music Videos) and Vertical (OTT Series)
    // We assume 9:16 aspect ratio or specific IDs mean Vertical
    const verticalIds = ['proj-toxic-pyaar', 'proj-death-clock', 'proj-date-with-daddy'];
    
    const verticalProjects = allProjects.filter(p => 
      p.aspectRatio === '9:16' || verticalIds.includes(p.id) || p.genre === 'OTT Vertical Web Series'
    );
    const musicVideos = allProjects.filter(p => 
      !verticalProjects.includes(p)
    );

    renderGrid('musicGrid', musicVideos);
    renderGrid('webSeriesGrid', verticalProjects);
    renderStillsMarquee(stills);

  } catch (err) {
    console.error('Failed to load projects data:', err);
  }
});

function renderGrid(containerId, projects) {
  const grid = document.getElementById(containerId);
  if (!grid || !projects) return;

  grid.innerHTML = projects.map(proj => {
    return `
      <a href="project.html?id=${proj.id}" class="pro-project-card">
        <div class="pro-card-image-wrap">
          <img src="${proj.poster}" alt="${proj.title}">
        </div>
        <h3 class="pro-card-title">${proj.title}</h3>
        <div class="pro-card-meta">
          <span>${proj.genre || ''}</span>
          <span>${proj.year || ''}</span>
        </div>
      </a>
    `;
  }).join('');
}

function renderStillsMarquee(stills) {
  const track = document.getElementById('stillsTrack');
  if (!track) return;

  let stillsToUse = stills;
  if (!stills || stills.length === 0) {
    const fallbackStills = [
      { image: 'assets/stills/director_portrait.jpg', title: 'Lovely Tiwana', camera: 'Director Portrait' },
      { image: 'assets/stills/still_toxic_pyaar.jpg', title: 'Toxic Pyaar', camera: 'OTT Series Poster' },
      { image: 'assets/stills/still_death_clock.jpg', title: 'Death Clock', camera: '6-Episode Thriller' },
      { image: 'assets/stills/still_date_with_daddy.jpg', title: 'Date With Daddy-In-Law', camera: 'Micro-Drama' },
      { image: 'assets/stills/still_fansi_poster.jpg', title: 'Fansi', camera: 'Official Poster' },
      { image: 'assets/stills/still_eyes_on_me.jpg', title: 'Eyes on Me', camera: 'Production Still' }
    ];
    stillsToUse = fallbackStills;
  }

  // Duplicate items to ensure seamless infinite scrolling
  const allStillsHtml = [...stillsToUse, ...stillsToUse, ...stillsToUse].map(s => {
    return `
      <div class="stills-item" onclick="openLightbox('${s.image}', '${s.title || 'Production Still'}', '${s.camera || ''}')">
        <img src="${s.image}" alt="${s.title || 'Production Still'}">
      </div>
    `;
  }).join('');

  track.innerHTML = allStillsHtml;
}

// Lightbox Logic
function openLightbox(imageSrc, title, subtitle) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const subEl = document.getElementById('lightboxSubtitle');

  img.src = imageSrc;
  titleEl.innerText = title;
  subEl.innerText = subtitle;
  
  modal.classList.add('active');
}

// Close Lightbox
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxClose');
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});
