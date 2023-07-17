describe("cy.realSwipe", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("https://csb-dhe0i-qj8xxmx8y.vercel.app/");
  });

  (
    [
      {
        button: "left",
        swipe: "toLeft",
        length: 150,
        touchPosition: "right",
      },
      {
        button: "right",
        swipe: "toRight",
        length: 150,
        touchPosition: "left",
      },
      {
        button: "top",
        swipe: "toTop",
        length: 300,
        touchPosition: "center",
      },
      {
        button: "bottom",
        swipe: "toBottom",
        length: 300,
        touchPosition: "top",
      },
    ] as const
  ).forEach(({ button, swipe, length, touchPosition }) => {
    it(`swipes ${button} drawer ${swipe}`, { retries: 4 }, () => {
      cy.contains("button", button).click();
      cy.get(".MuiDrawer-paper").realSwipe(swipe, {
        length,
        step: 10,
        touchPosition,
      });

      cy.get(".MuiDrawer-paper").should("not.be.visible");
    });
  });

  it("opens drawer with swipe", { retries: 4 }, () => {
    cy.get(".jss3.jss4").realSwipe("toRight", {
      length: 150,
      step: 10,
      touchPosition: "center",
    });
    cy.get(".MuiDrawer-paper").realSwipe("toLeft", {
      length: 150,
      step: 10,
      touchPosition: "center",
    });
  });
});
