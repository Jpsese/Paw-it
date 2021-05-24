<template>
  <div
    ref="map"
    :style="`width: ${100 - sidenavWidth}; height: 100%; transition: .3s ease-in-out;${styles ? styles : ''}`"
  />
</template>

<script>
/* global google */

import { mapState } from 'vuex'
import { objectToList } from '@/utils/objectToList'

export default {
  props: ['activity', 'sidenavWidth', 'styles', 'recalculate'],
  data () {
    return {
      COURIER_DATE: null,
      mapHeight: 0,

      map: null
    }
  },
  computed: {
    ...mapState({
      fullItemDetails (state) {
        return state.fullItemDetails
      },
      couriers (state) {
        return state.database.couriersList
      },
      warehouse (state) {
        return state.database.system.warehouse
      },
      selectedCourier (state) {
        return state.selectedCourier[this.activity]
      },
      courierObj (state) {
        return state.database.couriersObj
      },
      requests (state) {
        return state.database.live_request_obj
      },
      deliveryRuns (state) {
        return state.database.system.deliveryRun
      }
    }),
    itemDeliveryRun () {
      const deliveryRunIndex = this.$_.findIndex(this.deliveryRuns, (run, i) => {
        const from = this.$moment(run.from, 'hh:mm')
        const to = this.$moment(run.to, 'hh:mm')
        const itemTime = this.$moment(this.fullItemDetails[this.activity].time, 'hh:mm')

        if (itemTime.isBetween(from, to) || itemTime.isSame(from) || (this.fullItemDetails[this.activity].time === '17:00' && i === (this.deliveryRuns.length - 1))) {
          return run
        }
      })
      return this.deliveryRuns[deliveryRunIndex]
    }
  },
  mounted () {
    this.map = this.initMap()
    const itemMarker = this.renderMapMarker(this.fullItemDetails[this.activity].location)
    const itemInfoWindow = this.renderInfoWindow(this.fullItemDetails, this.fullItemDetails['.key'], this.activity, true)
    itemInfoWindow.open(this.map, itemMarker)
    itemMarker.addListener('click', () => itemInfoWindow.open(this.map, itemMarker))

    if (this.selectedCourier) {
      const courier = this.courierObj[this.selectedCourier]
      if (courier.routes) {
        if (courier.routes[this.fullItemDetails[this.activity].date]) {
          const wpts = this.$_.map(objectToList(courier.routes[this.fullItemDetails[this.activity].date]), (_, i) => {
            const from = this.$moment(this.itemDeliveryRun.from, 'hh:mm')
            const to = this.$moment(this.itemDeliveryRun.to, 'hh:mm')
            const itemTime = this.$moment(this.requests[_.parcelID][_.status].time, 'hh:mm')

            if (itemTime.isBetween(from, to) || itemTime.isSame(from) || (this.fullItemDetails[this.activity].time === '17:00' && i === (this.deliveryRuns.length - 1))) {
              const marker = this.renderMapMarker(this.handleLatlng(this.requests[_.parcelID][_.status].location))
              const infoWindow = this.renderInfoWindow(this.requests[_.parcelID], _.parcelID, _.status)
              infoWindow.open(this.map, marker)
              marker.addListener('click', () => infoWindow.open(this.map, marker))

              return {
                location: this.handleLatlng(this.requests[_.parcelID][_.status].location),
                stopover: true
              }
            } else {
              return undefined
            }
          })

          this.renderRoute(this.$_.compact(wpts))
        }
      }
    }

    this.getRouteData()
      .then(res => {
        this.$store.dispatch('SET_RECOMMENDED', { activity: this.activity, items: res })
      })
  },
  methods: {
    initMap () {
      return new google.maps.Map(this.$refs.map, {
        center: this.handleLatlng(this.fullItemDetails[this.activity].location),
        zoom: 14
      })
    },
    handleLatlng ({ lat, lng }) {
      return { lat, lng }
    },
    renderRoute (waypts) {
      new google.maps.DirectionsService().route({
        origin: this.warehouse,
        destination: this.warehouse,
        travelMode: 'DRIVING',
        waypoints: waypts
      }, (res, status) => {
        if (status === 'OK') {
          new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: true }).setDirections(res)
        }
      })
    },
    renderMapMarker (position) {
      return new google.maps.Marker({
        position: this.handleLatlng(position),
        map: this.map
      })
    },
    renderInfoWindow (data, id, status, newItem) {
      return new google.maps.InfoWindow({
        content: `
          <div class="title ${newItem ? 'blue white--text' : ''}">${id}</div>
          <div class="body-2">${status}</div>
        `
      })
    },
    getRouteDistanceAndTime (parcels) {
      const req = {
        origin: this.warehouse,
        destination: this.warehouse,
        waypoints: this.$_.map(parcels, $ => ({ location: this.handleLatlng($.location), stopover: true })),
        travelMode: 'DRIVING'
      }
      return new Promise((resolve, reject) => {
        new google.maps.DirectionsService().route(req, (res, status) => {
          if (status === 'OK') {
            const totalDistance = this.$_.sumBy(res.routes[0].legs, _ => _.distance.value)
            const totalDuration = this.$_.sumBy(res.routes[0].legs, _ => _.duration.value)

            resolve({
              totalDistance: {
                value: totalDistance,
                text: (totalDistance / 1000).toFixed(2) + ' km'
              },
              totalDuration: {
                value: totalDuration,
                text: (totalDuration / 60).toFixed(2) + ' mins'
              }
            })
          } else {
            reject(new Error('Status returned not `OK`'))
          }
        })
      })
    },
    async getRouteData () {
      const ACTIVITY_DAY = this.$moment.weekdays(this.$moment(this.fullItemDetails[this.activity].date, 'MM-DD-YYYY').weekday())

      let couriersArr = this.$_.map(this.couriers, async courier => {
        if (courier.dayOff !== ACTIVITY_DAY) {
          if (courier.hasOwnProperty('routes')) {
            if (courier.routes.hasOwnProperty(this.fullItemDetails[this.activity].date)) {
              const list = objectToList(courier.routes[this.fullItemDetails[this.activity].date])
              const parcelLocations = this.$_.map(list, ({ parcelID, status }) => {
                return this.requests[parcelID][status]
              })

              return {
                '.key': courier['.key'],
                parcels: courier.routes[this.fullItemDetails[this.activity].date],
                noOfStops: objectToList(courier.routes[this.fullItemDetails[this.activity].date]).length,
                ...await this.getRouteDistanceAndTime(parcelLocations)
              }
            } else {
              return {
                '.key': courier['.key'],
                parcles: [],
                noOfStops: 0,
                totalDuration: {
                  value: 0,
                  text: '0 mins'
                },
                totalDistance: {
                  value: 0,
                  text: '0 km'
                }
              }
            }
          } else {
            return {
              '.key': courier['.key'],
              parcles: [],
              noOfStops: 0,
              totalDuration: {
                value: 0,
                text: '0 mins'
              },
              totalDistance: {
                value: 0,
                text: '0 km'
              }
            }
          }
        }
      })

      return Promise.all(couriersArr)
    },
    getLegInfo (p1, p2, wpt) {
      this.$_.each(this.couriers, courier => {
        if (courier.hasOwnProperty('routes')) {
          if (courier.routes[this.fullItemDetails[this.activity].date]) {
            const parcels = objectToList(courier.routes[this.fullItemDetails[this.activity].date])
            this.$_.each(parcels, ({ parcelID, status }, i) => {
              // Current parcel location
              const parcelLocation = this.requests[parcelID][status].location
              // Next parcel location or warehouse
              const nextLocation = parcels[i + 1] ? this.requests[parcels[i + 1].parcelID][parcels[i + 1].status].location : this.warehouse
              this.renderMapMarker(this.handleLatlng(parcelLocation))
              this.renderMapMarker(this.handleLatlng(nextLocation))
              const req = {
                origin: this.handleLatlng(parcelLocation),
                destination: this.handleLatlng(nextLocation),
                travelMode: 'DRIVING'
              }
              new google.maps.DirectionsService().route(req, (res, status) => {
                if (status === 'OK') {
                  new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: true }).setDirections(res)
                } else {
                  console.warn(`Status returned ${status}`)
                }
              })
            })
          } else {
            // Courier is free this date
          }
        } else {
          // Courier is totally free
        }
      })
    }
  }
}
</script>
