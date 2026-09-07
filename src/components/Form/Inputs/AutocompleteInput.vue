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
      <Combobox :model-value="modelValue" @update:model-value="handleUpdateModelValue($event)">
        <ComboboxLabel class="c-input__label">{{ label }}</ComboboxLabel>
        <ComboboxInput
          ref="autocompleteInput"
          :class="['c-input__button']"
          :display-value="(city: unknown) => (city ? (city as ICAutocomplete).label : '')"
          v-bind="{ placeholder, 'aria-describedby': errorId, 'aria-invalid': !!errorId }"
          @change="handleInputChange"
        />
        <ComboboxOptions class="c-input__options">
          <ComboboxOption
            v-for="(city, index) in displayedCities"
            :key="`${city.code}_${index}`"
            v-slot="{ active, selected }"
            as="template"
            :value="city"
          >
            <li
              class="c-input__option"
              :class="{
                'c-input__option--active': active,
                'c-input__option--selected': selected
              }"
            >
              {{ city.label }}
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </Combobox>
      <button
        v-if="modelValue && modelValue.code"
        :class="['input-clear', { 'input-clear-green': !ariaInvalid, 'input-clear-red': ariaInvalid }]"
        type="button"
        @click="clear"
      >
        <span class="sr-only">Effacer : {{ label }}</span>
      </button>
    </div>
    <p v-for="error of errors" :id="errorId" :key="error.$uid" class="input-error">
      <strong class="input-error__message">{{ error.$message }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getCities } from '@/mixins/autocomplete';
import type { ICAutocomplete } from '@/models/cautocomplete';
import { Combobox, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import type { ErrorObject } from '@vuelidate/core';
import { ICAutocompleteExcludedCode } from '@/models/cautocomplete';

const props = withDefaults(
  defineProps<{
    label: string;
    ariaInvalid?: boolean;
    id: string;
    required?: boolean;
    autocomplete?: string;
    placeholder: string;
    errors: ErrorObject[];
    modelValue: ICAutocomplete | null;
    resetValidator: () => void;
  }>(),
  {
    ariaInvalid: false,
    required: false,
    autocomplete: 'off',
    errors: () => []
  }
);

const cities = ref<ICAutocomplete[]>([]);

const loadingResults = ref(false);
const autocompleteInput = ref();

const minChars = 1;

let lastValue: string | null = null;

const emit = defineEmits<{
  (e: 'update:modelValue', value: ICAutocomplete | null): void;
}>();

const hasErrors = computed(() => props.errors && props.errors.length > 0);
const errorId = computed(() => (hasErrors.value ? `${props.id}-error` : undefined));
const displayedCities = computed<ICAutocomplete[]>(() =>
  loadingResults.value
    ? [{ code: ICAutocompleteExcludedCode.LOADING, label: 'Chargement...', alternativeLabel: '' }]
    : cities.value
);

async function handleInputChange(event: Event) {
  const value = (event.target as HTMLInputElement)?.value;

  if (value) {
    if (props.resetValidator) props.resetValidator();

    let valueChanged = false;
    if (lastValue !== value) {
      lastValue = value;
      valueChanged = true;
    }

    if (value.length >= minChars && value.length > 0 && valueChanged) {
      try {
        loadingResults.value = true;
        const result = await getCities(value);
        if (result && result.length > 0 && result[0].code) {
          cities.value = result;
        }
        loadingResults.value = false;
      } catch (e) {
        cities.value = [{ code: ICAutocompleteExcludedCode.ERROR, label: 'Auncun résultat', alternativeLabel: '' }];
        loadingResults.value = false;
      }
    }
  }
}

function handleUpdateModelValue(o: ICAutocomplete): void {
  if (o && o.code !== ICAutocompleteExcludedCode.ERROR && o.code !== ICAutocompleteExcludedCode.LOADING) {
    emit('update:modelValue', o);
  }
}

function clear() {
  emit('update:modelValue', null);
}

function focus() {
  (autocompleteInput.value as any)?.el?.focus();
}

defineExpose({
  hasErrors,
  focus
});
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.c-input__label {
  position: absolute;
  top: func.toRem(8);
  left: func.toRem(16);
}

.c-input__button {
  width: 100%;
  height: func.toRem(56);
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

.c-input__option {
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

.c-input__option--active,
.c-input__option--selected {
  background-color: var.$color-green;
  color: var.$color-white;
}
</style>
