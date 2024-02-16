describe("cy.realPress", { retries: 10 }, () => {
  it("Can type into an input", () => {
    cy.visit("https://w3c.github.io/uievents/tools/key-event-viewer");
    cy.get("#input").focus();

    cy.realPress("c");
    cy.realPress("y");
    cy.realPress("p");
    cy.realPress("r");
    cy.realPress("e");
    cy.realPress("s");
    cy.realPress("s");

    cy.get("input").should("have.value", "cypress");
  });

  it("Can fire native Tab focus switch", () => {
    cy.visit("./cypress/fixtures/focus-order.html");
    cy.window().focus();
    cy.get("#tab1").realPress("Tab"); // focus switches to tab2
    cy.get("#tab2").should("have.class", "active");

    cy.get("#tab2").realPress("Tab"); // focus switches to tab3
    cy.get("#tab3").should("have.class", "active");
  });

  context("Keyboard a11y testing", () => {
    it("Dispatches beforeinput and keypress event for Enter", () => {
      cy.visit("https://w3c.github.io/uievents/tools/key-event-viewer");
      cy.realPress("Enter");

      cy.contains(".keycell.etype", "beforeinput");
      cy.contains(".keycell.etype", "keypress");
    });

    it("Fires trusted click on Enter", () => {
      cy.visit("./cypress/fixtures/keyboard-accessibility-test.html");
      cy.get("#click-enter").focus();
      cy.get("#click-enter").realPress("Enter");

      cy.get("ul").contains(JSON.stringify({ isTrusted: true, type: "click" }));
    });

    it("Fires trusted click on Space", () => {
      cy.visit("./cypress/fixtures/keyboard-accessibility-test.html");
      cy.get("#click-enter").focus();
      cy.get("#click-enter").realPress("Space");

      cy.get("ul").contains(JSON.stringify({ isTrusted: true, type: "click" }));
    });
  });

  context("Shortcuts", () => {
    it("Fires shortcuts correctly", () => {
      cy.visit("https://w3c.github.io/uievents/tools/key-event-viewer");
      cy.realPress(["Meta", "E"]);

      // yes the typo in the guide className ¯\_(ツ)_/¯
      cy.get(".keydown_row_hilight .keycell.legacy").contains("69E");
      cy.get(".keydown_row_hilight .keycell.legacy").contains("91Meta");
    });
  });
});
