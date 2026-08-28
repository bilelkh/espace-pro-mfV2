export interface ICAutocomplete {
  code: string | number;
  label: string;
  alternativeLabel: string;
}

export interface IInputProps {
  id: string;
  initialValue: string;
  autocomplete: string;
}

export enum ICAutocompleteExcludedCode {
  LOADING = 'loading',
  ERROR = 'error'
}
