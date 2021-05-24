<template>
  <v-card-text v-if="requestInfo">
    <v-layout>
      <v-flex xs4>
        <v-layout column>
          <v-flex xs12>
            <v-img
              contain
              style="height:200px !important;"
              :src="requestInfo.details.imgUrl"
            />
          </v-flex>
          <v-flex xs12>
            <table
              style="width:100%;"
              class="equal-width text-xs-center text-capitalize"
            >
              <tr>
                <th>Parcel ID</th>
                <td class="text-truncate">
                  {{ requestInfo.details.parcelID }}
                </td>
              </tr>
              <tr>
                <th>Type</th>
                <td v-if="requestInfo.details.COD">
                  Cash-on-delivery
                </td>
                <td v-else>
                  Regular delivery
                </td>
              </tr>
              <tr>
                <th>Pouch size</th>
                <td>{{ requestInfo.details.pouchSize }}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{{ requestInfo.details.status }}</td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs8>
        <v-container class="pa-0">
          <adv-details
            :request-info="requestInfo.pickUp"
            activity="pickup"
          >
            <template slot="activity">
              Pickup
            </template>
            <span
              class="text-truncate subheading roboto-con-bold pawit-text-gray"
            >{{ pickUpHeader }}</span>
          </adv-details>
          <v-divider class="ml-3" />
          <adv-details
            :request-info="requestInfo.delivery"
            activity="delivery"
          >
            <span slot="activity">Delivery</span>
            <span
              class="text-truncate subheading roboto-con-bold pawit-text-gray"
            >{{ deliveryHeader }}</span>
          </adv-details>
          <v-divider class="ml-3" />
          <adv-details
            v-if="requestInfo.details.COD"
            :request-info="requestInfo.remittance"
            activity="remittance"
          >
            <span slot="activity">Remittance</span>
            <span
              class="text-truncate subheading roboto-con-bold pawit-text-gray"
            >{{ remittanceHeader }}</span>
          </adv-details>
        </v-container>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['forAssigning'],
  data () {
    return {
      dialog: false,
      requests: {},
      elHeight: 0
    }
  },
  computed: {
    ...mapState({
      requestInfo (state) {
        return state.fullItemDetails
      },
      couriers (state) {
        return state.database.couriersList
      },
      pickUpHeader (state) {
        try {
          let courier = null
          if (state.fullItemDetails.pickUp.courier) {
            courier = this.$_.find(this.couriers, {
              '.key': state.fullItemDetails.pickUp.courier
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else if (state.selectedCourier.pickUp) {
            courier = this.$_.find(this.couriers, {
              '.key': state.selectedCourier.pickUp
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else return 'N/A'
        } catch (err) {
          return ''
        }
      },
      deliveryHeader (state) {
        try {
          let courier = null
          if (state.fullItemDetails.delivery.courier) {
            courier = this.$_.find(this.couriers, {
              '.key': state.fullItemDetails.delivery.courier
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else if (state.selectedCourier.delivery) {
            courier = this.$_.find(this.couriers, {
              '.key': state.selectedCourier.delivery
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else return 'N/A'
        } catch (err) {
          return ''
        }
      },
      remittanceHeader (state) {
        try {
          let courier = null
          if (state.fullItemDetails.remittance.courier) {
            courier = this.$_.find(this.couriers, {
              '.key': state.fullItemDetails.remittance.courier
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else if (state.selectedCourier.remittance) {
            courier = this.$_.find(this.couriers, {
              '.key': state.selectedCourier.remittance
            })
            return `${courier.lastName}, ${courier.firstName}`
          } else return 'N/A'
        } catch (err) {
          return ''
        }
      }
    }),
    getPickUpCourierName () {
      let courier = this.$_.find(this.couriers, {
        '.key': this.requestInfo.pickUp.courier
      })
      return `${courier.firstName} ${courier.lastName}`
    },
    getDeliveryCourierName () {
      let courier = this.$_.find(this.couriers, {
        '.key': this.requestInfo.delivery.courier
      })
      return `${courier.firstName} ${courier.lastName}`
    },
    getRemittanceCourierName () {
      let courier = this.$_.find(this.couriers, {
        '.key': this.requestInfo.remittance.courier
      })
      return `${courier.firstName} ${courier.lastName}`
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  color: white;
}

.equal-width {
  border-collapse: collapse;
  th {
    background-color: #f1f1ef !important;
    padding: 3px;
    width: 250px;
  }
  td {
    padding-bottom: 5px !important;
    text-align: left !important;
    padding: 3px;
    // border: 1px solid #dddddd;
  }
}
</style>
