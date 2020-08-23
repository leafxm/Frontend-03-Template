function getStyle(element) {
    if (!element.style) {
        element.style = {} // 保存计算出来的属性
    }
    for (prop in element.computedStyle) {
        var propValue = element.computedStyle[prop].value
        element.style[prop] = propValue
        if (propValue.toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
        if (propValue.toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style
}

function layout(element) {
    if (!element.computedStyle) {
        return
    }
    var elementStyle = getStyle(element)
    if (elementStyle.display !== 'flex' ) {
        return
    }
    var items = element.children.filter(e => e.type === 'element') // 过滤文本节点

    items.sort(function (a, b) {
        return(a.order || 0) - (b.order || 0)
    })

    var style = elementStyle 

    // 处理主轴、交叉轴
    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '' ) {
            style[size] = null
        }
    })
    // 处理属性默认值
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row'
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap'
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'strech'
    }

    // 代替属性做计算的变量
    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase
    if (style.flexDirection === 'row') {
        mainSize = 'width' // 主轴尺寸，宽或高
        mainStart = 'left' // 从左到右布局
        mainEnd = 'right'
        mainSign = +1 
        mainBase = 0 // 初始值，和mainSign一对

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1
        mainBase = style.width

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1
        mainBase = 0

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1
        mainBase = style.height

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }

    // 处理交叉轴
    if (style.flexWrap === 'wrap-reverse') {
        var tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    } else {
        crossBase = 0
        crossSign = +1
    }

}

module.exports = layout