import './style.css'
import * as three from 'three';

class Site {
    constructor() {
        this.time = 0
        this.render()
    }
    render() {
        this.time++
        console.log(this.time)
        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Site()