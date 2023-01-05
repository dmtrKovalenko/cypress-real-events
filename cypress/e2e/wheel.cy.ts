function assertWheel(opt: { deltax: string; deltay:string; trusted: string; className: string }) {
  cy.get(".deltax").should("have.text", opt.deltax, "DeltaX");
  cy.get(".deltay").should("have.text", opt.deltay, "DeltaY");
  cy.get(".isTrusted").should("have.text", opt.trusted);
  cy.get(".target").should("have.text", opt.className);
}

describe("cy.realMouseWheel", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/wheel.html");
  });

  it("should scroll over green box", () => {
    cy.get(".greenbox").realMouseWheel({ deltaY: 100 });
    assertWheel({
      deltax: "0",
      deltay: "100",
      trusted: "true",
      className: "main greenbox"
    });
  });

  it("should scroll deltaY over red box", () => {
    cy.get(".redbox").realMouseWheel({ deltaY: 75 });
    assertWheel({
      deltax: "0",
      deltay: "75",
      trusted: "true",
      className: "smallbox redbox"
    });
  });

  it("should scroll deltaX over red box", () => {
    cy.get(".redbox").realMouseWheel({ deltaX: 25 });
    assertWheel({
      deltax: "25",
      deltay: "0",
      trusted: "true",
      className: "smallbox redbox"
    });
  });

  it("should scroll deltaX and deltaY over red box", () => {
    cy.get(".redbox").realMouseWheel({ deltaX: 33, deltaY: 33 });
    assertWheel({
      deltax: "33",
      deltay: "33",
      trusted: "true",
      className: "smallbox redbox"
    });
  });

  context("Scrollable Area", () => {
    it("should scroll scrollable area, deltaY", () => {
      cy.get(".scrollable-area").realMouseWheel({ deltaY: 53 });
      cy.get(".scrolloffset-top").should("have.text", "-35");
      cy.get(".scrolloffset-left").should("have.text", "498");
    });

    it("should scroll scrollable area, deltaX", () => {
      cy.get(".scrollable-area").realMouseWheel({ deltaX: 100 });
      cy.get(".scrolloffset-top").should("have.text", "18");
      cy.get(".scrolloffset-left").should("have.text", "398");
    });

    it("should scroll scrollable area, deltaX and deltaY", () => {
      cy.get(".scrollbutton button").should("not.be.visible");

      cy.get(".scrollable-area").realMouseWheel({ deltaX: 72, deltaY: 250 });
      cy.get(".scrolloffset-top").should("have.text", "-232");
      cy.get(".scrolloffset-left").should("have.text", "426");

      cy.get(".scrollbutton button").should("be.visible");

      cy.get(".scrollable-area").realMouseWheel({ deltaX: -72, deltaY: -250 });
      cy.get(".scrolloffset-top").should("have.text", "18");
      cy.get(".scrolloffset-left").should("have.text", "498");

      cy.get(".scrollbutton button").should("not.be.visible");
    });
  });
});
