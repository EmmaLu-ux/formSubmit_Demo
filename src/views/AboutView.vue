<template>
  <div class="about">
    <a-card style="padding: 0px">
      <a-form :model="formState" name="formDemo" @finish="onFinish" :rules="rules" ref="formRef">
        <div v-for="(data, index) in formState.datas" :key="data.id" class="about-block">
          <div class="close-button">
            <a-button type="link" danger @click="removeBlock(data)">
              <i class="iconfont icon-icon-test" />
            </a-button>
          </div>
          <a-space wrap>
            <a-form-item :name="['datas', index, 'port']" label="端口号" :rules="rules.datas.port">
              <a-select v-model:value="data.port" :options="optionsList['portsOptions']" placeholder="请选择"
                style="min-width:140px" @click="getSelect('ports')"
                @change="(value, option) => handleChange(value, option, 'ports')"></a-select>
            </a-form-item>
            <a-form-item :name="['datas', index, 'serviceType']" label="服务类型" :rules="rules.datas.serviceType">
              <a-select v-model:value="data.serviceType" :options="optionsList['serviceTypesOptions']" placeholder="请选择"
                style="min-width:140px" @click="getSelect('serviceTypes')"
                @change="(value, option) => handleChange(value, option, 'serviceTypes')"></a-select>
            </a-form-item>
            <a-form-item :name="['datas', index, 'deviceNum']" label="设备串号" :rules="rules.datas.deviceNum">
              <a-input v-model:value="data.deviceNum" placeholder="请输入"></a-input>
            </a-form-item>





            <a-form-item :name="['datas', index, 'deviceName']" label="设备名称" :rules="rules.datas.deviceName">
              <a-input v-model:value="data.deviceName" placeholder="请输入"></a-input>
            </a-form-item>
            <a-form-item :name="['datas', index, 'algorithm']" label="人防需求算法" :rules="rules.datas.algorithm">
              <a-select v-model:value="data.algorithm" placeholder="请选择" :options="optionsList['algorithmsOptions']"
                style="min-width:140px" @click="getSelect('algorithms')"
                @change="(value, option) => handleChange(value, option, 'algorithms')"></a-select>
            </a-form-item>
            <a-form-item :name="['datas', index, 'reportBoardBandName']" label="设备上报宽带"
              :rules="rules.datas.reportBoardBandName">
              <a-input v-model:value="data.reportBoardBandName" placeholder="请输入"></a-input>
            </a-form-item>
            <a-form-item :name="['datas', index, 'treeNode']" label="归属行政树节点" :rules="rules.datas.treeNode">
              <a-select v-model:value="data.treeNode" placeholder="请选择" :options="optionsList['treeNodesOptions']"
                style="min-width:140px" @click="getSelect('treeNodes')"
                @change="(value, option) => handleChange(value, option, 'treeNodes')"></a-select>
            </a-form-item>
            <a-form-item :name="['datas', index, 'deviceDetailAddr']" label="设备详细地址"
              :rules="rules.datas.deviceDetailAddr">
              <a-input v-model:value="data.deviceDetailAddr" placeholder="请输入"></a-input>
            </a-form-item>
            <a-form-item :name="['datas', index, 'logituide']" label="经度">
              <a-input v-model:value="data.logituide" placeholder="请输入"></a-input>
            </a-form-item>
            <a-form-item :name="['datas', index, 'latitude']" label="纬度">
              <a-input v-model:value="data.latitude" placeholder="请输入"></a-input>
            </a-form-item>
          </a-space>
        </div>
        <a-form-item>
          <a-button type="dashed" block @click="addBlock">
            <PlusOutlined />
            Add Block
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="onFinish">提交</a-button>
            <a-button type="default">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 10px;">
      <a-table :columns="columns" :dataSource="dataSource">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'logituide'">
            {{ record.logituide == '' ? '-' : record.logituide }}
          </template>
          <template v-if="column.key === 'latitude'">
            {{ record.latitude == '' ? '-' : record.latitude }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form';
import { PlusOutlined, MinusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { Datas } from '@/src/types/formSubmit'
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { getFormList, getSelectDatas, portsSelectedDel, checkDeviceNumApi } from '@/api/formSubmitApi'

const formRef = ref<FormInstance>()
const rulesMessage = ref()
const dataSource = ref([])
const optionsList = reactive({
  'portsOptions': [
    {
      label: '端口1',
      value: '8080',
    },
    {
      label: '端口2',
      value: '8081',
    },
    {
      label: '端口3',
      value: '8082',
    }
  ],
  'serviceTypesOptions': [
    {
      label: '服务1',
      value: 'service_1',
    },
    {
      label: '服务2',
      value: 'service_2',
    },
    {
      label: '服务3',
      value: 'service_3',
    }
  ],
  'algorithmsOptions': [
    {
      label: '算法1',
      value: 'alg_1',
    },
    {
      label: '算法2',
      value: 'alg_2',
    },
    {
      label: '算法3',
      value: 'alg_3',
    }
  ],
  'treeNodesOptions': [
    {
      label: '行政树节点1',
      value: 'treeNode_1',
    },
    {
      label: '行政树节点2',
      value: 'treeNode_2',
    },
    {
      label: '行政树节点3',
      value: 'treeNode_3',
    }
  ]
})
const columns = [
  {
    title: '端口',
    dataIndex: 'port',
    key: 'port',
    // scopedSlots: { customRender: 'port' }
  },
  {
    title: '服务类型',
    dataIndex: 'serviceType',
    key: 'serviceType',
    // scopedSlots: { customRender: 'serviceType' }
  },
  {
    title: '设备串号',
    dataIndex: 'deviceNum',
    key: 'deviceNum',
    // scopedSlots: { customRender: 'deviceNum' }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    // scopedSlots: { customRender: 'deviceName' }
  },
  {
    title: '人防需求算法',
    dataIndex: 'algorithm',
    key: 'algorithm',
    // scopedSlots: { customRender: 'algorithm' }
  },
  {
    title: '上报宽带',
    dataIndex: 'reportBoardBandName',
    key: 'reportBoardBandName',
    // scopedSlots: { customRender: 'reportBo}
  },
  {
    title: '归属行政树节点',
    dataIndex: 'treeNode',
    key: 'treeNode',
    // scopedSlots: { customRender: 'treeNode' }
  },
  {
    title: '设备详细地址',
    dataIndex: 'deviceDetailAddr',
    key: 'deviceDetailAddr',
    // scopedSlots: { customRender: 'deviceDetailAddr' }
  },
  {
    title: '经度',
    dataIndex: 'logituide',
    key: 'logituide',
    // scopedSlots: { customRender: 'logituide' }
  },
  {
    title: '纬度',
    dataIndex: 'latitude',
    key: 'latitude',
    // scopedSlots: { customRender: 'lat}
  },
]

const formState = reactive<{ datas: Datas[] }>({
  datas: []
})
const addBlock = async () => {
  console.log('addBlock')
  formState.datas.push({
    id: Date.now(),
    port: undefined,
    serviceType: undefined,
    deviceNum: '',
    deviceName: '',
    algorithm: undefined,
    reportBoardBandName: '',
    treeNode: undefined,
    deviceDetailAddr: '',
    logituide: '',
    latitude: '',
  })

  // 接口获取端口号数据、服务类型、人防需求算法数据与归属行政数节点数据
  // try {
  //   let res = await getSelectDatas()
  //   // console.log('res', res)
  //   if (res.code !== 200) {
  //     message.error(res.msg)
  //     return
  //   }
  //   const { ports, serviceTypes, algorithms, treeNodes } = res.data
  //   portsOptions.value = ports
  //   serviceTypeOptions.value = serviceTypes
  //   algorithmsOptions.value = algorithms
  //   treeNodesOptions.value = treeNodes
  // } catch (error) {
  //   message.error(error)
  // }
}
const getSelect = async (select) => {
  try {
    let res = await getSelectDatas()
    console.log('res-getSelect', res)
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    optionsList[`${select}Options`] = res.data[select]
  } catch (error) {
    message.error(error)
  }
}
const handleChange = async (value, option, type) => {
  console.log('value-handleChange', value, option, type)
  let selectId = optionsList[`${type}Options`].filter(item => item.value === value)[0]
  // console.log('qwe', portsId)
  // 调用接口，删除后端ports数据中的value值
  try {
    let res = await portsSelectedDel({ id: selectId?.id, type })
    if (res.code !== 200) {
      message.error(res.data.msg)
      return
    }
    // message.success(res.data.msg) // TODO: 删除该提示
  } catch (error) {
    message.error(error)
  }
}
const checkDeviceNum = async (_, value) => {
  // console.log('checkDeviceNum', value)
  try {
    let res = await checkDeviceNumApi({ deviceNum: value })
    if (res.code !== 200) {
      return Promise.reject(new Error(res.data.msg))
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('校验失败'));
  }
}

const rules: Record<string, Rule[]> = {
  datas: {
    port: [{ required: true, message: '请输入端口号' },],
    serviceType: [{ required: true, message: '请输入服务类型' },],
    deviceNum: [
      { required: true, message: '请输入设备串号' },
      { trigger: 'blur', validator: checkDeviceNum }
    ],
    deviceName: [
      { required: true, message: '请输入设备名称' },
    ],
    algorithm: [{ required: true, message: '请输入人防需求算法' },],
    reportBoardBandName: [{ required: true, message: '请输入设备上报宽带' },],
    treeNode: [{ required: true, message: '请输入归属行政树节点' },],
    deviceDetailAddr: [{ required: true, message: '请输入设备详细地址' },],
  }
}
const removeBlock = (data: Datas) => {
  console.log('removeBlock-data', data)
  const index = formState.datas.indexOf(data)
  if (index !== -1) {
    formState.datas.splice(index, 1)
  }
}

const onFinish = (values) => {
  formRef.value.validate().then(async value => {
    let res = await getFormList(formState.datas)
    const { msg } = res.data
    if (res.code !== 200) {
      message.info(msg)
      return
    }
    dataSource.value = res.data
    message.success(res.msg)
    console.log('Finish:', formState.datas)
    formState.datas = []
    // formState.datas.map(item => removeBlock(item))
  }).catch(err => {
    message.error(err)
  })
}
</script>

<style scoped>
.about {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}

.about-block {
  position: relative;
  padding: 20px 20px 0;
  border: 1px dashed #1677FF;
  width: 100%;
  margin-bottom: 10px
}

.close-button {
  position: absolute;
  top: -17px;
  right: -24px;
  z-index: 1;
}
</style>
