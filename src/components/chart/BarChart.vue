<template>
  <section class="charts">
    <vue-highcharts :options="barOptions" ref="barChart" />
  </section>
</template>

<script>
import VueHighcharts from 'vue2-highcharts'

export default {
  name: 'BarChart',
  props: {
    barData: Object
  },
  components: {
    VueHighcharts
  },
  data() {
    return {
      barOptions: this.barData
    }
  }
}
</script>

<style scoped></style>
