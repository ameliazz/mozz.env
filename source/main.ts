import 'colors'
import Env from './structures/Env.struct'

export default class Mozz {
    pid: number = process.pid
    env: Env = new Env()

    constructor() {
        this.env.config()
    }

    switch(environment: string) {
        if (!this.env.MOZZ_SETTINGS.allowEnvSwitch) {
            throw new Error(
                `You cannot switch environments. ${
                    'allowEnvSwitch'.cyan
                } option is disabled`
            )
        }

        return this.env.config(environment)
    }
}
