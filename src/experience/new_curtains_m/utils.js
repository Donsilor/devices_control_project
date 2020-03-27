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
    //防抖(立即执行)
    debounce(fn,wait){
      var timerId = null
      var flag = true
      return function(){
        clearTimeout(timerId)
        if(flag){
          fn.apply(this,arguments)
          flag = false
          }
        timerId = setTimeout(() => { flag = true},wait)
      }
    }

}
