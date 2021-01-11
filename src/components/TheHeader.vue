<template>
  <div class="header">
    <template v-if="isloggedIn">
      <v-navigation-drawer
        app
        clipped
        floating
        v-model="drawer"
        color="#f9f9f9"
        light
      >
        <OptionPicker :hidden="hidePickerOptions" />
        <v-divider></v-divider>
        <ServiceCheckbox />
      </v-navigation-drawer>
      <v-app-bar dense app clipped-left fixed dark color="#1d556f">
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          :disabled="disabledButton"
          style="margin-right: 14px; margin-left: 0px"
        ></v-app-bar-nav-icon>
        <v-toolbar-items>
          <v-btn
            text
            v-for="item in menu"
            :key="item.title"
            :to="item.path"
            outlined
            class="btn"
          >
            <v-icon :left="$vuetify.breakpoint.mdAndUp" dark>{{
              item.icon
            }}</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">{{ item.title }}</span>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn class="btn" text :key="'Se déconnecter'" @click="logout">
            <v-icon left dark>mdi-logout</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp"> Se déconnecter </span>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
    </template>
  </div>
</template>

<script>
import ServiceCheckbox from './ServiceCheckbox'
import OptionPicker from './OptionPicker'

export default {
  name: 'TheHeader',
  components: {
    ServiceCheckbox,
    OptionPicker
  },
  data() {
    return {
      disabledButton: false,
      drawer: true,
      hiddenDrawer: false,
      hidePickerOptions: false,
      menu: [
        {
          title: 'VisuaLit',
          path: '/overview',
          icon: 'mdi-home'
        },
        {
          title: "Liste d'attente",
          path: '/waiting_list',
          icon: 'mdi-timer-sand-full'
        },
        {
          title: 'Tableau de bord',
          path: '/dashboard',
          icon: 'mdi-thermostat'
        },
        {
          title: 'Administration',
          path: '/admin',
          icon: 'mdi-account-group'
        }
      ],
      appTitle: 'Visualit',
      selectedServices: null,
      selectedStates: null,
      selectedCleaness: null
    }
  },
  computed: {
    isloggedIn() {
      return this.$store.getters.loggedIn && this.$store.state.ready
    }
  },
  watch: {
    '$store.state.viewName': {
      handler: 'modifyNavDrawerDependingOnView',
      immediate: true
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
        window.sessionStorage.removeItem('visualit')
      })
    },
    modifyNavDrawerDependingOnView() {
      const viewName = this.$store.state.viewName
      if (viewName === 'Admin') {
        this.drawer = false
        this.disabledButton = true
      } else {
        this.disabledButton = false
        const viewsDisablePickerOptions = ['Dashboard', 'WaitingList']
        if (viewsDisablePickerOptions.includes(viewName)) {
          this.hidePickerOptions = true
        } else {
          this.hidePickerOptions = false
        }
      }
    }
  }
}
</script>

<style scoped>
.btn {
  text-transform: none;
}
</style>
