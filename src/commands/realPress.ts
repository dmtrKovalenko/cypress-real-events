import { keyCodeDefinitions } from "../keyCodeDefinitions";

export interface RealPressOptions {
  /**
   * Delay between keyDown and keyUp events (ms)
   * @default 10
   */
  pressDelay?: number;
  /**
   * Displays the command in the Cypress command log
   * @default true
   */
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
    text: keyDefinition.key.length === 1 ? keyDefinition.key : undefined,
    // @ts-ignore
    code: keyDefinition.code ?? "",
    // @ts-ignore
    location: keyDefinition.location ?? 0,
  };
}

/**
 * Fires native press event. Make sure that press event is global. It means that it is not attached to any field or control.
 * In order to fill the input it is possible to do
 * @example
 * cy.get("input").focus()
 * cy.realPress("K")
 * @param key key to type. Should be around the same as cypress's type command argument (https://docs.cypress.io/api/commands/type.html#Arguments)
 * @param options
 */
export async function realPress(
  key: keyof typeof keyCodeDefinitions,
  options: RealPressOptions = {}
) {
  let log;
  const keyDefinition = getKeyDefinition(key);
  console.log(keyDefinition);

  if (options.log ?? true) {
    log = Cypress.log({
      name: "realPress",
      consoleProps: () => keyDefinition,
    });
  }

  log?.snapshot("before").end();

  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchKeyEvent",
    params: {
      type: keyDefinition.text ? "keyDown" : "rawKeyDown",
      ...keyDefinition,
      windowsVirtualKeyCode: keyDefinition.keyCode,
    },
  });

  await new Promise((res) => setTimeout(res, options.pressDelay ?? 25));
  await Cypress.automation("remote:debugger:protocol", {
    command: "Input.dispatchKeyEvent",
    params: {
      type: "keyUp",
      ...keyDefinition,
      windowsVirtualKeyCode: keyDefinition.keyCode,
    },
  });

  log?.snapshot("after").end();
}
