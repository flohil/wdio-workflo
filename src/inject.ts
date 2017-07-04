//import functions from './functions'
//import registerSteps from './registerSteps'
import * as Functions from './lib/api'
import * as wf from './index'
import * as objectFunctions from './lib/utilityFunctions/object'
import * as arrayFunctions from './lib/utilityFunctions/array'
import * as classFunctions from './lib/utilityFunctions/class'
import * as stringFunctions from './lib/utilityFunctions/string'

function safeAdd( context, key, obj ) {
  if ( context.hasOwnProperty( key ) ) {
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
  
  safeAddAll(context, [Functions])

  context.Workflo = {
    Object: {},
    Array: {},
    String: {},
    Class: {}
  }

  safeAddAll(context.Workflo.Object, [objectFunctions])
  safeAddAll(context.Workflo.Array, [arrayFunctions])
  safeAddAll(context.Workflo.String, [stringFunctions])
  safeAddAll(context.Workflo.Class, [classFunctions])
}

inject({})

export { inject }