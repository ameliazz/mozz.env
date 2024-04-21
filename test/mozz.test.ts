import { assert, describe, test } from 'poku'
import Mozz from '../source/main'

const Enhancer = new Mozz()

describe('Testing Mozz enhance')
test(() => {
    assert.equal(
        Enhancer.env.awesomeVariable,
        true,
        'Get a variable from Mozz environment'
    )
})

test(() => {
    Enhancer.switch('json_test')

    assert.equal(
        Enhancer.env.anotherAwesomeEnvVariable,
        2024,
        'Switch Mozz environment to ' +
            'json_test'.yellow +
            ' and get one variable'.green
    )
})

test(() => {
    Enhancer.switch('yaml_test')

    assert.equal(
        Enhancer.env.awesomeTestVariable,
        8080,
        'Switch Mozz environment to ' +
            'yaml_test'.magenta +
            ' and get one variable'.green
    )
})

describe('Testing Mozz error handle')
assert.throws(() => {
    Enhancer.switch('nonexistent_environment')
}, 'Switch to a non-existent environment (Expects error)')
