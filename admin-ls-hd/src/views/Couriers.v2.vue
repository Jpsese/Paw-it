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
          <adv-scrollable>
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
                :key="JSON.stringify({courierActivities, couriers})"
                hide-actions
                :headers="[
                  {
                    text: 'Parcels'
                  },
                  {
                    text: 'Action'
                  }
                ]"
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
            </v-card-text>
          </adv-scrollable>
        </v-card>
      </v-container>
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
        <v-flex xs12>
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
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      isSelected: null,
      selected: null,
      alert: false,
      alertMessage: null,
      courierActivities: [],
      date: null,
      dateFormatted: this.$moment().format('MM-DD-YYYY'),
      noDataMessage: 'No courier selected',
      menu1: null,
      forRetraction: null,
      dialog: false
    }
  },
  computed: {
    ...mapState({
      couriers (state) {
        return state.database.couriersList
      },
      couriersObj (state) {
        return state.database.live_couriers_obj
      },
      parcels (state) {
        return state.database.requestsObj
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
      } catch (err) { }
      this.dateFormatted = this.dateFormatted
    },
    couriersObj (val) {
      this.selected && this.getCourierParcels(this.selected)
    }
  },
  methods: {
    retract (activity) {
      const dateFormat = this.$moment().format('MM-DD-YYYY')
      const timeFormat = this.$moment().format('HH:mm')
      this.alert = false

      if (navigator.onLine) {
        this.$database(`/postedParcels/${activity.pid}`).transaction(post => {
          if (!/retracted/g.test(post.details.status) || post.details.status === 'undelivered') {
            post.logs = {
              ...post.logs,
              [`${dateFormat}_${timeFormat}`]: `This parcel's ${activity.activity} activity has been retracted from courier (${this.$_.find(this.couriers, { '.key': activity.courier }).firstName} ${this.$_.find(this.couriers, { '.key': activity.courier }).lastName}) by ${this.$firebase.auth().currentUser.displayName}.`
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
              message: `Unknown error occured! ${error}`
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
                      [`${dateFormat}_${timeFormat}`]: `This parcel's ${activity.activity} activity has been reassigned to courier (${this.$_.find(this.couriers, { '.key': activity.courier }).firstName} ${this.$_.find(this.couriers, { '.key': activity.courier }).lastName}) by ${this.$firebase.auth().currentUser.displayName}.`
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
          } else {
            this.updateError = {
              dialog: true,
              message: 'Update unsuccessful!'
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
    getCourierParcels (courier) {
      if (this.couriersObj[courier['.key']].routes) {
        let parcels = []
        for (const [k, v] of Object.entries(this.couriersObj[courier['.key']].routes)) {
          this.$_.each(this.$_.compact(v), $ => {
            if (!/retracted/g.test(this.parcels[$.parcelID].details.status) && this.parcels[$.parcelID].details.status !== 'completed') {
              let clone = this.parcels[$.parcelID][$.status]
              clone.date = k
              clone.activity = $.status
              clone.pid = $.parcelID
              clone.done = $.done

              parcels.push(clone)
            }
          })
        }

        this.courierActivities = parcels
      } else {
        this.courierActivities = []
        this.$store.dispatch('SET_FULL_ITEM_DETAILS', null)
      }
    },
    getCourierName (cid) {
      return `${this.couriersObj[cid].lastName}, ${this.couriersObj[cid].firstName}`
    },
    getParcelInfo (key) {
      this.$store.dispatch('SET_FULL_ITEM_DETAILS', this.parcels[key])
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
</style>
