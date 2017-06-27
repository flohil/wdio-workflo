//import functions from './functions'
//import registerSteps from './registerSteps'
import * as Functions from './lib/functions'
import * as wf from './index'

function safeAdd( context, key, obj ) {
  if ( key in context ) {
    throw new Error( `${key} is already defined within context` )
  } else {
    context[ key ] = obj
  }
}

function safeAddAll( context, objArr ) {
  for ( const obj of objArr ) {
    for ( const key of Object.keys( obj ) ) {
      safeAdd( context, key, obj[ key ] )
    }
  }
}

// injects workflo framework into global context
// config: workflo.conf.js config
function inject( config ) {
  const context:any = global

  // setup variables
  //safeAdd( context, 'steps', {} )
  
  safeAddAll(context, [ Functions ])

  /*console.log("REGISTERING STEPS")

  console.log("config: ", config)

  registerSteps( config.testDir )*/
}

inject({})

export { inject }