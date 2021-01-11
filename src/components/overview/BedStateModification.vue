<template>
  <div>
    <v-dialog @click:outside="close" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title> Modification du statut du lit </v-card-title>
        <v-card-text>
          <v-chip-group active-class="white--text">
            <v-chip :color="config.BED_COLOR.free" dark>
              Libre
            </v-chip>
            <v-chip :color="config.BED_COLOR.leaving" dark>
              Bientôt libre
            </v-chip>
            <v-chip :color="config.BED_COLOR.occupied" dark>
              Occupé
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close">
            Annuler
          </v-btn>
          <v-btn color="primary" text @click="save">
            Sauvegarder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'
import config from '../../common/config'

export default {
  name: 'BadStateModification',
  props: {},
  data() {
    return {
      dialog: false,
      valid: true,
      beds: [],
      addBedRequest: {
        service_id: null,
        room: null,
        bed: null,
        comment: ''
      }
    }
  },
  mounted() {},
  methods: {
    updateServiceSelected(serviceSelected) {
      this.addBedRequest.service_id = serviceSelected.id
      this.addBedRequest.room = null
      this.addBedRequest.bed = null
      this.beds = []
    },
    updateRoomSelected(roomSelected) {
      this.addBedRequest.room = roomSelected.number
      this.addBedRequest.bed = null
      this.beds = roomSelected.beds.map(e => e.uuid)
    },
    isFormValid() {
      return this.$refs.form.validate()
    },
    close() {
      this.reset()
    },
    save() {
      if (!this.isFormValid()) return
      ApiRequest.post('waiting', this.addBedRequest).then(response => {
        this.$emit('add', this.addBedRequest)
        this.reset()
      })
    },
    reset() {
      this.beds = []
      this.addBedRequest = {
        service_id: null,
        room: null,
        bed: null,
        comment: ''
      }
      this.dialog = false
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped></style>
