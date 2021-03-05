import { fireCdpCommand } from '../fireCdpCommand';
import { getCypressElementCoordinates, Position } from '../getCypressElementCoordinates';

export interface RealTouchOptions {
  /**
   * Position of the click event relative to the element
   * @example cy.realTouch({ position: "topLeft" })
   */
  position?: Position;
  /** X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realTouch({ x: 100, y: 115 })
   * cy.get("body").realTouch({ x: 11, y: 12 }) // global touch by coordinates
   */
  x?: number;
  /**  X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realTouch({ x: 100, y: 115 })
   * cy.get("body").realTouch({ x: 11, y: 12 }) // global touch by coordinates
   */
  y?: number;
}

export async function realTouch(
  subject: JQuery,
  options: RealTouchOptions = {}
) {
  const position = options.x && options.y
    ? { x: options.x, y: options.y }
    : options.position;

  const elementPoints = getCypressElementCoordinates(subject, position);

  const log = Cypress.log({
    $el: subject,
    name: "realTouch",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": [elementPoints],
    })
  })

  log.snapshot("before");

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [elementPoints],
  });

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [elementPoints],
  })

  log.snapshot("after").end();

  return subject;
}