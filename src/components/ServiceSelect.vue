<template>
  <v-select
    v-model="serviceSelected"
    :items="services"
    label="Service"
    outlined
    dense
    @change="onChange"
    @click="getServices"
    :rules="[v => !!v || 'Un service doit être sélectionné']"
    required
    prepend-icon="mdi-floor-plan"
  ></v-select>
</template>

<script>
import ApiRequest from '../common/axios-request'

export default {
  name: 'ServiceSelect',
  props: {},
  data() {
    return {
      services: [],
      serviceSelected: null
    }
  },
  computed: {},
  created() {
    this.getServices()
  },
  methods: {
    getServices() {
      ApiRequest.get('services').then(response => {
        this.services = []
        this.sortServices(response.data.services).forEach(element => {
          this.services.push({ text: element.name, value: element })
        })
      })
    },
    sortServices(services) {
      return services.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    },
    onChange() {
      if (this.serviceSelected) {
        this.$emit('on-change', this.serviceSelected)
      }
    }
  }
}
</script>

<style scoped></style>
