<template>
  <div>
    <v-dialog @click:outside="close" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Modifier une demande de lit
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              v-on:submit.prevent
            >
              <v-row>
                <v-select
                  v-model="modifyBedRequest.service_id"
                  :items="services"
                  label="Service"
                  outlined
                  dense
                  @change="onChangeService"
                  :rules="[v => !!v || 'Un service doit être sélectionné']"
                  required
                  prepend-icon="mdi-floor-plan"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="modifyBedRequest.room"
                  :items="rooms"
                  label="Chambre"
                  @change="onChangeRoom"
                  outlined
                  dense
                  prepend-icon="mdi-bunk-bed"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="modifyBedRequest.bed"
                  :items="beds"
                  label="Lit"
                  outlined
                  dense
                  prepend-icon="mdi-bed"
                />
              </v-row>
              <v-row>
                <v-textarea
                  v-model="modifyBedRequest.comment"
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
            Modifier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'

export default {
  name: 'BadRequestModification',
  components: {},
  props: {
    clicked: { type: Boolean, default: false },
    bedRequest: { type: Object, default: null }
  },
  data() {
    return {
      dialog: false,
      valid: true,
      services: [],
      rooms: [],
      beds: [],
      modifyBedRequest: {
        date: null,
        service_id: null,
        room: '',
        bed: '',
        comment: ''
      }
    }
  },
  mounted() {
    ApiRequest.get('services').then(response => {
      this.sortServices(response.data.services).forEach(element => {
        this.services.push({ text: element.name, value: element.id })
      })
    })
  },
  methods: {
    onChangeService() {
      this.beds = []
      this.rooms = []
      ApiRequest.query('rooms', {
        params: {
          service_id: this.modifyBedRequest.service_id
        }
      }).then(response => {
        response.data.forEach(element => {
          this.rooms.push({
            text: element.number,
            value: element
          })
        })
      })
      this.modifyBedRequest.room = ''
      this.modifyBedRequest.bed = ''
    },
    onChangeRoom() {
      this.beds = this.modifyBedRequest.room.beds.map(e => e.uuid)
      this.modifyBedRequest.bed = ''
    },
    isFormValid() {
      return this.$refs.form.validate()
    },
    close() {
      this.reset()
      this.$emit('close')
    },
    save() {
      if (!this.isFormValid()) return
      this.modifyBedRequest.room = this.modifyBedRequest.room.number
      ApiRequest.put('waiting', this.modifyBedRequest).then(response => {
        this.reset()
        this.$emit('modif', this.modifyBedRequest)
      })
    },
    sortServices(services) {
      return services.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    },
    initialise() {
      this.modifyBedRequest.date = this.bedRequest.date
      this.modifyBedRequest.service_id = this.bedRequest.service
      this.modifyBedRequest.bed = this.bedRequest.bed
      this.modifyBedRequest.comment = this.bedRequest.comment

      this.rooms = []

      ApiRequest.query('rooms', {
        params: {
          service_id: this.modifyBedRequest.service_id
        }
      }).then(response => {
        response.data.forEach(element => {
          this.rooms.push({
            text: element.number,
            value: element
          })
          if (element.number === this.bedRequest.room) {
            this.modifyBedRequest.room = element
          }
        })
      })

      this.beds = []
      if (this.bedRequest.room) {
        ApiRequest.query('rooms', {
          params: {
            service_id: this.modifyBedRequest.service_id,
            room_nb: this.bedRequest.room
          }
        }).then(response => {
          response.data.beds.forEach(element => {
            this.beds.push({
              text: element.uuid,
              value: element.uuid
            })
          })
        })
      }
    },
    reset() {
      this.modifyBedRequest = {
        date: null,
        service_id: null,
        room: '',
        bed: '',
        comment: ''
      }
      this.dialog = false
    }
  },
  watch: {
    clicked: function(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.initialise()
        this.dialog = true
      }
    }
  }
}
</script>

<style scoped></style>
