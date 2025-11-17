//element selectors

const $dateInput    = document.querySelector('.inputbox');

const $featureImg   = document.querySelector('.feature .feature-media img');
const $featureTitle = document.querySelector('.feature-title');
const $featureDate  = document.querySelector('.feature-date');
const $featureInfo  = document.querySelector('.info');

const $mainFavBtn   = document.querySelector('.feature .fav-btn');
const $favsBox      = document.querySelector('.favouritesbox');

const $lightbox     = document.getElementById('lightbox');
const $lightboxImg  = document.querySelector('#lightbox .feature-media img');
const $lightboxFavBtn = document.querySelector('#lightbox .fav-btn');


// set current image src
let currentSrc = '';

// localStorage key
const STORAGE_KEY = 'potd-favs-basic';


// Utility functions

// get today's date in ISO format (YYYY-MM-DD)
function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}
//utility functions for favourites
// get the favourites array from localStorage
function getFavs() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}

// save favourites array to localStorage
function saveFavs(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}


// render favourites and update favorite button states
function renderFavs() {
  const list = getFavs();

  if (!list.length) {
    $favsBox.innerHTML = '<p>No favourites yet.</p>';
    return;
  }

  const html = [];

  for (let i = 0; i < list.length; i++) {
    const src = list[i];
    html.push(
      '<figure>' +
        '<img src="' + src + '" alt="">' +
      '</figure>'
    );
  }

  $favsBox.innerHTML = html.join('');
}

// update favorite button states based on current image
function updateFavButtons() {
  const list = getFavs();
  let isFav = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i] === currentSrc) {
      isFav = true;
      break;
    }
  }

  if ($mainFavBtn) {
    if (isFav) {
      $mainFavBtn.classList.add('favorited');
      $mainFavBtn.setAttribute('aria-pressed', 'true');
    } else {
      $mainFavBtn.classList.remove('favorited');
      $mainFavBtn.setAttribute('aria-pressed', 'false');
    }
  }

  if ($lightboxFavBtn) {
    if (isFav) {
      $lightboxFavBtn.classList.add('favorited');
      $lightboxFavBtn.setAttribute('aria-pressed', 'true');
    } else {
      $lightboxFavBtn.classList.remove('favorited');
      $lightboxFavBtn.setAttribute('aria-pressed', 'false');
    }
  }
}


//fetch and load image for a given date

function loadImage(iso) {
  const parts = iso.split('-');
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];

  const url = 'https://api.wikimedia.org/feed/v1/wikipedia/en/featured/' +
              y + '/' + m + '/' + d;

  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data.image) {
        currentSrc = '';

        if ($featureImg) {
          $featureImg.removeAttribute('src');
          $featureImg.alt = '';
        }
        if ($featureTitle) {
          $featureTitle.textContent = 'No featured image';
        }
        if ($featureDate) {
          $featureDate.textContent = iso;
        }
        if ($featureInfo) {
          $featureInfo.textContent = 'No Picture of the Day for this date.';
        }

        updateFavButtons();
        return;
      }

      const img = data.image;

      let src = '';
      if (img.image && img.image.source) {
        src = img.image.source;
      } else if (img.thumbnail && img.thumbnail.source) {
        src = img.thumbnail.source;
      }

      let title = '';
      if (img.title) {
        title = img.title;
      }

      let desc = '';
      if (img.description && img.description.text) {
        desc = img.description.text;
      }

      currentSrc = src;

      if ($featureImg) {
        $featureImg.src = src;
        $featureImg.alt = title || 'Picture of the Day';
      }
      if ($featureTitle) {
        $featureTitle.textContent = title;
      }
      if ($featureDate) {
        $featureDate.textContent = iso;
      }
      if ($featureInfo) {
        $featureInfo.textContent = desc;
      }

      updateFavButtons();
    })
    .catch(function () {
      currentSrc = '';

      if ($featureImg) {
        $featureImg.removeAttribute('src');
        $featureImg.alt = '';
      }
      if ($featureTitle) {
        $featureTitle.textContent = 'Error';
      }
      if ($featureInfo) {
        $featureInfo.textContent = 'Something went wrong. Please try again.';
      }
      if ($featureDate) {
        $featureDate.textContent = iso;
      }

      updateFavButtons();
    });
}


//toggle favourite status for current image

function toggleFavourite() {
  if (!currentSrc) {
    return;
  }

  const list = getFavs();
  let index = -1;

  for (let i = 0; i < list.length; i++) {
    if (list[i] === currentSrc) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    list.push(currentSrc);
  } else {
    list.splice(index, 1);
  }

  saveFavs(list);
  renderFavs();
  updateFavButtons();
}


// open lightbox with given image src

function openLightboxWithSrc(src) {
  if (!src) return;

  $lightboxImg.src = src;
  $lightboxImg.alt = 'Picture preview';

  currentSrc = src;
  updateFavButtons();

  $lightbox.showModal();  
}


// close lightbox when clicking outside the image
$lightbox.addEventListener('click', function (event) {
  if (event.target === $lightbox) {
    $lightbox.removeAttribute('open');
  }
});



// Event listeners
// change date input → load image
$dateInput.addEventListener('change', () => {
  loadImage($dateInput.value);
});


// click on main image → open lightbox
$featureImg.addEventListener('click', () => {
  if (currentSrc) {
    openLightboxWithSrc(currentSrc);
  }
});


// main area favourite button
$mainFavBtn.addEventListener('click', function () {
  toggleFavourite();
});


// lightbox favourite button
$lightboxFavBtn.addEventListener('click', function () {
  toggleFavourite();
});


// click on favourite thumbnails → open lightbox
$favsBox.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    openLightboxWithSrc(e.target.src);
  }
});

// Initialization

document.addEventListener('DOMContentLoaded', function () {
  if ($dateInput) {
    const today = getTodayISO();
    $dateInput.value = today;
    loadImage(today);
  }

  renderFavs();
});
