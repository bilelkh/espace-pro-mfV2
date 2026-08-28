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
          :aria-describedby="errorId"
          :aria-invalid="!!errorId"
          :class="[
            'c-input__button',
            {
              'c-input__button--open': open
            }
          ]"
        >
          {{ modelValue ? modelValue.label : placeholder }}
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
                <span>{{ option.label }}</span>
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
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';

.c-input__label {
  position: absolute;
  top: toRem(8);
  left: toRem(16);
}

.c-input__button {
  width: 100%;
  min-height: toRem(56);
  background-color: $color-white;
  border: toRem(1) solid $color-grey-medium-3;
  border-radius: toRem(8);
  padding: toRem(28) toRem(16) toRem(8) toRem(16);
  font-size: toRem(16);
  font-family: $font-sarabun-light;
  color: $color-grey;
  text-align: left;
}

.c-input__button:focus {
  outline: toRem(2) solid $color-outline;
  outline-offset: toRem(-1);
}

.c-input__button--open {
  .c-input__button__arrow {
    transform: rotate(180deg);
  }
}

.c-input__button__arrow {
  content: '';
  position: absolute;
  width: toRem(11);
  height: toRem(8);
  top: calc(50% - #{toRem(3)});
  right: toRem(15);
  padding: toRem(4);
  background: url($path-icons + 'icon-dropdown-arrow.svg') 0 0 no-repeat;
  background-size: cover;
  transition: transform 0.25s ease-in-out;
}

.c-input__options {
  position: absolute;
  z-index: 10;
  background-color: $color-white;
  box-shadow: 0 toRem(2) toRem(6) 0 rgba($color-black, 0.5);
  top: toRem(56);
  left: toRem(-1);
  width: calc(100% + #{toRem(2)});
  max-height: toRem(160);
  overflow: auto;
  transition: height 0.3s ease-in-out;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: toRem(7);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: toRem(4);
    background-color: rgba($color-black, 0.5);
    box-shadow: 0 0 toRem(1) rgba($color-white, 0.5);
  }
}

.c-input-results__option {
  display: flex;
  align-items: center;
  font-family: $font-sarabun-regular;
  font-size: toRem(14);
  color: $color-black;
  background-color: $color-white;
  padding: toRem(10) toRem(16);
  cursor: pointer;

  &.active,
  &:hover,
  &:focus {
    background-color: $color-green-5;
  }
}

.c-input-results__option--active,
.c-input-results__option--selected {
  background-color: $color-green-5;
}

.c-input--invalid .c-input__button {
  border-color: $color-red;
}

.c-input--filled {
  .c-input__button {
    border-color: $color-green;
  }

  .c-input__label {
    color: $color-green;
  }
}
</style>
