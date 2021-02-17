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

export type ScrollBehaviorOptions = 'center' | 'top' | 'bottom' | 'nearest';

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

  // @ts-expect-error 'scrollBehavior' is undefined in Cypress < 6.1 
  const effectiveScrollBehavior = (scrollBehavior ?? Cypress.config('scrollBehavior') ?? "center") as ScrollBehaviorOptions;
  if (effectiveScrollBehavior && typeof effectiveScrollBehavior !== 'object') {
    scrollIntoView(htmlElement, effectiveScrollBehavior);
  }

  const { x, y, width, height } = getElementPositionXY(htmlElement);
  const [posX, posY] = getPositionedCoordinates(
    x,
    y,
    width,
    height,
    position ?? "center"
  );

  return {
    x: posX,
    y: posY,
  };
}

/**
 * Scrolls the given htmlElement into view on the page.
 * The position the element is scrolled to can be customized with scrollBehavior.
 */
function scrollIntoView(htmlElement: HTMLElement, scrollBehavior: ScrollBehaviorOptions = 'center') {
    let block: ScrollLogicalPosition;

    if (scrollBehavior === "top") {
      block = "start";
    } else if (scrollBehavior === "bottom") {
      block = "end";
    } else {
      block = scrollBehavior;
    }

    htmlElement.scrollIntoView({ block });
}

/**
 * Returns the coordinates and size of a given Element, relative to the Cypress app <iframe>.
 * Accounts for any scaling on the iframes.
 */
function getElementPositionXY(htmlElement: HTMLElement) {
  const {
    x: elementX,
    y: elementY,
    width,
    height,
  }= htmlElement.getBoundingClientRect();

  const iframes = getContainingFrames(htmlElement) as HTMLElement[];

  let frameScale = 1;
  let finalX = 0;
  let finalY = 0;

  for (const frame of iframes) {
    const { x, y, width } = frame.getBoundingClientRect();

    finalX += x * frameScale;
    finalY += y * frameScale;

    frameScale = frameScale * (width / frame.offsetWidth);
  }

  finalX += elementX * frameScale;
  finalY += elementY * frameScale;

  return {
    x: finalX,
    y: finalY,
    width: width * frameScale,
    height: height * frameScale,
  };
}

function getContainingFrames(element: HTMLElement) {
  const iframes = [];

  let currentWindow: Window | null = element.ownerDocument.defaultView;
  while (currentWindow && currentWindow.frameElement && currentWindow !== window) {
    const frame = currentWindow.frameElement as HTMLElement;
    iframes.unshift(frame);

    currentWindow = currentWindow.parent;
  }

  if (currentWindow) {
    iframes.unshift(window.parent.document.querySelector('iframe')); // The Cypress app frame
  }

  return iframes;
}
