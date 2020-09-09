import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.createRibbonMenu(categories);
    this.scrollOnClick();
    this.chooseCategoryOnClick();
  }

  // метод по отрисовки ленты меню
  createRibbonMenu(categories) {

    // создаем корневой элемент 
    let ribbon = document.createElement('div');
    ribbon.classList.add('ribbon');

    // создаем стрелочку слева
    let arrowLeft = `
      <button class='ribbon__arrow ribbon__arrow_left'>
        <img src='/assets/images/icons/angle-icon.svg' alt='icon'>
      </button>`;
    ribbon.insertAdjacentHTML('afterbegin', arrowLeft); // prev

    // создаем внутренний контейнер для ленты меню
    let ribbonInner = document.createElement('nav');
    ribbonInner.classList.add('ribbon__inner');
    ribbon.appendChild(ribbonInner);

    // создаем наполнение ленты меню
    categories.forEach((category) => {
      let menuLink = `
        <a href='#' class='ribbon__item' data-id='${category.id}'>${category.name}</a>`;

      ribbonInner.insertAdjacentHTML('beforeend', menuLink);
    });

    // создаем стрелочку справа 
    let arrowRight = `
      <button class='ribbon__arrow ribbon__arrow_right ribbon__arrow_visible'>
        <img src='/assets/images/icons/angle-icon.svg' alt='icon'>
      </button>`;
    ribbon.insertAdjacentHTML('beforeend', arrowRight);

    return ribbon;
  }

  // метод для листания ленты меню
  scrollOnClick() {
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    let prev = this.elem.querySelector('.ribbon__arrow_left');
    let next = this.elem.querySelector('.ribbon__arrow_right');

    prev.addEventListener('click', () => {
      ribbonInner.scrollBy(-350, 0);

      let scrollLeft = ribbonInner.scrollLeft;

      if (scrollLeft === 0) {
        prev.classList.remove('ribbon__arrow_visible'); // remove
      }
      next.classList.add('ribbon__arrow_visible'); // add
    });

    next.addEventListener('click', () => {
      ribbonInner.scrollBy(350, 0);

      let scrollWidth = ribbonInner.scrollWidth;
      let scrollLeft = ribbonInner.scrollLeft;
      let clientWidth = ribbonInner.clientWidth;
      let scrollRight = scrollWidth - scrollLeft - clientWidth;

      if (scrollRight < 1) {
        next.classList.remove('ribbon__arrow_visible'); // remove
      }
      prev.classList.add('ribbon__arrow_visible'); // add
    });
  }

  // метод для подсветки + выбора категории
  chooseCategoryOnClick() {
    let container = this.elem.querySelector('.ribbon__inner');
    let highlighted;

    container.addEventListener('click', (event) => {
      event.preventDefault();

      let category = event.target.closest('.ribbon__item');

      if (highlighted) {
        highlighted.classList.remove('ribbon__item_active');
      }
      highlighted = category;
      highlighted.classList.add('ribbon__item_active');

      if (category) {
        let ribbonSelect = new CustomEvent('ribbon-select', {
          detail: category.dataset.id,
          bubbles: true
        });
        this.elem.dispatchEvent(ribbonSelect);
      }
    });
  }
}
