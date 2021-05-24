<template>
  <v-expansion-panel>
    <v-expansion-panel-content>
      <template v-slot:header>
        <div class="roboto-con-bold pawit-text-gray-3 title">
          {{ header }} Information
        </div>
        <div class="roboto-con-regular">
          <span class="roboto-con-bold">Courier:</span> <slot />
        </div>
      </template>
      <v-card>
        <v-card-text v-if="header === 'Pickup'">
          <adv-details
            :request-info="requestInfo.pickUp"
            :activity="`pickup`"
          />
        </v-card-text>
        <v-card-text v-if="header === 'Delivery'">
          <adv-details
            :request-info="requestInfo.delivery"
            :activity="`delivery`"
          />
        </v-card-text>
        <v-card-text v-if="header === 'Remittance'">
          <adv-details
            :request-info="requestInfo.remittance"
            :activity="`remittance`"
          />
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ['requestInfo', 'header']
}
</script>
