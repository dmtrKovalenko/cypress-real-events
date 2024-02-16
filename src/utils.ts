/**
 * Returns a Promise that resolves after `ms` milliseconds.
 * @param ms wait time in milliseconds.
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
