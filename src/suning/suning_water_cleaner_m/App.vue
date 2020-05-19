<template>
  <div id="app">

    <div 
      v-if="success" 
      class="page-on">
      <div class="mainTitle">
        <div class="name">{{ device_name }}
          <icon class="redact" />
        </div>
        <div class="tip">
          <p v-if="model.water_leakage=='on'">
            <span @click="toggleErrorModal(true)">漏水</span>
          </p>
          <p v-else-if="model.water_shortage=='on'">缺水</p>
          <p v-else-if="model.status=='standby'">待机</p>
          <p v-else-if="model.status=='filter'">制水中...</p>
          <p v-else-if="model.status=='clean'">冲洗中...</p>
          <p v-else-if="model.status=='protect'">保护</p>
        </div>
      </div>

      <filter-items 
        :items="filterItems" 
        :view-filter="viewFilter" />

    </div>

    <div 
      v-if="!success" 
      class="page-nodata">
      <div class="mainTitle">
        <div class="name">{{ device_name }}</div>
      </div>
      <div class="pic1"/>
    </div>
    <sub-page 
      v-model="statusModalVisible" 
      title="滤芯状态" 
      class="modal-w">
      <div class="lx_status">
        <div class="p1">滤芯{{ currentFilter.index+1 }}</div>
        <div class="p2">{{ getName(currentFilter.index) }} </div>
        <circle-pie 
          :value="toPercent(currentFilter.remaining)" 
          class="pie">
          <p class="p3">预计剩余寿命</p>
          <p class="p4">{{ currentFilter.remaining }}%</p>
        </circle-pie>
      </div>
    </sub-page>

    <modal 
      v-model="alarmModalVisible" 
      :show-close-btn="false" 
      :overlay-clickable="false" 
      title="漏水警报">
      <div class="alarm">
        <div class="alert">
        <i/>检测到净水器漏水！</div>
        <div class="text">
          <p>请先排查管道、台盆、机器，确定漏水位置；</p>
          <p>非机器漏水，请擦干报警器并将净水器断电重启；</p>
          <p>若净水器漏水，请及时关闭电源和水源。</p>
        </div>
        <div class="btn">
          <a 
            href="" 
            class="btn-default" 
            @click.prevent="confirmError()">我知道了</a>
        </div>
      </div>
    </modal>

  </div>
</template>


<script>
import Modal from '@lib/components/Modal.vue'
import SubPage from '@lib/components/SubPage'
import CirclePie from './components/CirclePie.vue'
import FilterItems from './components/FilterItems.vue'
import Icon from '@lib/components/SettingIconMobile.vue'

const TDS_VALUE = [0, 50, 100, 300, 500]
const TDS_ANGLE = [-136, -74, 0, 74, 136]
const ERROR_STORE_KEY = 'water_cleaner_error'
const EXPIRED_STORE_KEY = 'water_cleaner_expired'

function getRotate(val, start, end) {
    var min = TDS_VALUE[start]
    var max = TDS_VALUE[end]
    var min_r = TDS_ANGLE[start]
    var max_r = TDS_ANGLE[end]
    return min_r + (val - min) / (max - min) * (max_r - min_r)
}

function getDays(hour) {
    return Math.ceil(hour / 24)
}

export default {
    components: {
        Modal,
        CirclePie,
        FilterItems,
        SubPage,
        Icon
    },
    data() {
        return {
            device_name: '',
            statusModalVisible: false,
            model: {},
            currentIndex: -1,
            filterItems: [],
            success: true,
            alarmModalVisible: false,
            errorStore: JSON.parse(localStorage.getItem(ERROR_STORE_KEY)) || []
        }
    },
    computed: {
        currentFilter() {
            if (this.currentIndex == -1) return {}
            return this.filterItems[this.currentIndex]
        }
    },
    watch: {
        statusModalVisible(val) {
            if (val) {
                HdSmart.UI.toggleHeadAndFoot(false)
            } else {
                HdSmart.UI.toggleHeadAndFoot(true)
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name
            }
            HdSmart.UI.showLoading()
            this.getSnapShot()
        })

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result)
        })
    },
    methods: {
        getName(index) {
            return ['PP棉', '前置活性炭', 'PP棉', 'RO', '后置活性炭'][index]
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data)
                    HdSmart.UI.hideLoading()
                },
                () => {
                    this.success = false
                    HdSmart.UI.hideLoading()
                }
            )
        },
        onSuccess(result) {
            this.success = true
            var attrs = result.attribute

            if (result.device_name) {
                this.device_name = result.device_name
            }

            this.model = attrs

            this.filterItems = this.model.filter_lifetime.map((el, index) => {
                return {
                    remaining: el,
                    index: index
                }
            })

            var errIndex = this.errorStore.indexOf('water_leakage')

            switch (this.model.water_leakage) {
                case 'on':
                    if (errIndex < 0) {
                        this.toggleErrorModal(true)
                    }
                    break
                case 'off':
                    if (errIndex >= 0) {
                        this.errorStore.splice(errIndex, 1)
                    }
                    break
                default:
                    break
            }
        },
        toPercent(remaining) {
            return remaining
        },
        viewFilter(index) {
            this.currentIndex = index
            this.statusModalVisible = true
        },
        toggleErrorModal(visible) {
            this.alarmModalVisible = visible
        },
        confirmError() {
            this.toggleErrorModal(false)
            if (this.errorStore.indexOf('water_leakage') < 0) {
                this.errorStore.push('water_leakage')
            }
        }
    },
}
</script>
