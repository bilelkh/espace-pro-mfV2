export function sanitize(value: any) {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  const reg = /[&<>"'/]/gi;
  if (value && typeof value === 'string') {
    return value.replace(reg, (match) => map[match]);
  }
  return '';
}
