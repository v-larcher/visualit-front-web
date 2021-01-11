<template>
  <div class="room-creation">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <ServiceSelect @on-change="updateServiceSelected" :required="true" />
      <v-text-field
        prepend-icon="mdi-bunk-bed"
        label="Nom de la chambre"
        v-model="roomName"
        :rules="roomNameRules"
        required
        clearable
        style="margin-top: 20px;"
      ></v-text-field>
      <vue-numeric-input
        v-model="nbBeds"
        :min="1"
        :max="199"
        style="margin-top: 20px;"
      ></vue-numeric-input>
      <v-btn
        type="submit"
        @click="createRoom"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Créer la chambre</v-btn
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
import VueNumericInput from 'vue-numeric-input'

export default {
  name: 'RoomCreation',
  components: { VueNumericInput, ServiceSelect },
  data() {
    return {
      valid: true,
      nbBeds: 1,
      roomName: '',
      serviceSelected: null,
      roomNameRules: [
        v => !!v || 'Requiert un nom de chambre',
        v =>
          this.validAlphaNumeric(v) ||
          'Seulement les charactères alphanumériques sont permis'
      ],
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
    createRoom() {
      if (!this.isFormValid()) return
      ApiRequest.query('rooms', {
        params: {
          service_id: this.serviceSelected
        }
      }).then(response => {
        const roomsName = response.data.map(e => e.number)
        if (roomsName.includes(this.roomName)) {
          this.text = 'Le nom de la chambre est déjà utilisé'
          this.color = 'error'
          this.timeout = 4000
          this.snackbar = true
          this.$refs.form.reset()
        } else {
          ApiRequest.post('rooms/', {
            room_nb: this.roomName,
            service_id: this.serviceSelected,
            nb_beds: this.nbBeds
          }).then(response => {
            this.text = 'Chambre créée avec succés'
            this.color = 'success'
            this.timeout = 2000
            this.snackbar = true
            this.nbBeds = 1
            this.$refs.form.reset()
          })
        }
      })
    },
    isFormValid() {
      return this.$refs.form.validate()
    },
    validAlphaNumeric(value) {
      const re = /^[a-zA-Z0-9]+$/
      return re.test(value)
    }
  }
}
</script>

<style></style>
