/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function fixTemperature(val) {
  let tmp = val / 10
  tmp = tmp.toFixed(0)
  return tmp 
}

export function modeType(type) {
  switch(type) {
    case 'strong_wash':
      return '标准洗'
      break;
    case 'high_speed_15m':
      return '速洗15′'
      break;
    case 'spin':
      return '单脱水'
      break;
    case 'odor_removal':
      return '简自洁'
      break;

    case 'mix':
        return '混合'
        break;
    case 'cotton':
        return '棉麻'
        break;
      case 'synthetic':
        return '化纤'
        break;
      case 'cardigan':
        return '羊毛'
        break;
      case 'cowboy_suit':
        return '牛仔'
        break;
      case 'down_coat':
        return '羽绒服'
        break;
      default:
        return '其他'
  } 
}

export function operationType(type) {
  switch(type) {
    case 'none':
      return '无操作'
      break;
    case 'reserve':
      return '预约等待'
      break;
    case 'pre-wash':
      return '预洗'
      break;
    case 'wash':
      return '主洗'
      break;

    case 'rinse':
        return '漂洗'
        break;
    case 'spin':
        return '脱水'
        break;
    case 'drying':
        return '烘干'
        break;
    case 'finish':
      return '洗衣完成'
      break;
  } 
}

