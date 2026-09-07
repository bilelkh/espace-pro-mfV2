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
      <form ref="sfForm" class="contact-form__block" :action="sfFields?.actionURL" method="POST">
        <template v-if="sfFields">
          <input type="hidden" name="oid" :value="sfFields.oid" />
          <input type="hidden" name="retURL" :value="sfFields.returnURL" />
          <input type="hidden" :name="sfFields.lead_source.name" :value="sfFields.lead_source.value" />
          <input type="hidden" :name="sfFields.salutation.name" :value="salutation?.label ?? ''" />
          <input type="hidden" :name="sfFields.lastname.name" :value="lastname ?? ''" />
          <input type="hidden" :name="sfFields.firstname.name" :value="firstname ?? ''" />
          <input type="hidden" :name="sfFields.phone.name" :value="contact?.phone ?? ''" />
          <input type="hidden" :name="sfFields.email.name" :value="contact?.email ?? ''" />
          <input
            type="hidden"
            :name="sfFields.organisation.name"
            :value="personalCompany?.organisation?.label || ''"
          />
          <input
            v-if="personalCompany?.otherOrganisation && sfFields.otherOrganisation"
            type="hidden"
            :name="sfFields.otherOrganisation.name"
            :value="personalCompany?.otherOrganisation"
          />
          <input
            type="hidden"
            :name="sfFields.sector.name"
            :value="personalCompany?.sector?.label || ''"
          />
          <input
            v-if="personalCompany?.otherSector && sfFields.otherSector"
            type="hidden"
            :name="sfFields.otherSector.name"
            :value="personalCompany?.otherSector"
          />
          <input type="hidden" :name="sfFields.zipcode.name" :value="String(company?.zipcode?.code ?? '')" />
          <input type="hidden" :name="sfFields.zip.name" :value="String(company?.zipcode?.code ?? '')" />
          <input
            type="hidden"
            :name="sfFields.distributionChannel.name"
            :value="company?.distributionChannel?.label ?? ''"
          />
          <input
            type="hidden"
            :name="sfFields.salesRevenues.name"
            :value="company?.salesRevenues?.label ?? ''"
          />
          <input type="hidden" :name="sfFields.creditVolume.name" :value="company?.creditVolume?.label ?? ''" />
        </template>
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
import { ref, provide } from 'vue';
import Stepper from '@/components/Form/Stepper/Stepper.vue';
import PersonalInfosStep from '@/components/Form/ContactForm/PersonalInfosStep.vue';
import CompanyInfosStep from '@/components/Form/ContactForm/CompanyInfosStep.vue';

import { usePersonalInfosFormStore } from '@/stores/personalInfosForm';
import { useCompanylInfosFormStore } from '@/stores/companyInfosForm';
import { storeToRefs } from 'pinia';
import { changePageTitle } from '@/mixins/title';
import { dataLayerGAWrapper, eaCollectorWrapper } from '@/mixins/taggingPlan';
import { getHost } from '@/mixins/host';
import { espaceProConfig } from '@/config/config';
import type { SalesForceFormConfig } from '@/config/config';

const personalInfosFormStore = usePersonalInfosFormStore();
const companyInfosForm = useCompanylInfosFormStore();

const { salutation, lastname, firstname, contact, company: personalCompany } = storeToRefs(personalInfosFormStore);
const { company } = storeToRefs(companyInfosForm);
const sfForm = ref<HTMLFormElement | null>(null);
const activeStep = ref(1);

const sfFields = espaceProConfig.salesForceFormConfig
  ? (JSON.parse(espaceProConfig.salesForceFormConfig) as SalesForceFormConfig).form
  : null;
provide('sfFields', sfFields);

const changeActiveStep = () => {
  activeStep.value++;
};

const submitContactForm = (): void => {
  const siretInput = document.getElementById(sfFields?.siret.id ?? 'siret') as HTMLInputElement;
  if (siretInput) siretInput.value = companyInfosForm.company.siret.replace(/\s/g, '');

  if (sfForm.value && !import.meta.env.PROD) {
    const formData = new FormData(sfForm.value);

    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value as string;
    });
    console.table(Object.entries(payload).map(([name, value]) => ({ name, value })));
  }
  sfForm.value?.submit();
};

const handleSumbitContactForm = () => {
  changePageTitle('Confirmation', 'Formulaire');
  manageGtmOnSubmitContactForm();
  manageEulerianOnSubmitContactForm();
  submitContactForm();
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

const manageEulerianOnSubmitContactForm = (): void => {
  eaCollectorWrapper([
    'rtgsite',
    'professionnel',
    'rtgpg',
    'form',
    'rtgidform',
    'contact',
    'type',
    `${personalInfosFormStore.company.sector?.label}`,
    'estimate',
    '1',
    'ref',
    '_' + Math.random().toString(36).substr(2, 9),
    'rtgpagename',
    'envoi_formulaire_contact',
    'path',
    window.location.pathname,
    'from',
    getHost(),
    'rtgpreviouspage',
    document.referrer,
    'rtgsalutation',
    personalInfosFormStore.salutation?.label,
    'rtgnom',
    personalInfosFormStore.lastname,
    'rtgprenom',
    personalInfosFormStore.firstname,
    'rtgorganisation',
    `${personalInfosFormStore.company.otherOrganisation || personalInfosFormStore.company.organisation?.id}`,
    'rtgphonenumber',
    personalInfosFormStore.contact.phone,
    'email',
    personalInfosFormStore.contact.email,
    'rtgsecteuractivité',
    `${personalInfosFormStore.company.otherSector || personalInfosFormStore.company.sector?.id}`,
    'rtgraisonsociale',
    companyInfosForm.company.name,
    'rtgsiren',
    companyInfosForm.company.siren,
    'rtgsiret',
    companyInfosForm.company.siret.replace(/\s/g, ''),
    'rtgcodepostal',
    companyInfosForm.company.zipcode?.code,
    'rtgzip',
    companyInfosForm.company.zipcode?.code,
    'rtgcanaldistribution',
    `${companyInfosForm.company.distributionChannel?.id}`,
    'rtgchiffredaffaires',
    `${companyInfosForm.company.salesRevenues?.id}`,
    'rtgclientele',
    companyInfosForm.company.customersType,
    'rtgclientbanquecagroupe',
    companyInfosForm.company.caCustomerAlready
  ]);
};
</script>

<style scoped lang="scss">
@use 'src/styles/abstracts/variables' as var;
@use 'src/styles/abstracts/functions' as func;
@use 'src/styles/abstracts/mixins' as mix;

.contact-form__block {
  order: 4;
}

.contact-form {
  @include mix.mq-desktop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.contact-form__form {
  display: flex;
  flex-flow: column nowrap;

  @include mix.mq-desktop {
    width: 50%;
    min-width: func.toRem(508);
  }
}

.contact-form__confirmation {
  margin-top: func.toRem(83);

  @include mix.mq-desktop {
    grid-column-start: 1;
    grid-column-end: 7;
  }
}

.contact-form__img {
  @include mix.mq-to-tablet {
    display: none;
  }

  @include mix.mq-desktop {
    flex: 50%;
  }

  img {
    @include mix.mq-desktop {
      display: block;
      width: 100%;
      max-width: func.toRem(630);
      margin: auto;
    }
  }
}

.contact-form__title {
  margin-bottom: func.toRem(32);
  order: 2;
}

.contact-form__info {
  font-family: var.$font-poppins-regular;
  font-size: func.toRem(12);
  line-height: func.toRem(18);
  color: var.$color-primary-base !important;
  order: 3;

  @include mix.mq-desktop {
    margin-bottom: func.toRem(4);
  }
}

.contact-form__step {
  @include mix.mq-desktop {
    display: flex;
    flex-flow: row wrap;
    margin: 0 func.toRem(-12);
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
