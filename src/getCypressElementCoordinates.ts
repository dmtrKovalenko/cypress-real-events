/**
 * Cypress Automation debuggee is the whole tab.
 * This function returns the element coordinates relative to the whole tab rot.
 * @param jqueryEl the element to introspect
 */
export function getCypressElementCoordinates(jqueryEl: JQuery) {
  const htmlElement = jqueryEl.get(0);
  const cypressAppFrame = window.parent.document.querySelector("iframe");

  if (!cypressAppFrame || !cypressAppFrame.id.includes("Your App")) {
    throw new Error(
      "Can not find cypress application iframe, it looks like critical issue. Please rise an issue on GitHub."
    );
  }

  const {
    x: appFrameX,
    y: appFrameY,
    width: appWidth,
  } = cypressAppFrame.getBoundingClientRect();

  // When the window is too narrow in open mode the application iframe is getting transform: scale(0.x) style in order to fit window
  // This breaks the coordinates system of the whole tab, so we need to compensate the scale value.
  const appFrameScale = appWidth / cypressAppFrame.offsetWidth;

  htmlElement.scrollIntoView({ block: "center" });
  const { x, y, width, height } = htmlElement.getBoundingClientRect();

  return {
    x: appFrameX + (x + window.pageXOffset + width / 2) * appFrameScale,
    y: appFrameY + (y + window.pageYOffset + height / 2) * appFrameScale,
  };
}
