import { $database } from '@/plugins/firebase'
import { firebaseAction, vuexfireMutations } from 'vuexfire'
import { objectToList } from '@/utils/objectToList'

export default {
  namespaced: true,
  state: {
    requestsObj: {},
    requestsList: [],

    live_request_obj: {},
    live_couriers_obj: {},

    couriersObj: {},
    couriersList: [],

    employeesObj: {},
    employeesList: [],

    system: {}
  },

  mutations: {
    ...vuexfireMutations,
    SET_REQUESTS_LIST (state) {
      $database('/postedParcels').once('value')
        .then(snap => {
          state.requestsList = objectToList(snap.val())
        })
    },
    SET_REQUESTS_OBJ (state) {
      $database('/postedParcels').once('value')
        .then(snap => {
          state.requestsObj = snap.val()
        })
    },
    SET_COURIER_LIST (state) {
      $database('/couriers').once('value')
        .then(snap => {
          state.couriersList = objectToList(snap.val())
        })
    },
    SET_COURIER_OBJ (state) {
      $database('/couriers').once('value')
        .then(snap => {
          state.couriersObj = snap.val()
        })
    }
  },
  actions: {
    setEmployeesObj: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef('employeesObj', $database('/employees'))
    }),
    setEmployeesList: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef('employeesList', $database('/employees'))
    }),
    setSystemParam: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef('system', $database('/sysConf'))
    }),
    setLiveRequestObj: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef('live_request_obj', $database('/postedParcels'))
    }),
    setLiveCouriersObj: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef('live_couriers_obj', $database('/couriers'))
    }),
    setDatabase ({ commit }) {
      ['SET_REQUESTS_LIST', 'SET_REQUESTS_OBJ', 'SET_COURIER_LIST', 'SET_COURIER_OBJ'].forEach($ => {
        commit($)
      })
    }
  }
}
