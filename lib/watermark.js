function appendCss(css) {
    var style = document.getElementById('watermark_css')

    if (!style) {
        style = document.createElement('style')
        style.type = 'text/css'
        style.id = 'watermark_css'
        document.getElementsByTagName('head')[0].appendChild(style)
    }

    style.appendChild(document.createTextNode(css))
}


export default function createWaterMark(options){

    options = options || {}
    var el = options.el || 'body'
    var text = options.text || window.user_id || '1234'
    var color = options.color || '#ccc'

    var canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    canvas.width = 180
    canvas.height = 120
    canvas.style.cssText = 'position:absolute;top:-9999px;left:-9999px;'

    var ctx = canvas.getContext("2d")
    ctx.rotate(-25*Math.PI/180)
    ctx.font = "30px Courier New"
    ctx.fillStyle = color
    ctx.fillText(text, -10, 100)
    var watermarkImage = canvas.toDataURL("image/png")
    //el.style.backgroundImage = "url("+ image +")"
    var cssStr = `${el}{background-image:url(${watermarkImage})}`
    appendCss(cssStr)
}
