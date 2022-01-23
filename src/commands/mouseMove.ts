import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";

export interface realMouseMoveOptions {
  /**
   * Pixels to move the element on the X axis.
   * @example cy.realMouseMove({ x: 55 });
   */
  x?: number;
  /**
  * Pixels to move the element on the Y axis.
  * @example cy.realMouseMove({ y: -44 });
  */
  y?: number;
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseMove(
  subject: JQuery,
  options: realMouseMoveOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseMove",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousemoved",
    x: x + (options.x ?? 0),
    y: y + (options.y ?? 0),
    buttons: mouseButtonNumbers[options.button ?? "left"],
    button: options.button ?? "left",
  });

  log.snapshot("after").end();

  return subject;
}
