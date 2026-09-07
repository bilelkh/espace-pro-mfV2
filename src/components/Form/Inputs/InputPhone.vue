<template>
  <div class="c-input__block">
    <div :class="['c-input', { 'c-input--invalid': ariaInvalid, 'c-input--filled': isFilled }]">
      <div class="c-input__wrapper">
        <label class="c-input__label" :for="id">
          {{ label }}
          <span v-if="placeholder !== ''"> ({{ placeholder }})</span>
        </label>
        <input
          :id="id"
          ref="input"
          :value="inputValue"
          class="c-input__field c-input__text"
          :name="name ?? id"
          :autocomplete="autocomplete"
          type="tel"
          :maxlength="14 + (hasIndicator ? 3 : 0)"
          :placeholder="`Indiquer votre ` + label"
          :aria-required="!!required"
          :aria-invalid="ariaInvalid"
          :aria-describedby="ariaInvalid ? id + '-error' : undefined"
          @focusin="isFocused = true"
          @focusout="isFocused = false"
          @input="handleInput"
        />
      </div>
      <button
        v-if="inputValue && inputValue.length > 0"
        :class="['input-clear', { 'input-clear-green': !ariaInvalid, 'input-clear-red': ariaInvalid }]"
        type="button"
        @click="clear"
      >
        <span class="sr-only">Effacer : {{ label }}</span>
      </button>
    </div>
    <p v-for="error of errors" :id="id + '-error'" :key="error.$uid" class="input-error">
      <strong class="input-error__message">{{ error.$message }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { ErrorObject } from '@vuelidate/core';
import { isSafari } from '@/utils/browser';
import { filterNumberValidChars, hasOnlyNumbers, removeSpace } from '@/utils/strings';

const props = withDefaults(
  defineProps<{
    label: string;
    minlength?: string;
    maxlength?: string;
    ariaInvalid?: boolean;
    id: string;
    name?: string;
    required?: boolean;
    autocomplete?: string;
    placeholder: string;
    isInvalid?: boolean;
    errors: ErrorObject[];
    modelValue: string | null;
    resetValidator: () => void;
  }>(),
  {
    ariaInvalid: false,
    isInvalid: false,
    required: false,
    autocomplete: 'off',
    minlength: '0',
    maxlength: '100',
    errors: () => []
  }
);

const input = ref<HTMLInputElement>();
const inputValue = ref(props.modelValue);
const isFocused = ref(false);
const hasIndicator = ref(false);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

const hasErrors = computed<boolean>(() => props.errors && props.errors.length > 0);
const isFilled = computed<boolean>(() => !isFocused.value && !!inputValue.value && (!props.required || (props.required && !props.isInvalid)));

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;

  if (target) {
    if (props.resetValidator) props.resetValidator();

    const value = filterNumberValidChars(target.value);

    hasIndicator.value = value.charAt(0) === '+';

    target.value = value;

    if (!isValidPhone(removeSpace(value))) {
      inputValue.value = value;
      return;
    }

    const userHasTypedBackspace = inputValue.value ? inputValue.value.length > target.value.length : false;

    let currentIndex = getCurrentCursorIndex(target) || value.length;
    let phoneWithoutSpace = removeSpace(value);

    if (isSafari) {
      const startsWithZero = phoneWithoutSpace.charAt(0) === '0';
      const startsWithPlus = phoneWithoutSpace.charAt(0) === '+';

      if (!startsWithZero && !startsWithPlus) {
        if (phoneWithoutSpace.length === 9) {
          phoneWithoutSpace = '0' + phoneWithoutSpace;
          currentIndex = 13;
        } else if (phoneWithoutSpace.length === 11) {
          phoneWithoutSpace = '+33' + phoneWithoutSpace.slice(2);
          hasIndicator.value = true;
          currentIndex = 17;
        }
      }
    }

    const prefixMatches = phoneWithoutSpace.match(/(?:\+|00)33|0/);
    const prefix: string = !prefixMatches ? phoneWithoutSpace.slice(0, 1) : prefixMatches[0] || '';

    phoneWithoutSpace = phoneWithoutSpace.slice(prefix.length);

    if (phoneWithoutSpace.length === 0) {
      inputValue.value = value;
      return;
    }

    const firstNumber = phoneWithoutSpace.charAt(0);
    phoneWithoutSpace = phoneWithoutSpace.slice(1);

    if (phoneWithoutSpace.length === 0) {
      inputValue.value = hasIndicator.value ? `${prefix} ${firstNumber}` : `${prefix}${firstNumber}`;
      return;
    }

    const remainder =
      phoneWithoutSpace.length % 2 === 0
        ? phoneWithoutSpace.split(/(?=(?:..)*$)/)
        : phoneWithoutSpace.split(/(?=(?:..)*.$)/);

    let result = hasIndicator.value ? `${prefix} ${firstNumber}` : `${prefix}${firstNumber}`;
    for (const r of remainder) {
      result += ` ${r}`;
    }

    inputValue.value = result;

    restoreCursorPosition(target, userHasTypedBackspace ? currentIndex : currentIndex + 1);

    emit('update:modelValue', removeSpace(value));
  }
}

function isValidPhone(value: string): boolean {
  const startsWithPlus = value.charAt(0) === '+';
  return startsWithPlus ? hasOnlyNumbers(value.slice(1)) : hasOnlyNumbers(value);
}

function restoreCursorPosition(inputEl: HTMLInputElement, currentIndex: number) {
  nextTick(() => {
    setTimeout(() => {
      inputEl.setSelectionRange(currentIndex, currentIndex);
    }, 0);
  });
}

function getCurrentCursorIndex(el: HTMLInputElement): number {
  return 'selectionStart' in el ? Number(el.selectionStart) : 0;
}

function clear() {
  inputValue.value = null;
  emit('update:modelValue', null);
}

function focus() {
  input.value?.focus();
}

defineExpose({
  hasErrors,
  focus
});
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;

.c-input__field {
  height: func.toRem(56);
  padding: func.toRem(28) func.toRem(16) func.toRem(8) func.toRem(16);
  border-radius: func.toRem(8);
}
</style>
