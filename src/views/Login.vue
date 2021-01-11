<template>
  <div class="login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-card
          class="card rounded-lg"
          style="margin-top: 100px ; padding: 50px"
        >
          <v-card-title primary-title>
            <v-img src="../assets/logo_medium.png" width="400"></v-img>
          </v-card-title>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            v-on:submit.prevent
          >
            <v-text-field
              prepend-icon="mdi-account-circle"
              label="Identifiant"
              v-model="username"
              :rules="usernameRules"
              required
              style="margin-top: 10px; margin-bottom: 10px; "
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-lock"
              label="Mot de passe"
              v-model="password"
              :rules="passwordRules"
              required
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="value = !value"
              :type="value ? 'text' : 'password'"
              style="margin-top: 10px; margin-bottom: 20px; "
            ></v-text-field>

            <v-card-actions>
              <v-btn
                type="submit"
                @click="login"
                large
                block
                color="#288fb4"
                dark
                >Se connecter</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-row>
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
    </v-container>
  </div>
</template>

<script>
import ApiRequest from '../common/axios-request'

export default {
  name: 'LoginView',
  components: {},
  data() {
    return {
      value: false,
      valid: true,
      username: '',
      usernameRules: [
        v => !!v || 'Requiert un identifiant',
        v =>
          (v && v.length <= 40) ||
          'Un identifiant doit être inférieur à 40 charactères'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Requiert un mot de passe',
        v =>
          (v && v.length <= 40) ||
          'Un mot de passe doit être inférieur à 40 charactères'
      ],
      timeout: 4000,
      snackbar: false,
      text: "L'authentification a échoué",
      color: 'error'
    }
  },
  methods: {
    login() {
      if (!this.isFormValid()) return

      ApiRequest.post('auth', {
        username: this.username,
        password: this.password
      })
        .then(response => {
          this.$store.dispatch('login', {
            username: this.username,
            token: response.data.token
          })
          this.snackbar = false
        })
        .catch(r => {
          if (!this.$store.getters.isLogged) {
            this.snackbar = true
          }
        })

      this.$refs.form.reset()
    },
    isFormValid() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style></style>
