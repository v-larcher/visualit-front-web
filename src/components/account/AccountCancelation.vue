<template>
  <div class="account-creation">
    <v-form
      ref="form"
      v-model="valid"
      v-on:submit.prevent
      lazy-validation
      style="margin-top: 50px; margin-bottom: 100px;"
    >
      <UserSelect @on-change="updateUserSelected" />
      <v-btn
        type="submit"
        @click="cancelAccount"
        primary
        large
        block
        style="margin-top: 40px;"
        color="#288fb4"
        dark
        >Supprimer le compte</v-btn
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
  name: 'AccountCancelation',
  components: { UserSelect },
  data() {
    return {
      userSelected: null,
      valid: true,
      timeout: 2000,
      snackbar: false,
      text: '',
      color: null
    }
  },
  created() {},
  methods: {
    cancelAccount() {
      if (!this.isFormValid()) return
      ApiRequest.delete('users', {
        data: { username: this.userSelected }
      }).then(response => {
        this.text = 'Compte supprimé avec succés'
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

<style scoped></style>
