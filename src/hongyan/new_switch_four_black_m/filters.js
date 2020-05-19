/* eslint-disable*/
export function time_H(val) {
  let m = Math.floor(val/60)
  let s = (val%60)
  return m+'分'+s+'秒'
}
