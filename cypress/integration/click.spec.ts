import scrollBehaviorSpecGenerator from './_scroll-behavior';

describe("cy.realClick", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("clicks on the button", () => {
    cy.get(".action-btn").realClick();
    cy.contains("This popover shows up on click");
  });

  it("clicks on the text field", () => {
    cy.get("#email1").realClick().should("be.focused");
  });

  it("clicks on different positions", () => {
    cy.get("#action-canvas")
      .realClick({ position: "topLeft" })
      .realClick({ position: "top" })
      .realClick({ position: "topRight" })
      .realClick({ position: "left" })
      .realClick({ position: "center" })
      .realClick({ position: "right" })
      .realClick({ position: "bottomLeft" })
      .realClick({ position: "bottom" })
      .realClick({ position: "bottomRight" });
  });

  it("clicks on custom coordinates", () => {
    cy.get("#action-canvas")
      .realClick({ x: 80, y: 75 })
      .realClick({ x: 170, y: 75 })
      .realClick({ x: 80, y: 165 })
      .realClick({ x: 100, y: 185 })
      .realClick({ x: 125, y: 190 })
      .realClick({ x: 150, y: 185 })
      .realClick({ x: 170, y: 165 } )
  });

  it("opens system native event on right click", () => {
    cy.get(".action-btn").realClick({ button: "right" });
  });

  scrollBehaviorSpecGenerator('realClick');
});
