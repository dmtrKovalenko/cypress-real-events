import { keyCodeDefinitions } from "../keyCodeDefinitions";
import { realPress } from "./realPress";

export interface RealTypeOptions {
  /**
   * Delay after each keypress (ms)
   * @default 30
   */
  delay?: number;
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

/**
 * Runs a sequence of native press event (via cy.press)
 * Type event is global. Make sure that it is not attached to any field.
 * @example
 * cy.get("input").realClick()
 * cy.realType("some text {enter}")
 * @param text text to type. Should be around the same as cypress's type command argument (https://docs.cypress.io/api/commands/type.html#Arguments)
 */
export async function realType(text: string, options: RealTypeOptions = {}) {
  let log;

  if (options.log ?? true) {
    log = Cypress.log({
      name: "realType",
      consoleProps: () => ({
        Text: text,
      }),
    });
  }

  log?.snapshot("before").end();
  const chars = text
    .split(/({.+?})/)
    .filter(Boolean)
    .reduce((acc, group) => {
      return /({.+?})/.test(group)
        ? [...acc, group]
        : [...acc, ...group.split("")];
    }, [] as string[]);

  console.log(chars);

  for (const char of chars) {
    await realPress(char as keyof typeof keyCodeDefinitions, {
      pressDelay: options.pressDelay,
      log: false,
    });

    await new Promise((res) => setTimeout(res, options.pressDelay ?? 25));
  }

  log?.snapshot("after").end();
}
