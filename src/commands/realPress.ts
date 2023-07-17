import { fireCdpCommand } from "../fireCdpCommand";
import { keyCodeDefinitions } from "../keyCodeDefinitions";
import { keyToModifierBitMap } from "../keyToModifierBitMap";

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

  const keyCode = keyDefinition.keyCode ?? 0;
  return {
    keyCode: keyCode,
    key: keyDefinition?.key ?? "",
    text: keyDefinition.key.length === 1 ? keyDefinition.key : undefined,
    // @ts-expect-error code exists anyway
    code: keyDefinition.code ?? "",
    // @ts-expect-error location exists anyway
    location: keyDefinition.location ?? 0,
    windowsVirtualKeyCode: keyCode,
  };
}

type Key = keyof typeof keyCodeDefinitions;
// unfortunately passing a string like Shift+P is not possible cause typescript template literals can not handle such giant union
type KeyOrShortcut = Key | Array<Key>;

/** @ignore this, update documentation for this function at index.d.ts */
export async function realPress(
  keyOrShortcut: KeyOrShortcut,
  options: RealPressOptions = {},
) {
  let log;

  let modifiers = 0;
  const keys = Array.isArray(keyOrShortcut) ? keyOrShortcut : [keyOrShortcut];
  const keyDefinitions = keys.map(getKeyDefinition);

  if (options.log ?? true) {
    log = Cypress.log({
      name: "realPress",
      consoleProps: () => ({
        "System Key Definition": keyDefinitions,
      }),
    });
  }

  log?.snapshot("before").end();

  for (const key of keyDefinitions) {
    modifiers |= keyToModifierBitMap[key.key] ?? 0;

    await fireCdpCommand("Input.dispatchKeyEvent", {
      type: key.text ? "keyDown" : "rawKeyDown",
      modifiers,
      ...key,
    });

    if (key.code === "Enter") {
      await fireCdpCommand("Input.dispatchKeyEvent", {
        type: "char",
        unmodifiedText: "\r",
        text: "\r",
      });
    }

    await new Promise((res) => setTimeout(res, options.pressDelay ?? 25));
  }

  await Promise.all(
    keyDefinitions.map((key) => {
      return fireCdpCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        modifiers,
        ...key,
      });
    }),
  );

  log?.snapshot("after").end();
}
