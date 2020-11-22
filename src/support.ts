import { realClick } from "./commands/realClick";
import { realHover } from "./commands/realHover";

Cypress.Commands.add("realClick", { prevSubject: true }, realClick);
Cypress.Commands.add("realHover", { prevSubject: true }, realHover);
