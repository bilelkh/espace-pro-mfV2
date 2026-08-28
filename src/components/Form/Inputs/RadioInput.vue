<template>
  <div>
    <input
      :id="id"
      class="c-radio__input"
      type="radio"
      :name="name"
      :value="id"
      :checked="!!checked"
      @change="handleChange"
    />
    <label :class="['c-radio', { checked: checked }]" :for="id">
      <span class="c-input__text">{{ label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  name: string;
  required?: boolean;
  checked?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void;
}>();

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target) {
    emit('update:modelValue', target.value);
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.c-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  margin-top: toRem(7);

  @include mq-to-tablet {
    margin-right: toRem(16);
  }

  @include mq-desktop {
    margin-right: toRem(10);
  }
}

.c-radio::before {
  content: '';
  margin-right: toRem(6);
  height: toRem(18);
  width: toRem(18);
  border-radius: 50%;
  border: toRem(2) solid $color-grey-medium-3;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  position: relative;
  top: toRem(-1.5);
  box-sizing: border-box;
}

.c-radio__input {
  border: 0;
  clip: rect(toRem(1), toRem(1), toRem(1), toRem(1));
  clip-path: inset(100%);
  height: toRem(1);
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: toRem(1);
}

.c-radio__input:checked + .c-radio::before {
  border: toRem(5) solid $color-green;
}

[data-whatintent='mouse'] .c-radio__input:focus + .c-radio,
[data-whatintent='touch'] .c-radio__input:focus + .c-radio {
  outline: none !important;
  outline-offset: 0 !important;
}

.c-radio__input:focus + .c-radio {
  outline: toRem(2) solid $color-outline;
  outline-offset: toRem(2);
}

.c-input__text::first-letter {
  text-transform: uppercase;
}
</style>
