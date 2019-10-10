
//** CONSTANTS
const baseurl = 'https://www.discogs.com';
const baseapiurl = 'https://api.discogs.com';
const urlsuffix = '&key=JADuVvLxxccaBXBlejir&secret=oBpnLeMlpFmLGfKltCOwByNUvYAHixBB';
// const testurl = baseurl + '/artists/548616/releases'

//** DOCUMENT VARIABLE GRABS
const inputField = document.getElementById('input-field');
const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-results-button');
const searchForm = document.getElementById('search-form');

const artistsSection = document.getElementById('artists');
const artistsList = document.getElementById('artists-list');
const mastersSection = document.getElementById('masters');
const mastersList = document.getElementById('masters-list');
const releasesSection = document.getElementById('releases');
const releasesList = document.getElementById('releases-list');

//** EVENT LISTENERS
searchForm.addEventListener('submit', fetchResults);
clearButton.addEventListener('click', clearResults);



//** FETCHING
function fetchResults (e) {
  e.preventDefault();

  fetch(composeURL(inputField.value), {'User-Agent':'discsearcher/0.1'})
    .then(r => r.json())
    .then(js => displayResults(js))

}






function displayResults (js) {
  console.log(js.results);
  for (let r of js.results) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    let coverImg = document.createElement('img');
    
    a.href = baseurl + r.uri;
    li.classList.add('result-item');
    coverImg.classList.add('cover-image');
    coverImg.src = r.cover_image;
    let spans;
    switch (r.type) {
    case 'artist':
      a.innerText = r.title;
      li.appendChild(a);
      li.classList.add('artist-item');
      artistsList.appendChild(li);
      break;
    case 'master':
      spans = splitArtistAlbumIntoElements(r.title);
      a.appendChild(spans[0]);
      a.appendChild(spans[1]);
      li.appendChild(a);
      li.classList.add('master-item');
      mastersList.appendChild(li);
      break;
    case 'release':
      spans = splitArtistAlbumIntoElements(r.title);
      a.appendChild(spans[0]);
      a.appendChild(spans[1]);
      li.appendChild(a);
      li.classList.add('release-item');
      releasesList.appendChild(li);
      break;

    }
    a.appendChild(coverImg);
  }

}



function displayRelease (js) {

}






//** OTHER FUNCTIONS

const composeURL = term => baseapiurl + '/database/search?q='+ term + urlsuffix;

function composeSearchSpecs () {
}

function clearResults () {
  [...artistsList.children].forEach(y => artistsList.removeChild(y));
  [...mastersList.children].forEach(y => mastersList.removeChild(y));
  [...releasesList.children].forEach(y => releasesList.removeChild(y));
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
