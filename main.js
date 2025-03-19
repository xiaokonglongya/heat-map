document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const container = document.getElementById('heatmap-container')
  const clearButton = document.getElementById('clear-button')
  const clickCount = document.getElementById('click-count')

  // 计数器
  let count = 0

  // 鼠标停留相关变量
  let hoverTimer = null
  let currentPosition = { x: 0, y: 0 }
  const hoverDelay = 500 // 停留500毫秒添加热点
  const heatPointValue = 20 // 增加热点强度值，使其更容易被看到

  // 配置热力图
  const heatmapConfig = {
    container: container,
    radius: 80,
    maxOpacity: 0.8,
    minOpacity: 0.1, // 提高最小不透明度
    blur: 0.75,
    gradient: {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red',
    },
  }

  // 初始化热力图
  const heatmapInstance = h337.create(heatmapConfig)

  // 初始数据
  const initialData = {
    max: 100,
    min: 0,
    data: [],
  }

  // 设置初始数据
  heatmapInstance.setData(initialData)

  // 鼠标移动事件
  container.addEventListener('mousemove', function (event) {
    // 获取相对于容器的坐标
    const rect = container.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // 更新当前位置
    currentPosition = { x, y }

    // 清除之前的计时器
    if (hoverTimer) {
      clearTimeout(hoverTimer)
    }

    // 设置新的计时器
    hoverTimer = setTimeout(() => {
      // 确保坐标在容器范围内
      if (x >= 0 && x <= container.offsetWidth && y >= 0 && y <= container.offsetHeight) {
        // 添加一个热点，增加value值
        heatmapInstance.addData({
          x: currentPosition.x,
          y: currentPosition.y,
          value: heatPointValue, // 使用更高的数值
        })

        // 在控制台输出添加点的位置信息，便于调试
        console.log(`添加热点: x=${currentPosition.x}, y=${currentPosition.y}, value=${heatPointValue}`)

        // 更新计数
        count++
        clickCount.textContent = count
      }
    }, hoverDelay)
  })

  // 鼠标离开容器时清除计时器
  container.addEventListener('mouseleave', function () {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
  })

  // 清除按钮事件
  clearButton.addEventListener('click', function () {
    heatmapInstance.setData({
      max: 100,
      min: 0,
      data: [],
    })
    count = 0
    clickCount.textContent = count
  })

  // 演示：自动添加一些随机点
  function addRandomPoint() {
    const x = Math.floor(Math.random() * container.offsetWidth)
    const y = Math.floor(Math.random() * container.offsetHeight)
    const value = Math.floor(Math.random() * 100) + 20 // 确保随机点也有足够的值

    heatmapInstance.addData({
      x: x,
      y: y,
      value: value,
    })

    console.log(`添加随机点: x=${x}, y=${y}, value=${value}`)
  }

  // 添加几个初始点
  for (let i = 0; i < 10; i++) {
    addRandomPoint()
  }
})
