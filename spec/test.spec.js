describe('DuckDuckGo search', () => {

  it('its alright', () => {

    const title = 'hello'

    expect(title).toEqual('DuckDuckGoasdf')

    console.log("other failed stuff")

    expect(title).toEqual('other stuff')
  })
})