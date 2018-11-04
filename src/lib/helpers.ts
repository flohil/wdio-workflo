export function tolerancesObjectToString(actuals: Object, tolerances?: Object) {
  var str = '{';
  var props = []

  for (var p in actuals) {
    if (actuals.hasOwnProperty(p)) {
      const actual = actuals[p]
      let actualStr = ''

      if (tolerances && tolerances[p] !== 0) {
        const tolerance = Math.abs(tolerances[p])

        actualStr = `[${Math.max(actual - tolerance, 0)}, ${Math.max(actual + tolerance, 0)}]`
      } else {
        actualStr = `${actual}`
      }

      props.push(`${p}: ${actualStr}`)
    }
  }

  str += props.join(', ')

  return str + '}';
}