/* eslint-disable*/
export function modeType(type) {
  switch(type) {
    case 'auto':
      return '智能'
      break;
    case 'cold':
      return '制冷'
      break;
    case 'heat':
      return '制热'
      break;
    case 'dehumidify':
      return '除湿'
      break;
    case 'wind':
      return '送风'
      break;
  }
}
export function time_H(val) {
  let h = Math.floor(val/3600)
  let m = (val%3600)/60
  return h+'小时'+m+'分后关机'
}
