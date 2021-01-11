<template>
  <div class="room-delete">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <ServiceSelect @on-change="updateServiceSelected" :required="true" />
      <RoomSelect
        @on-change="updateRoomSelected"
        :serviceId="serviceSelected"
        :required="true"
        style="margin-top: 20px;"
      />
      <v-btn
        type="submit"
        @click="deleteRoom"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Supprimer la chambre</v-btn
      >
    </v-form>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
      <div v-text="text" class="body-1 white--text" />
      <template v-slot:action="{ attrs }">
        <v-btn
          depressed
          :color="color"
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>
            mdi-close-thick
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'
import ServiceSelect from '../ServiceSelect'
import RoomSelect from '../RoomSelect'

export default {
  name: 'RoomDelete',
  components: { ServiceSelect, RoomSelect },
  data() {
    return {
      valid: true,
      roomSelected: null,
      serviceSelected: null,
      timeout: 2000,
      snackbar: false,
      text: '',
      color: ''
    }
  },
  mounted() {},
  methods: {
    updateRoomSelected(roomSelected) {
      this.roomSelected = roomSelected.number
    },
    updateServiceSelected(serviceSelected) {
      this.serviceSelected = serviceSelected.id
    },
    deleteRoom() {
      if (!this.isFormValid()) return
      ApiRequest.delete('rooms', {
        data: { room_nb: this.roomSelected, service_id: this.serviceSelected }
      }).then(response => {
        this.text = 'Chambre supprimée avec succés'
        this.color = 'success'
        this.timeout = 2000
        this.snackbar = true
        this.$refs.form.reset()
      })
    },
    isFormValid() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style></style>
