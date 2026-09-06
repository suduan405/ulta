/**
 * js/script.js
 * Romantic Birthday Website — All Interactive Logic
 *
 * TABLE OF CONTENTS
 * 1.  Configuration
 * 2.  DOM Element References
 * 3.  Opening Screen
 * 4.  Floating Hearts
 * 5.  Navigation
 * 6.  Countdown Timer
 * 7.  Gallery & Lightbox
 * 8.  Letter Opening
 * 9.  Wishes Reveal (Intersection Observer)
 * 10. Surprise & Gift Interaction
 * 11. Confetti
 * 12. Music Player
 * 13. Smooth Scrolling
 * 14. Initialization
 */

'use strict';

/* ============================================================
   1. CONFIGURATION — Edit these values to personalize
   ============================================================ */
const CONFIG = {
  /** Nama yang ditampilkan di seluruh website */
  herName: 'Mela',

  /** Tanggal ulang tahun dalam format ISO: "YYYY-MM-DDTHH:mm:ss" */
  birthdayDate: new Date('2026-10-15T00:00:00'),

  /** Tanda tangan surat */
  letterSignature: 'Seseorang yang peduli \u2665',

  /** Locale format tanggal di surat */
  letterDateLocale: 'id-ID',

  /** Jumlah hati melayang yang muncul sekaligus */
  floatingHeartsCount: 12,

  /** Jumlah konfeti */
  confettiCount: 120,
};

/* ============================================================
   2. DOM ELEMENT REFERENCES
   ============================================================ */
const DOM = {
  // Opening screen
  openingScreen:       document.getElementById('opening-screen'),
  openingEnterButton:  document.getElementById('opening-enter-button'),
  openingParticles:    document.getElementById('opening-particles'),

  // Floating hearts
  floatingHeartsLayer: document.getElementById('floating-hearts-layer'),

  // Navigation
  navContainer:        document.getElementById('nav-container'),
  navToggle:           document.getElementById('nav-toggle'),
  navMenu:             document.getElementById('nav-menu'),
  navLinks:            document.querySelectorAll('.nav-link'),

  // Hero name displays
  heroNameDisplay:     document.getElementById('hero-name-display'),

  // Countdown
  birthdayCountdown:   document.getElementById('birthday-countdown'),
  countdownDays:       document.getElementById('countdown-days'),
  countdownHours:      document.getElementById('countdown-hours'),
  countdownMinutes:    document.getElementById('countdown-minutes'),
  countdownSeconds:    document.getElementById('countdown-seconds'),
  countdownTodayMsg:   document.getElementById('countdown-today-message'),

  // Gallery
  galleryGrid:         document.getElementById('gallery-grid'),
  galleryItems:        document.querySelectorAll('.gallery-item'),

  // Lightbox
  lightboxOverlay:     document.getElementById('lightbox-overlay'),
  lightboxImage:       document.getElementById('lightbox-image'),
  lightboxCaption:     document.getElementById('lightbox-caption'),
  lightboxCloseBtn:    document.getElementById('lightbox-close-button'),
  lightboxPrevBtn:     document.getElementById('lightbox-prev-button'),
  lightboxNextBtn:     document.getElementById('lightbox-next-button'),
  lightboxCounter:     document.getElementById('lightbox-counter'),

  // Letter
  letterCard:          document.getElementById('letter-card'),
  letterEnvelope:      document.getElementById('letter-envelope'),
  letterOpenButton:    document.getElementById('letter-open-button'),
  letterContent:       document.getElementById('letter-content'),
  letterDate:          document.getElementById('letter-date'),
  letterGreeting:      document.getElementById('letter-greeting'),
  letterSignature:     document.getElementById('letter-signature'),

  // Wishes cards
  wishCards:           document.querySelectorAll('.wish-card'),

  // Surprise
  giftBox:             document.getElementById('gift-box'),
  giftOpenButton:      document.getElementById('gift-open-button'),
  surpriseMessage:     document.getElementById('surprise-message'),
  surpriseHeadline:    document.getElementById('surprise-headline'),
  surpriseReplayBtn:   document.getElementById('surprise-replay-button'),
  confettiLayer:       document.getElementById('confetti-layer'),

  // Music player
  musicPlayer:         document.getElementById('music-player'),
  musicToggle:         document.getElementById('music-toggle'),
  musicIcon:           document.getElementById('music-icon'),
  musicInfo:           document.getElementById('music-info'),
  musicTitle:          document.getElementById('music-title'),
  birthdayAudio:       document.getElementById('birthday-audio'),

  // Footer
  footerMessage:       document.getElementById('footer-message'),
  footerNameHighlight: document.getElementById('footer-name-highlight'),
};

/* ============================================================
   Internal State
   ============================================================ */
const STATE = {
  lightboxCurrentIndex: 0,
  lightboxImages:       [],
  countdownInterval:    null,
  floatingHeartsTimer:  null,
  isMusicPlaying:       false,
  isMusicAvailable:     true,
  isLetterOpen:         false,
  isSurpriseOpen:       false,
  isUserInteracted:     false,
};

/* ============================================================
   3. OPENING SCREEN
   ============================================================ */
function initializeOpeningScreen() {
  if (!DOM.openingScreen || !DOM.openingEnterButton) return;

  spawnOpeningParticles();

  DOM.openingEnterButton.addEventListener('click', handleOpeningEnter);
}

function handleOpeningEnter() {
  STATE.isUserInteracted = true;

  DOM.openingScreen.classList.add('opening-screen--exiting');

  startFloatingHearts();

  // Attempt autoplay after user interaction
  attemptMusicAutoplay();

  // Remove opening screen from DOM after animation
  DOM.openingScreen.addEventListener('transitionend', () => {
    DOM.openingScreen.hidden = true;
    DOM.openingScreen.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }, { once: true });

  document.body.style.overflow = '';
}

function spawnOpeningParticles() {
  if (!DOM.openingParticles) return;

  const particleCount = 18;
  const colors = [
    'hsl(342, 65%, 80%)',
    'hsl(20, 65%, 82%)',
    'hsl(355, 60%, 85%)',
    'hsl(330, 55%, 82%)',
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.classList.add('opening-particle');

    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 12;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = [
      `width: ${size}px`,
      `height: ${size}px`,
      `left: ${left}%`,
      `background-color: ${color}`,
      `animation-delay: -${delay}s`,
      `animation-duration: ${duration}s`,
    ].join(';');

    DOM.openingParticles.appendChild(particle);
  }
}

/* ============================================================
   4. FLOATING HEARTS
   ============================================================ */
function startFloatingHearts() {
  if (!DOM.floatingHeartsLayer) return;

  DOM.floatingHeartsLayer.classList.add('floating-hearts-layer--active');

  const heartSymbols = ['\u2665', '\u2764', '\u2661', '\u2665', '\u2665'];

  // Spawn initial batch
  for (let i = 0; i < CONFIG.floatingHeartsCount; i++) {
    spawnFloatingHeart(heartSymbols, i * 1200);
  }

  // Keep spawning periodically
  STATE.floatingHeartsTimer = setInterval(() => {
    spawnFloatingHeart(heartSymbols, 0);
  }, 2800);
}

function spawnFloatingHeart(symbols, delay) {
  const heart = document.createElement('span');
  heart.classList.add('floating-heart');
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.setAttribute('aria-hidden', 'true');

  const left      = Math.random() * 100;
  const size      = Math.random() * 0.9 + 0.6;
  const duration  = Math.random() * 10 + 14;
  const opacity   = Math.random() * 0.4 + 0.25;
  const hue       = Math.floor(Math.random() * 30 + 330);

  heart.style.cssText = [
    `left: ${left}%`,
    `font-size: ${size}rem`,
    `color: hsl(${hue}, 70%, 72%)`,
    `opacity: ${opacity}`,
    `animation-duration: ${duration}s`,
    `animation-delay: ${delay}ms`,
  ].join(';');

  DOM.floatingHeartsLayer.appendChild(heart);

  // Remove after animation ends
  const removeDelay = delay + duration * 1000 + 500;
  setTimeout(() => {
    if (heart.parentNode) heart.parentNode.removeChild(heart);
  }, removeDelay);
}

/* ============================================================
   5. NAVIGATION
   ============================================================ */
function initializeNavigation() {
  if (!DOM.navContainer) return;

  // Scroll effect
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile toggle
  if (DOM.navToggle && DOM.navMenu) {
    DOM.navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when a nav link is clicked
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', handleOutsideNavClick);

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }
}

function handleNavScroll() {
  if (window.scrollY > 60) {
    DOM.navContainer.classList.add('nav-container--scrolled');
  } else {
    DOM.navContainer.classList.remove('nav-container--scrolled');
  }
}

function toggleMobileMenu() {
  const isExpanded = DOM.navToggle.getAttribute('aria-expanded') === 'true';

  DOM.navToggle.setAttribute('aria-expanded', String(!isExpanded));
  DOM.navMenu.classList.toggle('nav-menu--open', !isExpanded);
}

function closeMobileMenu() {
  DOM.navToggle.setAttribute('aria-expanded', 'false');
  DOM.navMenu.classList.remove('nav-menu--open');
}

function handleOutsideNavClick(event) {
  if (
    DOM.navMenu.classList.contains('nav-menu--open') &&
    !DOM.navMenu.contains(event.target) &&
    !DOM.navToggle.contains(event.target)
  ) {
    closeMobileMenu();
  }
}

/* ============================================================
   6. COUNTDOWN TIMER
   ============================================================ */
function initializeCountdown() {
  if (!DOM.countdownDays) return;

  updateCountdownDisplay();
  STATE.countdownInterval = setInterval(updateCountdownDisplay, 1000);
}

function updateCountdownDisplay() {
  const now       = new Date();
  const target    = CONFIG.birthdayDate;
  const diff      = target - now;

  if (diff <= 0) {
    showBirthdayMessage();
    clearInterval(STATE.countdownInterval);
    return;
  }

  const totalSeconds  = Math.floor(diff / 1000);
  const days          = Math.floor(totalSeconds / 86400);
  const hours         = Math.floor((totalSeconds % 86400) / 3600);
  const minutes       = Math.floor((totalSeconds % 3600) / 60);
  const seconds       = totalSeconds % 60;

  setCountdownValue(DOM.countdownDays,    days);
  setCountdownValue(DOM.countdownHours,   hours);
  setCountdownValue(DOM.countdownMinutes, minutes);
  setCountdownValue(DOM.countdownSeconds, seconds, true);
}

function setCountdownValue(element, value, animate = false) {
  if (!element) return;

  const formatted = String(value).padStart(2, '0');

  if (element.textContent !== formatted) {
    element.textContent = formatted;

    if (animate) {
      element.classList.remove('countdown-value--ticking');
      void element.offsetWidth; // Force reflow
      element.classList.add('countdown-value--ticking');
    }
  }
}

function showBirthdayMessage() {
  if (!DOM.birthdayCountdown || !DOM.countdownTodayMsg) return;

  DOM.birthdayCountdown.hidden = true;
  DOM.countdownTodayMsg.textContent =
    'Hari ini adalah hari spesialmu! \u2665';
  DOM.countdownTodayMsg.hidden = false;
}

/* ============================================================
   7. GALLERY & LIGHTBOX
   ============================================================ */
function initializeGallery() {
  if (!DOM.galleryGrid) return;

  buildLightboxImageList();

  DOM.galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Buka foto ${index + 1} dalam layar penuh`);

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Lightbox controls
  if (DOM.lightboxCloseBtn) {
    DOM.lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (DOM.lightboxPrevBtn) {
    DOM.lightboxPrevBtn.addEventListener('click', showPreviousPhoto);
  }

  if (DOM.lightboxNextBtn) {
    DOM.lightboxNextBtn.addEventListener('click', showNextPhoto);
  }

  if (DOM.lightboxOverlay) {
    DOM.lightboxOverlay.addEventListener('click', (event) => {
      if (event.target === DOM.lightboxOverlay) closeLightbox();
    });
  }

  // Keyboard support
  document.addEventListener('keydown', handleLightboxKeyboard);
}

function buildLightboxImageList() {
  STATE.lightboxImages = [];

  DOM.galleryItems.forEach(item => {
    const img     = item.querySelector('.gallery-image');
    const caption = item.querySelector('.gallery-caption');

    STATE.lightboxImages.push({
      src:     img ? img.src : '',
      alt:     img ? img.alt : '',
      caption: caption ? caption.textContent : '',
    });
  });
}

function openLightbox(index) {
  if (!DOM.lightboxOverlay) return;

  STATE.lightboxCurrentIndex = index;
  updateLightboxPhoto();

  DOM.lightboxOverlay.hidden = false;
  DOM.lightboxOverlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // Focus close button for accessibility
  setTimeout(() => {
    if (DOM.lightboxCloseBtn) DOM.lightboxCloseBtn.focus();
  }, 50);
}

function closeLightbox() {
  if (!DOM.lightboxOverlay) return;

  DOM.lightboxOverlay.hidden = true;
  document.body.style.overflow = '';

  // Return focus to the gallery item
  const galleryItems = Array.from(DOM.galleryItems);
  if (galleryItems[STATE.lightboxCurrentIndex]) {
    galleryItems[STATE.lightboxCurrentIndex].focus();
  }
}

function showPreviousPhoto() {
  const count = STATE.lightboxImages.length;
  STATE.lightboxCurrentIndex = (STATE.lightboxCurrentIndex - 1 + count) % count;
  updateLightboxPhoto();
}

function showNextPhoto() {
  const count = STATE.lightboxImages.length;
  STATE.lightboxCurrentIndex = (STATE.lightboxCurrentIndex + 1) % count;
  updateLightboxPhoto();
}

function updateLightboxPhoto() {
  const data = STATE.lightboxImages[STATE.lightboxCurrentIndex];
  if (!data || !DOM.lightboxImage) return;

  DOM.lightboxImage.src     = data.src;
  DOM.lightboxImage.alt     = data.alt;

  if (DOM.lightboxCaption) {
    DOM.lightboxCaption.textContent = data.caption;
  }

  if (DOM.lightboxCounter) {
    DOM.lightboxCounter.textContent =
      `${STATE.lightboxCurrentIndex + 1} / ${STATE.lightboxImages.length}`;
  }
}

function handleLightboxKeyboard(event) {
  if (!DOM.lightboxOverlay || DOM.lightboxOverlay.hidden) return;

  switch (event.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      showPreviousPhoto();
      break;
    case 'ArrowRight':
      showNextPhoto();
      break;
  }
}

/* ============================================================
   8. LETTER OPENING
   ============================================================ */
function initializeLetter() {
  if (!DOM.letterOpenButton) return;

  populateLetterDate();
  populateLetterPersonalization();

  DOM.letterOpenButton.addEventListener('click', openLetter);
}

function populateLetterDate() {
  if (!DOM.letterDate) return;

  const today = new Date();
  const options = {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  };

  try {
    DOM.letterDate.textContent = today.toLocaleDateString(
      CONFIG.letterDateLocale,
      options
    );
  } catch {
    DOM.letterDate.textContent = today.toDateString();
  }
}

function populateLetterPersonalization() {
  if (DOM.letterGreeting) {
    DOM.letterGreeting.textContent =
      `Selamat Ulang Tahun, ${CONFIG.herName}.`;
  }

  if (DOM.letterSignature) {
    DOM.letterSignature.textContent = CONFIG.letterSignature;
  }
}

function openLetter() {
  if (STATE.isLetterOpen) return;
  STATE.isLetterOpen = true;

  if (!DOM.letterEnvelope || !DOM.letterContent) return;

  // Animate envelope flap opening
  DOM.letterEnvelope.classList.add('letter-envelope--opening');

  // After envelope closes, show letter content
  setTimeout(() => {
    DOM.letterEnvelope.hidden = true;
    DOM.letterContent.hidden  = false;
    DOM.letterContent.removeAttribute('hidden');
  }, 500);
}

/* ============================================================
   9. WISHES REVEAL (INTERSECTION OBSERVER)
   ============================================================ */
function initializeWishesReveal() {
  if (!DOM.wishCards.length) return;

  const observerOptions = {
    root:       null,
    rootMargin: '0px 0px -80px 0px',
    threshold:  0.15,
  };

  const revealObserver = new IntersectionObserver(
    handleWishCardIntersection,
    observerOptions
  );

  DOM.wishCards.forEach(card => {
    revealObserver.observe(card);
  });
}

function handleWishCardIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card  = entry.target;
      const index = parseInt(card.dataset.wishIndex || '1', 10);
      const delay = (index - 1) * 120;

      setTimeout(() => {
        card.classList.add('is-visible');
      }, delay);
    }
  });
}

/* ============================================================
   10. SURPRISE & GIFT INTERACTION
   ============================================================ */
function initializeSurprise() {
  if (!DOM.giftOpenButton) return;

  populateSurprisePersonalization();

  DOM.giftOpenButton.addEventListener('click', openGift);

  if (DOM.surpriseReplayBtn) {
    DOM.surpriseReplayBtn.addEventListener('click', replaySurprise);
  }
}

function populateSurprisePersonalization() {
  if (DOM.surpriseHeadline) {
    DOM.surpriseHeadline.textContent =
      `Selamat Ulang Tahun, ${CONFIG.herName} \u2665`;
  }
}

function openGift() {
  if (STATE.isSurpriseOpen) return;
  STATE.isSurpriseOpen = true;

  if (!DOM.giftBox) return;

  // Animate gift box
  DOM.giftBox.classList.add('gift-box--opening');

  setTimeout(() => {
    DOM.giftBox.classList.add('gift-box--opened');
  }, 200);

  // Hide button, show message
  setTimeout(() => {
    if (DOM.giftOpenButton) DOM.giftOpenButton.hidden = true;

    if (DOM.surpriseMessage) {
      DOM.surpriseMessage.hidden = false;
      DOM.surpriseMessage.removeAttribute('hidden');
    }

    launchConfetti();
    launchSurpriseHearts();
  }, 600);
}

function replaySurprise() {
  STATE.isSurpriseOpen = false;

  // Reset gift box
  if (DOM.giftBox) {
    DOM.giftBox.classList.remove('gift-box--opening', 'gift-box--opened');
  }

  // Hide message, show button
  if (DOM.surpriseMessage) {
    DOM.surpriseMessage.hidden = true;
  }

  if (DOM.giftOpenButton) {
    DOM.giftOpenButton.hidden = false;
    DOM.giftOpenButton.removeAttribute('hidden');
  }

  // Clear confetti
  clearConfetti();

  // Small delay before re-enabling
  setTimeout(() => {}, 300);
}

function launchSurpriseHearts() {
  const heartSymbols = ['\u2665', '\u2764', '\u2665'];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      spawnFloatingHeart(heartSymbols, 0);
    }, i * 150);
  }
}

/* ============================================================
   11. CONFETTI
   ============================================================ */
function launchConfetti() {
  if (!DOM.confettiLayer) return;

  clearConfetti();

  const colors = [
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-confetti-1').trim() || '#e88ca0',
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-confetti-2').trim() || '#f5cc52',
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-confetti-3').trim() || '#6dbfe0',
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-confetti-4').trim() || '#72c77a',
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-confetti-5').trim() || '#b07dd4',
  ];

  const shapes = ['square', 'circle', 'rect'];

  for (let i = 0; i < CONFIG.confettiCount; i++) {
    setTimeout(() => {
      spawnConfettiPiece(colors, shapes);
    }, i * 18);
  }
}

function spawnConfettiPiece(colors, shapes) {
  if (!DOM.confettiLayer) return;

  const piece = document.createElement('span');
  piece.classList.add('confetti-piece');

  const color    = colors[Math.floor(Math.random() * colors.length)];
  const shape    = shapes[Math.floor(Math.random() * shapes.length)];
  const left     = Math.random() * 100;
  const duration = Math.random() * 3 + 2.5;
  const delay    = Math.random() * 0.5;
  const size     = Math.random() * 8 + 5;
  const rotation = Math.random() * 360;

  let borderRadius = '2px';
  let width  = `${size}px`;
  let height = `${size}px`;

  if (shape === 'circle') {
    borderRadius = '50%';
  } else if (shape === 'rect') {
    width  = `${size * 2}px`;
    height = `${size * 0.5}px`;
  }

  piece.style.cssText = [
    `left: ${left}%`,
    `width: ${width}`,
    `height: ${height}`,
    `background-color: ${color}`,
    `border-radius: ${borderRadius}`,
    `transform: rotate(${rotation}deg)`,
    `animation-duration: ${duration}s`,
    `animation-delay: ${delay}s`,
  ].join(';');

  DOM.confettiLayer.appendChild(piece);

  // Remove after animation
  setTimeout(() => {
    if (piece.parentNode) piece.parentNode.removeChild(piece);
  }, (duration + delay) * 1000 + 200);
}

function clearConfetti() {
  if (!DOM.confettiLayer) return;
  DOM.confettiLayer.innerHTML = '';
}

/* ============================================================
   12. MUSIC PLAYER
   ============================================================ */
function initializeMusicPlayer() {
  if (!DOM.musicToggle || !DOM.birthdayAudio) return;

  // Check if music file is available
  DOM.birthdayAudio.addEventListener('error', handleMusicError);
  DOM.birthdayAudio.addEventListener('canplay', handleMusicReady);

  DOM.birthdayAudio.load();

  DOM.musicToggle.addEventListener('click', toggleMusic);

  // Title from audio metadata
  DOM.birthdayAudio.addEventListener('loadedmetadata', () => {
    const sourceEl = DOM.birthdayAudio.querySelector('source');
    if (sourceEl && DOM.musicTitle) {
      const fileName = sourceEl.src.split('/').pop().replace(/\.[^/.]+$/, '');
      const formatted = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      DOM.musicTitle.textContent = formatted || 'Birthday Song';
    }
  });
}

function handleMusicError() {
  STATE.isMusicAvailable = false;
  // Silently disable music player — no error shown to user
  if (DOM.musicPlayer) {
    DOM.musicPlayer.style.display = 'none';
  }
}

function handleMusicReady() {
  STATE.isMusicAvailable = true;
}

function toggleMusic() {
  if (!STATE.isMusicAvailable) return;

  if (STATE.isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  if (!DOM.birthdayAudio || !STATE.isMusicAvailable) return;

  const playPromise = DOM.birthdayAudio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        STATE.isMusicPlaying = true;
        updateMusicPlayerUI(true);
      })
      .catch(() => {
        // Autoplay blocked — silently fail
        STATE.isMusicPlaying = false;
        updateMusicPlayerUI(false);
      });
  }
}

function pauseMusic() {
  if (!DOM.birthdayAudio) return;

  DOM.birthdayAudio.pause();
  STATE.isMusicPlaying = false;
  updateMusicPlayerUI(false);
}

function updateMusicPlayerUI(isPlaying) {
  if (!DOM.musicToggle || !DOM.musicIcon || !DOM.musicInfo) return;

  DOM.musicToggle.setAttribute('aria-pressed', String(isPlaying));
  DOM.musicToggle.setAttribute(
    'aria-label',
    isPlaying ? 'Jeda musik ulang tahun' : 'Putar musik ulang tahun'
  );

  DOM.musicIcon.textContent = isPlaying ? '\u266B' : '\u266A';

  if (isPlaying) {
    DOM.musicInfo.classList.add('music-info--visible');
  } else {
    DOM.musicInfo.classList.remove('music-info--visible');
  }
}

function attemptMusicAutoplay() {
  if (!DOM.birthdayAudio || !STATE.isMusicAvailable) return;

  // Small delay to let browser settle after user interaction
  setTimeout(() => {
    playMusic();
  }, 1200);
}

/* ============================================================
   13. SMOOTH SCROLLING FOR NAV LINKS
   ============================================================ */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });
}

function handleSmoothScroll(event) {
  const href = this.getAttribute('href');
  if (!href || href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();

  const navHeight = DOM.navContainer ? DOM.navContainer.offsetHeight : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

  window.scrollTo({
    top:      targetTop,
    behavior: 'smooth',
  });
}

/* ============================================================
   PERSONALIZATION — Populate name across all elements
   ============================================================ */
function populatePersonalization() {
  const name = CONFIG.herName;

  if (DOM.heroNameDisplay) {
    DOM.heroNameDisplay.textContent = name;
  }

  if (DOM.footerNameHighlight) {
    DOM.footerNameHighlight.textContent = name;
  }

  // Update document title
  document.title = `Selamat Ulang Tahun, ${name} \u2665`;
}

/* ============================================================
   HERO IMAGE — Graceful fallback for missing image
   ============================================================ */
function initializeHeroImage() {
  const heroPhoto = document.getElementById('hero-photo');
  const heroFrame = heroPhoto ? heroPhoto.closest('.hero-image-frame') : null;

  if (!heroPhoto || !heroFrame) return;

  heroPhoto.addEventListener('error', () => {
    heroPhoto.style.display = 'none';
    heroFrame.querySelector('.hero-image-placeholder').style.display = 'flex';
  });

  heroPhoto.addEventListener('load', () => {
    const placeholder = heroFrame.querySelector('.hero-image-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  });
}

/* ============================================================
   GALLERY IMAGE — Graceful fallback for missing gallery images
   ============================================================ */
function initializeGalleryFallbacks() {
  const galleryImages = document.querySelectorAll('.gallery-image');

  galleryImages.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const placeholder = img.closest('.gallery-image-wrapper')
        ?.querySelector('.gallery-placeholder');
      if (placeholder) placeholder.style.display = 'flex';
    });

    img.addEventListener('load', () => {
      const placeholder = img.closest('.gallery-image-wrapper')
        ?.querySelector('.gallery-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    });
  });
}

/* ============================================================
   14. INITIALIZATION — Entry point
   ============================================================ */
function initializeWebsite() {
  // Prevent scroll during opening
  document.body.style.overflow = 'hidden';

  // Populate names and personalized content
  populatePersonalization();

  // Initialize all modules
  initializeOpeningScreen();
  initializeNavigation();
  initializeCountdown();
  initializeGallery();
  initializeLetter();
  initializeWishesReveal();
  initializeSurprise();
  initializeMusicPlayer();
  initializeSmoothScrolling();
  initializeHeroImage();
  initializeGalleryFallbacks();
}

// Wait for DOM to be fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}
