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
      <div class="c-input__wrapper c-input__wrapper--auto">
        <fieldset :aria-required="required" :aria-invalid="ariaInvalid" :aria-describedby="errorId" role="radiogroup">
          <legend class="company-infos__legend c-input__label">
            {{ legend }}
          </legend>
          <div class="company-infos__radios">
            <RadioInput
              v-for="(param, index) in radioInputsParam"
              :id="param.id"
              :key="`radioInput${index}`"
              :label="param.label"
              :name="name"
              :checked="modelValue === param.id"
              :required="required"
              :model-value="modelValue"
              @update:model-value="handleChange"
            />
          </div>
        </fieldset>
      </div>
    </div>
    <p v-for="error of errors" :id="errorId" :key="error.$uid" class="input-error">
      <strong class="input-error__message">{{ error.$message }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import RadioInput from '@/components/Form/Inputs/RadioInput.vue';
import type { RadioInputParam } from '@/models/input';
import { computed } from 'vue';
import type { ErrorObject } from '@vuelidate/core';

const props = defineProps<{
  legend: string;
  name: string;
  required: boolean;
  modelValue: string;
  ariaInvalid?: boolean;
  errors: ErrorObject[];
  resetValidator: () => void;
  radioInputsParam: RadioInputParam[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const errorId = computed(() => (props.errors && props.errors.length > 0 ? props.name + '-error' : undefined));

function handleChange(value: string) {
  if (value) {
    if (props.resetValidator) props.resetValidator();
    emit('update:modelValue', value);
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.c-input__block {
  @include mq-desktop {
    width: calc(50% - #{toRem(24)});
    margin: toRem(12);
  }
}

.company-infos__radios {
  clear: both;
  display: flex;
  flex-flow: row wrap;
  position: relative;
  top: toRem(-3.5);
}
</style>
