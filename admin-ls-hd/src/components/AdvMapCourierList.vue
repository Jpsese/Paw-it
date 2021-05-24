<template v-if="recommended.length">
  <div
    class="courier-list"
    :style="`float: left; width: ${width}%;`"
  >
    <adv-scrollable>
      <v-layout
        justify-center
        align-center
      >
        <v-flex grow>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                depressed
                block
                color="primary"
                small
                v-on="on"
              >
                Sort by: {{ sortBy ? sortBy : 'None' }}
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="sort in [null, 'Stops', 'Distance', 'Duration']"
                :key="sort"
                @click="sortBy = sort"
              >
                <v-list-tile-title>{{ sort ? sort : 'None' }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
        <v-flex
          v-if="sortBy"
          shrink
        >
          <v-btn
            icon
            small
            @click="sortOrder === 'asc' ? sortOrder = 'desc' : sortOrder === 'desc' ? sortOrder = 'asc' : 'desc'"
          >
            <v-icon>
              {{ sortOrder === 'asc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
            </v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-list
        :key="JSON.stringify(recommended)"
        two-line
      >
        <v-menu
          v-for="courier in this.$_.compact(recommended)"
          :key="courier['.key']"
          offset-y
          :close-on-content-click="false"
          max-height="70%"
        >
          <template v-slot:activator="{ on }">
            <v-list-tile
              :class="$store.state.selectedCourier[activity] === courier['.key'] ? 'selected' : ''"
              v-on="on"
              @click="setCourierAndParcels(courier)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ couriersObject[courier['.key']].lastName }}, {{ couriersObject[courier['.key']].firstName }}</v-list-tile-title>
                <!-- stops, total distance, total travel time -->
                <v-list-tile-sub-title>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <span
                        class="red--text mr-1"
                        v-on="on"
                      >{{ courier.noOfStops }} stops</span>
                    </template>
                    <span># of stops {{ courier.noOfStops }}</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <span
                        class="blue--text mr-1"
                        v-on="on"
                      >{{ courier.hasOwnProperty('totalDistance') ? courier.totalDistance.text : 0 }}</span>
                    </template>
                    <span>Total distance {{ courier.hasOwnProperty('totalDistance') ? courier.totalDistance.text : 0 }}</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <span
                        class="green--text mr-1"
                        v-on="on"
                      >{{ courier.hasOwnProperty('totalDuration') ? courier.totalDuration.text : 0 }}</span>
                    </template>
                    <span>Total duration {{ courier.hasOwnProperty('totalDuration') ? courier.totalDuration.text : 0 }}</span>
                  </v-tooltip>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <div>
            <v-list v-if="selectedCourier[activity] === courier['.key']">
              <adv-reordering
                :key="JSON.stringify({selectedCourier,items})"
                :activity="activity"
              />
            </v-list>
          </div>
        </v-menu>
      </v-list>
    </adv-scrollable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import absent from '@/assets/absent.json'

export default {
  props: ['width', 'activity'],
  data () {
    return {
      sortBy: null,
      sortOrder: 'asc'
    }
  },
  computed: {
    ...mapState({
      recommended (state) {
        let filteredData = this.$_.compact(state.recommended[this.activity])

        const DATE = this.fullItemDetails[this.activity].date
        const TIME = this.$moment(this.fullItemDetails[this.activity].time, 'hh:mm')

        // Loop through all the times in parcel date.
        for (const [key, value] of Object.entries(absent[DATE] || {})) {
          const FROM = this.$moment(key.split('-')[0], 'hh:mm')
          const TO = this.$moment(key.split('-')[1], 'hh:mm')

          if (TIME.isBetween(FROM, TO) || TIME.isSame(FROM) || TIME.isSame(TO)) {
            // Remove frome filtered date if courier is in
            // absent.json base on date and time.
            this.$_.remove(filteredData, _ => this.$_.includes(value, _['.key']))
          }
        }

        switch (this.sortBy) {
          case null:
            return filteredData
          case 'Stops':
            return this.$_.orderBy(filteredData, 'noOfStops', [this.sortOrder])
          case 'Distance':
            return this.$_.orderBy(filteredData, $ => $.totalDistance.value, [this.sortOrder])
          case 'Duration':
            return this.$_.orderBy(filteredData, $ => $.totalDuration.value, [this.sortOrder])
          default:
            return filteredData
        }
      },
      fullItemDetails (state) {
        return state.fullItemDetails
      },
      selectedCourier (state) {
        return state.selectedCourier
      },
      items (state) {
        return state.parcel_order.order[this.activity]
      },
      couriers (state) {
        return state.database.couriersList
      },
      couriersObject (state) {
        return state.database.couriersObj
      },
      requestsObj (state) {
        return state.database.requestsObj
      }
    })
  },
  methods: {
    setCourierAndParcels (courier) {
      if (this.selectedCourier[this.activity] === courier['.key']) {
        this.$store.dispatch('setSelectedCourier', { activity: this.activity, courier: null })
        const parcelOrderClone = this.$store.state.parcel_order.order[courier['.key']][this.fullItemDetails[this.activity].date]
        this.$_.remove(parcelOrderClone, $ => {
          return $.parcelID === this.fullItemDetails['.key'] && $.status === this.activity
        })
        this.$store.dispatch('parcel_order/setParcelOrder', {
          courier: courier['.key'],
          date: this.fullItemDetails[this.activity].date,
          activity: this.activity,
          items: parcelOrderClone
        })
      } else {
        if (this.selectedCourier[this.activity] && this.selectedCourier[this.activity] !== courier['.key']) {
          let ogData = this.$store.state.parcel_order.order[this.selectedCourier[this.activity]][this.fullItemDetails[this.activity].date]
          this.$_.remove(ogData, _ => {
            return (
              _.status === this.activity &&
              _.parcelID === this.fullItemDetails['.key']
            )
          })
          this.$store.dispatch('parcel_order/setParcelOrder', {
            courier: this.selectedCourier[this.activity],
            date: this.fullItemDetails[this.activity].date,
            activity: this.activity,
            items: ogData
          })
        }

        this.$store.dispatch('setSelectedCourier', { activity: this.activity, courier: courier['.key'] })

        const courierData = this.couriersObject[courier['.key']]
        let items = []

        if (courierData.routes) {
          if (courierData.routes[this.fullItemDetails[this.activity].date]) {
            items = courierData.routes[this.fullItemDetails[this.activity].date]

            this.$_.each(['pickUp', 'delivery', 'remittance'], act => {
              if (act !== this.activity) {
                if (this.$store.state.parcel_order.order[act]) {
                  if (this.$store.state.parcel_order.order[act][courier['.key']]) {
                    if (this.$store.state.parcel_order.order[act][courier['.key']][this.fullItemDetails[this.activity].date]) {
                      items = [...items, ...this.$store.state.parcel_order.order[act][courier['.key']][this.fullItemDetails[this.activity].date]]
                    } else {
                      console.warn(`No date ${this.fullItemDetails[this.activity].date}`)
                    }
                  } else {
                    console.warn(`No ${courier['.key']} in ${act}`)
                  }
                } else {
                  console.warn('activity not yet set')
                }
              }
            })
          } else {
            // No route in particular date
            console.warn('No route in date', courierData.routes)
          }
        } else {
          // Courier is totally free
          console.warn('courier is free', courierData)
        }

        this.$store.dispatch('parcel_order/setParcelOrder', {
          courier: courier['.key'],
          date: this.fullItemDetails[this.activity].date,
          activity: this.activity,
          items: [...items, {
            status: this.activity,
            parcelID: this.fullItemDetails['.key'],
            cash: this.fullItemDetails.details.COD ? this.fullItemDetails.remittance.cash : null,
            COD: this.fullItemDetails.details.COD,
            time: this.fullItemDetails[this.activity].time,
            warehouse: false
          }]
        })
      }
    },
    getCourierParcels (key) {
      if (this.couriersObj[key].routes) {
        if (this.couriersObj[key].routes.hasOwnProperty(this.fullItemDetails[this.activity].date)) {
          return this.$_.map(Object.keys(this.couriersObj[key].routes[this.fullItemDetails[this.activity].date]), $ => {
            let _ = this.couriersObj[key].routes[this.fullItemDetails[this.activity].date][$]
            _.key = $
            return _
          })
        } else {
          return []
        }
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
  .courier-list {
    height: calc(100% + 40px);
    overflow-y: auto;
    overflow-x: hidden;
    transition: .3s ease-in-out;
  }
  .selected {
    background-color: #f1f1ef;
  }
</style>
