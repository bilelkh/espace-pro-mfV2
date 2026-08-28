import { defineStore } from 'pinia';
import type { SelectOption } from '@/models/form';

export interface PersonalInfosFormState {
  firstname: string;
  lastname: string;
  contact: {
    email: string;
    phone: string;
  };
  company: {
    organisation: SelectOption | null;
    sector: SelectOption | null;
  };
}

export const usePersonalInfosFormStore = defineStore('personalInfosForm', {
  state: (): PersonalInfosFormState => ({
    firstname: '',
    lastname: '',
    contact: {
      email: '',
      phone: ''
    },
    company: {
      organisation: null,
      sector: null
    }
  }),
  getters: {},
  actions: {}
});
