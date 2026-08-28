const isFocusableElement = (element: HTMLElement, tabIndex: string | null) =>
  element instanceof HTMLButtonElement ||
  element instanceof HTMLAnchorElement ||
  element instanceof HTMLInputElement ||
  element instanceof HTMLSelectElement ||
  element instanceof HTMLTextAreaElement ||
  element instanceof HTMLAreaElement ||
  tabIndex;

export function forceFocusOnElement(element: HTMLElement | undefined | null, resetTabindex = true): void {
  if (element) {
    const initialTabIndex = element.getAttribute('tabindex');
    if (isFocusableElement(element, initialTabIndex)) {
      element.focus();
    } else {
      element.setAttribute('tabindex', '-1');
      element.focus();
      if (resetTabindex) {
        setTimeout(() => element.removeAttribute('tabindex'), 1000);
      }
    }
  }
}
