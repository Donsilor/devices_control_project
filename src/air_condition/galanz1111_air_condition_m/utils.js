export default {
    // debounce(action, idle) {
    //     var last
    //     return function() {
    //         var ctx = this,
    //             args = arguments
    //         clearTimeout(last)
    //         last = setTimeout(function() {
    //             action.apply(ctx, args)
    //         }, idle)
    //     }
    // },
    // //防抖(立即执行)
    // debounce(fn,wait){
    //   var timerId = null
    //   var flag = true
    //   return function(){
    //     clearTimeout(timerId)
    //     if(flag){
    //       fn.apply(this,arguments)
    //       flag = false
    //       }
    //     timerId = setTimeout(() => { flag = true},wait)
    //   }
    // }

    //防抖(非立即执行)
      debounce(fn,wait){
        var timerId = null
        return function(){
          clearTimeout(timerId)
          timerId = setTimeout(() => {
            fn.apply(this,arguments)
          },wait)
        }
      }

    // 只执行最后一次
    // debounce(func,wait){
    //   let timer
    //   return ()=> {
    //     clearTimeout(timer)
    //     timer = setTimeout(func,wait)
    //   }
    // }
}
