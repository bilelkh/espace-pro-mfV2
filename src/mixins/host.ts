export function getHost() {
  switch (window.location.host) {
    case 'www.pro.sofinco.fr':
      return 'sofinco_professionnel';
    case 'rct.pro.sofinco.fr':
      return 'sofinco_professionnel_preprod';
    default:
      return 'sofinco_professionnel_local';
  }
}

export function getEnv() {
  switch (window.location.host) {
    case 'www.pro.sofinco.fr':
      return 'production';
    case 'rct.pro.sofinco.fr':
      return 'recette';
    default:
      return 'local';
  }
}
