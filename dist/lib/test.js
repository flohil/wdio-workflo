// function Feature(description: string, object: Object, bodyFunc: () => any) {
//   return bodyFunc()
// }
// function Story(id: string, description: string, object: Object, bodyFunc: () => any) {
//   return bodyFunc()
// }
// function Given(description: string, bodyFunc: () => any) {
//   return bodyFunc()
// }
// function When(description: string, bodyFunc: () => any) {
//   return bodyFunc()
// }
// function Then(id: number, description: string) {
// }
Feature("Homepage", { featureProp: 1 }, () => {
    Story("1.1", "Display correct title", { severity: "blocker" /* blocker */ }, () => {
        Given("a user opens the google homepage", () => {
            When("the user observes the page title", () => {
                const a = 1;
                const b = 2;
                if (a == b) {
                }
                Then(1, "the correct page title should be displayed");
            });
        });
    });
    // Story("1.2", "Failing story", {}, () => {
    //   Given("a user opens the google homepage", () => {
    //     When("the user observes the page title", () => {
    //       Then(1, "This spec fails")
    //       Then(2, "This spec fails bla")
    //     })
    //   })
    // })
    // Story("2.2", "last failing story", {}, () => {
    //   Given("a user opens the google homepage", () => {
    //     When("the user observes the page title", () => {
    //       Then(1, "This spec fails too")
    //     })
    //   })
    // })
    // Story("4.4", "Another story", {}, () => {
    //   Given("a user opens the google homepage", () => {
    //     When("the user observes the page title", () => {
    //       Then(1, "the correct page title should be displayed")
    //     })
    //   })
    // })
    // Story("5.5", "Manual story", {}, () => {
    //   Given("a user opens the google homepage", () => {
    //     When("the user manually does something successfully", () => {
    //       Then(1, "the manual test case succeeds")
    //     })
    //     When("the user manually does something unsuccessfully", () => {
    //       Then(2, "the manual test case fails")
    //     })
    //   })
    // })
});
//# sourceMappingURL=test.js.map