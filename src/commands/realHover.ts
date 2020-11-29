import { fireCdpCommand } from "../fireCdpCommand";
import {
  Position,
  getCypressElementCoordinates,
} from "../getCypressElementCoordinates";

export interface RealHoverOptions {
  /**
   * If set to `pen`, simulates touch based hover (via long press)
   */
  pointer?: "mouse" | "pen";
  /** 
   * Position relative to the element where to hover the element.
   * @example cy.realHover({ position: "topLeft" })
   */
  position?: Position;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realHover(
  subject: JQuery,
  options: RealHoverOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position);

  const log = Cypress.log({
    $el: subject,
    name: "realHover",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  await fireCdpCommand("Input.dispatchMouseEvent", {
    x,
    y,
    type: "mouseMoved",
    button: "none",
    pointerType: options.pointer ?? "mouse",
  });

  log.snapshot().end();

  return subject;
}
