<template>
  <v-layout class="pl-4 mb-2">
    <table
      style="width:100%;"
      class="text-capitalize"
    >
      <tr class="roboto-con-bold headline pawit-text-gray-3 text-xs-left">
        <td
          colspan="2"
          class="pawit-text-green"
        >
          <slot name="activity" /> Info.<span class="ml-5 subheading roboto-con-bold pawit-text-gray">Courier: </span><span><slot /></span>
        </td>
      </tr>
      <tr>
        <th>{{ activity === 'pickup' ? 'Sender' : 'Recipient' }}</th>
        <th>Contact number</th>
      </tr>
      <tr>
        <td>{{ requestInfo.name }}</td>
        <td>{{ requestInfo.contact }}</td>
      </tr>
      <tr>
        <th>{{ activity === 'pickup' ? 'Pickup Point' : 'Dropoff Point' }}</th>
        <th>{{ activity === 'pickup' ? 'Pickup Schedule' : 'Dropoff Schedule' }}</th>
      </tr>
      <tr>
        <td class="text-truncate">
          {{ requestInfo.location.address }}
        </td>
        <td>{{ requestInfo.date }} @{{ requestInfo.time }}</td>
      </tr>
    </table>
  </v-layout>
</template>

<script>
export default {
  props: ['requestInfo', 'activity'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  text-align: left;
}

th {
  padding-left: 5px;
}

td {
  max-width: 250px;
  width: 50%;
  padding-left: 10px;
}
</style>
