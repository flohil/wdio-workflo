//import functions from './functions'
//import registerSteps from './registerSteps'
import * as Functions from './api'
import * as objectFunctions from './utility_functions/object'
import * as arrayFunctions from './utility_functions/array'
import * as classFunctions from './utility_functions/class'
import * as stringFunctions from './utility_functions/string'
import * as utilFunctions from './utility_functions/util'
import {
  allMatchers,
  elementMatchers,
  expectElement,
  expectList,
  expectMap,
  expectGroup,
  listMatchers,
  valueAllMatchers,
} from './matchers'

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
    Class: {},
    Util: {}
  }

  safeAddAll(context.Workflo.Object, [objectFunctions])
  safeAddAll(context.Workflo.Array, [arrayFunctions])
  safeAddAll(context.Workflo.String, [stringFunctions])
  safeAddAll(context.Workflo.Class, [classFunctions])
  safeAddAll(context.Workflo.Util, [utilFunctions])

  context.expectElement = expectElement
  context.expectList = expectList
  context.expectMap = expectMap
  context.expectGroup = expectGroup
}

inject({})

beforeAll(() => {
  jasmine.addMatchers(elementMatchers)
  jasmine.addMatchers(listMatchers)
  jasmine.addMatchers(allMatchers)
  jasmine.addMatchers(valueAllMatchers)
})

export { inject }