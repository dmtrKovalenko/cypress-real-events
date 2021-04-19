describe("cy.mouseDown", () => {
    beforeEach(() => {
      cy.visit("https://example.cypress.io/commands/actions");
    });
  
    it("active state on the button", () => {
      cy.get(".action-btn").should("have.css", "background-color", "rgb(217, 83, 79)");
      cy.get(".action-btn").mouseDown();
      cy.get(".action-btn").should("have.css", "background-color", "rgb(172, 41, 37)");
    });
  
    it("active/focused state on the text field", () => {
      cy.get("#email1").mouseDown().should("be.focused");
    });
  
    it("active state on different positions", () => {
      cy.get(".action-btn")
        .mouseDown({ position: "topLeft" })
        .mouseDown({ position: "top" })
        .mouseDown({ position: "topRight" })
        .mouseDown({ position: "left" })
        .mouseDown({ position: "center" })
        .mouseDown({ position: "right" })
        .mouseDown({ position: "bottomLeft" })
        .mouseDown({ position: "bottom" })
        .mouseDown({ position: "bottomRight" });
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
          .mouseDown()
          .then(($canvas: JQuery) => {
            const { top: $elTop } = getElementEdges($canvas);
            const { top: screenTop } = getScreenEdges();
  
            expect($elTop).to.equal(screenTop);
          });
      });
  
      it("scrolls the element to center of viewport", () => {
        cy.get("#action-canvas")
          .mouseDown({ scrollBehavior: "center" })
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
          .mouseDown({ scrollBehavior: "top" })
          .then(($canvas: JQuery) => {
            const { top: $elTop } = getElementEdges($canvas);
            const { top: screenTop } = getScreenEdges();
  
            expect($elTop).to.equal(screenTop);
          });
      });
  
      it("scrolls the element to the bottom of the viewport", () => {
        cy.get("#action-canvas")
          .mouseDown({ scrollBehavior: "bottom" })
          .then(($canvas: JQuery) => {
            const { bottom: $elBottom } = getElementEdges($canvas);
            const { bottom: screenBottom } = getScreenEdges();
  
            expect($elBottom).to.equal(screenBottom);
          });
      });
  
      it("scrolls the element to the nearest edge of the viewport", () => {
        cy.window().scrollTo("bottom");
  
        cy.get("#action-canvas")
          .mouseDown({ scrollBehavior: "nearest" })
          .then(($canvas: JQuery) => {
            const { top: $elTop } = getElementEdges($canvas);
            const { top: screenTop } = getScreenEdges();
  
            expect($elTop).to.equal(screenTop);
          });
  
        cy.window().scrollTo("top");
  
        cy.get("#action-canvas")
          .mouseDown({ scrollBehavior: "nearest" })
          .then(($canvas: JQuery) => {
            const { bottom: $elBottom } = getElementEdges($canvas);
            const { bottom: screenBottom } = getScreenEdges();
  
            expect($elBottom).to.equal(screenBottom);
          });
      });
    });
});

describe('iframe behavior', () => {
    beforeEach(() => {
      cy.visit('./cypress/fixtures/iframe-page.html');
    });
  
    it('sets elements inside iframes to active state', () => {
      cy.get('iframe').then(($firstIframe) => {
        return cy.wrap($firstIframe.contents().find('iframe'));
      }).then(($secondIframe) => {
        return cy.wrap($secondIframe.contents().find('body'));
      }).within(() => {
        cy.get('#target').then(($target) => {
          expect($target.css('background-color')).to.equal('rgb(0, 128, 0)');
        });
  
        cy.get('#target').mouseDown().then(($target) => {
          expect($target.css('background-color')).to.equal('rgb(0, 0, 255)');
        });
      });
    });
  
    it('sets elements inside transformed iframes to active states', () => {
      cy.get('iframe').then(($firstIframe) => {
        $firstIframe.css('transform', 'scale(.5)');
        return cy.wrap($firstIframe.contents().find('iframe'));
      }).then(($secondIframe) => {
        $secondIframe.css('transform', 'scale(.75)');
        return cy.wrap($secondIframe.contents().find('body'));
      }).within(() => {
        cy.get('#target').then(($target) => {
          expect($target.css('background-color')).to.equal('rgb(0, 128, 0)');
        });
  
        cy.get('#target').mouseDown().then(($target) => {
          expect($target.css('background-color')).to.equal('rgb(0, 0, 255)');
        });
      });
    });
});
  