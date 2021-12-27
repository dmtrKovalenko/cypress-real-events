import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";
import { InternalState } from "../_internalState";

export interface realMouseDownOptions {
  /** Pointer type for realMouseDown, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseDown event relative to the element
   * @example cy.realMouseDown({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseDown({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;

  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
}

export async function rawMouseDown({
  x,
  y,
  button = "left",
  pointer = "mouse",
  clickCount = 1,
}: {
  x: number,
  y: number,
  button?: keyof typeof mouseButtonNumbers,
  pointer?: "mouse" | "pen",
  clickCount?: number
}) {
  InternalState.mouseButtonUp(button)

  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousePressed",
    clickCount,
    buttons: InternalState.getButtonsMask(),
    pointerType: pointer,
    button,
    x,
    y,
  });
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseDown(
  subject: JQuery,
  options: realMouseDownOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseDown",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");

  await rawMouseDown({
    ...options,
    x,
    y
  })

  log.snapshot("after").end();

  return subject;
}
