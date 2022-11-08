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
  /**  radius of the touch area.
   * @example
   * cy.get("canvas").realTouch({ x: 100, y: 115, radius: 10 })
   * cy.get("body").realTouch({ x: 11, y: 12, radius: 10 }) // global touch by coordinates
   */
  radius?: number;
  /**  specific radius of the X axis of the touch area
   * @example
   * cy.get("canvas").realTouch({ x: 100, y: 115, radiusX: 10, radiusY: 20 })
   * cy.get("body").realTouch({ x: 11, y: 12, radiusX: 10, radiusY: 20 }) // global touch by coordinates
   */
  radiusX?: number;
  /**  specific radius of the Y axis of the touch area
   * @example
   * cy.get("canvas").realTouch({ x: 100, y: 115, radiusX: 10, radiusY: 20 })
   * cy.get("body").realTouch({ x: 11, y: 12, radiusX: 10, radiusY: 20 }) // global touch by coordinates
   */
  radiusY?: number;
}

export async function realTouch(
  subject: JQuery,
  options: RealTouchOptions = {}
) {
  const position = typeof options.x === 'number' || typeof options.y === 'number'
    ? { x: options.x || 0, y: options.y || 0 }
    : options.position;

  const elementCoordinates = getCypressElementCoordinates(subject, position);
  const elementPoint = {x: elementCoordinates.x, y: elementCoordinates.y}
  const radiusX = (options.radiusX || options.radius || 1) * elementCoordinates.frameScale
  const radiusY = (options.radiusY || options.radius || 1) * elementCoordinates.frameScale



  const log = Cypress.log({
    $el: subject,
    name: "realTouch",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": [elementPoint],
      "Touched Area (Radius)": {
        x: radiusX,
        y: radiusY,
      }
    })
  })

  log.snapshot("before");

  const touchPoint = {
    ...elementPoint,
    radiusX,
    radiusY
  }

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchPoint],
  });

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [touchPoint],
  })

  log.snapshot("after").end();

  return subject;
}