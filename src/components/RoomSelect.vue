<template>
  <v-select
    v-if="required"
    v-model="roomSelected"
    :items="rooms"
    label="Chambre"
    outlined
    dense
    @change="onChange"
    @click="getRooms"
    :rules="[v => (!!v && required) || 'Une chambre doit être sélectionnée']"
    prepend-icon="mdi-bunk-bed"
    key="required"
  />
  <v-select
    v-else
    v-model="roomSelected"
    :items="rooms"
    label="Chambre"
    outlined
    dense
    @change="onChange"
    @click="getRooms"
    prepend-icon="mdi-bunk-bed"
    key="not required"
  />
</template>

<script>
import ApiRequest from '../common/axios-request'

export default {
  name: 'RoomSelect',
  props: {
    serviceId: Number,
    required: { type: Boolean, default: false }
  },
  data() {
    return { rooms: [], roomSelected: null }
  },
  computed: {},
  mounted() {},
  methods: {
    onChange() {
      if (this.roomSelected) {
        this.$emit('on-change', this.roomSelected)
      }
    },
    getRooms() {
      this.rooms = []
      this.roomSelected = null
      if (this.serviceId) {
        ApiRequest.query('rooms', {
          params: {
            service_id: this.serviceId
          }
        }).then(response => {
          response.data.forEach(element => {
            this.rooms.push({
              text: element.number,
              value: element
            })
          })
        })
      }
    }
  }
}
</script>

<style scoped></style>
