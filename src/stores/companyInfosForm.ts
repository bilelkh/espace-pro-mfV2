import { defineStore } from 'pinia';
import type { ICAutocomplete } from '@/models/cautocomplete';
import type { SelectOption } from '@/models/form';

export interface CompanyInfosFormState {
  company: {
    name: string;
    siren: string;
    siret: string;
    zipcode: ICAutocomplete | null;
    zip: ICAutocomplete | null;
    distributionChannel: SelectOption | null;
    salesRevenues: SelectOption | null;
    customersType: string;
    caCustomerAlready: string;
    creditVolume: SelectOption | null;
  };
}

export const useCompanylInfosFormStore = defineStore({
  id: 'companyInfosForm',
  state: (): CompanyInfosFormState => ({
    company: {
      name: '',
      siren: '',
      siret: '',
      zipcode: null,
      zip: null,
      distributionChannel: null,
      salesRevenues: null,
      customersType: '',
      caCustomerAlready: '',
	  creditVolume: null
    }
  }),
  getters: {},
  actions: {}
});
