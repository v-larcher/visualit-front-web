<template>
  <div class="navigation-drawer">
    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item-group mandatory v-model="model">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="$emit('update-selection', item.title)"
          >
            <v-icon style="margin-right: 10px">{{ item.icon }}</v-icon>
            <v-list-item-content>
              <v-list-item-title v-if="$vuetify.breakpoint.mdAndUp">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  props: { items: Array },
  data() {
    return {
      model: 0
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped>
.navigation-drawer {
  margin-left: 13px;
}
</style>
