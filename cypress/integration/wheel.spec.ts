describe("cy.realMouseWheel", () => {
  function assertWheel(deltax: string, deltay:string, trusted: string, className: string) {
    cy.get(".deltax").should("have.text", deltax);
    cy.get(".deltay").should("have.text", deltay);
    cy.get(".isTrusted").should("have.text", trusted);
    cy.get(".target").should("have.text", className);
  }

  it("scroll box", () => {
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

    cy.get(".main").realMouseWheel({ position: { x: 2, y: 2 }, deltaX: 11, deltaY: 12 });
    assertWheel("11", "12", "true", "main");

    cy.get(".main").then(($main) => {
      const x = $main.width() - 10;
      const y = 10;
      cy.get(".main").realMouseWheel({ position: { x, y }, deltaX: 8, deltaY: 9 });
      assertWheel("8", "9", "true", "smallbox");
    });
  });
});