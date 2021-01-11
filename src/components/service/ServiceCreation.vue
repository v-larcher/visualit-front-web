<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <v-text-field
        prepend-icon="mdi-account-circle"
        label="Nom du service"
        v-model="serviceName"
        :rules="serviceNameRules"
        required
        clearable
      ></v-text-field>
      <v-btn
        type="submit"
        @click="createService"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Créer le service</v-btn
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

export default {
  name: 'ServiceModification',
  props: {},
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
      serviceSelected: '',
      updateServices: false,
      timeout: 2000,
      snackbar: false,
      text: '',
      color: ''
    }
  },
  mounted() {},
  methods: {
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
            this.updateServices = !this.updateServices
          })
        }
      })
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
