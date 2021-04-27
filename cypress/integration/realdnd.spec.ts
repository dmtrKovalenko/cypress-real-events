describe("cy.realDnd", () => {
  beforeEach(() => {
    cy.visit("https://csb-q3r9e-l9d9gloe1.vercel.app/")
  })


  it("can drag and drop", () => {
    cy.get("div[draggable=true]").realDnd(':nth-child(43) > [style="position: relative; width: 100%; height: 100%;"] > div')
  })
})