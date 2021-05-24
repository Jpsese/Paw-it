<template>
  <v-layout
    fill-height
    justify-center
    align-center
  >
    <v-flex
      v-if="dialog"
      xs4
    >
      <v-card>
        <v-container>
          <v-card-title
            class="headline roboto-con-bold pawit-text-green"
          >
            Enter email address to confirm.
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="signIn"
            >
              <v-layout justify-center>
                <v-flex xs8>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="email"
                    label="Email Address"
                    type="text"
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
                    Confirm
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      dialog: false
    }
  },
  mounted () {
    if (this.$firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        this.dialog = true
        email = this.email
      }
      // The client SDK will parse the code from the link for you.
      this.$firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          if (window.localStorage.getItem('emailForSignIn')) { window.localStorage.removeItem('emailForSignIn') }
          this.$router.go({ path: this.$router.path })
          alert('success')
        })
        .catch(err => {
          console.error(err.message)
        })
    }
  },
  methods: {
    signIn () {}
  }
}
</script>
