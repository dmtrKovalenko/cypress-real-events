describe("Events behavior with shiftKey modifier applied", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/modifiers-test.html");
  });

  it("detects shift key modifier on click", () => {
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

  it("detects shift key modifier on mousemove", () => {
    cy.get("#mouse-move-div").realMouseMove(100, 50, { shiftKey: true });
    cy.contains("Shift key was pressed");
  });
});
