type NormalizeCypressCommand<TFun> = TFun extends (
  subject: any,
  ...args: infer TArgs
) => Promise<infer TReturn>
  ? (...args: TArgs) => Cypress.Chainable<TReturn>
  : TFun;

declare namespace Cypress {
  interface Chainable {
    realClick: NormalizeCypressCommand<
      typeof import("./commands/realClick").realClick
    >;
    realHover: NormalizeCypressCommand<
      typeof import("./commands/realHover").realHover
    >;
    realPress: typeof import("./commands/realPress").realPress;
    realType: typeof import("./commands/realType").realType;
  }
}
