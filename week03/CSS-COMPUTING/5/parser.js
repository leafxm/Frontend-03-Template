const css = require('css')
const EOF = Symbol('EOF') // EOF:  End of File
let currentToken = null
let currentAttribute = null
let stack = [{ type: 'document', children: []}]
let currentTextNode = null

let rules = [] // css规则暂存于数组
function addCSSRules(text) {
    var ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}

function match(element, selector) { // 假设seletor都是简单选择器
    if (!selector || !element.attributes) {
        return false
    }
    if (selector.charAt(0) === '#') { // 匹配id选择器
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', ''))
            return true
    } else if (selector.charAt(0) === '.') { // 匹配class选择器
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', ''))
            return true
    } else { // 匹配tagName选择器
        if (element.tagName === selector) {
            return true
        }
    }
    return false

}

function computeCSS(element) {
    var elements = stack.slice().reverse() // slice用于复制数组，reverse因为标签匹配是从右向左
    if (!element.computedStyle) {
        element.computedStyle = {}
    }
    for(let rule of rules) {
        var selectorParts = rule.selectors[0].split(' ').reverse()
        if (!match(element, selectorParts[0])) {
            continue
        }
        let matched = false
        var j = 1
        for(var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length) {
            matched = true
        }
        if (matched) {
            // 如果匹配，需要加入
            console.log('Element', element, 'matched rule', rule)
        }

    }
}

function emit(token) {
    let top = stack[stack.length - 1] // 取出栈顶
    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName
        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCSS(element) // 计算CSS时机：startTag

        top.children.push(element)
        element.parent = top

        if (!token.isSelfClosing) { // 自封闭不必入栈
            stack.push(element)
        }
        currentTextNode = null 
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error('Tag start end doesnt\' match!')
        } else {
            //+++++遇到style标签时，执行添加CSS规则的操作+++++//
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop()
        }
        currentTextNode = null
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

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

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) { // 结束
        return afterAttributeName(c)
    } else if (c === '=') {
        
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {

    } else if (c === '"' || c === "'" || c === '<') {

    } else {
        currentAttribute.name += c
        return attributeName
    }
}



function afterAttributeName(c) { // 完整属性结束
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '"') {
        return doubleQuotedAttributeValue
    } else if (c === "'") { 
        return singleQuotedAttributeValue
    } else if (c === '>') {

    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}
function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '"' || c === "'" || c === '<' || c === "=" || c === "`") {
       
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        emit(currentToken)
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
    console.log(stack)
    return stack[0]
}