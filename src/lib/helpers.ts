export function tolerancesToString(values, tolerances?) {
  var str = '{';
  var props = []

  if (typeof values !== 'object' && typeof values !== 'undefined') {
    if (typeof tolerances === 'undefined') {
      return values
    } else {
      const tolerance = Math.abs(tolerances)

      return `[${Math.max(values - tolerance, 0)}, ${Math.max(values + tolerance, 0)}]`
    }
  }

  for (var p in values) {
    if (values.hasOwnProperty(p)) {
      const value = values[p]
      let valueStr = ''

      if (tolerances && typeof tolerances[p] !== 'undefined' && tolerances[p] !== 0) {
        const tolerance = Math.abs(tolerances[p])

        valueStr = `[${Math.max(value - tolerance, 0)}, ${Math.max(value + tolerance, 0)}]`
      } else {
        valueStr = `${value}`
      }

      props.push(`${p}: ${valueStr}`)
    }
  }

  str += props.join(', ')

  return str + '}';
}

export function isNullOrUndefined(value: any) {
  return value === null || typeof value === 'undefined'
}

export function notIsNullOrUndefined(value: any) {
  return value !== null || typeof value !== 'undefined'
}

export function isEmpty(value: any) {
  if (typeof value === 'string') {
    return value.length === 0
  }

  return isNullOrUndefined(value)
}

export function applyMixins(derivedCtor: any, baseCtors: any[], mergeObjectKeys: string[] = []) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      try {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      } catch ( error ) {
        if ( error.message.includes('which has only a getter') ) {
          const baseValue = baseCtor.prototype[name]
          const derivedValue = derivedCtor.prototype[name]

          let result = undefined

          if (
            (typeof baseValue === 'object' && typeof derivedValue === 'object') && mergeObjectKeys.indexOf(name) >= 0
          ) {
            result = {...baseValue, ...derivedValue}
          } else {
            result = baseValue
          }

          Object.defineProperty(derivedCtor.prototype, name, {
            get: function () {
              return result
            }
          });
        } else {
          throw error
        }
      }
    });
  });
}