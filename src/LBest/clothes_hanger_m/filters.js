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
}

export function dryingText(v) {
  if(v.drying == 'on'){
    return '热风干'
  }else if(v.air_drying == 'on'){
    return '冷风干'
  }else{
    return '风干'
  }
  // switch(v){
  //   case 'top':
  //   return '已到最高'
  //   break
  //   case 'bottom':
  //     return '已到最底'
  //    break

  // }
}