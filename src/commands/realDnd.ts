import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  Position,
} from "../getCypressElementCoordinates";

export interface RealDndOptions {
  /** Pointer type for realClick, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the click event relative to the element
   * @example cy.realClick({ position: "topLeft" })
   */
  position?: Position;
}

function isJQuery(obj: unknown): obj is JQuery {
  return Boolean(obj.jquery);
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realDnd(
  subject: JQuery,
  destination: JQuery | { x: number; y: number },
  options: RealDndOptions = {}
) {
  if (!destination) {
    throw new Error(
      "destination is required when using cy.realDnd(destination)"
    );
  }

  const startCoords = getCypressElementCoordinates(subject, options.position);
  const endCoords = isJQuery(destination)
    ? getCypressElementCoordinates(destination, options.position)
    : destination;

  const log = Cypress.log({
    $el: subject,
    name: "realClick",
    consoleProps: () => ({
      Dragged: subject.get(0),
      From: startCoords,
      End: endCoords,
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...startCoords,
    clickCount: 1,
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: "left",
  });

  console.log(endCoords)
  await fireCdpCommand("Input.dispatchMouseEvent", {
    ...endCoords,
    type: "mouseMoved",
    button: "left",
    pointerType: options.pointer ?? "mouse",
  });

  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...endCoords,
    clickCount: 1,
    buttons: 1,
    pointerType: options.pointer ?? "mouse",
    button: "left",
  });

  log.snapshot("after").end();

  return subject;
}
