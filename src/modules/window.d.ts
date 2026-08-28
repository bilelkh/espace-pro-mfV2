// Mark window.d.ts as an external module
export {};

declare global {
  interface Window {
    imgUrl: string;
    espaceProConfig: WEspaceProConfig;
  }
}

interface WEspaceProConfig {
  BASE_RESOURCES_URL: string;
  CITY_API_URL: string;
  SUBMIT_CONTACT_FORM_URL: string;
}
