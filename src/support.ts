import { realClick } from "./commands/realClick";
import { realHover } from "./commands/realHover";
import { realSwipe } from "./commands/realSwipe";
import { realPress } from "./commands/realPress";
import { realType } from "./commands/realType";
import { realTouch } from './commands/realTouch';
import { mouseDown } from "./commands/mouseDown";
import { mouseUp } from "./commands/mouseUp";

Cypress.Commands.add("realClick", { prevSubject: true }, realClick);
Cypress.Commands.add("realHover", { prevSubject: true }, realHover);
Cypress.Commands.add("realTouch", { prevSubject: true }, realTouch);
Cypress.Commands.add("realSwipe", { prevSubject: true }, realSwipe);
Cypress.Commands.add("realPress", realPress);
Cypress.Commands.add("realType", realType);
Cypress.Commands.add("mouseDown", { prevSubject: true }, mouseDown);
Cypress.Commands.add("mouseUp", { prevSubject: true }, mouseUp);
