<template>
  <v-container>
    <v-layout>
      <v-flex
        xs8
        fill-height
        height="100%"
      >
        <v-container>
          <adv-toolbar :action="null">
            Employees
          </adv-toolbar>
          <v-data-table
            :headers="headers"
            :items="users"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>{{ props.item.first_name }} {{ props.item.last_name }}</td>
              <td>{{ props.item.role }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.active }}</td>
              <td>{{ props.item.date_registered }}</td>
              <td>
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  edit
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-container>
      </v-flex>
      <v-flex xs4>
        <v-container>
          <adv-toolbar :action="null">
            Registration
          </adv-toolbar>
          <v-card>
            <v-container class="pa-5">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="register"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs6>
                    <v-text-field
                      v-model="registrationForm.first_name"
                      prepend-icon="account_circle"
                      :rules="otherRules"
                      label="First Name"
                      required
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="registrationForm.last_name"
                      :rules="otherRules"
                      label="Last Name"
                      required
                      class="pl-3"
                    />
                  </v-flex>
                </v-layout>
                <v-flex xs12>
                  <v-select
                    v-model="registrationForm.role"
                    prepend-icon="account_circle"
                    :items="roles"
                    :rules="otherRules"
                    label="Role"
                    required
                  />
                </v-flex>
                <template v-if="registrationForm.role === 'Courier'">
                  <v-text-field
                    v-model="registrationForm.contactNumber"
                    prepend-icon="local_phone"
                    label="Contact Number"
                    required
                  />
                  <v-text-field
                    v-model="registrationForm.vehiclePlateNumber"
                    prepend-icon="motorcycle"
                    label="MV Plate Number"
                    required
                  />
                  <v-text-field
                    v-model="registrationForm.dayOff"
                    prepend-icon="calendar_today"
                    label="Day Off"
                    required
                  />
                </template>
                <v-flex xs12>
                  <v-text-field
                    v-model="registrationForm.email"
                    prepend-icon="email"
                    :rules="emailRules"
                    label="Email Address"
                    required
                  />
                </v-flex>
                <v-text-field
                  v-model="registrationForm.password"
                  prepend-icon="lock"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                />
                <v-text-field
                  v-model="registrationForm.confirmPassword"
                  prepend-icon="lock"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  type="password"
                  required
                />
                <v-alert
                  dismissible
                  :value="alert"
                  color="rgba(0,0,0,0)"
                  type="error"
                  class="pawit-text-gray-2"
                >
                  {{ errorMessage }}
                </v-alert>
                <v-alert
                  dismissible
                  :value="registered"
                  color="rgba(0,0,0,0)"
                  type="error"
                  class="pawit-text-gray-2"
                >
                  {{ successMessage }}
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
                      Register
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="dialog.value"
      width="25%"
    >
      <v-toolbar>
        <v-toolbar-title>Edit employee information</v-toolbar-title>
        <v-spacer />
        <v-btn
          flat
          icon
          @click="dialog.value = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-form @submit.prevent="saveChanges">
          <v-card-text>
            <v-text-field
              v-model="dialog.fname"
              required
              label="First name"
            />
            <v-text-field
              v-model="dialog.lname"
              required
              label="Last name"
            />
            <v-select
              v-model="dialog.role"
              :items="roles"
              label="Role"
            />
            <v-layout justify-end>
              <v-flex shrink>
                <v-switch
                  v-model="dialog.activated"
                  label="Active"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              type="submit"
              color="primary"
              depressed
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="errorDialog.value"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Unexpected error occured!</v-toolbar-title>
          <v-spacer />
          <v-btn
            flat
            icon
            @click="errorDialog.value = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          {{ errorDialog.message }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      dialog: {
        emplyeee: null,
        value: false,
        fname: null,
        lname: null,
        role: null,
        activated: true
      },
      errorDialog: {
        value: false,
        message: null
      },
      users: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
          sortable: true
        },
        {
          text: 'Role',
          value: 'role',
          sortable: true
        },
        {
          text: 'Email Address',
          value: 'email',
          sortable: true
        },
        {
          text: 'Activated',
          value: 'active',
          sortable: true
        },
        {
          text: 'Date Registered',
          value: 'date_registered',
          sortable: true
        },
        {
          text: 'Actions'
        }
      ],
      valid: false,
      alert: false,
      registered: false,
      registrationForm: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        contactNumber: '',
        vehiclePlateNumber: '',
        dayOff: ''
      },
      errorMessage: null,
      successMessage: null,
      roles: ['Logistics Supervisor', 'Courier', 'Warehouse Manager', 'Help Desk Officer'],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      otherRules: [v => !!v || 'This field is Required'],
      passwordRules: [v => !!v || 'Password is Required'],
      confirmPasswordRules: [
        v => v === this.registrationForm.password || "Passwords doesn't match"
      ]
    }
  },
  watch: {
    registrationForm (val) {
      this.registered = false
    }
  },
  mounted () {},
  firebase () {
    return {
      users: this.$database('/employees')
    }
  },
  methods: {
    editItem (item) {
      // name, role, activated
      const employee = this.$_.find(this.users, { '.key': item['.key'] })
      console.log(employee.role)
      this.dialog = {
        employee: employee['.key'],
        value: true,
        fname: employee.first_name,
        lname: employee.last_name,
        role: employee.role,
        activated: employee.active
      }
    },
    saveChanges () {
      const { fname, lname, role, activated, employee } = this.dialog
      this.$database(`/employees/${employee}`).update({
        first_name: fname,
        last_name: lname,
        role,
        active: activated
      })
        .then(() => {
          this.dialog.value = false
        })
        .catch(err => {
          this.errorDialog = {
            value: true,
            message: err.message
          }
        })
    },
    register () {
      let role = this.registrationForm.role
      this.registered = false
      if (this.$refs.form.validate()) {
        this.$firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.registrationForm.email,
            this.registrationForm.password
          )
          .then(() => {
            console.log(this.$firebase.auth().currentUser)

            this.$database(
              `/employees/${this.$firebase.auth().currentUser.uid}`
            )
              .set({
                first_name: this.registrationForm.first_name,
                last_name: this.registrationForm.last_name,
                role: role,
                email: this.registrationForm.email,
                date_registered: this.$firebase.auth().currentUser.metadata
                  .creationTime,
                active: true,
                updated_password: false
              })
              .then(() => {
                if (this.registrationForm.role === 'Courier') {
                  this.$database(
                    `/couriers/${this.$firebase.auth().currentUser.uid}`
                  ).set({
                    firstName: this.registrationForm.first_name,
                    lastName: this.registrationForm.last_name,
                    email: this.registrationForm.email,
                    contactNumber: this.registrationForm.contactNumber,
                    vehiclePlateNumber: this.registrationForm
                      .vehiclePlateNumber,
                    dayOff: this.registrationForm.dayOff,
                    img: "@/assets/delivery-man"
                  })
                }
                this.registered = true
                this.successMessage = `Successfully registered user ${
                  this.registrationForm.email
                }.`
                this.$refs.form.reset()
              })
          })
          .catch(err => {
            var errCode = err.code
            this.errorMessage = err.message
            if (errCode === 'auth/email-already-in-use') {
              this.alert = true
              this.registrationForm.email = ''
            } else if (errCode === 'auth/weak-password') {
              this.alert = true
              this.registrationForm.password = ''
            } else alert(this.errorMessage)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
