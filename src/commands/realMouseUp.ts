import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";
import { InternalState } from "../_internalState";

export interface realMouseUpOptions {
  /** Pointer type for realMouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseUp({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
}

export async function rawMouseUp({
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
    type: "mouseReleased",
    clickCount,
    buttons: InternalState.getButtonsMask(),
    pointerType: pointer,
    button,
    x,
    y
  });
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseUp(
  subject: JQuery,
  options: realMouseUpOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseUp",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");

  await rawMouseUp({
    ...options,
    x,
    y
  })

  log.snapshot("after").end();

  return subject;
}
