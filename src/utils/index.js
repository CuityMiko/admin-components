/**
 * 防抖函数
 * @param {*} delay
 * @param {*} callback
 * @returns
 */
export function debounce(delay, callback) {
  let task
  return function () {
    clearTimeout(task)
    task = setTimeout(() => {
      callback.apply(this, arguments)
    }, delay)
  }
}

/**
 * 权限树结构数据处理
 * @param {Array} data
 * @param {string} childNodeName 子节点名字
 * @param {string} anotherChild  需要赋值显示节点名
 */
export function loopchildren(data, childNodeName, anotherChild) {
  data.map(item => {
    if (item[childNodeName]) {
      if (item[anotherChild] && item[anotherChild].length != 0) {
        item[childNodeName] = item[childNodeName].concat(item[anotherChild])
      }
      loopchildren(item[childNodeName], childNodeName, anotherChild)
    }
  })
  return data
}
