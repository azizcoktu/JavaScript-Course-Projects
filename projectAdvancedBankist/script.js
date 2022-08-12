'use strict';

///////////////////////////////////////
// Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navigation = document.querySelector('.nav__links');
const operations = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// functions

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function (e) {
  e.preventDefault();
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const goToSlide = function (slides, curSlide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - curSlide) * 100}%)`)
  );
  // remove the higlight of the dots.
  [...dotContainer.children].forEach(dot =>
    dot.classList.remove('dots__dot--active')
  );
  dotContainer
    .querySelector(`.dots__dot[data-slide = "${curSlide}"]`)
    .classList.add('dots__dot--active');
};

const nextSlide = function () {
  curSlide < maxSlides - 1 ? curSlide++ : (curSlide = 0);
  goToSlide(slides, curSlide);
};

const prevSlide = function () {
  curSlide > 0 ? curSlide-- : (curSlide = maxSlides - 1);
  goToSlide(slides, curSlide);
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const init = function () {
  createDots();
  goToSlide(slides, 0);
};
init();
// event listeners

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  /* // Old way of smooth scrolling
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

  // Modern way of smooth scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* navigation.forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); */

// 1. Add event listener to the common parent element
navigation.addEventListener('click', function (e) {
  e.preventDefault();
  // Match the target
  e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn') &&
    // get the href attribute, and use it for smooth
    // scrolling.
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
});

operations[0].parentElement.addEventListener('click', function (e) {
  e.preventDefault();

  // tab element is selected.
  const target = e.target.closest('.operations__tab');
  // Guard Clause
  if (!target) return;

  // tab is highlighted.
  operations.forEach(op => op.classList.remove('operations__tab--active'));
  target.classList.add('operations__tab--active');
  // content is displayed.
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add('operations__content--active');
});

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// implementing the slider

let curSlide = 0;
let maxSlides = slides.length;

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const { slide } = e.target.dataset;

  goToSlide(slides, slide);
  e.target.classList.add('dots__dot--active');
});
// observers

/* // sticky navigation : old way

const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
 */

// sticky navigation : Intersection Observer API

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});

headerObserver.observe(header);

// Reveal Sections

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
