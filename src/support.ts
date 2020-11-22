import { realClick } from "./commands/realClick";
import { realHover } from "./commands/realHover";
import { realPress } from "./commands/realPress";

Cypress.Commands.add("realClick", { prevSubject: true }, realClick);
Cypress.Commands.add("realHover", { prevSubject: true }, realHover);
Cypress.Commands.add("realPress", realPress);
