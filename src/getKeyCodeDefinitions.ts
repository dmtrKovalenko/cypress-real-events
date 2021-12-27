import { keyCodeDefinitions } from "./keyCodeDefinitions";

export type Key = keyof typeof keyCodeDefinitions;
// unfortunately passing a string like Shift+P is not possible cause typescript template literals can not handle such giant union
export type KeyOrShortcut = Key | Array<Key>;
export type KeyDefinition = {
  keyCode: number;
  key: string;
  text: string | undefined;
  code: string;
  location: number;
  windowsVirtualKeyCode: number;
}

function getKeyCodeDefinition(key: Key): KeyDefinition {
  const keyDefinition = keyCodeDefinitions[key];

  if (!keyDefinition) {
    throw new Error(`Unsupported key '${key}'.`);
  }

  const keyCode = keyDefinition.keyCode ?? 0;
  return {
    keyCode: keyCode,
    key: keyDefinition?.key ?? "",
    text:
      "text" in keyDefinition
        ? keyDefinition.text
        : keyDefinition.key.length === 1
        ? keyDefinition.key
        : undefined,
    code: "code" in keyDefinition ? keyDefinition.code : "",
    location: "location" in keyDefinition ? keyDefinition.location : 0,
    windowsVirtualKeyCode: keyCode,
  };
}

export function getKeyCodeDefinitions(keyOrShortcut: KeyOrShortcut) {
  const keys = Array.isArray(keyOrShortcut) ? keyOrShortcut : [keyOrShortcut];
  return keys.map(getKeyCodeDefinition);
}
