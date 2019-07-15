/* eslint-disable*/
export function nameType(type) {
  switch(+type) {
    case 0:
      return '首播电影'
      break;
    case 1:
      return '同步电视剧'
      break;
    case 2:
      return '亲子动漫'
      break;
    case 3:
      return '王牌综艺'
      break;
  } 
}
export function channelName(type) {
  switch(type) {
    case '001':
      return '电影'
      break;
    case '002':
      return '电视剧'
      break;
    case '003':
      return '动漫'
      break;
    case '004':
      return '综艺'
      break;
  } 
}
