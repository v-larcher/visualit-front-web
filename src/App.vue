<template>
  <v-app class="app">
    <TheHeader />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer color="#1d556f" dark padless>
      <v-col cols="6" class="text-left"
        ><span> {{ version }} </span></v-col
      >
      <v-col cols="6" class="text-right"
        ><strong> {{ username }} </strong></v-col
      >
    </v-footer>
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader'

export default {
  name: 'App',
  components: {
    TheHeader
  },
  computed: {
    username() {
      return this.$store.getters.getUsername
    },
    version() {
      return this.$store.state.version
    }
  },
  mounted() {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.app {
  background-color: #f3f3f3;
}
</style>
