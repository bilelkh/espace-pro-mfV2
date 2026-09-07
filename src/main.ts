// Charger les polyfills en premier pour résoudre les erreurs JavaScript
import '@/utils/polyfills';
import '@/styles/main.scss';

// Protection supplémentaire contre les conflits underscore.js
(function () {
  // Sauvegarde immédiate des méthodes natives avant toute manipulation
  const nativeAdd = Element.prototype.addEventListener;
  const nativeRemove = Element.prototype.removeEventListener;

  // Fonction de restauration d'urgence
  const emergencyFix = () => {
    if (typeof window._ !== 'undefined' &&
      typeof window._.addEventListener === 'function' &&
      window._.addEventListener !== nativeAdd) {
      console.warn('Emergency fix for underscore.js addEventListener conflict');
      Element.prototype.addEventListener = nativeAdd;
      Element.prototype.removeEventListener = nativeRemove;
      if (typeof document.addEventListener !== 'function') {
        document.addEventListener = nativeAdd.bind(document);
      }
      if (typeof window.addEventListener !== 'function') {
        window.addEventListener = nativeAdd.bind(window);
      }
    }
  };

  // Surveillance immédiate
  const fixInterval = setInterval(emergencyFix, 100);

  // Arrêter après 10 secondes
  setTimeout(() => clearInterval(fixInterval), 10000);
})();

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import Maska from 'maska';

import App from '@/App.vue';
import fr from '@/assets/locales/fr.json';

// Système de détection d'intention utilisateur pour l'accessibilité
function initWhatintent() {
  let currentIntent = 'keyboard'; // Par défaut: clavier pour l'accessibilité
  
  // Fonction pour mettre à jour l'attribut data-whatintent
  function updateIntent(intent: string) {
    if (currentIntent !== intent) {
      currentIntent = intent;
      document.documentElement.setAttribute('data-whatintent', intent);
    }
  }
  
  // Détection des interactions souris
  document.addEventListener('mousedown', () => updateIntent('mouse'), true);
  document.addEventListener('mousemove', () => updateIntent('mouse'), true);
  
  // Détection des interactions tactiles
  document.addEventListener('touchstart', () => updateIntent('touch'), true);
  
  // Détection des interactions clavier
  document.addEventListener('keydown', (e) => {
    // Ne considérer que les touches de navigation (Tab, flèches, etc.)
    if (e.key === 'Tab' || 
        e.key.startsWith('Arrow') || 
        e.key === 'Enter' || 
        e.key === 'Space' ||
        e.key === 'Escape') {
      updateIntent('keyboard');
    }
  }, true);
  
  // Initialiser avec l'état par défaut
  updateIntent('keyboard');
}

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

// Initialiser le système de détection d'intention
initWhatintent();

app.mount('#app');
