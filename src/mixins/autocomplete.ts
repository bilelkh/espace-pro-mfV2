import axios from 'axios';
import type { ICAutocomplete } from '@/models/cautocomplete';
import { espaceProConfig } from '@/config/config';

export function getCities(search: string): Promise<ICAutocomplete[]> {
  return axios
    .get<ICAutocomplete[]>(espaceProConfig.cityApiUrl, {
      params: {
        q: search
      }
    })
    .then((res) => res.data);
}
