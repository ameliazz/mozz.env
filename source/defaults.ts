import Package from '../package.json'

export default {
    applicationConfigFilename: 'mozz.profile.json',
    version: Package.version,
    settings: {
        allowEnvSwitch: true,
    },
}
