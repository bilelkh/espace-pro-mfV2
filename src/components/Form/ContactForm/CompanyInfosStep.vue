<template>
  <div class="contact-form__step">
    <Input
      :id="sfFields?.companyName.id ?? 'companyName'"
      :ref="(el: any) => saveInputRef('companyName', el)"
      v-model="companyInfosForm.company.name"
      :name="sfFields?.companyName.name"
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
      :id="sfFields?.siret.id ?? 'siret'"
      :ref="(el: any) => saveInputRef('siret', el)"
      v-model="companyInfosForm.company.siret"
      v-maska="'### ### ### #####'"
      :name="sfFields?.siret.name"
      :label="$t('form.step2.fields.siret.label')"
      :placeholder="$t('form.step2.fields.siret.placeholder')"
      type="text"
      maxlength="17"
      :required="true"
      :aria-invalid="$v.company.siret.$error"
      :errors="$v.company.siret.$errors"
      :reset-validator="$v.company.siret.$reset"
      :is-invalid="$v.company.siret.$invalid"
    />

    <AutocompleteInput
      :id="sfFields?.zipcode.id ?? 'zip'"
      :ref="(el: any) => saveInputRef('zip', el)"
      v-model="companyInfosForm.company.zipcode"
      :label="$t('form.step2.fields.zipcode.label')"
      :placeholder="'Indiquer votre code postal'"
      :required="true"
      :aria-invalid="$v.company.zipcode.$error"
      :errors="$v.company.zipcode.$errors"
      :reset-validator="$v.company.zipcode.$reset"
    />

    <SelectInput
      :id="sfFields?.distributionChannel.id ?? 'distributionChannel'"
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
      :id="sfFields?.salesRevenues.id ?? 'salesRevenues'"
      :ref="(el: any) => saveInputRef('salesRevenues', el)"
      v-model="companyInfosForm.company.salesRevenues"
      class="c-input--sales-revenues"
      :label="$t('form.step2.fields.salesRevenues.label')"
      :aria-invalid="$v.company.salesRevenues!.$error"
      :errors="$v.company.salesRevenues!.$errors"
      :reset-validator="$v.company.salesRevenues!.$reset"
      :placeholder="$t('form.step2.fields.salesRevenues.placeholder')"
      :options="salesRevenuesOptions"
    />
    <RadioGroup
      v-model="companyInfosForm.company.customersType"
      :legend="$t('form.step2.fields.customersType.label')"
      :name="sfFields?.customersType.name ?? 'customersType'"
      :required="true"
      :aria-invalid="$v.company.customersType.$error"
      :radio-inputs-param="customerTypeRadioInputs"
      :errors="$v.company.customersType.$errors"
      :reset-validator="$v.company.customersType.$reset"
    />
    <RadioGroup
      v-model="companyInfosForm.company.caCustomerAlready"
      legend="Ma société/Mon enseigne est cliente chez  Groupe Crédit Agricole (LCL, Crédit Agricole)"
      :name="sfFields?.caCustomerAlready.name ?? 'caCustomerAlready'"
      :radio-inputs-param="clientYesNoRadioInputs"
      :required="true"
      :aria-invalid="$v.company.caCustomerAlready.$error"
      :errors="$v.company.caCustomerAlready.$errors"
      :reset-validator="$v.company.caCustomerAlready.$reset"
    />
    <SelectInput
      :id="sfFields?.creditVolume.id ?? 'creditVolume'"
      v-model="companyInfosForm.company.creditVolume"
      class="c-input--sales-revenues"
      :label="$t('form.step2.fields.creditVolume.label')"
      :placeholder="$t('form.step2.fields.creditVolume.placeholder')"
      :options="creditVolumeOptions"
      :aria-invalid="$v.company.creditVolume.$error"
      :errors="$v.company.creditVolume.$errors"
      :reset-validator="$v.company.creditVolume.$reset"
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

import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';
import { useCompanylInfosFormStore } from '@/stores/companyInfosForm';

import { changePageTitle } from '@/mixins/title';
import { dataLayerGAWrapper } from '@/mixins/taggingPlan';
import type { SelectOption } from '@/models/form';
import { useInputs } from '@/composables/inputs.composable';
import { inject } from 'vue';
import type { SalesForceFormConfig } from '@/config/config';
import RadioGroup from '@/components/Form/Inputs/RadioGroup.vue';
import type { RadioInputParam } from '@/models/input';
import AutocompleteInput from '@/components/Form/Inputs/AutocompleteInput.vue';

const customerTypeRadioInputs: RadioInputParam[] = [
  { id: 'B2C', label: 'Particulier' },
  { id: 'B2B', label: 'Pro' },
  { id: 'customerIndividualPro', label: 'Les deux' }
];

const clientYesNoRadioInputs: RadioInputParam[] = [
  { id: 'true', label: 'Oui' },
  { id: 'false', label: 'Non' }
];

const { t, tm } = useI18n();
const { saveInputRef, focusOnErrors } = useInputs();
const sfFields = inject<SalesForceFormConfig['form'] | null>('sfFields', null);

const emit = defineEmits(['submitContactForm', 'goBackPersonnalInfosStep']);

const distributionChannelOptions: SelectOption[] = tm('form.step2.fields.distributionChannel.options');
const salesRevenuesOptions: SelectOption[] = tm('form.step2.fields.salesRevenues.options');
const creditVolumeOptions: SelectOption[] = tm('form.step2.fields.creditVolume.options');
const regexAlpha = helpers.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]{2,50}$/);
const regexSiret = helpers.regex(/^[0-9 ]{17}$/);

const personalInfosFormStore = usePersonalInfosFormStore();
const companyInfosForm = useCompanylInfosFormStore();

const formValidationRules = {
  company: {
    name: {
      required: helpers.withMessage(t('form.step2.fields.companyName.validation.required'), required),
      alpha: helpers.withMessage(t('form.step2.fields.companyName.validation.alpha'), regexAlpha)
    },
    siret: {
      required: helpers.withMessage(t('form.step2.fields.siret.validation.required'), required),
      siret: helpers.withMessage(t('form.step2.fields.siret.validation.numeric'), regexSiret)
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
    creditVolume: {},
    salesRevenues: {
      required: helpers.withMessage(t('form.step2.fields.salesRevenues.validation.required'), required)
    }
  }
};

const $v = useVuelidate(formValidationRules, companyInfosForm);

async function handleSubmitContactForm() {
  const isFormCorrect = await $v.value.$validate();

  if (isFormCorrect) {
    emit('submitContactForm');
  } else {
    const errorFields = $v.value.$silentErrors;
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

    changePageTitle('Formulaire nous contacter étape 2 votre entreprise', 'erreur de saisie', 'Pro Sofinco');

    focusOnErrors();
  }
}
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.c-input__block {
  @include mix.mq-desktop {
    width: calc(50% - #{func.toRem(24)});
    margin: func.toRem(12);
  }
}

.btn-primary {
  position: relative;
  display: block;
  min-width: func.toRem(186);

  span {
    @include mix.mq-desktop {
      margin-left: func.toRem(-12);
      vertical-align: sub;
    }
  }

  @include mix.mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mix.mq-mobile-less {
    display: block;
    width: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    margin-left: func.toRem(16);
    right: func.toRem(16);
    top: 50%;
    transform: translateY(-50%);
    background: url(var.$path-icons + 'icon-arrow-right-white.svg') 0 0 no-repeat;
    background-size: cover;
    height: func.toRem(16);
    width: func.toRem(16);

    @include mix.mq-to-tablet {
      display: none;
    }
  }

  &:hover::after,
  &:focus::after {
    mask:  url(var.$path-icons + 'icon-arrow-right-white.svg') 0 0 no-repeat;
    mask-size: cover;
  }
}

.c-checkbox {
  @include mix.mq-to-tablet {
    padding: 0 func.toRem(16) func.toRem(8) func.toRem(16);
  }
}

.company-infos__buttons {
  @include mix.mq-to-tablet {
    margin-top: func.toRem(24);
  }

  @include mix.mq-mobile-less {
    display: block;
    width: 100%;
  }

  @include mix.mq-from-mobile-less {
    display: flex;
    flex-flow: row-reverse nowrap;
    justify-content: space-between;
  }

  @include mix.mq-desktop {
    width: calc(100% - #{func.toRem(24)});
    margin: func.toRem(12) auto 0 auto;
  }
}

.company-infos__button {
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;

  @include mix.mq-mobile-less {
    display: block;
    width: 100%;
  }

  img {
    height: func.toRem(10);
  }
}

.company-infos__button-text {
  margin-left: func.toRem(5);

  @include mix.mq-to-tablet {
    margin-left: 0;
  }
}

.chevron--left {
  transform: rotate(-135deg);
  border-style: solid;
  border-width: func.toRem(2) func.toRem(2) 0 0;
  width: func.toRem(8);
  height: func.toRem(8);

  @include mix.mq-to-tablet {
    display: none;
  }
}

.btn-secondary {
  display: flex;
  align-items: center;
  font-family: var.$font-poppins-semi-bold;
  border-radius: var(--Full, 80px);
  border: func.toRem(1) solid var.$color-primary-base;
  color: var.$color-primary-base;
  font-size: func.toRem(14);
  padding: func.toRem(14.5) func.toRem(40);

  @include mix.mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mix.mq-mobile-less {
    display: block;
    width: 100%;
    margin-top: func.toRem(16);
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
  @include mix.mq-desktop-s {
    :deep(.c-input__button) {
      height: func.toRem(75);
    }

    :deep(.c-input__options) {
      top: func.toRem(75);
    }
  }
}
</style>
