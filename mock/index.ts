import Mock from 'mockjs'

const MockAny: any = Mock
const { Random } = MockAny

let datas = MockAny.mock({
  'ports|3-10': [
    {
      'id|+1': 1,
      'value|1024-65535': 1,
    },
  ],
  'serviceTypes|5-10': [
    {
      'id|+1': 1,
      'value|1': '服务类型@increment',
    },
  ],
  'algorithms|5-10': [
    {
      'id|+1': 1,
      'value|1': '算法类型@increment',
    },
  ],
  'treeNodes|3-16': [
    {
      'id|+1': 1,
      'value|1': '树节点@increment',
    },
  ],
})
function generateUniqueRandomNumbers(count, min, max) {
  const numbers = new Set()
  while (numbers.size < count) {
    numbers.add(Random.integer(min, max))
  }
  return Array.from(numbers)
}

// 使用 Mock.js 生成不重复的随机数集合
let itemData = MockAny.mock({
  'deviceNum|3-15': [
    {
      'id|+1': 1,
      value: 0, // 占位符
    },
  ],
})
// 设置随机数范围和数量
const randomValues = generateUniqueRandomNumbers(itemData.deviceNum.length, 1000, 9999)

// 将不重复的随机数填充到 deviceNum 数组
itemData.deviceNum.forEach((item, index) => {
  item.value = randomValues[index]
})

export default [
  {
    url: '/api/form/submit',
    method: 'post',
    response: ({ body }) => {
      console.log('body', body)
      // 获取请求体鞋带过来的用户名与密码
      // const { port, deviceName } = body
      // // 调用获取用户信息的函数，用于判断是否有此用户
      // const checkData = createFormList().find(
      //   (item) => item.port === port && item.deviceName === deviceName,
      // )

      // 返回失败信息
      // if (!checkData) {
      //   return { code: 201, data: { msg: ' 端口号或设备名已存在！ ' } }
      // }

      // 返回成功信息
      // const { token } = checkData
      return { code: 200, data: body, msg: '添加成功' }
    },
  },
  {
    url: '/api/select/list',
    method: 'get',
    response: () => {
      return { code: 200, data: datas }
    },
  },
  {
    url: '/api/select/del',
    method: 'delete',
    response: ({ body }) => {
      console.log('body', body)
      const { id, type } = body // 要删除的select列表中的对象对应的id
      // 删除datas中的ports对象数组中的id为id的对象
      const index = datas[type].findIndex((item) => item.id === id)
      if (index !== -1) {
        datas[type].splice(index, 1)
        return { code: 200, data: { msg: '去除成功！' } }
      }
      return { code: 201, data: { msg: '去除失败！' } }
    },
  },
  {
    url: '/api/select/check',
    method: 'post',
    response: ({ body }) => {
      console.log('body', body.deviceNum)
      console.log('itemData.deviceNum', itemData.deviceNum)
      const { deviceNum } = body
      // 在itemData中的deviceNum字段中查找是否有deviceNum
      const index = itemData.deviceNum.findIndex((item) => item.value === Number(deviceNum))
      if (index !== -1) {
        return { code: 201, data: { msg: '设备号已存在！' } }
      } else {
        return { code: 200, data: { msg: '设备号不存在！' } }
      }
    },
  },
]
