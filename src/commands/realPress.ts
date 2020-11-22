import { getCypressElementCoordinates } from "../getCypressElementCoordinates";
import { keyCodeDefinitions } from "../keyCodeDefinitions";

export interface RealPressOptions {
  /** Delay between keyDown and keyUp events */
  pressDelay?: number;
  log?: boolean;
}

function getKeyDefinition(key: keyof typeof keyCodeDefinitions) {
  const keyDefinition = keyCodeDefinitions[key];

  if (!keyDefinition) {
    throw new Error(`Unsupported key '${key}'.`);
  }

  return {
    key: keyDefinition?.key ?? "",
    keyCode: keyDefinition.keyCode ?? 0,
    text: keyDefinition.key,
    // @ts-ignore
    code: keyDefinition.code ?? "",
    // @ts-ignore
    location: keyDefinition.location ?? 0,
  };
}

export async function realPress(
  key: keyof typeof keyCodeDefinitions,
  options: RealPressOptions = {}
) {
  const keyDefinition = getKeyDefinition(key);
  const log = Cypress.log({
    name: "realPress",
    consoleProps: () => keyDefinition,
  });

  log.snapshot("before");
  const res = await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchKeyEvent",
    params: {
      type: "keyDown",
      ...keyDefinition,
    },
  });

  await new Promise((res) => setTimeout(res, options.pressDelay ?? 500));
  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchKeyEvent",
    params: {
      type: "keyUp",
      ...keyDefinition,
      windowsVirtualKeyCode: keyDefinition.keyCode,
    },
  });

  log.snapshot("after").end();
}
