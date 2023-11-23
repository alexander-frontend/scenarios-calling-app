<template>
  <div :class="`slider range-slider`" ref="slider"></div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue';
import rangeSlider from 'range-slider-input';
import 'range-slider-input/dist/style.css';
import '../assets/range_slider/styles.scss';

const props = defineProps({
  user: { type: Object },
});

const slider = ref(null);
let sliderObj = ref(null);

const { user } = toRefs(props);

watch(user, () => {
  sliderObj.value([user.value.min, user.value.max]);

  setSliderRangeText(slider);
});

onMounted(() => {
  initSlider();
});

const setSliderRangeText = (slider) => {
  slider.value.querySelector('.range-slider__range').innerText = '';

  slider.value
    .querySelector('.range-slider__range')
    .insertAdjacentHTML(
      'beforeend',
      `<span>${user.value.number}</span> <span>(${user.value.name})</span>`
    );
};

const getSliderThumb = (slider, el) => {
  return slider.value.querySelector(el);
};

const opts = {
  min: 0,
  max: 120,
  value: [user.value.min || 0, user.value.max || 120],
  onThumbDragStart: () => {},
  onThumbDragEnd: () => {},
  onRangeDragStart: () => {},
  onRangeDragEnd: () => {},
};

const initSlider = () => {
  sliderObj = rangeSlider(slider.value, opts);

  const sliderThumbsArr = [
    getSliderThumb(slider, '[data-lower]'),
    getSliderThumb(slider, '[data-upper]'),
  ];

  for (let i = 0; i < sliderThumbsArr.length; i++) {
    const sliderTooltip = document.createElement('div');
    sliderTooltip.classList.add('range-slider__tooltip');
    sliderTooltip.innerText = sliderObj.value()[i] + 'с';

    sliderThumbsArr[i].appendChild(sliderTooltip);
  }

  setSliderRangeText(slider);

  opts.onInput = () => {
    const sliderThumbsArr = [
      getSliderThumb(slider, '[data-lower]'),
      getSliderThumb(slider, '[data-upper]'),
    ];

    for (let i = 0; i < sliderThumbsArr.length; i++) {
      sliderThumbsArr[i].querySelector('.range-slider__tooltip').innerHTML =
        sliderObj.value()[i] + 'с';
    }

    [user.value.min, user.value.max] = sliderObj.value();
  };
};
</script>

<style scoped lang="scss"></style>
