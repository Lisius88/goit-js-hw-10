import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

// https://restcountries.com/v3.1/name/
const info = document.querySelector('.country-info');
const list = document.querySelector('.country-list');
const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  resetMarkup();

  const inputStr = e.target.value.trim();

  if (!inputStr) {
    resetMarkup();
    return;
  }

  fetchCountries(inputStr)
    .then(country => {
      console.log(country[0]);

      if (country.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (country.length >= 2 && country.length <= 10) {
        country.map(createMarkupForCountries);
        return;
      }

      createMarkupForCountry(country[0]);
      return;
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupForCountry(country) {
  const markupFirst = `<h1><img src="${country.flags.svg}" alt="${
    country.name.official
  }"width="50px" height="30px">${country.name.official}</h1>
  <p>Capital: ${country.capital}</p>
  <p>Population: ${country.population}</p>
  <p>Languages: ${Object.values(country.languages)}</p>`;
  info.insertAdjacentHTML('beforeend', markupFirst);
}

function createMarkupForCountries(country) {
  const markupSecond = `<li>
  <h2><img src="${country.flags.svg}" alt="${country.name.official}" width="50px" height="30px"><span class="country-name">${country.name.official}</span></h2>
</li>`;
  list.insertAdjacentHTML('beforeend', markupSecond);
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return resp.json();
  });
}

function resetMarkup() {
  list.innerHTML = '';
  info.innerHTML = '';
}
