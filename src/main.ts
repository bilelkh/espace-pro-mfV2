import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import Maska from 'maska';

import App from '@/App.vue';
import fr from '@/assets/locales/fr.json';

const i18n = createI18n({
  locale: 'fr',
  globalInjection: true,
  legacy: false,
  messages: {
    fr
  }
});

const app = createApp(App);
app.use(createPinia());
app.use(i18n);
app.use(Maska);
app.mount('#app');
