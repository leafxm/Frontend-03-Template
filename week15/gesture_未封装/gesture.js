let element = document.documentElement

let isListeningMouse = false

element.addEventListener('mousedown', event => {
    let context = Object.create(null)
    // 移位兼容move的buttons
    contexts.set('mouse'+(1 << event.button), context) 
    start(event, context)
    let mousemove = e => {
        let button = 1
        while(button <= e.buttons) {
            if (button & e.buttons) { // 按位与
                // 中键右键的顺序不一样
                if (button === 2) {
                    key = 4
                }else if (button === 2) {
                    key = 2
                } else {
                    key = button
                }

                let context = contexts.get('mouse'+key)
                move(e, context)
            } 
            button = button << 1
        }
    }
    let mouseup = e => {
        const context = contexts.get('mouse'+(1 << e.button)) 
        end(e, context)
        contexts.delete('mouse'+(1 << e.button)) 
        if (!e.buttons === 0) {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
            isListeningMouse = false
        } 
    }
    if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
        isListeningMouse = true
    }
})
let contexts = new Map()
element.addEventListener('touchstart', event => {
    for(let touch of event.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context)
        start(touch, context)
    }
})
element.addEventListener('touchmove', event => {
    for(let touch of event.changedTouches) {
        const context = contexts.get(touch.identifier)
        move(touch, context)
    }
})
element.addEventListener('touchend', event => {
    for(let touch of event.changedTouches) {
       const context = contexts.get(touch.identifier)
       end(touch, context)
       contexts.delete(touch.identifier)
    }
})
element.addEventListener('touchcancel', event => {
    for(let touch of event.changedTouches) {
        const context = contexts.get(touch.identifier)
        cancel(touch, context)
        contexts.delete(touch.identifier)
    }
})

let start = (point, context) => {
    // console.log('start', point.clientX, point.clientY)
    context.startX = point.clientX, context.startY = point.clientY
    context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    }]

    context.isPan = false
    context.isTap = true
    context.isPress = false
    context.handler = setTimeout(() => {
        dispatch('press', {})
        context.isPan = false
        context.isTap = false
        context.isPress = true
        context.handler = null
    }, 500)
}
let move = (point, context) => {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY
    if (dx ** 2 + dy ** 2 > 100 ) { // 移动10px
        context.isPan = true
        context.isTap = false
        context.isPress = false
        clearTimeout(context.handler)
    }
    if (context.isPan) {
        dispatch('pan', {dx, dy})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    })
    // console.log('move', point.clientX, point.clientY) 
}
let end = (point, context) => {
    if (context.isTap) {
        dispatch('tap', {})
        clearTimeout(context.handler)
    }
    if (context.isPress) {
        dispatch('pressend', {})
    }
    if (context.isPan) {
        dispatch('panend', {})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    let d, v
    if (!context.points.length) {
        v = 0
    } else {
        d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
        (point.clientY - context.points[0].y) ** 2)
        v = d / (Date.now() - context.points[0].t) // 离开时的速度
    }

    if (v > 1.5) {
        context.isFlick = true
    } else {
        context.isFlick =  false
    }
    
    // console.log('end', point.clientX, point.clientY) 
}
let cancel = (point) => {
    clearTimeout(context.handler)
    // console.log('cancel', point.clientX, point.clientY)

}

function dispatch(type, properties) {
    let event = new Event(type)
    for(let name in properties) {
        event[name] = properties[name]
    }
    element.dispatchEvent(event)
}