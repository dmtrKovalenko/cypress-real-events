import { fireCdpCommand } from "../fireCdpCommand";
import {
  Position,
  ScrollBehaviorOptions,
  getCypressElementCoordinates,
} from "../getCypressElementCoordinates";
import { getModifier } from "../getModifier";

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
export async function realHover(
  subject: JQuery,
  options: RealHoverOptions = {},
) {
  const { x, y } = getCypressElementCoordinates(
    subject,
    options.position,
    options.scrollBehavior,
  );

  const log = Cypress.log({
    $el: subject,
    name: "realHover",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  const modifier = getModifier(options); 

  await fireCdpCommand("Input.dispatchMouseEvent", {
    x,
    y,
    type: "mouseMoved",
    button: "none",
    pointerType: options.pointer ?? "mouse",
    modifiers: modifier,
  });

  log.snapshot().end();

  return subject;
}
