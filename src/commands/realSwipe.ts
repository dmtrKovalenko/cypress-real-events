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
  /**
   * Swipe step (how often new touch move will be generated).
   * Must be less than or equal options.length
   * @default 10
   * cy.get(".drawer").realSwipe("toLeft", { step: 5 })
   */
  step?: number;
}

async function forEachSwipePosition(
  {
    length,
    step,
    startPosition,
    direction,
  }: {
    length: number;
    step: number;
    direction: SwipeDirection;
    startPosition: { x: number; y: number };
  },
  onStep: (pos: { x: number; y: number }) => Promise<void>,
) {
  if (length < step) {
    throw new Error(
      "cy.realSwipe: options.length can not be smaller than options.step",
    );
  }

  const getPositionByDirection: Record<
    SwipeDirection,
    (step: number) => { x: number; y: number }
  > = {
    toTop: (step) => ({
      x: startPosition.x,
      y: startPosition.y - step,
    }),
    toBottom: (step) => ({
      x: startPosition.x,
      y: startPosition.y + step,
    }),
    toLeft: (step) => ({
      x: startPosition.x - step,
      y: startPosition.y,
    }),
    toRight: (step) => ({
      x: startPosition.x + step,
      y: startPosition.y,
    }),
  };

  for (let i = 0; i <= length; i += step) {
    await onStep(getPositionByDirection[direction](i));
  }
}

export async function realSwipe(
  subject: JQuery,
  direction: SwipeDirection,
  options: RealSwipeOptions = {},
) {
  const position =
    options.x && options.y
      ? { x: options.x, y: options.y }
      : options.touchPosition;

  const length = options.length ?? 10;
  const step = options.step ?? 10;
  const elementCoordinates = getCypressElementCoordinates(subject, position);
  const startPosition = { x: elementCoordinates.x, y: elementCoordinates.y };
  const log = Cypress.log({
    $el: subject,
    name: "realSwipe",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Swipe Length": length,
      "Swipe Step": step,
    }),
  });

  log.snapshot("before");

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [startPosition],
  });

  await forEachSwipePosition(
    {
      length,
      step,
      direction,
      startPosition,
    },
    (position) =>
      fireCdpCommand("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [position],
      }),
  );

  await fireCdpCommand("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });

  log.snapshot("after").end();

  return subject;
}
