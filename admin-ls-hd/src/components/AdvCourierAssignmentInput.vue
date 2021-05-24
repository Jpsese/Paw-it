<template>
  <v-select
    v-model="model"
    :items="items"
    :label="label"
    :item-text="cour => `${cour.lastName}, ${cour.firstName}`"
    :item-value="cour => cour"
    hide-details
    outline
    @change="$emit('input', $event)"
  >
    <template v-slot:item="{ item }">
      <v-list-tile-content>
        <v-list-tile-title>{{ item.lastName }} {{ item.firstName }}</v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-select>
</template>

<script>
export default {
  props: ['value', 'label', 'items'],
  data () {
    return {
      model: null
    }
  }
}
</script>
