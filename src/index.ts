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
      export function mapProperties<T, O, I extends {
          [key in keyof I]: T;
      }>(input: I, func: (value: T, key?: string) => O): {
          [key in keyof I]: O;
      }

      /**
       * Iterates over all properties in an object and executes func on each.
       *
       * @param input
       * @param func
       */
      export function forEachProperty<T, I extends {
          [key in keyof I]: T;
      }>(input: I, func: (value: T, key?: string) => void): I

      /**
       * Returns a new object with the original object's keys and values inverted.
       * The original object's values must therefore be implicitly convertable to type string.
       *
       * @param obj
       */
      export function invert(obj: {
          [key: string]: string;
      }): {
          [key: string]: string;
      }

      /**
       * Returns a new filtered object that only contains those
       * properties of the initial object where func returned true.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param func
       */
      export function filter<T>(obj: {
          [key: string]: T;
      }, func: (value: T, key?: string) => boolean): {
          [key: string]: T;
      }

      /**
       * If key already exists in obj, turns respective value
       * into array and pushes value onto the array.
       * Else, adds "normal" key-value pair as property.
       * If overwrite is true, always overwrites existing value
       * with new value without turning it into array.
       *
       * @param obj
       * @param key
       * @param value
       * @param overwrite
       */
      export function addToProp<T, I extends {
          [key in keyof I]: T | T[];
      }>(obj: I, key: string, value: T, overwrite?: boolean): {
          [key in keyof I]: T | T[];
      }

      /**
       * Creates a copy of original object in which all
       * key-value pairs matching the passed props are removed.
       *
       * @param obj
       * @param props
       */
      export function stripProps<T>(obj: {
          [key: string]: T;
      }, props: string[]): {
          [key: string]: T;
      }

      /**
       * Returns properties of obj whose keys are also present in
       * subsetObj as a new object.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param matchingObject
       */
      export function subset<T, O>(obj: {
          [key: string]: T;
      }, maskObject: {
          [key: string]: O;
      }): {
          [key: string]: T;
      }
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
      export function mapToObject<T>(input: string[], mapFunc: (element: string) => T): {
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
      export function splitToObj(str: string, delim: string | RegExp): {
          [part: string]: boolean;
      }

      /**
       * Removes all whitespace characters from a string.
       * 
       * @param str 
       */
      export function stripWhitespaces(str: string): string
    }

    namespace Class {
      /**
       * Returns names of all methods of a ES6 class (except for constructor).
       * 
       * see http://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
       * 
       * @param obj 
       */
      export function getAllMethods(obj: any): string[]
    }

    namespace Util {

      /**
       * Converts strings, arrays and objects into objects.
       *
       * If input is string, output is an object with one
       * entry where the key is the string.
       * If input is array, output is an object where each key
       * represents one element in the array.
       * If input is object, output is a clone of the input object.
       *
       * For strings and arrays, valueFunc is used to calculate the
       * resulting object's property values.
       * For objects, valueFunc has no effect -> original property values will be preserved!
       *
       * @param unknownTypedInput
       * @param valueFunc
       */
      export function convertToObject<T>(unknownTypedInput: {
          [key: string]: T;
      } | string[] | string, valueFunc?: (key: string) => T): {
          [key: string]: T;
      }
    }

    type StepImpl = <I, O>(params: IStepArgs<I, O>) => IParameterizedStep

    type StepImplMap = { [key:string]: StepImpl }

    type severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'

    interface ISpecGiven {
      And: (description: string, bodyFunc?: () => void) => ISpecGiven
    }

    interface ISpecWhen {
      And: (description: string, bodyFunc?: () => void) => ISpecWhen
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
      storyName: string,
      insideWhenSequence: boolean,
      whenSequenceLengths: number[],
      whenRecLevel: number,
      insideGivenSequence: boolean,
      givenSequenceLengths: number[],
      givenRecLevel: number
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

  interface IOptStepArgs<I, O> {
    cb?: (out: O) => void,
    arg?: I,
    description?: string
  }

  interface IStepArgs<I, O> extends IOptStepArgs<I, O> {
    arg: I,
  }

  interface IParameterizedStep{
    description: string,
    execute: (prefix?: string) => void
  }

  type MyPartial<T> = {
    [P in keyof T]?: T[P];
  }

  function Feature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function fFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void
  function xFeature(description: string, metadata: Workflo.IFeatureMetadata, bodyFunc: () => void) : void

  function Story(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void
  function fStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void
  function xStory(id: string, description: string, metadata: Workflo.IStoryMetaData, bodyFunc: () => void) : void

  function Given(description: string, bodyFunc?: () => void) : Workflo.ISpecGiven

  function When(description: string, bodyFunc?: () => void) : Workflo.ISpecWhen

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

import Kiwi from './lib/Kiwi'

export { Kiwi }