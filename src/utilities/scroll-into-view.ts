export function scrollIntoView(element: HTMLElement, container: HTMLElement) {
  requestAnimationFrame(() => {
    if (element && !isElementInViewport(element, container)) {
      const offset = element.offsetTop - container.scrollTop;
      container.scrollBy({top: offset});
    }
  });
}

export function isElementInViewport(element: Element, container: Element) {
  const {top} = element.getBoundingClientRect();
  const {
    top: containerTop,
    bottom: containerBottom,
  } = container.getBoundingClientRect();

  return top <= containerBottom || top >= containerTop;
}
