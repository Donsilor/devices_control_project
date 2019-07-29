/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function order_time(val) {
  let h = Math.floor(val/60)
  let m = val % 60
  return h+'小时'+m+'分后启动运行'
}
export function run_time(val) {
  let m = Math.floor(val/60)
  let s = val % 60
  if (s > 9) {
    return m+':'+s
  }else{
    return m+':0'+s
  }
}
