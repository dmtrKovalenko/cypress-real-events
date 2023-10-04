import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
  ScrollBehaviorOptions,
} from "../getCypressElementCoordinates";
import { getModifier } from "../getModifier";

export interface RealMouseMoveOptions {
  /**
   * Initial position for movement
   * @default "topLeft"
   * @example cy.realMouseMove({ position: "topRight" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseMove({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * Indicates whether the modifier (shiftKey | altKey | ctrlKey | metaKey) was pressed or not when an event occurred
   * @example cy.realMouseDown({ shiftKey: true });
   */
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean; 
  metaKey?: boolean;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseMove(
  subject: JQuery,
  x: number,
  y: number,
  options: RealMouseMoveOptions = {},
) {
  const basePosition = getCypressElementCoordinates(
    subject,
    options.position ?? "topLeft",
    options.scrollBehavior,
  );

  const log = Cypress.log({
    $el: subject,
    name: "realMouseMove",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Element Coordinates": basePosition,
    }),
  });

  const modifier = getModifier(options); 

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: x * basePosition.frameScale + basePosition.x,
    y: y * basePosition.frameScale + basePosition.y,
    modifiers: modifier,
  });

  log.snapshot("after").end();

  return subject;
}
