<template>
  <div class="bed-creation">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <ServiceSelect @on-change="updateServiceSelected" :required="true" />
      <div style="margin-top: 20px;">
        <RoomSelect
          @on-change="updateRoomSelected"
          :serviceId="serviceSelected"
          :required="true"
        />
      </div>
      <v-btn
        type="submit"
        @click="createBed"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Créer un lit</v-btn
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
  name: 'BedCreation',
  components: { ServiceSelect, RoomSelect },
  data() {
    return {
      valid: true,
      serviceSelected: null,
      roomSelected: null,
      timeout: 2000,
      snackbar: false,
      text: '',
      color: ''
    }
  },
  mounted() {},
  methods: {
    updateServiceSelected(serviceSelected) {
      this.serviceSelected = serviceSelected.id
    },
    updateRoomSelected(roomSelected) {
      this.roomSelected = roomSelected.number
    },
    createBed() {
      if (!this.isFormValid()) return
      ApiRequest.post('beds', {
        service_id: this.serviceSelected,
        room_nb: this.roomSelected
      }).then(response => {
        this.text = 'Lit créé avec succés'
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
