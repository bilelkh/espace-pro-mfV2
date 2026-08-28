<template>
  <div class="contact-form__step">
    <Input
      id="companyName"
      :ref="(el: any) => saveInputRef('companyName', el)"
      v-model="companyInfosForm.company.name"
      :label="$t('form.step2.fields.companyName.label')"
      :placeholder="$t('form.step2.fields.companyName.placeholder')"
      type="text"
      :required="true"
      :aria-invalid="$v.company.name.$error"
      :errors="$v.company.name.$errors"
      :reset-validator="$v.company.name.$reset"
      :is-invalid="$v.company.name.$invalid"
    />
    <Input
      id="siren"
      :ref="(el: any) => saveInputRef('siren', el)"
      v-model="companyInfosForm.company.siren"
      v-maska="'### ### ###'"
      :label="$t('form.step2.fields.siren.label')"
      :placeholder="$t('form.step2.fields.siren.placeholder')"
      type="text"
      :required="true"
      :aria-invalid="$v.company.siren.$error"
      :errors="$v.company.siren.$errors"
      :reset-validator="$v.company.siren.$reset"
      :is-invalid="$v.company.siren.$invalid"
    />
    <AutocompleteInput
      id="zipcode"
      :ref="(el: any) => saveInputRef('zipcode', el)"
      v-model="companyInfosForm.company.zipcode"
      :label="$t('form.step2.fields.zipcode.label')"
      :placeholder="'Indiquer votre code postal'"
      :required="true"
      :aria-invalid="$v.company.zipcode.$error"
      :errors="$v.company.zipcode.$errors"
      :reset-validator="$v.company.zipcode.$reset"
    />
    <SelectInput
      id="distributionChannel"
      :ref="(el: any) => saveInputRef('distributionChannel', el)"
      v-model="companyInfosForm.company.distributionChannel"
      :label="$t('form.step2.fields.distributionChannel.label')"
      :aria-invalid="$v.company.distributionChannel.$error"
      :errors="$v.company.distributionChannel.$errors"
      :reset-validator="$v.company.distributionChannel.$reset"
      :placeholder="$t('form.step2.fields.distributionChannel.placeholder')"
      :options="distributionChannelOptions"
    />
    <SelectInput
      v-if="showSalesRevenues"
      id="salesRevenues"
      :ref="(el: any) => saveInputRef('salesRevenues', el)"
      v-model="companyInfosForm.company.salesRevenues"
      class="c-input--sales-revenues"
      :label="$t('form.step2.fields.salesRevenues.label')"
      :aria-invalid="$v.company.salesRevenues.$error"
      :errors="$v.company.salesRevenues.$errors"
      :reset-validator="$v.company.salesRevenues.$reset"
      :placeholder="$t('form.step2.fields.salesRevenues.placeholder')"
      :options="salesRevenuesOptions"
    />
    <RadioGroup
      v-model="companyInfosForm.company.customersType"
      :legend="$t('form.step2.fields.customersType.label')"
      name="customersType"
      :required="true"
      :aria-invalid="$v.company.customersType.$error"
      :radio-inputs-param="customerTypeRadioInputs"
      :errors="$v.company.customersType.$errors"
      :reset-validator="$v.company.customersType.$reset"
    />
    <RadioGroup
      v-model="companyInfosForm.company.caCustomerAlready"
      legend="Ma société/Mon enseigne est cliente chez CA Groupe (LCL, Crédit Agricole)"
      name="caCustomerAlready"
      :radio-inputs-param="clientYesNoRadioInputs"
      :required="true"
      :aria-invalid="$v.company.caCustomerAlready.$error"
      :errors="$v.company.caCustomerAlready.$errors"
      :reset-validator="$v.company.caCustomerAlready.$reset"
    />

    <div class="company-infos__buttons">
      <button
        class="btn btn-primary"
        type="submit"
        aria-label="Envoyer le formulaire nous contacter"
        @click.prevent="handleSubmitContactForm"
      >
        <span>{{ $t('form.step2.button') }}</span>
      </button>
      <div class="company-infos__button" @click="emit('goBackPersonnalInfosStep')">
        <button class="btn btn-secondary" type="button" aria-label="Retourner à l'étape 1 vous">
          <span class="chevron chevron--left" />
          <span class="company-infos__button-text">{{ $t('form.step2.gobacklink') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import Input from '@/components/Form/Inputs/Input.vue';
import SelectInput from '@/components/Form/Inputs/SelectInput.vue';
import AutocompleteInput from '@/components/Form/Inputs/AutocompleteInput.vue';

import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';
import { useCompanylInfosFormStore } from '@/stores/companyInfosForm';

import { changePageTitle } from '@/mixins/title';
import { dataLayerGAWrapper } from '@/mixins/taggingPlan';
import type { SelectOption } from '@/models/form';
import { useInputs } from '@/composables/inputs.composable';
import { computed } from 'vue';
import RadioGroup from '@/components/Form/Inputs/RadioGroup.vue';
import type { RadioInputParam } from '@/models/input';
import { hasSalesRevenues } from '@/services/business-rules';

const customerTypeRadioInputs: RadioInputParam[] = [
  { id: 'customerIndividual', label: 'Particulier' },
  { id: 'customerPro', label: 'Pro' },
  { id: 'customerIndividualPro', label: 'Les deux' }
];

const clientYesNoRadioInputs: RadioInputParam[] = [
  { id: 'clientYes', label: 'Oui' },
  { id: 'clientNo', label: 'Non' }
];

const { t, tm } = useI18n();
const { saveInputRef, focusOnErrors } = useInputs();

const emit = defineEmits(['submitContactForm', 'goBackPersonnalInfosStep']);

const distributionChannelOptions: SelectOption[] = tm('form.step2.fields.distributionChannel.options');
const salesRevenuesOptions: SelectOption[] = tm('form.step2.fields.salesRevenues.options');

const regexAlpha = helpers.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]{2,50}$/);
const regexSiren = helpers.regex(/^[0-9 ]{11}$/);

const personalInfosFormStore = usePersonalInfosFormStore();
const companyInfosForm = useCompanylInfosFormStore();

const showSalesRevenues = computed(() => hasSalesRevenues(personalInfosFormStore.company.sector?.id));

const formValidationRules = {
  company: {
    name: {
      required: helpers.withMessage(t('form.step2.fields.companyName.validation.required'), required),
      alpha: helpers.withMessage(t('form.step2.fields.companyName.validation.alpha'), regexAlpha)
    },
    siren: {
      required: helpers.withMessage(t('form.step2.fields.siren.validation.required'), required),
      siren: helpers.withMessage(t('form.step2.fields.siren.validation.numeric'), regexSiren)
    },
    zipcode: {
      required: helpers.withMessage(t('form.step2.fields.zipcode.validation.required'), required)
    },
    distributionChannel: {
      required: helpers.withMessage(t('form.step2.fields.distributionChannel.validation.required'), required)
    },
    customersType: {
      required: helpers.withMessage('Veuillez sélectionner votre clientèle parmi les choix proposés', required)
    },
    caCustomerAlready: {
      required: helpers.withMessage(
        'Veuillez sélectionner si votre société ou enseigne est cliente chez CA Groupe (LCL, Crédit Agricole)',
        required
      )
    },
    ...(showSalesRevenues.value
      ? {
          salesRevenues: {
            required: helpers.withMessage(t('form.step2.fields.salesRevenues.validation.required'), required)
          }
        }
      : {})
  }
};

const $v = useVuelidate(formValidationRules, companyInfosForm);

async function handleSubmitContactForm() {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    emit('submitContactForm');
  } else {
    const errorFields = await $v.value.$silentErrors;
    let errorFieldsName = '';
    errorFields.forEach((element) => {
      if (errorFieldsName === '') {
        errorFieldsName = element.$property;
      } else {
        errorFieldsName += `|${element.$property}`;
      }
    });

    // GTM Datalayer
    dataLayerGAWrapper({
      event: 'displayContactError',
      error_field: errorFieldsName
    });

    changePageTitle('Formulaire nous contacter étape 2 votre entreprise', 'erreur');

    focusOnErrors();
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

.btn-primary {
  position: relative;
  display: block;
  min-width: toRem(186);

  span {
    @include mq-desktop {
      margin-left: toRem(-12);
      vertical-align: sub;
    }
  }

  @include mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mq-mobile-less {
    display: block;
    width: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    margin-left: toRem(16);
    right: toRem(16);
    top: 50%;
    transform: translateY(-50%);
    background: url($path-icons + 'icon-arrow-right-white.svg') 0 0 no-repeat;
    background-size: cover;
    height: toRem(16);
    width: toRem(16);

    @include mq-to-tablet {
      display: none;
    }
  }

  &:hover::after,
  &:focus::after {
    background: url($path-icons + 'icon-arrow-right-pink.svg') 0 0 no-repeat;
  }
}

.c-checkbox {
  @include mq-to-tablet {
    padding: 0 toRem(16) toRem(8) toRem(16);
  }
}

.company-infos__buttons {
  @include mq-to-tablet {
    margin-top: toRem(24);
  }

  @include mq-mobile-less {
    display: block;
    width: 100%;
  }

  @include mq-from-mobile-less {
    display: flex;
    flex-flow: row-reverse nowrap;
    justify-content: space-between;
  }

  @include mq-desktop {
    width: calc(100% - #{toRem(24)});
    margin: toRem(12) auto 0 auto;
  }
}

.company-infos__button {
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;

  @include mq-mobile-less {
    display: block;
    width: 100%;
  }

  img {
    height: toRem(10);
  }
}

.company-infos__button-text {
  margin-left: toRem(5);

  @include mq-to-tablet {
    margin-left: 0;
  }
}

.chevron--left {
  transform: rotate(-135deg);
  border-style: solid;
  border-width: toRem(2) toRem(2) 0 0;
  width: toRem(8);
  height: toRem(8);

  @include mq-to-tablet {
    display: none;
  }
}

.btn-secondary {
  display: flex;
  align-items: center;
  font-family: $font-poppins-semi-bold;
  text-transform: none;
  border-radius: toRem(8);
  cursor: pointer;
  transition: 0.25s ease-in-out;
  background-color: $color-white;
  border: toRem(1) solid $color-pink;
  color: $color-pink;
  font-size: toRem(14);
  padding: toRem(14.5) toRem(40);

  @include mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mq-mobile-less {
    display: block;
    width: 100%;
    margin-top: toRem(16);
  }

  &:hover,
  &:focus {
    background-color: $color-white;
    color: $color-pink;
  }

  &:hover {
    box-shadow: 0 toRem(4) toRem(10) rgb(221 3 81 / 25%);
  }
}

/*legend.c-input__label {
  float: left;
  display: block;
  position: inherit;
  top: inherit;
  left: inherit;
}*/

.c-input--sales-revenues {
  @include mq-desktop-s {
    :deep(.c-input__button) {
      height: toRem(75);
    }

    :deep(.c-input__options) {
      top: toRem(75);
    }
  }
}
</style>
