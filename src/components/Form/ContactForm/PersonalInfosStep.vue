<template>
  <div class="contact-form__step">
    <SelectInput
      :id="sfFields?.salutation.id ?? 'salutation'"
      :ref="(el: any) => saveInputRef('salutation', el)"
      v-model="personalInfosForm.salutation"
      :label="$t('form.step1.fields.salutation.label')"
      :required="true"
      :aria-invalid="$v.salutation.$error"
      :errors="$v.salutation.$errors"
      :reset-validator="$v.salutation.$reset"
      :placeholder="$t('form.step1.fields.salutation.placeholder')"
      :options="salutationOptions"
    />

    <Input
      :id="sfFields?.lastname.id ?? 'lastname'"
      :ref="(el: any) => saveInputRef('lastname', el)"
      v-model="personalInfosForm.lastname"
      :name="sfFields?.lastname.name"
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
    />
    <Input
      :id="sfFields?.firstname.id ?? 'firstname'"
      :ref="(el: any) => saveInputRef('firstname', el)"
      v-model="personalInfosForm.firstname"
      :name="sfFields?.firstname.name"
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
    />
    <SelectInput
      :id="sfFields?.organisation.id ?? 'organisation'"
      :ref="(el: any) => saveInputRef('organisation', el)"
      v-model="personalInfosForm.company.organisation"
      :label="$t('form.step1.fields.organisation.label')"
      :required="true"
      :aria-invalid="$v.company.organisation.$error"
      :errors="$v.company.organisation.$errors"
      :reset-validator="$v.company.organisation.$reset"
      :placeholder="$t('form.step1.fields.organisation.placeholder')"
      :options="organisationOptions"
      @update:model-value="handleOrganisationChange"
    />
    <Input
      v-if="personalInfosForm.company.organisation?.id === 9"
      :id="sfFields?.organisation.id ?? 'organisation'"
      :ref="(el: any) => saveInputRef('organisation', el)"
      v-model="personalInfosForm.company.otherOrganisation"
      :name="sfFields?.organisation.name"
      :label="$t('form.step1.fields.otherOrganisation.label')"
      :placeholder="$t('form.step1.fields.otherOrganisation.placeholder')"
      autocomplete="given-organisation"
      type="text"
      minlength="2"
      maxlength="100"
      :required="personalInfosForm.company.organisation?.id === 9"
      :aria-invalid="$v.company.otherOrganisation.$error"
      :errors="$v.company.otherOrganisation.$errors"
      :reset-validator="$v.company.otherOrganisation.$reset"
    />
    <InputPhone
      :id="sfFields?.phone.id ?? 'phone'"
      :ref="(el: any) => saveInputRef('phone', el)"
      v-model="personalInfosForm.contact.phone"
      :name="sfFields?.phone.name"
      :label="$t('form.step1.fields.phone.label')"
      :placeholder="$t('form.step1.fields.phone.placeholder')"
      autocomplete="tel"
      :required="true"
      :aria-invalid="$v.contact.phone.$error"
      :errors="$v.contact.phone.$errors"
      :reset-validator="$v.contact.phone.$reset"
    />
    <Input
      :id="sfFields?.email.id ?? 'email'"
      :ref="(el: any) => saveInputRef('email', el)"
      v-model="personalInfosForm.contact.email"
      :name="sfFields?.email.name"
      :label="$t('form.step1.fields.email.label')"
      :placeholder="$t('form.step1.fields.email.placeholder')"
      autocomplete="email"
      type="email"
      maxlength="64"
      :required="true"
      :aria-invalid="$v.contact.email.$error"
      :errors="$v.contact.email.$errors"
      :reset-validator="$v.contact.email.$reset"
    />
    <SelectInput
      :id="sfFields?.sector.id ?? 'sector'"
      :ref="(el: any) => saveInputRef('sector', el)"
      v-model="personalInfosForm.company.sector"
      :label="$t('form.step1.fields.sector.label')"
      :required="true"
      :aria-invalid="$v.company.sector.$error"
      :errors="$v.company.sector.$errors"
      :reset-validator="$v.company.sector.$reset"
      :placeholder="$t('form.step1.fields.sector.placeholder')"
      :options="sectorOptions"
      @update:model-value="handleSectorChange"
    />
    <Input
      v-if="personalInfosForm.company.sector?.id === 9"
      :id="sfFields?.sector.id ?? 'sector'"
      :ref="(el: any) => saveInputRef('sector', el)"
      v-model="personalInfosForm.company.otherSector"
      :name="sfFields?.sector.name"
      :label="$t('form.step1.fields.otherSector.label')"
      :placeholder="$t('form.step1.fields.otherSector.placeholder')"
      autocomplete="given-sector"
      type="text"
      minlength="2"
      maxlength="100"
      :required="personalInfosForm.company.sector?.id === 9"
      :aria-invalid="$v.company.otherSector.$error"
      :errors="$v.company.otherSector.$errors"
      :reset-validator="$v.company.otherSector.$reset"
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
import { onMounted, inject, computed, ref } from 'vue';
import type { SalesForceFormConfig } from '@/config/config';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';

import { changePageTitle } from '@/mixins/title';
import { eaCollectorWrapper, dataLayerGAWrapper } from '@/mixins/taggingPlan';
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
const sfFields = inject<SalesForceFormConfig['form'] | null>('sfFields', null);

const organisationOptions: SelectOption[] = tm('form.step1.fields.organisation.options');
const sectorOptions: SelectOption[] = tm('form.step1.fields.sector.options');
const salutationOptions: SelectOption[] = tm('form.step1.fields.salutation.options');

const regexAlpha = helpers.regex(/^[-\sa-zA-ZÀ-ÖØ-öø-ÿ]{2,20}$/);
const regexPhonenumber = helpers.regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/);

const otherOrganisationRule = ref({});
const otherSectorRule = ref({});

const handleOrganisationChange = (value: SelectOption) => {
  if (value.id !== 9) {
    otherOrganisationRule.value = {};
  } else {
    otherOrganisationRule.value = {
      required: helpers.withMessage(t('form.step1.fields.otherOrganisation.validation.required'), required)
    };
  }
};

const handleSectorChange = (value: SelectOption) => {
  if (value.id !== 9) {
    otherSectorRule.value = {};
  } else {
    otherSectorRule.value = {
      required: helpers.withMessage(t('form.step1.fields.otherSector.validation.required'), required)
    };
  }
};

const formValidationRules = computed(() => {
  return {
    salutation: {
      required: helpers.withMessage(t('form.step1.fields.salutation.validation.required'), required)
    },
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
      otherOrganisation: otherOrganisationRule.value,
      sector: {
        required: helpers.withMessage(t('form.step1.fields.sector.validation.required'), required)
      },
      otherSector: otherSectorRule.value
    }
  };
});

onMounted(() => {
  if (personalInfosForm.company.organisation) handleOrganisationChange(personalInfosForm.company.organisation);
  if (personalInfosForm.company.sector) handleSectorChange(personalInfosForm.company.sector);
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
    'contact_perso',
    'path',
    window.location.pathname,
    'from',
    getHost(),
    'rtgpreviouspage',
    document.referrer
  ]);
});

const $v = useVuelidate(formValidationRules, personalInfosForm);

async function moveToNextStep() {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    changePageTitle('Contact Financement clients', 'Etape 2 Votre entreprise', 'Pro Sofinco');

    // GTM Datalayer
    dataLayerGAWrapper({
      event: 'clickContactStep1',
      contact_type: 'Page contact'
    });

    // Eulerian - Plan de taggage Numberly V1.5 §5.4 "Page de contact entreprise"
    eaCollectorWrapper([
      'rtgsite',
      'professionnel',
      'rtgpg',
      'form',
      'rtgidform',
      'contact',
      'rtgpagename',
      'contact_entreprise',
      'prdref',
      'formulaire_contact',
      'scart',
      '1',
      'path',
      window.location.pathname,
      'from',
      getHost(),
      'rtgpreviouspage',
      document.referrer,
      'rtgorganisation',
      // §5.4 recette : organisation "en toute lettre" (libellé, ou saisie libre si "Autre") au lieu de l'id
      personalInfosForm.company.otherOrganisation || personalInfosForm.company.organisation?.label,
      'rtgphonenumber',
      personalInfosForm.contact.phone,
      'email',
      personalInfosForm.contact.email,
      'rtgsecteuractivité',
      // §5.4 recette : "rtgsecteuractivité mal rempli" -> libellé du secteur (ou saisie libre si "Autre")
      personalInfosForm.company.otherSector || personalInfosForm.company.sector?.label
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
    //a changer avec une VRAIE valeur, only en cas d'erreur
    changePageTitle('Formulaire nous contacter étape 1 vous', 'erreur');

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
  @include mix.mq-mobile {
    width: auto;
    max-width: inherit;
  }

  @include mix.mq-mobile-less {
    display: block;
    width: 100%;
  }

  &::after {
    @include mix.mq-to-tablet {
      display: none;
    }
  }
}

.personal-infos__buttons {
  @include mix.mq-to-tablet {
    text-align: center;
    margin-top: func.toRem(24);
  }

  @include mix.mq-desktop {
    display: flex;
    justify-content: flex-end;
    width: calc(100% - #{func.toRem(24)});
    margin: func.toRem(12) auto 0 auto;
  }
}
</style>
