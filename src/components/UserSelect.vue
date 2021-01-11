<template>
  <v-select
    v-model="userSelected"
    :items="users"
    label="Identifiant"
    outlined
    dense
    :rules="[v => !!v || 'Un identifiant doit être sélectionné']"
    required
    lazy-validation
    @change="onChange"
    @click="getUsers"
    prepend-icon="mdi-account-circle"
  ></v-select>
</template>

<script>
import ApiRequest from '../common/axios-request'

export default {
  name: 'ServiceSelect',
  props: {},
  data() {
    return {
      userSelected: null,
      users: []
    }
  },
  computed: {},
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      ApiRequest.get('users', 'all').then(response => {
        this.users = response.data.map(user => user.name)
      })
    },
    onChange() {
      if (this.userSelected) {
        this.$emit('on-change', this.userSelected)
      }
    }
  }
}
</script>

<style scoped></style>
