// ── Global Audio Controller ──
const soundToggle = document.getElementById('sound-toggle');
const trackAudio = new Audio();
const ambientAudio = new Audio('/assets/audio/cortina.mp3');
ambientAudio.loop = true;
ambientAudio.volume = 0.8;

let currentTrack = null;
let audioEnabled = false;
let activeVideoIframe = null;

function stopAllVideos() {
  document.querySelectorAll('.post-video__embed').forEach((iframe) => {
    const src = iframe.getAttribute('data-src') || iframe.src;
    if (!iframe.getAttribute('data-src')) {
      iframe.setAttribute('data-src', iframe.src);
    }
    iframe.src = 'about:blank';
    activeVideoIframe = null;
  });
}

function restoreVideos() {
  document.querySelectorAll('.post-video__embed').forEach((iframe) => {
    const src = iframe.getAttribute('data-src');
    if (src && iframe.src !== src) {
      iframe.src = src;
    }
  });
}

function setAudioEnabled(on) {
  audioEnabled = on;
  if (soundToggle) {
    soundToggle.classList.toggle('off', !on);
  }
}

function stopAll() {
  // Stop track
  trackAudio.pause();
  if (currentTrack) {
    currentTrack.classList.remove('active');
    currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
    currentTrack = null;
  }
  // Stop ambient
  ambientAudio.pause();
  // Stop all videos
  stopAllVideos();
}

function playAmbient() {
  if (audioEnabled) {
    ambientAudio.play();
  }
}

// ── Track player ──
document.addEventListener('click', (e) => {
  const trackEl = e.target.closest('.post-disco__track');
  if (!trackEl) return;

  const src = trackEl.dataset.src;
  if (!src) return;

  // Toggle same track
  if (currentTrack === trackEl) {
    if (trackAudio.paused) {
      stopAll();
      setTimeout(restoreVideos, 100);
      trackAudio.play();
      trackEl.classList.add('active');
      trackEl.querySelector('.post-disco__track-btn').textContent = '⏸';
      setAudioEnabled(true);
    } else {
      trackAudio.pause();
      trackEl.classList.remove('active');
      trackEl.querySelector('.post-disco__track-btn').textContent = '▶';
      currentTrack = null;
      // Nothing playing → ambient or disable
      playAmbient();
    }
    return;
  }

  // New track
  stopAll();
  setTimeout(restoreVideos, 100);
  trackAudio.src = src;
  trackAudio.play();
  trackEl.classList.add('active');
  trackEl.querySelector('.post-disco__track-btn').textContent = '⏸';
  currentTrack = trackEl;
  setAudioEnabled(true);
});

// Auto-advance to next track, then ambient
trackAudio.addEventListener('ended', () => {
  if (!currentTrack) return;
  const next = currentTrack.nextElementSibling;
  if (next && next.classList.contains('post-disco__track')) {
    next.click();
  } else {
    currentTrack.classList.remove('active');
    currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
    currentTrack = null;
    playAmbient();
  }
});

// ── Video awareness ──
// When user clicks a video iframe, stop track/ambient audio
window.addEventListener('blur', () => {
  const active = document.activeElement;
  if (active && active.classList && active.classList.contains('post-video__embed')) {
    trackAudio.pause();
    if (currentTrack) {
      currentTrack.classList.remove('active');
      currentTrack.querySelector('.post-disco__track-btn').textContent = '▶';
      currentTrack = null;
    }
    ambientAudio.pause();
    setAudioEnabled(true);
  }
});

// Stop videos when they scroll out of view
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      const iframe = entry.target;
      const src = iframe.getAttribute('data-src') || iframe.src;
      if (src && src !== 'about:blank') {
        iframe.setAttribute('data-src', src);
        iframe.src = 'about:blank';
        setTimeout(() => { iframe.src = src; }, 50);
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.post-video__embed').forEach((iframe) => {
  iframe.setAttribute('data-src', iframe.src);
  videoObserver.observe(iframe);
});

// ── Master toggle ──
if (soundToggle) {
  soundToggle.classList.add('off');
  soundToggle.addEventListener('click', () => {
    if (audioEnabled) {
      // Turn off everything
      stopAll();
      setTimeout(restoreVideos, 100);
      setAudioEnabled(false);
    } else {
      // Turn on ambient
      setAudioEnabled(true);
      playAmbient();
    }
  });
}

// ── Filters ──
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

// ── Nav color sync and random letter-spacing ──
const navs = document.querySelectorAll('.nav');
const allNavItems = document.querySelectorAll('.nav > *');
const sections = document.querySelectorAll('.post-section');
let currentSection = null;

// Split each nav item text into individual letter spans
navs.forEach((nav) => {
  nav.querySelectorAll(':scope > *').forEach((el) => {
    // Skip sound button (has SVG)
    if (el.querySelector('svg')) return;
    const text = el.textContent;
    el.textContent = '';
    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'nav__letter';
      el.appendChild(span);
    }
  });
});

function randomizeSpacing() {
  navs.forEach((nav) => {
    const items = Array.from(nav.querySelectorAll(':scope > *'));
    const weights = items.map(() => 1 + Math.random() * 4);
    items.forEach((el, i) => {
      el.style.flex = weights[i] + ' 1 0px';
      // Vary letter-spacing per letter
      el.querySelectorAll('.nav__letter').forEach((span) => {
        span.style.letterSpacing = (Math.random() * 40) + 'px';
      });
    });
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

    allNavItems.forEach((item) => {
      item.style.color = same ? color : bg;
      item.style.backgroundColor = same ? bg : color;
    });

    randomizeSpacing();
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', randomizeSpacing);
randomizeSpacing();
updateNav();
