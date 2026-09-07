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
            name="activity"
            :label="option.label"
            :checked="quizzFormStore.activity === option.id"
            @update:model-value="(value: string) => { quizzFormStore.activity = value; changeActiveStep(); }"
          />
        </div>
        <div v-if="activeStep === 2" class="distributionChannel">
          <RadioInput
            v-for="option in distributionChannelOptions"
            :id="option.id"
            :key="option.id"
            name="distributionChannel"
            :label="option.label"
            :checked="quizzFormStore.distributionChannel === option.id"
            @update:model-value="(value: string) => { quizzFormStore.distributionChannel = value; changeActiveStep(); }"
          />
        </div>
        <div v-if="activeStep === 3" class="cart">
          <RadioInput
            v-for="option in cartOptions"
            :id="option.id"
            :key="option.id"
            name="cart"
            :label="option.label"
            :checked="quizzFormStore.cart === option.id"
            @update:model-value="(value: string) => { quizzFormStore.cart = value; changeActiveStep(); }"
          />
        </div>
        <div v-if="activeStep === 4" class="clients">
          <RadioInput
            v-for="option in clientsOptions"
            :id="option.id"
            :key="option?.id"
            name="clients"
            :label="option.label"
            :checked="quizzFormStore.clients === option.id"
            @update:model-value="(value: string) => { quizzFormStore.clients = value; submitContactForm(); }"
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
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.quizz-form {
  @include mix.mq-mobile {
    text-align: center;
  }

  @include mix.mq-tablet {
    text-align: center;
  }

  @include mix.mq-desktop {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: func.toRem(40);
  }
}

.quizz-form__stepper {
  display: flex;
  align-items: center;
  box-shadow: 0 func.toRem(4) func.toRem(20) rgba(0, 0, 0, 0.07);
  border-radius: func.toRem(70);
  padding: func.toRem(11) func.toRem(12);
  max-width: fit-content;

  @include mix.mq-mobile {
    margin: func.toRem(27) auto func.toRem(24);
  }

  @include mix.mq-tablet {
    margin: func.toRem(27) auto func.toRem(24);
  }
}

.quizz-form__stepper-container {
  background-color: var.$bg-color-blue-light;
  width: func.toRem(415);
  height: func.toRem(10);
}

.quizz-form__stepper-line {
  background-color: var.$color-green;
  height: func.toRem(10);
  box-shadow: 0 func.toRem(4) func.toRem(20) rgba(0, 0, 0, 0.07);
  border-radius: func.toRem(70);
}

.quizz-form__stepper-step {
  display: flex;
  font-family: var.$font-poppins-regular;
  font-size: func.toRem(12);
  line-height: func.toRem(18);
  color: var.$color-grey-dark;
  margin-left: func.toRem(11);

  img {
    height: func.toRem(18);
    width: func.toRem(18);
    margin-right: func.toRem(8);
  }
}

.quizz-form__form {
  @include mix.mq-desktop {
    grid-column-start: 1;
    grid-column-end: 7;
  }
}

.quizz-form__img {
  img {
    width: 100%;
  }

  @include mix.mq-mobile {
    margin-top: func.toRem(32);
  }
  @include mix.mq-desktop {
    grid-column-start: 8;
    grid-column-end: 12;
    place-self: center;
  }
}

.quizz-form__title {
  margin-bottom: func.toRem(32);
}

.quizz-form__button {
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;

  img {
    height: func.toRem(10);
  }
}

.quizz-form__button-text {
  margin-left: func.toRem(5);
}

.quizz-form__button .chevron--left {
  transform: rotate(-135deg);
  border-style: solid;
  border-width: func.toRem(2) func.toRem(2) 0 0;
  width: func.toRem(8);
  height: func.toRem(8);
}

.quizz-form__button .btn-secondary {
  display: flex;
  align-items: center;
  font-family: var.$font-sarabun-regular;
  text-transform: none;
  border-radius: func.toRem(6);
  cursor: pointer;
  transition: 0.25s ease-in-out;
  background-color: var.$color-white;
  border: func.toRem(1) solid var.$color-pink;
  color: var.$color-pink;
  font-size: func.toRem(14);
  padding: func.toRem(15) func.toRem(38);

  &:hover {
    box-shadow: 0 func.toRem(4) func.toRem(10) rgb(221 3 81 / 25%);
    background-color: var.$color-white;
  }
}
</style>

<style lang="scss">
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/variables' as var;

.quizz-form .c-radio {
  cursor: pointer;
  margin: func.toRem(15) 0;
  border: func.toRem(1) solid var.$color-grey-light-2;
  border-radius: func.toRem(16);
  padding: func.toRem(16);
}

.quizz-form .c-radio__input {
  height: func.toRem(24);
  width: func.toRem(24);
}

.quizz-form .c-radio.checked {
  border: func.toRem(1) solid var.$color-green;
}
</style>
