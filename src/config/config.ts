export interface EspaceProConfig {
  baseResourcesUrl: string;
  cityApiUrl: string;
  submitContactFormUrl: string;
}
export const espaceProConfig: EspaceProConfig = Object.freeze({
  baseResourcesUrl: window.espaceProConfig?.BASE_RESOURCES_URL || import.meta.env.VITE_BASE_RESOURCES_URL || '',
  cityApiUrl: window.espaceProConfig?.CITY_API_URL || import.meta.env.VITE_CITY_API_URL || '',
  submitContactFormUrl:
    window.espaceProConfig?.SUBMIT_CONTACT_FORM_URL || import.meta.env.VITE_SUBMIT_CONTACT_FORM_URL || '#',
});
