/* eslint-disable*/
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function fixVal(val) {
  if (val||val===0) {
    return val / 10
  } else {
    return '---'
  } 
}

export function fixVal2(val) {
  if (val||val===0) {
    return val / 100
  } else {
    return '---'
  } 
}

export function pm25Text(pm2) {
  if (pm2||pm2===0) {
    if (pm2 >= 0 && pm2 <= 35) {
      return '优'
    } else if (pm2 > 35 && pm2 <= 75) {
      return '良'
    } else if (pm2 > 75 && pm2 <= 115) {
      return '轻度污染'
    } else if (pm2 > 115 && pm2 <= 150) {
      return '中度污染'
    } else if (pm2 > 150 && pm2 <= 255) {
      return '重度污染'
    } else {
      return '严重污染'
    }
  } else {
    return '----'
  }
}

export function temperatureText(tmp) {
  if (tmp||tmp===0) {
    if (tmp <= -100) {
      return '极寒'
    } else if (tmp > -100 && tmp <= 100) {
      return '寒冷'
    } else if (tmp > 100 && tmp <= 150) {
      return '较冷'
    } else if (tmp > 150 && tmp <= 220) {
      return '凉爽'
    } else if (tmp > 220 && tmp <= 260) {
      return '适宜'
    } else if (tmp > 260 && tmp <= 300) {
      return '较热'
    } else if (tmp > 300 && tmp <= 340) {
      return '炎热'
    } else {
      return '酷热'
    }
  } else {
    return '--'
  }
}

export function humidityText(val) {
  if (val||val===0) {
    if (val <= 1000) {
      return '极度干燥'
    } else if (val > 1000 && val <= 3000) {
      return '较为干燥'
    } else if ((val > 3000 && val <= 4000) || (val > 6000 && val <= 7000)) {
      return '较适宜'
    } else if (val > 4000 && val <= 6000) {
      return '适宜'
    } else if (val > 7000 && val <= 9000) {
      return '较潮湿'
    } else {
      return '非常潮湿'
    }
  } else {
    return '----'
  }
}

// export function tvocText(val) {
//   if (val && val > 0) {
//     if (val > 0 && val <= 4) {
//       return '优'
//     } else if (val > 4 && val <= 6) {
//       return '良'
//     } else if (val > 6 && val <= 30) {
//       return '轻度污染'
//     } else if (val > 30 && val <= 100) {
//       return '中度污染'
//     } else if (val > 100 && val <= 250) {
//       return '重度污染'
//     } else {
//       return '严重污染'
//     }
//   } else {
//     return '----'
//   }
// }

export function co2Text(val) {
  if (val && val > 350) {
    if (val > 350 && val <= 450) {
      return '正常'
    } else if (val > 450 && val <= 1000) {
      return '较正常'
    } else if (val > 1000 && val <= 2000) {
      return '较浑浊'
    } else if (val > 2000 && this.deviceAttrs.co2 <= 5000) {
      return '浑浊'
    } else {
      return '过于浑浊'
    }
  } else {
    return '----'
  }
}
