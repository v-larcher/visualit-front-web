<template>
  <div class="account-creation">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <v-text-field
        prepend-icon="mdi-account-circle"
        label="Identifiant"
        v-model="username"
        :rules="usernameRules"
        required
        clearable
        style="margin-top: 20px;"
      ></v-text-field>
      <v-text-field
        prepend-icon="mdi-lock"
        label="Mot de passe"
        type="password"
        v-model="password"
        :rules="passwordRules"
        required
        style="margin-top: 20px;"
      ></v-text-field>
      <v-text-field
        prepend-icon="mdi-lock"
        label="Confirmation de mot de passe"
        type="password"
        v-model="confirmation"
        :rules="confirmationRules"
        required
        style="margin-top: 20px;"
      ></v-text-field>
      <v-radio-group
        v-model="role"
        :rules="confirmationRole"
        row
        style="margin-top: 20px;"
      >
        <v-radio label="Utilisateur" value="0"></v-radio>
        <v-radio label="Admin" value="1"></v-radio>
      </v-radio-group>
      <v-btn
        type="submit"
        @click="createAccount"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Créer un compte</v-btn
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
import { usernameRules, passwordRules } from '../../common/form-rules'

export default {
  name: 'AccountCreation',
  components: {},
  data() {
    return {
      valid: true,
      username: '',
      usernameRules: usernameRules,
      password: '',
      passwordRules: passwordRules,
      confirmation: '',
      confirmationRules: [
        v => !!v || 'Veuillez confirmer le mot de passe',
        v =>
          v === this.password ||
          'Le mot de passe et sa confirmation doivent être identiques'
      ],
      role: null,
      confirmationRole: [v => !!v || 'Veuillez renseigner un rôle'],
      timeout: 2000,
      snackbar: false,
      text: '',
      color: null
    }
  },
  mounted() {},
  methods: {
    createAccount() {
      if (!this.isFormValid()) return
      ApiRequest.get('users', 'all').then(response => {
        if (response.data.map(e => e.name).includes(this.username)) {
          this.text = "Nom d'utilisateur déjà pris"
          this.color = 'error'
          this.timeout = 4000
          this.snackbar = true
          this.username = ''
        } else {
          ApiRequest.post('users', {
            username: this.username,
            password: this.password,
            role: this.role
          }).then(response => {
            this.text = 'Compte créé avec succés'
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
    }
  }
}
</script>

<style></style>
