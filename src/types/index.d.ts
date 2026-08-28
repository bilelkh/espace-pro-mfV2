export {};

declare global {
  interface Window {
    dataLayer: any;
    EA_push: any;
    formAction: string;
  }
}
