import { uniqWith, isEqual, compact } from 'lodash'

export default {
  namespaced: true,
  state: {
    order: {}
  },
  mutations: {
    SET_PARCEL_ORDER (state, payload) {
      state.order = {
        ...state.order,
        ...payload
      }
    },
    RESET_PARCEL_ORDER (state) {
      state.order = {}
    },
    REPLACE_ORDER (state, payload) {
      state.order[payload.courier][payload.date] = payload.items
    }
  },
  actions: {
    setParcelOrder ({ commit, state }, { courier, date, items }) {
      let obj = {}

      if (state.order[courier]) {
        if (state.order[courier][date]) {
          obj = {
            [courier]: {
              ...state.order[courier],
              [date]: [
                ...state.order[courier][date],
                ...items
              ]
            }
          }
        } else {
          obj[courier] = {
            ...state.order[courier],
            [date]: items
          }
        }
      } else {
        obj[courier] = {
          [date]: items
        }
      }
      for (const [k] of Object.entries(obj[courier])) {
        obj[courier][k] = uniqWith(obj[courier][k], isEqual)
        obj[courier][k] = compact(obj[courier][k])
      }
      commit('SET_PARCEL_ORDER', obj)
    },
    resetParcelOrder ({ commit }) {
      commit('RESET_PARCEL_ORDER')
    },
    replaceOrder ({ commit }, payload) {
      commit('REPLACE_ORDER', payload)
    }
  }
}
