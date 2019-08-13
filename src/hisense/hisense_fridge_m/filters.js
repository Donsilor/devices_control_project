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

export function modeType(type) {
  switch(type) {
    case 'cool':
      return '速冷'
      break;
    case 'frozen':
      return '速冻'
      break;
    case 'smart':
      return '智能'
      break;
    case 'holiday':
      return '假日'
      break;
    case 'energySave':
      return '节能'
      break;
    default:
      return '其他'
  } 
}
