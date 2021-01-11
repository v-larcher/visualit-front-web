<template>
  <div class="account-name-modification">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <UserSelect @on-change="updateUserSelected" />
      <v-text-field
        prepend-icon="mdi-lock"
        label="Nouveau mot de passe"
        v-model="newPassword"
        :rules="passwordRules"
        required
        type="password"
        style="margin-top: 20px;"
      ></v-text-field>
      <v-text-field
        prepend-icon="mdi-lock"
        label="Confirmation du nouveau mot de passe"
        type="password"
        v-model="confirmation"
        :rules="confirmationRules"
        required
        style="margin-top: 20px;"
      ></v-text-field>
      <br />
      <v-btn
        type="submit"
        @click="modifyAccount"
        primary
        large
        block
        style="margin-top: 20px;"
        color="#288fb4"
        dark
        >Modifier le mot de passe</v-btn
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
import { passwordRules } from '../../common/form-rules'
import UserSelect from '../UserSelect'

export default {
  name: 'AccountNameModifcation',
  components: { UserSelect },
  data() {
    return {
      userSelected: null,
      valid: true,
      newPassword: '',
      passwordRules: passwordRules,
      confirmation: '',
      confirmationRules: [
        v => !!v || 'Veuillez confirmer le mot de passe',
        v =>
          v === this.newPassword ||
          'Le mot de passe et sa confirmation doivent être identiques'
      ],
      timeout: 2000,
      snackbar: false,
      text: '',
      color: ''
    }
  },
  mounted() {},
  methods: {
    modifyAccount() {
      if (!this.isFormValid()) return
      ApiRequest.put('users', {
        username: this.userSelected,
        password: this.newPassword
      }).then(response => {
        this.text = 'Mot de passe modifié avec succés'
        this.color = 'success'
        this.timeout = 2000
        this.snackbar = true
        this.$refs.form.reset()
      })
    },
    updateUserSelected(userSelected) {
      this.userSelected = userSelected
    },
    isFormValid() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style></style>
