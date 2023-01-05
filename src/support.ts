import { realClick } from "./commands/realClick";
import { realHover } from "./commands/realHover";
import { realSwipe } from "./commands/realSwipe";
import { realPress } from "./commands/realPress";
import { realType } from "./commands/realType";
import { realTouch } from "./commands/realTouch";
import { realMouseDown } from "./commands/mouseDown";
import { realMouseUp } from "./commands/mouseUp";
import { realMouseMove } from "./commands/mouseMove";
import { realMouseWheel } from "./commands/mouseWheel";


// TODO fix this unsafe convertions. This happens because cypress does not allow anymore to return Promise for types, but allows for command which is pretty useful for current implementation.
Cypress.Commands.add(
  "realClick",
  { prevSubject: true },
  realClick as unknown as NormalizeCypressCommand<typeof realClick>
);

Cypress.Commands.add(
  "realHover",
  { prevSubject: true },
  realHover as unknown as NormalizeCypressCommand<typeof realHover>
);
Cypress.Commands.add(
  "realTouch",
  { prevSubject: true },
  realTouch as unknown as NormalizeCypressCommand<typeof realTouch>
);
Cypress.Commands.add(
  "realSwipe",
  { prevSubject: true },
  realSwipe as unknown as NormalizeCypressCommand<typeof realSwipe>
);
Cypress.Commands.add(
  "realPress",
  realPress as unknown as NormalizeNonSubjectCypressCommand<typeof realPress>
);
Cypress.Commands.add(
  "realType",
  realType as unknown as NormalizeNonSubjectCypressCommand<typeof realType>
);
Cypress.Commands.add(
  "realMouseDown",
  { prevSubject: true },
  realMouseDown as unknown as NormalizeCypressCommand<typeof realMouseDown>
);
Cypress.Commands.add(
  "realMouseUp",
  { prevSubject: true },
  realMouseUp as unknown as NormalizeCypressCommand<typeof realMouseUp>
);
Cypress.Commands.add(
  "realMouseMove",
  // @ts-expect-error HOW is it possible?!
  { prevSubject: true },
  realMouseMove as unknown as NormalizeCypressCommand<typeof realMouseMove>
);
Cypress.Commands.add(
  "realMouseWheel",
  { prevSubject: true },
  realMouseWheel as unknown as NormalizeCypressCommand<typeof realMouseWheel>
);