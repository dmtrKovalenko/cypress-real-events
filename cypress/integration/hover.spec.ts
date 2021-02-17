describe("cy.realHover", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/actions");
  });

  it("hovers and applies styles from :hover pseudo-class", () => {
    cy.get(".action-btn")
      .should("have.css", "background-color", "rgb(217, 83, 79)")
      .realHover()
      .should("have.css", "background-color", "rgb(201, 48, 44)");
  });

  describe('scroll behavior', () => {
    function getScreenEdges() {
      const cypressAppWindow = window.parent.document.querySelector("iframe").contentWindow;
      const windowTopEdge = cypressAppWindow.document.documentElement.scrollTop;
      const windowBottomEdge = windowTopEdge + cypressAppWindow.innerHeight;
      const windowCenter = windowTopEdge + (cypressAppWindow.innerHeight / 2);

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
        bottom: $elTop + $el.outerHeight()
      }
    }

    beforeEach(() => {
      cy.window().scrollTo('top');
    });

    it('defaults to scrolling the element to the top of the viewport', () => {
      cy.get('#action-canvas').realHover().then(($canvas: JQuery) => {
        const { top: $elTop } = getElementEdges($canvas);
        const { top: screenTop } = getScreenEdges();

        expect($elTop).to.equal(screenTop);
      });
    });

    it('scrolls the element to center of viewport', () => {
      cy.get('#action-canvas').realHover({ scrollBehavior: 'center' }).then(($canvas: JQuery) => {
        const { top: $elTop, bottom: $elBottom } = getElementEdges($canvas);
        const { top: screenTop, bottom: screenBottom } = getScreenEdges();

        const screenCenter = screenTop + (screenBottom - screenTop) / 2;

        expect($elTop).to.equal(screenCenter - ($canvas.outerHeight() / 2));
        expect($elBottom).to.equal(screenCenter + ($canvas.outerHeight() / 2));
      });
    });

    it('scrolls the element to the top of the viewport', () => {
      cy.get('#action-canvas').realHover({ scrollBehavior: 'top' }).then(($canvas: JQuery) => {
        const { top: $elTop } = getElementEdges($canvas);
        const { top: screenTop } = getScreenEdges();

        expect($elTop).to.equal(screenTop);
      });
    });

    it('scrolls the element to the bottom of the viewport', () => {
      cy.get('#action-canvas').realHover({ scrollBehavior: 'bottom' }).then(($canvas: JQuery) => {
        const { bottom: $elBottom } = getElementEdges($canvas);
        const { bottom: screenBottom } = getScreenEdges();

        expect($elBottom).to.equal(screenBottom);
      });
    });

    it('scrolls the element to the nearest edge of the viewport',  () => {
      cy.window().scrollTo('bottom');

      cy.get('#action-canvas').realHover({ scrollBehavior: 'nearest' }).then(($canvas: JQuery) => {
        const { top: $elTop } = getElementEdges($canvas);
        const { top: screenTop } = getScreenEdges();

        expect($elTop).to.equal(screenTop);
      });

      cy.window().scrollTo('top');

      cy.get('#action-canvas').realHover({ scrollBehavior: 'nearest' }).then(($canvas: JQuery) => {
        const { bottom: $elBottom } = getElementEdges($canvas);
        const { bottom: screenBottom } = getScreenEdges();

        expect($elBottom).to.equal(screenBottom);
      });
    });
  });
});
