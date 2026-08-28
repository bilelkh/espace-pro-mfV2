<template>
  <section class="container quizz-form">
    <div class="quizz-form__stepper">
      <div class="quizz-form__stepper-container">
        <div class="quizz-form__stepper-line" :style="'width:' + getStepperpercent() + '%;'" />
      </div>
      <div class="quizz-form__stepper-step">
        <img :src="getFingerPicture()" alt="" />
        {{ activeStep }}/{{ stepperTotalSteps }}
      </div>
    </div>
    <div class="quizz-form__form">
      <h1 class="quizz-form__title">
        {{ getTitle() }}
      </h1>
      <form>
        <div v-if="activeStep === 1" class="activity">
          <RadioInput
            v-for="option in activityOptions"
            :id="option.id"
            :key="option.id"
            v-model="quizzFormStore.activity"
            name="activity"
            :label="option.label"
            :checked="quizzFormStore.activity === option.id"
            @change="changeActiveStep"
          />
        </div>
        <div v-if="activeStep === 2" class="distributionChannel">
          <RadioInput
            v-for="option in distributionChannelOptions"
            :id="option.id"
            :key="option.id"
            v-model="quizzFormStore.distributionChannel"
            name="distributionChannel"
            :label="option.label"
            :checked="quizzFormStore.distributionChannel === option.id"
            @change="changeActiveStep"
          />
        </div>
        <div v-if="activeStep === 3" class="cart">
          <RadioInput
            v-for="option in cartOptions"
            :id="option.id"
            :key="option.id"
            v-model="quizzFormStore.cart"
            name="cart"
            :label="option.label"
            :checked="quizzFormStore.cart === option.id"
            @change="changeActiveStep"
          />
        </div>
        <div v-if="activeStep === 4" class="clients">
          <RadioInput
            v-for="option in clientsOptions"
            :id="option.id"
            :key="option?.id"
            v-model="quizzFormStore.clients"
            name="clients"
            :label="option.label"
            :checked="quizzFormStore.clients === option.id"
            @change="submitContactForm"
          />
        </div>
      </form>
      <div v-if="activeStep > 1" class="quizz-form__button" @click="goBackActiveStep()">
        <button class="button btn-secondary">
          <em class="chevron chevron--left" />
          <span class="quizz-form__button-text" aria-hidden="false">{{ $t('quizz.gobacklink') }}</span>
        </button>
      </div>
    </div>
    <div class="quizz-form__img">
      <img :src="`${espaceProConfig.baseResourcesUrl}/${$t('quizz.picture.src')}`" :alt="$t('quizz.picture.alt')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import RadioInput from '@/components/Form/Inputs/RadioInput.vue';

import { useQuizzFormStore } from '@/stores/quizzForm';
import { espaceProConfig } from '@/config/config';
import type { QuizzOption } from '@/models/form';

const { t, tm } = useI18n();

const quizzFormStore = useQuizzFormStore();

const activeStep = ref(1);
const stepperTotalSteps = 4;

const activityOptions: QuizzOption[] = tm('quizz.step1.options');
const distributionChannelOptions: QuizzOption[] = tm('quizz.step2.options');
const cartOptions: QuizzOption[] = tm('quizz.step3.options');
const clientsOptions: QuizzOption[] = tm('quizz.step4.options');

function getTitle() {
  switch (activeStep.value) {
    case 1:
      return t('quizz.step1.title');
    case 2:
      return t('quizz.step2.title');
    case 3:
      return t('quizz.step3.title');
    case 4:
      return t('quizz.step4.title');
    default:
      return t('quizz.step1.title');
  }
}

function getStepperpercent() {
  return activeStep.value * 25;
}
function getFingerPicture() {
  return `/src/assets/images/icons/icon-finger${activeStep.value}.svg`;
}

function changeActiveStep() {
  activeStep.value++;
}

function goBackActiveStep() {
  activeStep.value--;
}

async function submitContactForm() {
  // GET request using fetch with async/await
  const requestOptions = {
    method: 'GET'
  };

  let url = window.formAction ? window.formAction : '#';
  url += `?activity=${quizzFormStore.activity}&distributionChannel=${quizzFormStore.distributionChannel}&cart=${quizzFormStore.cart}&clients=${quizzFormStore.clients}`;

  await fetch(url, requestOptions);
}
</script>

<style scoped lang="scss">
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.quizz-form {
  @include mq-mobile {
    text-align: center;
  }

  @include mq-tablet {
    text-align: center;
  }

  @include mq-desktop {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: toRem(40);
  }
}

.quizz-form__stepper {
  display: flex;
  align-items: center;
  box-shadow: 0 toRem(4) toRem(20) rgba(0, 0, 0, 0.07);
  border-radius: toRem(70);
  padding: toRem(11) toRem(12);
  max-width: fit-content;

  @include mq-mobile {
    margin: toRem(27) auto toRem(24);
  }

  @include mq-tablet {
    margin: toRem(27) auto toRem(24);
  }
}

.quizz-form__stepper-container {
  background-color: $bg-color-blue-light;
  width: toRem(415);
  height: toRem(10);
}

.quizz-form__stepper-line {
  background-color: $color-green;
  height: toRem(10);
  box-shadow: 0 toRem(4) toRem(20) rgba(0, 0, 0, 0.07);
  border-radius: toRem(70);
}

.quizz-form__stepper-step {
  display: flex;
  font-family: $font-poppins-regular;
  font-size: toRem(12);
  line-height: toRem(18);
  color: $color-grey-dark;
  margin-left: toRem(11);

  img {
    height: toRem(18);
    width: toRem(18);
    margin-right: toRem(8);
  }
}

.quizz-form__form {
  @include mq-desktop {
    grid-column-start: 1;
    grid-column-end: 7;
  }
}

.quizz-form__img {
  img {
    width: 100%;
  }

  @include mq-mobile {
    margin-top: toRem(32);
  }
  @include mq-desktop {
    grid-column-start: 8;
    grid-column-end: 12;
    place-self: center;
  }
}

.quizz-form__title {
  margin-bottom: toRem(32);
}

.quizz-form__button {
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;

  img {
    height: toRem(10);
  }
}

.quizz-form__button-text {
  margin-left: toRem(5);
}

.quizz-form__button .chevron--left {
  transform: rotate(-135deg);
  border-style: solid;
  border-width: toRem(2) toRem(2) 0 0;
  width: toRem(8);
  height: toRem(8);
}

.quizz-form__button .btn-secondary {
  display: flex;
  align-items: center;
  font-family: $font-sarabun-regular;
  text-transform: none;
  border-radius: toRem(6);
  cursor: pointer;
  transition: 0.25s ease-in-out;
  background-color: $color-white;
  border: toRem(1) solid $color-pink;
  color: $color-pink;
  font-size: toRem(14);
  padding: toRem(15) toRem(38);

  &:hover {
    box-shadow: 0 toRem(4) toRem(10) rgb(221 3 81 / 25%);
    background-color: $color-white;
  }
}
</style>

<style lang="scss">
@import 'src/styles/abstracts/functions';

.quizz-form .c-radio {
  cursor: pointer;
  margin: toRem(15) 0;
  border: toRem(1) solid $color-grey-light-2;
  border-radius: toRem(16);
  padding: toRem(16);
}

.quizz-form .c-radio__input {
  height: toRem(24);
  width: toRem(24);
}

.quizz-form .c-radio.checked {
  border: toRem(1) solid $color-green;
}
</style>
