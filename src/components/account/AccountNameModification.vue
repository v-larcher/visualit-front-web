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
        prepend-icon="mdi-account-circle"
        label="Nouvel Identifiant"
        v-model="newUsername"
        :rules="newUsernameRules"
        required
        style="margin-top: 20px;"
      ></v-text-field>
      <v-btn
        type="submit"
        @click="modifyAccount"
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Modifier l'identifiant</v-btn
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
import UserSelect from '../UserSelect'

export default {
  name: 'AccountNameModifcation',
  components: { UserSelect },
  data() {
    return {
      userSelected: null,
      valid: true,
      newUsernameRules: [
        v => !!v || 'Requiert un nouvel identifiant',
        v =>
          v !== this.userSelected || 'Les identifiants doivent être différents',
        v =>
          (v && v.length > 2) ||
          'Un identifiant doit être supérieur à 2 charactères',
        v =>
          (v && v.length <= 40) ||
          'Un identifiant doit être inférieur à 40 charactères'
      ],
      newUsername: '',
      timeout: 2000,
      snackbar: false,
      text: '',
      color: null
    }
  },
  mounted() {},
  methods: {
    modifyAccount() {
      if (!this.isFormValid()) return
      ApiRequest.put('users', {
        username: this.userSelected,
        name: this.newUsername
      }).then(response => {
        this.text = "Nom d'utilisateur modifié avec succés"
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
