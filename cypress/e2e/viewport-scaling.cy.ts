import * as pixelmatch from "pixelmatch";
import { PNG } from "pngjs/browser";

/**
 * No matter how th viewport is scaled by cypress, all clicks and draws should not be moved by more than 1 px in y and x direction
 * 1px tolerance in each direction is ok, because the scaling forces the click coordinates to round up or down
 * 1px movement in one direction makes a difference of two pixels
 * **/

describe("draw on canvas with scaled viewport", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/drawCanvas.html");
  });

  it("clicks custom coordinates and viewport scaling", () => {
    // default cypress scale
    cy.viewport(1000, 660);
    const canvas = "canvas";
    cy.get(canvas).realClick({ x: 100, y: 100 });
    cy.get(canvas).realClick({ x: 200, y: 200 });
    cy.get(canvas).realClick({ x: 300, y: 300 });
    cy.get(canvas).then((cnv) => {
      const url = cnv[0].toDataURL("image/png");
      const realData = url.replace(/^data:image\/png;base64,/, "");
      cy.writeFile(
        "cypress/screenshots/compareFile/clickDraw100.png",
        realData,
        "base64"
      );
      /**
       * Three clicks produce three 3x3 Pixel rectangles
       * Each of them should not be moved more than 1px in each direction
       * --> max allowed difference to the reference image 18px
       **/
      compareImages(
        "clickDraw100.png",
        "clickDraw.png",
        "clickDraw100Diff.png"
      ).should("be.lessThan", 33);
    });
    cy.get("input").click();
    cy.viewport(1500, 1500);
    cy.get(canvas).realClick({ x: 100, y: 100 });
    cy.get(canvas).realClick({ x: 200, y: 200 });
    cy.get(canvas).realClick({ x: 300, y: 300 });
    cy.get(canvas).then((cnv) => {
      const url = cnv[0].toDataURL("image/png");
      const data = url.replace(/^data:image\/png;base64,/, "");
      cy.writeFile(
        "cypress/screenshots/compareFile/clickDrawScaled.png",
        data,
        "base64"
      );
      compareImages(
        "clickDrawScaled.png",
        "clickDraw.png",
        "clickDrawScaledDiff.png"
      ).should("be.lessThan", 33);
    });
  });

  it("touches custom coordinates with radius and viewport scaling", () => {
    // default cypress scale
    cy.viewport(1000, 660);
    const canvas = "canvas";
    cy.get(canvas).realTouch({ x: 100, y: 100 });
    cy.get(canvas).realTouch({ x: 200, y: 200, radius: 10 });
    cy.get(canvas).realTouch({ x: 300, y: 300, radiusX: 10, radiusY: 5 });
    cy.get(canvas).then((cnv) => {
      const url = cnv[0].toDataURL("image/png");
      const data = url.replace(/^data:image\/png;base64,/, "");
      cy.writeFile(
        "cypress/screenshots/compareFile/touchDraw100.png",
        data,
        "base64"
      );
      /**
       * Three touches with different radius create the following rectanges:
       * Radius 0 --> default 3x3
       * Radius 10 --> 10x10
       * Radius x:10 y:5 --> 10x15
       * Each of them should not be moved more than 1px in each direction
       * --> max allowed difference to the reference image 31px
       **/
      compareImages(
        "touchDraw100.png",
        "touchDraw.png",
        "touchDraw100Diff.png"
      ).should("be.lessThan", 63);
    });
    cy.get("input").click();
    cy.viewport(2000, 2000);
    cy.get(canvas).realTouch({ x: 100, y: 100 });
    cy.get(canvas).realTouch({ x: 200, y: 200, radius: 10 });
    cy.get(canvas).realTouch({ x: 300, y: 300, radiusX: 10, radiusY: 5 });
    cy.get(canvas).then((cnv) => {
      const url = cnv[0].toDataURL("image/png");
      const data = url.replace(/^data:image\/png;base64,/, "");
      cy.writeFile(
        "cypress/screenshots/compareFile/touchDrawScaled.png",
        data,
        "base64"
      );
      compareImages(
        "touchDrawScaled.png",
        "touchDraw.png",
        "touchDrawScaledDiff.png"
      ).should("be.lessThan", 63);
    });
  });
});

const compareImages = (
  realFile: string,
  compareFile: string,
  diffFile: string
): Cypress.Chainable<number> => {
  return cy
    .fixture("images/" + compareFile, null)
    .then((compareDate: Uint8Array) => {
      return cy
        .readFile("cypress/screenshots/compareFile/" + realFile, null)
        .then((realData: Uint8Array) => {
          const a = PNG.sync.read(realData);
          const b = PNG.sync.read(compareDate);
          const { width, height } = a;
          const diff = new PNG({ width, height });
          const diffPixel = pixelmatch(
            a.data,
            b.data,
            diff.data,
            width,
            height,
            {}
          );
          return cy
            .writeFile(
              "cypress/screenshots/compareFile/" + diffFile,
              PNG.sync.write(diff).toString("binary"),
              { encoding: "binary" }
            )
            .then(() => {
              return diffPixel;
            });
        });
    });
};
