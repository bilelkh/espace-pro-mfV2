/**
 * Multi browser support for document scroll left
 * @returns {Number}
 */
export function getDocumentScrollLeft(): number {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

/**
 * Multi browser support for document scroll top
 * @returns {Number}
 */
export function getDocumentScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function preventDefault(e: Event) {
  e.preventDefault();
}

export function stopBodyScroll() {
  document.body.classList.add('stop-scrolling');
  document.body.addEventListener('touchmove', preventDefault);
}

export function resumeBodyScroll() {
  document.body.classList.remove('stop-scrolling');
  document.body.removeEventListener('touchmove', preventDefault);
}

export function positionOverflowingElement(container: HTMLElement, target: HTMLElement, position = 'top') {
  if (!isOverflowing(container, target)) return;
  if (position == 'top') {
    _positionElementAtTop(container, target);
  } else {
    _positionElementAtBottom(container, target);
  }
}

/**
 * Position the element at the bottom of the element.
 */
function _positionElementAtBottom(container: HTMLElement, target: HTMLElement) {
  container.scrollTop = target.offsetTop - (container.clientHeight - target.offsetHeight);
}

/**
 * Position the element at the top of the element.
 */
function _positionElementAtTop(container: HTMLElement, target: HTMLElement) {
  container.scrollTop = target.offsetTop;
}

/**
 * Check if the indexed element is overflowing
 */
function isOverflowing(container: HTMLElement, target: HTMLElement): boolean {
  const scrollPosition = container.scrollTop;
  const elementOffsetTop = target.offsetTop;
  const listBoxBottomScroll = scrollPosition + container.clientHeight;
  const elementOffsetBottom = target.offsetTop + target.offsetHeight;
  return scrollPosition > elementOffsetTop || listBoxBottomScroll < elementOffsetBottom;
}
