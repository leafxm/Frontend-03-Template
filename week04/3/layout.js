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

    var isAutoMainSize = false // 子元素撑开主轴尺寸
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item) // 老师代码漏了这行
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] += itemStyle[mainSize]
            }
        }
        isAutoMainSize = true
    }

    var flexLine = []
    var flexLines = [flexLine]

    var mainSpace = elementStyle[mainSize]
    var crossSpace = 0

    for (let i = 0; i < items.length; i++) {
        var item = items[i]
        var itemStyle = getStyle(item)

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0
        }

        if (itemStyle.flex) { // 子元素可伸缩，一定能放进这行
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 父元素主轴尺寸由子元素决定
            mainSpace -= itemStyle[mainSize] // 父元素剩余主轴尺寸
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]) // 父元素交叉轴尺寸为最大的子元素交叉轴尺寸
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize] // 不能超过父元素主轴尺寸
            }
            if (mainSpace < itemStyle[mainSize]) { // 剩余空间不足子元素使用，换行
                flexLine.mainSpace = mainSpace 
                flexLine.crossSpace = crossSpace
                flexLine = [item] // 创建新行
                flexLines.push(flexLine)
                mainSpace = style[mainSize]
                crossSpace = 0
            } else {
                flexLine.push(item)
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]) // 父元素交叉轴尺寸为最大的子元素交叉轴尺寸
            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace
    
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace
    }

    if (mainSpace < 0) { // 等比压缩
        // 单行
        var scale = style[mainSize] / (style[mainSize] - mainSize)
        var currentMain = mainBase // 当前排到的位置
        for (let i = 0; i < items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item)

            if (itemStyle.flex) { // flex不参加等比压缩
                itemStyle[mainSize] = 0
            }

            itemStyle[mainStart] = itemStyle[mainSize] * scale
            // 计算压缩后的位置
            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]
        }
    } else {
        // 多行
        flexLines.forEach(function (items) {
            var mainSpace = items.mainSpace
            var flexTotal = 0
            for (var i = 0; i< items.length; i++) {
                var item = items[i]
                var itemStyle = getStyle(item)

                if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex
                    continue
                }
            }

            if (flexTotal > 0) {
                // 有flex元素
                var currentMain = mainBase
                for (let i = 0; i < items.length ; i++) {
                    var item = items[i]
                    var itemStyle = getStyle(item)

                    // mainSpace均匀分给每个flex
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
        
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd]
                }
            } else {
                // 没有flex元素，justifyContent should work
                if (style.justifyContent === 'flex-start') {
                    var currentMain = mainBase
                    var step = 0
                }
                else if (style.justifyContent === 'flex-end') {
                    var currentMain = mainSpace * mainSign + mainBase
                    var step = 0
                }
                else if (style.justifyContent === 'center') {
                    var currentMain = mainSpace / 2 * mainSign + mainBase
                    var step = 0
                }
                else if (style.justifyContent === 'space-between') { // 每个元素有间隔
                    var step = mainSpace / (items.length - 1) * mainSign
                    var currentMain = mainBase
                }
                else if (style.justifyContent === 'space-around') { // 每个元素有间隔
                    var step = mainSpace / items.length * mainSign
                    var currentMain = step / 2 + mainBase
                }
                for (let i = 0; i < items.length; i++) {
                    var item = items[i]
                    var itemStyle = getStyle(item)
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd] + step
                }
            }
        })
    }
}

module.exports = layout