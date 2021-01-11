<template>
  <div>
    <v-container fluid>
      <v-subheader style="margin-bottom : 15px; " inset>Etats</v-subheader>
      <v-switch
        style="margin-top : -10px; margin-bottom : -10px; "
        v-for="(item, index) in states"
        :key="item.label + index.toString()"
        v-model="item.selected"
        :color="item.color"
        :label="item.label"
        @change="saveOptions('states')"
      ></v-switch>
      <v-switch
        style="margin-top : -10px; margin-bottom : -10px; "
        v-for="(item, index) in cleaness"
        :key="item.label + index.toString()"
        v-model="item.selected"
        :color="item.color"
        :label="item.label"
        @change="saveOptions('cleaness')"
      ></v-switch>
    </v-container>
  </div>
</template>

<script>
import config from '../common/config'

const enumStates = {
  FREE: 0,
  LEAVING: 1,
  BUSY: 2
}

export default {
  name: 'OptionPicker',
  data() {
    return {
      states: [
        {
          value: enumStates.FREE,
          label: 'Libre',
          color: config.BED_COLOR.free,
          selected: true
        },
        {
          value: enumStates.LEAVING,
          label: 'Bientôt libre',
          color: config.BED_COLOR.leaving,
          selected: true
        },
        {
          value: enumStates.BUSY,
          label: 'Occupé',
          color: config.BED_COLOR.occupied,
          selected: true
        }
      ],
      cleaness: [
        {
          value: false,
          label: 'Propre',
          color: config.BED_COLOR.clean,
          selected: true
        },
        {
          value: true,
          label: 'A nettoyer',
          color: config.BED_COLOR.dirty,
          selected: true
        }
      ]
    }
  },
  computed: {},
  mounted() {
    const preferences = this.$store.getters.getPreferences
    if (preferences.states !== null) {
      this.states.forEach(e => {
        if (!preferences.states.includes(e.value)) {
          e.selected = false
        }
      })
    }
    if (preferences.cleaness !== null) {
      this.cleaness.forEach(e => {
        if (!preferences.cleaness.includes(e.value)) {
          e.selected = false
        }
      })
    }

    this.saveOptions('states')
    this.saveOptions('cleaness')
  },
  // mounted() {},
  methods: {
    saveOptions(key) {
      this.$store.dispatch('setPreference', {
        key: key,
        value: this[key].filter(e => e.selected).map(e => e.value)
      })
    }
  }
}
</script>

<style scoped></style>
