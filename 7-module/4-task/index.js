export default class StepSlider {
  constructor({
    steps,
    value = 0
  }) {
    this.steps = steps;
    this.segments = steps - 1;

    this.elem = this.renderSlider();

    this.elem.addEventListener('click', (event) => this.moveOnclick(event));

    let thumb = this.elem.querySelector('.slider__thumb');
    thumb.ondragstart = (event) => false;
    thumb.addEventListener('pointerdown', (event) => this.onPointerDown(event));

    this.setValue(value);
  }

  renderSlider() {
    let slider = document.createElement('div');
    slider.classList.add('slider');

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

  onPointerDown = (event) => {
    event.preventDefault();

    this.elem.classList.add('slider_dragging');

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  };

  onPointerMove = (event) => {
    event.preventDefault();

    let thumb = this.elem.querySelector('.slider__thumb');
    let currentValue = this.elem.querySelector('.slider__value');
    let progress = this.elem.querySelector('.slider__progress');
    let sliderStep = this.elem.querySelector('.slider__steps');
    let isActive = this.elem.querySelector('.slider__step-active');

    let left = this.calcLeftByEvent(event);
    let leftPercents = left * 100;

    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;

    let approximateValue = this.segments * left;

    this.value = Math.round(approximateValue);
    currentValue.innerHTML = this.value;

    if (isActive) {
      isActive.classList.remove('slider__step-active');
    }
    sliderStep.children[this.value].classList.add('slider__step-active');

  };

  calcLeftByEvent(event) {
    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }
    if (leftRelative > 1) {
      leftRelative = 1;
    }

    return leftRelative;
  }

  onPointerUp = () => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);

    this.elem.classList.remove('slider_dragging');

    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');

    let valuePercents = (this.value / this.segments) * 100;

    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;

    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true
      })
    );
  }
}
