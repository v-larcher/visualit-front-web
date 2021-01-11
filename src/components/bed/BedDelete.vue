<template>
  <div class="room-move">
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
      <v-select
        v-model="bedSelected"
        :items="beds"
        label="Lit"
        outlined
        dense
        :rules="[v => !!v || 'Un lit doit être sélectionné']"
        required
        prepend-icon="mdi-bed"
        style="margin-top: 20px;"
      ></v-select>
      <v-btn
        type="submit"
        @click="deleteBed"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Supprimer le lit</v-btn
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
  name: 'BedDelete',
  components: { ServiceSelect, RoomSelect },
  data() {
    return {
      valid: true,
      serviceSelected: null,
      roomSelected: null,
      beds: [],
      bedSelected: null,
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
      this.beds = []
      this.roomSelected = null
      this.bedSelected = null
    },
    updateRoomSelected(roomSelected) {
      this.roomSelected = roomSelected.number
      this.beds = roomSelected.beds.map(e => e.uuid)
      this.bedSelected = null
    },
    deleteBed() {
      if (!this.isFormValid()) return
      ApiRequest.delete('beds/' + this.bedSelected.toString()).then(
        response => {
          this.text = 'Lit supprimé avec succés'
          this.color = 'success'
          this.timeout = 2000
          this.snackbar = true
          this.$refs.form.reset()
        }
      )
    },
    isFormValid() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style></style>
