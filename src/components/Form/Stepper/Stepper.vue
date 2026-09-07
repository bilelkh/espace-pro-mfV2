<template>
  <nav class="stepper__block" aria-label="&Eacute;tapes du formulaire nous contacter">
    <ol class="stepper">
      <li
        v-for="(item, index) in stepperList"
        :ref="(el: any) => registerStepItemRef(el, index)"
        :key="`step-${index}`"
        :class="['stepper__item', { 'stepper__item--active': activeStep > index }]"
        :aria-current="isStepActive(index) ? 'step' : false"
        @focusout="() => removeTabindex(index)"
      >
        <div class="stepper__item-circle">
          <div class="stepper__item-ecllipse" />
          <span class="sr-only">&Eacute;tape</span>
          <span class="stepper__item-order">{{ index + 1 }}</span>
        </div>
        <span class="stepper__item-txt">{{ item }}</span>
        <div v-if="index === 0" class="stepper__item-separator" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { forceFocusOnElement } from '@/utils/programmatic-focus';

const props = defineProps<{
  activeStep: number;
}>();

const { tm } = useI18n();

const stepItemRef = ref<Record<string, HTMLDivElement>>({});

const stepperList: string[] = tm('form.stepper');

const isStepActive = computed(() => {
  return (stepIndex: any) => props.activeStep == stepIndex + 1;
});

function registerStepItemRef(el: HTMLDivElement, index: number) {
  stepItemRef.value[`stepItem${index}`] = el;
}

function removeTabindex(index: number) {
  stepItemRef.value[`stepItem${index}`]?.removeAttribute('tabindex');
}

watch(
  () => props.activeStep,
  () => {
    const item: HTMLDivElement = stepItemRef.value[`stepItem${props.activeStep - 1}`];
    if (item) {
      forceFocusOnElement(item, false);
    }
  }
);
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/mixins' as mix;
@use 'src/styles/abstracts/functions' as fn;

.stepper__block {
  order: 1;
}

.stepper {
  display: flex;
  padding: 0;
  list-style: none;
  margin-bottom: fn.toRem(34);
}

.stepper__item {
  display: flex;
  align-items: center;
  margin-right: fn.toRem(13);
  font-family: var.$font-poppins-regular;
}

.stepper__item-circle {
  display: flex;
  margin-right: fn.toRem(11);
  align-items: center;
  justify-content: center;
}

.stepper__item-ecllipse {
  background-color: var.$color-grey-light-2;
  width: fn.toRem(33);
  height: fn.toRem(33);
  border-radius: 100%;
  transition: background-color 0.3s ease-in-out;
}

.stepper__item-order {
  position: absolute;
  color: var.$color-grey-dark;
  font-size: fn.toRem(14);
  line-height: fn.toRem(17);
}

.stepper__item-txt {
  margin-right: fn.toRem(8);
  font-size: fn.toRem(12);
  line-height: fn.toRem(18);
}

.stepper__item-separator {
  background-color: var.$color-primary-base;
  height: fn.toRem(1);

  @include mix.mq-mobile-less {
    min-width: fn.toRem(15);
  }

  @include mix.mq-from-mobile-less {
    min-width: fn.toRem(79);
  }
}

.stepper__item--active .stepper__item-circle {
  border-radius: 100%;
  width: fn.toRem(33);
  height: fn.toRem(33);
}

.stepper__item--active .stepper__item-ecllipse {
  background-color: var.$color-primary-base;
  width: fn.toRem(28);
  height: fn.toRem(28);
}

.stepper__item--active .stepper__item-order {
  color: #ffff;
}

.stepper__item--active .stepper__item-txt {
  color: var.$color-primary-base;
}

.stepper__item[aria-current="step"] {
  .stepper__item-order,
  .stepper__item-txt {
  	text-decoration: underline;
  }
}
</style>
