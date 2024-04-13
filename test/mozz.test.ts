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
        'Switch Mozz environment and get one variable'
    )
})
