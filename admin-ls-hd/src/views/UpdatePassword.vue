<template>
  <v-layout
    fill-height
    justify-center
    align-center
  >
    <v-flex xs4>
      <v-card>
        <v-container>
          <v-card-title class="headline roboto-con-bold pawit-text-green">
            Enter email address to confirm.
          </v-card-title>
          <v-card-text>
            <div class="subheading roboto-con-regular">
              Create a new password to continue.
            </div>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="submit"
            >
              <v-layout justify-center>
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
          </v-card-text>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>
