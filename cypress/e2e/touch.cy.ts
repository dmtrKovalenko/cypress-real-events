describe("cy.realTouch", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("touches the button", () => {
    cy.get(".action-btn").realTouch();
    cy.contains("This popover shows up on click");
  });

  it("touches the text field", () => {
    cy.get("#email1").realTouch().should("be.focused");
  });

  it("touches different positions", () => {
    cy.get("#action-canvas")
      .realTouch({ position: "topLeft" })
      .realTouch({ position: "top" })
      .realTouch({ position: "topRight" })
      .realTouch({ position: "left" })
      .realTouch({ position: "center" })
      .realTouch({ position: "right" })
      .realTouch({ position: "bottomLeft" })
      .realTouch({ position: "bottom" })
      .realTouch({ position: "bottomRight" });
  });

  it("touches custom coordinates", () => {
    cy.get("#action-canvas")
      .realTouch({ x: 80, y: 75 })
      .realTouch({ x: 170, y: 75 })
      .realTouch({ x: 80, y: 165 })
      .realTouch({ x: 100, y: 185 })
      .realTouch({ x: 125, y: 190 })
      .realTouch({ x: 150, y: 185 })
      .realTouch({ x: 170, y: 165 });
  });

  it("touches with a default radius of 1", { retries: 10 }, (done) => {
    cy.get(".action-btn")
      .then(($button) => {
        $button.get(0).addEventListener("pointerdown", (event) => {
          expect(event.width).to.equal(2);
          expect(event.height).to.equal(2);
          done();
        });
      })
      .realTouch();
  });

  it("touches with a custom radius", { retries: 4 }, (done) => {
    cy.get(".action-btn")
      .then(($button) => {
        $button.get(0).addEventListener("pointerdown", (event) => {
          expect(event.width).to.equal(20);
          expect(event.height).to.equal(20);
          done();
        });
      })
      .realTouch({ radius: 10 });
  });

  it("touches with a custom radius for each axis", { retries: 4 }, (done) => {
    cy.get(".action-btn")
      .then(($button) => {
        $button.get(0).addEventListener("pointerdown", (event) => {
          expect(event.width).to.equal(10);
          expect(event.height).to.equal(14);
          done();
        });
      })
      .realTouch({ radiusX: 5, radiusY: 7 });
  });
});
