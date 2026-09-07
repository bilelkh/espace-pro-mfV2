<template>
  <div class="c-input__block">
    <div
      :class="[
        'c-input',
        {
          'c-input--invalid': ariaInvalid,
          'c-input--filled': modelValue
        }
      ]"
    >
      <Listbox v-slot="{ open }" :model-value="modelValue" @update:model-value="handleChange($event)">
        <ListboxLabel class="c-input__label">{{ label }}</ListboxLabel>
        <ListboxButton
          ref="selectButton"
          :class="[
            'c-input__button',
            {
              'c-input__button--open': open
            }
          ]"
          v-bind="{ 'aria-describedby': errorId, 'aria-invalid': !!errorId }"
        >
          <span class="c-input__button__text">{{
            modelValue ? modelValue.title || modelValue.label : placeholder
          }}</span>
          <span class="c-input__button__arrow"></span>
        </ListboxButton>
        <ListboxOptions class="c-input__options">
          <ListboxOption
            v-for="option in options"
            v-slot="{ active, selected }"
            :key="option.id"
            :value="option"
            as="template"
          >
            <li
              class="c-input-results__option"
              :class="{
                'c-input-results__option--active': active,
                'c-input-results__option--selected': selected
              }"
            >
              <p>
                <span>{{ option.title || option.label }}</span>
              </p>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <p v-for="error of errors" :id="errorId" :key="error.$uid" class="input-error">
      <strong class="input-error__message">{{ error.$message }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';
import type { SelectOption } from '@/models/form';
import { computed, ref } from 'vue';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';

const props = withDefaults(
  defineProps<{
    label: string;
    ariaInvalid?: boolean;
    id: string;
    required?: boolean;
    placeholder?: string;
    options: SelectOption[];
    errors: ErrorObject[];
    modelValue: SelectOption | null;
    resetValidator: () => void;
    autocomplete?: string;
  }>(),
  {
    ariaInvalid: false,
    required: false,
    autocomplete: 'off',
    placeholder: '',
    errors: () => []
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectOption): void;
}>();

const selectButton = ref();

const hasErrors = computed(() => props.errors && props.errors.length > 0);
const errorId = computed(() => (hasErrors.value ? `${props.id}-error` : undefined));

function handleChange(option: SelectOption) {
  if (option) {
    if (props.resetValidator) props.resetValidator();
    emit('update:modelValue', option);
  }
}

function focus() {
  (selectButton.value as any)?.el?.focus();
}

defineExpose({
  hasErrors,
  focus
});
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;

.c-input__label {
  position: absolute;
  top: func.toRem(8);
  left: func.toRem(16);
}

.c-input__button {
  width: 100%;
  min-height: func.toRem(56);
  background-color: var.$color-white;
  border: func.toRem(1) solid var.$color-grey-medium-3;
  border-radius: func.toRem(8);
  padding: func.toRem(28) func.toRem(16) func.toRem(8) func.toRem(16);
  font-size: func.toRem(16);
  font-family: var.$font-sarabun-light;
  color: var.$color-grey;
  text-align: left;
}

.c-input__button:focus {
  outline: func.toRem(2) solid var.$color-outline;
  outline-offset: func.toRem(-1);

  .c-input__button__text {
    outline: func.toRem(2) solid var.$color-outline-blue;
    outline-offset: func.toRem(2);
  }
}

[data-whatintent='mouse'] .c-input__button:focus .c-input__button__text,
[data-whatintent='touch'] .c-input__button:focus .c-input__button__text {
  outline: none !important;
}

.c-input__button--open {
  .c-input__button__arrow {
    transform: rotate(180deg);
  }
}

.c-input__button__arrow {
  content: '';
  position: absolute;
  width: func.toRem(11);
  height: func.toRem(8);
  top: calc(50% - #{func.toRem(3)});
  right: func.toRem(15);
  padding: func.toRem(4);
  background: url(var.$path-icons + 'icon-dropdown-arrow.svg') 0 0 no-repeat;
  background-size: cover;
  transition: transform 0.25s ease-in-out;
}

.c-input__options {
  position: absolute;
  z-index: 10;
  background-color: var.$color-white;
  box-shadow: 0 func.toRem(2) func.toRem(6) 0 rgba(var.$color-black, 0.5);
  top: func.toRem(56);
  left: func.toRem(-1);
  width: calc(100% + #{func.toRem(2)});
  max-height: func.toRem(160);
  overflow: auto;
  transition: height 0.3s ease-in-out;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: func.toRem(7);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: func.toRem(4);
    background-color: rgba(var.$color-black, 0.5);
    box-shadow: 0 0 func.toRem(1) rgba(var.$color-white, 0.5);
  }
}

.c-input-results__option {
  display: flex;
  align-items: center;
  font-family: var.$font-sarabun-regular;
  font-size: func.toRem(14);
  color: var.$color-black;
  background-color: var.$color-white;
  padding: func.toRem(10) func.toRem(16);
  cursor: pointer;

  &.active,
  &:hover,
  &:focus {
    background-color: var.$color-green;
    color: var.$color-white;
  }
}

.c-input-results__option--active,
.c-input-results__option--selected {
  background-color: var.$color-green;
  color: var.$color-white;
}

.c-input--invalid .c-input__button {
  border-color: var.$color-red;
}

.c-input--filled {
  .c-input__button {
    border-color: var.$color-green;
  }

  .c-input__label {
    color: var.$color-green;
  }
}
</style>
