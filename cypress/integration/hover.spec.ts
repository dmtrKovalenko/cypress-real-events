describe("cy.realHover", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("hovers and applies styles from :hover pseudo-class", () => {
    cy.get(".action-btn")
      .should("have.css", "background-color", "rgb(217, 83, 79)")
      .realHover()
      .should("have.css", "background-color", "rgb(201, 48, 44)");
  });
});
