<template>
  <v-layout>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title
          class="roboto-con-bold pawit-text-yellow headline pawit-gray-1"
        >
          Update password
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="updatePassword"
            >
              <v-layout
                column
                justify-center
              >
                <v-flex xs8>
                  <v-text-field
                    v-model="currentPassword"
                    prepend-icon="lock"
                    :rules="passwordRules"
                    label="Current password"
                    type="password"
                    required
                  />
                </v-flex>
                <v-divider />
                <v-flex xs8>
                  <v-text-field
                    v-model="password"
                    prepend-icon="lock"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    required
                  />
                  <v-text-field
                    v-model="confPassword"
                    prepend-icon="lock"
                    :rules="passwordRules"
                    label="Confirm Password"
                    type="password"
                    required
                  />
                </v-flex>
              </v-layout>
              <v-alert
                dismissible
                :value="alert"
                type="error"
              >
                {{ errorMessage }}
              </v-alert>
              <v-layout>
                <v-flex
                  xs12
                  sm4
                  offset-sm4
                >
                  <v-btn
                    block
                    :disabled="!valid"
                    color="pawit-green pawit-text-gray-1"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ successMessage }}
    </v-snackbar>
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="item in items"
          :key="item.title"
          :xs3="new RegExp(user.role).test(item.role)"
          :shrink="new RegExp(user.role).test(item.role) ? false : true"
          class="pa-3"
        >
          <template v-if="new RegExp(user.role).test(item.role)">
            <v-card
              hover
              :to="item.link"
              class="text-xs-center"
            >
              <v-card-title
                class="roboto-con-bold headline pawit-text-yellow pawit-gray-1"
              >
                {{ item.title }}
              </v-card-title>
              <v-layout justify-center>
                <v-flex xs6>
                  <v-img
                    :src="item.img"
                    contain
                    style="width: 100%"
                    class="mt-3"
                  />
                </v-flex>
              </v-layout>
              <v-card-text class="roboto-con-regular subheading">
                {{ item.info }}
              </v-card-text>
            </v-card>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      user: null,
      dialog: false,
      currentPassword: '',
      password: '',
      confPassword: '',
      passwordRules: [v => !!v || 'Password is Required'],
      valid: false,
      errorMessage: null,
      alert: false,
      snackbar: false,
      successMessage: '',
      timeout: 6000,
      y: 'top',
      x: null,
      mode: '',
      items: [
        {
          title: 'View incoming requests',
          info: 'Verify and assign couriers to parcels',
          link: '/requests',
          role: 'Logistics Supervisor',
          img: require('@/assets/archive.png')
        },
        {
          title: 'View couriers',
          info: 'View and retract assigned activities to couriers.',
          link: '/couriers',
          role: 'Logistics Supervisor',
          img: require('@/assets/delivery-man.png')
        },
        {
          title: 'View retracted parcels',
          info: 'Reassign retracted parcel activities to couriers',
          link: '/retracted',
          role: 'Logistics Supervisor',
          img: require('@/assets/rejected.png')
        },
        {
          title: 'View parcels',
          info: "View parcels' information and activity history.",
          link: '/parcels',
          role: 'Logistics Supervisor, Help Desk Officer',
          img: require('@/assets/box.png')
        },
        {
          title: 'View and add accounts',
          info:
            'View, edit, and add accounts of different roles in the system.',
          link: '/account-management',
          role: 'Admin',
          img: require('@/assets/team.png')
        },
        {
          title: 'View reported parcels',
          info: 'View reported parcels for special handling',
          link: '/specialparcels',
          role: 'Help Desk Officer',
          img: require('@/assets/customer-service.png')
        }
      ]
    }
  },
  // watch: {
  //   user(val) {
  //     this.dialog = !this.user.updated_password;
  //   }
  // },
  firebase () {
    return {
      user: this.$database(
        `/employees/${this.$firebase.auth().currentUser.uid}`
      )
    }
  },
  methods: {
    updatePassword () {

    }
  }
}
</script>
