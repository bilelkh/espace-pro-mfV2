<template>
  <label class="c-checkbox" :for="id">
    <input
      :id="id"
      class="c-checkbox__input"
      type="checkbox"
      :aria-required="!!required"
      :name="id"
      :checked="!!checked"
      @change="handleChange"
    />
    <span class="c-input__text">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  label: string;
  required?: boolean;
  checked?: boolean;
  resetValidator?: () => void;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement;

  if (target) {
    // Reset the validator to prevent to show error when the value changes.
    if (props.resetValidator) props.resetValidator();

    emit('update:modelValue', target.checked ? 'Oui' : 'Non');
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.c-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.c-checkbox__input {
  margin-right: toRem(23);
  appearance: none;
  border-radius: toRem(8);
  border: toRem(2) solid $color-grey-medium-4;
  min-height: toRem(25);
  min-width: toRem(25);
  cursor: pointer;
}

.c-checkbox__input:checked {
  position: relative;
}

.c-checkbox__input:checked::before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: '✔';
  color: $color-green;
}
</style>
