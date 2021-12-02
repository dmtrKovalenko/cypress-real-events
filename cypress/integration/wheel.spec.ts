describe("cy.realMouseWheel", {
    viewportHeight: 600,
    viewportWidth: 600,
}, () => {
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

      cy.get(".main").realMouseWheel({ position: { x: $main.width() - 70, y }, deltaX: 21, deltaY: 21 });
      assertWheel("21", "21", "true", "smallbox");

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "main");

      cy.get(".main").realMouseWheel({ position: { x: $main.width() - 51, y }, deltaX: 7, deltaY: 7 });
      assertWheel("7", "7", "true", "smallbox");

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 18, deltaY: 18 });
      assertWheel("18", "18", "true", "main");

      cy.get(".smallbox").then(($smallbox) => {
        cy.get(".main").realMouseWheel({ position: { x: ($main.width() - $smallbox.width()) - 2, y }, deltaX: 11, deltaY: 11 });
        assertWheel("11", "11", "true", "main");

        cy.get(".main").realMouseWheel({ position: { x: ($main.width() - $smallbox.width()) + 2, y }, deltaX: 33, deltaY: 33 });
        assertWheel("33", "33", "true", "smallbox");
      });

      cy.get(".main").realMouseWheel({ position: { x: 35, y }, deltaX: 9, deltaY: 9 });
      assertWheel("9", "9", "true", "main");

      cy.get(".main").realMouseWheel({ scrollBehavior: false, position: { x: $main.width() - 30, y }, deltaX: 10, deltaY: 10 });
      assertWheel("10", "10", "true", "smallbox");
    });
  });
});