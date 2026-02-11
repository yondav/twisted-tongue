import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const MODIFIER_KEYS = {
  Meta: 'metaKey',
  Ctrl: 'ctrlKey',
  Control: 'ctrlKey',
  Alt: 'altKey',
  Shift: 'shiftKey',
} as const;

type ModifierKey = keyof typeof MODIFIER_KEYS;

function isModifierKey(key: string): key is ModifierKey {
  return key in MODIFIER_KEYS;
}

export function useKeyBinding(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  node: Node | null = null
) {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: Event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }

      const e = event;
      // Separate modifier keys from regular keys
      const modifierKeys = keys.filter(isModifierKey);
      const regularKeys = keys.filter(key => !isModifierKey(key));

      // Check if all required modifier keys are pressed
      const modifiersPressed = modifierKeys.every(modifier => {
        const modifierProperty = MODIFIER_KEYS[modifier];
        return e[modifierProperty];
      });

      // Check if one of the regular keys matches (or if no regular keys specified, just check modifiers)
      const keyMatches =
        regularKeys.length === 0 || regularKeys.some(key => e.key === key);

      // Execute callback if all conditions are met
      if (
        modifiersPressed &&
        keyMatches &&
        (modifierKeys.length > 0 || regularKeys.length > 0)
      ) {
        callbackRef.current(e);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    if (targetNode) targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
}
