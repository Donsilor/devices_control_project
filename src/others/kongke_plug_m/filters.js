/* eslint-disable*/

export function closeTime(val) {
  if(val){
    let h = Math.floor(val/60)
    let m = val%60
    console.log(h+'小时'+m+'分后关机');
    return h+'小时'+m+'分钟后关机'
  }else{
    return '--小时--分钟后关机'
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
