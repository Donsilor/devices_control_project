export const MODE_OPTIONS = {
    mix: {
        text: '混合',
        temperature: {
            options: [0,1,2,3],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cotton: {
        text: '棉麻',
        temperature: {
            options: [0,1,2,3,4,5],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    synthetic: {
        text: '化纤',
        temperature: {
            options: [0,1,2,3,4,],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cardigan: {
        text: '羊毛衫',
        temperature: {
            options: [0,1,2,3],
            default: 0
        },
        drying: {
            options: [],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    down_coat: {
        text: '羽绒服',
        temperature: {
            options: [0,1,2,3],
            default: 2
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    baby_clothes: {
        text: '婴儿服',
        temperature: {
            options: [0,1,2,3,4],
            default: 2
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    underwear: {
        text: '内衣',
        temperature: {
            options: [0,1,2,3],
            default: 3
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    cowboy_suit: {
        text: '牛仔',
        temperature: {
            options: [0,1,2,3],
            default: 2
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    rinse_spin: {
        text: '漂洗+脱水',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    spin: {
        text: '单脱水',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    strong_wash: {
        text: '强力洗',
        temperature: {
            options: [0,1,2,3,4],
            default: 3
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    high_speed_15m: {
        text: '极速15',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [0,1,2,3],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    antimite: {
        text: '除螨',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    odor_removal: {
        text: '除味',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [4],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    speed_wash_drying: {
        text: '快速洗烘',
        temperature: {
            options: [0],
            default: 0
        },
        drying: {
            options: [1],
            default: 0
        },
        detergent: {
            options: [0,1,2],
            default: 0
        }
    },
    normal_drying: {
        text: '标准烘干',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [1,2,3],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    only_drying: {
        text: '单烘干',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [1,2,3],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
    normal_drying: {
        text: '单烘干',
        temperature: {
            options: [],
            default: 0
        },
        drying: {
            options: [1,2,3],
            default: 0
        },
        detergent: {
            options: [],
            default: 0
        }
    },
}

export const RESERVE_TIME_OPTIONS = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

export const TEMPERATURE_OPTIONS = [
    {value: '0', text:'冷洗'},
    {value: '20', text:'20℃'},
    {value: '30', text:'30℃'},
    {value: '40', text:'40℃'},
    {value: '60', text:'60℃'},
    {value: '95', text:'95℃'},
]

export const DRY_OPTIONS = [
    {value: 'no_drying', text: '不烘干'},
    {value: 'normal_drying', text: '标准'},
    {value: 'strong_drying', text: '特干'},
    {value: 'air_drying', text: '晾干'},
    // {value: 'time_drying', text: '定时'},
    {value: 'timer', text: '定时'},
]

export const DETERGENT_OPTIONS = [
    {value: 'non_condensed', text: '非浓缩'},
    {value: 'condensed', text: '浓缩'},
    {value: 'non_auto', text: '非自动'}
]

export const OPERATION_OPTIONS = {
    none: '无操作',
    reserve: '预约等待',
    'pre-wash': '预洗',
    wash: '主洗',
    rinse: '漂洗',
    spin: '脱水',
    drying: '烘干',
    finish: '完成'
}

export const ERROR_CODE = {
    'E1': '请检查是否打开水龙头、水压过低或停水。若仍出现此警报，请联系维修人员4006-999999。',
    'E2': '请检查排水管是否堵塞或弯折。若仍出现此警报，请联系维修人员4006-999999。',
    'E3': '请检查洗衣机上盖是否正常关闭。若仍出现此警报，请联系维修人员4006-999999。',
    'E4': '请自动排水至洗涤水位后再运行。若仍出现此警报，请断水断电并联系维修人员4006-999999。',
    'nSP': '请先将衣物抖散或适当增加衣物后，重新启动烘干程序。若仍出现此警报，请联系维修人员4006-999999。',
    'EP': '请将旋钮转动至之前运行的程序。'
}

export const DEFAULT_ERROR_MSG = '请关机并联系售后维修人员4006-999999。'
