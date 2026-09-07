/**
 * Script d'urgence pour la protection contre les conflits underscore.js
 * Ce script doit être injecté en premier dans l'HTML si le problème persiste
 */
(function() {
  'use strict';
  
  // Sauvegarde IMMÉDIATE des méthodes natives
  const SAFE_METHODS = {
    addEventListener: Element.prototype.addEventListener,
    removeEventListener: Element.prototype.removeEventListener,
    docAdd: Document.prototype.addEventListener,
    docRemove: Document.prototype.removeEventListener,
    winAdd: Window.prototype.addEventListener,
    winRemove: Window.prototype.removeEventListener
  };
  
  // Fonction de réparation agressive
  function aggressiveFix() {
    // Vérification de la corruption par underscore.js
    if (typeof window._ !== 'undefined') {
      let needsFix = false;
      
      // Détecter si underscore.js a pollué les prototypes
      if (typeof window._.addEventListener === 'function') {
        console.warn('🔧 Underscore.js addEventListener pollution detected - applying emergency fix');
        needsFix = true;
      }
      
      // Détecter si les méthodes natives sont cassées
      if (typeof Element.prototype.addEventListener !== 'function' ||
          Element.prototype.addEventListener === window._?.addEventListener) {
        console.warn('🚨 Native addEventListener corrupted - emergency restoration');
        needsFix = true;
      }
      
      if (needsFix) {
        // Restauration immédiate et forcée
        try {
          Element.prototype.addEventListener = SAFE_METHODS.addEventListener;
          Element.prototype.removeEventListener = SAFE_METHODS.removeEventListener;
          
          if (SAFE_METHODS.docAdd) {
            Document.prototype.addEventListener = SAFE_METHODS.docAdd;
            Document.prototype.removeEventListener = SAFE_METHODS.docRemove;
          }
          
          if (SAFE_METHODS.winAdd) {
            Window.prototype.addEventListener = SAFE_METHODS.winAdd;
            Window.prototype.removeEventListener = SAFE_METHODS.winRemove;
          }
          
          // Protection des instances globales
          if (typeof document.addEventListener !== 'function') {
            document.addEventListener = SAFE_METHODS.addEventListener.bind(document);
            document.removeEventListener = SAFE_METHODS.removeEventListener.bind(document);
          }
          
          if (typeof window.addEventListener !== 'function') {
            window.addEventListener = SAFE_METHODS.winAdd.bind(window);
            window.removeEventListener = SAFE_METHODS.winRemove.bind(window);
          }
          
          // Verrouillage d'underscore pour éviter la re-corruption
          if (window._ && typeof window._.addEventListener === 'function') {
            try {
              Object.defineProperty(window._, 'addEventListener', {
                value: SAFE_METHODS.addEventListener,
                writable: false,
                configurable: false
              });
              Object.defineProperty(window._, 'removeEventListener', {
                value: SAFE_METHODS.removeEventListener,
                writable: false,
                configurable: false
              });
            } catch(e) {
              console.warn('Could not lock underscore.js methods:', e);
            }
          }
          
          console.log('✅ Emergency fix applied successfully');
        } catch (error) {
          console.error('❌ Emergency fix failed:', error);
        }
      }
    }
  }
  
  // Exécution immédiate
  aggressiveFix();
  
  // Surveillance continue
  let fixCount = 0;
  const surveillanceInterval = setInterval(function() {
    aggressiveFix();
    fixCount++;
    
    // Arrêter après 100 vérifications (10 secondes)
    if (fixCount > 100) {
      clearInterval(surveillanceInterval);
      console.log('🛡️ Emergency polyfill surveillance ended');
    }
  }, 100);
  
  // Protection sur les événements de chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aggressiveFix);
  }
  
  window.addEventListener('load', aggressiveFix);
  window.addEventListener('focus', aggressiveFix);
  
  // Export pour utilisation manuelle si nécessaire
  window.EMERGENCY_UNDERSCORE_FIX = aggressiveFix;
  
})();