import { Component, STATE, ATTRIBUTE } from './framework.js'
import { enableGesture } from './gesture.js'
import { Timeline, Animation } from './animation.js'
import { ease } from './ease.js'

export { STATE, ATTRIBUTE } from './framework.js'

export class Carousel extends Component {
    constructor() {
        super()
    }
   
    render() {
        this.root = document.createElement('div')
        this.root.classList.add('carousel')
        for(let record of this[ATTRIBUTE].src) {
            let child = document.createElement('div')
            child.style.backgroundImage = `url('${record.img}')`
            this.root.appendChild(child)
        }
        enableGesture(this.root)
        let timeline = new Timeline
        timeline.start()

        let handler = null
        
        let { children } = this.root
        this[STATE].position = 0

        let t = 0
        let ax = 0

        const animationDur = 500
       
        // 触摸的时候时间线需要停下
        this.root.addEventListener('start', e => {
            timeline.pause()
            clearInterval(handler)
            if (t > 0) {
                let progress = (Date.now() - t) / animationDur
                ax = ease(progress) * 500 - 500
            }
        })

        this.root.addEventListener('tap', e => {
           this.triggerEvent('click', { 
               data: this[ATTRIBUTE].src[this[STATE].position],
               position: this[STATE].position
            })
        })

        this.root.addEventListener('pan', e => {
            let x = e.clientX - e.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length
                let child = children[pos]
                child.style.transition = 'none'
                child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
            }
        })

        this.root.addEventListener('end', e => {
            timeline.reset()
            timeline.start()
            handler = setInterval(nextPicture, 3000)

            let x = e.clientX - e.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)

            let direction = Math.round((x % 500) / 500)

            if (e.isFlick) {
                if (e.velocity < 0) {
                    direction = Math.ceil((x % 500)  / 500)
                } else {
                    direction = Math.floor((x % 500)  / 500)
                }
            }
            
            for (let offset of [-1, 0 ,1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                let child = children[pos]
                timeline.add(new Animation(child.style, 'transform',
                -pos * 500 + offset * 500 + x % 500,
                -pos * 500 +offset * 500 + direction * 500,
                animationDur, 0 , ease, v => `translateX(${v}px)`))           
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
            this.triggerEvent('change', { position: this[STATE].position })
        })
       
        let nextPicture = () => {
            let children = this.root.children
            let nextPosition  = (this[STATE].position + 1) % children.length
    
            let current = children[this[STATE].position]
            let next = children[nextPosition]

            t = Date.now()

            timeline.add(new Animation(current.style, 'transform',
                - this[STATE].position * 500, - 500 - this[STATE].position * 500, animationDur, 0 , ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, 'transform', 
               500 - nextPosition * 500, - nextPosition * 500, animationDur, 0 , ease, v => `translateX(${v}px)`))
            
            this.triggerEvent('change', { position: this[STATE].position })
            this[STATE].position = nextPosition
        }
       
        handler = setInterval(nextPicture, 3000)

        return  this.root
    }
}
