<template>
  <div>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 2 : 1">
        <TheNavigationDrawer
          @update-selection="updateSelection"
          :items="items"
        />
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 10 : 11">
        <v-container fill-height fluid>
          <template
            v-if="
              selected === 'Etats des lits' || selected === 'Propreté des lits'
            "
          >
            <v-row align="center" justify="center">
              <div v-for="(pieData, index) in pieToDisplay" :key="index">
                <v-col>
                  <PieChart :pieData="pieData" />
                </v-col>
              </div>
            </v-row>
          </template>
          <template v-else-if="selected === 'Estimation de patients'">
            <v-row align="center" justify="center">
              <BarChart :barData="barData"/></v-row
          ></template>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import deepcopy from 'deepcopy'
import ApiRequest from '../common/axios-request'
import TheNavigationDrawer from '../components/TheNavigationDrawer'
import PieChart from '../components/chart/PieChart'
import BarChart from '../components/chart/BarChart'

const dataState = {
  id: 1,
  model: [
    ['Libre', 0],
    ['Départ', 0],
    ['Occupé', 0]
  ],
  colors: ['#67C23A', '#E6A23C', '#F56C6C']
}

const dataCleaness = {
  id: 2,
  model: [
    ['Propre', 0],
    ['À nettoyer', 0]
  ],
  colors: ['#409EFF', '#CC7866']
}

const pieDataModel = {
  chart: {
    type: 'pie',
    options3d: {
      enabled: false,
      alpha: 45
    }
  },
  title: {
    text: ''
  },
  plotOptions: {
    pie: {
      innerSize: 0,
      depth: 40,
      colors: null
    }
  },
  series: [
    {
      name: 'Lits',
      data: null
    }
  ],
  credits: {
    enabled: false
  }
}

const barDataModel = {
  chart: {
    type: 'bar',
    width: window.innerWidth / 2 + 200
  },
  title: {
    text: 'Estimation des patients par service'
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    categories: [],
    title: {
      text: null
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Nombre de patients',
      align: 'high'
    },
    labels: {
      overflow: 'justify'
    }
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [
    {
      name: 'Patients',
      data: []
    }
  ]
}

export default {
  name: 'DashboardView',
  components: {
    TheNavigationDrawer,
    PieChart,
    BarChart
  },
  data() {
    return {
      selected: 'Etats des lits',
      items: [
        { title: 'Etats des lits', icon: 'mdi-state-machine' },
        { title: 'Propreté des lits', icon: 'mdi-star-four-points-outline' },
        { title: 'Estimation de patients', icon: 'mdi-account-group-outline' }
      ],
      services: null,
      serviceSelected: null,
      pieState: null,
      pieCleaness: null,
      pieToDisplay: null,
      barData: null,
      value: 0,
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
        this.updateSelection(this.selected)
      },
      deep: true
    }
  },
  mounted() {
    this.selectedServices = this.preferences.services
    ApiRequest.get('services').then(response => {
      this.services = this.sortServices(response.data.services)
      this.getPieData(dataState)
      this.getBarData()
    })
  },
  methods: {
    updateSelection(selection) {
      switch (selection) {
        case 'Etats des lits':
          this.getPieData(dataState)
          break
        case 'Propreté des lits':
          this.getPieData(dataCleaness)
          break
        case 'Estimation de patients':
          this.getBarData()
          break
      }
      this.selected = selection
    },
    sortServices(services) {
      services.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      return services
    },
    pieChartFormatting(beds, serviceName, dataModel) {
      const pieData = deepcopy(pieDataModel)
      pieData.title.text = serviceName
      pieData.plotOptions.pie.colors = dataModel.colors
      pieData.series[0].data = deepcopy(dataModel.model)
      beds.forEach(bed => {
        switch (dataModel.id) {
          case 1:
            pieData.series[0].data[bed.status][1] += 1
            break
          default:
            pieData.series[0].data[bed.to_clean ? 1 : 0][1] += 1
        }
      })

      return pieData
    },
    chartsData(dataModel, beds) {
      const pieDatas = []
      this.services
        .filter(e => this.selectedServices.includes(e.id))
        .forEach(service => {
          const bedsFiltered = beds.filter(bed => bed.service === service.id)
          if (Array.isArray(bedsFiltered) && bedsFiltered.length) {
            pieDatas.push(
              this.pieChartFormatting(bedsFiltered, service.name, dataModel)
            )
          }
        })
      return pieDatas
    },
    barDataCreate(patients) {
      const barData = deepcopy(barDataModel)
      patients.forEach(patient => {
        const service = this.convertServiceIDtoName(patient.service_id)
        if (service) {
          barData.xAxis.categories.push(service.name)
          barData.series[0].data.push(patient.count)
        }
      })
      return barData
    },
    convertServiceIDtoName(serviceId) {
      return this.services.filter(service => service.id === serviceId)[0]
    },
    async getPieData(dataModel) {
      await ApiRequest.get('beds').then(response => {
        this.pieToDisplay = this.chartsData(dataModel, response.data)
      })
    },
    async getBarData() {
      await ApiRequest.get('stats/patients').then(response => {
        this.barData = this.barDataCreate(response.data)
      })
    }
  }
}
</script>

<style></style>
