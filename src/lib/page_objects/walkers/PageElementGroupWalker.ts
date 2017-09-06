import * as _ from 'lodash'
import { PageElement, IPageElementOpts, PageElementMap, PageElementList, PageElementGroup } from '../page_elements'
import { PageElementStore } from '../stores'

export interface IPageElementGroupWalkerOpts {

}

// Solves a problem on all nodes inside a context recursively.
export class PageElementGroupWalker<Store extends PageElementStore> {
 
  constructor(options: IPageElementGroupWalkerOpts) {
    
  }

  // This function traverses a Group and performs a function
  // on each walked node.
  //
  // __walkGroup must be passed a problem object, which consists 
  // of a solve function and a values object.
  // For more details on the problem object, see 
  // page_objects/core/page_elements/ElementGroup.
  //
  // The optional options object can be used to parameterize the 
  // walker's behavior. 
  //
  // If options.throwUnmachtedKeys is set to true,
  // an error will be thrown if a key of the problem.values object
  // did not match any node in the walked group.
  // Default: true
  // If options.throwSolveError is set to true, the walker will throw
  // any errors happening in the solve function.
  // If options.throwSolveError is set to false, the walker will not
  // throw errors happening in the solve function and write them
  // into the result object instead.
  // Default: true
  
  walk<ValueType, ResultType>( 
    problem: Workflo.IProblem<ValueType, ResultType>, 
    content: Record<string, Workflo.PageNode.INode>, 
    options: Workflo.IWalkerOptions = { throwUnmatchedKey: true, throwSolveError: true } 
  ) : Workflo.IRecObj<ResultType> {

    const results: Workflo.IRecObj<ResultType> = Object.create(Object.prototype)

    let walkNodes = {}
    
    // if values are defined, strip all content that is not inside values
    if (typeof problem.values !== 'undefined') {
        for (const key in problem.values) {
            if (problem.values.hasOwnProperty(key)) {
                if (content.hasOwnProperty(key)) {
                    walkNodes[key] = content[key]
                } else if (options.throwUnmatchedKey) {
                    throw new Error(`Key ${key} did not match any node name in group context: ${JSON.stringify(
                        content,
                        function(k, v) { if (v === undefined) { return null; } return v; }
                    )}`);
                }
            }
        }
    } else {
        walkNodes = content
    }

    // solve problem only for nodes which support operation
    // in case of lists or groups -> dont add result if no child
    // element node supported operation

    // execute problem on each node in group
    for (const key in walkNodes) {
      const node = content[key]

      const values = (problem.values) ? 
        problem.values[key] : 
        undefined

      if (node instanceof PageElement) {
        const solveResults = this.solveElement(
          problem, node, values, options 
        )

        if (solveResults.nodeSupported) {
          results[key] = solveResults.result
        }
      } else if (node instanceof PageElementMap) {
        const solveResults = this.solveMap(
          problem, node, <Record<string, ValueType>> values, options 
        )

        if (Object.keys(solveResults).length > 0) {
          results[key] = solveResults
        }
      } else if (node instanceof PageElementList) {
        const solveResults = this.solveList(
          problem, node, <Record<string, ValueType>> values, options 
        )

        if (Object.keys(solveResults).length > 0) {
          results[key] = solveResults
        }
      } else if (node instanceof PageElementGroup) {
        const solveResults = this.solveGroup(
          problem, node, <Record<string, ValueType>> values, options 
        )

        if (Object.keys(solveResults).length > 0) {
          results[key] = solveResults
        }
      } else {
        throw new Error( `Unknown Element Type: ${node.constructor.name}` )
      }                     
    }

    return results
  }

  // Solves a problem for a single page element, 
  // passing value as a parameter to solve the problem.
  // Returns the problem's solution as a result.
  //
  // If throwSolveError is true, function will throw 
  // any errors occuring during the problem solution.
  // If throwSolverError is false, any errors occuring
  // during the problem solution will be written into the
  // returned result.
  protected solveElement<ValueType, ResultType>( 
    problem: Workflo.IProblem<ValueType, ResultType>,
    element: Workflo.PageNode.INode, 
    value: ValueType, 
    options: Workflo.IWalkerOptions 
  ) : Workflo.ISolveResult<ResultType> {
    try {
      return problem.solve( element, value )
    } catch ( error ) {
      if ( options.throwSolveError ) {
        throw error
      } else {
        return {
          nodeSupported: true,
          result: error
        }
      }
    }
  }

  // Solves a problem on a subgroup.
  protected solveGroup<ValueType, ResultType>( 
    problem: Workflo.IProblem<ValueType, ResultType>,
    group: PageElementGroup<
      Store,
      Record<string, Workflo.PageNode.INode>,
      this,
      IPageElementGroupWalkerOpts
    >, 
    values: Record<string, ValueType>, 
    options: Workflo.IWalkerOptions
  ) : Workflo.IRecObj<ResultType> {
    // change context of problem's values to match subgroup
    problem.values = values

    return group.Solve( problem, options )
  }

  // Solves a problem for a list of page elements. 
  // Works only if identifier is set on list of elements.
  // Returns on object with the keys taken form identifiedObject 
  // and values taken form solved function.
  protected solveList<ValueType, ResultType>( 
    problem: Workflo.IProblem<ValueType, ResultType>,
    list: PageElementList<PageElementStore, PageElement<Store>, IPageElementOpts<Store>>, 
    values: Record<string, ValueType>, 
    options: Workflo.IWalkerOptions 
  ) : Record<string, ResultType> {

    const results: Record<string, ResultType> = Object.create(Object.prototype)

    const identifiedObject = list.identify()

    if (typeof list.identify() === 'undefined') {
      throw new Error(`Walker could not identify list ${list.__getNodeId()}: Please set a list identifier before calling a group function!`)
    }

    if ( values && typeof values === 'object' ) { // if e.g. values for SetValue are defined
      for ( const key in values ) {
        if (!identifiedObject.hasOwnProperty(key) || typeof identifiedObject[key] === 'undefined') {
          if (options.throwUnmatchedKey) {
            throw new Error(`Key '${key}' did not match any element in list identifier: ${JSON.stringify(
              identifiedObject,
              function(k, v) { if (v === undefined) { return null; } return v; }
            )}`)
          }
        } else {
          this.writeNodeResult(results, key, problem, identifiedObject[key], values[key], options)
        }
      }
    } else { // e.g. for GetText -> values are undefined
      for ( const key in identifiedObject ) {
        this.writeNodeResult(results, key, problem, identifiedObject[key], undefined, options)
      }
    }

    return results
  }

  // Solves a problem for a map of page elements. 
  // Returns an object with the keys taken form the element map 
  // and values taken from the solved function.
  protected solveMap<ValueType, ResultType, K extends string>( 
    problem: Workflo.IProblem<ValueType, ResultType>,
    map: PageElementMap<PageElementStore, K, PageElement<Store>, IPageElementOpts<Store>>, 
    values: Record<K, ValueType>,
    options: Workflo.IWalkerOptions 
  ) : Record<K, ResultType> {

    const results: Record<K, ResultType> = Object.create(Object.prototype)

    if ( values  && typeof values === 'object' ) { // if e.g. values for SetValue are defined
      for ( const key in values ) {
        if (!map.$.hasOwnProperty(key)) {
          if (options.throwUnmatchedKey) {
            throw new Error(`Key ${key} did not match any element in map: ${JSON.stringify(
              map.$,
              function(k, v) { if (v === undefined) { return null; } return v; }
            )}`)
          }
        } else {
          this.writeNodeResult(results, key, problem, map.$[key], values[key], options)
        }
      }
    } else { // e.gg for GetText -> values are undefined
      for ( const key in map.$ ) {
        this.writeNodeResult(results, key, problem, map.$[key], undefined, options)
      }
    }

    return results
  }

  protected writeNodeResult<ValueType, ResultType, K extends string>(
    results: Record<K, ResultType>,
    key: K,
    problem: Workflo.IProblem<ValueType, ResultType>,
    node: Workflo.PageNode.INode, 
    value: ValueType, 
    options: Workflo.IWalkerOptions
   ) {
    const solveResults = this.solveElement(
      problem, node, value, options 
    )
  
    if (solveResults.nodeSupported) {
      results[key] = solveResults.result
    }
  }
}