---
id: debugging
title: Debugging
sidebar_label: Debugging
---

If you want to debug your tests, you can choose from two available options:

- Webdriverio's `browser.debug()` command
- Debugging in Chrome DevTools

## Webdriverio's `browser.debug()` command
If you simply want to inspect the current state of the browser window in which your tests are executed,
you can put the `browser.debug()` command somewhere inside a testcase or step.

This will pause your tests and your commandline interface will switch into a REPL mode that allows you to interact with the tested application via webdriverio commands.

Running the command `.exit` in your CLI will exit the breakpoint and continue the test run.

## Debugging in Chrome DevTools
In order to be able to debug your tests using the Chrome DevTools, the following preconditions need to be met:

- Google's chrome browser needs to be installed on your system.
- The chrome extension "NIM (Node-Inspector Manager)" needs to be added to and enabled in your chrome browser.
- The "debug" property of wdio-workflo's configuration object in "workflo.conf.ts" needs to be set to true or you need
to invoke your tests with the --debug cli option enabled: `./node_modules/.bin/wdio-workflo --debug`
- You need to open a browser window in chrome before you start your tests (so that Node-Inspector Manager can hook itself into the Chrome DevTools).
- The "NIM" extension needs to be configured correctly. Further below you can find a list of recommended NIM settings.

Now placing a `debugger` statement somewhere in your code will pause your tests and enter a breakpoint in Chrome DevTools. You can switch to the Chrome DevTools window and step through your test code, observe the state of variables etc. or you can switch to the browser window in which your tests are run and inspect the state of the tested
application.

*Sometimes tests might get stuck after entering a `debugger` statement. In this case, closing all chrome processes,
opening a new chrome window, switching "Open DevTools" in NIM's Main Menu to "Manual" and then back to "Auto" and finally restarting your tests should resolve the problem.*

These are the recommended settings for the "NIM" chrome extension:

(Main Menu)
- Host: "localhost"
- Port: "9229"
- Open DevTools: "Auto"

(General Options Menu)
- Open in a New Window: "On"
- Make Window Focused: "On"
- Close Automatically: "On"
- Select DevTools Version: "On" -> DevTools Version (default)
- Real-time Collaboration: "Off"
- check Interval: 0.50 secondes

The General Options Menu can be opened by hovering over the little circle in the right bottom of the Main Menu and then clicking on the "sliders" icon.
