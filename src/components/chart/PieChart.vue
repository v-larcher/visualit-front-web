<template>
  <section class="charts" style="height: 400px; width: 550px">
    <vue-highcharts :options="pieData" ref="pieChart" />
  </section>
</template>

<script>
import VueHighcharts from 'vue2-highcharts'

export default {
  name: 'PieChart',
  components: {
    VueHighcharts
  },
  props: {
    pieData: Object
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
