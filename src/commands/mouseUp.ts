import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";
import { getModifiers } from "../getModifiers";

export interface RealMouseUpOptions {
  /** Pointer type for realMouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseUp({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
  /**  X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realMouseUp({ x: 100, y: 115 })
   * cy.get("body").realMouseUp({ x: 11, y: 12 }) // global click by coordinates
   */
  x?: number;
  /**  Y coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realMouseUp({ x: 100, y: 115 })
   * cy.get("body").realMouseUp({ x: 11, y: 12 }) // global click by coordinates
   */
  y?: number;
  /**
   * Indicates whether any modifier (shiftKey | altKey | ctrlKey | metaKey) was pressed or not when an event occurred
   * @example cy.realMouseDown({ shiftKey: true });
   */
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseUp(
  subject: JQuery,
  options: RealMouseUpOptions = {},
) {
  const position =
    options.x && options.y ? { x: options.x, y: options.y } : options.position;

  const { x, y } = getCypressElementCoordinates(
    subject,
    position,
    options.scrollBehavior,
  );

  const log = Cypress.log({
    $el: subject,
    name: "realMouseUp",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  const modifiers = getModifiers(options);

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    clickCount: 1,
    buttons: mouseButtonNumbers[options.button ?? "left"],
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
    modifiers: modifiers,
  });

  log.snapshot("after").end();

  return subject;
}
