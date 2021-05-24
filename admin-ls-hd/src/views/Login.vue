<template>
  <v-layout
    fill-height
    align-center
  >
    <v-layout
      v-if="!$store.state.loader"
      justify-center
    >
      <v-flex xs3>
        <v-container>
          <v-card>
            <v-container class="pa-5">
              <img
                :src="require('@/assets/new_brand.png')"
                width="300px"
                class="center"
              >
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="login"
              >
                <v-text-field
                  v-model="email"
                  prepend-icon="email"
                  :rules="emailRules"
                  label="Email Address"
                  required
                />
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                />
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
                      Login
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-divider />
                <v-layout>
                  <v-flex xs12>
                    <v-btn
                      flat
                      block
                      color="blue darken-1"
                      @click="emailDialog = true"
                    >
                      Sign in with Email Link
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        v-if="emailDialog"
        xs4
      >
        <v-dialog
          v-model="emailDialog"
          max-width="400"
        >
          <v-card>
            <v-container>
              <v-card-title>Enter your email address</v-card-title>
              <v-text-field
                v-model="email"
                prepend-icon="email"
                label="Email Address"
                required
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="red darken-1"
                  flat
                  @click="loginWithEmailLink(email)"
                >
                  Send sign-in link to email
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      password: '',
      dialog: false,
      emailDialog: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [v => !!v || 'Password is Required'],
      alert: false,
      errorMessage: '',
      users: [],
      user: null
    }
  },
  watch: {
    email: {
      handler () {
        this.alert = false
      }
    },
    password: {
      handler () {
        this.alert = false
      }
    }
  },
  firebase () {
    return {
      users: this.$database('/employees')
    }
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        this.valid = true
        this.$store.commit('LOADER', true)
        this.$firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(u => {
            this.$_.each(Object.keys(this.users), us => {
              if (this.users[us]['.key'] === u.user.uid) {
                this.user = this.users[us]
              }
            })
            if (
              this.user.role !== 'Logistics Supervisor' &&
              this.user.role !== 'Admin' &&
              this.user.role !== 'Help Desk Officer'
            ) {
              console.log('check')
              this.errorMessage =
                'This user is restricted to access the system.'
              this.$firebase
                .auth()
                .signOut()
                .then(() => {
                  // alert(this.alert, this.errorMessage, 'This user is restricted to access the system.')
                })
              // this.$refs.form.reset()
            } else {
              window.location.replace('/home')
              this.$store.commit('SET_USER', this.user)
            }
          })
          .catch(err => {
            this.$store.commit('LOADER', false)
            var errCode = err.code
            var errMessage = err.message
            if (errCode === 'auth/wrong-password') {
              this.alert = true
              this.errorMessage = 'Incorrect Password'
            } else if (errCode === 'auth/user-not-found') {
              this.alert = true
              this.errorMessage = 'User not Found'
            } else alert(errMessage)
            console.log(err)
          })
      }
    },
    resend () {
      this.$firebase.auth().currentUser.sendEmailVerification()
    },
    loginWithEmailLink (email) {
      var actionCodeSettings = {
        url: 'http://localhost:8080/signinwithemaillink',
        handleCodeInApp: true
      }
      this.$firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem('emailForSignIn', email)
          alert('Email sent.')
        })
        .catch(err => {
          alert(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
