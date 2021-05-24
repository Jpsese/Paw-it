<template>
  <v-dialog
    v-model="value"
    persistent
  >
    <v-layout fill-height>
      <v-card
        width="100%"
        height="100%"
      >
        <v-toolbar
          flat
          class="pawit-green"
        >
          <v-toolbar-title class="text-white">
            Reorder parcels (Distance: {{ totalDistance }} meters | Duration: {{ totalDuration + $_.sumBy(courierParcels, ({ processTime }) => Number(processTime) ? Number(processTime) : $systemParam.processTime) }} mins)
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="$emit('update:value', false)"
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout style="height: calc(100% - 64px)">
          <v-flex xs3>
            <adv-scrollable>
              <v-list
                ref="drag"
                three-line
              >
                <draggable
                  v-model="courierParcels"
                  ghost-class="ghost"
                >
                  <v-list-tile
                    v-for="parcel in courierParcels"
                    :key="parcel.key"
                    class="draggable"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ parcel.key }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ parcel.parcelInfo.location.address }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-menu
                        offset-y
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            ripple
                            v-on="on"
                          >
                            <v-icon>query_builder</v-icon>
                          </v-btn>
                        </template>
                        <v-list class="pl-3 pr-3">
                          <v-text-field
                            v-model="parcel['processTime']"
                            :label="parcel['processTime'] ? 'Service Time' : `Service Time: ${$systemParam.processTime}`"
                            type="number"
                            clearable
                            suffix="mins"
                          />
                        </v-list>
                      </v-menu>
                    </v-list-tile-action>
                  </v-list-tile>
                </draggable>
              </v-list>
              <v-btn
                block
                depressed
                color="success"
                @click="$store.dispatch('updateParcelOrder', { toggledCourier, parcels: courierParcels, status: detailsFrom, date: requestInfo[detailsFrom].date }), $emit('update:value', false)"
              >
                Save
              </v-btn>
            </adv-scrollable>
          </v-flex>
          <v-flex xs9>
            <div
              ref="map"
              style="height: 100%;"
            />
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<script>
/* global google */
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  props: ['value', 'requestInfo', 'detailsFrom', 'toggledCourier', 'travelInfo'],
  data () {
    return {
      courierParcels: [],
      totalDistance: 0,
      totalDuration: 0,

      courier: {},
      parcels: {}
    }
  },
  firebase () {
    return {
      courier: this.$database(`/couriers/${this.toggledCourier}`),
      parcels: this.$database('/postedParcels')
    }
  },
  mounted () {
    this.displayCourierParcels()
    const map = this.initMap(this.$refs.map, this.requestInfo[this.detailsFrom].location)
    this.renderRoute(map, this.courierParcels)
  },
  methods: {
    initMap (map, position) {
      return new google.maps.Map(map, {
        center: position,
        zoom: 14
      })
    },
    renderRoute (map, waypts) {
      const directionsService = new google.maps.DirectionsService()
      const directionsDisplay = new google.maps.DirectionsRenderer({ map })

      let routeConfig = {
        origin: {
          lat: 16.409445,
          lng: 120.599392
        },
        destination: {
          lat: 16.409445,
          lng: 120.599392
        },
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: this.$_.map(waypts, w => ({ location: this.handleLatLng(w.parcelInfo.location), stopover: true }))
      }

      directionsService.route(routeConfig, (res, status) => {
        if (res.status === 'OK') {
          directionsDisplay.setDirections(res)

          this.totalDistance = this.$_.sumBy(res.routes[0].legs, leg => leg.distance.value)
          this.totalDuration = this.$_.sumBy(res.routes[0].legs, leg => leg.duration.value)

          this.$_.each(this.courierParcels, ({ key, parcelInfo, processTime }, i) => {
            const parcelMarker = this.renderMarker(map, this.handleLatLng(parcelInfo.location))
            // const $parcelInfo = { key, distance: res.routes[0].legs[i].distance, duration: res.routes[0].legs[i].duration }
            const parcelInfoWindow = this.renderInfoWindow(
              `
              <div style="display: flex">
                <p>${key}</p>
              </div>
              <div style="display: flex; justify-content: center">
                <h1>15</h1>
              </div>
              <div style="display: flex; justify-content: center">
                <h2>${this.parcels[key].details.status}</h2>
              </div>
              <div style="display: flex; justify-content: center">
                <p>10:00 AM</p>
              </div>
              `
            )
            parcelMarker.addListener('click', () => parcelInfoWindow.open(map, parcelMarker))
            parcelInfoWindow.open(map, parcelMarker)
          })
        }
      })
    },
    renderMarker (map, position, icon) {
      return new google.maps.Marker({
        map,
        position,
        icon: {
          url: require(icon === 'SM' ? '@/assets/sm.png' : icon ? '@/assets/man.png' : '@/assets/box.png'),
          scaledSize: new google.maps.Size(40, 40)
        }
      })
    },
    renderInfoWindow (content) {
      return new google.maps.InfoWindow({ content })
    },
    displayCourierParcels () {
      try {
        if (this.courier.routes[this.requestInfo[this.detailsFrom].date]) {
          this.courierParcels = this.$_.map(this.courier.routes[this.requestInfo[this.detailsFrom].date], ({ parcelID, status }) => {
            return { key: parcelID, parcelInfo: this.parcels[parcelID][status], status: this.detailsFrom }
          })
        }
      } catch (err) { /* Empty */ }
      this.courierParcels = [{ key: this.requestInfo['.key'], parcelInfo: this.requestInfo[this.detailsFrom], status: this.detailsFrom }, ...this.courierParcels]
    },
    handleLatLng (location) {
      return {
        lat: location.lat,
        lng: location.lng
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
  align-items: unset !important;
}

.text-white {
  color: white;
}

.ghost {
  opacity: .5;
  background: #C8EBFB;
}

.hover:hover {
  background-color: #c19434;
  cursor: pointer;
}

.draggable:hover{
  cursor: grab;
}
</style>
