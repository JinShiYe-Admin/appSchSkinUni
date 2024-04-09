// 分钟数转换为小时+分钟
function toHoursAndMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { hours, minutes }
}

// 分钟数转小时数
function minsToHours(minutes) {
  var hours = parseInt(minutes / 60) // 计算小时数，使用parseInt取整
  var remainingMinutes = minutes - hours * 60 // 计算剩余的分钟数
  return hours + remainingMinutes / 60
}

function timeStrByMinutes(time) {
  if (time > 0) {
    const hm = toHoursAndMinutes(time)
    return `${hm.hours ? hm.hours + '小时' : ''}${hm.minutes ? hm.minutes + '分钟' : ''}`
  } else if (time === 0) {
    return '0小时'
  } else {
    return ''
  }
}

export default timeStrByMinutes