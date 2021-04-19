import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";

export interface RealActiveOptions {
  /** Pointer type for realClick, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the click event relative to the element
   * @example cy.realClick({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realHover({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realActive(
  subject: JQuery,
  options: RealActiveOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realActive",
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
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: "left",
  });

  log.snapshot("after").end();

  return subject;
}
