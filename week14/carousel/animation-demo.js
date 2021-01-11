import { Timeline, Animation } from './animation.js'
import { ease } from './ease.js'

let tl = new Timeline()

tl.start()
tl.add(new Animation(document.querySelector('#el').style, "transform", 0, 500, 2000, 0, ease, v => `translateX(${v}px)`))
document.querySelector('#el2').style.transition = 'transform 2s ease'
document.querySelector('#el2').style.transform = 'translateX(500px)'

document.querySelector('#pause').addEventListener('click', () => {
    tl.pause()
})

document.querySelector('#resume').addEventListener('click', () => {
    tl.resume()
})