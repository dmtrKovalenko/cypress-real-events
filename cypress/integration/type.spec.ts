describe("cy.realType", () => {
  beforeEach(() => {
    cy.visit("https://google.com?hl=en");
  });

  it("types text into googles main search inptu", () => {
    cy.realType("cypress can produce real events");
    cy.get("input[name=q]").should(
      "have.value",
      "cypress can produce real events"
    );
  });

  it("does not type if element is not focused", () => {
    cy.realPress("Tab"); // move focus out
    cy.realType("pressing keys");
    cy.get("input[name=q]").should("have.value", "");
  });

  it("supports cypress's keys shortcuts", () => {
    cy.get("input[name=q]").focus()
    cy.realType("Something{backspace}{backspace}")
    cy.get("input[name=q]").should("have.value", "Somethi");
  })
});
