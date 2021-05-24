<template>
  <!-- <div> -->
  <v-toolbar
    slot="title"
    height="40"
    width="100%"
    flat
    class="roboto-con-i-bold pawit-green pawit-text-gray-1"
  >
    <v-toolbar-title class="font-weight-medium">
      <slot />
    </v-toolbar-title>
    <v-spacer />

    <v-dialog
      v-if="action"
      v-model="accept_dialog"
      width="400"
    >
      <template v-slot:activator="{ on }">
        <v-layout>
          <v-flex
            xs4
            offset-xs8
          >
            <v-btn
              small
              block
              class="pawit-yellow"
              dark
              :disabled="couriersAreSelected"
              v-on="on"
            >
              Accept
            </v-btn>
          </v-flex>
        </v-layout>
      </template>

      <v-card>
        <v-card-title class="headline pawit-green pawit-text-gray-1">
          Confirmation
        </v-card-title>
        <v-card-text class="text-xs-center">
          <div class="font-weight-bold">
            The following couriers will be assigned to the parcel:
          </div>
          <div>
            <span class="font-weight-bold">Pick-up:</span>
            {{ pickUpHeader }}
          </div>
          <div>
            <span class="font-weight-bold">Delivery:</span>
            {{ deliveryHeader }}
          </div>
          <div v-if="fullItemDetails.details.COD">
            <span class="font-weight-bold">Remittance:</span>
            {{ remittanceHeader }}
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="pawit-text-green"
            flat
            @click="accept_dialog = false"
          >
            Cancel
          </v-btn>
          <!-- Put this on click for test -> acceptRequest(requestInfo.details.COD) -->
          <v-btn
            class="pawit-text-green"
            flat
            @click="acceptClientRequest"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Reject dialog (start) -->
    <v-dialog
      v-if="action"
      v-model="reject_dialog"
      width="30%"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          small
          v-on="on"
        >
          Reject
        </v-btn>
      </template>

      <!-- Dialog contents -->
      <v-card
        v-if="!special && action"
        height="100%"
      >
        <v-card-title
          class="headline roboto-con-i-medium pawit-text-gray-1 pawit-green"
          primary-title
        >
          Request Errors
        </v-card-title>

        <!-- Rejection lists here -->
        <v-card-text class="pb-0">
          <v-combobox
            v-model="chips"
            :items="items"
            label="Errors"
            chips
            clearable
            prepend-icon="filter_list"
            solo
            multiple
          >
            <template v-slot:selection="data">
              <v-chip
                :selected="data.selected"
                close
                @input="remove(data.item)"
              >
                <strong>{{ data.item }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-combobox>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="pawit-text-green"
            flat
            @click="reject_dialog = false"
          >
            Cancel
          </v-btn>
          <!-- On reject backend logic for btn -->
          <v-btn
            class="pawit-text-green"
            flat
            @click="rejectRequest()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="action && special">
        <v-card-title
          class="headline roboto-con-i-medium pawit-text-gray-1 pawit-green"
          primary-title
        >
          Confirmation
        </v-card-title>
        <v-card-text
          class="blockquote"
        >
          Report this activity to help desk officer for special handling.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="pawit-text-green"
            flat
            @click="reject_dialog = false"
          >
            Cancel
          </v-btn>
          <!-- On reject backend logic for btn -->
          <v-btn
            class="pawit-text-green"
            flat
            @click="sendToHelpDesk()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-if="action"
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
    >
      Parcel {{ fullItemDetails['.key'] }} has been rejected
      <v-btn
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog
      v-model="updateError.dialog"
      width="50%"
    >
      <v-card>
        <v-card-text>
          <v-layout
            row
            wrap
          >
            <v-flex xs4>
              <v-img
                :src="require('@/assets/sad_smiley.svg')"
                height="100%"
                contain
              />
            </v-flex>
            <v-flex xs8>
              <v-layout
                fill-height
                justify-center
                align-center
              >
                <p class="title">
                  {{ updateError.message }}
                </p>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/plugins/firebase'

export default {
  props: ['action', 'special'],
  data () {
    return {
      snackbar: false,
      y: 'bottom',
      x: 'right',
      accept_dialog: false,
      reject_dialog: false,
      updateError: {
        dialog: false,
        message: null
      },
      chips: [],
      items: [
        'Inappropriate pouch size for parcel',
        'Parcel is an accessory',
        'Perilous Location',
        'No available courier on preferred schedule'
      ]
    }
  },
  computed: {
    couriersAreSelected () {
      if (this.fullItemDetails) {
        if (this.fullItemDetails.hasOwnProperty('remittance')) {
          return !(
            this.selectedCourier.pickUp &&
            this.selectedCourier.delivery &&
            this.selectedCourier.remittance
          )
        }
      }
      return !(this.selectedCourier.pickUp && this.selectedCourier.delivery)
    },
    ...mapState({
      pickUpHeader (state) {
        try {
          const courier = this.$_.find(this.couriers, {
            '.key': state.selectedCourier.pickUp
          })
          return `${courier.lastName}, ${courier.firstName}`
        } catch (err) {
          return ''
        }
      },
      deliveryHeader (state) {
        try {
          const courier = this.$_.find(this.couriers, {
            '.key': state.selectedCourier.delivery
          })
          return `${courier.lastName}, ${courier.firstName}`
        } catch (err) {
          return ''
        }
      },
      remittanceHeader (state) {
        try {
          const courier = this.$_.find(this.couriers, {
            '.key': state.selectedCourier.remittance
          })
          return `${courier.lastName}, ${courier.firstName}`
        } catch (err) {
          return ''
        }
      },
      fullItemDetails (state) {
        return state.fullItemDetails
      },
      couriers (state) {
        return state.database.couriersList
      },
      selectedCourier (state) {
        return state.selectedCourier
      }
    })
  },
  methods: {
    // For Request Error chips
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
    },
    sendToHelpDesk () {
      this.$database(`/postedParcels/${this.fullItemDetails['.key']}`).transaction(post => {
        if (/retracted/g.test(post.details.status)) {
          if (post.status) {
            post.status.special = true
          } else {
            post = {
              ...post,
              status: {
                special: true
              }
            }
          }

          return post
        } else {
          return undefined
        }
      }, (error, commit, snap) => {
        this.$store.dispatch('database/setDatabase')
        if (error) {
          this.updateError = {
            dialog: true,
            message: `Unexpected error occured! ${error}`
          }
        }

        if (commit) {
          this.snackbar = true
          this.reject_dialog = false
        } else {
          this.updateError = {
            dialog: true,
            message: `Someone already handled this request.`
          }
        }
      })
    },
    rejectRequest () {
      const dateFormat = this.$moment().format('MM-DD-YYYY')
      const timeFormat = this.$moment().format('HH:mm:')

      if (navigator.onLine) {
        this.$database(`/postedParcels/${this.fullItemDetails['.key']}`).transaction(post => {
          if (post.details.status === 'pending' || /retracted/g.test(post.details.status)) {
            post.logs = {
              ...post.logs,
              [`${dateFormat}_${timeFormat}`]: {
                remarks: `Request has been rejected by ${firebase.auth().currentUser.displayName}`
              }
            }

            post.error = this.chips

            post.details.status = 'rejected'

            return post
          } else {
            return undefined
          }
        }, (error, commit, snap) => {
          this.$store.dispatch('database/setDatabase')
          if (error) {
            this.updateError = {
              dialog: true,
              message: `Unexpected error occured! ${error}`
            }
          }

          if (commit) {
            this.snackbar = true
            this.reject_dialog = false
          } else {
            this.updateError = {
              dialog: true,
              message: `Someone already handled this request.`
            }
          }
        })
      } else {
        this.updateError = {
          dialog: true,
          message: 'Network connection error!'
        }
      }
    },
    acceptClientRequest () {
      /* Set courier from pickUp, delivery, remittance
       * Push parcel id to courier routes
       * Set details status
       */
      const dateFormat = this.$moment().format('MM-DD-YYYY')
      const timeFormat = this.$moment().format('HH:mm:')

      this.$database(`/postedParcels/${this.fullItemDetails['.key']}`).transaction(post => {
        if (post.details.status === 'pending' || /retracted/.test(post.details.status)) {
          ['pickUp', 'delivery'].forEach(_ => {
            post[_].courier = this.selectedCourier[_]
          })

          post.logs = {
            ...post.logs,
            [`${dateFormat}_${timeFormat}`]: {
              remarks: `Request has been accepted by ${firebase.auth().currentUser.displayName}.`
            }
          }

          if (this.fullItemDetails.hasOwnProperty('remittance')) {
            post.remittance.courier = this.selectedCourier.remittance
          }

          post.details.status = 'assigned'

          return post
        } else {
          return undefined
        }
      }, (error, commit, snap) => {
        // Error {null|something?}
        if (error) {
          this.updateError = {
            dialog: true,
            message: `Unexpected error occured! ${error}`
          }
        }

        // Commit {true|false} operation successful or not?
        if (commit) {
          let updates = {}

          this.$_.each(['pickUp', 'delivery'], $ => {
            updates[`/couriers/${this.selectedCourier[$]}/routes/${this.fullItemDetails[$].date}`] = this.$_.map(this.$store.state.parcel_order.order[this.selectedCourier[$]][this.fullItemDetails[$].date], __ => {
              delete __['.key']
              return __
            })
          })

          if (this.fullItemDetails.hasOwnProperty('remittance')) {
            updates[`/couriers/${this.selectedCourier.remittance}/routes/${this.fullItemDetails.remittance.date}`] = this.$_.map(this.$store.state.parcel_order.order[this.selectedCourier.remittance][this.fullItemDetails.remittance.date], __ => {
              delete __['.key']
              return __
            })
          }

          this.$database()
            .update(updates)
            .then(() => {
              console.log('Successful courier update')
              this.accept_dialog = false
              this.$store.dispatch('database/setDatabase')
              this.$store.dispatch('parcel_order/resetParcelOrder')
              this.$store.dispatch('SET_FULL_ITEM_DETAILS', null)
              this.$store.dispatch('resetSelectedCouriers')
            })
            .catch(err => {
              this.updateError = {
                dialog: true,
                message: `Error updating couriers! ${err.message}`
              }
              this.$database(`/postedParcels/${this.fullItemDetails['.key']}/details`)
                .update({ status: 'pending ' })
                .then(() => console.log('Successfull rollback'))
                .catch(err => {
                  this.updateError = {
                    dialog: true,
                    message: `Data rollback failed! ${err.message}`
                  }
                })
            })
        } else {
          // TODO: not committed
        }
      })
    },
    generateKey () {
      return this.$database().push().key
    }
  }
}
</script>
