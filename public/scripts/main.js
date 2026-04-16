// Audio player
const audioEl = new Audio();
let currentTrack = null;

document.addEventListener('click', (e) => {
  const trackEl = e.target.closest('.post-disco__track');
  if (!trackEl) return;

  const src = trackEl.dataset.src;
  if (!src) return;

  // If clicking same track, toggle play/pause
  if (currentTrack === trackEl) {
    if (audioEl.paused) {
      audioEl.play();
      trackEl.classList.add('active');
      trackEl.querySelector('.post-disco__track-btn').textContent = '⏸';
    } else {
      audioEl.pause();
      trackEl.classList.remove('active');
      trackEl.querySelector('.post-disco__track-btn').textContent = '▶';
    }
    return;
  }

  // Stop previous
  if (currentTrack) {
    currentTrack.classList.remove('active');
    currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
  }

  // Play new track
  audioEl.src = src;
  audioEl.play();
  trackEl.classList.add('active');
  trackEl.querySelector('.post-disco__track-btn').textContent = '⏸';
  currentTrack = trackEl;
});

audioEl.addEventListener('ended', () => {
  if (!currentTrack) return;

  // Auto-play next track in same album
  const next = currentTrack.nextElementSibling;
  if (next && next.classList.contains('post-disco__track')) {
    next.click();
  } else {
    currentTrack.classList.remove('active');
    currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
    currentTrack = null;
  }
});

// Filters
const filters = document.querySelectorAll('.sidebar__filter');
const posts = document.querySelectorAll('.post');
let activeFilter = null; // null = all active

const categoryMap = {
  videos: 'videos',
  musica: 'musica',
  textos: 'textos',
  bio: 'bio',
};

function updateVisibility() {
  posts.forEach((post) => {
    const cat = post.dataset.category;
    if (!cat) {
      // Posts without category (like fotos) show when all filters active or none selected
      post.classList.toggle('hidden', activeFilter !== null && activeFilter !== 'fotos');
      return;
    }
    if (activeFilter === null) {
      post.classList.remove('hidden');
    } else {
      post.classList.toggle('hidden', cat !== activeFilter);
    }
  });

  // Show/hide dividers
  document.querySelectorAll('.divider').forEach((div) => {
    if (activeFilter === null || activeFilter === 'bio') {
      div.classList.remove('hidden');
    } else {
      div.classList.add('hidden');
    }
  });

  // Update filter button states
  filters.forEach((btn) => {
    if (activeFilter === null) {
      btn.classList.add('active');
    } else {
      btn.classList.toggle('active', btn.dataset.filter === activeFilter);
    }
  });
}

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (activeFilter === filter) {
      // Clicking active filter → show all
      activeFilter = null;
    } else {
      activeFilter = filter;
    }
    updateVisibility();
  });
});

// Ambient sound
const soundToggle = document.getElementById('sound-toggle');
const ambientAudio = new Audio('/assets/audio/espejo-perfector/01-angel-del-oeste-01.mp3');
ambientAudio.loop = true;
ambientAudio.volume = 0.15;
let soundOn = false;

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      ambientAudio.play();
      soundToggle.textContent = 'ON';
    } else {
      ambientAudio.pause();
      soundToggle.textContent = 'OFF';
    }
  });
}
