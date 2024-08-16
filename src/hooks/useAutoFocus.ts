import { onMount } from 'solid-js';

export function useAutoFocus() {
  let ref: HTMLElement | undefined;

  onMount(() => {
    if (ref && 'focus' in ref) {
      (ref as HTMLElement & { focus: () => void }).focus();
    }
  });

  return (el: HTMLElement) => {
    ref = el;
  };
}