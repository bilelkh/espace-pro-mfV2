/**
 * POLYFILLS POUR ESPACE PRO VUEJS
 * Résout les erreurs JavaScript de compatibilité navigateur
 * Spécialement pour les erreurs _.addEventListener et TextEncoder
 */

// Protection contre les multiples exécutions
if (!window.POLYFILLS_LOADED) {
  window.POLYFILLS_LOADED = true;

  // POLYFILL 1: TextEncoder/TextDecoder pour les anciens navigateurs
  if (typeof TextEncoder === 'undefined') {
    (window as any).TextEncoder = function () {
      (this as any).encoding = 'utf-8';
    };

    (window as any).TextEncoder.prototype.encode = function (str: string): Uint8Array {
      const utf8: number[] = [];
      for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
            0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        }
        else {
          i++;
          charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        }
      }
      return new Uint8Array(utf8);
    };
  }

  if (typeof TextDecoder === 'undefined') {
    (window as any).TextDecoder = function () {
      (this as any).encoding = 'utf-8';
    };

    (window as any).TextDecoder.prototype.decode = function (bytes: Uint8Array): string {
      let result = '';
      let i = 0;
      while (i < bytes.length) {
        const byte1 = bytes[i++];
        if (byte1 < 0x80) {
          result += String.fromCharCode(byte1);
        } else if (byte1 < 0xc0) {
          // Invalid UTF-8
        } else if (byte1 < 0xe0) {
          const byte2 = bytes[i++];
          result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
        } else if (byte1 < 0xf0) {
          const byte2 = bytes[i++];
          const byte3 = bytes[i++];
          result += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
        }
      }
      return result;
    };
  }

  // POLYFILL 2: Element.matches pour les anciens navigateurs
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      (Element.prototype as any).matchesSelector ||
      (Element.prototype as any).mozMatchesSelector ||
      (Element.prototype as any).msMatchesSelector ||
      (Element.prototype as any).oMatchesSelector ||
      (Element.prototype as any).webkitMatchesSelector ||
      function (this: Element, s: string): boolean {
        const matches = ((this as any).document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) { }
        return i > -1;
      };
  }

  // POLYFILL 3: Element.closest pour les anciens navigateurs  
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (this: Element, s: string): Element | null {
      let el: Element | null = this;
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode as Element;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // POLYFILL 4: CustomEvent pour IE11
  if (typeof window.CustomEvent === 'undefined') {
    function CustomEvent(event: string, params: any = {}) {
      const { bubbles = false, cancelable = false, detail = undefined } = params;
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, bubbles, cancelable, detail);
      return evt;
    }
    (CustomEvent as any).prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent as any;
  }

  // POLYFILL 5: Object.assign pour IE11
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target: any): any {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // POLYFILL 6: Array.from pour IE11
  if (!Array.from) {
    Array.from = function <T, U>(
      arrayLike: ArrayLike<T>,
      mapFn?: (v: T, k: number) => U,
      thisArg?: any
    ): U[] {
      const C = this;
      const items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      const mapFunction = mapFn === undefined ? undefined : mapFn;
      if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
        throw new TypeError('Array.from: when provided, the second argument must be a function');
      }
      const len = parseInt(items.length);
      const A = typeof C === 'function' ? Object(new (C as any)(len)) : new Array(len);
      let k = 0;
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFunction) {
          A[k] = typeof thisArg === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(thisArg, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }

  // POLYFILL 7: matchMedia pour les anciens navigateurs (et Safari < 14)
  if (typeof window.matchMedia === 'undefined' || !window.matchMedia('all').addEventListener) {
    const localMatchMedia = window.matchMedia;

    window.matchMedia = function (query: string): MediaQueryList {
      // Si matchMedia existe mais sans addEventListener (ex: Safari ancien), on l'utilise
      // Sinon on retourne un objet mock
      const result = localMatchMedia ? localMatchMedia(query) : {
        matches: false,
        media: query,
        addListener: function () { },
        removeListener: function () { },
        onchange: null,
        dispatchEvent: function () { return true; }
      } as any;

      // On ajoute les méthodes manquantes si elles n'existent pas
      if (!result.addEventListener) {
        result.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject) {
          if (type === 'change' && this.addListener) {
            this.addListener(listener);
          }
        };
      }

      if (!result.removeEventListener) {
        result.removeEventListener = function (type: string, listener: EventListenerOrEventListenerObject) {
          if (type === 'change' && this.removeListener) {
            this.removeListener(listener);
          }
        };
      }

      return result as MediaQueryList;
    };
  }

  // POLYFILL 8: classList pour IE9/IE10
  if (!('classList' in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function () {
        const self = this;
        function update(fn: (classes: string[], index: number, value?: string) => void) {
          return function (value: string) {
            const classes = self.className.split(/\s+/);
            const index = classes.indexOf(value);
            fn(classes, index, value);
            self.className = classes.join(' ');
          };
        }
        const ret = {
          add: update(function (classes, index, value) {
            if (!~index) classes.push(value!);
          }),
          remove: update(function (classes, index) {
            if (~index) classes.splice(index, 1);
          }),
          toggle: update(function (classes, index, value) {
            if (~index)
              classes.splice(index, 1);
            else
              classes.push(value!);
          }),
          contains: function (value: string) {
            return !!~self.className.split(/\s+/).indexOf(value);
          },
          item: function (i: number) {
            return self.className.split(/\s+/)[i] || null;
          }
        };
        Object.defineProperty(ret, 'length', {
          get: function () {
            return self.className.split(/\s+/).length;
          }
        });
        return ret;
      }
    });
  }

  // POLYFILL 9: Protection AGGRESSIVE pour les conflits underscore.js
  // Ce polyfill corrige spécifiquement les erreurs _.addEventListener
  if (typeof window._ !== 'undefined') {
    // Sauvegarde les méthodes natives de manière permanente
    const NATIVE_ADD = Element.prototype.addEventListener;
    const NATIVE_REMOVE = Element.prototype.removeEventListener;

    // Protection contre l'écrasement par underscore.js
    const protectNativeMethods = () => {
      // Si underscore.js a écrasé addEventListener
      if (typeof window._.addEventListener === 'function') {
        console.warn('Underscore.js conflict detected with addEventListener, fixing...');

        // Restaurer les méthodes natives pour tous les prototypes
        if (NATIVE_ADD) {
          Element.prototype.addEventListener = NATIVE_ADD;
          Document.prototype.addEventListener = Document.prototype.addEventListener || NATIVE_ADD;
          Window.prototype.addEventListener = Window.prototype.addEventListener || NATIVE_ADD;

          // Protection des instances globales
          if (typeof document.addEventListener !== 'function') {
            document.addEventListener = NATIVE_ADD.bind(document);
          }
          if (typeof window.addEventListener !== 'function') {
            window.addEventListener = NATIVE_ADD.bind(window);
          }
        }

        if (NATIVE_REMOVE) {
          Element.prototype.removeEventListener = NATIVE_REMOVE;
          Document.prototype.removeEventListener = Document.prototype.removeEventListener || NATIVE_REMOVE;
          Window.prototype.removeEventListener = Window.prototype.removeEventListener || NATIVE_REMOVE;

          // Protection des instances globales
          if (typeof document.removeEventListener !== 'function') {
            document.removeEventListener = NATIVE_REMOVE.bind(document);
          }
          if (typeof window.removeEventListener !== 'function') {
            window.removeEventListener = NATIVE_REMOVE.bind(window);
          }
        }

        // Redéfinir underscore pour qu'il n'écrase plus les méthodes DOM
        Object.defineProperty(window._, 'addEventListener', {
          value: NATIVE_ADD,
          writable: false,
          configurable: false
        });

        Object.defineProperty(window._, 'removeEventListener', {
          value: NATIVE_REMOVE,
          writable: false,
          configurable: false
        });
      }
    };

    // Exécution immédiate
    protectNativeMethods();

    // Surveillance continue avec MutationObserver si disponible
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        if (typeof window._.addEventListener === 'function' &&
          window._.addEventListener !== NATIVE_ADD) {
          protectNativeMethods();
        }
      });
      observer.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    // Surveillance avec timer de fallback
    setInterval(protectNativeMethods, 1000);

    // Protection au chargement de la page
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', protectNativeMethods);
    } else {
      setTimeout(protectNativeMethods, 0);
    }

    // Protection lors d'événements de focus
    window.addEventListener('focus', protectNativeMethods, { passive: true });
  }

  console.log('Polyfills Vue.js chargés avec succès - Compatible IE11+');
}

// Types pour TypeScript
declare global {
  interface Window {
    POLYFILLS_LOADED?: boolean;
    _?: any;
    TextEncoder?: any;
    TextDecoder?: any;
  }
}

export { };