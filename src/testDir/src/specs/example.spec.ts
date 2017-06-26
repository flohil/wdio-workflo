Feature( 'Proposal Creation', {}, () => {
  Story( '7.0.1', 'Create a proposal', {issues: ['KBCPP-1234', 'KBCPP-1235']}, () => {
    Given("an administrator opens the proposals page", () => {      
      Given("the admin is older than 18", () => {
        When("the administrator hits the create proposal button", () => {
          Then( 1, "the created proposal should be displayed in the proposal manager table")
        }).And("the admin filters by today's date", () => {
          Then( 2, "only proposal\'s last edited today should be displayed")
        })
      })
      Given("the admin is younger than 18", () => {
        When("the admin hits the xxx logo", () => {
          Then( 3, "nothing should be displayed")
        })
      })
    })
  })
})