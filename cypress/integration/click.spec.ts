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
      .realClick({ x: 170, y: 165 });
  });

  it("opens system native event on right click", () => {
    cy.get(".action-btn").realClick({ button: "right" });
  });

  it("allow for double clicks", (done) => {
    cy.get(".action-btn")
      .then(($button) => {
        $button.get(0).addEventListener("dblclick", () => {
          done()
        });
      })
      .realClick({ clickCount: 2 });
  });

  it("should dispatch multiple clicks with clickCount greater than 1", (done) => {
    let count = 0
    cy.get(".action-btn")
      .then(($button) => {
        $button.get(0).addEventListener("click", () => {
          count++
          if (count === 2) {
            done()
          }
        });
      })
      .realClick({ clickCount: 2 });
  });

  it("right click should only report secondary button being pressed", () => {
    cy.get(".navbar-brand").then($navbarBrand => {
      $navbarBrand.get(0).addEventListener('contextmenu', (ev) => {
        ev.preventDefault()
        expect(ev.buttons).to.eq(2)
      })
    })

    cy.get('.navbar-brand').realClick({ button: 'right' })
  });

  describe("scroll behavior", () => {
    function getScreenEdges() {
      const cypressAppWindow = window.parent.document.querySelector("iframe")
        .contentWindow;
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
        top: $elTop,
        bottom: $elTop + $el.outerHeight(),
      };
    }

    beforeEach(() => {
      cy.window().scrollTo("top");
    });

    it("defaults to scrolling the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realClick()
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(screenTop);
        });
    });

    it("scrolls the element to center of viewport", () => {
      cy.get("#action-canvas")
        .realClick({ scrollBehavior: "center" })
        .then(($canvas: JQuery) => {
          const { top: $elTop, bottom: $elBottom } = getElementEdges($canvas);
          const { top: screenTop, bottom: screenBottom } = getScreenEdges();

          const screenCenter = screenTop + (screenBottom - screenTop) / 2;

          expect($elTop).to.equal(screenCenter - $canvas.outerHeight() / 2);
          expect($elBottom).to.equal(screenCenter + $canvas.outerHeight() / 2);
        });
    });

    it("scrolls the element to the top of the viewport", () => {
      cy.get("#action-canvas")
        .realClick({ scrollBehavior: "top" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(screenTop);
        });
    });

    it("scrolls the element to the bottom of the viewport", () => {
      cy.get("#action-canvas")
        .realClick({ scrollBehavior: "bottom" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(screenBottom);
        });
    });

    it("scrolls the element to the nearest edge of the viewport", () => {
      cy.window().scrollTo("bottom");

      cy.get("#action-canvas")
        .realClick({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { top: $elTop } = getElementEdges($canvas);
          const { top: screenTop } = getScreenEdges();

          expect($elTop).to.equal(screenTop);
        });

      cy.window().scrollTo("top");

      cy.get("#action-canvas")
        .realClick({ scrollBehavior: "nearest" })
        .then(($canvas: JQuery) => {
          const { bottom: $elBottom } = getElementEdges($canvas);
          const { bottom: screenBottom } = getScreenEdges();

          expect($elBottom).to.equal(screenBottom);
        });
    });
  });
});

describe("iframe behavior", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/iframe-page.html");
  });

  it("clicks elements inside iframes", () => {
    cy.get("iframe")
      .then(($firstIframe) => {
        return cy.wrap($firstIframe.contents().find("iframe"));
      })
      .then(($secondIframe) => {
        return cy.wrap($secondIframe.contents().find("body"));
      })
      .within(() => {
        cy.get("#target").contains("clicked").should("not.exist");
        cy.get("#target").realClick().contains("clicked").should("exist");
      });
  });

  it("clicks elements inside transformed iframes", () => {
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
        cy.get("#target").contains("clicked").should("not.exist");
        cy.get("#target").realClick().contains("clicked").should("exist");
      });
  });
});
