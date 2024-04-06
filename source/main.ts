import 'colors'
import Env from './structures/Env.struct'

export default class Mozz {
    pid: number = process.pid
    env: Env = new Env()

    constructor() {
        this.env.config()
    }
}
