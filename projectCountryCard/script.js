'use strict';

class CountryApp {
  // HTML elements
  #btn = document.querySelector('.btn-country');
  #countriesContainer = document.querySelector('.countries');

  // Error Messages
  static #geolocationFailureMsg = 'Cannot determine your location';
  #locationNotFoundMsg = 'Cannot reverse geocode location';
  #countryDataFetchFailureMsg = 'Cannot fetch country data';

  constructor() {
    this.#btn.addEventListener('click', this._btnEventHandler.bind(this));
  }

  // protected methods

  _getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, function (error) {
        reject.bind(this)(
          new Error(`${this.#geolocationFailureMsg}: ${error.message}`)
        );
      });
    });
  }

  _getLocation(position) {
    const { latitude, longitude } = position.coords;
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2be955029ea84d5f9f725d3797af01c1`
    );
  }

  _parseResponse(response, message) {
    if (!response.ok) throw new Error(`${message}:${response.status}`);
    return response.json();
  }

  _getCountryData(data) {
    const countryCode = data.results[0].components['ISO_3166-1_alpha-3'];
    return fetch(`https://restcountries.com/v2/alpha/${countryCode}`);
  }

  _renderCountry(data) {
    const html = `
        <article class="country">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(
                  +data.population / 1000000
                ).toFixed(1)} M people</p>
                <p class="country__row"><span>🗣️</span>${
                  data.languages[0].name
                }</p>
                <p class="country__row"><span>💰</span>${
                  data.currencies[0].name
                }</p>
            </div>
        </article>`;
    this.#countriesContainer.insertAdjacentHTML('beforeend', html);
    this.#countriesContainer.style.opacity = 1;
  }

  _whereAmI() {
    this._getPosition()
      .then(this._getLocation)
      .then(this._parseResponse, this.#locationNotFoundMsg)
      .then(this._getCountryData)
      .then(this._parseResponse, this.#countryDataFetchFailureMsg)
      .then(this._renderCountry.bind(this))
      .catch(error => console.error(error));
  }

  _btnEventHandler() {
    this._whereAmI();
    this.#btn.removeEventListener('click', this._btnEventHandler.bind(this));
  }
}

const app = new CountryApp();
