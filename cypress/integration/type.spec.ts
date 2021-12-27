describe("cy.realType", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/type-test.html");
    cy.get("input[name=q]").focus()
  });

  it("types text into an input", () => {
    cy.realType("cypress can produce real events");

    cy.get("input[name=q]").should(
      "have.value",
      "cypress can produce real events"
    );
  });

  it("does not type if element is not focused", () => {
    cy.realPress("Tab"); // move focus out
    cy.get("input[name=q]").should('not.be.focused');
    cy.realType("pressing keys");
    cy.get("input[name=q]").should("have.value", "");
  });

  it("supports cypress's keys shortcuts", () => {
    cy.realType("Something{backspace}{backspace}")
    cy.get("input[name=q]").should("have.value", "Somethi");
  })
});
