/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function filterTm(tm) {
  let tmp = '--'
  if(tm){
    tmp = (+tm)/10
  }
  return tmp
}