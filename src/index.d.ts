type NormalizeCypressCommand<TFun> = TFun extends (
  subject: any,
  ...args: infer TArgs
) => Promise<infer TReturn>
  ? (...args: TArgs) => Cypress.Chainable<TReturn>
  : TFun;

declare namespace Cypress {
  interface Chainable {
    /**
     * Fires native system click event.
     * @example
     * cy.get("button").realClick()
     * @param options
     */
    realClick: NormalizeCypressCommand<
      typeof import("./commands/realClick").realClick
    >;
    /**
     * Fires real native hover event. Yes, it can test `:hover` preprocessor.
     * @example
     * cy.get("button").realHover()
     * @param options
     */
    realHover: NormalizeCypressCommand<
      typeof import("./commands/realHover").realHover
    >;
    /**
     * Fires native press event. Press event is global it means that it is not attached to any field or control.
     * In order to fill the do
     * @example
     * cy.get("input").focus()
     * cy.realPress("K")
     * @param key key to type. Should be around the same as cypress's type command argument – (https://docs.cypress.io/api/commands/type.html#Arguments)
     * @param options
     */
    realPress: typeof import("./commands/realPress").realPress;
    /**
     * Runs a sequence of native press event (via cy.press)
     * @param text text to type
     */
    realType: typeof import("./commands/realType").realType;
  }
}
