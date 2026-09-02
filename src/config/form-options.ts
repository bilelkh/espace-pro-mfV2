import type { RadioInputParam } from '@/models/input';

export const customerTypeRadioInputs: RadioInputParam[] = [
  { id: 'customerIndividual', label: 'Particulier' },
  { id: 'customerPro', label: 'Pro' },
  { id: 'customerIndividualPro', label: 'Les deux' }
];

export const clientYesNoRadioInputs: RadioInputParam[] = [
  { id: 'clientYes', label: 'Oui' },
  { id: 'clientNo', label: 'Non' }
];

// Le plan de taggage attend les valeurs en toutes lettres, pas les identifiants techniques.
export function getRadioLabel(radioInputsParam: RadioInputParam[], id: string): string {
  return radioInputsParam.find((param) => param.id === id)?.label || '';
}
