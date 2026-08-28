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
          :placeholder="placeholder"
          :aria-describedby="errorId"
          :aria-invalid="!!errorId"
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
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.c-input__label {
  position: absolute;
  top: toRem(8);
  left: toRem(16);
}

.c-input__button {
  width: 100%;
  height: toRem(56);
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

.c-input__option {
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

.c-input__option--active,
.c-input__option--selected {
  background-color: $color-green-5;
}
</style>
