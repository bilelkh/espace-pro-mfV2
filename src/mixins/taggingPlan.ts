import { exponentialBackoff } from '@/mixins/exponentialBackoff';

export function eaCollectorWrapper(...data: any) {
  exponentialBackoff(
    () => !!(window as any).EA_push,
    12,
    50,
    () => {
      (window as any).EA_push(...data);
    }
  );
}

export function dataLayerGAWrapper(params: any) {
  setTimeout(function () {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push(params);
    }
  }, 2000);
}
