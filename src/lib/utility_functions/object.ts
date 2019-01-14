import * as _ from 'lodash';

/**
 * Iterates over all properties in an object and executes
 * func on each.
 *
 * Returns a new object with the same keys as the input
 * object and the values as result of the func.
 *
 * @param obj an object for which a func should be executed on each property
 * @param func the function to be executed on each property of the passed object
 */
export function mapProperties<T, O, K extends string>(
  obj: Record<K, T>, func: (value: T, key?: K) => O,
) : Record<K, O> {
  if (_.isArray(obj)) {
    throw new Error(`Input must be an object: ${obj}`);
  } else {
    const resultObj: Record<K, O> = Object.create(Object.prototype);

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        resultObj[key] = func(obj[key], key);
      }
    }

    return resultObj;
  }
}

/**
 * Returns a new object with the original object's keys and values inverted.
 * The original object's values must therefore be implicitly convertable to type string.
 *
 * @param obj an object whose keys and values should be inverted
 */
export function invert<K extends string>(obj: Record<K, string>) : Record<string, K> {
  const new_obj: Record<string, K> = {};

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
}
