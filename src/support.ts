import { realClick } from "./commands/realClick";

Cypress.Commands.add("realClick", { prevSubject: true }, realClick);

