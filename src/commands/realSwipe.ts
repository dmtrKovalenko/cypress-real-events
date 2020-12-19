import { fireCdpCommand } from '../fireCdpCommand';
import { Direction, getCypressElementCoordinates, Position } from '../getCypressElementCoordinates';

export interface RealSwipeOptions {
  /**
   * Position of the click event relative to the element
   * @example cy.realSwipe({ position: "topLeft" })
   */
  position?: Position;
  /** X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realSwipe({ x: 100, y: 115 })
   * cy.get("body").realSwipe({ x: 11, y: 12 }) // global touch by coordinates
   */
  x?: number;
  /**  X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realSwipe({ x: 100, y: 115 })
   * cy.get("body").realSwipe({ x: 11, y: 12 }) // global touch by coordinates
   */
  y?: number;

  direction?: Direction;
  length?: number;
}

export async function realSwipe(
  subject: JQuery,
  options: RealSwipeOptions = {}
) {
  const position = options.x && options.y
    ? { x: options.x, y: options.y }
    : options.position;

  const length = options.length ?? 0;

  const startPosition = getCypressElementCoordinates(subject, position);

  const endPositionMap: Record<Direction, {x: number, y: number}> = {
    top: {
      x: startPosition.x,
      y: options.direction === 'top' ? startPosition.y - length : startPosition.y,
    },
    bottom: {
      x: startPosition.x,
      y: options.direction === 'bottom' ? startPosition.y + length : startPosition.y,
    },
    left: {
      x: options.direction === 'left' ? startPosition.x - length : startPosition.y,
      y: startPosition.y,
    },
    right: {
      x: options.direction === 'right' ? startPosition.x + length : startPosition.y,
      y: startPosition.y,
    },
  }

  const endPosition = options.direction ? endPositionMap[options.direction] : startPosition;

  const log = Cypress.log({
    $el: subject,
    name: "realSwipe",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": [startPosition],
    })
  })

  log.snapshot("before");

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [startPosition],
  });

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [endPosition]
  })

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [endPosition],
  })

  log.snapshot("after").end();

  return subject;
} 