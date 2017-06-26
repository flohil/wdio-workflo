import { ParameterizedStep } from '../../../'
import { IUser, ICredentials, User } from '../types'

const LoginSteps = {
   // params contains both the arguments to step function and the callback function which is passed the result from the step function
   // there is no need to manually invoke the callback function from within the step function
   "login as %{username}": (params: IStepArgs<ICredentials, User>) : IParameterizedStep => 
    new ParameterizedStep(params, (credentials: ICredentials) : User => {
      console.log("logging in")
      return new User(params.arg, 23)
    }),
    "login and logout as %{username}": (params: IStepArgs<ICredentials, void>): IParameterizedStep =>
    new ParameterizedStep(params, (credentials: ICredentials): void => {
      LoginSteps["login as %{username}"]({arg: params.arg, cb: (user: User) => {
        console.log("logged in as", user)
      }}).execute()
      //Steps["logout"]({}).execute()
    })
}

export default LoginSteps