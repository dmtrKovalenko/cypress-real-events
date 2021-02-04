describe("cy.realSwipe", () => {
  beforeEach(() => {
    cy.viewport("iphone-x")
    cy.visit("https://csb-dhe0i-qj8xxmx8y.vercel.app/");
  });

  ([
    {
      button: "left",
      swipe: "toLeft",
      touchPosition: "right",
    },
    {
      button: "right",
      swipe: "toRight",
      touchPosition: "left",
    },
    {
      button: "top",
      swipe: "toTop",
      touchPosition: "center",
    },
    {
      button: "bottom",
      swipe: "toBottom",
      touchPosition: "top",
    },
  ] as const).forEach(({ button, swipe, touchPosition }) => {
    it(`swipes ${button} drawer ${swipe}`, () => {
      cy.contains("button", button).click();
      cy.get(".MuiDrawer-paper").realSwipe(swipe, { length: 150, step: 10, touchPosition });

      cy.get(".MuiDrawer-paper").should("not.be.visible");
    });
  });

  it("opens drawer with swipe", () => {
    cy.get('.jss3.jss4').realSwipe("toRight", { length: 150, step: 10, touchPosition: "center" });
    cy.get('.MuiDrawer-paper').realSwipe("toLeft", { length: 150, step: 10, touchPosition: "center" });
  });
});
