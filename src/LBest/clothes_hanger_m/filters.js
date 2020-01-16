/* eslint-disable*/
export function statusText(v) {
  switch(v){
    case 'top':
    return '已到最高'
    break
    case 'bottom':
      return '已到最底'
     break

  }
  
  // return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}