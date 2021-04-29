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

type ScrollBehaviorPosition = "center" | "top" | "bottom" | "nearest";
export type ScrollBehaviorOptions = ScrollBehaviorPosition | false;

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
 * Scrolls the given htmlElement into view on the page.
 * The position the element is scrolled to can be customized with scrollBehavior.
 */
function scrollIntoView(
  htmlElement: HTMLElement,
  scrollBehavior: ScrollBehaviorPosition = "center"
) {
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

// for cross origin domains .frameElement returns null so query using parentWindow
// but when running using --disable-web-security it will return the frame element
function getFrameElement(currentWindow: Window): HTMLElement {
  if (currentWindow.frameElement) {
    // accessible for same-origin iframes
    // or when running with --disable-web-security
    return currentWindow.frameElement as HTMLElement;
  }

  // fallback to querying using the parent window, mainly to grab the AUT iframe
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [...currentWindow.parent.document.querySelectorAll("iframe")].find(
    (iframe) => iframe.contentWindow === currentWindow
  )!;
}

function getIframesPositionShift(element: HTMLElement) {
  let currentWindow: Window | null = element.ownerDocument.defaultView;
  const noPositionShift = {
    frameScale: 1,
    frameX: 0,
    frameY: 0,
  };

  if (!currentWindow) {
    return noPositionShift;
  }

  // eslint-disable-next-line prefer-const
  const iframes = [];

  while (currentWindow !== window.top) {
    iframes.push(getFrameElement(currentWindow));
    currentWindow = currentWindow.parent;
  }

  return iframes.reduceRight(({ frameX, frameY, frameScale }, frame) => {
    const { x, y, width } = frame.getBoundingClientRect();

    return {
      frameX: frameX + x * frameScale,
      frameY: frameY + y * frameScale,
      frameScale: frameScale * (width / frame.offsetWidth),
    }
  }, noPositionShift)
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
  } = htmlElement.getBoundingClientRect();

  const { frameScale, frameX, frameY } = getIframesPositionShift(htmlElement);

  return {
    x: frameX + elementX * frameScale,
    y: frameY + elementY * frameScale,
    width: width * frameScale,
    height: height * frameScale,
  };
}

/**
 * Cypress Automation debugee is the whole tab.
 * This function returns the element coordinates relative to the whole tab rot.
 * @param jqueryEl the element to introspect
 */
export function getCypressElementCoordinates(
  jqueryEl: JQuery,
  position: Position | undefined,
  scrollBehavior?: ScrollBehaviorOptions
) {
  const htmlElement = jqueryEl.get(0);
  const cypressAppFrame = window.parent.document.querySelector("iframe");

  if (!cypressAppFrame || !cypressAppFrame.id.includes("Your App")) {
    throw new Error(
      "Can not find cypress application iframe, it looks like critical issue. Please rise an issue on GitHub."
    );
  }

  const effectiveScrollBehavior = (scrollBehavior ??
    Cypress.config("scrollBehavior") ??
    "center") as ScrollBehaviorOptions;
  if (effectiveScrollBehavior && typeof effectiveScrollBehavior !== "object") {
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
