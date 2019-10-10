
//** FUNCTION ALIASES
const dGEBI = x => document.getElementById(x);
const dCE = x => document.createElement(x);


//** CONSTANTS
const baseurl = 'https://www.discogs.com';
const baseapiurl = 'https://api.discogs.com';
const authKey = 'JADuVvLxxccaBXBlejir';
const authSecret = 'oBpnLeMlpFmLGfKltCOwByNUvYAHixBB';
const authSuffix = `&key=${authKey}&secret=${authSecret}`;
const testurl = baseurl + '/artists/548616/releases'
const fetchHeader = {
  headers: {
    'User-Agent':'discsearcher/0.1',
    'Authorization': `Discogs key=${authKey}, secret=${authSecret}`,
  }
};
//const fetchHeader = new Headers();

console.log(authSuffix);
console.log(fetchHeader);

//** DOCUMENT VARIABLE GRABS
const lhs = document.getElementById('lhs');
const ulhs = document.getElementById('ulhs');
const llhs = document.getElementById('llhs');
const rhs = document.getElementById('rhs');
const qhs = document.getElementById('qhs');

const inputField = document.getElementById('input-field');
const artistCheckbox = document.getElementById('artist-checkbox');
const releaseCheckbox = document.getElementById('release-checkbox');
const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-results-button');
const prevButton = document.getElementById('previous-page-b');
const nextButton = document.getElementById('next-page-b');
const searchForm = document.getElementById('search-form');

const artistsSection = document.getElementById('artists');
const artistsList = document.getElementById('artists-list');
const mastersSection = document.getElementById('masters');
const mastersList = document.getElementById('masters-list');
const releasesSection = document.getElementById('releases');
const releasesList = document.getElementById('releases-list');

const qhsEls = {
  h2: dGEBI('q-header'),
  img: dGEBI('q-cover-image'),
  labelAndYear: dGEBI('q-label-year'),
  tracklist: dGEBI('q-tracklist')
};


//** EVENT LISTENERS
searchForm.addEventListener('submit', fetchResults);
clearButton.addEventListener('click', clearButtonFunction);
prevButton.addEventListener('click', prevResults);
nextButton.addEventListener('click', nextResults);
artistCheckbox.addEventListener('change', function (e) {
  if (this.checked) { releaseCheckbox.checked = false; }});
releaseCheckbox.addEventListener('change', function(e) {
  if (this.checked) { artistCheckbox.checked = false; }});



let pageNumber = 1;


//** FETCHING
async function fetchResults (e) {
  e.preventDefault();

  clearResults();
  
  let r = await fetch(composeSearchURL(inputField.value), fetchHeader);
  //console.log(r.json());
  displayResults(await r.json());

}






function displayResults (js) {

  //console.log(js.results);
  
  lhs.style.flexGrow = '0';
  lhs.style.flexBasis = '0';
  rhs.style.display = 'block';
  rhs.style.flexGrow = '3';
  rhs.style.flexBasis = 'auto';
  
  for (let r of js.results) {
    let li = document.createElement('li');
    let s = document.createElement('span');
    let discUrl = document.createElement('span');
    let coverImg = document.createElement('img');
    
    li.addEventListener('click', fetchAndDisplayItem);
    s.classList.add('result-item-span');
    discUrl.classList.add('disc-url');
    discUrl.innerText = r.resource_url;
    li.discUrl = r.resource_url;
    li.classList.add('result-item');
    coverImg.classList.add('cover-image');
    coverImg.src = r.cover_image;
    let spans;
    switch (r.type) {
    case 'artist':
      let sp = document.createElement('span');
      sp.classList.add('artist-only-span');
      sp.innerText = r.title;
      s.appendChild(sp);
      li.appendChild(s);
      li.classList.add('artist-item');
      artistsList.appendChild(li);
      break;
    case 'master':
      spans = splitArtistAlbumIntoElements(r.title);
      s.appendChild(spans[0]);
      s.appendChild(spans[1]);
      li.appendChild(s);
      li.classList.add('master-item');
      mastersList.appendChild(li);
      break;
    case 'release':
      spans = splitArtistAlbumIntoElements(r.title);
      s.appendChild(spans[0]);
      s.appendChild(spans[1]);
      li.appendChild(s);
      li.classList.add('release-item');
      releasesList.appendChild(li);
      break;

    }
    li.appendChild(discUrl);
    s.appendChild(coverImg);
  }

}

function prevResults (e) {
  clearResults();
  if (pageNumber === 1) {
    return;
  } else {
    pageNumber--;
    fetchResults(e);
  }
}

function nextResults (e) {
  clearResults();
  pageNumber++;
  fetchResults(e);

}


async function fetchAndDisplayItem (e) {
  qhsClear();
  
  let t = e.target;
  while (t.tagName != 'LI') {
    t = t.parentElement;
  }
  //console.log(t.discUrl + authSuffix);
  let r = await fetch(t.discUrl, fetchHeader);
  let js = await r.json();

  openQhs();
  
  console.log(js);

  if (js.releases_url) {
    displayArtist(js);
  } else if (js.tracklist) {
    displayRelease(js);
  }
  

}

function displayArtist (js) {
  let h2 = dGEBI('q-header');   h2.innerText = js.name;
  let img = dGEBI('q-cover-image');   img.src = js.images[0].resource_url;

  
  // fetch and display releases

  return;
}


function displayRelease (js) { 
  qhsEls.h2.innerText = js.title;
  qhsEls.img.src = js.images[0].resource_url;
  qhsEls.labelAndYear.innerText = `${js.labels[0].name}, ${js.year}`
  for (let t of js.tracklist) {
    let tLi = dCE('li');
    tLi.classList.add('track-item');
    let tPos = dCE('span');          let tTitle = dCE('span');            let tDur = dCE('span');
    tPos.innerText = t.position;     tTitle.innerText = t.title;          tDur.innerText = t.duration;
    tPos.classList.add('track-pos'); tTitle.classList.add('track-title'); tDur.classList.add('track-dur');
    tLi.appendChild(tPos);           tLi.appendChild(tTitle);             tLi.appendChild(tDur);
    qhsEls.tracklist.appendChild(tLi);
  }
  // console.log(tracklist);

  // qhs.appendChild(h2);
  // qhs.appendChild(img);
  // qhs.appendChild(labelAndYear);
  // qhs.appendChild(tracklist);
  

  return;
}





//** OPENING/CLOSING xHS

function openQhs () {
  qhs.style.flexGrow = '3';
  //qhs.style.flexBasis = 'auto';
  lhs.style.flexGrow = '0';
  lhs.style.width = '1rem';
  lhs.addEventListener('mouseover', closeQhs);
  llhs.style.flexGrow = 0;
  document.querySelector('h1').style.display = 'none';
  document.querySelector('form').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
}

function closeQhs (e) {
  qhs.style.flexGrow = '0';
  lhs.style.flexGrow = '0';
  lhs.style.width = 'auto';
  lhs.removeEventListener('mouseover', closeQhs);
  llhs.style.flexGrow = 1;
  document.querySelector('h1').style.display = 'block';
  document.querySelector('form').style.display = 'block';
  document.querySelector('footer').style.display = 'block';
}

function qhsClear () {
  qhsEls.h2.innerHTML = '';
  qhsEls.img.src = '';
  qhsEls.labelAndYear.innerHTML = '';
  // while (qhsEls.tracklist.firstChild) {
  //   qhsEls.tracklist.removeChild(qhsEls.tracklist.firstChild)
  // }
  [...qhsEls.tracklist.children].forEach(y => qhsEls.tracklist.removeChild(y));
}




//** OTHER FUNCTIONS

const composeSearchURL = term => {
  let page = pageNumber !== 0 ? '&page=' + pageNumber : '';
  let typeSuffix = artistCheckbox.checked === true ? '&type=artist' :
      releaseCheckbox.checked === true ? '&type=release' : '';
  return baseapiurl + '/database/search?q='+ term + typeSuffix + page + authSuffix;
}

function composeSearchSpecs () {
}

function clearResults () {
  [...artistsList.children].forEach(y => artistsList.removeChild(y));
  [...mastersList.children].forEach(y => mastersList.removeChild(y));
  [...releasesList.children].forEach(y => releasesList.removeChild(y));
  lhs.style.flexGrow = '3';
  lhs.style.flexBasis = 'auto';
  rhs.style.flexGrow = '0';
  rhs.style.flexBasis = '0';

  qhsClear();
}

function clearButtonFunction () {
  clearResults();
  pageNumber = 1;
  inputField.value = '';
}


function splitArtistAlbumIntoElements (aa) {
  let artistText = aa.split(' - ')[0];
  let releaseText = aa.split(' - ')[1];
  let artistSpan = document.createElement('span');
  let releaseSpan = document.createElement('span');
  artistSpan.classList.add('artist-span');
  releaseSpan.classList.add('release-span');
  artistSpan.innerText = artistText;
  releaseSpan.innerText = releaseText;
  return [artistSpan, releaseSpan];
}
