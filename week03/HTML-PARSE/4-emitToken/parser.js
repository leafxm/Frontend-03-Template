let currentToken = null

function emit(token) {
    console.log(token)
}

const EOF = Symbol('EOF') // EOF:  End of File

function data(c) { // 初始状态
    if (c === '<') { // 标签开始标志
        return tagOpen
    } else if (c === EOF) { // 结束
        emit({
            type: 'EOF'
        })
        return
    } else { // 文本节点 
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if (c === '/') { // 结束标签
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) { // 开始或者自封闭标签
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return ;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) { // 结束标签寻找标签名
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') { // 报错

    } else if (c === EOF) { // 报错
        return
    } else {

    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') { // 自封闭标签
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c
        return tagName
    } else if (c === '>') { // 普通开始标签
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}

// 暂时不处理
function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '>') { // 结束
        return data
    } else if (c === '=') {
        return beforeAttributeName
    } else {
        return beforeAttributeName
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        crrentToken.isSelfClosing = true
        return data
    } else if (c === EOF) { // 报错

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html)
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF) // 强迫节点完成截止
}