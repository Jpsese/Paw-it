<template>
  <v-app>
    <v-toolbar
      v-if="isLoggedIn"
      height="45"
      app
      flat
    >
      <v-toolbar-title>
        <img
          :src="require('@/assets/new_brand.png')"
          width="80px"
        >
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <!-- <v-btn v-for="item in items" :key="item.title" flat router :to="item.link">
          <span class="pawit-text-green text-capitalize">{{ item.title }}</span>
        </v-btn>-->
        <v-btn
          flat
          to="/home"
        >
          <span class="pawit-text-green text-capitalize">Home</span>
        </v-btn>
        <template v-if="user.role === 'Logistics Supervisor'">
          <v-btn
            flat
            to="/requests"
          >
            <span class="pawit-text-green text-capitalize">Incoming Requests</span>
          </v-btn>
          <v-btn
            flat
            to="/couriers"
          >
            <span class="pawit-text-green text-capitalize">Couriers</span>
          </v-btn>
          <v-btn
            flat
            to="/retracted"
          >
            <span class="pawit-text-green text-capitalize">Retracted Requests</span>
          </v-btn>
        </template>
        <v-btn
          v-if="user.role === 'Logistics Supervisor' || user.role === 'Logistics Supervisor'"
          flat
          to="/parcels"
        >
          <span class="pawit-text-green text-capitalize">Parcel History</span>
        </v-btn>
        <v-btn
          v-if="user.role === 'Admin'"
          flat
          to="/account-management"
        >
          <span class="pawit-text-green text-capitalize">Account Management</span>
        </v-btn>
        <v-btn
          v-if="user.role === 'Help Desk Officer'"
          flat
          to="/specialparcels"
        >
          <span class="pawit-text-green text-capitalize">Special Parcels</span>
        </v-btn>
        <v-btn
          v-if="user.role === 'Help Desk Officer'"
          flat
          to="/parcels"
        >
          <span class="pawit-text-green text-capitalize">Parcels History</span>
        </v-btn>
        <v-btn
          class="text-capitalize pawit-text-green"
          flat
          @click="dataGenerateDialog = true"
        >
          <span class="pawit-text-green text-capitalize">Generate Data</span>
        </v-btn>
        <v-btn
          class="text-capitalize pawit-text-green"
          flat
          @click="logout()"
        >
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-layout
        row
        justify-center
        align-center
      >
        <v-dialog
          v-model="dialog"
          persistent
          no-click-animation
          max-width="400"
        >
          <v-card
            justify-center
            align-center
          >
            <v-container class="text-xs-center">
              <v-img
                :src="require('@/assets/new_brand.png')"
                contain
                class="center"
              />
              <v-card-title
                class="subheading"
              >
                Trying to establish connection with the database. Please wait a moment.
              </v-card-title>
              <v-progress-linear
                :indeterminate="true"
                color="green"
              />
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
      <v-layout>
        <div class="text-xs-center">
          <v-dialog
            v-model="dataGenerateDialog"
            width="500"
          >
            <adv-generate-data />
          </v-dialog>
        </div>
      </v-layout>
      <router-view />
      <adv-loading-page />
    </v-content>
  </v-app>
</template>

<script>
import firebase from './plugins/firebase'

export default {
  data () {
    return {
      dataGenerateDialog: false,
      dialog: false,
      isLoggedIn: false,
      isLoading: false,
      user: {}
    }
  },
  created () {
    this.$store.dispatch('database/setDatabase')
    this.$store.dispatch('database/setEmployeesObj')
    this.$store.dispatch('database/setEmployeesList')
    this.$store.dispatch('database/setSystemParam')
    this.$store.dispatch('database/setLiveRequestObj')
    this.$store.dispatch('database/setLiveCouriersObj')

    if (firebase.auth().currentUser) {
      this.isLoggedIn = true
      this.$store.commit('LOADER', false)
    }
  },
  firebase () {
    return {
      user: this.$database(`/employees/${this.$firebase.auth().currentUser.uid}`)
    }
  },
  mounted () {
    var connectedRef = firebase.database().ref('.info/connected')
    connectedRef.on('value', snap => {
      this.$store.dispatch('SET_DB_CONNECTION', snap.val())
      this.dialog = !snap.val()
    })
  },
  methods: {
    logout () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: '/login' })
        })
    }
  }
}
</script>

<style lang="scss">
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;

  &:hover {
    background-color: #b7b7b7;
  }
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #4e4d4d;

  &:hover {
    background-color: #777575;
  }
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}

$font-weights: 300, 300, 400, 400, 700, 700;
$font-weight-name: light, light-i, regular, regular-i, bold, bold-i;

// @import url('https://fonts.googleapis.com/css?family=Righteous');
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i");

.roboto-con {
  font-family: "Roboto Condensed", sans-serif !important;
}

@each $weight in $font-weights {
  $i: index($font-weights, $weight);

  .roboto-con-#{nth($font-weight-name, $i)} {
    font-family: "Roboto Condensed", sans-serif !important;
    font-weight: $weight !important;
  }

  .roboto-con-i-#{nth($font-weight-name, $i)} {
    font-family: "Roboto Condensed", sans-serif !important;
    font-weight: $weight !important;
    font-style: italic !important;
  }
}

.pawit-green {
  background-color: #34421e !important;
}

.pawit-yellow {
  background-color: #c19434 !important;
}

.pawit-gray-1 {
  background-color: #f1f1ef !important;
}

.pawit-gray-2 {
  background-color: #b7b7b7 !important;
}

.pawit-gray-3 {
  background-color: #363636 !important;
}

.pawit-text-green {
  color: #34421e !important;
}

.pawit-text-yellow {
  color: #c19434 !important;
}

.pawit-text-gray-1 {
  color: #f1f1ef !important;
}

.pawit-text-gray-2 {
  color: #b7b7b7 !important;
}

.pawit-text-gray-3 {
  color: #363636 !important;
}
</style>
