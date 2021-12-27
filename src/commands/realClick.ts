import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { rawMouseDown } from './realMouseDown'
import { rawMouseUp } from './realMouseUp'
import { rawMouseMove } from './realHover'
import { mouseButtonNumbers } from "../mouseButtonNumbers";

export interface RealClickOptions {
  /** Pointer type for realClick, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /** The button on mouse that clicked. Simulates real browser behavior. */
  button?: keyof typeof mouseButtonNumbers;
  /**
   * Position of the click event relative to the element
   * @example cy.realClick({ position: "topLeft" })
   */
  position?: Position;
  /** X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realClick({ x: 100, y: 115 })
   * cy.get("body").realClick({ x: 11, y: 12 }) // global click by coordinates
   */
  x?: number;
  /**  X coordinate to click, relative to the Element. Overrides `position`.
   * @example
   * cy.get("canvas").realClick({ x: 100, y: 115 })
   * cy.get("body").realClick({ x: 11, y: 12 }) // global click by coordinates
   */
  y?: number;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realClick({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * Controls how many times pointer gets clicked. It can be used to simulate double clicks.
   * @example cy.realClick({ clickCount: 2 });
   */
  clickCount?: number;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realClick(
  subject: JQuery,
  options: RealClickOptions = {}
) {
  // prettier-ignore
  const position = options.x && options.y
    ? { x: options.x, y: options.y }
    : options.position;

  const { x, y } = getCypressElementCoordinates(
    subject,
    position,
    options.scrollBehavior
  );

  const log = Cypress.log({
    $el: subject,
    name: "realClick",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");

  await rawMouseMove({
    ...options,
    x,
    y
  })

  const { clickCount = 1 } = options

  for (let currentClick = 1; currentClick <= clickCount; currentClick++) {
    await rawMouseDown({
      ...options,
      x,
      y,
      clickCount: currentClick
    })

    await rawMouseUp({
      ...options,
      x,
      y,
      clickCount: currentClick
    })
  }

  log.snapshot("after").end();

  return subject;
}
