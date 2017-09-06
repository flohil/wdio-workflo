import * as pageObjects from './lib/page_objects'

// global should be replaced with declare ... at some point...
declare global {

  namespace Workflo {

    interface IRecObj<Type> {
      [key: string] : Type | IRecObj<Type>
    }

  // PAGE OBJECTS (to avoid undefined imports within core page elements)

    interface IPageElementStore 
    extends pageObjects.stores.PageElementStore {} 

    interface IPageElement<
      Store extends Workflo.IPageElementStore
    > extends pageObjects.elements.PageElement<
      Store
    > {}

    interface IPageElementOpts<
      Store extends Workflo.IPageElementStore
    > extends pageObjects.elements.IPageElementOpts<
      Store
    > {}

    interface IPageElementList<
      Store extends Workflo.IPageElementStore, 
      PageElementType extends Workflo.IPageElement<Store>, 
      PageElementOptions
    > extends pageObjects.elements.PageElementList<
      Store, 
      PageElementType, 
      PageElementOptions
    > {}

    interface IPageElementMap<
      Store extends Workflo.IPageElementStore,
      K extends string,
      PageElementType extends Workflo.IPageElement<Store>,
      PageElementOptions
    > extends pageObjects.elements.PageElementMap<
      Store,
      K,
      PageElementType, 
      PageElementOptions
    > {}

    interface IPageElementGroup<
      Store extends Workflo.IPageElementStore, 
      Content extends {[key: string] : Workflo.PageNode.INode}, 
      WalkerType extends Workflo.IPageElementGroupWalker<Store>, 
      WalkerOptions extends Workflo.IPageElementGroupWalkerOpts
    > extends pageObjects.elements.PageElementGroup<
      Store, 
      Content, 
      WalkerType, 
      WalkerOptions
    > {}

    interface IPageElementGroupWalker<
      Store extends Workflo.IPageElementStore
    > extends pageObjects.walkers.PageElementGroupWalker<
      Store
    > {}

    interface IPageElementGroupWalkerOpts 
    extends pageObjects.walkers.IPageElementGroupWalkerOpts {}

    interface WDIOParams {
      timeout?: number,
      reverse?: boolean
    }

    namespace PageNode {
      interface INode {
        __getNodeId(): string
      }

      interface IGetText extends INode {
        getText(): string
      }

      interface IGetValue extends INode {
        getValue(): string
      }

      interface ISetValue<T> extends INode {
        setValue(value: T): this
      }
    }

    interface IProblem<ValueType, ResultType> {
      values: IRecObj<ValueType>,
      solve: <NodeType extends Workflo.PageNode.INode>( 
        node: NodeType,
        value?: ValueType
      ) => ISolveResult<ResultType>
    }

    interface ISolveResult<ResultType>{
      nodeSupported: boolean,
      result?: ResultType
    }

    interface IWalkerOptions {
      throwUnmatchedKey?: boolean, 
      throwSolveError?: boolean 
    }

    const enum WaitType {
      exist = 'exist',
      visible = 'visible',
      value = 'value',
      text = 'text'
    }

    const enum IdentifyBy {
      text = 'text',
      value = 'value'
    }

    const enum Comparator {
      equalTo = '==',
      lessThen = '<',
      greaterThen = '>',
      notEqualTo = '!=',
      ne = '!=',
      eq = '==',
      lt = '<',
      gt = '>',
    }

    type XPath = pageObjects.builders.XPathBuilder | string

   // UTILITY FUNCTIONS

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
      export function mapProperties<T, O, K extends string>(input: Record<K, T>, func: (value: T, key?: string) => O): Record<K, O>;
      
      /**
       * Iterates over all properties in an object and executes func on each.
       *
       * @param input
       * @param func
       */
      export function forEachProperty<T, K extends string>(input: Record<K, T>, func: (value: T, key?: string) => void): Record<K, T>;
      
      /**
       * Returns a new object with the original object's keys and values inverted.
       * The original object's values must therefore be implicitly convertable to type string.
       *
       * @param obj
       */
      export function invert(obj: Record<string, string>): Record<string, string>;
      
      /**
       * Returns a new filtered object that only contains those
       * properties of the initial object where func returned true.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param func
       */
      export function filter<T>(obj: Record<string, T>, func: (value: T, key?: string) => boolean): Record<string, T>;
      
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
      export function addToProp<T, K extends string>(obj: Record<K, T | T[]>, key: string, value: T, overwrite?: boolean): Record<K, T | T[]>;
      
      /**
       * Creates a copy of original object in which all
       * key-value pairs matching the passed props are removed.
       *
       * @param obj
       * @param props
       */
      export function stripProps<T>(obj: Record<string, T>, props: string[]): Record<string, T>;
      
      /**
       * Returns properties of obj whose keys are also present in
       * subsetObj as a new object.
       *
       * Does not traverse nested objects!
       *
       * @param obj
       * @param matchingObject
       */
      export function subset<T, O>(obj: Record<string, T>, maskObject: Record<string, O>): Record<string, T>;
      
      /**
       * Returns a new object where all properties with a boolean value of false are stripped recursively.
       * @param obj
       */
      export function stripMaskDeep(obj: Workflo.IRecObj<boolean>): Workflo.IRecObj<boolean>;
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

      /**
       * Compares two variables of same type.
       * 
       * @param var1 
       * @param var2 
       * @param operator 
       */
      export function compare<Type>(var1: Type, var2: Type, operator: Workflo.Comparator): boolean;
    }

  // SPECS AND TESTCASES

    interface IManualTestcaseResults {
      [key: string] : {[key: number] : {
        result: boolean,
        date: string,
        comment?: string
      }}
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

  // API FUNCTIONS

  function getUid(id: string) : string

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

  function xpath(selector: string) : pageObjects.builders.XPathBuilder
}

export * from './lib/steps'

import * as objectFunctions from './lib/utility_functions/object'
import * as arrayFunctions from './lib/utility_functions/array'
import * as classFunctions from './lib/utility_functions/class'
import * as stringFunctions from './lib/utility_functions/string'
import * as utilFunctions from './lib/utility_functions/util'

export { objectFunctions, arrayFunctions, classFunctions, stringFunctions }

export { pageObjects }

import Kiwi from './lib/Kiwi'

export { Kiwi }