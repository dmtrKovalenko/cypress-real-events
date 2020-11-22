import { getCypressElementCoordinates } from "../getCypressElementCoordinates";

export interface RealClickOptions {
  pointer?: "mouse" | "pen";
  button?: "none" | "left" | "right" | "middle" | "back" | "forward";
}

export async function realClick(
  subject: JQuery,
  options: RealClickOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject);

  const log = Cypress.log({
    $el: subject,
    name: "realClick",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coords": { x, y },
    }),
  });

  log.snapshot("before");
  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchMouseEvent",
    params: {
      type: "mousePressed",
      x,
      y,
      clickCount: 1,
      buttons: 1,
      pointerType: options.pointer ?? "mouse",
      button: options.button ?? "left",
    },
  });

  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchMouseEvent",
    params: {
      type: "mouseReleased",
      x,
      y,
      clickCount: 1,
      buttons: 1,
      pointerType: options.pointer ?? "mouse",
      button: options.button ?? "left",
    },
  });

  log.snapshot("after").end();

  return subject;
}
