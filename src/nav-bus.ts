/*
 * nav-bus.ts-decouples deep modules (deck, eggs) from React tree plumbing:
 * any module can request a route change without prop-drilling.
 */
type NavFn = (to: string) => void;
let fn: NavFn = () => {};

export function setNavigator(f: NavFn) {
  fn = f;
}
export function navigateTo(to: string) {
  fn(to.startsWith("/") ? to : to);
}

export function openDeckFromOutside() {
  document.dispatchEvent(new CustomEvent("pp-open-deck"));
}
