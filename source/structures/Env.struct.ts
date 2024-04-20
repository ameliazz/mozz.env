import { existsSync, readFileSync } from 'fs'
import TOML from 'toml'

import defaults from '../defaults'
import DotEnv from 'dotenv'
import ParseEnvValue from 'utils/Parse.util'
DotEnv.config()

if (!process.env['MOZZ_ENV']) {
    throw new Error(`Mozz environment is not defined`)
}

type MozzProfileSettingsType = {
    allowEnvSwitch: boolean
}

interface MozzProfileObjectType {
    settings: MozzProfileSettingsType
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
    MOZZ_SETTINGS: MozzProfileSettingsType

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

        const RawMozzObject: MozzProfileObjectType = JSON.parse(
            readFileSync(
                `${process.cwd()}/${defaults.applicationConfigFilename}`,
                {
                    encoding: 'utf-8',
                }
            )
        )

        this.NAME = String(environment || process.env['MOZZ_ENV'])
        this.MOZZ_SETTINGS = Object.assign(
            Object(RawMozzObject.settings),
            defaults.settings
        )

        const MozzConfig =
            RawMozzObject.environments[
                (environment ||
                    process.env['MOZZ_ENV']) as keyof MozzProfileObjectType
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

            let ParsedConfigFileData: Object = {}

            switch (fileType.toLowerCase()) {
                case 'json':
                    ParsedConfigFileData = JSON.parse(fileContent)
                    break

                case 'toml':
                    ParsedConfigFileData = TOML.parse(fileContent)
                    break

                default:
                    ParsedConfigFileData = MozzConfig
            }

            for (const item in ParsedConfigFileData) {
                this[item] = ParseEnvValue(
                    ParsedConfigFileData[item as keyof object]
                )
            }
        } else {
            for (const item in MozzConfig) {
                this[item] = MozzConfig[item]
            }
        }

        return true
    }
}
