import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";

export interface realMouseUpOptions {
  /** Pointer type for realMouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * X and Y location of the realMouseUp event relative to the position.
   * Changes the default value of position to "topLeft" if either are set.
   * @example cy.realMouseUp({ x: 100, y: 100 })
   */
  x?: number;
  y?: number;
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

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseUp(
  subject: JQuery,
  options: realMouseUpOptions = {}
) {
  // Default position to "topLeft" if x or y are set.
  const position = options.x != null || options.y != null
    ? options.position ?? 'topLeft'
    : options.position;

  let { x, y } = getCypressElementCoordinates(subject, position, options.scrollBehavior);
  x += options.x ?? 0;
  y += options.y ?? 0;

  const log = Cypress.log({
    $el: subject,
    name: "realMouseUp",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    clickCount: 1,
    buttons: mouseButtonNumbers[options.button ?? "left"],
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
  });

  log.snapshot("after").end();

  return subject;
}
