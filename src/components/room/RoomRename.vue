<template>
  <div class="room-rename">
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
      <v-text-field
        prepend-icon="mdi-bunk-bed"
        label="Nouveau nom de la chambre"
        v-model="roomName"
        :rules="newRoomNameRules"
        required
        clearable
        style="margin-top: 20px;"
      ></v-text-field>
      <v-btn
        type="submit"
        @click="renameRoom"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Renommer la chambre</v-btn
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
  name: 'RoomRename',
  components: { ServiceSelect, RoomSelect },
  data() {
    return {
      valid: true,
      roomName: '',
      serviceSelected: null,
      roomSelected: null,
      newRoomNameRules: [
        v => !!v || 'Requiert un nom de chambre',
        v =>
          this.validAlphaNumeric(v) ||
          'Seulement les charactères alphanumériques sont permis',
        v =>
          (this.roomSelected && v !== this.roomSelected.number) ||
          "Le nouveau nom de chambre doit être différent de l'ancien"
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
    updateRoomSelected(roomSelected) {
      this.roomSelected = roomSelected.number
    },
    renameRoom() {
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
          ApiRequest.put('rooms/number', {
            room_nb: this.roomSelected,
            new_room_nb: this.roomName,
            service_id: this.serviceSelected
          }).then(response => {
            this.text = 'Chambre renommée avec succés'
            this.color = 'success'
            this.timeout = 2000
            this.snackbar = true
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
