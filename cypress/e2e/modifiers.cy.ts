describe("Events behavior with shiftKey modifier applied", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/modifiers-test.html");
  });

  // NOTE: for some reason after upgrading CI to use Chrome 116 and Cypress 13 this particular test fails
  // and only on CI. Figure out if this is a real issue or some version conflict | cypress bug.
  //
  // @see https://app.circleci.com/pipelines/github/dmtrKovalenko/cypress-real-events/842/workflows/1f98e690-ec69-4dcf-9e0e-3f8eb67dc709/jobs/2332/parallel-runs/0?filterBy=ALL
  it.skip("detects shift key modifier on click", () => {
    cy.get("#action-button").realClick({ shiftKey: true });
    cy.contains("Shift key was pressed");
  });

  it("detects shift key modifier on hover", () => {
    cy.get("#mouse-move-div").realHover({ shiftKey: true });
    cy.contains("Shift key was pressed");
  });

  it("detects shift key modifier on mousedown", () => {
    cy.get("#mouse-down-div").realMouseDown({ shiftKey: true });
    cy.contains("Shift key was pressed");
  });

  it("detects shift key modifier on mpuseup", () => {
    cy.get("#mouse-up-div").realMouseUp({ shiftKey: true });
    cy.contains("Shift key was pressed");
  });

  it("detects shift key modifier on mousemove", () => {
    cy.get("#mouse-move-div").realMouseMove(100, 50, { shiftKey: true });
    cy.contains("Shift key was pressed");
  });
});
