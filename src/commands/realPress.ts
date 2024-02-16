import { fireCdpCommand } from "../fireCdpCommand";
import { keyCodeDefinitions } from "../keyCodeDefinitions";
import { keyToModifierBitMap } from "../keyToModifierBitMap";
import { wait } from "../utils";

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

// Emoji Unicode range
const EMOJI_RE =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function isEmoji(char: string) {
  return EMOJI_RE.test(char);
}

function getKeyDefinition(key: string) {
  const keyDefinition =
    keyCodeDefinitions[key as keyof typeof keyCodeDefinitions];

  if (!keyDefinition) {
    if (key.length === 1 || isEmoji(key)) {
      return {
        keyCode: key.charCodeAt(0),
        key,
        text: key,
        code: `Key${key.toUpperCase()}`,
        location: 0,
        windowsVirtualKeyCode: key.charCodeAt(0),
      };
    }
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
export type KeyOrShortcut = Key | Array<Key>;

/** @ignore this, update documentation for this function at index.d.ts */
export async function realPress(
  keyOrShortcut: string | string[],
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

    await wait(options.pressDelay ?? 25);
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
