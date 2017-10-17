
export default {
    $init(){
        window.HdIot = {
            Device: {},
            UI: {},
            Util: {}
        }
    },
    $on(method, callback){
        let names = method.split('.')
        names.reduce((fn, method, index)=>{
            if(!fn[method]){
                fn[method] = {}
            }
            if(index === names.length-1){
                fn[method] = function(options){
                    var next = function(response){
                        options.onListener(JSON.stringify(response))
                    }
                    callback(JSON.parse(options.data), next)
                }
            }
            return fn[method]
        }, HdIot)
    }
}
