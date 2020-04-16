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
  let h = Math.floor(val/2)
  let m = val%2*30
  // console.log(h+'小时'+m+'分后关机');
  return h+'小时'+m+'分钟后关机' 
}
export function modeTxt(type) {
  switch(type) {
    case 'cold':
      return '制冷'
      break
    case 'heat':
      return '制热'
      break
    case 'auto':
      return '智能'
      break
    case 'dehumidify':
      return '除湿'
      break
    case 'wind':
      return '送风'
      break
    default:
      return '制冷'
  } 
}
export function speedTxt(type) {
  switch(type) {
    case 'breeze':
      return '微风'
      break
    case 'low':
      return '低风'
      break
    case 'normal':
      return '中风'
      break
    case 'high':
      return '高风'
      break
    case 'auto':
      return '自动风'
      break
    case 'strong':
      return '强力'
      break
    default:
      return ''
  } 
}
export function time_H(val) {
  let h = Math.floor(val/3600)
  let m = (val%3600)/60
  return h+'小时'+m+'分后关机'
  
}
