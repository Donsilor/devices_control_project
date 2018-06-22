export const WARN_CODE = {
    e0: { msg: "门未关好!", switch: false },
    e1: { msg: "智能门锁电池电量不足，请及时更换电池！", switch: false },
    e2: { msg: "密码错误超过限制，请1分钟后再试", switch: true },
    e3: { msg: "有人强行拆门锁！", switch: false },
    e4: { msg: "家庭成员触发被挟持报警！", switch: false },
    e5: { msg: "门锁已被锁死，无法手机开锁", switch: true },
    e6: { msg: "门锁已被反锁，无法手机开锁", switch: true },
    e7: { msg: "密码错误超过限制，无法远程开锁", switch: true }
};

export const OPEN_TYPE = {
    "17": "密码开锁",
    "18": "指纹开锁",
    "19": "IC卡开锁",
    "20": "钥匙开门",
    "21": "手机App开锁"
};
