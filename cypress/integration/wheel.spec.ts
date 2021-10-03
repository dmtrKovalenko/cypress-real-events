describe("cy.realMouseWheel", () => {

  it("scroll to find a day", () => {
    cy.visit("https://anvil.servicetitan.com/components/date-picker/")

    const input = () => cy.get(".Card.CodeDemo").eq(1).find("input");
    input().click();


    const findDate = (dayStr: string): void => {
      let found = false;
      const scrollToMonthYear = (): void => {
        const content = () => cy.get(".k-widget.k-calendar.k-calendar-infinite");
        content()
        .realMouseWheel({ scrollBehavior: false, position: "center", deltaY: -500 })

        cy.wait(3);

        content().find(".k-calendar-tr [title]").then(($titles) => {
          for(let i=0; i<$titles.length; i++) {
            const match = $titles[i].getAttribute("title").match(new RegExp(dayStr));
            if (match && found === false) {
              found = true;
              cy.wrap($titles[i]).click();
              break;
            }
          }
          if (found === false) {
            scrollToMonthYear();
          }
        });
      };
      scrollToMonthYear();
    };

    findDate("June 18, 2019");
    input().should("have.value", "06/18/2019")

  });
});