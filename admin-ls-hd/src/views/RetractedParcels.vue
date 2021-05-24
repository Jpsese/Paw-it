<template>
  <v-layout
    fill-height
    style="overflow-y: hidden;"
  >
    <v-layout column>
      <v-flex
        xs6
        class="pl-3 pt-3 pb-3"
      >
        <v-card height="100%">
          <adv-toolbar :action="null">
            Retracted parcels
          </adv-toolbar>
          <adv-scrollable>
            <v-list
              two-line
              class="pt-0"
            >
              <template>
                <v-list-tile
                  v-for="request in getRetractedParcels"
                  :key="request['.key']"
                  :class="{selected : selected == request}"
                  @click="selected = request, $store.dispatch('SET_FULL_ITEM_DETAILS', request), mode = 'retracted'"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="roboto-con-bold heading">
                      {{ request['.key'] }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="font-weight-bold">
                      <div>{{ request.details.cod ? 'Cash-On-Delivery' : 'Regular Delivery' }}</div>
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
      <v-flex
        xs6
        class="pl-3 pt-3 pb-3"
      >
        <v-card height="100%">
          <adv-toolbar :action="null">
            For help desk handling
          </adv-toolbar>
          <adv-scrollable>
            <v-list
              two-line
              class="pt-0"
            >
              <template>
                <v-list-tile
                  v-for="request in getSpecialParcels"
                  :key="request['.key']"
                  :class="{selected : selected == request}"
                  @click="selected = request, $store.dispatch('SET_FULL_ITEM_DETAILS', request), mode = 'helpDesk'"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="roboto-con-bold heading">
                      {{ request['.key'] }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="font-weight-bold">
                      <div>{{ request.details.cod ? 'Cash-On-Delivery' : 'Regular Delivery' }}</div>
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
    </v-layout>

    <v-flex
      v-if="selected && fullItemDetails"
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
            <adv-toolbar
              :action="mode === 'retracted' ? true : false"
              :special="true"
            >
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
            <adv-request-map details-from="pickUp">
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
            <adv-request-map details-from="delivery">
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
              v-if="selected.hasOwnProperty('remittance')"
              details-from="remittance"
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
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      mode: 'retracted',
      selected: null,
      assigned: {
        courier: {
          pickup: {},
          delivery: {},
          remittance: {}
        }
      }
    }
  },
  computed: {
    ...mapState({
      requests (state) {
        return state.database.requestsList
      },
      fullItemDetails (state) {
        return state.fullItemDetails
      }
    }),
    getRetractedParcels () {
      let actTmp = []
      this.$_.each(this.requests, r => {
        if (r.status) {
          if (!r.status.special && /retracted/g.test(r.details.status)) {
            actTmp.push(r)
          }
        } else {
          if (/retracted/g.test(r.details.status)) {
            actTmp.push(r)
          }
        }
      })

      return actTmp
      // let actTmp = [];
      // this.$_.each(Object.keys(this.requests), r => {
      //   if (
      //     this.requests[r].details.status !== "pending" &&
      //     (!this.requests[r].pickUp.courier ||
      //       !this.requests[r].delivery.courier ||
      //       this.checkRemittance(this.requests[r]))
      //   ) {
      //     actTmp.push(this.requests[r]);
      //   }
      // });
      // return actTmp;
    },
    getSpecialParcels () {
      let actTmp = []
      // return this.$_.map(objectToList(this.requests), _ => {
      //   if (_.status) {
      //     return _.status.special
      //   }
      // })
      this.$_.each(Object.keys(this.requests), r => {
        if (this.requests[r].status) {
          if (this.requests[r].status.special) {
            actTmp.push(this.requests[r])
          }
        }
      })

      return actTmp
    }
  },
  mounted () {
    this.$store.dispatch('database/setDatabase')
  },
  methods: {
    checkRemittance (r) {
      if (r.details.cod) {
        return !r.remittance.courier
      } else return false
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

.rowHeight {
  height: 50%;
}
</style>
