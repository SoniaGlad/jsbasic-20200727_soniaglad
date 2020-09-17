import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.elem = this.createModal();
    this.closeOnClick();
    document.addEventListener('keydown', (event) => this.closeOnEsc());
  }

  createModal() {
    let modal = document.createElement('div');
    modal.classList.add('modal');

    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal__overlay');
    modal.appendChild(modalOverlay);

    let modalInner = `
      <div class='modal__inner'>
        <div class='modal__header'>
          <button class='modal__close'>
            <img src='/assets/images/icons/cross-icon.svg' alt='close-icon'>
          </button>
          <h3 class='modal__title'></h3>
        </div>
        <div class='modal__body'></div>
      </div>`;
    modal.insertAdjacentHTML('beforeend', modalInner);

    return modal;
  }

  open() {
    let body = document.querySelector('body');
    body.classList.add('is-modal-open');
    body.appendChild(this.elem);
  }

  setTitle(innerTitle) {
    let modalTitle = this.elem.querySelector('.modal__title');
    modalTitle.insertAdjacentHTML('afterbegin', innerTitle);
  }

  setBody(innerBody) {
    let modalBody = this.elem.querySelector('.modal__body');
    modalBody.innerHTML = '';
    modalBody.appendChild(innerBody);
  }

  close() {
    let body = document.querySelector('body');
    body.classList.remove('is-modal-open');

    this.elem.remove();
  }

  closeOnClick() {
    let container = this.elem.querySelector('.modal__inner');

    container.addEventListener('click', (event) => {
      if (event.target.closest('.modal__close')) {
        this.close();
      }
    });
  }

  closeOnEsc() {
    if (event.code === 'Escape') {
      this.close();
    }
  }
}
