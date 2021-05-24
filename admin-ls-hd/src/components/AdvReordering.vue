<template>
  <draggable
    v-if="items"
    v-model="dataModel"
    @end="save"
  >
    <v-list-tile
      v-for="parcel in dataModel"
      :key="JSON.stringify(parcel)"
      class="grabbable"
    >
      <v-list-tile-avatar>
        <v-avatar
          :color="parcel.status === 'pickUp' ? 'blue' : parcel.status === 'delivery' ? 'green' : 'orange'"
          size="30"
        >
          <span class="white--text title">
            {{ parcel.status.charAt(0).toUpperCase() }}
          </span>
        </v-avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title class="mr-2">
          {{ parcel.parcelID }}
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-content class="align-end">
        {{ requestsObj[parcel.parcelID][parcel.status].time }}
      </v-list-tile-content>
    </v-list-tile>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  components: { draggable },
  props: ['activity'],
  data () {
    return {
      dataModel: [],
      requestsObj: {}
    }
  },
  firebase () {
    return {
      requestsObj: this.$database('/postedParcels')
    }
  },
  computed: {
    ...mapState({
      items (state) {
        return state.parcel_order.order
      },
      fullItemDetails (state) {
        return state.fullItemDetails
      },
      selectedCourier (state) {
        return state.selectedCourier[this.activity]
      },
      couriers (state) {
        return state.database.couriersObj
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
  created () {
    const filteredData = this.$_.filter(this.items[this.selectedCourier][this.fullItemDetails[this.activity].date], _ => {
      const from = this.$moment(this.itemDeliveryRun.from, 'hh:mm')
      const to = this.$moment(this.itemDeliveryRun.to, 'hh:mm')
      const parcelTime = this.$moment(this.requestsObj[_.parcelID][_.status].time, 'hh:mm')

      if (parcelTime.isBetween(from, to) || parcelTime.isSame(from)) {
        return _
      }
    })

    this.dataModel = filteredData
  },
  methods: {
    save () {
      this.$store.dispatch('parcel_order/replaceOrder', {
        courier: this.selectedCourier,
        activity: this.activity,
        date: this.fullItemDetails[this.activity].date,
        items: this.$_.uniq([
          ...this.dataModel,
          ...this.items[this.selectedCourier][this.fullItemDetails[this.activity].date]
        ])
      })
    }
  }
}
</script>

<style>
.grabbable {
  cursor: grab;
}
</style>
