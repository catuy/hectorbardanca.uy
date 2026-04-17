// Audio player
const audioEl = new Audio();
let currentTrack = null;

document.addEventListener('click', (e) => {
  const trackEl = e.target.closest('.post-disco__track');
  if (!trackEl) return;

  const src = trackEl.dataset.src;
  if (!src) return;

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

  if (currentTrack) {
    currentTrack.classList.remove('active');
    currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
  }

  audioEl.src = src;
  audioEl.play();
  trackEl.classList.add('active');
  trackEl.querySelector('.post-disco__track-btn').textContent = '⏸';
  currentTrack = trackEl;
});

audioEl.addEventListener('ended', () => {
  if (!currentTrack) return;
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
const filters = document.querySelectorAll('.nav__filter');
const posts = document.querySelectorAll('.post');
let activeFilter = null;

function updateVisibility() {
  posts.forEach((post) => {
    const cat = post.dataset.category;
    if (!cat) {
      post.classList.toggle('hidden', activeFilter !== null && activeFilter !== 'fotos');
      return;
    }
    if (activeFilter === null) {
      post.classList.remove('hidden');
    } else {
      post.classList.toggle('hidden', cat !== activeFilter);
    }
  });

  filters.forEach((btn) => {
    const f = btn.dataset.filter;
    if (f === 'todos') {
      btn.classList.toggle('active', activeFilter === null);
    } else if (activeFilter === null) {
      btn.classList.add('active');
    } else {
      btn.classList.toggle('active', f === activeFilter);
    }
  });
}

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === 'todos' || activeFilter === filter) {
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
      soundToggle.textContent = 'Sound ON';
    } else {
      ambientAudio.pause();
      soundToggle.textContent = 'Sound OFF';
    }
  });
}

// Nav color sync and random positioning
const nav = document.querySelector('.nav');
const navItems = nav.querySelectorAll(':scope > *');
const sections = document.querySelectorAll('.post-section');
let currentSection = null;

function placeItems() {
  const items = Array.from(navItems);
  const totalItemsWidth = items.reduce((s, el) => s + el.offsetWidth, 0);
  const freeSpace = Math.max(0, window.innerWidth - totalItemsWidth);

  // items.length + 1 slots: before first, between each, after last
  const slots = items.length + 1;
  const rands = Array.from({ length: slots }, () => Math.random());
  const randSum = rands.reduce((s, r) => s + r, 0);

  items.forEach((el, i) => {
    el.style.marginLeft = Math.round((rands[i] / randSum) * freeSpace) + 'px';
  });
}

function updateNav() {
  const navY = 20;

  let next = sections[0];
  for (const section of sections) {
    if (section.style.display === 'none') continue;
    const rect = section.getBoundingClientRect();
    if (rect.top <= navY && rect.bottom > navY) {
      next = section;
      break;
    }
  }

  if (next && next !== currentSection) {
    currentSection = next;
    const bg = next.style.backgroundColor || '#ffffff';
    const color = next.style.color || '#000000';
    const same = next.classList.contains('post-section--nav-same');

    navItems.forEach((item) => {
      item.style.color = same ? color : bg;
      item.style.backgroundColor = same ? bg : color;
    });

    placeItems();
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', placeItems);
placeItems();
updateNav();
