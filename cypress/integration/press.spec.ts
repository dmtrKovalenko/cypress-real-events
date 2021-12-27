describe("cy.realPress", () => {
  it("Can type into an input", () => {
    cy.intercept('http://presstest.com/', (req) => {
      const html = document.implementation.createHTMLDocument()
      html.body.innerHTML = `<input type="text">`
      req.reply(html.documentElement.innerHTML)
    })
    cy.visit('http://presstest.com/')
    cy.get("input").focus();

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
    cy.intercept('http://presstest.com/', (req) => {
      const html = document.implementation.createHTMLDocument()
      html.body.innerHTML = [
        `<input type="text">`,
        `<button type="button">Click me</button>`
      ].join('')
      req.reply(html.documentElement.innerHTML)
    })
    cy.visit('http://presstest.com/')
    cy.get("input").click();
    cy.realPress("Tab");
    cy.get("button").should("be.focused");
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

  context("Keyboard a11y testing", () => {
    it("Dispatches beforeinput and keypress event for Enter", () => {
      cy.visit("https://w3c.github.io/uievents/tools/key-event-viewer");
      cy.realPress("Enter");

      cy.contains(".keycell.etype", "beforeinput");
      cy.contains(".keycell.etype", "keypress");
    });

    it("Fires trusted click on Enter", () => {
      cy.visit("./cypress/fixtures/keyboard-accessibility-test.html");
      cy.get("#click-enter").focus().realPress("Enter");

      cy.get("ul").contains(JSON.stringify({ isTrusted: true, type: "click" }));
    });

    it("Fires trusted click on Space", () => {
      cy.visit("./cypress/fixtures/keyboard-accessibility-test.html");
      cy.get("#click-enter").focus().realPress("Space");

      cy.get("ul").contains(JSON.stringify({ isTrusted: true, type: "click" }));
    });
  });
});
