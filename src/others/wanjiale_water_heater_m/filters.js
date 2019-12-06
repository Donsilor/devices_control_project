/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function closeTime(val) {
  if(val){
    let h = Math.floor(val/60)
    let m = val%60
    return h+'小时'+m+'分钟后加热 '
  }else{
    return  ''
  }
}
