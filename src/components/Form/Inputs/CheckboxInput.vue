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
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.c-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.c-checkbox__input {
  margin-right: func.toRem(23);
  appearance: none;
  border-radius: func.toRem(8);
  border: func.toRem(2) solid var.$color-grey-medium-4;
  min-height: func.toRem(25);
  min-width: func.toRem(25);
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
  color: var.$color-green;
}
</style>
