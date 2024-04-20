export default function ParseEnvValue(input: string | number | boolean) {
    if (typeof input == 'string') {
        const match = input.match(/\$(.*)\(['"](.*)['"]\)/)

        switch (match?.[1]) {
            case 'env':
                return process.env[match?.[2]]

            default:
                return input
        }
    }

    return input
}
