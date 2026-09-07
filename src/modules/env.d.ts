/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_RESOURCES_URL: string;
  readonly VITE_CITY_API_URL: string;
  readonly VITE_SUBMIT_CONTACT_FORM_URL: string;
  readonly VITE_SALES_FORCE_FORM_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}