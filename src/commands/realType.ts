import { keyCodeDefinitions } from "../keyCodeDefinitions";
import { realPress } from "./realPress";

export interface RealTypeOptions {
  /**
   * Delay after each keypress (ms)
   * @default 25
   */
  delay?: number;
  /**
   * Delay between keyDown and keyUp events (ms)
   * @default 15
   */
  pressDelay?: number;
  /**
   * Displays the command in the Cypress command log
   * @default true
   */
  log?: boolean;
}

const availableChars = Object.keys(keyCodeDefinitions);
function assertChar(
  char: string,
): asserts char is keyof typeof keyCodeDefinitions {
  if (!availableChars.includes(char)) {
    throw new Error(`Unrecognized character "${char}".`);
  }
}

/** @ignore this, update documentation for this function at index.d.ts */
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

  for (const char of chars) {
    assertChar(char);
    await realPress(char, {
      pressDelay: options.pressDelay ?? 15,
      log: false,
    });

    await new Promise((res) => setTimeout(res, options.delay ?? 25));
  }

  log?.snapshot("after").end();
}
