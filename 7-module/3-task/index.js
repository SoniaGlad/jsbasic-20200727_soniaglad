import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({
    steps,
    value = 0
  }) {
    this.steps = steps;
    this.segments = steps - 1;

    this.elem = this.renderSlider();
    this.elem.addEventListener('click', (event) => this.moveOnclick(event));
    this.setValue(value);
  }

  // метод по отрисовке пошагового слайдера
  renderSlider() {

    // создаем корневой элемент
    let slider = document.createElement('div');
    slider.classList.add('slider');

    // создаем наполнение слайдера
    let sliderInner = `
        <div class='slider__thumb'>
          <span class='slider__value'></span>
        </div>
        
        <div class='slider__progress'></div>
  
        <div class='slider__steps'>
        ${'<span></span>'.repeat(this.steps)}
        </div>`;

    slider.insertAdjacentHTML('afterbegin', sliderInner);

    return slider;
  }

  setValue(value) {
    this.value = value;

    let valuePercents = (value / this.segments) * 100;
    let thumb = this.elem.querySelector('.slider__thumb');
    let currentValue = this.elem.querySelector('.slider__value');
    let progress = this.elem.querySelector('.slider__progress');
    let sliderStep = this.elem.querySelector('.slider__steps');
    let isActive = this.elem.querySelector('.slider__step-active');

    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;
    currentValue.innerHTML = value;

    if (isActive) {
      isActive.classList.remove('slider__step-active');
    }
    sliderStep.children[this.value].classList.add('slider__step-active');
  }

  moveOnclick(event) {
    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let approximateValue = this.segments * leftRelative;
    this.setValue(Math.round(approximateValue));

    let sliderChange = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    })
    this.elem.dispatchEvent(sliderChange);
  }
}
