// 选取元素
const $feature = document.querySelector('.feature-media');
const $title = document.querySelector('.feature-title');
const $desc = document.querySelector('.info') || document.querySelector('.description');
const $date = document.querySelector('.search-by-date .inputbox');
const $add = document.getElementById('add-btn');
const $favs = document.querySelector('.favouritesbox');

// 设置默认日期为今天
const today = new Date();
$date.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

// 第一次加载当天图片
loadImage($date.value);

// 当选择日期时重新加载
$date.addEventListener('change', () => {
  loadImage($date.value);
});

// 点击“Add to favourites”添加收藏
$add.addEventListener('click', (e) => {
  e.preventDefault();
  const favImg = document.querySelector('.feature-media img');
  if (!favImg) return;

  const html = [];
  html.push(`<figure><img src="${favImg.src}" alt="${favImg.alt}"></figure>`);
  $favs.innerHTML += html.join('');
});

// 用 fetch 获取图片数据
function loadImage(dateString){
  const d = new Date(dateString);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');

  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${y}/${m}/${day}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const image = data.image;
      const html = [];

      if(!image){
        html.push(`<p>No image for this date</p>`);
        $feature.innerHTML = html.join('');
        $title.textContent = '';
        $desc.textContent = '';
        return;
      }

      const src = image.image?.source || image.thumbnail?.source || '';
      const alt = image.description?.text || image.title || 'Featured image';

      // 用 html.push 构建结构
      html.push(`
        <img src="${src}" alt="${alt}">
      `);

      // 更新页面
      $feature.innerHTML = html.join('');
      $title.textContent = image.title || 'Featured Image';
      $desc.textContent = image.description?.text || '';
    })
    .catch(err => {
      console.error(err);
      $feature.innerHTML = '<p>Error loading image</p>';
      $title.textContent = '';
      $desc.textContent = '';
    });
}
