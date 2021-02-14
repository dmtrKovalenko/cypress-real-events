export type Position =
  | "topLeft"
  | "top"
  | "topRight"
  | "left"
  | "center"
  | "right"
  | "bottomLeft"
  | "bottom"
  | "bottomRight"
  | { x: number; y: number };

export type ScrollBehaviorOptions = false | 'center' | 'top' | 'bottom' | 'nearest';

function getPositionedCoordinates(
  x0: number,
  y0: number,
  width: number,
  height: number,
  position: Position
) {
  if (typeof position === "object" && position !== null) {
    const { x, y } = position;
    return [x0 + x, y0 + y];
  }

  switch (position) {
    case "topLeft":
      return [x0, y0];
    case "top":
      return [x0 + width / 2, y0];
    case "topRight":
      return [x0 + width - 1, y0];
    case "left":
      return [x0, y0 + height / 2];
    case "right":
      return [x0 + width - 1, y0 + height / 2];
    case "bottomLeft":
      return [x0, y0 + height - 1];
    case "bottom":
      return [x0 + width / 2, y0 + height - 1];
    case "bottomRight":
      return [x0 + width - 1, y0 + height - 1];
    // center by default
    default:
      return [x0 + width / 2, y0 + height / 2];
  }
}

/**
 * Cypress Automation debugee is the whole tab.
 * This function returns the element coordinates relative to the whole tab rot.
 * @param jqueryEl the element to introspect
 */
export function getCypressElementCoordinates(
  jqueryEl: JQuery,
  position: Position | undefined,
  scrollBehavior?: ScrollBehaviorOptions,
) {
  const htmlElement = jqueryEl.get(0);
  const cypressAppFrame = window.parent.document.querySelector("iframe");

  if (!cypressAppFrame || !cypressAppFrame.id.includes("Your App")) {
    throw new Error(
      "Can not find cypress application iframe, it looks like critical issue. Please rise an issue on GitHub."
    );
  }

  const effectiveScrollBehavior = scrollBehavior ?? Cypress.config('scrollBehavior') ?? "center";
  if (effectiveScrollBehavior) {
    scrollIntoView(htmlElement, effectiveScrollBehavior);
  }

  const {
    x: appFrameX,
    y: appFrameY,
    width: appWidth,
  } = cypressAppFrame.getBoundingClientRect();

  // When the window is too narrow in open mode the application iframe is getting transform: scale(0.x) style in order to fit window
  // This breaks the coordinates system of the whole tab, so we need to compensate the scale value.
  const appFrameScale = appWidth / cypressAppFrame.offsetWidth;

  const { x, y, width, height } = htmlElement.getBoundingClientRect();
  const [posX, posY] = getPositionedCoordinates(
    x,
    y,
    width,
    height,
    position ?? "center"
  );

  return {
    x: appFrameX + (window.pageXOffset + posX) * appFrameScale,
    y: appFrameY + (window.pageYOffset + posY) * appFrameScale,
  };
}

/**
 * Scrolls the given htmlElement into view on the page.
 * The position the element is scrolled to can be customized with scrollBehavior.
 */
function scrollIntoView(htmlElement: HTMLElement, scrollBehavior: ScrollBehaviorOptions) {
    let block: ScrollLogicalPosition = "center";

    if (scrollBehavior === "top") {
      block = "start";
    } else if (scrollBehavior === "bottom") {
      block = "end";
    }

    htmlElement.scrollIntoView({ block });
}
