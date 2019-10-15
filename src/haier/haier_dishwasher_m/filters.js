/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function work_time(val) {
  console.log(val);
  
  let h = Math.floor(val/60)
  let m = val % 60
  if (m>9) {
    return h+':'+m+':'+':00'
  }else{
    return '0'+h+':0'+m+':00'
  }
}
// export function run_time(val) {
//   let m = Math.floor(val/60)
//   let s = val % 60
//   // if(m+s == 0){
//   //   return '--:--'
//   // }
//   if (s > 9) {
//     return m+':'+s
//   }else{
//     return m+':0'+s
//   }
// }
