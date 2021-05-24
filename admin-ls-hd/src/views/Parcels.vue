<template>
  <v-layout
    fill-height
    style="overflow-y: hidden;"
  >
    <!-- Parcel List -->
    <v-flex xs3>
      <v-container fill-height>
        <v-card
          width="100%"
          height="100%"
        >
          <adv-toolbar :action="null">
            Parcels
          </adv-toolbar>
          <adv-scrollable>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="parcels"
              :search="search"
              hide-headers
              hide-actions
            >
              <template v-slot:items="props">
                <td
                  class="pt-2"
                  :class="{ selected: selected == props.item}"
                  @click="select(props.item), selected = props.item, $store.dispatch('SET_FULL_ITEM_DETAILS', props.item)"
                >
                  <tr
                    class="pawit-text-gray-3 roboto-con-bold title"
                  >
                    {{ props.item.details.parcelID }}
                  </tr>
                  <tr
                    class="roboto-con-regular subheading pawit-text-gray-2"
                  >
                    Posted: {{ props.item.details.datePosted }} @{{ props.item.details.timePosted }}
                  </tr>
                </td>
              </template>
              <template v-slot:no-results>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                >
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </template>
            </v-data-table>
            <!-- <v-list two-line class="pa-0">
            <template>-->
            <!-- <v-list-tile
                  v-for="parcel in parcels"
                  :key="parcel['.key']"
                  v-bind:class="{selected : selected == parcel}"
                  @click="select(parcel)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ parcel['.key'] }}</v-list-tile-title>
                    <v-list-tile-sub-title>Posted: {{ parcel.log.posted.date }} @{{ parcel.log.posted.time}}</v-list-tile-sub-title>
                  </v-list-tile-content>
            </v-list-tile>-->
            <!-- </template> -->
            <!-- </v-list> -->
          </adv-scrollable>
        </v-card>
      </v-container>
    </v-flex>

    <template v-if="selected">
      <!-- Parcel Details -->
      <v-flex xs5>
        <v-container
          ref="el"
          class="pl-0"
          fill-height
        >
          <v-card
            width="100%"
            height="100%"
          >
            <adv-toolbar :action="null">
              Parcel details
            </adv-toolbar>
            <adv-scrollable>
              <adv-full-parcel-details
                v-if="selected"
                :request-info="selected"
                :for-assigning="false"
              />
              <v-card-text
                v-else
                class="text-xs-center headline roboto-con-medium"
              >
                No Parcel Selected
              </v-card-text>
            </adv-scrollable>
          </v-card>
        </v-container>
      </v-flex>

      <v-flex xs4>
        <v-container
          fill-height
          class="pl-0"
        >
          <v-card
            width="100%"
            height="100%"
          >
            <adv-toolbar :action="null">
              History log
            </adv-toolbar>
            <adv-scrollable>
              <v-card-text>
                <v-list three-line>
                  <v-list-tile
                    v-for="l in logs"
                    :key="`${l.remarks}-${l.date}-${l.time}`"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title class="text-capitalize">
                        {{ l.date }} @{{ l.time }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title style="overflow-wrap: break-word;">
                        {{ l.remarks }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </adv-scrollable>
          </v-card>
        </v-container>
      </v-flex>
    </template>
    <template v-else>
      <v-flex
        xs9
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
            <div class="roboto-con-i-bold pawit-text-yellow headline">
              Please select a request to display information.
            </div>
          </v-container>
        </v-layout>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      search: '',
      selected: null,
      logs: [],
      headers: [
        {
          name: 'Parcel ID',
          value: 'details.parcelID'
        },
        {
          name: 'Status',
          value: 'details.status'
        },
        {
          name: 'Date Posted',
          value: 'details.datePosted'
        },
        {
          name: 'Pouch Size',
          value: 'details.pouchSize'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      parcels (state) {
        return state.database.requestsList
      }
    })
  },
  methods: {
    select (p) {
      this.selected = p
      this.logs = []

      if (p.logs) {
        this.$_.each(Object.keys(p.logs), l => {
          this.$_.each(p.logs[l], (k, i) => {
            let tmp = []
            let trial = l.split('_')
            tmp.date = trial[0]
            tmp.time = trial[1]
            tmp.remarks = k
            tmp.count = i
            this.logs.push(tmp)
          })
        })

        this.logs.push({
          date: p.details.datePosted,
          time: p.details.timePosted,
          remarks: 'Request has been posted',
          count: 0
        })
      } else {
        this.logs.push({
          date: p.details.datePosted,
          time: p.details.timePosted,
          remarks: 'Request has been posted',
          count: 0
        })
      }
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

tr {
  border: none !important;
}
</style>
