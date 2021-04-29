import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";

export interface MouseUpOptions {
  /** Pointer type for mouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the mouseUp event relative to the element
   * @example cy.mouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.mouseUp({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function mouseUp(
  subject: JQuery,
  options: MouseUpOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "mouseUp",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    clickCount: 1,
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: "left",
  });

  log.snapshot("after").end();

  return subject;
}
