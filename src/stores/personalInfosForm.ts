import { defineStore } from 'pinia';
import type { SelectOption } from '@/models/form';

export interface PersonalInfosFormState {
  salutation: SelectOption | null,
  firstname: string;
  lastname: string;
  contact: {
    email: string;
    phone: string;
  };
  company: {
    organisation: SelectOption | null;
    otherOrganisation: string | null;
    sector: SelectOption | null;
    otherSector: string | null;
  };
}

export const usePersonalInfosFormStore = defineStore('personalInfosForm', {
  state: (): PersonalInfosFormState => ({
    salutation: null,
    firstname: '',
    lastname: '',
    contact: {
      email: '',
      phone: ''
    },
    company: {
      organisation: null,
      otherOrganisation: null,
      sector: null,
      otherSector: null,
    }
  }),
  getters: {},
  actions: {}
});
