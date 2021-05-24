<template>
  <v-layout
    fill-height
    style="overflow-y: hidden;"
  >
    <!-- Courier List -->
    <v-flex xs2>
      <v-container fill-height>
        <v-card
          height="100%"
          width="100%"
        >
          <adv-toolbar :action="null">
            Couriers
          </adv-toolbar>
          <v-card
            v-for="courier in couriers"
            :key="courier['.key']"
            flat
            class="pa-3 chover"
            :class="{selected: selected == courier}"
            @click="getCourierParcels(courier), selected = courier"
          >
            <v-layout>
              <v-flex xs4>
                <v-avatar
                  :size="50"
                  color="grey lighten-4"
                >
                  <v-icon size="30">
                    person
                  </v-icon>
                  <!-- <img
                    :src="courier.imgUrl"
                    alt="avatar"
                  > -->
                </v-avatar>
              </v-flex>
              <v-flex xs8>
                <div
                  class="title roboto-con-bold pawit-text-green"
                >
                  {{ courier.firstName }} {{ courier.lastName }}
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-card>
      </v-container>
    </v-flex>
    <v-flex xs5>
      <v-container fill-height>
        <v-card
          height="100%"
          width="100%"
        >
          <adv-toolbar :action="null">
            Assigned parcels
          </adv-toolbar>
          <v-card-text style="overflow-y: scroll; height: 100%">
            <v-layout>
              <v-flex
                xs4
                offset-xs8
                class="pl-4 pr-4 pt-2"
              >
                <v-menu
                  v-if="selected"
                  ref="menu1"
                  v-model="menu1"
                  class="mt-0 pt-0"
                  :close-on-content-click="true"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateFormatted"
                      prepend-icon="event"
                      class="mt-0 pt-0"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                  />
                </v-menu>
              </v-flex>
            </v-layout>
            <v-alert
              v-model="alert"
              type="success"
            >
              {{ alertMessage }}
            </v-alert>
            <v-data-table
              :key="JSON.stringify({courierActivities, couriers, parcels})"
              hide-actions
              :headers="headers"
              :items="$_.uniqWith(courierActivities, $_.isEqual)"
              select-all
              item-key="date"
              :no-data-text="noDataMessage"
            >
              <template v-slot:headers="props">
                <tr>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                  >
                    {{ header.text }}
                  </th>
                </tr>
              </template>
              <template v-slot:items="props">
                <tr @click="getParcelInfo(props.item.pid)">
                  <td class="pt-2 pb-2 parcel">
                    <div class="text-capitalize">
                      {{ props.item.activity }} ({{ props.item.time }})
                    </div>
                    <div class="text-truncate">
                      {{ props.item.location.address }}
                    </div>
                    <div>{{ props.item.pid }}</div>
                  </td>
                  <td>
                    <v-layout class="ml-5">
                      <v-btn
                        v-if="!props.item.done"
                        class="pawit-green pawit-text-gray-1"
                        @click="forRetraction = props.item ,dialog=true"
                      >
                        Retract
                      </v-btn>
                      <v-btn
                        v-else
                        class="pawit-green pawit-text-gray-1"
                        disabled
                      >
                        Done
                      </v-btn>
                    </v-layout>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <v-spacer />
            <!-- <v-layout v-if="isSelected && courierActivities.length > 1">
              <v-btn
                color="pawit-green pawit-text-gray-1"
                @click="retractAllDialog = true"
              >
                Retract All
              </v-btn>
            </v-layout> -->
          </v-card-text>
        </v-card>
        <!-- <adv-courier-assigned-parcels
          :key="JSON.stringify({courierActivities, courierInfo})"
          :data-prop="courierActivities"
          :courier="courierInfo"
          :checkCourier="this.isSelected"
        ></adv-courier-assigned-parcels>-->
      </v-container>
      <!-- Retraction Area -->
    </v-flex>
    <v-flex xs5>
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <adv-courier-profile
            v-if="isSelected"
            :data="courierInfo"
          />
        </v-flex>
        <v-flex
          v-if="selectedActivity"
          xs12
        >
          <v-container fill-height>
            <v-card
              width="100%"
              height="50vh"
              class="pl-0"
              fill-height
            >
              <adv-toolbar :action="null">
                Parcel details
              </adv-toolbar>
              <adv-scrollable>
                <adv-full-parcel-details :for-assigning="false" />
              </adv-scrollable>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-layout
      v-if="dialog"
      row
      justify-center
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="400"
      >
        <v-card>
          <v-card-title class="headline pawit-yellow pawit-text-gray-1">
            Confirmation
          </v-card-title>
          <v-card-text>Retract parcel "{{ forRetraction.pid }}" {{ forRetraction.activity }} activity of {{ getCourierName(forRetraction.courier) }}?</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red darken-1"
              flat
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              flat
              @click="retract(forRetraction), dialog=false"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout
      v-if="retractAllDialog"
      row
      justify-center
    >
      <v-dialog
        v-model="retractAllDialog"
        persistent
        max-width="400"
      >
        <v-card>
          <v-card-title class="headline pawit-yellow pawit-text-gray-1">
            Confirmation
          </v-card-title>
          <v-card-text>Retract all activities of {{ getCourierName(courierActivities[0].courier) }} on this day?</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red darken-1"
              flat
              @click="retractAllDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              flat
              @click="retractAll(), retractAllDialog = false"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/plugins/firebase'
import { objectToList } from '@/utils/objectToList'

export default {
  data () {
    return {
      isSelected: false,
      parcelInfo: false,
      selected: null,
      dialog: false,
      retractAllDialog: false,
      selectedActivity: null,
      menu1: false,
      courierInfo: null,
      courierActivities: [],
      date: null,
      forRetraction: null,
      noDataMessage: 'No courier selected',
      dateFormatted: this.$moment().format('MM-DD-YYYY'),
      // dateFormatted: '06-08-2019',
      checkbox1: true,
      alert: false,
      alertMessage: '',
      headers: [
        {
          text: 'Parcels'
        },
        {
          text: 'Action'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      couriers (state) {
        return state.database.couriersList
      },
      parcels (state) {
        return state.database.requestsObj
      },
      couriersObj (state) {
        return state.database.couriersObj
      }
    })
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    },
    dateFormatted (val) {
      try {
        this.getCourierParcels(this.selected)
      } catch (err) {
        /* Empty */
      }
      this.dateFormatted = this.dateFormatted
    }
    // parcels (val) {
    //   try {
    //     if (this.selected) this.getCourierParcels(this.selected)
    //   } catch (err) {}
    //   this.getCourierParcels(this.selected)
    // }
  },
  methods: {
    getCourierParcels (c) {
      this.$store.dispatch('database/setDatabase')
      try {
        this.isSelected = true
        this.courierInfo = c
        this.courierActivities = []
        if (this.couriersObj[c['.key']].hasOwnProperty('routes')) {
          if (this.couriersObj[c['.key']].routes.hasOwnProperty(this.dateFormatted)) {
            this.$_.each(objectToList(this.couriersObj[c['.key']].routes[this.dateFormatted]), ({ parcelID, status }) => {
              if (!/retracted/g.test(this.parcels[parcelID].details.status)) {
                this.courierActivities.push({
                  courier: c['.key'],
                  inWarehouse: this.parcels[parcelID].status ? !this.parcels[parcelID].status.activity : null,
                  pid: parcelID,
                  activity: status,
                  ...this.parcels[parcelID][status]
                })
              }
            })
          }
        }
        if (this.courierActivities.length === 0) { this.noDataMessage = 'No available activity of courier on this day.' }
      } catch (err) {
        /* Empty */
      }
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}-${day}-${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getCourierName (cid) {
      return `${this.$_.find(this.couriers, { '.key': cid }).firstName} ${
        this.$_.find(this.couriers, { '.key': cid }).lastName
      }`
    },
    retract (activity) {
      const dateFormat = this.$moment().format('MM-DD-YYYY')
      const timeFormat = this.$moment().format('HH:mm')
      this.alert = false

      if (navigator.onLine) {
        this.$database(`/postedParcels/${activity.pid}`).transaction(post => {
          if (post.details.status !== 'retracted') {
            post.logs = {
              ...post.logs,
              [`${dateFormat}_${timeFormat}`]: `This parcel's ${activity.activity} activity has been retracted from courier (${this.$_.find(this.couriers, { '.key': activity.courier }).firstName} ${this.$_.find(this.couriers, { '.key': activity.courier }).lastName}) by ${firebase.auth().currentUser.displayName}.`
            }

            post[activity.activity].courier = null

            post.details.status = `retracted-${activity.activity}`

            return post
          } else {
            return undefined
          }
        }, (error, commit, snap) => {
          if (error) {
            this.updateError = {
              dialog: true,
              message: `Unkown error occured! ${error}`
            }
          }

          if (commit) {
            this.$database(`/couriers/${activity.courier}/routes/${activity.date}/${this.$_.findKey(this.$_.find(this.couriers, { '.key': activity.courier }).routes[activity.date], { parcelID: activity.pid })}`).remove()
              .then(() => {
                this.getCourierParcels(this.selected)
              })
              .catch(err => {
                this.updateError = {
                  dialog: true,
                  message: err.message
                }
                this.$database(`/postedParcels/${activity.pid}`).transaction(post => {
                  if (post.details.status === 'retracted') {
                    post.logs = {
                      ...post.logs,
                      [`${dateFormat}_${timeFormat}`]: `This parcel's ${activity.activity} activity has been reassigned to courier (${this.$_.find(this.couriers, { '.key': activity.courier }).firstName} ${this.$_.find(this.couriers, { '.key': activity.courier }).lastName}) by ${firebase.auth().currentUser.displayName}.`
                    }

                    post[activity.activity].courier = activity.courier
                  } else {
                    return undefined
                  }
                }, (err, com) => {
                  if (err) {
                    this.updateError = {
                      dialog: true,
                      message: `Rollback Error! ${error}`
                    }
                  }

                  if (!com) {
                    this.updateError = {
                      dialog: true,
                      message: 'This transaction was handled by other logistic supervisor!'
                    }
                  }
                })
              })
          }
        })
      } else {
        this.updateError = {
          dialog: true,
          message: 'Network connection error!'
        }
      }
    },
    retractAll () {
      let tmp = []
      this.alert = false
      const courierName =
        this.$_.find(this.couriers, { '.key': this.courierInfo['.key'] })
          .firstName +
        ' ' +
        this.$_.find(this.couriers, { '.key': this.courierInfo['.key'] })
          .lastName
      this.$_.each(this.courierActivities, d => {
        if (!d.done) tmp.push({ act: d.activity, pid: d.pid, date: d.date })
      })
      this.$_.each(tmp, t => {
        const index = this.courierActivities.indexOf(t)
        let routeKey = this.$_.findKey(
          this.$_.find(this.couriers, { '.key': this.courierInfo['.key'] })
            .routes[t.date],
          { parcelID: t.pid }
        )
        this.$database(
          `/postedParcels/${t.pid}/logs/${this.$moment().format(
            'MM-DD-YYYY'
          )}_${this.$moment().format('HH:mm')}`
        )
          .update({
            remarks: `This parcel's ${
              t.act
            } activity has been retracted from courier (${courierName}) by ${
              firebase.auth().currentUser.displayName
            }.`
          })
          .then(
            this.$database(`/postedParcels/${t.pid}/${t.act}/courier`).remove()
          )
          .then(() => this.courierActivities.splice(index, 1))
          .then(
            () =>
              (this.alertMessage = `All activities of courier ${courierName} has been successfully retracted`)
          )
          .then(() =>
            this.$database(
              `/couriers/${this.courierInfo['.key']}/routes/${
                t.date
              }/${routeKey}`
            ).remove()
          )
          .then(() => (this.alert = true))
      })
    },
    getParcelInfo (p) {
      this.selectedActivity = this.parcels[p]
      this.selectedActivity['.key'] = p
      this.$store.dispatch('SET_FULL_ITEM_DETAILS', this.selectedActivity)
    }
  }
}
</script>

<style lang="scss" scoped>
.selected {
  background-color: #f1f1ef;
}

.chover:hover {
  background-color: #f1f1ef;
}

.card-title {
  color: white;
}

.dataTable .v-table tbody tr:not(:last-child) {
  border-bottom: none;
}
label.v-label.theme--light {
  color: #fff !important;
}

// .parcel {
//   max-width: 200px !important;
// }
</style>
