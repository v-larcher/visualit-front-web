<template>
  <div class="account-creation">
    <br />
    <template v-if="modification === 'create'">
      <v-form
        key="create"
        ref="form"
        v-model="valid"
        lazy-validation
        v-on:submit.prevent
      >
        <v-text-field
          prepend-icon="mdi-account-circle"
          label="Nom de service"
          v-model="serviceName"
          :rules="serviceNameRules"
          required
        ></v-text-field>
        <br />
        <v-btn type="submit" @click="modifyService" primary large block
          >Créer le service</v-btn
        >
      </v-form>
    </template>
    <template v-else-if="modification === 'rename'">
      <v-form
        key="rename"
        ref="form"
        v-model="valid"
        lazy-validation
        v-on:submit.prevent
      >
        <ServiceSelect @on-change="updateServiceSelected" :required="true" />
        <br />
        <v-text-field
          prepend-icon="mdi-account-circle"
          label="Nouveau nom de service"
          v-model="serviceName"
          :rules="serviceNameRules"
          required
        ></v-text-field>
        <br />
        <v-btn type="submit" @click="modifyService" primary large block
          >Renommer le service</v-btn
        >
      </v-form>
    </template>
    <template v-else>
      <v-form ref="form" v-model="valid" lazy-validation v-on:submit.prevent>
        <ServiceSelect @on-change="updateServiceSelected" :required="true" />
        <br />
        <v-btn
          key="delete"
          type="submit"
          @click="modifyService"
          primary
          large
          block
          >Supprimer le service</v-btn
        >
      </v-form>
    </template>
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
import ApiRequest from '../common/axios-request'

export default {
  name: 'ServiceModification',
  props: { modification: String },
  components: {},
  data() {
    return {
      valid: true,
      serviceName: '',
      serviceNameRules: [
        v => !!v || 'Requiert un nom de service',
        v =>
          (v && v.length > 2) ||
          'Le nom de service doit être supérieur à 2 charactères',
        v =>
          (v && v.length <= 40) ||
          'Le nom de service doit être inférieur à 40 charactères'
      ],
      services: null,
      serviceSelected: '',
      timeout: 2000,
      snackbar: false,
      text: '',
      color: ''
    }
  },
  mounted() {
    ApiRequest.get('services').then(response => {
      this.services = response.data.services
    })
  },
  methods: {
    modifyService() {
      switch (this.modification) {
        case 'create':
          this.createService()
          break
        case 'rename':
          this.renameService()
          break
        case 'delete':
          this.deleteService()
          break
      }
    },
    createService() {
      if (!this.isFormValid()) return
      ApiRequest.get('services').then(response => {
        const servicesName = response.data.services.map(e => e.name)
        if (servicesName.includes(this.serviceName)) {
          this.text = 'Le nom du service est déjà utilisé'
          this.color = 'error'
          this.timeout = 4000
          this.snackbar = true
          this.$refs.form.reset()
        } else {
          ApiRequest.post('services', {
            name: this.serviceName
          }).then(response => {
            this.text = 'Service créé avec succés'
            this.color = 'success'
            this.timeout = 2000
            this.snackbar = true
            this.$refs.form.reset()
          })
        }
      })
    },
    renameService() {
      if (!this.isFormValid()) return
      ApiRequest.put('services/' + this.serviceSelected.toString(), {
        service_id: this.serviceSelected,
        name: this.serviceName
      }).then(response => {
        this.text = 'Nom du service modifié avec succés'
        this.color = 'success'
        this.timeout = 2000
        this.snackbar = true
        this.$refs.form.reset()
      })
    },
    deleteService() {
      if (!this.isFormValid()) return
      ApiRequest.delete('services/' + this.serviceSelected.toString()).then(
        response => {
          this.text = 'Service supprimé avec succés'
          this.color = 'success'
          this.timeout = 2000
          this.snackbar = true
          this.$refs.form.reset()
        }
      )
    },
    updateServiceSelected(serviceSelected) {
      this.serviceSelected = serviceSelected.id
    },
    isFormValid() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style></style>
