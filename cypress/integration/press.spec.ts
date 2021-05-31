describe("cy.realPress", () => {
  context("key pressing for google", () => {
    beforeEach(() => {
      cy.visit("https://google.com?hl=en");
    });

    it("registers keypress events using", () => {
      cy.realPress("c");
      cy.realPress("y");
      cy.realPress("p");
      cy.realPress("r");
      cy.realPress("e");
      cy.realPress("s");
      cy.realPress("s");

      cy.get("input[name=q]").should("have.value", "cypress");
    });

    it("Can fire native Tab focus switch", () => {
      cy.get("input[name=q]").click();
      cy.realPress("Tab");
      cy.get("[aria-label='Search by voice']").should("be.focused");
    });

    it.only("Can use Enter for a11y navigation", () => {
      cy.get("input[name=q]").focus();
      cy.realType("something");
      cy.realPress("Tab");

      cy.get("input[name=q]").should("have.value", "something");
      cy.realPress("Enter");
      cy.get("input[name=q]").should("have.value", "");
    });
  });

  context("shortcuts", () => {
    beforeEach(() => {
      cy.visit("https://wangchujiang.com/hotkeys/");
      cy.get("[data-key=27]").realClick(); // just activate the listener
    });

    it("Can fire shortcuts", () => {
      cy.realPress(["Control", "Shift", "R"]);
      cy.realPress(["Alt", "Shift", "F5"]);
    });

    it("Fires correct js events", () => {
      cy.document().then((document) => {
        document.addEventListener("keyup", (e) => {
          expect(e.isTrusted).to.be.true;
          expect(e.shiftKey).to.be.true;
          expect(e.altKey).to.be.true;

          if (e.key === "Alt") {
            expect(e.altKey).to.be.true;
            expect(e.code).to.eq("AltLeft");
            expect(e.keyCode).to.eq(18);
          }
          if (e.key === "Shift") {
            expect(e.altKey).to.be.true;
            expect(e.code).to.eq("ShiftLeft");
            expect(e.keyCode).to.eq(16);
          }
          if (e.key === "F5") {
            expect(e.altKey).to.be.true;
            expect(e.code).to.eq("F5");
            expect(e.keyCode).to.eq(116);
          }
        });
      });

      cy.realPress(["Alt", "Shift", "F5"]);
    });
  });
});
