// Déclarations globales TypeScript pour Vue 3
// Correction des erreurs de props ARIA automatiquement générées par Vue

declare module '@vue/runtime-dom' {
  interface HTMLAttributes {
    // Désactiver la vérification stricte pour les attributs ARIA
    [key: string]: any;
  }
  
  interface ButtonHTMLAttributes extends HTMLAttributes {}
  interface InputHTMLAttributes extends HTMLAttributes {}
  interface FieldsetHTMLAttributes extends HTMLAttributes {}
  interface LiHTMLAttributes extends HTMLAttributes {}
}

declare module '@vue/runtime-core' {
  interface AllowedComponentProps {
    // Permettre tous les attributs pour éviter les conflits camelCase/kebab-case
    [key: string]: any;
  }
  
  interface ComponentCustomProps {
    // Props personnalisées pour composants
    [key: string]: any;
  }
}

export {};