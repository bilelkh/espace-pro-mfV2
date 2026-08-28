import { defineStore } from 'pinia';

export const useQuizzFormStore = defineStore({
  id: 'quizzForm',
  state: (): QuizzFormState => ({
    activity: null,
    distributionChannel: null,
    cart: null,
    clients: null
  }),
  getters: {},
  actions: {}
});

export interface QuizzFormState {
  activity: string | null;
  distributionChannel: string | null;
  cart: string | null;
  clients: string | null;
}
