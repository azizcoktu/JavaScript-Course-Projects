'use strict';

/*
console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = 'Correct Number!';
console.log(document.querySelector('.message').textContent);
// document.querySelector('.className').textContext 
// is used for manipulating a text inside a class of // the HTML file.
document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 20;

// To get a value inside an input element,
// document.querySelector('.className').value is
// used.
// document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value);
*/

// To wait for a specific event on a class, and
// react to it, we add event listeners, by using
// addEventListener('eventType', eventHandler)
// function.
// Event handler is a function that determines what  // happens when a specific event occurs.

// Generate a random number to be guessed.
let secretNumber = Math.trunc(20 * Math.random()) + 1;
/*
// Show the number for checking the content for now.
document.querySelector('.number').textContent = secretNumber;
*/
// initial score is defined.
let score = 20;
// highscore is defined
let highscore = 0;

function displayMessage(message) {
  document.querySelector('.message').textContent = message;
}

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  //console.log(guess, typeof guess);

  // When there is no input.
  if (!guess) {
    displayMessage('😡No number given!');
    // when player wins.
  } else if (guess === secretNumber) {
    displayMessage('Correct Number!');
    // for selecting the whole element, dot is
    // removed. Dot is used for selecting classes.
    // Following code changes the background color.
    document.querySelector('body').style.backgroundColor = '#60b347';

    // Following code increases the width of the number and reveals it..
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('.number').style.width = '30rem';
    highscore = score >= highscore ? score : highscore;
    document.querySelector('.highscore').textContent = highscore;

    // when the guess is wrong
  } else if (guess !== secretNumber && score > 1) {
    displayMessage(guess > secretNumber ? '📈Too high!' : '📉 Too low!');
    score--;
    document.querySelector('.score').textContent = score;
  } else {
    displayMessage('💣You lost the game.');
    score--;
    document.querySelector('.score').textContent = score;
  }
});

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(20 * Math.random()) + 1;
  score = 20;
  displayMessage('Start guessing...');
  document.querySelector('.number').textContent = '?';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.guess').value = '';
});
