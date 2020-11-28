import { fireCdpCommand } from "../fireCdpCommand";
import { getCypressElementCoordinates } from "../getCypressElementCoordinates";

export interface RealHoverOptions {
  pointer?: "mouse" | "pen";
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realHover(
  subject: JQuery,
  options: RealHoverOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject);

  const log = Cypress.log({
    $el: subject,
    name: "realHover",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  await fireCdpCommand("Input.dispatchMouseEvent", {
    x,
    y,
    type: "mouseMoved",
    button: "none",
    pointerType: options.pointer ?? "mouse",
  });

  log.snapshot().end();

  return subject;
}
