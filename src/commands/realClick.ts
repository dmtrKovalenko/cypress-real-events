import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
} from "../getCypressElementCoordinates";

export interface RealClickOptions {
  /** Pointer type for realClick, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /** The button on mouse that clicked. Simulates real browser behavior. */
  button?: "none" | "left" | "right" | "middle" | "back" | "forward";
  /**
   * Position of the click event relative to the element
   * @example cy.realClick({ position: "topLeft" })
   */
  position?: Position;
  /** X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realClick({ x: 100, y: 115 })
   * cy.get("body").realClick({ x: 11, y: 12 }) // global click by coordinates
   */
  x?: number;
  /**  X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realClick({ x: 100, y: 115 })
   * cy.get("body").realClick({ x: 11, y: 12 }) // global click by coordinates
   */
  y?: number;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realClick(
  subject: JQuery,
  options: RealClickOptions = {}
) {
  // prettier-ignore
  const position = options.x && options.y 
    ? { x: options.x, y: options.y } 
    : options.position;

  const { x, y } = getCypressElementCoordinates(subject, position);
  console.log(`position x=${x} y=${y}`, options);

  const log = Cypress.log({
    $el: subject,
    name: "realClick",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates here": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    clickCount: 1,
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
  });

  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    clickCount: 1,
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
  });

  log.snapshot("after").end();

  return subject;
}
