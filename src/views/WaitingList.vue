<template>
  <div class="waiting-list">
    <v-data-table
      :headers="headers"
      :items="bedRequests"
      class="elevation-1"
      :footer-props="footerProps"
      :options="options"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Demandes de lits</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <BedRequestCreation @add="add" />
          <BedRequestModification
            @modif="modif"
            @close="close"
            :clicked="dialogModif"
            :bedRequest="modifBedRequest"
          />
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="headline"
                ><p>
                  Etes vous sûr de supprimer cette demande de lit?
                </p></v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close">Annuler</v-btn>
                <v-btn color="primary" text @click="deleteItemConfirm"
                  >Confirmer</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="primary" small class="mr-2" @click="editItem(item)"
          ><v-icon dark>
            mdi-pencil
          </v-icon></v-btn
        >
        <v-btn small color="error" class="ml-2" @click="deleteItem(item)"
          ><v-icon dark>
            mdi-delete
          </v-icon></v-btn
        >
      </template>
      <template v-slot:no-data>
        <div>Pas de demande de lit pour le moment</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ApiRequest from '../common/axios-request'
import BedRequestCreation from '../components/waiting_list/BedRequestCreation'
import BedRequestModification from '../components/waiting_list/BedRequestModification'

export default {
  name: 'WaitingListView',
  components: { BedRequestCreation, BedRequestModification },
  data() {
    return {
      dialogModif: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'dateString'
        },
        { text: 'Service', value: 'serviceName', sortable: false },
        { text: 'Chambre', value: 'room', sortable: false },
        { text: 'Lit', value: 'bed', sortable: false },
        { text: 'Commentaire', value: 'comment', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      footerProps: {
        'items-per-page-text': 'Demande de lits par page',
        'items-per-page-options': [15, 50, 100, 200, -1]
      },
      options: {
        itemsPerPage: 15
      },
      bedRequests: [],
      servicesNames: {},
      modifBedRequest: null,
      bedRequestToBeDeleted: null,
      selectedServices: []
    }
  },
  computed: {
    preferences() {
      return this.$store.state.preferences
    }
  },
  watch: {
    preferences: {
      handler(newVal) {
        this.selectedServices = newVal.services
        this.initialize()
      },
      deep: true
    }
  },
  mounted() {
    this.selectedServices = this.preferences.services
    ApiRequest.get('services').then(response => {
      this.sortServices(response.data.services).forEach(element => {
        this.servicesNames[element.id.toString()] = element.name
      })
      this.initialize()
    })
  },
  methods: {
    sortServices(services) {
      return services.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    },
    initialize() {
      ApiRequest.get('waiting').then(response => {
        const bedRequestsFiltered = response.data.filter(e =>
          this.selectedServices.includes(e.service)
        )
        this.bedRequests = this.sortByDateTime(
          this.convertDateTime(bedRequestsFiltered)
        )
      })
    },
    convertDateTime(data) {
      data.forEach(element => {
        const date = new Date(parseInt(element.date))
        element.dateString =
          date.toLocaleDateString('fr-FR') +
          ' ' +
          date.toLocaleTimeString('fr-FR')
        element.serviceName = this.servicesNames[element.service.toString()]
      })
      return data
    },
    sortByDateTime(data) {
      data.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
      return data
    },
    sortDateTime(a, b) {
      if (a.date.value > b.date.value) {
        return -1
      } else {
        if (b.date.value > a.date.value) {
          return 1
        } else return 0
      }
    },
    editItem(item) {
      this.modifBedRequest = item
      this.dialogModif = true
    },
    deleteItem(item) {
      this.bedRequestToBeDeleted = item.date
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      ApiRequest.delete('waiting', {
        data: { date: this.bedRequestToBeDeleted }
      }).then(response => {
        this.initialize()
      })
      this.close()
    },
    close() {
      this.dialogModif = false
      this.dialogDelete = false
    },
    add(bedRequest) {
      this.initialize()
      this.close()
    },
    modif(bedRequest) {
      this.initialize()
      this.close()
    }
  }
}
</script>

<style scoped>
.waiting-list {
  margin: 15px;
}
</style>
