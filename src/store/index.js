import Vue from 'vue'
import Vuex from 'vuex'
import ApiRequest from '../common/axios-request'
import VuexPersistence from 'vuex-persist'
import router from '../router'

Vue.use(Vuex)

const vuexStorage = new VuexPersistence({
  key: 'visualit',
  storage: window.sessionStorage
})

export default new Vuex.Store({
  plugins: [vuexStorage.plugin],
  state: {
    ready: false,
    token: '',
    username: '',
    viewName: '',
    version: '',
    preferences: {
      services: null,
      states: null,
      cleaness: null,
      overview: null
    }
  },
  getters: {
    /* Not for production use */
    loggedIn: state => {
      return !!state.token
    },
    getUsername: state => {
      return state.username
    },
    getPreferences: state => {
      return state.preferences
    }
  },
  mutations: {
    login(state, data) {
      state.token = data.token
      state.username = data.username
      ApiRequest.get('users/prefs').then(response => {
        for (const key in state.preferences) {
          if ('web_' + key in response.data) {
            if (response.data['web_' + key] === 'no prefs') {
              state.preferences[key] = []
            } else {
              state.preferences[key] = response.data['web_' + key]
                .split('-')
                .map(e => (key === 'cleaness' ? e === 'true' : parseInt(e)))
            }
          }
        }
        state.ready = true
        router.push('/overview')
      })
    },
    logout(state) {
      state.preferences.overview.length = 1
      state.token = ''
      state.ready = false
    },
    setPreference(state, preference) {
      state.preferences[preference.key] = preference.value
      if (preference.value === undefined || preference.value.length === 0) {
        ApiRequest.post('users/prefs', {
          name: 'web_' + preference.key,
          value: 'no prefs'
        })
      } else {
        ApiRequest.post('users/prefs', {
          name: 'web_' + preference.key,
          value: preference.value.join('-')
        })
      }
    }
  },
  actions: {
    login({ commit }, loginData) {
      commit('login', {
        token: loginData.token,
        username: loginData.username
      })
    },
    logout({ commit }) {
      commit('logout')
    },
    setPreference({ commit }, preferences) {
      commit('setPreference', preferences)
    }
  },
  modules: {}
})
