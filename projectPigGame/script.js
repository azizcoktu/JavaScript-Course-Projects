'use strict';

// Selecting elements.
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const btnRoll = document.querySelector('.btn--roll');

// scores are initialized.
score0El.textContent = 0;
score1El.textContent = 0;

// variables are defined.
let scores = [0, 0];
let currentScore = 0;
let activePlayer = 0;
let playing = true;

// functions are defined here.
function switchPlayer() {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
}

// dice is hidden.
diceEl.classList.add('hidden');

// rolling dice functionality.
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Generate a random dice roll.
    const dice = Math.trunc(6 * Math.random()) + 1;

    // 2. Display dice.
    diceEl.src = `dice-${dice}.png`;
    diceEl.classList.remove('hidden');

    // 3.Check for rolled 1: if true, switch to next
    // player.
    if (dice !== 1) {
      // Add dice to the current score.
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // switch to the next player.
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add current score to the active player's score.
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    // 2. Check if the player's score >= 100.
    if (scores[activePlayer] >= 100) {
      // finish the game.
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      diceEl.classList.add('hidden');
    } else {
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', function () {
  // 1. Reset the variables to the initial states.
  scores = [0, 0];
  currentScore = 0;
  playing = true;

  // 2. Screen display to the initial state.
  if (!diceEl.classList.contains('hidden')) diceEl.classList.add('hidden');
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove('player--winner');
  if (!player0El.classList.contains('player--active'))
    player0El.classList.add('player--active');
  if (player1El.classList.contains('player--active'))
    player1El.classList.remove('player--active');
  document.querySelector('.player--0').classList.add('player--active');
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  // 3. Change the active player to 0.
  activePlayer = 0;
});
