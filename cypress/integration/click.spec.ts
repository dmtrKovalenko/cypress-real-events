describe("cy.realClick", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("clicks on the button", () => {
    cy.get(".action-btn").realClick();
    cy.contains("This popover shows up on click");
  });

  it("clicks on the text field", () => {
    cy.get("#email1").realClick().should("be.focused");
  });

  it("clicks on the canvas", () => {
    cy.get("#action-canvas").realClick();
  });

  it("opens system native event on right click", () => {
    cy.get(".action-btn").realClick({ button: "right" });
  });
});
