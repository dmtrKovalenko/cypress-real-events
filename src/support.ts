import { realClick } from "./commands/realClick";
import { realDnd } from "./commands/realDnd";
import { realHover } from "./commands/realHover";
import { realSwipe } from "./commands/realSwipe";
import { realPress } from "./commands/realPress";
import { realType } from "./commands/realType";
import { realTouch } from './commands/realTouch';

Cypress.Commands.add("realClick", { prevSubject: true }, realClick);
Cypress.Commands.add("realHover", { prevSubject: true }, realHover);
Cypress.Commands.add("realTouch", { prevSubject: true }, realTouch);
Cypress.Commands.add("realSwipe", { prevSubject: true }, realSwipe);
Cypress.Commands.add("realPress", realPress);
Cypress.Commands.add("realType", realType);
Cypress.Commands.add("realDndRaw", realDnd);
Cypress.Commands.add(
  "realDnd",
  { prevSubject: true },
  (subject, destination, opts) => {
    if (typeof destination === "string") {
      cy.get(destination).then((el) => {
        cy.realDndRaw(subject, el, opts);
      });
    } else {
      cy.realDndRaw(subject, destination, opts);
    }
  }
);
