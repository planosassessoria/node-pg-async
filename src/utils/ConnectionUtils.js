const _ = require('lodash')

_.mixin({
  deeply: function(map) {
    return function(obj, fn) {
      return map(_.mapValues(obj, function(v) {
        return _.isPlainObject(v) ? _.deeply(map)(v, fn) : _.isArray(v) ? v.map(function(x) {
          return _.deeply(map)(x, fn);
        }) : v;
      }), fn);
    }
  },
})

const toCamelCase = row => _.mapKeys(row, (v, k) => _.camelCase(k))

const arrangeObject = (row, options) => {
  let optionsClone = Object.assign({}, options)
  let mappedValues = _.mapValues(optionsClone, (value, key) => {
    if(typeof value === 'object') {
      let ret = _.mapValues(value, (v, k) => {
        let prop = row[k]
        delete row[k]
        if(typeof value[k] === 'string' && value[k]) {
          value = Object.assign({ [value[k]]: 'aaa' }, value)
          delete value[k]
        }
        return typeof v === 'object' ? arrangeSubObject(row, v) : prop
      })
      return ret
    }
    let prop = row[key]
    delete row[key]
    return prop
  })
  // return Object.assign(row, arrangeKeys(mappedValues, options))
  mappedValues = arrangeKeys(mappedValues, options)
  return Object.assign(row, mappedValues)
  // return arrangeKeys(Object.assign(row, mappedValues), options)
}

const arrangeSubObject = (row, object) => {
  let ret = _.mapValues(object, (value, key) => {
    let prop = row[key]
    delete row[key]
    return typeof value === 'object' ? arrangeSubObject(row, value) : prop
  })
  return ret
}

const arrangeKeys = (object, options) => {
  let keysToChange = {}
  _.deeply(_.mapKeys)(options, (val, key) => {
    if(typeof val !== 'object') {
      if(val) {
        keysToChange = Object.assign({ [key]: val }, keysToChange)
      }
    }
    return key
  })

  return _.deeply(_.mapKeys)(object, (val, key) => {
    if(typeof val !== 'object') {
      return keysToChange[key] ? keysToChange[key] : key
    }
    return key
  })
}

module.exports = {
  toCamelCase,
  arrangeObject
}
