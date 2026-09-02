<template>
  <div class="contact-form__step">
    <Input
      id="lastname"
      :ref="(el: any) => saveInputRef('lastname', el)"
      v-model="personalInfosForm.lastname"
      :label="$t('form.step1.fields.lastname.label')"
      :placeholder="$t('form.step1.fields.lastname.placeholder')"
      autocomplete="family-name"
      type="text"
      minlength="2"
      maxlength="20"
      :required="true"
      :aria-invalid="$v.lastname.$error"
      :errors="$v.lastname.$errors"
      :reset-validator="$v.lastname.$reset"
      :is-invalid="$v.lastname.$invalid"
    />
    <Input
      id="firstname"
      :ref="(el: any) => saveInputRef('firstname', el)"
      v-model="personalInfosForm.firstname"
      :label="$t('form.step1.fields.firstname.label')"
      :placeholder="$t('form.step1.fields.firstname.placeholder')"
      autocomplete="given-name"
      type="text"
      minlength="2"
      maxlength="20"
      :required="true"
      :aria-invalid="$v.firstname.$error"
      :errors="$v.firstname.$errors"
      :reset-validator="$v.firstname.$reset"
      :is-invalid="$v.firstname.$invalid"
    />
    <SelectInput
      id="organisation"
      :ref="(el: any) => saveInputRef('organisation', el)"
      v-model="personalInfosForm.company.organisation"
      :label="$t('form.step1.fields.organisation.label')"
      :required="true"
      :aria-invalid="$v.company.organisation.$error"
      :errors="$v.company.organisation.$errors"
      :reset-validator="$v.company.organisation.$reset"
      :is-invalid="$v.company.organisation.$invalid"
      :placeholder="$t('form.step1.fields.organisation.placeholder')"
      :options="organisationOptions"
    />
    <InputPhone
      id="phone"
      :ref="(el: any) => saveInputRef('phone', el)"
      v-model="personalInfosForm.contact.phone"
      :label="$t('form.step1.fields.phone.label')"
      :placeholder="$t('form.step1.fields.phone.placeholder')"
      autocomplete="tel"
      :required="true"
      :aria-invalid="$v.contact.phone.$error"
      :errors="$v.contact.phone.$errors"
      :reset-validator="$v.contact.phone.$reset"
      :is-invalid="$v.contact.phone.$invalid"
    />
    <Input
      id="email"
      :ref="(el: any) => saveInputRef('email', el)"
      v-model="personalInfosForm.contact.email"
      :label="$t('form.step1.fields.email.label')"
      :placeholder="$t('form.step1.fields.email.placeholder')"
      autocomplete="email"
      type="email"
      maxlength="64"
      :required="true"
      :aria-invalid="$v.contact.email.$error"
      :errors="$v.contact.email.$errors"
      :reset-validator="$v.contact.email.$reset"
      :is-invalid="$v.contact.email.$invalid"
    />
    <SelectInput
      id="sector"
      :ref="(el: any) => saveInputRef('sector', el)"
      v-model="personalInfosForm.company.sector"
      :label="$t('form.step1.fields.sector.label')"
      :required="true"
      :aria-invalid="$v.company.sector.$error"
      :errors="$v.company.sector.$errors"
      :reset-validator="$v.company.sector.$reset"
      :placeholder="$t('form.step1.fields.sector.placeholder')"
      :options="sectorOptions"
    />
    <div class="personal-infos__buttons">
      <button
        class="btn btn-primary"
        type="submit"
        aria-label="Suivant : aller à l'étape 2 votre entreprise"
        @click.prevent="moveToNextStep"
      >
        <span>{{ $t('form.step1.button') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';

import { changePageTitle } from '@/mixins/title';
import { eaCollectorWrapper, dataLayerGAWrapper, getTaggingPath, getPreviousPage } from '@/mixins/taggingPlan';
import { getHost } from '@/mixins/host';

import Input from '@/components/Form/Inputs/Input.vue';
import SelectInput from '@/components/Form/Inputs/SelectInput.vue';
import type { SelectOption } from '@/models/form';
import { useInputs } from '@/composables/inputs.composable';
import InputPhone from '@/components/Form/Inputs/InputPhone.vue';

const emit = defineEmits<{
  (e: 'changeActiveStep'): void;
}>();

const { t, tm } = useI18n();
const personalInfosForm = usePersonalInfosFormStore();
const { saveInputRef, focusOnErrors } = useInputs();

const organisationOptions: SelectOption[] = tm('form.step1.fields.organisation.options');
const sectorOptions: SelectOption[] = tm('form.step1.fields.sector.options');

const regexAlpha = helpers.regex(/^[-\sa-zA-ZÀ-ÖØ-öø-ÿ]{2,20}$/);
const regexPhonenumber = helpers.regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/);

const formValidationRules = {
  firstname: {
    required: helpers.withMessage(t('form.step1.fields.firstname.validation.required'), required),
    alpha: helpers.withMessage(t('form.step1.fields.firstname.validation.alpha'), regexAlpha)
  },
  lastname: {
    required: helpers.withMessage(t('form.step1.fields.lastname.validation.required'), required),
    alpha: helpers.withMessage(t('form.step1.fields.lastname.validation.alpha'), regexAlpha)
  },
  contact: {
    email: {
      required: helpers.withMessage(t('form.step1.fields.email.validation.required'), required),
      email: helpers.withMessage(t('form.step1.fields.email.validation.email'), email)
    },
    phone: {
      required: helpers.withMessage(t('form.step1.fields.phone.validation.required'), required),
      phone: helpers.withMessage(t('form.step1.fields.phone.validation.numeric'), regexPhonenumber)
    }
  },
  company: {
    organisation: {
      required: helpers.withMessage(t('form.step1.fields.organisation.validation.required'), required)
    },
    sector: {
      required: helpers.withMessage(t('form.step1.fields.sector.validation.required'), required)
    }
  }
};

const $v = useVuelidate(formValidationRules, personalInfosForm);

async function moveToNextStep() {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    changePageTitle('', 'Formulaire');

    // GTM Datalayer
    dataLayerGAWrapper({
      event: 'clickContactStep1',
      contact_type: 'Page contact'
    });

    // Eulerian - 5.4. Page de contact entreprise
    eaCollectorWrapper([
      'rtgsite',
      'professionnel',
      'rtgpg',
      'form',
      'prdref',
      'formulaire_contact',
      'scart',
      '1',
      'rtgidform',
      'contact',
      'rtgpagename',
      'contact_entreprise',
      'path',
      getTaggingPath(),
      'from',
      getHost(),
      'rtgnom',
      personalInfosForm.lastname,
      'rtgprenom',
      personalInfosForm.firstname,
      'rtgorganisation',
      personalInfosForm.company.organisation?.label,
      'rtgphonenumber',
      personalInfosForm.contact.phone,
      'email',
      personalInfosForm.contact.email,
      'rtgsecteuractivité',
      personalInfosForm.company.sector?.label,
      'rtgpreviouspage',
      getPreviousPage()
    ]);

    emit('changeActiveStep');
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

    changePageTitle('Formulaire nous contacter étape 1 vous', 'erreur');

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
  @include mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mq-mobile-less {
    display: block;
    width: 100%;
  }

  &::after {
    @include mq-to-tablet {
      display: none;
    }
  }
}

.personal-infos__buttons {
  @include mq-to-tablet {
    text-align: center;
    margin-top: toRem(24);
  }

  @include mq-desktop {
    display: flex;
    justify-content: flex-end;
    width: calc(100% - #{toRem(24)});
    margin: toRem(12) auto 0 auto;
  }
}
</style>
