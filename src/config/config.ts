export interface SalesForceFieldConfig {
  id: string;
  name: string;
  value?: string;
}

export interface SalesForceFormConfig {
  form: {
    returnURL: string;
    actionURL: string;
    oid: string;
    lead_source: SalesForceFieldConfig;
    salutation: SalesForceFieldConfig;
    lastname: SalesForceFieldConfig;
    firstname: SalesForceFieldConfig;
    organisation: SalesForceFieldConfig;
    otherOrganisation: SalesForceFieldConfig;
    otherSector: SalesForceFieldConfig;
    phone: SalesForceFieldConfig;
    email: SalesForceFieldConfig;
    sector: SalesForceFieldConfig;
    companyName: SalesForceFieldConfig;
    siren: SalesForceFieldConfig;
    siret: SalesForceFieldConfig;
    zipcode: SalesForceFieldConfig;
    zip: SalesForceFieldConfig;
    distributionChannel: SalesForceFieldConfig;
    salesRevenues: SalesForceFieldConfig;
    creditVolume: SalesForceFieldConfig;
    customersType: SalesForceFieldConfig;
    caCustomerAlready: SalesForceFieldConfig;
  };
}

export interface EspaceProConfig {
  baseResourcesUrl: string;
  cityApiUrl: string;
  submitContactFormUrl: string;
  salesForceFormConfig: string;
}
export const espaceProConfig: EspaceProConfig = Object.freeze({
  baseResourcesUrl: window.espaceProConfig?.BASE_RESOURCES_URL || import.meta.env.VITE_BASE_RESOURCES_URL || '',
  cityApiUrl: window.espaceProConfig?.CITY_API_URL || import.meta.env.VITE_CITY_API_URL || '',
  submitContactFormUrl:
    window.espaceProConfig?.SUBMIT_CONTACT_FORM_URL || import.meta.env.VITE_SUBMIT_CONTACT_FORM_URL || '#',
  salesForceFormConfig:
    window.espaceProConfig?.SALES_FORCE_FORM_CONFIG || import.meta.env.VITE_SALES_FORCE_FORM_CONFIG || ''
});
