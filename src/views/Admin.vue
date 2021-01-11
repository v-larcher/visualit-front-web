<template>
  <div class="admin">
    <v-row>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 2 : 1">
        <TheNavigationDrawer
          @update-selection="updateSelection"
          :items="items"
        />
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 10 : 11">
        <v-tabs
          v-model="indexTabs[selected]"
          grow
          show-arrows
          active-class="elevation-1 darken-2"
          background-color="#f9f9f9"
        >
          <template v-for="(item, index) in content[selected]">
            <v-tab :key="index"> {{ item.title }} </v-tab>
            <v-tab-item :key="index">
              <v-row align="center" justify="center">
                <v-col xs="10" sm="10" md="8" lg="6" xl="4">
                  <keep-alive> <div :is="item.component"/></keep-alive> </v-col
              ></v-row>
            </v-tab-item>
          </template>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TheNavigationDrawer from '../components/TheNavigationDrawer'
import AccountCreation from '../components/account/AccountCreation'
import AccountNameModification from '../components/account/AccountNameModification'
import AccountPasswordModification from '../components/account/AccountPasswordModification'
import AccountCancelation from '../components/account/AccountCancelation'
import ServiceModification from '../components/ServiceModification'
import ServiceCreation from '../components/service/ServiceCreation'
import ServiceRename from '../components/service/ServiceRename'
import ServiceDelete from '../components/service/ServiceDelete'
import RoomCreation from '../components/room/RoomCreation'
import RoomRename from '../components/room/RoomRename'
import RoomMove from '../components/room/RoomMove'
import RoomDelete from '../components/room/RoomDelete'
import BedCreation from '../components/bed/BedCreation'
import BedDelete from '../components/bed/BedDelete'

export default {
  name: 'AdminView',
  components: {
    TheNavigationDrawer,
    AccountCreation,
    AccountNameModification,
    AccountPasswordModification,
    AccountCancelation,
    ServiceModification,
    ServiceCreation,
    ServiceRename,
    ServiceDelete,
    RoomCreation,
    RoomRename,
    RoomMove,
    RoomDelete,
    BedCreation,
    BedDelete
  },
  data() {
    return {
      selected: 'Comptes',
      activeAccountTab: 0,
      items: [
        { title: 'Comptes', icon: 'mdi-account-cog' },
        { title: 'Services', icon: 'mdi-floor-plan' },
        { title: 'Chambres', icon: 'mdi-bunk-bed' },
        { title: 'Lits', icon: 'mdi-bed' }
      ],
      accountTabs: [
        { title: 'Création de compte', component: AccountCreation },
        {
          title: "Modification d'identifiant",
          component: AccountNameModification
        },
        {
          title: 'Modification de mot de passe',
          component: AccountPasswordModification
        },
        { title: 'Suppression de compte', component: AccountCancelation }
      ],
      activeServiceTab: 0,
      serviceTabs: [
        { title: 'Création de service', component: ServiceCreation },
        { title: 'Renommer un service', component: ServiceRename },
        { title: 'Supprimer un service', component: ServiceDelete }
      ],
      activeRoomTab: 0,
      roomTabs: [
        { title: 'Création de chambre', component: RoomCreation },
        {
          title: 'Modification nom de chambre',
          component: RoomRename
        },
        {
          title: 'Déplacement de chambre',
          component: RoomMove
        },
        { title: 'Suppression de chambre', component: RoomDelete }
      ],
      activeBedTab: 0,
      bedTabs: [
        { title: 'Création de lit', component: BedCreation },
        { title: 'Suppression de lit', component: BedDelete }
      ],
      indexTabs: { Comptes: 0, Services: 0, Chambres: 0, Lits: 0 },
      content: {
        Comptes: [
          { title: 'Création de compte', component: AccountCreation },
          {
            title: "Modification d'identifiant",
            component: AccountNameModification
          },
          {
            title: 'Modification de mot de passe',
            component: AccountPasswordModification
          },
          { title: 'Suppression de compte', component: AccountCancelation }
        ],
        Services: [
          { title: 'Création de service', component: ServiceCreation },
          { title: 'Renommer un service', component: ServiceRename },
          { title: 'Supprimer un service', component: ServiceDelete }
        ],
        Chambres: [
          { title: 'Création de chambre', component: RoomCreation },
          {
            title: 'Modification nom de chambre',
            component: RoomRename
          },
          {
            title: 'Déplacement de chambre',
            component: RoomMove
          },
          { title: 'Suppression de chambre', component: RoomDelete }
        ],
        Lits: [
          { title: 'Création de lit', component: BedCreation },
          { title: 'Suppression de lit', component: BedDelete }
        ]
      }
    }
  },
  methods: {
    updateSelection(selection) {
      this.selected = selection
    }
  }
}
</script>

<style></style>
