//import { when, given, verify } from './testcase'
import steps from '../steps'

import { IUser, ICredentials } from '../types'

let adminCredentials: ICredentials = {username: "admin", password: "password"};

suite("My second suite", {}, () => {
  
  testcase("bla test", {}, () => {
    given(steps["login as %{username}"]({arg: adminCredentials}))
    .and(steps["logout"]({}))
    .when(steps["variable vars"]({ arg: {arg1: 44, arg2: "asdf"}, cb: () => {

      const title = browser.getTitle()

      verify({"1.1.5": [1]}, (expected = 1, actual = 3) => {
        expect(actual).toBe(expected)
      })
    }}))
  })
})