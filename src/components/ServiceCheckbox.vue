<template>
  <div>
    <v-container fluid>
      <v-subheader style="margin-bottom : 15px; " inset>Services</v-subheader>
      <v-checkbox
        v-model="all"
        label="Tous les services"
        key="Tous les services"
        @change="allServices"
      />
      <v-checkbox
        style="margin-top : -10px; margin-bottom : -10px; "
        v-for="(item, index) in services"
        v-model="item.selected"
        :label="item.name"
        :key="item.name + index.toString()"
        @change="saveServices"
      >
        <v-hover></v-hover>
      </v-checkbox>
    </v-container>
  </div>
</template>

<script>
import ApiRequest from '../common/axios-request'
import deepcopy from 'deepcopy'

export default {
  name: 'ServiceCheckbox',
  data() {
    return { services: [], all: true }
  },
  computed: {},
  created() {
    const preferences = this.$store.getters.getPreferences
    if (preferences.services !== null) {
      ApiRequest.get('services').then(response => {
        this.services = this.sortServices(response.data.services)
        this.services.forEach(element => {
          if (preferences.services.includes(element.id)) {
            element.selected = true
          } else {
            element.selected = false
            if (this.all) {
              this.all = false
            }
          }
        })
      })
    } else {
      ApiRequest.get('services').then(response => {
        this.services = this.sortServices(response.data.services)
        this.services.forEach(element => {
          element.selected = true
        })
        this.saveServices()
      })
    }
  },
  methods: {
    sortServices(services) {
      return services.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    },
    saveServices() {
      const services = this.services.filter(e => e.selected).map(e => e.id)
      this.$store.dispatch('setPreference', {
        key: 'services',
        value: services
      })
      this.all = services.length === this.services.length
    },
    allServices() {
      const updtServices = deepcopy(this.services)
      updtServices.forEach(element => (element.selected = this.all))
      this.services = updtServices
      this.saveServices()
    }
  }
}
</script>

<style scoped></style>
