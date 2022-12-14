describe("cy.realMouseDown and cy.realMouseUp", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("active state on the button", () => {
    cy.get(".action-btn").should(
      "have.css",
      "background-color",
      "rgb(217, 83, 79)"
    );
    cy.get(".action-btn").realMouseDown();
    cy.get(".action-btn").should(
      "have.css",
      "background-color",
      "rgb(172, 41, 37)"
    );
    cy.get(".action-btn").realMouseUp(); // will go in hover state
    cy.get(".action-btn").should(
      "have.css",
      "background-color",
      "rgb(201, 48, 44)"
    );
  });

  it("active/focused state on the text field", () => {
    cy.get("#email1").realMouseDown().should("be.focused");
  });

  it("active state on different positions", () => {
    cy.get(".action-btn")
      .realMouseDown({ position: "topLeft" })
      .realMouseUp({ position: "topLeft" })
      .realMouseDown({ position: "top" })
      .realMouseUp({ position: "top" })
      .realMouseDown({ position: "topRight" })
      .realMouseUp({ position: "topRight" })
      .realMouseDown({ position: "left" })
      .realMouseUp({ position: "left" })
      .realMouseDown({ position: "center" })
      .realMouseUp({ position: "center" })
      .realMouseDown({ position: "right" })
      .realMouseUp({ position: "right" })
      .realMouseDown({ position: "bottomLeft" })
      .realMouseUp({ position: "bottomLeft" })
      .realMouseDown({ position: "bottom" })
      .realMouseUp({ position: "bottom" })
      .realMouseDown({ position: "bottomRight" })
      .realMouseUp({ position: "bottomRight" });
  });

  describe("options.button", () => {
    it("should allow to press down mouse using middle button", (done) => {
      cy.get(".action-btn")
        .then(($button) => {
          $button.get(0).addEventListener("mousedown", (ev) => {
            if (ev.button === 1) {
              done();
            }
          });
        })
        .realMouseDown({ button: "middle" });
    });

    it("should allow to release mouse using middle button", (done) => {
      cy.get(".action-btn")
        .then(($button) => {
          $button.get(0).addEventListener("mouseup", (ev) => {
            if (ev.button === 1) {
              done();
            }
          });
        })
        .realMouseUp({ button: "middle" });
    });
  });

  function getScreenEdges() {
    const cypressAppWindow =
      window.parent.document.querySelector("iframe").contentWindow;
    const windowTopEdge = cypressAppWindow.document.documentElement.scrollTop;
    const windowBottomEdge = windowTopEdge + cypressAppWindow.innerHeight;
    const windowCenter = windowTopEdge + cypressAppWindow.innerHeight / 2;

    return {
      top: windowTopEdge,
      bottom: windowBottomEdge,
      center: windowCenter,
    };
  }

  function getElementEdges($el: JQuery) {
    const $elTop = $el.offset().top;

    return {
      top: Math.floor($elTop),
      bottom: Math.floor($elTop + $el.outerHeight()),
    };
  }
  describe("realMouseDown scroll behavior", () => {
    beforeEach(() => {
      cy.window().scrollTo("top");
    });

    it("defaults to scrolling the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseDown()
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });
    });

    it("scrolls the element to center of viewport", () => {
      cy.get("#action-canvas")
        .realMouseDown({ scrollBehavior: "center" })
        .then(($canvas: JQuery) => {
          const { top: $elTop, bottom: $elBottom } = getElementEdges($canvas);
          const { top: screenTop, bottom: screenBottom } = getScreenEdges();

          const screenCenter = screenTop + (screenBottom - screenTop) / 2;

          expect($elTop).to.equal(
            Math.floor(screenCenter) - $canvas.outerHeight() / 2
          );
          expect($elBottom).to.equal(
            Math.floor(screenCenter) + $canvas.outerHeight() / 2
          );
        });
    });

    it("scrolls the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseDown({ scrollBehavior: "top" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });
    });

    it("scrolls the element to the bottom of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseDown({ scrollBehavior: "bottom" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(Math.floor(screenBottom));
        });
    });

    it("scrolls the element to the nearest edge of the viewport", () => {
      cy.window().scrollTo("bottom");

      cy.get("#action-canvas")
        .realMouseDown({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });

      cy.window().scrollTo("top");

      cy.get("#action-canvas")
        .realMouseDown({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(Math.floor(screenBottom));
        });
    });
  });

  describe("realMouseUp scroll behavior", () => {
    beforeEach(() => {
      cy.window().scrollTo("top");
    });

    it("defaults to scrolling the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseUp()
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });
    });

    it("scrolls the element to center of viewport", () => {
      cy.get("#action-canvas")
        .realMouseUp({ scrollBehavior: "center" })
        .then(($canvas: JQuery) => {
          const { top: $elTop, bottom: $elBottom } = getElementEdges($canvas);
          const { top: screenTop, bottom: screenBottom } = getScreenEdges();

          const screenCenter = screenTop + (screenBottom - screenTop) / 2;

          expect($elTop).to.equal(
            Math.floor(screenCenter) - $canvas.outerHeight() / 2
          );
          expect($elBottom).to.equal(
            Math.floor(screenCenter) + $canvas.outerHeight() / 2
          );
        });
    });

    it("scrolls the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseUp({ scrollBehavior: "top" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });
    });

    it("scrolls the element to the bottom of the viewport", () => {
      cy.get("#action-canvas")
        .realMouseUp({ scrollBehavior: "bottom" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(Math.floor(screenBottom));
        });
    });

    it("scrolls the element to the nearest edge of the viewport", () => {
      cy.window().scrollTo("bottom");

      cy.get("#action-canvas")
        .realMouseUp({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(Math.floor(screenTop));
        });

      cy.window().scrollTo("top");

      cy.get("#action-canvas")
        .realMouseUp({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(Math.floor(screenBottom));
        });
    });
  });
});

describe(
  "realMouseDown and realMouseUp iframe behavior",
  { retries: 10 },
  () => {
    beforeEach(() => {
      cy.visit("./cypress/fixtures/iframe-page.html");
    });

    it("sets elements inside iframes to active state", () => {
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
            .realMouseDown()
            .then(($target) => {
              expect($target.css("background-color")).to.equal(
                "rgb(0, 0, 255)"
              );
            });

          // will go in hover state
          cy.get("#target")
            .realMouseUp()
            .then(($target) => {
              expect($target.css("background-color")).to.equal(
                "rgb(255, 192, 203)"
              );
            });
        });
    });

    it("sets elements inside transformed iframes to active states", () => {
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
            .realMouseDown()
            .then(($target) => {
              expect($target.css("background-color")).to.equal(
                "rgb(0, 0, 255)"
              );
            });

          // will go in hover state
          cy.get("#target")
            .realMouseUp()
            .then(($target) => {
              expect($target.css("background-color")).to.equal(
                "rgb(255, 192, 203)"
              );
            });
        });
    });
  }
);

describe("realMouseMove", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("./cypress/fixtures/mouse-move.html");
  });

  it("moves mouse", () => {
    cy.get("main").realClick().realMouseMove(100, 100);
    cy.get(".background")
      .then((el) => window.getComputedStyle(el[0]).getPropertyValue("--scale"))
      .should("eq", "1.8");
  });
});

describe("canvas drag with realMouseMove", () => {
  it("realMouseMove accepts every explicit option.position", () => {
    cy.visit("./cypress/fixtures/canvas-drag-svg.html");

    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, 10, { position: "topLeft" })
      .realMouseMove(30, 20, { position: "topLeft" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, 10, { position: "top" })
      .realMouseMove(30, 20, { position: "top" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(-20, 10, { position: "topRight" })
      .realMouseMove(-30, 20, { position: "topRight" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, 10, { position: "left" })
      .realMouseMove(30, 20, { position: "left" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, 10, { position: "center" })
      .realMouseMove(30, 20, { position: "center" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(-20, 10, { position: "right" })
      .realMouseMove(-30, 20, { position: "right" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, -10, { position: "bottomLeft" })
      .realMouseMove(30, -20, { position: "bottomLeft" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, -10, { position: "bottom" })
      .realMouseMove(30, -20, { position: "bottom" })
      .realMouseUp();
    cy.get("body")
      .realMouseDown()
      .realMouseMove(-20, -10, { position: "bottomRight" })
      .realMouseMove(-30, -20, { position: "bottomRight" })
      .realMouseUp();

    // If every element is clickable, they are not overlapping.
    cy.get("polyline").click({ multiple: true });
  });

  it("realMouseMove default option.position is 'topLeft'", () => {
    /**
     * The last polyline element should overlap the first,
     * so they should have the same `points` attributes
     * but all other siblings should have unique `points` attributes,
     * so they should be clickable.
     */
    cy.get("body")
      .realMouseDown()
      .realMouseMove(20, 10)
      .realMouseMove(30, 20)
      .realMouseUp();

    cy.get("svg").within(() => {
      cy.get(":first").then((first) => {
        cy.should("have.attr", "points");
        cy.get(":first").siblings().click({ multiple: true });
        cy.get(":last").should("have.attr", "points", first);
      });
    });
  });
});
