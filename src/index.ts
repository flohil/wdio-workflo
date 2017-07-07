// global should be replaced with declare ... at some point...
declare global {

  namespace Workflo {

    // finish when needed
    /*interface Object {
      mapToObject: (input: Workflo.Object, mapFunc: Function) => Workflo.Object
      convertToObject: (input: Workflo.Object, valueFunc: any, options: any) => Workflo.Object
      mapProperties: (input: Object, )
    }*/

    namespace Object {

      /**
       * Iterates over all properties in an object and executes
       * func on each.
       * 
       * Returns a new object with the same keys as the input
       * object and the values as result of the func.
       * 
       * @param input 
       * @param func 
       */
      function mapProperties(input: Object, func: (value: any, key: string) => Object): {}
      
      /**
       * Iterates over all properties in an object and executes func on each.
       * @param input 
       * @param func 
       */
      function forEachProperty(input: Object, func: (key: string, value: any) => void): void
      
      /**
       * Returns a new object with the original object's keys and values inverted.
       * 
       * @param obj 
       */
      function invert(obj: Object): Object

      /**
       * Returns a filtered object that only contains those
       * properties of the initial object where func returned true.
       * 
       * @param obj 
       * @param func 
       */
      function filter(obj: Object, func: (value: any, key: string) => boolean): {}
      
      /**
       * If key already exists in obj, turns respective value
       * into array and pushes value onto the array.
       * Else, adds "normal" key-value pair as property.
       * If overwrite is true, always overwrites existing value
       * with new value without turning into array.
       *
       * @param obj 
       * @param key 
       * @param value 
       * @param overwrite 
       */
      function addToProps(obj: Object, key: string, value: any, overwrite?: boolean): void
      
      /**
       * Creates a copy of original object in which all
       * key-value pairs matching the passed props are removed.
       *
       * @param obj
       * @param props
       */
      function stripProps(obj: Object, props: string[]): Object

      /**
       * Creates a copy of original object in which all
       * properties with negative values are removed recursively.
       * 
       * @param obj 
       */
      function stripNegatives(obj: Object): Object

      /**
       * Returns properties of obj whose keys are also present in 
       * subsetObj as a new object.
       * 
       * @param obj 
       * @param matchingObject 
       */
      function subset(obj: Object, matchingObject: Object): Object
    }

    namespace Array {
      /**
       * Gets an input array and maps it to an object where
       * the property keys correspond to the array elements
       * and the property values are defiend by mapFunc.
       * 
       * @param input 
       * @param mapFunc 
       */
      function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
        [key: string]: T;
      }
    }

    namespace String {
      /**
       * Splits a string at delim and returns an object with the
       * split string parts as keys and the values set to true.
       * 
       * @param str 
       * @param delim 
       */
      function splitToObj(str: string, delim: string | RegExp): Object
    }

    namespace Class {
      /**
       * Returns names of all methods of a ES6 class (except for constructor).
       * 
       * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
       * 
       * @param obj 
       */
      function getAllMethods(obj: any): string[]
    }

    namespace Util {

      /**
       * Converts strings, arrays and objects into objects.
       * valueFunc will be used to determine the object's 
       * property values and can be either a func or a value.
       * valueFunc gets passed the array element or string as
       * value.
       * If switchKeyValue is true, the keys and values of the
       * resulting object will be switched.
       * If stackValues is true, a value for an exiting key
       * will not be replaced by a new value but added to an
       * array of values for the concerned key.
       *
       * If input is object, output remains the same object.
       * If input is string, output is an object with one 
       * entry where the key is the string.
       * If input is array, output is an object where each key
       * represents one element in the array.
       * 
       * @param unknownTypedInput 
       * @param valueFunc 
       * @param options 
       */
      export function convertToObject(unknownTypedInput: any, valueFunc?: any, options?: {
        switchKeyValue: boolean;
        overwriteValues: boolean;
        stackValues: boolean;
      }): Object
    }

    type StepImpl = <I, O>(params: IStepArgs<I, O>) => IParameterizedStep

    type StepImplMap = { [key:string]: StepImpl }

    type severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'

    interface ISpecWhen {
      And: (description: string, bodyFunc: () => void) => ISpecWhen
    }

    interface ITCWhen {
      and: (step: IParameterizedStep) => ITCWhen
    }

    interface ITCGiven {
      and: (step: IParameterizedStep) => ITCGiven,
      when: (step: IParameterizedStep) => ITCWhen
    }

    interface IDescriptionStack {
      givens: string[]
      whens: string[] 
    }

    interface IStoryMetaData {
      issues?: string[],
      severity?: severity
    }

    interface IFeatureMetadata {
    }

    interface ISuiteMetadata {
    }

    interface ITestcaseMetadata {
    }

    interface IStoryMapEntry {
      descriptionStack: IDescriptionStack
      metadata: IStoryMetaData
      featureName: string,
      storyName: string
    }

    interface IExpectationBlock {
      testcaseName: string
      execute: () => void
      screenshot: any
    }

    type IVerifySpecObject = {
      [specId: string]: number | number[]
    }

    type IVerifyContainer = {
      specObj: IVerifySpecObject
    }
  }

  interface IStepArgs<I, O> {
      cb?: (out: O) => void,
      arg?: I,
      description?: string
    }

  interface IParameterizedStep{
    description: string,
    execute: (prefix?: string) => void
  }

  function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function fFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function xFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void
  function fStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void
  function xStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void

  function Given(description: string, bodyFunc: () => void) : void

  function When(description: string, bodyFunc: () => void) : Workflo.ISpecWhen

  function Then(id: number, description: string) : void
  function fThen(id: number, description: string) : void
  function xThen(id: number, description: string) : void

  function suite(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function fsuite(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function xsuite(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  function testcase(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function ftestcase(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function xtestcase(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  function given(step: IParameterizedStep) : Workflo.ITCGiven

  function verify(verifyObject: Workflo.IVerifySpecObject, func: (...args : any[]) => void) : void
}


/*declare module "workflo" {
    export = Workflo;
}*/

export * from './lib/steps'

import * as objectFunctions from './lib/utilityFunctions/object'
import * as arrayFunctions from './lib/utilityFunctions/array'
import * as classFunctions from './lib/utilityFunctions/class'
import * as stringFunctions from './lib/utilityFunctions/string'
import * as utilFunctions from './lib/utilityFunctions/util'

export { objectFunctions, arrayFunctions, classFunctions, stringFunctions }