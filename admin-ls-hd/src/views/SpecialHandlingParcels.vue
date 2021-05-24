<template>
  <v-layout fill-height style="overflow-y: hidden;">
      <v-flex xs2 offset-xs2 fill-height class="pl-3 pt-5 pb-5">
        <v-card height="100%">
          <adv-toolbar :action="null">Reported Parcels</adv-toolbar>
          <adv-scrollable>
            <v-list two-line class="pt-0">
              <template>
                <v-list-tile
                  v-for="request in getSpecialParcels"
                  :key="request['.key']"
                  :class="{selected : selected == request}"
                  @click="selected = request, $store.dispatch('SET_FULL_ITEM_DETAILS', request)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="roboto-con-bold heading">{{ request['.key'] }}</v-list-tile-title>
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

      <v-flex v-if="selected" xs6 class="pl-3 pt-5 pb-5">
        <!-- 1st row -->
        <v-card height="100%">
          <adv-toolbar :action="null">Parcel details</adv-toolbar>
          <adv-scrollable>
            <adv-full-parcel-details :for-assigning="true"/>
          </adv-scrollable>
        </v-card>

        <!-- 2nd row (end) -->
      </v-flex>
      <v-flex v-else xs10 height="100%">
        <v-layout fill-height justify-center align-center>
          <v-container class="text-xs-center roboto-con-i-bold pawit-text-yellow headline">
            <img :src="require('@/assets/docus.png')" width="300px">
            <div
              class="roboto-con-i-bold pawit-text-yellow headline"
            >Please select a request to display information.</div>
          </v-container>
        </v-layout>
      </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selected: null,
      fullItemDetails: null,
      assigned: {
        courier: {
          pickup: {},
          delivery: {},
          remittance: {}
        }
      }
    };
  },
  computed: {
    ...mapState({
      requests(state) {
        return state.requestsList;
      }
    }),
    getSpecialParcels() {
      let actTmp = [];
      this.$_.each(Object.keys(this.requests), r => {
        if (this.requests[r].details.status !== "pending") {
          if (this.requests[r].status) {
            if (this.requests[r].status.special) {
              actTmp.push(this.requests[r]);
            }
          }
        }
      });
      return actTmp;
    }
  },
  methods: {
    checkRemittance(r) {
      if (r.details.cod) {
        return !r.remittance.courier;
      } else return false;
    }
  }
};
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
