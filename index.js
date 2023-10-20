$(function ($) {
    const wrap = $('.wrap')
    const dots = $('.dot')
    const p = $('.positions span')
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    // 贝塞尔曲线起始点
    let sx = 50, sy = 50;
    // 控制点
    let cp1x = 200, cp1y = 30, cp2x = 50, cp2y = 200;
    // 结束点
    let x = 300, y = 300;
    // 以上点的尺寸
    let w = 4, h = 4;
    // 字号大小
    const fontSize = 12
    // 文本字体样式
    const font = `${fontSize}px serif`
    // 贝塞尔相关的颜色
    const color1 = 'blue'
    const color2 = 'green'
    const color3 = 'red'
    const color4 = 'pink'
    const color5 = '#dbdbdb'
    // 鼠标位置 1-起始点 2-控制点1 3-控制点2 4-结束点 0-不在以上任何点
    let pointerPosition = 0
    // 鼠标在画布中的坐标
    let pointerX = 0
    let pointerY = 0
    // wrap与页面的距离
    const wrapX = wrap.offset().left
    const wrapY = wrap.offset().top
    // 是否要进行拖动操作，用于拖动点位
    let isDragging = false

    // 初始化画布
    const initCanvas = () => {
        // 设置画布的宽高
        canvas.width = wrap.width()
        canvas.height = wrap.height()
        // 设置文本样式
        ctx.font = font
        ctx.textAlign = 'center'

        // 画出曲线的起始点，控制点，结束点
        ctx.fillStyle = color1
        ctx.fillRect(sx, sy, w, h)
        ctx.fillText(`s(${sx}, ${sy})`, sx, sy - 4)

        ctx.fillStyle = color2
        ctx.fillRect(cp1x, cp1y, w, h)
        ctx.fillRect(cp2x, cp2y, w, h)
        ctx.fillText(`cp1(${cp1x}, ${cp1y})`, cp1x, cp1y - 4)
        ctx.fillText(`cp2(${cp2x}, ${cp2y})`, cp2x, cp2y - 4)

        ctx.fillStyle = color3
        ctx.fillRect(x, y, w, h)
        ctx.fillText(`e(${x}, ${y})`, x, y + fontSize)

        // 画出曲线
        ctx.beginPath()
        ctx.strokeStyle = color4
        ctx.moveTo(sx, sy)
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        ctx.stroke()

        // 画出控制线
        ctx.strokeStyle = color5
        ctx.setLineDash([4, 2])

        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(cp1x, cp1y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(cp2x, cp2y)
        ctx.stroke()

        // 贝塞尔曲线当前点位
        p.text(`${cp1x}, ${cp1y}, ${cp2x}, ${cp2y}, ${x}, ${y}`)
    }

    // 监听鼠标坐标
    $('#canvas').mousemove(function (e) {
        pointerX = Math.floor(e.pageX - wrapX)
        pointerY = Math.floor(e.pageY - wrapY)
    })

    // 检查鼠标位置处于哪一个点
    const checkPointerPosition = (px, py) => {
        const path1 = new Path2D()
        path1.rect(sx, sy, w, h)
        if (ctx.isPointInPath(path1, px, py)) {
            pointerPosition = 1
            return
        }
        
        const path2 = new Path2D()
        path2.rect(cp1x, cp1y, w, h)
        if (ctx.isPointInPath(path2, px, py)) {
            pointerPosition = 2
            return
        }
        
        const path3 = new Path2D()
        path3.rect(cp2x, cp2y, w, h)
        if (ctx.isPointInPath(path3, px, py)) {
            pointerPosition = 3
            return
        }
        
        const path4 = new Path2D()
        path4.rect(x, y, w, h)
        if (ctx.isPointInPath(path4, px, py)) {
            pointerPosition = 4
            return
        }

        pointerPosition = 0
    }

    // 鼠标按下时的操作
    $('#canvas').mousedown(function (e) {
        pointerX = Math.floor(e.pageX - wrapX)
        pointerY = Math.floor(e.pageY - wrapY)
        checkPointerPosition(pointerX, pointerY)
        if (pointerPosition) {
            $(this).css('cursor', 'move')
        }
        isDragging = true
    })

    // 鼠标拖动点位时的操作
    $('#canvas').on('mousemove', function (e) {
        pointerX = Math.floor(e.pageX - wrapX)
        pointerY = Math.floor(e.pageY - wrapY)

        if (isDragging && pointerPosition) {
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // 更新点位坐标
            switch (pointerPosition) {
                case 1:
                    sx = pointerX
                    sy = pointerY
                    break
                case 2:
                    cp1x = pointerX
                    cp1y = pointerY
                    break
                case 3:
                    cp2x = pointerX
                    cp2y = pointerY
                    break
                case 4:
                    x = pointerX
                    y = pointerY
                    break
                default:
                    break
            }

            initCanvas()
        }
    })

    // 鼠标抬起时的操作
    $('#canvas').mouseup(function (e) {
        $(this).css('cursor', 'default')
        isDragging = false
    })

    initCanvas()
})