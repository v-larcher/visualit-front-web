<template>
  <div class="cards-beds">
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
            style="margin-right: 5px"
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
            style="margin-right: 5px"
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
            style="margin-right: 5px"
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
          >
            Propre
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <template v-for="bed in beds">
          <v-flex xs10 sm6 md4 lg3 xl2 :key="bed.uuid">
            <v-card color="#fcfcfc">
              <v-card-title> {{ bed.service_name }} </v-card-title>
              <v-card-subtitle> Chambre {{ bed.room }}</v-card-subtitle>
              <v-card-text>
                <v-btn
                  small
                  dark
                  rounded
                  :color="bed.color.state"
                  @click.stop="modifyState(bed)"
                  style="font-size: 82%; margin-right: 2px"
                >
                  {{ statesText[bed.status] }}
                </v-btn>
                <v-btn
                  small
                  dark
                  rounded
                  :color="bed.color.cleaness"
                  @click.stop="modifyCleaness(bed)"
                  style="font-size: 82%"
                >
                  {{ bed.to_clean ? 'A nettoyer' : 'Propre' }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ApiRequest from '../../common/axios-request'
import config from '../../common/config'

export default {
  name: 'OverviewCardsBeds',
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
