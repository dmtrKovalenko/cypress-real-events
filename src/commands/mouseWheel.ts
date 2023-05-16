import { fireCdpCommand } from "../fireCdpCommand";
import {
  ScrollBehaviorOptions,
  getCypressElementCoordinates,
} from "../getCypressElementCoordinates";

export interface RealMouseWheelOptions {
  /**
   * Position relative to the element where to hover the element. Only supporting "center".
   * @example cy.realMouseWheel({ position: "center" })
   */
  position?: "center";

  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseWheel({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;

  /**
   * deltaX X delta in CSS pixels for mouse wheel event (default: 0)
   * @example cy.realMouseWheel({ deltaX: 150 });
   */
  deltaX?: number;

  /**
   * deltaY Y delta in CSS pixels for mouse wheel event (default: 0)
   * @example cy.realMouseWheel({ deltaY: 150 });
   */
  deltaY?: number;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseWheel(subject: JQuery, options: RealMouseWheelOptions = {}) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);
  const { deltaX = 0, deltaY = 0 } = options || {};

  if (deltaX === 0 && deltaY === 0) {
    throw new Error("At least one is required. deltaX or deltaY.");
  }

  const log = Cypress.log({
    $el: subject,
    name: "realMouseWheel",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");

  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x,
    y,
    deltaX,
    deltaY,
    modifier: 0,
    pointerType: "mouse",
  });

  log.snapshot().end();

  return subject;
}