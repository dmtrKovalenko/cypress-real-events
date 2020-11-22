<p align="center">
  <img src="./logo.png"/>
</p>
<h1 align="center"> Cypress Real Events </h1>
<h3 align="center"> Fire native system events from Cypress </h3>

## Why?

Cypress default events are simulated. That means that all events like `cy.click` or `cy.type` are fired from javascript. That's why this events will be untrusted (`event.isTrusted` will be `false`) and they can behave a little different from real native event.

This package provides a support for native events through [Chrome Devtools Protocol](https://chromedevtools.github.io/devtools-protocol/). And unlocks such features like **hovering** and **native focus management via Tab**.

## Requirements

Cypress only. Really. Cypress itself can fire native events. The only limitation for real events – **they work only in the chromium based browser**. That means that FireFox is not supported, at least for now.

## Quick overview

Here is a simple test that can be written with native events:

```js
it("tests real events", () => {
  cy.get("input").realClick(); // perform a native real click on the field
  cy.realType("cypress real event"); // fires native system keypress events and fills the field
  cy.press("Tab"); // native tab click switches the focus
  cy.focused().realHover(); // hovers over the new focused element
  cy.contains("some text in the hovered popover");
});
```

## Installation

Install npm package:

```
npm install cypress-real-events

yarn add cypress-real-events
```

Register new commands by adding this to your `cypress/support.js` file.

```js
import "cypress-real-events/support";
```

## Api

Here is an overview of the available **real** event commands:

## cy.realClick

Fires native system click event.

```jsx
cy.get("button").realClick();
cy.get("button").realClick(options);
```

Options:

- `Optional` **button**: \"none\" \| \"left\" \| \"right\" \| \"middle\" \| \"back\" \| \"forward\"
- `Optional` **pointer**: \"mouse\" \| \"pen\"

## cy.realHover

Fires real native hover event. Yes, it can test `:hover` preprocessor.

```jsx
cy.get("button").hover();
cy.get("button").hover(options);
```

Options:

- `Optional` **pointer**: \"mouse\" \| \"pen\"

## cy.realPress

Fires native press event. Make sure that press event is global. It means that it is not attached to any field or control.
In order to fill the input it is possible to do

```jsx
cy.realPress("Tab"); // switch the focus for a11y testing
```

### Usage

```js
cy.realPress(key);
cy.realPress(key, options);
```

### Parameters:

| Name      | Type                                           | Default value | Description                                                                                                                          |
| --------- | ---------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `key`     | string                                         | -             | key to type. Should be around the same as cypress's type command argument (https://docs.cypress.io/api/commands/type.html#Arguments) |
| `options` | - `Optional` **pointer**: \"mouse\" \| \"pen\" | {}            |                                                                                                                                      |

## cy.realType

Fires native press event. Make sure that press event is global. It means that it is not attached to any field or control.
In order to fill the input it is possible to do

```jsx
cy.realPress("Tab"); // switch the focus for a11y testing
```

### Usage

```js
cy.realPress(key);
cy.realPress(key, options);
```

### Parameters:

| Name      | Type                                                                        | Default value | Description                                                                                                                           |
| --------- | --------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `text`    | string                                                                      | -             | text to type. Should be around the same as cypress's type command argument (https://docs.cypress.io/api/commands/type.html#Arguments) |
| `options` | [RealTypeOptions](../interfaces/_src_commands_realtype_.realtypeoptions.md) | {}            | -                                                                                                                                     |

### cy.realType

Runs a sequence of native press event (via `cy.realPress`)
Make sure that type event is global. This means that it is not attached to any field.

```js
cy.realType("type any text"); // type any text on the page

cy.get("input").focus();
cy.realType("some text {enter}"); // type into focused field
```

#### Usage:

```js
cy.realType(text);
cy.realType(text, options);
```

#### Parameters:

| Name      | Type    | Default value | Description                                                                                                                           |
| --------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `text`    | string  | -             | text to type. Should be around the same as cypress's type command argument (https://docs.cypress.io/api/commands/type.html#Arguments) |
| `options` | Options | {}            |                                                                                                                                       |

Options:

- `Optional` **delay**: undefined \| number **`default`** 30
- `Optional` **log**: undefined \| false \| true
  **`default`** true
- `Optional` **pressDelay**: undefined \| number **`default`** 10

## UX

One problem of the real native system events I need to mention – you will not get an error message if event wasn't produced. Similar to selenium or playwright – if a javascript event was not fired you will not get a comprehensive error message.

So probably this package should not be used as a replacement of the cypress events, at least for the writing tests experience 🐨
