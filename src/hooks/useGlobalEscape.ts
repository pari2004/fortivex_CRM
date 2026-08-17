import { useEffect, useRef, useId } from 'react';

// Global stack to keep track of active escape handlers
const escStack: Array<{ id: string; handler: () => void }> = [];

/**
 * useGlobalEscape
 * 
 * A custom hook to manage global Escape key behavior. 
 * Only the topmost (most recently opened) component in the stack will respond to the Escape key.
 * 
 * @param isOpen boolean - whether the component is currently open
 * @param onClose function - the function to call when ESC is pressed
 */
export function useGlobalEscape(isOpen: boolean, onClose: () => void) {
  // Use a ref for the ID so it remains consistent across renders
  const id = useId();
  const idRef = useRef(id);
  // Use a ref for the handler to avoid effect re-runs if onClose changes identity
  const handlerRef = useRef(onClose);

  useEffect(() => {
    handlerRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const id = idRef.current;
      // Push this handler to the top of the stack
      escStack.push({ id, handler: () => handlerRef.current() });

      return () => {
        // When unmounted or closed, remove this specific handler from the stack
        const index = escStack.findIndex(item => item.id === id);
        if (index > -1) {
          escStack.splice(index, 1);
        }
      };
    }
  }, [isOpen]);
}

// Attach the global event listener exactly once
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // If there's an active handler in the stack
      if (escStack.length > 0) {
        // We only want to prevent default if we're actually handling it,
        // but the prompt says "Do NOT interfere with normal text input behavior... Do NOT clear the user's typed text"
        // Most browsers use ESC to clear <input type="search">. By preventing default, we stop that.
        // If they are in a regular text input, ESC doesn't usually do much, but we don't want to break native OS features.
        // However, if we pop the stack, it means we ARE closing a custom modal/dropdown, so we should stop propagation.
        e.preventDefault();
        e.stopPropagation();

        // Pop the top-most handler
        const topItem = escStack.pop();
        if (topItem && typeof topItem.handler === 'function') {
          topItem.handler();
        }
      }
    }
  }, { capture: true }); // Use capture to ensure we get it before React synthetic events if needed
}
