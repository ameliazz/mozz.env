#!/usr/bin/env node

const { writeFileSync, existsSync } = require('fs')
const Mozz = require('mozz.env')

const Enhancer = new Mozz.default()
const interfaceBody = `interface EnvironmentEnhancer { <CONTENT> }`

const generateDataTypes = async (obj) => {
    const variables = Object.entries(obj)
    const response = []

    for (const dataSet of variables) {
        const type = typeof dataSet[1]

        if (type == 'object') {
            response.push(
                `"${dataSet[0]}":{${await generateDataTypes(dataSet[1])}}`
            )
        } else {
            response.push(`"${dataSet[0]}":${type}`)
        }
    }

    return response
}

const generateDefinitionFile = async (obj) => {
    const dataSetTypes = await generateDataTypes(obj)

    const rawDefinitionFile = `import 'colors';\n${interfaceBody.replace(
        /<CONTENT>/,
        dataSetTypes.join(',')
    )}\nexport default class Mozz {#private;pid:number;env:EnvironmentEnhancer;constructor()}`

    return rawDefinitionFile
}

const normalizeValue = (input) => {
    if (typeof input != 'string') return undefined
    return input.startsWith("'") || input.startsWith('"')
        ? String(input.slice(1).slice(0, -1))
        : isNaN(Number(input))
        ? typeof input == 'string'
            ? String(input)
            : Boolean(input)
        : Number(input)
}

;(async () => {
    const rawArgv = process.argv.slice(2)
    const input = {
        command: rawArgv[0],
        args: Object.fromEntries(
            rawArgv.slice(1).map((arg) => {
                const splittedArg = arg.split('=')
                return [
                    splittedArg[0],
                    splittedArg.length >= 2
                        ? normalizeValue(splittedArg[1])
                        : true,
                ]
            })
        ),
    }

    switch (input.command) {
        case 'generate':
            console.time(`\n${'  ~  '.bgGreen} `)

            const rawFileCode = await generateDefinitionFile(Enhancer.env)

            if (
                input.args.dev == true &&
                existsSync(`${process.cwd()}/dist/main.d.ts`)
            ) {
                writeFileSync(`${process.cwd()}/dist/main.d.ts`, rawFileCode)
            } else {
                writeFileSync(
                    `${process.cwd()}/node_modules/mozz.env/dist/main.d.ts`,
                    rawFileCode
                )
            }

            console.timeLog(
                `\n${'  ~  '.bgGreen} `,
                `\n${'+------------'.blue} ${'🍃 Mozz.Env'.green} ${
                    `(v${Enhancer.env.MOZZ_VERSION})`.gray.italic
                } ${'------------+'.blue}\n${
                    '  ~  '.bgBlue
                } : Successfully generated types.`
            )

            break

        default:
            console.log(
                `\n${'+------------'.blue} ${'🍃 Mozz.Env'.green} ${
                    `(v${Enhancer.env.MOZZ_VERSION})`.gray.italic
                } ${
                    '------------+'.blue
                }\ngenerate - Generate types of your MP (Mozz Profile) | ${
                    '--dev'.gray
                }\n`
            )
            break
    }
})()
