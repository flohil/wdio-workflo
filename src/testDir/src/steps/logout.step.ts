import { ParameterizedStep } from '../../../'

const LogoutSteps = {
   // write empty object so that user does not have to
   "logout": (params: IStepArgs<void, void>) : IParameterizedStep => 
    new ParameterizedStep(params, () : void => {
      console.log("logging out")
      /*browser.url('https://duckduckgo.com/')
      browser.setValue('#search_form_input_homepage', 'WebdriverIO')
      browser.click('#search_button_homepagesss')*/
    }),
    "variable vars": (params: IStepArgs<{arg1: number, arg2: string}, void>) : IParameterizedStep => 
    new ParameterizedStep(params, () : void => {
      console.log("variable vars:", params)
    })
}

export default LogoutSteps