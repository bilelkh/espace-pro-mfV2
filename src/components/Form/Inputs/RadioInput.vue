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
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.c-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  margin-top: func.toRem(7);

  @include mix.mq-to-tablet {
    margin-right: func.toRem(16);
  }

  @include mix.mq-desktop {
    margin-right: func.toRem(10);
  }
}

.c-radio::before {
  content: '';
  margin-right: func.toRem(6);
  height: func.toRem(18);
  width: func.toRem(18);
  border-radius: 50%;
  border: func.toRem(2) solid var.$color-black;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  position: relative;
  top: func.toRem(-1.5);
  box-sizing: border-box;
}

.c-radio__input {
  border: 0;
  clip: rect(func.toRem(1), func.toRem(1), func.toRem(1), func.toRem(1));
  clip-path: inset(100%);
  height: func.toRem(1);
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: func.toRem(1);
}

.c-radio__input:checked + .c-radio::before {
  border: func.toRem(5) solid var.$color-green;
}

[data-whatintent='mouse'] .c-radio__input:focus + .c-radio,
[data-whatintent='touch'] .c-radio__input:focus + .c-radio {
  outline: none !important;
  outline-offset: 0 !important;
}

.c-radio__input:focus + .c-radio {
  outline: func.toRem(2) solid var.$color-outline;
  outline-offset: func.toRem(2);
}

.c-input__text::first-letter {
  text-transform: uppercase;
}
</style>
