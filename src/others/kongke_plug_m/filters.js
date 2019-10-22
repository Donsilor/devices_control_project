/* eslint-disable*/

export function closeTime(val) {
  if(val){
    let h = Math.floor(val/60)
    let m = val%60
    return h+'小时'+m+'分钟后关机 '
  }else{
    return  ''
  }
}

export function openTime(val) {
  let h = Math.floor(val/60)
  let m = val%60
  if (val) {
    return h+'小时'+m+'分钟后开机'
  } else {
    return  ''
  }
}

export function delayTime(val) {
  let h = Math.floor(val/60)
  let m = val % 60
  h = h < 10 ? ("0" + h) : h
  m = m < 10 ? ("0" + m) : m
  return h + ":" + m + ':00'
}