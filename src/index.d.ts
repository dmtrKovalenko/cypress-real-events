type NormalizeCypressCommand<TFun> = TFun extends (
  subject: any,
  ...args: infer TArgs
) => infer TReturn
  ? (...args: TArgs) => TReturn
  : never;

declare namespace Cypress {
  interface Chainable {
    realClick: NormalizeCypressCommand<
      typeof import("./commands/realClick").realClick
    >;
  }
}
