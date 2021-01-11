<template>
  <div class="overview">
    <v-container fluid>
      <v-tabs
        v-model="modelTab"
        @change="updateOverviewPreference"
        show-arrows
        background-color="#f9f9f9"
        fixed-tabs
        active-class="elevation-1 darken-2"
      >
        <v-tab>Table</v-tab>
        <v-tab>Cartes</v-tab>
        <v-tab>Graphique</v-tab>
        <v-tab-item>
          <TableBeds :beds="bedsSelected" @on-change="getBeds" />
        </v-tab-item>
        <v-tab-item>
          <CardsBeds :beds="bedsSelected" @on-change="getBeds" />
        </v-tab-item>
        <v-tab-item>
          <GraphBeds :beds="bedsSelected" />
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import ApiRequest from '../common/axios-request'
import config from '../common/config'

export default {
  name: 'OverviewView',

  components: {
    TableBeds: () => import('../components/overview/OverviewTableBeds'),
    CardsBeds: () => import('../components/overview/OverviewCardsBeds'),
    GraphBeds: () => import('../components/overview/OverviewGraphBeds')
  },
  data() {
    return {
      modelTab: 0,
      statesColor: [
        config.BED_COLOR.free,
        config.BED_COLOR.leaving,
        config.BED_COLOR.occupied
      ],
      allStates: [
        { text: 'Libre', value: 0 },
        { text: 'Bientôt Libre', value: 1 },
        { text: 'Occupé', value: 2 }
      ],
      cleanessColor: {
        true: config.BED_COLOR.dirty,
        false: config.BED_COLOR.clean
      },
      allCleaness: [
        { text: 'A nettoyer', value: true },
        { text: 'Propre', value: false }
      ],
      beds: [],
      bedsSelected: []
    }
  },
  computed: {
    preferences() {
      return this.$store.state.preferences
    }
  },
  watch: {
    preferences: {
      handler: 'getBeds',
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.modelTab = this.$store.state.preferences.overview[0]
  },
  methods: {
    updateOverviewPreference() {
      this.$store.dispatch('setPreference', {
        key: 'overview',
        value: [this.modelTab]
      })
    },
    filterBeds() {
      this.bedsSelected = this.beds.filter(
        bed =>
          this.preferences.services.includes(bed.service) &&
          this.preferences.states.includes(bed.status) &&
          this.preferences.cleaness.includes(bed.to_clean)
      )
    },
    nameAndColorBed() {
      this.beds.forEach(bed => {
        bed.color = {
          state: this.statesColor[bed.status],
          cleaness: this.cleanessColor[bed.to_clean]
        }
      })
    },
    nameService(services, beds) {
      const serviceIdToName = {}
      services.forEach(e => (serviceIdToName[e.id] = e.name))
      beds.forEach(bed => (bed.service_name = serviceIdToName[bed.service]))
      return beds
    },
    sortBeds() {
      this.bedsSelected.sort((a, b) => {
        if (a.service_name < b.service_name) {
          return -1
        } else if (a.service_name > b.service_name) {
          return 1
        } else {
          return a.number - b.number
        }
      })
    },
    getBeds() {
      ApiRequest.get('services').then(responseServices => {
        ApiRequest.get('beds').then(responseBeds => {
          this.beds = this.nameService(
            responseServices.data.services,
            responseBeds.data
          )
          this.nameAndColorBed()
          this.filterBeds()
          this.sortBeds()
        })
      })
    }
  }
}
</script>

<style scoped>
.vert-text-btn {
  display: block;
  transform: rotate(90deg);
  margin: 50px;

  border-width: 5px;
}
</style>
