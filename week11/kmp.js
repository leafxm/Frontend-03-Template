function kmp(source, pattern) {
    // 计算跳转表格
    let table = new Array(pattern.length).fill(0)
    {
        let i= 1, j = 0
        while(i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                ++j, ++i;
                table[i] = j
            } else {
                if (j > 0) {
                    j = table[j]
                } else {
                    ++i // 什么也没匹配上
                }
                
            }
        }
        console.log(table)
    }
    // abcdabce
    // aabaaac

    // 匹配
    {
        let i = 0, j=0
        while(i < source.length) {
            if (pattern[j] === source[i]) {
                ++i, ++j
            } else {
                if (j > 0) {
                    j = table[j]
                } else {
                    ++i // 什么也没匹配上
                }
            }
            if (j === pattern.length) {
                return true
            }
        }
        return false;
    }
}

console.log(kmp('Hello', 'll'))
console.log(kmp('aabaabaaacx', 'aabaaac'))
console.log(kmp('aac', 'aac'))