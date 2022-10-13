import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
  ScrollBehaviorOptions,
} from "../getCypressElementCoordinates";

export interface RealMouseMoveOptions {
  /**
   * Initial position for movement
   * @default "topLeft"
   * @example cy.realMouseMove({ position: "topRight" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realClick({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseMove(
  subject: JQuery,
  x: number ,
  y: number,
  options: RealMouseMoveOptions = {}
) {
  const basePosition= getCypressElementCoordinates(
    subject,
    options.position ?? "topLeft",
    options.scrollBehavior
  );

  const log = Cypress.log({
    $el: subject,
    name: "realMouseMove",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Element Coordinates": basePosition,
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: x + basePosition.x,
    y: y + basePosition.y,
  });

  log.snapshot("after").end();

  return subject;
}
