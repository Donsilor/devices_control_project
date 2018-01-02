import SDK from './sdk/src'

if(process.env.NODE_ENV === 'development'){
    SDK.debug = true
}
window.HdSmart = SDK
