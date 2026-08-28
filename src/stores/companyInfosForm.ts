import { defineStore } from 'pinia';
import type { ICAutocomplete } from '@/models/cautocomplete';
import type { SelectOption } from '@/models/form';

export interface CompanyInfosFormState {
  company: {
    name: string;
    siren: string;
    zipcode: ICAutocomplete | null;
    distributionChannel: SelectOption | null;
    salesRevenues: SelectOption | null;
    customersType: string;
    caCustomerAlready: string;
  };
}

export const useCompanylInfosFormStore = defineStore({
  id: 'companyInfosForm',
  state: (): CompanyInfosFormState => ({
    company: {
      name: '',
      siren: '',
      zipcode: null,
      distributionChannel: null,
      salesRevenues: null,
      customersType: '',
      caCustomerAlready: ''
    }
  }),
  getters: {},
  actions: {}
});
