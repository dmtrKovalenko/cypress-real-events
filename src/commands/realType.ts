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

export async function realType(text: string, options: RealTypeOptions = {}) {
  let log;

  if (options.log ?? true) {
    log = Cypress.log({
      name: "realPress",
      consoleProps: () => ({
        Text: text,
      }),
    });
  }

  log?.snapshot("before").end();

  for (const char of text) {
    await realPress(char as keyof typeof keyCodeDefinitions, {
      pressDelay: options.pressDelay,
      log: false,
    });

    await new Promise((res) => setTimeout(res, options.pressDelay ?? 25));
  }

  log?.snapshot("after").end();
}
