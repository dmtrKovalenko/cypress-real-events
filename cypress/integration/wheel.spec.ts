describe("cy.realMouseWheel", () => {
  function assertWheel(deltax: string, deltay:string, trusted: string, className: string) {
    cy.get(".deltax").should("have.text", deltax, "DeltaX");
    cy.get(".deltay").should("have.text", deltay, "DeltaY");
    cy.get(".isTrusted").should("have.text", trusted);
    cy.get(".target").should("have.text", className);
  }

  it("scroll over main", () => {
    cy.visit("./cypress/fixtures/scroll-test.html");
    cy.get(".main").realMouseWheel({ position: "center", deltaY: 500 });
    assertWheel("0", "500", "true", "main");

    cy.get(".main").realMouseWheel({ position: "center", deltaY: -200 });
    assertWheel("0", "-200", "true", "main");

    cy.get(".main").realMouseWheel({ position: "center", deltaX: 105 });
    assertWheel("105", "0", "true", "main");

    cy.get(".main").realMouseWheel({ position: "center", deltaX: -50 });
    assertWheel("-50", "0", "true", "main");

    cy.get(".main").realMouseWheel({ position: "center", deltaX: -50, deltaY: 10 });
    assertWheel("-50", "10", "true", "main");

    cy.get(".main").realMouseWheel({ deltaX: 5, deltaY: 5 });
    assertWheel("5", "5", "true", "main");

    cy.get(".main").realMouseWheel({ position: { x: 10, y: 10 }, deltaX: 111, deltaY: 12 });
    assertWheel("111", "12", "true", "main");

    cy.get(".main").realMouseWheel({ position: { x: 13, y: 13 }, deltaX: 22, deltaY: 33 });
    assertWheel("22", "33", "true", "main");
  });

  it("scroll over smallbox", () => {
    cy.get(".smallbox").realMouseWheel({ deltaX: 777, deltaY: 888 });
    assertWheel("777", "888", "true", "smallbox");

    cy.get(".main").then(($main) => {
      const y = 20;

      cy.get(".main").realMouseWheel({ position: { x: $main.width() - 70, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "smallbox");

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "main");

      cy.get(".main").realMouseWheel({ position: { x: $main.width() - 51, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "smallbox");

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "main");

      // this one is not valid but pases in headless electron.
      cy.get(".main").realMouseWheel({ position: { x: $main.width() - 110, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "smallbox");

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "main");

      // this is valid but fails in headless electron.
      // cy.get(".main").realMouseWheel({ scrollBehavior: false, position: { x: $main.width() - 30, y }, deltaX: 10, deltaY: 10 });
      // assertWheel("10", "10", "true", "smallbox");
      // stange behavior when its in headless
    });
  });
});