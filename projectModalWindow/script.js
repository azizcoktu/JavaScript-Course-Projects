'use strict';

// elements of the HTML are saved in constant
// variables.
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

// functions for opening/closing modal window
function openModalWindow() {
  // To display the modal window, remove the
  // hidden class of the modal.
  modal.classList.remove('hidden');
  // To display the overlay window, remove the
  // hidden class of the overlay :
  overlay.classList.remove('hidden');
}
function closeModalWindow() {
  // The modal window is hidden.
  modal.classList.add('hidden');
  // The overlay is hidden.
  overlay.classList.add('hidden');
}

// event listeners are add to open modal buttons.
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModalWindow);
// event listener is add in the x in modal window.
btnCloseModal.addEventListener('click', closeModalWindow);
// event listener is add on overlay.
overlay.addEventListener('click', closeModalWindow);
// event listener is added to the document for
// keypress.
document.addEventListener('keydown', function (eventObject) {
  if (eventObject.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModalWindow();
  }
});
