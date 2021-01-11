<template>
  <div class="table-beds">
    <v-dialog
      @click:outside="stateDialog = !stateDialog"
      v-model="stateDialog"
      max-width="350px"
    >
      <v-card>
        <v-card-title> Modification de l'état du lit </v-card-title>
        <v-card-text>
          <v-btn
            small
            :depressed="previousStateSelected === 0"
            :elevation="previousStateSelected === 0 ? 0 : 2"
            :color="config.BED_COLOR.free"
            :outlined="previousStateSelected === 0 ? true : false"
            dark
            @click="updateBedStatus(0)"
            rounded
            style="margin: 5px"
          >
            Libre
          </v-btn>
          <v-btn
            small
            :depressed="previousStateSelected === 1"
            :elevation="previousStateSelected === 1 ? 0 : 2"
            :outlined="previousStateSelected === 1 ? true : false"
            :color="config.BED_COLOR.leaving"
            dark
            @click="updateBedStatus(1)"
            rounded
            style="margin: 5px"
          >
            Bientôt libre
          </v-btn>
          <v-btn
            small
            :depressed="previousStateSelected === 2"
            :elevation="previousStateSelected === 2 ? 0 : 2"
            :outlined="previousStateSelected === 2 ? true : false"
            :color="config.BED_COLOR.occupied"
            dark
            @click="updateBedStatus(2)"
            rounded
            style="margin: 5px"
          >
            Occupé
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      @click:outside="cleanessDialog = !cleanessDialog"
      v-model="cleanessDialog"
      max-width="350px"
    >
      <v-card>
        <v-card-title> Modification de la propreté du lit </v-card-title>
        <v-card-text>
          <v-btn
            small
            :depressed="previousCleanessSelected === true"
            :elevation="previousCleanessSelected === true ? 0 : 2"
            :outlined="previousCleanessSelected === true ? true : false"
            :color="config.BED_COLOR.dirty"
            dark
            @click="updateBedCleaness(true)"
            rounded
            style="margin: 5px"
          >
            A nettoyer
          </v-btn>
          <v-btn
            small
            :depressed="previousCleanessSelected === false"
            :elevation="previousCleanessSelected === false ? 0 : 2"
            :outlined="previousCleanessSelected === false ? true : false"
            :color="config.BED_COLOR.clean"
            dark
            @click="updateBedCleaness(false)"
            rounded
            style="margin: 5px"
          >
            Propre
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="beds"
      class="elevation-1"
      :footer-props="footerProps"
      :options="options"
    >
      <template v-slot:item.status="{ item }">
        <v-btn
          small
          rounded
          :color="item.color.state"
          dark
          @click.stop="modifyState(item)"
        >
          {{ statesText[item.status] }}
        </v-btn>
      </template>
      <template v-slot:item.to_clean="{ item }">
        <v-btn
          small
          rounded
          :color="item.color.cleaness"
          dark
          @click.stop="modifyCleaness(item)"
        >
          {{ item.to_clean ? 'A nettoyer' : 'Propre' }}
        </v-btn>
      </template>
      <template v-slot:no-data>
        <div>Aucun lit</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'
import config from '../../common/config'

export default {
  name: 'OverviewTableBeds',
  props: { beds: Array },
  components: {},
  data() {
    return {
      stateDialog: false,
      previousStateSelected: 0,
      cleanessDialog: false,
      previousCleanessSelected: false,
      bedSelected: null,
      config: config,
      headers: [
        {
          text: 'Service',
          sortable: true,
          value: 'service_name'
        },
        { text: 'Chambre', value: 'room', sortable: true },
        { text: 'Etat', value: 'status', sortable: true },
        { text: 'Propreté', value: 'to_clean', sortable: true }
      ],
      footerProps: {
        'items-per-page-text': 'Nombre de lits par page',
        'items-per-page-options': [15, 50, 100, 200, -1]
      },
      options: {
        itemsPerPage: 15
      },
      statesText: ['Libre', 'Bientôt Libre', 'Occupé']
    }
  },
  mounted() {},
  methods: {
    modifyState(bed) {
      this.bedSelected = bed.uuid
      this.previousStateSelected = bed.status
      this.stateDialog = true
    },
    modifyCleaness(bed) {
      this.bedSelected = bed.uuid
      this.previousCleanessSelected = bed.to_clean
      this.cleanessDialog = true
    },
    updateBedStatus(newState) {
      if (newState === this.previousStateSelected) {
        return
      }
      ApiRequest.put('beds/' + this.bedSelected + '/status', {
        status: newState
      }).then(this.$emit('on-change'))
      this.stateDialog = false
    },
    updateBedCleaness(newCleaness) {
      if (newCleaness === this.previousCleanessSelected) {
        return
      }
      ApiRequest.put('beds/' + this.bedSelected + '/clean', {
        to_clean: newCleaness
      }).then(this.$emit('on-change'))
      this.cleanessDialog = false
    }
  }
}
</script>

<style scoped></style>
