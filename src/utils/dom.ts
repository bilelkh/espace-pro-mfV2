/**
 * Utilitaires DOM sécurisés pour espace-pro-vuejs
 * Prévient les erreurs liées aux accès non sécurisés aux attributs
 */

// Fonction d'aide pour vérifier les types
function isElement(el: any): el is Element {
  return el && typeof el === 'object' && el.nodeType === 1;
}

function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

/**
 * Récupération sécurisée des attributs DOM
 */
export function getAttributeValue(element: Element, attributeName: string): string | null {
  if (!isElement(element)) return null;
  
  const attribute = element.attributes.getNamedItem(attributeName);
  return attribute ? attribute.value : null;
}

/**
 * Vérification sécurisée des attributs multiples
 */
export function checkAttributeValues(
  element: Element, 
  attributeChecks: Array<{ name: string; expected: string }>
): boolean {
  if (!isElement(element) || !Array.isArray(attributeChecks)) return false;
  
  return attributeChecks.every(check => {
    const value = getAttributeValue(element, check.name);
    return value === check.expected;
  });
}

/**
 * addEventListener sécurisé avec protection contre les conflits underscore.js
 */
export function addEventListener(
  element: Element | Document | Window, 
  event: string, 
  handler: EventListener, 
  options: AddEventListenerOptions = {}
): boolean {
  if (!element || !isFunction(handler)) {
    console.warn('DOM addEventListener: Invalid element or handler');
    return false;
  }
  
  try {
    // Utilisation de la méthode native protégée contre underscore.js
    if ('addEventListener' in element) {
      element.addEventListener(event, handler, options);
      return true;
    }
  } catch (error) {
    console.error('DOM addEventListener error:', error);
    return false;
  }
  
  return false;
}

/**
 * removeEventListener sécurisé
 */
export function removeEventListener(
  element: Element | Document | Window, 
  event: string, 
  handler: EventListener, 
  options: EventListenerOptions = {}
): boolean {
  if (!element || !isFunction(handler)) {
    console.warn('DOM removeEventListener: Invalid element or handler');
    return false;
  }
  
  try {
    if ('removeEventListener' in element) {
      element.removeEventListener(event, handler, options);
      return true;
    }
  } catch (error) {
    console.error('DOM removeEventListener error:', error);
    return false;
  }
  
  return false;
}

/**
 * querySelector sécurisé avec fallbacks
 */
export function querySelector(
  parent: Element | Document, 
  selector: string
): Element | null {
  if (!parent || !selector) return null;
  
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.error('DOM querySelector error:', error);
    return null;
  }
}

/**
 * querySelectorAll sécurisé avec fallbacks
 */
export function querySelectorAll(
  parent: Element | Document, 
  selector: string
): NodeListOf<Element> | Element[] {
  if (!parent || !selector) return [] as Element[];
  
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.error('DOM querySelectorAll error:', error);
    return [] as Element[];
  }
}

/**
 * Manipulation de classes sécurisée avec fallbacks IE
 */
export function addClass(element: Element, className: string): boolean {
  if (!isElement(element) || !className) return false;
  
  try {
    if (element.classList) {
      element.classList.add(className);
    } else {
      // Fallback pour IE9
      const classes = element.className.split(' ');
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        element.className = classes.join(' ');
      }
    }
    return true;
  } catch (error) {
    console.error('DOM addClass error:', error);
    return false;
  }
}

export function removeClass(element: Element, className: string): boolean {
  if (!isElement(element) || !className) return false;
  
  try {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      // Fallback pour IE9
      const classes = element.className.split(' ');
      const index = classes.indexOf(className);
      if (index > -1) {
        classes.splice(index, 1);
        element.className = classes.join(' ');
      }
    }
    return true;
  } catch (error) {
    console.error('DOM removeClass error:', error);
    return false;
  }
}

export function hasClass(element: Element, className: string): boolean {
  if (!isElement(element) || !className) return false;
  
  try {
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      // Fallback pour IE9
      return element.className.split(' ').indexOf(className) > -1;
    }
  } catch (error) {
    console.error('DOM hasClass error:', error);
    return false;
  }
}

export function toggleClass(element: Element, className: string): boolean {
  if (!isElement(element) || !className) return false;
  
  try {
    if (element.classList) {
      element.classList.toggle(className);
    } else {
      // Fallback pour IE9
      if (hasClass(element, className)) {
        removeClass(element, className);
      } else {
        addClass(element, className);
      }
    }
    return true;
  } catch (error) {
    console.error('DOM toggleClass error:', error);
    return false;
  }
}