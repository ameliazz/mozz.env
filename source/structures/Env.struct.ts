import { existsSync, readFileSync } from 'fs'
import DotEnv from 'dotenv'

import defaults from '../defaults'
DotEnv.config()

if (!process.env['MOZZ_ENV']) {
    throw new Error(`Mozz environment is not defined`)
}

type MozzProfileObjectTypes = {
    environments: {
        [Env: string]: {
            [property: string]: number | boolean | string
        }
    }
}

export default class Env {
    [key: string]: unknown
    ENV_NAME = String(process.env['MOZZ_ENV'])
    MOZZ_VERSION = defaults.version

    config() {
        if (
            !existsSync(
                `${process.cwd()}/${defaults.applicationConfigFilename}`
            )
        ) {
            throw new Error(
                `If you're using ${'Mozz'.yellow} with your ${
                    'workspace enhancer'.yellow
                } you need to setup \`${
                    defaults.applicationConfigFilename
                }\` file.`
            )
        }

        const RawMozzObject: MozzProfileObjectTypes = JSON.parse(
            readFileSync(
                `${process.cwd()}/${defaults.applicationConfigFilename}`,
                {
                    encoding: 'utf-8',
                }
            )
        )

        const MozzConfig =
            RawMozzObject.environments[
                process.env['MOZZ_ENV'] as keyof MozzProfileObjectTypes
            ]

        if (Object(MozzConfig).length >= 1 || !MozzConfig) {
            throw new Error(
                `Mozz "${
                    String(this.MOZZ_ENV).cyan
                }" environment doesn't exists`
            )
        }

        if (MozzConfig['@file']) {
            DotEnv.config({
                path: `${process.cwd()}/${MozzConfig['@file']}`,
                override: true,
            })
        }

        process.env['MOZZ_VERSION'] = this.MOZZ_VERSION
        for (const item in MozzConfig) {
            this[item] = MozzConfig[item]
        }

        return true
    }
}
