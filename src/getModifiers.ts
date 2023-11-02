import { keyToModifierBitMap } from "./keyToModifierBitMap";

/**
 * Gets the modifier bit masks based on the given option flags.
 * This can be used to build the 'modifiers' property for CDP input dispatch events.
 * @param {Object} options - The options object
 * @param {boolean} [options.shiftKey] - Whether the Shift key is pressed
 * @param {boolean} [options.altKey] - Whether the Alt key is pressed
 * @param {boolean} [options.ctrlKey] - Whether the Control key is pressed
 * @param {boolean} [options.metaKey] - Whether the Meta key is pressed
 * @returns {number} The modifier bit mask flags
 */
export function getModifiers(options: {
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}): number {
  let modifiers = 0;

  if (options.shiftKey) {
    modifiers = modifiers | keyToModifierBitMap.Shift;
  }

  if (options.altKey) {
    modifiers = modifiers | keyToModifierBitMap.Alt;
  }

  if (options.ctrlKey) {
    modifiers = modifiers | keyToModifierBitMap.Control;
  }

  if (options.metaKey) {
    modifiers = modifiers | keyToModifierBitMap.Meta;
  }

  return modifiers;
}
