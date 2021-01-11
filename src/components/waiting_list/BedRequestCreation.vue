<template>
  <div>
    <v-dialog @click:outside="close" v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
          Ajouter une demande
        </v-btn>
      </template>
      <v-card>
        <v-card-title> Ajouter une demande de lit </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              v-on:submit.prevent
            >
              <v-row>
                <ServiceSelect @on-change="updateServiceSelected" />
              </v-row>
              <v-row>
                <RoomSelect
                  @on-change="updateRoomSelected"
                  :serviceId="addBedRequest.service_id"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="addBedRequest.bed"
                  :items="beds"
                  label="Lit"
                  outlined
                  dense
                  prepend-icon="mdi-bed"
                ></v-select>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="addBedRequest.comment"
                  label="Commentaire"
                  clearable
                ></v-textarea>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close">
            Annuler
          </v-btn>
          <v-btn color="primary" text @click="save">
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'
import ServiceSelect from '../ServiceSelect'
import RoomSelect from '../RoomSelect'

export default {
  name: 'BadRequestCreation',
  components: { ServiceSelect, RoomSelect },
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
