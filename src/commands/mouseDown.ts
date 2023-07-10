import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";
import { keyToModifierBitMap } from "../keyToModifierBitMap";

export interface realMouseDownOptions {
  /** Pointer type for realMouseDown, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseDown event relative to the element
   * @example cy.realMouseDown({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseDown({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;

  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
  /**
   * Indicates whether the shift key was pressed or not when an event occurred
   * @example cy.realMouseDown({ shiftKey: true });
   */
  shiftKey?: boolean;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseDown(
  subject: JQuery,
  options: realMouseDownOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseDown",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    clickCount: 1,
    buttons: mouseButtonNumbers[options.button ?? "left"],
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
    modifiers: options.shiftKey ? keyToModifierBitMap.Shift : 0,
  });

  log.snapshot("after").end();

  return subject;
}
