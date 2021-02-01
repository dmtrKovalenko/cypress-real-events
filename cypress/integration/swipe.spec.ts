describe("cy.realSwipe", () => {
  beforeEach(() => {
    cy.visit("https://csb-dhe0i-qj8xxmx8y.vercel.app/");
  });

  ([
    {
      button: "left",
      swipe: "toRight",
      touchPosition: "right",
    },
    {
      button: "right",
      swipe: "toLeft",
      touchPosition: "left",
    },
    {
      button: "top",
      swipe: "toBottom",
      touchPosition: "center",
    },
    {
      button: "bottom",
      swipe: "toTop",
      touchPosition: "top",
    },
  ] as const).forEach(({ button, swipe, touchPosition }) => {
    it(`swipes ${button} drawer ${swipe}`, () => {
      cy.contains("button", button).click();
      cy.get(".MuiDrawer-paper").realSwipe(swipe, { touchPosition });

      cy.get(".MuiDrawer-paper").should("not.be.visible");
    });
  });
});
