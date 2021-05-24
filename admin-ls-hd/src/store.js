import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import database from './modules/database'
import parcelOrder from './modules/parcel-order'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    database,
    parcel_order: parcelOrder
  },
  state: {
    isConnectedToDB: undefined,
    user: null,
    loader: false,
    fullItemDetails: null,
    recommended: {
      pickUp: [],
      delivery: [],
      remittance: []
    },
    selectedCourier: {
      pickUp: null,
      delivery: null,
      remittance: null
    }
  },
  mutations: {
    ...vuexfireMutations,
    SET_SELECTED_COURIER (state, payload) {
      state.selectedCourier[payload.activity] = payload.courier
    },
    SET_FULL_ITEM_DETAILS (state, payload) {
      state.fullItemDetails = payload
    },
    SET_RECOMMENDED (state, payload) {
      state.recommended[payload.activity] = payload.items
    },
    LOADER (state, payload) {
      state.loader = payload
    },
    SET_USER (state, payload) {
      state.user = payload
    },
    PUSH_RECOMMENDED (state, payload) {
      state.recommended[payload.activity].push(payload)
    },
    RESET_RECOMMENDED (state, payload) {
      state.recommended[payload] = []
    },
    SET_DB_CONNECTION (state, payload) {
      state.isConnectedToDB = payload
    },
    RESET_SELECTED_COURIERS (state) {
      state.selectedCourier = {
        pickUp: null,
        delivery: null,
        remittance: null
      }
    }
  },
  actions: {
    setSelectedCourier ({ commit }, payload) {
      commit('SET_SELECTED_COURIER', payload)
    },
    resetSelectedCouriers ({ commit }) {
      commit('RESET_SELECTED_COURIERS')
    },
    SET_FULL_ITEM_DETAILS ({ commit }, payload) {
      commit('SET_FULL_ITEM_DETAILS', payload)
    },
    SET_RECOMMENDED ({ commit }, payload) {
      commit('SET_RECOMMENDED', payload)
    },
    PUSH_RECOMMENDED ({ commit }, payload) {
      commit('PUSH_RECOMMENDED', payload)
    },
    SET_USER ({ commit }, payload) {
      commit('SET_USER', payload)
    },
    RESET_RECOMMENDED ({ commit }, payload) {
      commit('RESET_RECOMMENDED', payload)
    },
    SET_DB_CONNECTION ({ commit }, payload) {
      commit('SET_DB_CONNECTION', payload)
    }
  }
})
