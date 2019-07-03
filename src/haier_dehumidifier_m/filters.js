/* eslint-disable*/
export function time_H(val) {
  let h = Math.floor(val/3600)
  let m = (val%3600)/60
  return h+'小时'+m+'分后关机'
}
