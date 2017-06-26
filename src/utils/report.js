module.exports = {
  getDateTime: function() {
    const today = new Date()
    const yyyy = today.getFullYear()
    const MM = today.getMonth() + 1
    const dd = today.getDate()
    const HH = today.getHours()
    const mm = today.getMinutes()
    const ss = today.getSeconds()

    const padTwo = (num) => (num>9 ? '' : '0') + num


    const date = `${yyyy}-${padTwo(MM)}-${padTwo(dd)}`
    const time = `${padTwo(HH)}-${padTwo(mm)}-${padTwo(ss)}`

    return `${date}_${time}`
  }
}

