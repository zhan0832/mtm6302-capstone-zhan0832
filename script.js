// elements selectors
const $dateInput      = document.querySelector('.inputbox');
const $featureImg     = document.querySelector('article.feature .feature-media img');
const $featureTitle   = document.querySelector('.feature-title');
const $featureDate    = document.querySelector('.feature-date');
const $featureInfo    = document.querySelector('.info');
const $mainFavBtn     = document.querySelector('article.feature .fav-btn');
const $favsBox        = document.querySelector('.favouritesbox');

// lightbox elements
const $lightbox       = document.getElementById('lightbox');
const $lightboxImg    = $lightbox ? $lightbox.querySelector('.feature-media img') : null;
const $lightboxFavBtn = $lightbox ? $lightbox.querySelector('.fav-btn') : null;

// localStorage key（collection of favourite image URLs）
const STORAGE_KEY = 'potd-favs-basic';

// Current main image URL, used to check if it is favourited
let currentSrc = '';


//Utility function: Date → YYYY-MM-DD 
function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}


// localStorage helpers, get and save favourites list
function getFavs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function saveFavs(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderFavs() {
  const list = getFavs();

  if (!list.length) {
    $favsBox.innerHTML = '<p>No favourites yet.</p>';
    return;
  }

  const html = [];
  for (let i = 0; i < list.length; i++) {
    const src = list[i];
    html.push(`
      <figure>
        <img src="${src}" alt="">
      </figure>
    `);
  }
  $favsBox.innerHTML = html.join('');
}
//renderfavs, updatefavbuttons

// Update the state of favourite buttons based on currentSrc
function updateFavButtons() {
  const list = getFavs();
  const isFav = currentSrc && list.indexOf(currentSrc) !== -1;

  if ($mainFavBtn) {
    $mainFavBtn.classList.toggle('favorited', isFav);
    $mainFavBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
  }
  if ($lightboxFavBtn) {
    $lightboxFavBtn.classList.toggle('favorited', isFav);
    $lightboxFavBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
  }
}


// load image data from Wikimedia API and update the main area
function loadImage(iso) {
  const parts = iso.split('-');
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];

  const url = 'https://api.wikimedia.org/feed/v1/wikipedia/en/featured/' + y + '/' + m + '/' + d;

  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data.image) {
        // No image for this date
        currentSrc = '';
        if ($featureImg) {
          $featureImg.removeAttribute('src');
          $featureImg.alt = '';
        }
        if ($featureTitle) $featureTitle.textContent = 'No featured image';
        if ($featureDate)  $featureDate.textContent  = iso;
        if ($featureInfo)  $featureInfo.textContent  = 'No Picture of the Day for this date.';
        updateFavButtons();
        return;
      }

      const img = data.image;

      // Get image URL: prefer original image, fallback to thumbnail
      let src = '';
      if (img.image && img.image.source) {
        src = img.image.source;
      } else if (img.thumbnail && img.thumbnail.source) {
        src = img.thumbnail.source;
      }

      const title = img.title || '';
      const desc  = img.description && img.description.text ? img.description.text : '';

      currentSrc = src;

      // Update main area
      if ($featureImg) {
        $featureImg.src = src;
        $featureImg.alt = title || 'Picture of the Day';
      }
      if ($featureTitle) $featureTitle.textContent = title;
      if ($featureDate)  $featureDate.textContent  = iso;
      if ($featureInfo)  $featureInfo.textContent  = desc;

      updateFavButtons();
    })
    .catch(function () {
      currentSrc = '';
      if ($featureImg) {
        $featureImg.removeAttribute('src');
        $featureImg.alt = '';
      }
      if ($featureTitle) $featureTitle.textContent = 'Error';
      if ($featureInfo)  $featureInfo.textContent  = 'Something went wrong. Please try again.';
      if ($featureDate)  $featureDate.textContent  = iso;
      updateFavButtons();
    });
}


// Toggle favourite status (currentSrc)
function toggleFavourite() {
  if (!currentSrc) return;

  const list = getFavs();
  const index = list.indexOf(currentSrc);

  if (index === -1) {
    // Not in favourites → add it
    list.push(currentSrc);
  } else {
    // In favourites → remove it
    list.splice(index, 1);
  }

  saveFavs(list);
  renderFavs();
  updateFavButtons();
}


// lightbox open helper

function openLightboxWithSrc(src) {
  if (!$lightbox || !$lightboxImg || !src) return;

  $lightboxImg.src = src;
  $lightboxImg.alt = 'Preview';

  // Sync currentSrc (so the heart icon in the lightbox can be correctly updated)
  currentSrc = src;
  updateFavButtons();

  if (typeof $lightbox.showModal === 'function') {
    $lightbox.showModal();
  } else {
    // Very old browsers don't have showModal, fallback to open attribute
    $lightbox.setAttribute('open', 'open');
  }
}

// Click on dialog blank area to close
if ($lightbox) {
  $lightbox.addEventListener('click', function (event) {
    // Click inside dialog's feature-media area does not close
    const box = $lightbox.querySelector('.feature-media');
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      try { $lightbox.close(); } catch (e) { $lightbox.removeAttribute('open'); }
    }
  });
}


// event listeners for user interactions
// date input change → load image
if ($dateInput) {
  $dateInput.addEventListener('change', function () {
    const iso = $dateInput.value;
    if (iso) loadImage(iso);
  });
}

// main image click → open lightbox
if ($featureImg) {
  $featureImg.addEventListener('click', function () {
    if (!currentSrc) return;
    openLightboxWithSrc(currentSrc);
  });
}

// main area favourite button
if ($mainFavBtn) {
  $mainFavBtn.addEventListener('click', function () {
    toggleFavourite();
  });
}

// lightbox favourite button
if ($lightboxFavBtn) {
  $lightboxFavBtn.addEventListener('click', function () {
    toggleFavourite();
  });
}

// favourites box thumbnail click → open lightbox
if ($favsBox) {
  $favsBox.addEventListener('click', function (event) {
    const img = event.target;
    if (!img || img.tagName !== 'IMG') return;
    const src = img.currentSrc || img.src;
    openLightboxWithSrc(src);
  });
}


// Initialization: Set today, load image, render favourites 
// Set date to today
if ($dateInput) {
  $dateInput.value = getTodayISO();
}
renderFavs();
if ($dateInput && $dateInput.value) {
  loadImage($dateInput.value);
}
