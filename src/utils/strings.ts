export function filterNumberValidChars(input: string) {
  return input.replace(/[^0-9\s+]+/g, '');
}

export function hasOnlyNumbers(value: string): boolean {
  return value.match(/^[0-9]+$/) !== null;
}

export function removeSpace(value: string): string {
  return value.replace(/ /g, '');
}
