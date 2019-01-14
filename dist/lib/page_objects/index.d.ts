import * as elements from './page_elements';
import * as pages from './pages';
import * as stores from './stores';
import * as builders from './builders';
/**
 * The default timeout value used in functions that operate with timeouts if no other timeout is
 * specified in workflo.conf.ts, in the PageNode itself or as a parameter passed to the function.
 */
export declare const DEFAULT_TIMEOUT = 5000;
/**
 * The default interval value used in functions that operate with intervals if no other interval is
 * specified in workflo.conf.ts, in the PageNode itself or as a parameter passed to the function.
 */
export declare const DEFAULT_INTERVAL = 500;
export { elements, pages, stores, builders, };
