/* eslint-disable*/
export function modeType(type) {
  switch(type) {
    case 'idle':
      return '空闲模式'
      break;
    case 'plan_clean':
      return '规划清扫'
      break;
    case 'edge_clean':
      return '沿边清扫'
      break;
    case 'design_clean':
      return '定点清扫'
      break;
    case 'mop':
      return '拖地模式'
      break;
    case 'recharge':
      return '回充模式'
      break;
    case 'manual_control':
      return '手动控制'
      break;
    case 'single_plan':
      return '单间规划'
      break; 
  } 
}

export function statusType(type) {
  switch(type) {
    case 'working':
      return '工作中'
      break;
    case 'standby':
      return '待机'
      break;
    case 'fault':
      return '故障'
      break;
    case 'hibernation':
      return '休眠'
      break;
    case 'work_completed':
      return '工作完成'
      break;
    case 'charging':
      return '充电'
      break;
    case 'charge_completed':
      return '充电完成'
      break;
  } 
}