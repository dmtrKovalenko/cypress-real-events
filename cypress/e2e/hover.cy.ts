describe("cy.realHover", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("hovers and applies styles from :hover pseudo-class", () => {
    cy.get(".action-btn")
      .should("have.css", "background-color", "rgb(217, 83, 79)")
      .realHover()
      .should("have.css", "background-color", "rgb(201, 48, 44)");

    cy.get("body").realHover({ position: "topLeft" });
    cy.get(".action-btn").should(
      "have.css",
      "background-color",
      "rgb(217, 83, 79)",
    );
  });

  describe("scroll behavior", () => {
    function getScreenEdges() {
      const cypressAppWindow =
        window.parent.document.querySelector("iframe").contentWindow;
      const windowTopEdge = cypressAppWindow.document.documentElement.scrollTop;
      const windowBottomEdge = windowTopEdge + cypressAppWindow.innerHeight;
      const windowCenter = windowTopEdge + cypressAppWindow.innerHeight / 2;

      return {
        screenTop: Math.floor(windowTopEdge),
        screenBottom: Math.floor(windowBottomEdge),
        screenCenter: Math.floor(windowCenter),
      };
    }

    function getElementEdges($el: JQuery) {
      const $elTop = $el.offset().top;

      return {
        $elTop: Math.floor($elTop),
        $elBottom: Math.floor($elTop + $el.outerHeight()),
      };
    }

    beforeEach(() => {
      cy.window().scrollTo("top");
    });

    it("defaults to scrolling the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realHover()
        .then(($canvas: JQuery) => {
          const { $elTop } = getElementEdges($canvas);
          const { screenTop } = getScreenEdges();

          expect($elTop).to.be.closeTo(screenTop, 2);
        });
    });

    it("scrolls the element to center of viewport", () => {
      cy.get("#action-canvas")
        .realHover({ scrollBehavior: "center" })
        .then(($canvas: JQuery) => {
          const { $elTop, $elBottom } = getElementEdges($canvas);
          const { screenTop, screenBottom } = getScreenEdges();

          const screenCenter = screenTop + (screenBottom - screenTop) / 2;

          expect($elTop).to.be.closeTo(
            Math.floor(screenCenter) - $canvas.outerHeight() / 2,
            2,
          );
          expect($elBottom).to.be.closeTo(
            Math.floor(screenCenter) + $canvas.outerHeight() / 2,
            2,
          );
        });
    });

    it("scrolls the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realHover({ scrollBehavior: "top" })
        .then(($canvas: JQuery) => {
          const { $elTop } = getElementEdges($canvas);
          const { screenTop } = getScreenEdges();

          expect($elTop).to.be.closeTo(Math.floor(screenTop), 2);
        });
    });

    it("scrolls the element to the bottom of the viewport", () => {
      cy.get("#action-canvas")
        .realHover({ scrollBehavior: "bottom" })
        .then(($canvas: JQuery) => {
          const { $elBottom } = getElementEdges($canvas);
          const { screenBottom } = getScreenEdges();

          expect($elBottom).to.be.closeTo(Math.floor(screenBottom), 2);
        });
    });

    it("scrolls the element to the nearest edge of the viewport", () => {
      cy.window().scrollTo("bottom");

      cy.get("#action-canvas")
        .realHover({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { $elTop } = getElementEdges($canvas);
          const { screenTop } = getScreenEdges();

          expect($elTop).to.be.closeTo(Math.floor(screenTop), 2);
        });

      cy.window().scrollTo("top");

      cy.get("#action-canvas")
        .realHover({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { $elBottom } = getElementEdges($canvas);
          const { screenBottom } = getScreenEdges();

          expect($elBottom).to.be.closeTo(Math.floor(screenBottom), 2);
        });
    });
  });
});

describe("iframe behavior", { retries: 10 }, () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/iframe-page.html");
  });

  it("hovers elements inside iframes", () => {
    cy.get("iframe")
      .then(($firstIframe) => {
        return cy.wrap($firstIframe.contents().find("iframe"));
      })
      .then(($secondIframe) => {
        return cy.wrap($secondIframe.contents().find("body"));
      })
      .within(() => {
        cy.get("#target").then(($target) => {
          expect($target.css("background-color")).to.equal("rgb(0, 128, 0)");
        });

        cy.get("#target")
          .realHover()
          .then(($target) => {
            expect($target.css("background-color")).to.equal(
              "rgb(255, 192, 203)",
            );
          });
      });
  });

  it("hovers elements inside transformed iframes", () => {
    cy.get("iframe")
      .then(($firstIframe) => {
        $firstIframe.css("transform", "scale(.5)");
        return cy.wrap($firstIframe.contents().find("iframe"));
      })
      .then(($secondIframe) => {
        $secondIframe.css("transform", "scale(.75)");
        return cy.wrap($secondIframe.contents().find("body"));
      })
      .within(() => {
        cy.get("#target").then(($target) => {
          expect($target.css("background-color")).to.equal("rgb(0, 128, 0)");
        });

        cy.get("#target")
          .realHover()
          .then(($target) => {
            expect($target.css("background-color")).to.equal(
              "rgb(255, 192, 203)",
            );
          });
      });
  });
});
