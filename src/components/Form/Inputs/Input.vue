<template>
  <div class="c-input__block">
    <div :class="['c-input', { 'c-input--invalid': ariaInvalid, 'c-input--filled': isFilled }]">
      <div class="c-input__wrapper">
        <label class="c-input__label" :for="id + '-text'">
          {{ label }}
          <span v-if="placeholder !== ''"> ({{ placeholder }})</span>
        </label>
        <input
          :id="id + '-text'"
          ref="input"
          v-model="inputValue"
          class="c-input__field c-input__text"
          :name="id"
          :autocomplete="autocomplete"
          :type="type"
          :minlength="minlength"
          :maxlength="maxlength"
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

const props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    minlength?: string;
    maxlength?: string;
    ariaInvalid?: boolean;
    id: string;
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

const hasErrors = computed<boolean>(() => props.errors && props.errors.length > 0);
const isFilled = computed<boolean>(() => !isFocused.value && (!props.required || (props.required && !props.isInvalid)));

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;

  if (target) {
    // Reset the validator to prevent to show error when the value changes.
    if (props.resetValidator) props.resetValidator();

    emit('update:modelValue', target.value);
  }
}

function clear() {
  inputValue.value = null;
  emit('update:modelValue', null);
  nextTick(() => {
    input.value?.focus();
  });
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
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';

.c-input__field {
  height: toRem(56);
  padding: toRem(28) toRem(16) toRem(8) toRem(16);
  border-radius: toRem(8);
}
</style>
