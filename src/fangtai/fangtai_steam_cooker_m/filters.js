/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
export function filterTm(tm) {
  let tmp = '--'
  if(tm || tm == 0){
    tmp = (+tm)/10
  }
  return tmp
}
export function closeTime(val) {
  let h = Math.floor(val/60)
  let m = val%60
  // console.log(h+'小时'+m+'分后关机');
  return h+'小时'+m+'分钟后关机'
}
export function modeType(type) {
  switch(type) {
    case '1':
      return '暂停中'
      break;
    case '2':
      return '烹饪完成'
      break;
    case '3':
      return '预热完成'
      break;
    case '4':
      return '烹饪中'
      break;
    case '5':
      return '烹饪完成'
      break;
    case '6':
      return '预约中'
      break;
    case '7':
      return '需要除垢'
      break;
  }
}
export function time_H(val) {
  let h = Math.floor(val/3600)
  let m = (val%3600)/60
  return h+'小时'+m+'分后关机'
}
