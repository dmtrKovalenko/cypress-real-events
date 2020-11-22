import { getCypressElementCoordinates } from "../getCypressElementCoordinates";

export interface RealHoverOptions {
  pointer?: "mouse" | "pen";
}

/**
 * Fires real native hover event. Yes, it can test `:hover` preprocessor.
 * @example
 * cy.get("button").realHover()
 * @param options
 */
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

  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchMouseEvent",
    params: {
      type: "mouseMoved",
      x,
      y,
      button: "none",
      pointerType: options.pointer ?? "mouse",
    },
  });

  log.snapshot().end();

  return subject;
}
