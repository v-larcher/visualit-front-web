<template>
  <div class="">
    <network
      class="network"
      ref="network"
      :nodes="network.nodes"
      :edges="network.edges"
      :options="network.options"
    />
  </div>
</template>

<script>
import { Network } from 'vue2vis'
import config from '../../common/config'

export default {
  name: 'OverviewCardsBeds',
  props: { beds: Array },
  components: { Network },
  data() {
    return {
      network: null
    }
  },
  watch: {
    beds: {
      handler: 'resetNetwork',
      immediate: true
    }
  },
  methods: {
    resetNetwork() {
      this.network = {
        nodes: [],
        edges: [],
        options: {
          layout: { improvedLayout: false },
          physics: {
            forceAtlas2Based: {
              gravitationalConstant: -50,
              centralGravity: 0.015,
              springLength: 50,
              springConstant: 0.15
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: { iterations: 150 }
          },
          groups: {
            free: {
              title: 'Libre',
              color: {
                background: config.BED_COLOR.free,
                border: config.BED_COLOR.free,
                highlight: {
                  background: config.BED_COLOR.free,
                  border: config.BED_COLOR.free
                }
              },
              borderWidth: 3
            },
            leaving: {
              title: 'Départ',
              color: {
                background: config.BED_COLOR.leaving,
                border: config.BED_COLOR.leaving,
                highlight: {
                  background: config.BED_COLOR.leaving,
                  border: config.BED_COLOR.leaving
                }
              },
              borderWidth: 3
            },
            occupied: {
              title: 'Occupé',
              color: {
                background: config.BED_COLOR.occupied,
                border: config.BED_COLOR.occupied,
                highlight: {
                  background: config.BED_COLOR.occupied,
                  border: config.BED_COLOR.occupied
                }
              },
              borderWidth: 3
            },
            room: {
              color: {
                background: 'rgba(224, 232, 240, 1)',
                border: 'rgb(60,60,60)',
                highlight: {
                  background: 'rgba(200, 200, 230, 1)',
                  border: 'rgba(30, 30, 30, 1)'
                }
              },
              borderWidth: 2
            },
            service: {
              color: {
                background: 'rgba(224, 232, 240, 1)',
                border: 'rgb(60,60,60)',
                highlight: {
                  background: 'rgba(200, 200, 230, 1)',
                  border: 'rgba(30, 30, 30, 1)'
                }
              },
              borderWidth: 2
            }
          }
        }
      }
      this.network.nodes = []

      const convertServiceIDs = {}
      const convertRoomIDs = {}

      let idNode = 0
      let idEdge = 0

      const statesText = ['free', 'leaving', 'occupied']
      const servicesNodeCreated = []
      const roomsNodeCreated = []

      this.beds.forEach(bed => {
        if (!servicesNodeCreated.includes(bed.service)) {
          convertServiceIDs[bed.service] = idNode
          this.network.nodes.push({
            id: idNode,
            label: bed.service_name,
            group: 'service',
            size: 30,
            shape: 'circle'
          })
          servicesNodeCreated.push(bed.service)
          idNode++
        }

        if (!roomsNodeCreated.includes(bed.room)) {
          convertRoomIDs[bed.room] = idNode
          this.network.nodes.push({
            id: idNode,
            label: bed.room,
            group: 'room',
            size: 25,
            shape: 'ellipse'
          })
          this.network.edges.push({
            id: idEdge,
            from: convertServiceIDs[bed.service],
            to: idNode,
            width: 2
          })
          idEdge++
          roomsNodeCreated.push(bed.room)
          idNode++
        }

        this.network.nodes.push({
          id: idNode,
          label: ' ',
          group: statesText[bed.status],
          size: 20,
          shape: 'box'
        })
        this.network.edges.push({
          id: idEdge,
          from: convertRoomIDs[bed.room],
          to: idNode,
          width: 3,
          title: bed.to_clean ? 'À nettoyer' : 'Propre',
          color: {
            color: bed.to_clean
              ? config.BED_COLOR.dirty
              : config.BED_COLOR.clean,
            highlight: bed.to_clean
              ? config.BED_COLOR.dirty
              : config.BED_COLOR.clean
          }
        })
        idEdge++
        idNode++
      })
      /*
      this.rooms.forEach(room => {
        if (!servicesSelectedIds.includes(room.service_id)) {
          convertIDs[room.service_id] = idNode
          this.network.nodes.push({
            id: idNode,
            label: room.service_name,
            group: 'service',
            size: 30,
            shape: 'circle'
          })
          servicesSelectedIds.push(room.service_id)
          idNode++
        }
        this.network.nodes.push({
          id: idNode,
          label: room.number,
          title: room.number,
          group: 'room',
          size: 25,
          shape: 'ellipse'
        })
        this.network.edges.push({
          id: idEdge,
          from: convertIDs[room.service_id],
          to: idNode,
          width: 2
        })
        const roomNode = idNode
        idNode++
        idEdge++
        room.beds.forEach(bed => {
          this.network.nodes.push({
            id: idNode,
            label: bed.name,
            group: statesText[bed.status],
            size: 20,
            shape: 'box'
          })
          this.network.edges.push({
            id: idEdge,
            from: roomNode,
            to: idNode,
            width: 3,
            title: bed.to_clean ? 'À nettoyer' : 'Propre',
            color: {
              color: bed.to_clean
                ? config.BED_COLOR.dirty
                : config.BED_COLOR.clean,
              highlight: bed.to_clean
                ? config.BED_COLOR.dirty
                : config.BED_COLOR.clean
            }
          })
          idNode++
          idEdge++
        })
      }) */
    }
  }
}
</script>

<style scoped>
.network {
  height: 800px;
  background: white;
  margin: 5px 0;
}
</style>
