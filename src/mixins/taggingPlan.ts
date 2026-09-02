import { exponentialBackoff } from '@/mixins/exponentialBackoff';

export function eaCollectorWrapper(...data: any) {
  exponentialBackoff(
    () => !!(window as any).EA_push,
    12,
    50,
    () => {
      (window as any).EA_push(...data);
    }
  );
}

const firedTags = new Set<string>();

// Le plan de taggage impose un seul déclenchement par page : ce garde-fou évite les doublons
// si le composant est monté plusieurs fois sur la même page.
export function eaCollectorWrapperOnce(key: string, ...data: any) {
  if (firedTags.has(key)) return;

  firedTags.add(key);
  eaCollectorWrapper(...data);
}

export function dataLayerGAWrapper(params: any) {
  setTimeout(function () {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push(params);
    }
  }, 2000);
}

// `path` : nom de l'url (après le .fr, sans tracking) avec les « / » remplacés par des « | ».
// Ex : /contact/formulaire -> contact|formulaire
export function getTaggingPath(): string {
  return formatTaggingPath(window.location.pathname);
}

function formatTaggingPath(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '|');
}

let previousPage = '';

// `rtgpreviouspage` : page précédente. Le référent sur la 1re page taggée (contact_perso),
// puis contact_perso pour les pages suivantes du parcours (contact_entreprise, envoi).
export function getPreviousPage(): string {
  if (previousPage) return previousPage;

  if (!document.referrer) return '';

  try {
    const referrer = new URL(document.referrer);
    return referrer.host === window.location.host ? formatTaggingPath(referrer.pathname) : referrer.host;
  } catch (error) {
    return '';
  }
}

export function setPreviousPage(pageName: string): void {
  previousPage = pageName;
}

// `ref` : identifiant unique de l'envoi de formulaire.
export function generateFormRef(): string {
  return '_' + Math.random().toString(36).slice(2, 11);
}
