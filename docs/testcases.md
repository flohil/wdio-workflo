---
id: testcases
title: Testcases
sidebar_label: Testcases
---

## Objective and Overview

Wdio-workflo's `testcase` function describe a sequence of states and state changes
in the GUI of your tested web application. From a user's perspective, testcases define all
interactions between a user and a system that take place in the context of a use case
to achieve a certain goal.

Similar to specs, testcases provide a `given` function to establish an initial state
and a `when` function to perform state changes. Unlike the `Given` and `When` functions
used within a `Story`, the `given` and `when` functions of a `testcase` expect a
`Step` function as parameter instead of a description written in natural language.

The main objective of a testcase is to validate the requirements of your tested application
which you formulated as stories and acceptance criteria in your spec files. To do so,
a testcase can invoke the `validate` function inside the `cb` callback function of each
`Step` to check the correctness of the GUI's state following the execution of a `Step`.

Related `testcase` functions are grouped together inside a `suite`.

## Location and Naming Convention

Testcase files are located in the `src/testcases` folder of your system test directory.
By convention, their filename always ends with `.tc.ts`.

## Example

In the [specs guide](specs.md), we defined some requirements for the registration form
of wdio-workflo's demo website.

Let us now write a testcase to validate the correct behavior of our application
if a user does not fill in all required form fields and tries to submit an incomplete registration!

In this case, an error message should be displayed which informs the
user that, in order for the registration process to succeed, all fields of the registration
form need to be filled in.

Let's call our testcase "submit incomplete registration". You can find its implementation
in the file `registration.tc.ts` located in the folder `src/testcases` of wdio-workflo-example
repository.

```typescript
import { pages } from '?/page_objects';
import { steps } from '?/steps';

suite("registration", {}, () => {
  testcase("submit incomplete registration", {}, () => {
    const formData: pages.RegistrationFormData = {
      username: 'johnDoe',
      email: 'john.doe@example.com',
      password: '1234',
    };
    const expectedFeedback = 'Please fill in all fields!';

    given(steps["open demo website"]())
    .and(steps["open page '%{page}'"]({
      args: { page: pages.registration }
    }))
    .when(steps["fill in registration form"]({
      args: { formData }
    }))
    .and(steps["submit registration form"]({
      cb: () => {
        validate({ "3.1": [2] }, () => {
          // server side validation - need to wait for feedback
          expectElement(pages.registration.feedbackField).toEventuallyHaveText(expectedFeedback);
        });
      }
    }));
  });
})
```

## Structure

As you can see from the example above, testcases are usually divided into two sections:

- The declaration and definition of all variables and input or expected data used during testcase execution
- The sequence of chained step invocations and validation callbacks

## Syntax

### suite

The `suite` function is used to group multiple related testcases together - e.g. all testcases
that validate the behavior of a website's registration process.

```typescript
suite("registration", {}, () => { /*your testcases go here*/ })
```

It has 3 parameters:

- The name of the suite which should be unique across all suites
- The metadata of the suite (reserved for future use - at the moment, this is always an empty object)
- The body function of the suite - you can define all related `testcase` functions within its scope

### testcase

The `testcase` function lets you define a testcase:

```typescript
testcase("submit incomplete registration", {}, () => { /*test data and sequence of steps*/ }
```

It has 3 parameters:

- The name of the testcase which should be unique within a suite
- The metadata of the testcase
- The body function of the testcase used to define test data and sequences of steps

#### Testcase metadata

You can define the following optional properties for the metadata parameter of a `testcase`
function:

- `severity` => How severe the implications of this testcases not passing would be
- `bugs` => If your testcase is affected by bugs which you track on e.g. JIRA, put the
bugs' JIRA keys here
- `testId` => If you manage your testcases in a test management system, put the managed test's key
here

### given

The `given` function is used to establish an initial state for your testcase:

```typescript
given(steps["open demo website"]())
```

It has 1 parameter:

- A `step` function which establishes the initial state of the testcase

*Please notice that the entries stored inside the `steps` object are step definitions
which are not the same as step functions. A step definition actually defines how
a step function should be created. Therefore, you need to execute a step definition
to receive a step function which can be passed to `given`. This is why we need to put parenthesis after our step definition: `steps["open demo website"]()`.*

To create a composite initial state, you can chain multiple `given` functions together
with the `and` function:

```typescript
given(steps["open demo website"]())
.and(steps["open page '%{page}'"]({
  args: { page: pages.registration }
}))
```



A step function always has one step parameter object.

If a step function requires you to define step arguments, you can pass them inside
the `args` property of the step function's single parameter object.

### when

The `when` function is

### validate

## Expectation Matchers

## Testcases in Test Reports