import { map } from 'lodash'

const objectToList = obj => {
  return map(Object.keys(obj), $ => {
    let clone = obj[$]
    clone['.key'] = $

    return clone
  })
}

export { objectToList }
