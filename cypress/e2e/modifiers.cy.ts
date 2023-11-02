describe("Events behavior with single modifier applied", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/modifiers-test.html");
  });

  const modifierKeys = ["shiftKey", "altKey", "ctrlKey", "metaKey"];

  function createModifierObject(modifierKey: string) {
    const options = {};
    options[modifierKey] = true;
    return options;
  }

  modifierKeys.forEach((modifierKey) => {
    // NOTE: for some reason after upgrading CI to use Chrome 116 and Cypress 13 this particular test fails
    // and only on CI. Figure out if this is a real issue or some version conflict | cypress bug.
    //
    // @see https://app.circleci.com/pipelines/github/dmtrKovalenko/cypress-real-events/842/workflows/1f98e690-ec69-4dcf-9e0e-3f8eb67dc709/jobs/2332/parallel-runs/0?filterBy=ALL
    it.skip(`detects ${modifierKey} modifier on click`, () => {
      cy.get("#action-button").realClick(createModifierObject(modifierKey));
      cy.contains(`${modifierKey} was pressed`);
    });

    it(`detects ${modifierKey} modifier on hover`, () => {
      cy.get("#mouse-move-div").realHover(createModifierObject(modifierKey));
      cy.contains(`${modifierKey} was pressed`);
    });

    it(`detects ${modifierKey} modifier on mousedown`, () => {
      cy.get("#mouse-down-div").realMouseDown(
        createModifierObject(modifierKey),
      );
      cy.contains(`${modifierKey} was pressed`);
    });
   it(`detects ${modifierKey} modifier on mpuseup`, () => {
     cy.get("#mouse-up-div").realMouseUp(createModifierObject(modifierKey));
     cy.contains(`${modifierKey} was pressed`);
   });
    it(`detects ${modifierKey} modifier on mousemove`, () => {
      cy.get("#mouse-move-div").realMouseMove(
        100,
        50,
        createModifierObject(modifierKey),
      );
      cy.contains(`${modifierKey} was pressed`);
    });
  });
});
