describe("cy.realType", () => {
  beforeEach(() => {
    cy.visit("https://google.com?hl=en");
  });

  it("hovers and applies styles from :hover pseudo-class", () => {
    cy.realType("cypress can produce real events");
    cy.get("input[name=q]").should(
      "have.value",
      "cypress can produce real events"
    );
  });

  it("do not types if element is not focused", () => {
    cy.realPress("Tab"); // move focus out
    cy.realType("pressing keys");
    cy.get("input[name=q]").should("have.value", "");
  });

  it("supports cypress's keys shortcuts", () => {
    cy.realType("Something{backspace}{backspace}")
    cy.get("input[name=q]").should("have.value", "Somethi");
  })
});
