import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
} from "../getCypressElementCoordinates";

export type SwipeDirection = "toLeft" | "toTop" | "toRight" | "toBottom";

export interface RealSwipeOptions {
  /**
   * The point of the element where touch event will be executed
   * @example cy.realSwipe({ position: "topLeft" })
   */
  touchPosition?: Position;
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
  /** Length of swipe (in pixels)
   * @default 10
   * @example
   * cy.get(".drawer").realSwipe("toLeft", { length: 50 })
   */
  length?: number;
}

export async function realSwipe(
  subject: JQuery,
  direction: SwipeDirection,
  options: RealSwipeOptions = {}
) {
  const position =
    options.x && options.y
      ? { x: options.x, y: options.y }
      : options.touchPosition;

  const length = options.length ?? 10;
  const startPosition = getCypressElementCoordinates(subject, position);

  const endPositionMap: Record<SwipeDirection, { x: number; y: number }> = {
    toTop: {
      x: startPosition.x,
      y: startPosition.y - length,
    },
    toBottom: {
      x: startPosition.x,
      y: startPosition.y + length,
    },
    toLeft: {
      x: startPosition.x - length,
      y: startPosition.y,
    },
    toRight: {
      x: startPosition.x + length,
      y: startPosition.y,
    },
  };

  const endPosition = endPositionMap[direction];

  const log = Cypress.log({
    $el: subject,
    name: "realSwipe",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": [startPosition],
    }),
  });

  log.snapshot("before");

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [startPosition],
  });

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [endPosition],
  });

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [endPosition],
  });

  log.snapshot("after").end();

  return subject;
}
