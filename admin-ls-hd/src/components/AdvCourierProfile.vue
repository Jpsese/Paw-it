<template>
  <v-container>
    <v-card
      height="30vh"
      class="pl-0"
      fill-height
    >
      <adv-toolbar :action="null">
        Courier profile
      </adv-toolbar>
      <adv-scrollable>
        <v-layout class="pa-3">
          <template>
            <v-flex xs4>
              <v-avatar
                size="200"
                color="grey lighten-4"
              >
                <v-icon size="150">
                  person
                </v-icon>
              </v-avatar>
            </v-flex>
            <v-flex
              xs8
              class="pl-4"
            >
              <table>
                <tr>
                  <td class="header pawit-text-gray-3 headline roboto-con-bold">
                    Name:
                  </td>
                  <td
                    class="pawit-text-gray-3 headline roboto-con-medium"
                  >
                    {{ data.firstName }} {{ data.lastName }}
                  </td>
                </tr>
                <tr>
                  <td class="header pawit-text-gray-3 headline roboto-con-bold">
                    Contact Number:
                  </td>
                  <td class="pawit-text-gray-3 headline roboto-con-medium">
                    {{ data.contactNumber }}
                  </td>
                </tr>
                <tr>
                  <td class="header pawit-text-gray-3 headline roboto-con-bold">
                    Status:
                  </td>
                  <td class="pawit-text-gray-3 headline roboto-con-medium">
                    {{ data.status }}
                  </td>
                </tr>
                <tr>
                  <td class="header pawit-text-gray-3 headline roboto-con-bold">
                    MV Plate Number:
                  </td>
                  <td
                    class="pawit-text-gray-3 headline roboto-con-medium"
                  >
                    {{ data.vehiclePlateNumber }}
                  </td>
                </tr>
                <tr>
                  <td class="header pawit-text-gray-3 headline roboto-con-bold">
                    Day-off:
                  </td>
                  <td
                    v-if="!editDayOff"
                    class="pawit-text-gray-3 headline roboto-con-medium"
                  >
                    {{ data.dayOff ? data.dayOff : '' }}
                    <v-icon
                      class="pawit-text-green"
                      @click="editDayOff = true"
                    >
                      create
                    </v-icon>
                  </td>
                  <td v-if="editDayOff">
                    <v-select
                      v-model="data.dayOff"
                      :value="data.dayOff"
                      :items="days"
                    />
                  </td>
                </tr>
                <tr v-if="editDayOff">
                  <td />
                  <td>
                    <div>
                      <v-btn
                        class="pawit-green pawit-text-gray-1"
                        @click="updateDayOff()"
                      >
                        Save
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </table>
            </v-flex>
          </template>
        </v-layout>
      </adv-scrollable>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
      editDayOff: false,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  methods: {
    updateDayOff () {
      console.log(this.data['.key'])
      this.$database(`/couriers/${this.data['.key']}`)
        .update({
          dayOff: this.data.dayOff
        })
        .then((this.editDayOff = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
  color: white;
}

.profileAvatar {
  width: 100% !important;
  height: 100% !important;
}

table {
  td.header {
    width: 200px;
  }
}
</style>
