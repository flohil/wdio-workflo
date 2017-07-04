describe('DuckDuckGo search', () => {

  it('its alright', () => {

    process.send({event: 'step:start', cid: '0-0', title: `steppy`})

    const title = 'hello'

    /*expect(true).toBe(true)

    expect(title).toEqual('DuckDuckGoasdf')*/

    console.log("other failed stuff")

    process.send({event: 'step:end', cid: '0-0'})
  })

  /*it('passing step', () => {

    process.send({event: 'test:meta', cid: '0-0', description: 'Flos super beschreibung'})
    process.send({event: 'test:meta', cid: '0-0', severity: 'blocker'})
    process.send({event: 'test:meta', cid: '0-0', feature: 'Flos Feature'})
    process.send({event: 'test:meta', cid: '0-0', story: 'Flos Story'})
    process.send({event: 'test:meta', cid: '0-0', issue: [ 'http://hq.documatrix.com/jira/browse/KBCPP-1673', 'http://hq.documatrix.com/jira/browse/KBCPP-1516' ]})
    process.send({event: 'test:meta', cid: '0-0', environment: {flo: 'Flos Umgebung'}})
    process.send({event: 'test:meta', cid: '0-0', argument: {test: 'super test', other: 'super other'}})

    process.send({event: 'step:start', cid: '0-0', title: 'navigate to url'})

    browser.url('https://duckduckgo.com/')
    expect(browser.getUrl()).toEqual('https://duckduckgo.com/')

    myTestFunc()

    process.send({event: 'step:end', cid: '0-0'})


    process.send({event: 'step:start', cid: '0-0', title: 'get title of homepage'})

    browser.setValue('#search_form_input_homepage', 'WebdriverIO')
    browser.click('#search_button_homepage')
    const title = browser.getTitle()

    expect(title).toEqual('WebdriverIO at DuckDuckGo')

    process.send({event: 'step:end', cid: '0-0'})
  })*/

  /*it('failing step', () => {
    process.send({event: 'step:start', cid: '0-0', title: 'failing step'})

    browser.url('https://duckduckgo.com/')
    browser.setValue('#search_form_input_homepage', 'WebdriverIO')
    browser.click('#search_button_homepage')
    const failingTitle = browser.getTitle()
    
    expect(failingTitle).toEqual('asdfasdf')
    
    process.send({event: 'step:end', cid: '0-0', status: 'failed'})

  })

  it('broken step', () => {

    process.send({event: 'step:start', cid: '0-0', title: 'broken step'})

    browser.url('https://duckduckgo.com/')
    browser.setValue('#search_form_input_homepage', 'WebdriverIO')
    browser.click('#search_button_homepagesss')
   
    process.send({event: 'step:end', cid: '0-0', failed: 'broken'})
  })*/
})