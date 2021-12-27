import { fireCdpCommand } from "../fireCdpCommand";
import { getKeyCodeDefinitions, KeyDefinition, KeyOrShortcut } from "../getKeyCodeDefinitions";

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

const keyToModifierBitMap: Record<string, number> = {
  Alt: 1,
  Control: 2,
  Meta: 4,
  Shift: 8,
};

export async function rawRealPress(keyDefinitions: KeyDefinition[], options: RealPressOptions = {}) {
  let modifiers = 0;

  for (const key of keyDefinitions) {
    modifiers |= keyToModifierBitMap[key.key] ?? 0;

    await fireCdpCommand("Input.dispatchKeyEvent", {
      type: key.text ? "keyDown" : "rawKeyDown",
      modifiers,
      ...key,
    });

    await new Promise((res) => setTimeout(res, options.pressDelay ?? 25));
  }

  await Promise.all(
    keyDefinitions.map((key) => {
      return fireCdpCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        modifiers,
        ...key,
      });
    })
  );
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realPress(
  keyOrShortcut: KeyOrShortcut,
  options: RealPressOptions = {}
) {
  let log;

  const keyDefinitions = getKeyCodeDefinitions(keyOrShortcut)

  if (options.log ?? true) {
    log = Cypress.log({
      name: "realPress",
      consoleProps: () => ({
        "System Key Definition": keyDefinitions,
      }),
    });
  }

  log?.snapshot("before").end();

  await rawRealPress(keyDefinitions, options)

  log?.snapshot("after").end();
}
