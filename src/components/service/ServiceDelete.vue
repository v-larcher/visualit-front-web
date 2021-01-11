<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <ServiceSelect
        @on-change="updateServiceSelected"
        :updateServices="updateServices"
      />
      <v-btn
        type="submit"
        @click="deleteService"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Supprimer le service</v-btn
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

export default {
  name: 'ServiceModification',
  props: {},
  components: { ServiceSelect },
  data() {
    return {
      valid: true,
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
    deleteService() {
      if (!this.isFormValid()) return
      ApiRequest.delete('services/' + this.serviceSelected.toString()).then(
        response => {
          this.text = 'Service supprimé avec succés'
          this.color = 'success'
          this.timeout = 2000
          this.snackbar = true
          this.$refs.form.reset()
          this.updateServices = !this.updateServices
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
