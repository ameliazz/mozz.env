export default function ParseEnvValue(input: string | number | boolean) {
    if (typeof input == 'string') {
        const match = input.match(/\$(.*)\((.*)\)/)

        if (Array(match?.[2])?.length <= 0) {
            return input
        }

        switch (match?.[1]) {
            case 'env':
                const args = match[2].split(',')

                const envValue = process.env[args[0].slice(1).slice(0, -1)]
                const defaultValue = args[1]

                return normalizeValue(
                    String(
                        match.input?.replace(match[0], envValue || defaultValue)
                    )
                )

            default:
                return input
        }
    }

    return input
}

export const normalizeValue = (input: string) => {
    if (typeof input != 'string') return undefined

    return input.startsWith("'") || input.startsWith('"')
        ? String(input.slice(1).slice(0, -1))
        : isNaN(Number(input))
        ? typeof input == 'string'
            ? String(input)
            : Boolean(input)
        : Number(input)
}
