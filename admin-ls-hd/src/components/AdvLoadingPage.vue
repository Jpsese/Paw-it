<template>
  <v-layout justify-center>
    <v-flex xs3>
      <v-dialog
        v-model="$store.state.loader"
        persistent
        fullscreen
        no-click-animation
        :transition="false"
      >
        <v-card
          flat
          style="background-color:transparent; overyflow-y:hidden;"
          class="mt-5 card_style"
        >
          <img
            :src="require('@/assets/new_brand.png')"
            class="center"
          >
          <v-progress-circular
            :size="30"
            :width="2"
            color="green"
            indeterminate
            class="center"
          />
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 15%;
}

.card_style {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
}
</style>
