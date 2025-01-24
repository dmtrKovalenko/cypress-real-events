describe("cy.realType", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/type-test.html");
    cy.get("input[name=q]").focus();
  });

  it("types text into googles main search inptu", () => {
    cy.realType("cypress can produce real events");

    cy.get("input[name=q]").should(
      "have.value",
      "cypress can produce real events",
    );
  });

  it("does not type if element is not focused", () => {
    cy.realPress("Tab"); // move focus out
    cy.get("input[name=q]").should("not.be.focused");
    cy.realType("pressing keys");
    cy.get("input[name=q]").should("have.value", "");
  });

  it("supports cypress's keys shortcuts", () => {
    cy.realType("Something{backspace}{moveToStart}{rightarrow}{backspace}");
    cy.get("input[name=q]").should("have.value", "omethin");
  });

  it("can select text", () => {
    cy.realType("to replace");
    cy.get("input[name=q]").realClick({ clickCount: 3 });
    cy.realType("{backspace}something");
    cy.get("input[name=q]").should("have.value", "something");
  });

  it("can clear text input", () => {
    cy.realType("lalalalala");
    cy.get("input[name=q]").realClick({ clickCount: 3 });
    cy.realPress("Backspace");
  });

  it("can type braces", () => {
    cy.realType("{");
    cy.get("input[name=q]").should("have.value", "{");
    cy.realPress("Backspace");
    cy.realType("{{}test}");
    cy.get("input[name=q]").should("have.value", "{test}");
  });

  it("can type text with emoji and cyrillic characters", () => {
    const msg = "cypress-real-events is awesome! ❤️❤️❤️❤️❤️❤️ В";
    cy.realType(msg);

    cy.get("input[name=q]").should("have.value", msg);
  });
});
