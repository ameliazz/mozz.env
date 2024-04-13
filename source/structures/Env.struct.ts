import { existsSync, readFileSync } from 'fs'
import DotEnv from 'dotenv'

import TOML from 'toml'
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
    NAME = String(process.env['MOZZ_ENV'])
    MOZZ_VERSION = defaults.version

    config(environment?: string) {
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

        this.NAME = String(environment || process.env['MOZZ_ENV'])
        const MozzConfig =
            RawMozzObject.environments[
                (environment ||
                    process.env['MOZZ_ENV']) as keyof MozzProfileObjectTypes
            ]

        if (Object(MozzConfig).length >= 1 || !MozzConfig) {
            throw new Error(
                `Mozz "${
                    String(this.MOZZ_ENV).cyan
                }" environment doesn't exists`
            )
        }

        process.env['MOZZ_VERSION'] = this.MOZZ_VERSION
        if (
            MozzConfig['@mozz:dotenv'] &&
            typeof MozzConfig['@mozz:dotenv'] == 'string'
        ) {
            DotEnv.config({
                path: `${process.cwd()}/${MozzConfig['@mozz:dotenv']}`,
                override: true,
            })
        }

        if (
            MozzConfig['@mozz:config_file'] &&
            typeof MozzConfig['@mozz:config_file'] == 'string'
        ) {
            const splittedFilename = String(
                MozzConfig['@mozz:config_file']
            ).split('.')
            const fileType = splittedFilename[splittedFilename.length - 1]
            const fileContent = readFileSync(
                `${process.cwd()}/${MozzConfig['@mozz:config_file']}`,
                'utf-8'
            )

            switch (fileType.toLowerCase()) {
                case 'json':
                    const ConfigObjectJSONParsed = JSON.parse(fileContent)
                    for (const item in ConfigObjectJSONParsed) {
                        this[item] = ConfigObjectJSONParsed[item]
                    }

                    break

                case 'toml':
                    const ConfigObjectTOMLParsed = TOML.parse(fileContent)
                    for (const item in ConfigObjectTOMLParsed) {
                        this[item] = ConfigObjectTOMLParsed[item]
                    }

                    break

                default:
                    for (const item in MozzConfig) {
                        this[item] = MozzConfig[item]
                    }
            }
        } else {
            for (const item in MozzConfig) {
                this[item] = MozzConfig[item]
            }
        }

        return true
    }
}
