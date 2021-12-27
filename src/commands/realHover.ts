import { fireCdpCommand } from "../fireCdpCommand";
import {
  Position,
  ScrollBehaviorOptions,
  getCypressElementCoordinates,
} from "../getCypressElementCoordinates";
import { InternalState } from "../_internalState";

export interface RealHoverOptions {
  /**
   * If set to `pen`, simulates touch based hover (via long press)
   */
  pointer?: "mouse" | "pen";
  /**
   * Position relative to the element where to hover the element.
   * @example cy.realHover({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realHover({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

export async function rawMouseMove({
  x,
  y,
  pointer = "mouse",
}: {
  x: number,
  y: number,
  pointer?: "mouse" | "pen",
}) {
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    pointerType: pointer,
    button: "none",
    buttons: InternalState.getButtonsMask(),
    x,
    y,
  });
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realHover(
  subject: JQuery,
  options: RealHoverOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realHover",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  await rawMouseMove({
    ...options,
    x,
    y,
  })

  log.snapshot().end();

  return subject;
}
