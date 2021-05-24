<template>
  <div>
    <adv-toolbar
      :action="null"
    >
      <slot />
    </adv-toolbar>
    <div
      ref="mapContainer"
      class="map-container"
    >
      <adv-map-courier-list
        :width="sidenavWidth"
        :activity="detailsFrom"
      />
      <div
        class="sidenav-toggler"
        :style="`left: ${sidenavWidth}%;`"
        @click="toggleSidenav"
      >
        <v-icon
          size="15"
          :style="`transform: rotateY(${sidenavWidth ? 0 : 180}deg);`"
        >
          chevron_left
        </v-icon>
      </div>
      <adv-maps
        v-if="$store.state.fullItemDetails"
        :key="JSON.stringify({selectedCourier})"
        :activity="detailsFrom"
        :sidenav-width="sidenavWidth"
        :couriers="couriers"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['detailsFrom', 'couriers'],
  data () {
    return {
      sidenavWidth: 30,
      SIDENAV_WIDTH_REF: 30
    }
  },
  computed: {
    ...mapState({
      selectedCourier (state) {
        return state.selectedCourier[this.detailsFrom]
      }
    })
  },
  methods: {
    toggleSidenav () {
      if (this.sidenavWidth === this.SIDENAV_WIDTH_REF) this.sidenavWidth = 0
      else if (this.sidenavWidth === 0) this.sidenavWidth = this.SIDENAV_WIDTH_REF
      else this.sidenavWidth = this.SIDENAV_WIDTH_REF
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 40px);

  & > .sidenav-toggler {
    transition: .3s ease-in-out;
    z-index: 1;
    position: absolute;
    width: 13px;
    height: 40px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    top: 25%;
    background-color: #424242;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 2px 0 5px 2px rgba(0, 0, 0, .3);

    &:hover {
      width: 20px;
    }

    &:active {
      box-shadow: 2px 0 5px 2px rgba(0, 0, 0, 0);
    }

    & > .material-icons {
      user-select: none;
      pointer-events: none;
      color: #fff;
    }
  }
}

</style>
