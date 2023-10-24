describe("Events behavior with modifiers applied", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/modifiers-test.html");
  });

  const modifierKeys = ["shiftKey", "altKey", "ctrlKey"];

  function createModifierObject(modifierKeys: any) {
    const options = {}; 
    for (let key of modifierKeys) {
      options[key] = true; 
    }   
    return options;
  }

  // NOTE: for some reason after upgrading CI to use Chrome 116 and Cypress 13 this particular test fails
  // and only on CI. Figure out if this is a real issue or some version conflict | cypress bug.
  //
  // @see https://app.circleci.com/pipelines/github/dmtrKovalenko/cypress-real-events/842/workflows/1f98e690-ec69-4dcf-9e0e-3f8eb67dc709/jobs/2332/parallel-runs/0?filterBy=ALL
  it.skip(`detects ${modifierKeys} modifiers on click`, () => {
    cy.get("#action-button").realClick(createModifierObject(modifierKeys));
    for (let key of modifierKeys) {
      cy.contains(`${key} was pressed`); 
    }
  });

  it(`detects ${modifierKeys} modifiers on hover`, () => {
    cy.get("#mouse-move-div").realHover(createModifierObject(modifierKeys));
    for (let key of modifierKeys) {
      cy.contains(`${key} was pressed`); 
    }
  });

  it(`detects ${modifierKeys} modifiers on mousedown`, () => {
    cy.get("#mouse-down-div").realMouseDown(createModifierObject(modifierKeys));
    for (let key of modifierKeys) {
      cy.contains(`${key} was pressed`); 
    }
  });

  it(`detects ${modifierKeys} modifiers on mpuseup`, () => {
    cy.get("#mouse-up-div").realMouseUp(createModifierObject(modifierKeys));
    for (let key of modifierKeys) {
      cy.contains(`${key} was pressed`); 
    }
  });

  it(`detects ${modifierKeys} modifiers on mousemove`, () => {
    cy.get("#mouse-move-div").realMouseMove(100, 50, createModifierObject(modifierKeys));
    for (let key of modifierKeys) {
      cy.contains(`${key} was pressed`); 
    }
  });
});
