<template>
  <section class="container contact-form">
    <div class="contact-form__form">
      <h1 class="contact-form__title">
        {{ $t('form.title') }}
      </h1>
      <Stepper :active-step="activeStep" />
      <p class="contact-form__info">
        {{ $t('form.text') }}
      </p>
      <form class="contact-form__block">
        <transition name="fade" mode="out-in">
          <component
            :is="activeStep === 1 ? PersonalInfosStep : CompanyInfosStep"
            @change-active-step="changeActiveStep"
            @submit-contact-form="handleSumbitContactForm"
            @go-back-personnal-infos-step="handleDisplayPersonalInfosStep"
          />
        </transition>
      </form>
    </div>
    <div class="contact-form__img">
      <img :src="`${espaceProConfig.baseResourcesUrl}/${$t('form.picture.src')}`" :alt="$t('form.picture.alt')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Stepper from '@/components/Form/Stepper/Stepper.vue';
import PersonalInfosStep from '@/components/Form/ContactForm/PersonalInfosStep.vue';
import CompanyInfosStep from '@/components/Form/ContactForm/CompanyInfosStep.vue';

import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';
import { useCompanylInfosFormStore } from '@/stores/companyInfosForm';
import { storeToRefs } from 'pinia';
import { changePageTitle } from '@/mixins/title';
import {
  dataLayerGAWrapper,
  eaCollectorWrapper,
  eaCollectorWrapperOnce,
  generateFormRef,
  getPreviousPage,
  getTaggingPath,
  setPreviousPage
} from '@/mixins/taggingPlan';
import { getHost } from '@/mixins/host';
import { espaceProConfig } from '@/config/config';
import { clientYesNoRadioInputs, customerTypeRadioInputs, getRadioLabel } from '@/config/form-options';

const personalInfosFormStore = usePersonalInfosFormStore();
const companyInfosForm = useCompanylInfosFormStore();

const { lastname, firstname, contact, company: personalCompany } = storeToRefs(personalInfosFormStore);
const { company } = storeToRefs(companyInfosForm);
const activeStep = ref(1);
const loading = ref(false);

onMounted(() => {
  manageEulerianOnDisplayContactForm();
});

const changeActiveStep = () => {
  activeStep.value++;
};

const submitContactForm = async (): Promise<void> => {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', espaceProConfig.submitContactFormUrl);
  form.style.display = 'none';

  appendFormInput('lastname', lastname.value, form);
  appendFormInput('firstname', firstname.value, form);
  appendFormInput('phone', contact.value?.phone, form);
  appendFormInput('email', contact.value?.email, form);
  appendFormInput('organisation', `${personalCompany.value?.organisation?.id}`, form);
  appendFormInput('sector', `${personalCompany.value?.sector?.id}`, form);
  appendFormInput('companyName', company.value?.name, form);
  appendFormInput('siren', company.value?.siren, form);
  appendFormInput('zipcode', String(company.value?.zipcode?.code), form);
  appendFormInput('channel', `${company.value?.distributionChannel?.id}`, form);
  appendFormInput('salesRevenues', `${company.value?.salesRevenues?.id}`, form);
  appendFormInput('customersType', company.value?.customersType, form);
  appendFormInput('alreadyCustomer', company.value?.caCustomerAlready, form);

  document.getElementsByTagName('body')[0].appendChild(form);

  form.submit();
};

const appendFormInput = (name: string, value: string | undefined | null, form: HTMLFormElement): void => {
  if (value === undefined || value === null) return;

  const element = document.createElement('input');

  element.setAttribute('type', 'text');
  element.setAttribute('name', name);
  element.setAttribute('value', value);

  form.appendChild(element);
};

const handleSumbitContactForm = () => {
  loading.value = true;

  changePageTitle('Confirmation', 'Formulaire');
  manageGtmOnSubmitContactForm();
  manageEulerianOnSubmitContactForm();
  submitContactForm();

  loading.value = false;
};

const handleDisplayPersonalInfosStep = () => {
  activeStep.value--;
};

const manageGtmOnSubmitContactForm = (): void => {
  dataLayerGAWrapper({
    event: 'clickContactSubmit',
    contact_type: 'Page contact',
    activity_sector: `${personalInfosFormStore.company.sector?.id}`
  });
};

// 5.3. Page de contact personne : tag de page, une seule fois à l'affichage du formulaire.
const manageEulerianOnDisplayContactForm = (): void => {
  eaCollectorWrapperOnce('contact_perso', [
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
    getTaggingPath(),
    'from',
    getHost(),
    'rtgpreviouspage',
    getPreviousPage()
  ]);

  setPreviousPage('contact_perso');
};

// 5.5. Envoi du formulaire (clic sur "Nous contacter").
const manageEulerianOnSubmitContactForm = (): void => {
  eaCollectorWrapper([
    'rtgsite',
    'professionnel',
    'rtgpg',
    'form',
    'type',
    personalInfosFormStore.company.sector?.label,
    'ref',
    generateFormRef(),
    'estimate',
    '1',
    'rtgidform',
    'contact',
    'rtgpagename',
    'contact_entreprise',
    'path',
    getTaggingPath(),
    'from',
    getHost(),
    'rtgorganisation',
    personalInfosFormStore.company.organisation?.label,
    'rtgphonenumber',
    personalInfosFormStore.contact.phone,
    'email',
    personalInfosFormStore.contact.email,
    'rtgsecteuractivité',
    personalInfosFormStore.company.sector?.label,
    'rtgcodepostal',
    companyInfosForm.company.zipcode?.code,
    'rtgcanaldistribution',
    companyInfosForm.company.distributionChannel?.label,
    'rtgchiffredaffaires',
    companyInfosForm.company.salesRevenues?.label,
    'rtgclientele',
    getRadioLabel(customerTypeRadioInputs, companyInfosForm.company.customersType),
    'rtgclientbanquecagroupe',
    `${companyInfosForm.company.caCustomerAlready === clientYesNoRadioInputs[0].id}`,
    'rtgpreviouspage',
    getPreviousPage()
  ]);
};
</script>

<style scoped lang="scss">
@import 'src/styles/abstracts/variables';
@import 'src/styles/abstracts/functions';
@import 'src/styles/abstracts/mixins';

.contact-form__block {
  order: 4;
}

.contact-form {
  @include mq-desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.contact-form__form {
  display: flex;
  flex-flow: column nowrap;

  @include mq-desktop {
    width: 50%;
    min-width: toRem(508);
  }
}

.contact-form__confirmation {
  margin-top: toRem(83);

  @include mq-desktop {
    grid-column-start: 1;
    grid-column-end: 7;
  }
}

.contact-form__img {
  @include mq-to-tablet {
    display: none;
  }

  @include mq-desktop {
    flex: 50%;
  }

  img {
    @include mq-desktop {
      display: block;
      width: 100%;
      max-width: toRem(630);
      margin: auto;
    }
  }
}

.contact-form__title {
  margin-bottom: toRem(32);
  order: 2;
}

.contact-form__info {
  font-family: $font-poppins-regular;
  font-size: toRem(12);
  line-height: toRem(18);
  color: $color-grey-dark;
  order: 3;

  @include mq-desktop {
    margin-bottom: toRem(4);
  }
}

.contact-form__step {
  @include mq-desktop {
    display: flex;
    flex-flow: row wrap;
    margin: 0 toRem(-12);
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s ease-in-out;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
