describe("cy.realTouch", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it('touches the button', () => {
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
      .realTouch({ x: 170, y: 165 } )
  });
});