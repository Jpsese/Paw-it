<template v-if="requests">
  <v-layout
    fill-height
    style="overflow-y:hidden;"
  >
    <!-- Incoming parcels list (start) -->
    <template v-if="requests">
      <v-flex
        xs2
        fill-height
        class="pl-3 pt-3 pb-3"
      >
        <v-card height="100%">
          <adv-toolbar :action="null">
            Incoming requests
          </adv-toolbar>
          <adv-scrollable>
            <v-list
              two-line
              class="pt-0"
            >
              <template>
                <v-list-tile
                  v-for="request in pendingRequests"
                  :key="request['.key']"
                  :class="{ selected: selected == request}"
                  @click="setParcel(request), selected = request"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="roboto-con-bold heading">
                      {{ request['.key'] }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="font-weight-bold">
                      <div>{{ request.details.COD ? 'Cash-On-Delivery' : 'Regular Delivery' }}</div>
                      <div>
                        <span>Date posted:</span>
                        <span class="font-weight-regular">{{ request.details.datePosted }}</span>
                      </div>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </adv-scrollable>
        </v-card>
      </v-flex>
      <!-- Incoming parcels list (end) -->

      <v-flex
        v-if="fullItemDetails"
        xs10
      >
        <!-- 1st row -->
        <v-layout
          row
          class="rowHeight"
        >
          <!-- Parcel details (start) -->
          <v-flex
            xs6
            class="pa-3"
          >
            <v-card height="100%">
              <adv-toolbar :action="true">
                Parcel details
              </adv-toolbar>
              <adv-scrollable>
                <adv-full-parcel-details :for-assigning="true" />
              </adv-scrollable>
            </v-card>
          </v-flex>
          <!-- Parcel details (end) -->

          <!-- Origin map (start) -->
          <v-flex
            xs6
            class="pr-3 pt-3 pb-3"
          >
            <v-card height="100%">
              <adv-request-map
                :key="JSON.stringify($store.state.fullItemDetails)"
                details-from="pickUp"
                :couriers="couriers"
              >
                Origin
              </adv-request-map>
            </v-card>
          </v-flex>
          <!-- Origin map (end) -->
        </v-layout>

        <!-- 2nd Row -->
        <v-layout
          row
          class="rowHeight"
        >
          <!-- Destination map (start) -->
          <v-flex
            xs6
            class="pb-3 pl-3 pr-3"
          >
            <v-card height="100%">
              <adv-request-map
                :key="JSON.stringify($store.state.fullItemDetails)"
                details-from="delivery"
                :couriers="couriers"
              >
                Destination
              </adv-request-map>
            </v-card>
          </v-flex>
          <!-- Destination map (end) -->

          <!-- Remittance map (start) -->
          <v-flex
            xs6
            class="pr-3 pb-3"
          >
            <v-card height="100%">
              <adv-request-map
                v-if="fullItemDetails.hasOwnProperty('remittance')"
                :key="JSON.stringify(fullItemDetails)"
                details-from="remittance"
                :couriers="couriers"
              >
                Remittance
              </adv-request-map>
              <div
                v-else
                class="display-1"
              >
                This request has no remittance activity.
              </div>
            </v-card>
          </v-flex>
          <!-- Remittance map (end) -->
        </v-layout>
        <!-- 2nd row (end) -->
      </v-flex>
      <v-flex
        v-else
        xs10
        height="100%"
      >
        <v-layout
          fill-height
          justify-center
          align-center
        >
          <v-container class="text-xs-center roboto-con-i-bold pawit-text-yellow headline">
            <img
              :src="require('@/assets/docus.png')"
              width="300px"
            >
            <div
              class="roboto-con-i-bold pawit-text-yellow headline"
            >
              Please select a request to display information.
            </div>
          </v-container>
        </v-layout>
      </v-flex>
    </template>

    <!-- On fresh open (cleared cache) -->
    <v-flex
      v-else
      xs12
    >
      <v-container>
        <!-- <v-progress-circular justify-center :size="70" :width="7" color="green" indeterminate></v-progress-circular> -->
        <v-progress-linear
          :indeterminate="true"
          color="green"
        />
      </v-container>
    </v-flex>
    <!-- <div
      v-else
      class="text-xs-center roboto-con-i-bold display-2 pawit-text-green"
    >Please Select a Request</div>-->
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selected: null,
      couriers: []
    }
  },
  computed: {
    ...mapState({
      fullItemDetails (state) {
        return state.fullItemDetails
      },
      requests (state) {
        return state.database.requestsList
      }
    }),
    pendingRequests () {
      return this.$_.filter(this.requests, t => t.details.status === 'pending')
    }
  },
  created () {
    this.$store.dispatch('SET_FULL_ITEM_DETAILS', null)
    this.$store.dispatch('database/setDatabase')
  },
  methods: {
    setParcel (request) {
      this.$store.dispatch('SET_FULL_ITEM_DETAILS', request)
      this.$store.dispatch('resetSelectedCouriers')
      this.$store.dispatch('parcel_order/resetParcelOrder')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  color: white;
}

.selected {
  background-color: #f1f1ef;
}

.tileborder {
  border-bottom: 1px !important;
  border-bottom-color: #f1f1ef !important;
}

.rowHeight {
  height: 50%;
}

.display-1 {
  color: rgba(0, 0, 0, 0.54);
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.2);
}
</style>
